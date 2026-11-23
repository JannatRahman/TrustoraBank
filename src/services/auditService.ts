import type { ClientSession } from "mongodb";
import { getDatabase } from "@/lib/mongodb";
import { COLLECTIONS, type DbAuditLog } from "@/types";

export interface LogActionParams {
  performedBy: string;
  role: "CUSTOMER" | "STAFF" | "ADMIN" | "SYSTEM";
  action: string;
  targetType: string;
  target: string;
  description: string;
  metadata?: Record<string, unknown>;
}

export class AuditService {
  /**
   * Appends an immutable audit log record to the auditLogs collection.
   * Accepts an optional MongoDB ClientSession for transactional execution.
   */
  static async logAction(params: LogActionParams, session?: ClientSession): Promise<void> {
    const db = await getDatabase();
    const record: DbAuditLog = {
      performedBy: params.performedBy.toLowerCase(),
      role: params.role,
      action: params.action,
      targetType: params.targetType,
      target: params.target,
      description: params.description,
      metadata: params.metadata,
      createdAt: new Date(),
    };

    if (session) {
      await db.collection<DbAuditLog>(COLLECTIONS.AUDIT_LOGS).insertOne(record, { session });
    } else {
      await db.collection<DbAuditLog>(COLLECTIONS.AUDIT_LOGS).insertOne(record);
    }
  }
}
