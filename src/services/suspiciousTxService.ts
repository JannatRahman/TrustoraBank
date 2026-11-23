import { clientPromise, getDatabase } from "@/lib/mongodb";
import {
  COLLECTIONS,
  type DbTransaction,
  type DbBankAccount,
  type DbAuditLog,
  type DbNotification,
  type UserRole,
} from "@/types";
import { NotFoundError, BadRequestError, ForbiddenError } from "@/server/auth/errors";

export class SuspiciousTxService {
  /**
   * Retrieves flagged transactions for staff and admin review.
   */
  static async listFlaggedTransactions(query: {
    reviewStatus?: string;
    riskLevel?: string;
    type?: string;
    page?: number;
    limit?: number;
  }) {
    const db = await getDatabase();
    const txCol = db.collection<DbTransaction>(COLLECTIONS.TRANSACTIONS);

    const filter: Record<string, unknown> = {
      $or: [{ flagged: true }, { status: "FLAGGED" }],
    };

    if (query.reviewStatus) {
      filter.reviewStatus = query.reviewStatus.toUpperCase();
    }

    if (query.riskLevel) {
      filter.riskLevel = query.riskLevel.toUpperCase();
    }

    if (query.type) {
      filter.type = query.type.toUpperCase();
    }

    const page = Math.max(1, query.page || 1);
    const limit = Math.min(100, Math.max(1, query.limit || 20));
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      txCol.find(filter).sort({ flaggedAt: -1, createdAt: -1 }).skip(skip).limit(limit).toArray(),
      txCol.countDocuments(filter),
    ]);

    return {
      transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Flags a suspicious transaction for review.
   */
  static async flagTransaction(
    transactionId: string,
    staffEmail: string,
    reviewerRole: UserRole,
    reason: string,
    riskLevel: "LOW" | "MEDIUM" | "HIGH" = "MEDIUM"
  ): Promise<DbTransaction> {
    const db = await getDatabase();
    const txCol = db.collection<DbTransaction>(COLLECTIONS.TRANSACTIONS);
    const auditCol = db.collection<DbAuditLog>(COLLECTIONS.AUDIT_LOGS);

    const now = new Date();
    const updated = await txCol.findOneAndUpdate(
      { transactionId: transactionId.trim() },
      {
        $set: {
          flagged: true,
          flagReason: reason,
          flaggedBy: staffEmail.toLowerCase(),
          flaggedAt: now,
          riskLevel,
          reviewStatus: "PENDING_REVIEW",
          updatedAt: now,
        },
      },
      { returnDocument: "after" }
    );

    if (!updated) {
      throw new NotFoundError(`Transaction ${transactionId} was not found.`);
    }

    // Audit Log
    const role = reviewerRole === "admin" ? "ADMIN" : "STAFF";
    await auditCol.insertOne({
      performedBy: staffEmail.toLowerCase(),
      role,
      action: "TRANSACTION_FLAGGED",
      targetType: "Transaction",
      target: transactionId,
      description: `Flagged transaction ${transactionId}: ${reason} (Risk: ${riskLevel})`,
      metadata: { transactionId, reason, riskLevel },
      createdAt: now,
    });

    return updated;
  }

  /**
   * Reviews a flagged transaction (CLEAR, ESCALATE, or REVERSE).
   * Note: REVERSE is strictly Administrator-only and performs an atomic financial reversal.
   */
  static async reviewFlaggedTransaction(
    transactionId: string,
    reviewerEmail: string,
    reviewerRole: UserRole,
    action: "CLEAR" | "ESCALATE" | "REVERSE",
    notes?: string,
    reversalReason?: string
  ): Promise<DbTransaction> {
    const db = await getDatabase();
    const txCol = db.collection<DbTransaction>(COLLECTIONS.TRANSACTIONS);
    const accountsCol = db.collection<DbBankAccount>(COLLECTIONS.ACCOUNTS);
    const auditCol = db.collection<DbAuditLog>(COLLECTIONS.AUDIT_LOGS);
    const notifCol = db.collection<DbNotification>(COLLECTIONS.NOTIFICATIONS);

    const tx = await txCol.findOne({ transactionId: transactionId.trim() });
    if (!tx) {
      throw new NotFoundError(`Transaction ${transactionId} was not found.`);
    }

    const now = new Date();

    if (action === "CLEAR") {
      const updated = await txCol.findOneAndUpdate(
        { transactionId: tx.transactionId },
        {
          $set: {
            reviewStatus: "CLEARED",
            reviewedBy: reviewerEmail.toLowerCase(),
            reviewedAt: now,
            internalNotes: notes,
            updatedAt: now,
          },
        },
        { returnDocument: "after" }
      );
      return updated!;
    }

    if (action === "ESCALATE") {
      const updated = await txCol.findOneAndUpdate(
        { transactionId: tx.transactionId },
        {
          $set: {
            reviewStatus: "ESCALATED",
            reviewedBy: reviewerEmail.toLowerCase(),
            reviewedAt: now,
            internalNotes: notes,
            updatedAt: now,
          },
        },
        { returnDocument: "after" }
      );
      return updated!;
    }

    // ACTION: REVERSE (Admin-only)
    if (reviewerRole !== "admin") {
      throw new ForbiddenError("Only Administrators have authority to reverse transactions.");
    }

    // Reject unsupported transaction types
    if (tx.type === "LOAN_DISBURSEMENT" || tx.type === "LOAN_REPAYMENT") {
      throw new BadRequestError(
        "Loan transactions (disbursements and repayments) cannot be reversed via standard transaction reversal. Please reconcile through loan administration."
      );
    }

    const eligibleTypes = ["TRANSFER", "DEPOSIT", "WITHDRAWAL"];
    if (!eligibleTypes.includes(tx.type)) {
      throw new BadRequestError(`Transaction type ${tx.type} is not eligible for reversal.`);
    }

    // Atomic Financial Reversal with strict concurrency protection and balance checks
    const client = await clientPromise;
    const session = client.startSession();
    let reversedTx: DbTransaction | null = null;

    try {
      await session.withTransaction(async () => {
        // Step 1: Conditionally lock and transition the transaction record to REVERSED
        // Ensures that concurrent reversal requests cannot both execute
        const txLock = await txCol.findOneAndUpdate(
          {
            transactionId: tx.transactionId,
            status: "COMPLETED",
            reviewStatus: { $ne: "REVERSED" },
          },
          {
            $set: {
              status: "REVERSED",
              reviewStatus: "REVERSED",
              reversedAt: now,
              reversedBy: reviewerEmail.toLowerCase(),
              reversalReason: reversalReason || "Reversed after administrative fraud review.",
              reviewedBy: reviewerEmail.toLowerCase(),
              reviewedAt: now,
              internalNotes: notes,
              updatedAt: now,
            },
          },
          { session, returnDocument: "after" }
        );

        if (!txLock) {
          throw new BadRequestError(
            `Transaction ${transactionId} has already been reversed, is not completed, or is currently being processed concurrently.`
          );
        }
        reversedTx = txLock;

        // Step 2: Reverse balance movements according to transaction type
        if (tx.type === "TRANSFER") {
          if (!tx.senderAccount || !tx.receiverAccount) {
            throw new BadRequestError(`Cannot reverse transfer ${tx.transactionId}: missing sender or receiver account.`);
          }

          // Sufficient-balance check on recipient account: must cover tx.amount
          const receiverAcc = await accountsCol.findOne(
            { accountNumber: tx.receiverAccount },
            { session }
          );
          if (!receiverAcc) {
            throw new NotFoundError(`Recipient account ${tx.receiverAccount} was not found.`);
          }

          if (receiverAcc.balance < tx.amount) {
            throw new BadRequestError(
              `Cannot reverse transfer. Recipient account ${tx.receiverAccount} has insufficient balance (৳${receiverAcc.balance.toLocaleString()}) to cover the reversal amount of ৳${tx.amount.toLocaleString()}.`
            );
          }

          // Conditional atomic debit from recipient
          const debitReceiver = await accountsCol.findOneAndUpdate(
            {
              accountNumber: tx.receiverAccount,
              balance: { $gte: tx.amount },
            },
            {
              $inc: { balance: -tx.amount },
              $set: { updatedAt: now },
            },
            { session, returnDocument: "after" }
          );

          if (!debitReceiver) {
            throw new BadRequestError(
              "Failed to debit recipient account: Insufficient funds or account balance changed concurrently."
            );
          }

          // Credit sender with amount + fee (reversing full debit)
          const totalRefund = tx.amount + (tx.fee || 0);
          const creditSender = await accountsCol.findOneAndUpdate(
            { accountNumber: tx.senderAccount },
            {
              $inc: { balance: totalRefund },
              $set: { updatedAt: now },
            },
            { session, returnDocument: "after" }
          );

          if (!creditSender) {
            throw new NotFoundError(`Sender account ${tx.senderAccount} could not be credited.`);
          }
        } else if (tx.type === "DEPOSIT") {
          if (!tx.receiverAccount) {
            throw new BadRequestError(`Cannot reverse deposit ${tx.transactionId}: missing recipient account.`);
          }

          const receiverAcc = await accountsCol.findOne(
            { accountNumber: tx.receiverAccount },
            { session }
          );
          if (!receiverAcc) {
            throw new NotFoundError(`Account ${tx.receiverAccount} was not found.`);
          }

          if (receiverAcc.balance < tx.amount) {
            throw new BadRequestError(
              `Cannot reverse deposit. Account ${tx.receiverAccount} has insufficient balance (৳${receiverAcc.balance.toLocaleString()}) to cover the reversal amount of ৳${tx.amount.toLocaleString()}.`
            );
          }

          const debitReceiver = await accountsCol.findOneAndUpdate(
            {
              accountNumber: tx.receiverAccount,
              balance: { $gte: tx.amount },
            },
            {
              $inc: { balance: -tx.amount },
              $set: { updatedAt: now },
            },
            { session, returnDocument: "after" }
          );

          if (!debitReceiver) {
            throw new BadRequestError(
              "Failed to debit account: Insufficient funds or account balance changed concurrently."
            );
          }
        } else if (tx.type === "WITHDRAWAL") {
          if (!tx.senderAccount) {
            throw new BadRequestError(`Cannot reverse withdrawal ${tx.transactionId}: missing sender account.`);
          }

          const creditSender = await accountsCol.findOneAndUpdate(
            { accountNumber: tx.senderAccount },
            {
              $inc: { balance: tx.amount },
              $set: { updatedAt: now },
            },
            { session, returnDocument: "after" }
          );

          if (!creditSender) {
            throw new NotFoundError(`Account ${tx.senderAccount} could not be credited.`);
          }
        }

        // Step 3: Audit Log
        await auditCol.insertOne(
          {
            performedBy: reviewerEmail.toLowerCase(),
            role: "ADMIN",
            action: "TRANSACTION_REVERSED",
            targetType: "Transaction",
            target: tx.transactionId,
            description: `Reversed ${tx.type} transaction ${tx.transactionId} of ৳${tx.amount.toLocaleString()}. Reason: ${reversalReason}`,
            metadata: {
              transactionId: tx.transactionId,
              type: tx.type,
              amount: tx.amount,
              fee: tx.fee,
              reversalReason,
            },
            createdAt: now,
          },
          { session }
        );

        // Step 4: Notification to affected initiator
        if (tx.initiatedBy) {
          await notifCol.insertOne(
            {
              type: "TRANSACTION_REVERSED",
              user: tx.initiatedBy.toLowerCase(),
              title: "Transaction Reversed",
              message: `Transaction ${tx.transactionId} (${tx.type}) for ৳${tx.amount.toLocaleString()} has been reversed by administration. Reason: ${reversalReason}`,
              relatedModel: "Transaction",
              relatedId: tx.transactionId,
              read: false,
              createdAt: now,
              updatedAt: now,
            },
            { session }
          );
        }
      });
    } finally {
      await session.endSession();
    }

    return reversedTx!;
  }
}
