import { ObjectId, type Filter } from "mongodb";
import { getDatabase } from "@/lib/mongodb";
import { clientPromise } from "@/lib/mongo";
import {
  COLLECTIONS,
  type DbUser,
  type DbAdminGuard,
  type DbAuditLog,
  type UserRole,
  type CustomerStatus,
} from "@/types";
import {
  NotFoundError,
  BadRequestError,
  ForbiddenError,
  ConflictError,
} from "@/server/auth/errors";
import { EmailOutboxService } from "./emailOutboxService";
import { escapeRegex } from "@/validators/regexHelper";

export class StaffService {
  /**
   * Invalidate all Better Auth sessions for a user across all devices.
   * Matches both ObjectId and String formats of userId.
   */
  private static async purgeUserSessions(userId: any, sessionClient?: any) {
    const db = await getDatabase();
    const sessionCol = db.collection("session");
    const options = sessionClient ? { session: sessionClient } : {};

    await sessionCol.deleteMany(
      {
        $or: [
          { userId: userId },
          { userId: userId.toString() },
          { userId: new ObjectId(String(userId)) },
        ],
      },
      options
    );
  }

  /**
   * List staff members (banking-staff and admin) with pagination, role filtering, and search.
   */
  static async listStaff(params: {
    role?: UserRole;
    status?: CustomerStatus;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const db = await getDatabase();
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(50, Math.max(1, params.limit || 10));
    const skip = (page - 1) * limit;

    const filter: Filter<DbUser> = {
      role: params.role ? params.role : { $in: ["banking-staff", "admin"] },
    };

    if (params.status) {
      filter.status = params.status;
    }

    if (params.search && params.search.trim()) {
      const escaped = escapeRegex(params.search.trim());
      filter.$or = [
        { name: { $regex: escaped, $options: "i" } },
        { email: { $regex: escaped, $options: "i" } },
      ];
    }

    const col = db.collection<DbUser>(COLLECTIONS.USER);
    const [total, items] = await Promise.all([
      col.countDocuments(filter),
      col
        .find(filter, {
          projection: {
            password: 0,
            transactionPin: 0,
          },
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
    ]);

    return {
      items: items.map((u) => ({
        _id: u._id?.toString(),
        name: u.name,
        email: u.email,
        role: u.role,
        status: u.status || "ACTIVE",
        emailVerified: u.emailVerified || false,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get single staff member details.
   */
  static async getStaffMember(userId: string) {
    const db = await getDatabase();
    if (!ObjectId.isValid(userId)) {
      throw new BadRequestError("Invalid user ID format.");
    }

    const user = await db.collection<DbUser>(COLLECTIONS.USER).findOne(
      {
        _id: new ObjectId(userId) as any,
        role: { $in: ["banking-staff", "admin"] },
      },
      {
        projection: {
          password: 0,
          transactionPin: 0,
        },
      }
    );

    if (!user) {
      throw new NotFoundError("Staff member not found.");
    }

    return {
      _id: user._id?.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status || "ACTIVE",
      emailVerified: user.emailVerified || false,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * Promote an existing customer to Banking Staff.
   * Business Rules:
   * 1. Candidate must exist in database.
   * 2. Candidate must be emailVerified: true.
   * 3. Candidate must be status: "ACTIVE".
   * 4. Candidate must currently have role: "customer".
   * 5. Endpoint NEVER permits directly granting "admin" role (admin role assignment requires bootstrap CLI).
   * 6. Purges active sessions so user re-authenticates with new privileges.
   * 7. Enqueues email notification via emailOutbox.
   * 8. Records detailed audit log.
   */
  static async promoteCustomerToStaff(params: {
    candidateId: string;
    department?: string;
    adminEmail: string;
    ipAddress?: string;
  }) {
    if (!ObjectId.isValid(params.candidateId)) {
      throw new BadRequestError("Invalid candidate ID format.");
    }

    const client = await clientPromise;
    const mongoSession = client.startSession();

    try {
      let resultUser: DbUser | null = null;

      await mongoSession.withTransaction(async () => {
        const db = await getDatabase();
        const usersCol = db.collection<DbUser>(COLLECTIONS.USER);

        const candidate = await usersCol.findOne(
          { _id: new ObjectId(params.candidateId) as any },
          { session: mongoSession }
        );

        if (!candidate) {
          throw new NotFoundError("Candidate user not found.");
        }

        if (candidate.role !== "customer") {
          throw new BadRequestError(
            `User is already assigned role '${candidate.role}'. Only customers can be promoted to banking-staff.`
          );
        }

        if (candidate.status !== "ACTIVE") {
          throw new BadRequestError(
            `Candidate account is currently '${candidate.status || "INACTIVE"}'. Only ACTIVE users can be promoted.`
          );
        }

        if (!candidate.emailVerified) {
          throw new BadRequestError(
            "Candidate must have a verified email address before being appointed to banking staff."
          );
        }

        // Atomically update role to banking-staff
        const now = new Date();
        const updated = await usersCol.findOneAndUpdate(
          { _id: candidate._id, role: "customer" },
          {
            $set: {
              role: "banking-staff",
              updatedAt: now,
            },
          },
          { returnDocument: "after", session: mongoSession }
        );

        if (!updated) {
          throw new ConflictError("Concurrent role update detected on candidate.");
        }

        resultUser = updated;

        // Invalidate sessions immediately across all devices
        await StaffService.purgeUserSessions(candidate._id.toString(), mongoSession);

        // Enqueue email in outbox
        await EmailOutboxService.enqueueEmail(
          {
            recipientEmail: candidate.email,
            recipientName: candidate.name,
            subject: "Trustora Bank — Staff Appointment Notice",
            template: "STAFF_PROMOTED",
            templateData: {
              name: candidate.name,
              role: "banking-staff",
              department: params.department || "General Operations",
              promotedAt: now.toISOString(),
            },
            referenceEntity: "user",
            referenceId: candidate._id.toString(),
          },
          mongoSession
        );

        // Audit Log
        await db.collection<DbAuditLog>(COLLECTIONS.AUDIT_LOGS).insertOne(
          {
            performedBy: params.adminEmail,
            role: "ADMIN",
            action: "STAFF_PROMOTED",
            targetType: "user",
            target: candidate._id.toString(),
            description: `Promoted candidate ${candidate.email} to banking-staff`,
            metadata: {
              previousRole: "customer",
              newRole: "banking-staff",
              candidateEmail: candidate.email,
              department: params.department,
              ipAddress: params.ipAddress,
            },
            createdAt: now,
          },
          { session: mongoSession }
        );
      });

      return {
        message: "Customer successfully promoted to Banking Staff.",
        user: {
          _id: resultUser!._id?.toString(),
          email: resultUser!.email,
          role: resultUser!.role,
          status: resultUser!.status,
        },
      };
    } finally {
      await mongoSession.endSession();
    }
  }

  /**
   * Modify Staff Role (Demote banking-staff to customer, or demote admin).
   * Concurrency Guard Enforcement:
   * When demoting an admin, uses an atomic conditional check on adminGuard:
   * { _id: "admin_concurrency_guard", activeAdminCount: { $gt: 1 } }
   * with $inc: { activeAdminCount: -1, version: 1 }.
   * If activeAdminCount <= 1, aborts with 400 Bad Request / Conflict Error (Last Admin Protection).
   */
  static async modifyStaffRole(params: {
    targetStaffId: string;
    newRole: UserRole;
    reason: string;
    adminEmail: string;
    ipAddress?: string;
  }) {
    if (!ObjectId.isValid(params.targetStaffId)) {
      throw new BadRequestError("Invalid staff ID format.");
    }

    if (!["customer", "banking-staff"].includes(params.newRole)) {
      throw new BadRequestError("Ordinary staff API only permits assigning roles: 'customer' or 'banking-staff'.");
    }

    const client = await clientPromise;
    const mongoSession = client.startSession();

    try {
      let resultUser: DbUser | null = null;

      await mongoSession.withTransaction(async () => {
        const db = await getDatabase();
        const usersCol = db.collection<DbUser>(COLLECTIONS.USER);
        const guardCol = db.collection<DbAdminGuard>(COLLECTIONS.ADMIN_GUARD);

        const targetUser = await usersCol.findOne(
          { _id: new ObjectId(params.targetStaffId) as any },
          { session: mongoSession }
        );

        if (!targetUser) {
          throw new NotFoundError("Target staff user not found.");
        }

        if (targetUser.role === params.newRole) {
          throw new BadRequestError(`Target user is already assigned role '${params.newRole}'.`);
        }

        const isDemotingAdmin = targetUser.role === "admin" && params.newRole !== "admin";

        if (isDemotingAdmin) {
          // Atomic guard check: Must have > 1 active admin
          const guardUpdate = await guardCol.findOneAndUpdate(
            {
              _id: "admin_concurrency_guard",
              activeAdminCount: { $gt: 1 },
            },
            {
              $inc: { activeAdminCount: -1, version: 1 },
              $set: { updatedAt: new Date() },
            },
            { returnDocument: "after", session: mongoSession }
          );

          if (!guardUpdate) {
            throw new BadRequestError(
              "Demotion rejected: System requires at least one active administrator. Cannot demote the last remaining admin."
            );
          }
        }

        // Update target user's role
        const now = new Date();
        const updated = await usersCol.findOneAndUpdate(
          { _id: targetUser._id },
          {
            $set: {
              role: params.newRole,
              updatedAt: now,
            },
          },
          { returnDocument: "after", session: mongoSession }
        );

        resultUser = updated;

        // Invalidate sessions immediately across all devices
        await StaffService.purgeUserSessions(targetUser._id.toString(), mongoSession);

        // Enqueue email notification in outbox
        await EmailOutboxService.enqueueEmail(
          {
            recipientEmail: targetUser.email,
            recipientName: targetUser.name,
            subject: "Trustora Bank — Staff Role Modification Notice",
            template: "STAFF_ROLE_MODIFIED",
            templateData: {
              name: targetUser.name,
              previousRole: targetUser.role,
              newRole: params.newRole,
              reason: params.reason,
            },
            referenceEntity: "user",
            referenceId: targetUser._id.toString(),
          },
          mongoSession
        );

        // Audit Log
        await db.collection<DbAuditLog>(COLLECTIONS.AUDIT_LOGS).insertOne(
          {
            performedBy: params.adminEmail,
            role: "ADMIN",
            action: isDemotingAdmin ? "ADMIN_DEMOTED" : "STAFF_ROLE_MODIFIED",
            targetType: "user",
            target: targetUser._id.toString(),
            description: `Modified role for ${targetUser.email} to ${params.newRole}`,
            metadata: {
              previousRole: targetUser.role,
              newRole: params.newRole,
              reason: params.reason,
              ipAddress: params.ipAddress,
            },
            createdAt: now,
          },
          { session: mongoSession }
        );
      });

      return {
        message: `Staff role successfully modified to '${params.newRole}'.`,
        user: {
          _id: resultUser!._id?.toString(),
          email: resultUser!.email,
          role: resultUser!.role,
          status: resultUser!.status,
        },
      };
    } finally {
      await mongoSession.endSession();
    }
  }

  /**
   * Modify Staff Status (ACTIVE, BLOCKED, DEACTIVATED).
   * Concurrency Guard Enforcement:
   * If deactivating or blocking an admin, uses an atomic check on adminGuard:
   * { _id: "admin_concurrency_guard", activeAdminCount: { $gt: 1 } }
   * with $inc: { activeAdminCount: -1, version: 1 }.
   * Prevents locking the last active administrator out of the system.
   */
  static async modifyStaffStatus(params: {
    targetStaffId: string;
    newStatus: CustomerStatus;
    reason: string;
    adminEmail: string;
    ipAddress?: string;
  }) {
    if (!ObjectId.isValid(params.targetStaffId)) {
      throw new BadRequestError("Invalid staff ID format.");
    }

    const client = await clientPromise;
    const mongoSession = client.startSession();

    try {
      let resultUser: DbUser | null = null;

      await mongoSession.withTransaction(async () => {
        const db = await getDatabase();
        const usersCol = db.collection<DbUser>(COLLECTIONS.USER);
        const guardCol = db.collection<DbAdminGuard>(COLLECTIONS.ADMIN_GUARD);

        const targetUser = await usersCol.findOne(
          { _id: new ObjectId(params.targetStaffId) as any },
          { session: mongoSession }
        );

        if (!targetUser) {
          throw new NotFoundError("Target staff user not found.");
        }

        if (targetUser.status === params.newStatus) {
          throw new BadRequestError(`Staff member is already in status '${params.newStatus}'.`);
        }

        const isCurrentlyActiveAdmin = targetUser.role === "admin" && (targetUser.status || "ACTIVE") === "ACTIVE";
        const willDeactivateAdmin = isCurrentlyActiveAdmin && params.newStatus !== "ACTIVE";
        const willReactivateAdmin = targetUser.role === "admin" && targetUser.status !== "ACTIVE" && params.newStatus === "ACTIVE";

        if (willDeactivateAdmin) {
          // Atomic guard check: Must have > 1 active admin
          const guardUpdate = await guardCol.findOneAndUpdate(
            {
              _id: "admin_concurrency_guard",
              activeAdminCount: { $gt: 1 },
            },
            {
              $inc: { activeAdminCount: -1, version: 1 },
              $set: { updatedAt: new Date() },
            },
            { returnDocument: "after", session: mongoSession }
          );

          if (!guardUpdate) {
            throw new BadRequestError(
              "Status modification rejected: System requires at least one active administrator. Cannot deactivate the last remaining admin."
            );
          }
        } else if (willReactivateAdmin) {
          await guardCol.updateOne(
            { _id: "admin_concurrency_guard" },
            {
              $inc: { activeAdminCount: 1, version: 1 },
              $set: { updatedAt: new Date() },
            },
            { session: mongoSession }
          );
        }

        // Update target user's status
        const now = new Date();
        const updated = await usersCol.findOneAndUpdate(
          { _id: targetUser._id },
          {
            $set: {
              status: params.newStatus,
              updatedAt: now,
            },
          },
          { returnDocument: "after", session: mongoSession }
        );

        resultUser = updated;

        // Invalidate sessions immediately across all devices
        await StaffService.purgeUserSessions(targetUser._id.toString(), mongoSession);

        // Enqueue email notification in outbox
        await EmailOutboxService.enqueueEmail(
          {
            recipientEmail: targetUser.email,
            recipientName: targetUser.name,
            subject: `Trustora Bank — Account Status Update: ${params.newStatus}`,
            template: "STAFF_STATUS_MODIFIED",
            templateData: {
              name: targetUser.name,
              previousStatus: targetUser.status || "ACTIVE",
              newStatus: params.newStatus,
              reason: params.reason,
            },
            referenceEntity: "user",
            referenceId: targetUser._id.toString(),
          },
          mongoSession
        );

        // Audit Log
        await db.collection<DbAuditLog>(COLLECTIONS.AUDIT_LOGS).insertOne(
          {
            performedBy: params.adminEmail,
            role: "ADMIN",
            action: "STAFF_STATUS_MODIFIED",
            targetType: "user",
            target: targetUser._id.toString(),
            description: `Modified status for ${targetUser.email} to ${params.newStatus}`,
            metadata: {
              previousStatus: targetUser.status || "ACTIVE",
              newStatus: params.newStatus,
              reason: params.reason,
              ipAddress: params.ipAddress,
            },
            createdAt: now,
          },
          { session: mongoSession }
        );
      });

      return {
        message: `Staff member status updated to '${params.newStatus}'.`,
        user: {
          _id: resultUser!._id?.toString(),
          email: resultUser!.email,
          role: resultUser!.role,
          status: resultUser!.status,
        },
      };
    } finally {
      await mongoSession.endSession();
    }
  }
}
