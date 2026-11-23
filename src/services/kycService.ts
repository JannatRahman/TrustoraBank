import { getDatabase } from "@/lib/mongodb";
import {
  COLLECTIONS,
  type DbUser,
  type DbAuditLog,
  type DbNotification,
  type KycStatus,
  type KycDocumentType,
  type UserRole,
} from "@/types";
import { NotFoundError, BadRequestError, ForbiddenError } from "@/server/auth/errors";
import { escapeRegex } from "@/validators/regexHelper";

export class KycService {
  /**
   * Customer submits or updates their KYC documents for verification.
   */
  static async submitKyc(
    userEmail: string,
    documentType: KycDocumentType,
    documentNumber: string
  ): Promise<DbUser> {
    const db = await getDatabase();
    const usersCol = db.collection<DbUser>(COLLECTIONS.USER);

    const now = new Date();
    const updated = await usersCol.findOneAndUpdate(
      { email: userEmail.toLowerCase() },
      {
        $set: {
          kycStatus: "PENDING",
          kycDocumentType: documentType,
          kycDocumentNumber: documentNumber,
          kycSubmittedAt: now,
          updatedAt: now,
        },
      },
      { returnDocument: "after" }
    );

    if (!updated) {
      throw new NotFoundError("User record not found.");
    }

    return updated;
  }

  /**
   * Customer retrieves their own KYC verification status.
   */
  static async getKycStatus(userEmail: string) {
    const db = await getDatabase();
    const user = await db
      .collection<DbUser>(COLLECTIONS.USER)
      .findOne({ email: userEmail.toLowerCase() });

    if (!user) {
      throw new NotFoundError("User record not found.");
    }

    return {
      kycStatus: user.kycStatus || "PENDING",
      documentType: user.kycDocumentType || null,
      documentNumber: user.kycDocumentNumber ? `•••• •••• ${user.kycDocumentNumber.slice(-4)}` : null,
      submittedAt: user.kycSubmittedAt || null,
      reviewedAt: user.kycReviewedAt || null,
      rejectionReason: user.kycRejectionReason || null,
    };
  }

  /**
   * Staff and Admin list submitted KYC records with optional status filter.
   */
  static async listKycRecords(query: {
    status?: KycStatus;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const db = await getDatabase();
    const usersCol = db.collection<DbUser>(COLLECTIONS.USER);

    const filter: Record<string, unknown> = {
      role: "customer",
    };

    if (query.status) {
      filter.kycStatus = query.status;
    }

    if (query.search) {
      const sanitized = escapeRegex(query.search.trim());
      const regex = new RegExp(sanitized, "i");
      filter.$or = [{ name: regex }, { email: regex }, { phone: regex }];
    }

    const page = Math.max(1, query.page || 1);
    const limit = Math.min(100, Math.max(1, query.limit || 20));
    const skip = (page - 1) * limit;

    const [records, total] = await Promise.all([
      usersCol.find(filter).sort({ kycSubmittedAt: -1, createdAt: -1 }).skip(skip).limit(limit).toArray(),
      usersCol.countDocuments(filter),
    ]);

    return {
      records: records.map((r) => ({
        id: r._id,
        name: r.name,
        email: r.email,
        phone: r.phone || "N/A",
        documentType: r.kycDocumentType || "NATIONAL_ID",
        documentNumber: r.kycDocumentNumber || "Pending submission",
        status: r.kycStatus || "PENDING",
        submittedAt: r.kycSubmittedAt || r.createdAt,
        reviewedAt: r.kycReviewedAt || null,
        rejectionReason: r.kycRejectionReason || null,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Staff or Admin reviews and approves or declines KYC documents.
   * Self-review is strictly forbidden!
   */
  static async reviewKyc(
    customerEmailOrId: string,
    action: "VERIFY" | "REJECT",
    reviewerEmail: string,
    reviewerRole: UserRole,
    rejectionReason?: string
  ): Promise<DbUser> {
    const db = await getDatabase();
    const usersCol = db.collection<DbUser>(COLLECTIONS.USER);
    const auditCol = db.collection<DbAuditLog>(COLLECTIONS.AUDIT_LOGS);
    const notifCol = db.collection<DbNotification>(COLLECTIONS.NOTIFICATIONS);

    const term = customerEmailOrId.trim();
    const customer = await usersCol.findOne({
      $or: [{ email: term.toLowerCase() }, { _id: term as any }, { id: term }],
    });

    if (!customer) {
      throw new NotFoundError(`Customer ${customerEmailOrId} was not found.`);
    }

    // Strict self-review prevention
    if (customer.email.toLowerCase() === reviewerEmail.toLowerCase()) {
      throw new ForbiddenError("Staff members cannot review or verify their own KYC documents.");
    }

    const newKycStatus: KycStatus = action === "VERIFY" ? "VERIFIED" : "REJECTED";
    const now = new Date();

    const updated = await usersCol.findOneAndUpdate(
      { _id: customer._id },
      {
        $set: {
          kycStatus: newKycStatus,
          kycReviewedBy: reviewerEmail.toLowerCase(),
          kycReviewedAt: now,
          kycRejectionReason: action === "REJECT" ? rejectionReason : undefined,
          updatedAt: now,
        },
      },
      { returnDocument: "after" }
    );

    if (!updated) {
      throw new BadRequestError("Failed to update KYC status.");
    }

    // Audit Log
    const role = reviewerRole === "admin" ? "ADMIN" : "STAFF";
    await auditCol.insertOne({
      performedBy: reviewerEmail.toLowerCase(),
      role,
      action: action === "VERIFY" ? "KYC_VERIFIED" : "KYC_REJECTED",
      targetType: "User",
      target: customer.email,
      description:
        action === "VERIFY"
          ? `Verified KYC documents of ${customer.name} (${customer.email})`
          : `Rejected KYC documents of ${customer.name}. Reason: ${rejectionReason}`,
      metadata: { customerEmail: customer.email, newKycStatus, reason: rejectionReason },
      createdAt: now,
    });

    // Notify Customer
    await notifCol.insertOne({
      type: action === "VERIFY" ? "KYC_VERIFIED" : "KYC_REJECTED",
      user: customer.email.toLowerCase(),
      title: action === "VERIFY" ? "Identity Verified" : "KYC Update Required",
      message:
        action === "VERIFY"
          ? "Your identity documents have been reviewed and successfully verified."
          : `Your KYC documents could not be verified. Reason: ${rejectionReason}. Please re-submit valid documentation.`,
      relatedModel: "User",
      relatedId: customer.email,
      read: false,
      createdAt: now,
      updatedAt: now,
    });

    return updated;
  }
}
