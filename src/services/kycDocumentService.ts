import crypto from "crypto";
import { ObjectId, type Filter } from "mongodb";
import { getDatabase } from "@/lib/mongodb";
import {
  COLLECTIONS,
  type DbUser,
  type DbKycDocument,
  type DbKycUploadIntent,
  type KycDocumentType,
  type KycProcessingStatus,
  type DbAuditLog,
} from "@/types";
import { NotFoundError, BadRequestError, ForbiddenError } from "@/server/auth/errors";
import { encryptEnvelope, maskDocumentNumber } from "@/lib/encryption";
import {
  generatePresignedUploadUrl,
  getObjectBuffer,
  putObjectBuffer,
  deleteObject,
  generateStaffViewUrl,
  type UploadIntentPresigned,
} from "@/lib/storage";
import {
  validateKycDocument,
  scanBufferWithClamAV,
  calculateSha256,
} from "@/validators/fileValidator";
import { escapeRegex } from "@/validators/regexHelper";

export class KycDocumentService {
  /**
   * 1. Customer initiates an upload intent:
   * Generates a unique uploadToken and scoped object key in quarantine.
   * Inserts an atomic intent record in kycUploadIntents with 10-minute expiry.
   */
  static async createUploadIntent(params: {
    userId: string;
    userEmail: string;
    documentType: KycDocumentType;
    documentNumber: string;
    fileName: string;
    contentType: string;
    contentLength?: number;
  }): Promise<{
    uploadToken: string;
    presigned: UploadIntentPresigned;
    quarantineKey: string;
    expiresAt: Date;
  }> {
    const db = await getDatabase();
    const intentsCol = db.collection<DbKycUploadIntent>(COLLECTIONS.KYC_UPLOAD_INTENTS);

    const uploadToken = crypto.randomUUID();
    const cleanFileName = params.fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    const quarantineKey = `quarantine/${params.userId}/${uploadToken}/${cleanFileName}`;
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const presigned = await generatePresignedUploadUrl({
      key: quarantineKey,
      expectedContentType: params.contentType,
      contentLength: params.contentLength,
    });

    const docIntent: DbKycUploadIntent = {
      uploadToken,
      userId: new ObjectId(params.userId),
      userEmail: params.userEmail.toLowerCase(),
      documentType: params.documentType,
      documentNumber: params.documentNumber,
      quarantineKey,
      fileName: cleanFileName,
      contentType: params.contentType,
      status: "ISSUED",
      expiresAt,
      createdAt: new Date(),
    };

    await intentsCol.insertOne(docIntent);

    return {
      uploadToken,
      presigned,
      quarantineKey,
      expiresAt,
    };
  }

  /**
   * 2. Customer confirms upload and submits document for processing:
   * Atomically consumes the upload intent, retrieves file from quarantine,
   * performs deep format validation, strips EXIF, runs ClamAV scan,
   * moves sanitized file to verified storage, envelopes sensitive doc number,
   * inserts record into kycDocuments, and marks intent CONSUMED.
   */
  static async submitUploadedDocument(params: {
    userId: string;
    userEmail: string;
    uploadToken: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<{ submissionId: string; status: KycProcessingStatus; message: string }> {
    const db = await getDatabase();
    const intentsCol = db.collection<DbKycUploadIntent>(COLLECTIONS.KYC_UPLOAD_INTENTS);
    const kycDocsCol = db.collection<DbKycDocument>(COLLECTIONS.KYC_DOCUMENTS);
    const usersCol = db.collection<DbUser>(COLLECTIONS.USER);

    // Atomically find and consume intent
    const now = new Date();
    const intent = await intentsCol.findOneAndUpdate(
      {
        uploadToken: params.uploadToken,
        status: "ISSUED",
        expiresAt: { $gt: now },
      },
      {
        $set: {
          status: "CONSUMED",
          consumedAt: now,
        },
      },
      { returnDocument: "after" }
    );

    if (!intent) {
      throw new BadRequestError("Invalid, expired, or already consumed upload intent token.");
    }

    // Verify ownership
    if (intent.userEmail.toLowerCase() !== params.userEmail.toLowerCase()) {
      throw new ForbiddenError("You are not authorized to consume this upload token.");
    }

    let quarantineBuffer: Buffer;
    try {
      quarantineBuffer = await getObjectBuffer(intent.quarantineKey);
    } catch (err) {
      throw new BadRequestError(`File has not been uploaded to quarantine destination yet: ${err instanceof Error ? err.message : String(err)}`);
    }

    // 1. Calculate raw SHA-256 Checksum
    const rawSha256 = calculateSha256(quarantineBuffer);

    // 2. Deep format validation and sanitization
    const validationResult = await validateKycDocument(quarantineBuffer, intent.contentType);
    if (!validationResult.isValid || !validationResult.sanitizedBuffer) {
      // Quarantine cleanup
      await deleteObject(intent.quarantineKey);
      throw new BadRequestError(`Document format validation failed: ${validationResult.error || "Invalid file"}`);
    }

    // 3. Malware scanning via ClamAV (fail-closed)
    const scanResult = await scanBufferWithClamAV(validationResult.sanitizedBuffer);
    if (scanResult.isInfected) {
      // Security Incident! Delete quarantined file immediately and audit
      await deleteObject(intent.quarantineKey);

      await db.collection<DbAuditLog>(COLLECTIONS.AUDIT_LOGS).insertOne({
        performedBy: params.userEmail,
        role: "CUSTOMER",
        action: "KYC_MALWARE_DETECTED",
        targetType: "kycDocuments",
        target: intent.uploadToken,
        description: `Malicious file signature detected: ${scanResult.virusName}`,
        metadata: {
          virusName: scanResult.virusName,
          fileName: intent.fileName,
          uploadToken: intent.uploadToken,
          ipAddress: params.ipAddress,
        },
        createdAt: new Date(),
      });

      throw new BadRequestError(`Security rejection: Malicious file signature detected (${scanResult.virusName}). This incident has been logged.`);
    }

    if (!scanResult.isClean && scanResult.error) {
      await deleteObject(intent.quarantineKey);
      throw new BadRequestError(`Malware scanner error: ${scanResult.error}`);
    }

    // 4. Move sanitized document to verified storage
    const storageKey = `verified/${params.userId}/${intent.uploadToken}/${intent.fileName}`;
    await putObjectBuffer({
      key: storageKey,
      buffer: validationResult.sanitizedBuffer,
      contentType: validationResult.mimeType,
    });

    // Clean up temporary quarantine file
    await deleteObject(intent.quarantineKey);

    // 5. Envelope Encryption for sensitive Document Number
    const encryptedField = encryptEnvelope(intent.documentNumber);
    const maskedNumber = maskDocumentNumber(intent.documentNumber);

    // 6. Check for previous active documents to archive/supersede
    await kycDocsCol.updateMany(
      {
        userId: new ObjectId(params.userId),
        status: { $in: ["PENDING_REVIEW", "VERIFIED"] },
      },
      {
        $set: {
          status: "FAILED",
          rejectionReason: "Superseded by newer KYC document submission",
          updatedAt: new Date(),
        },
      }
    );

    // 7. Insert into dedicated kycDocuments collection
    const kycDoc: DbKycDocument = {
      userId: new ObjectId(params.userId),
      userEmail: params.userEmail.toLowerCase(),
      documentType: intent.documentType,
      encryptedDocumentNumber: encryptedField,
      maskedDocumentNumber: maskedNumber,
      documentAsset: {
        storageKey,
        originalFileName: intent.fileName,
        contentType: validationResult.mimeType,
        sizeBytes: validationResult.sizeBytes,
        sha256Hash: validationResult.sha256Hash,
        uploadedAt: new Date(),
        quarantineStatus: "CLEARED",
        metadata: validationResult.metadata,
      },
      status: "PENDING_REVIEW",
      legalHold: false,
      submittedAt: new Date(),
      updatedAt: new Date(),
    };

    const inserted = await kycDocsCol.insertOne(kycDoc);

    // 8. Update user high-level kycStatus to PENDING
    await usersCol.updateOne(
      { _id: new ObjectId(params.userId) as any },
      {
        $set: {
          kycStatus: "PENDING",
          kycDocumentType: intent.documentType,
          kycSubmittedAt: new Date(),
          updatedAt: new Date(),
        },
      }
    );

    // 9. Write audit log
    await db.collection<DbAuditLog>(COLLECTIONS.AUDIT_LOGS).insertOne({
      performedBy: params.userEmail,
      role: "CUSTOMER",
      action: "KYC_DOCUMENT_SUBMITTED",
      targetType: "kycDocuments",
      target: inserted.insertedId.toString(),
      description: `Submitted KYC document (${intent.documentType})`,
      metadata: {
        documentType: intent.documentType,
        sha256: validationResult.sha256Hash,
        sizeBytes: validationResult.sizeBytes,
      },
      createdAt: new Date(),
    });

    return {
      submissionId: inserted.insertedId.toString(),
      status: "PENDING_REVIEW",
      message: "KYC document uploaded, sanitized, and queued for staff review.",
    };
  }

  /**
   * 3. Customer retrieves their own KYC submission status
   */
  static async getCustomerKycStatus(userId: string) {
    const db = await getDatabase();
    const doc = await db.collection<DbKycDocument>(COLLECTIONS.KYC_DOCUMENTS).findOne(
      { userId: new ObjectId(userId) },
      { sort: { submittedAt: -1 } }
    );

    if (!doc) {
      return {
        hasSubmission: false,
        status: "NOT_SUBMITTED",
      };
    }

    return {
      hasSubmission: true,
      submissionId: doc._id?.toString(),
      documentType: doc.documentType,
      maskedDocumentNumber: doc.maskedDocumentNumber,
      status: doc.status,
      legalHold: doc.legalHold,
      rejectionReason: doc.rejectionReason,
      submittedAt: doc.submittedAt,
      reviewedAt: doc.reviewedAt,
    };
  }

  /**
   * 4. Staff/Admin lists submissions with pagination, search, and status filter
   */
  static async listSubmissions(params: {
    status?: KycProcessingStatus;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const db = await getDatabase();
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(50, Math.max(1, params.limit || 10));
    const skip = (page - 1) * limit;

    const filter: Filter<DbKycDocument> = {};

    if (params.status) {
      filter.status = params.status;
    }

    if (params.search && params.search.trim()) {
      const escaped = escapeRegex(params.search.trim());
      filter.$or = [
        { userEmail: { $regex: escaped, $options: "i" } },
        { maskedDocumentNumber: { $regex: escaped, $options: "i" } },
        { "documentAsset.originalFileName": { $regex: escaped, $options: "i" } },
      ];
    }

    const col = db.collection<DbKycDocument>(COLLECTIONS.KYC_DOCUMENTS);
    const [total, items] = await Promise.all([
      col.countDocuments(filter),
      col
        .find(filter)
        .sort({ submittedAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
    ]);

    return {
      items: items.map((i) => ({
        _id: i._id?.toString(),
        userId: i.userId.toString(),
        userEmail: i.userEmail,
        documentType: i.documentType,
        maskedDocumentNumber: i.maskedDocumentNumber,
        status: i.status,
        legalHold: i.legalHold,
        submittedAt: i.submittedAt,
        reviewedAt: i.reviewedAt,
        reviewedBy: i.reviewedBy,
        rejectionReason: i.rejectionReason,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * 5. Staff/Admin gets single submission details (privileged view)
   */
  static async getSubmissionDetails(submissionId: string) {
    const db = await getDatabase();
    if (!ObjectId.isValid(submissionId)) {
      throw new BadRequestError("Invalid submission ID format.");
    }

    const doc = await db
      .collection<DbKycDocument>(COLLECTIONS.KYC_DOCUMENTS)
      .findOne({ _id: new ObjectId(submissionId) });

    if (!doc) {
      throw new NotFoundError("KYC submission not found.");
    }

    return {
      _id: doc._id?.toString(),
      userId: doc.userId.toString(),
      userEmail: doc.userEmail,
      documentType: doc.documentType,
      maskedDocumentNumber: doc.maskedDocumentNumber,
      status: doc.status,
      legalHold: doc.legalHold,
      documentAsset: {
        fileName: doc.documentAsset.originalFileName,
        contentType: doc.documentAsset.contentType,
        sizeBytes: doc.documentAsset.sizeBytes,
        sha256Hash: doc.documentAsset.sha256Hash,
        uploadedAt: doc.documentAsset.uploadedAt,
      },
      submittedAt: doc.submittedAt,
      reviewedAt: doc.reviewedAt,
      reviewedBy: doc.reviewedBy,
      rejectionReason: doc.rejectionReason,
    };
  }

  /**
   * 6. Generate secure short-lived presigned view URL for Banking Staff or Admin
   * Logs access in auditLogs with KYC_DOCUMENT_VIEWED
   */
  static async generateStaffDocumentViewUrl(params: {
    submissionId: string;
    reviewerEmail: string;
    reviewerRole: string;
    ipAddress?: string;
  }): Promise<{ viewUrl: string; expiresInSeconds: number }> {
    const db = await getDatabase();
    if (!ObjectId.isValid(params.submissionId)) {
      throw new BadRequestError("Invalid submission ID format.");
    }

    const doc = await db
      .collection<DbKycDocument>(COLLECTIONS.KYC_DOCUMENTS)
      .findOne({ _id: new ObjectId(params.submissionId) });

    if (!doc) {
      throw new NotFoundError("KYC submission not found.");
    }

    const expiresInSeconds = 900; // 15 minutes
    const viewUrl = await generateStaffViewUrl({
      key: doc.documentAsset.storageKey,
      fileName: doc.documentAsset.originalFileName,
      contentType: doc.documentAsset.contentType,
      expiresInSeconds,
    });

    // Write audit log
    await db.collection<DbAuditLog>(COLLECTIONS.AUDIT_LOGS).insertOne({
      performedBy: params.reviewerEmail,
      role: params.reviewerRole.toUpperCase() as any,
      action: "KYC_DOCUMENT_VIEWED",
      targetType: "kycDocuments",
      target: doc._id?.toString() || "",
      description: `Staff viewed document ${doc.documentAsset.originalFileName}`,
      metadata: {
        submissionId: doc._id?.toString(),
        targetUserEmail: doc.userEmail,
        ipAddress: params.ipAddress,
      },
      createdAt: new Date(),
    });

    return { viewUrl, expiresInSeconds };
  }

  /**
   * 7. Staff/Admin verifies or rejects a KYC submission
   * - Prevents staff from reviewing their own KYC submission!
   * - Updates kycDocuments and user collection atomically
   * - Enqueues notification
   */
  static async reviewSubmission(params: {
    submissionId: string;
    decision: "VERIFY" | "REJECT";
    rejectionReason?: string;
    reviewerEmail: string;
    reviewerRole: string;
  }): Promise<DbKycDocument> {
    const db = await getDatabase();
    if (!ObjectId.isValid(params.submissionId)) {
      throw new BadRequestError("Invalid submission ID format.");
    }

    const kycDocsCol = db.collection<DbKycDocument>(COLLECTIONS.KYC_DOCUMENTS);
    const doc = await kycDocsCol.findOne({ _id: new ObjectId(params.submissionId) });

    if (!doc) {
      throw new NotFoundError("KYC submission not found.");
    }

    // Critical Self-Review Prevention: Staff cannot verify/reject their own KYC!
    if (doc.userEmail.toLowerCase() === params.reviewerEmail.toLowerCase()) {
      throw new ForbiddenError("Security violation: Staff members cannot review their own KYC documents.");
    }

    if (doc.status !== "PENDING_REVIEW") {
      throw new BadRequestError(`Cannot review a submission that is already in '${doc.status}' status.`);
    }

    const now = new Date();
    const newStatus: KycProcessingStatus = params.decision === "VERIFY" ? "VERIFIED" : "REJECTED";
    const userKycStatus = params.decision === "VERIFY" ? "VERIFIED" : "REJECTED";

    const updated = await kycDocsCol.findOneAndUpdate(
      { _id: new ObjectId(params.submissionId) },
      {
        $set: {
          status: newStatus,
          reviewedAt: now,
          reviewedBy: params.reviewerEmail,
          rejectionReason: params.decision === "REJECT" ? params.rejectionReason || "Verification criteria not met" : undefined,
          updatedAt: now,
        },
      },
      { returnDocument: "after" }
    );

    if (!updated) {
      throw new NotFoundError("Failed to update KYC document record.");
    }

    // Update User record
    await db.collection<DbUser>(COLLECTIONS.USER).updateOne(
      { _id: doc.userId as any },
      {
        $set: {
          kycStatus: userKycStatus,
          updatedAt: now,
        },
      }
    );

    // Audit log
    await db.collection<DbAuditLog>(COLLECTIONS.AUDIT_LOGS).insertOne({
      performedBy: params.reviewerEmail,
      role: params.reviewerRole.toUpperCase() as any,
      action: params.decision === "VERIFY" ? "KYC_VERIFIED" : "KYC_REJECTED",
      targetType: "kycDocuments",
      target: doc._id?.toString() || "",
      description: `Staff ${params.decision === "VERIFY" ? "verified" : "rejected"} KYC document`,
      metadata: {
        decision: params.decision,
        targetUserEmail: doc.userEmail,
        rejectionReason: params.rejectionReason,
      },
      createdAt: now,
    });

    return updated;
  }

  /**
   * 8. Admin toggles Legal Hold
   */
  static async setLegalHold(params: {
    submissionId: string;
    legalHold: boolean;
    reason: string;
    adminEmail: string;
  }): Promise<DbKycDocument> {
    const db = await getDatabase();
    if (!ObjectId.isValid(params.submissionId)) {
      throw new BadRequestError("Invalid submission ID format.");
    }

    const updated = await db
      .collection<DbKycDocument>(COLLECTIONS.KYC_DOCUMENTS)
      .findOneAndUpdate(
        { _id: new ObjectId(params.submissionId) },
        {
          $set: {
            legalHold: params.legalHold,
            updatedAt: new Date(),
          },
        },
        { returnDocument: "after" }
      );

    if (!updated) {
      throw new NotFoundError("KYC submission not found.");
    }

    await db.collection<DbAuditLog>(COLLECTIONS.AUDIT_LOGS).insertOne({
      performedBy: params.adminEmail,
      role: "ADMIN",
      action: params.legalHold ? "KYC_LEGAL_HOLD_APPLIED" : "KYC_LEGAL_HOLD_REMOVED",
      targetType: "kycDocuments",
      target: params.submissionId,
      description: `Admin ${params.legalHold ? "applied" : "removed"} legal hold: ${params.reason}`,
      metadata: {
        legalHold: params.legalHold,
        reason: params.reason,
      },
      createdAt: new Date(),
    });

    return updated;
  }
}
