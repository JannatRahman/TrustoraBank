import { clientPromise, getDatabase } from "@/lib/mongodb";
import {
  COLLECTIONS,
  type DbRequest,
  type DbBankAccount,
  type DbTransaction,
  type DbAuditLog,
  type DbNotification,
  type UserRole,
} from "@/types";
import {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} from "@/server/auth/errors";
import { AccountService } from "@/services/accountService";
import { PinService } from "@/services/pinService";
import { TransactionService } from "@/services/transactionService";
import type {
  CreateRequestPayload,
  ReviewRequestPayload,
  RequestQueryParams,
} from "@/validators/requestValidator";

export class RequestService {
  /**
   * Generates a request ID matching the pattern: REQ-YYYYMMDD-HEX6
   */
  static generateRequestId(date: Date = new Date()): string {
    const yyyymmdd = date.toISOString().slice(0, 10).replace(/-/g, "");
    const hex = Math.random().toString(16).substring(2, 8).toUpperCase();
    return `REQ-${yyyymmdd}-${hex}`;
  }

  /**
   * Submits a new deposit or withdrawal request for a customer.
   * - Validates account ownership.
   * - Enforces ACTIVE status.
   * - For withdrawals, verifies the transaction PIN and checks limits/available balance.
   * - Does NOT alter account balances (funds remain untouched until approved).
   */
  static async createRequest(
    userEmail: string,
    userRole: UserRole,
    payload: CreateRequestPayload
  ): Promise<DbRequest> {
    const { account, type, amount, description, pin } = payload;

    const bankAccount = await AccountService.validateAccountOwnership(
      account,
      userEmail,
      userRole
    );

    AccountService.validateAccountStatus(bankAccount);

    if (type === "WITHDRAWAL") {
      if (!pin) {
        throw new BadRequestError("Transaction PIN is required to authorize a withdrawal request.");
      }
      await PinService.verifyTransactionPin(userEmail, pin);
      AccountService.validateDebitLimits(bankAccount, amount);
    } else {
      AccountService.validateCreditAccount(bankAccount, amount);
    }

    const db = await getDatabase();
    const now = new Date();
    const requestId = this.generateRequestId(now);

    const requestDoc: DbRequest = {
      requestId,
      user: userEmail.toLowerCase(),
      account: bankAccount.accountNumber,
      type,
      amount,
      description:
        description ||
        (type === "DEPOSIT" ? "Deposit request" : "Withdrawal request"),
      status: "PENDING",
      requestedAt: now,
      createdAt: now,
      updatedAt: now,
    };

    await db.collection<DbRequest>(COLLECTIONS.REQUESTS).insertOne(requestDoc);

    return requestDoc;
  }

  /**
   * Approves a pending deposit or withdrawal request (Staff or Admin only).
   * Atomically:
   * 1. Updates request status to APPROVED (preventing duplicate approvals).
   * 2. Credits (for deposit) or debits (for withdrawal) the account balance.
   * 3. Creates the corresponding completed Transaction record.
   * 4. Logs to auditLogs and dispatches notification.
   */
  static async approveRequest(
    requestId: string,
    reviewerEmail: string,
    reviewerRole: UserRole
  ): Promise<{ request: DbRequest; transaction: DbTransaction }> {
    const db = await getDatabase();
    const requestsCol = db.collection<DbRequest>(COLLECTIONS.REQUESTS);
    const accountsCol = db.collection<DbBankAccount>(COLLECTIONS.ACCOUNTS);
    const txCol = db.collection<DbTransaction>(COLLECTIONS.TRANSACTIONS);
    const auditCol = db.collection<DbAuditLog>(COLLECTIONS.AUDIT_LOGS);
    const notifCol = db.collection<DbNotification>(COLLECTIONS.NOTIFICATIONS);

    // 1. Fetch Request
    const request = await requestsCol.findOne({ requestId: requestId.trim() });
    if (!request) {
      throw new NotFoundError(`Request ${requestId} was not found.`);
    }

    if (request.status !== "PENDING") {
      throw new BadRequestError(
        `Request ${requestId} has already been processed (current status: ${request.status}).`
      );
    }

    // Strict self-review prevention: Staff and Admins cannot approve their own requests
    if (request.user.toLowerCase() === reviewerEmail.toLowerCase()) {
      throw new ForbiddenError(
        "Banking staff and administrators cannot review or approve their own deposit or withdrawal requests."
      );
    }

    // 2. Fetch & Validate Bank Account
    const account = await AccountService.getAccountByNumber(request.account);
    if (!account) {
      throw new NotFoundError(`Account ${request.account} was not found.`);
    }

    AccountService.validateAccountStatus(account);

    // If withdrawal, verify available funds at approval time
    if (request.type === "WITHDRAWAL") {
      const available = account.balance - account.minBalance;
      if (request.amount > available) {
        throw new BadRequestError(
          `Cannot approve withdrawal. Account balance is insufficient to satisfy the minimum balance requirement of ৳${account.minBalance.toLocaleString()}. Available: ৳${Math.max(0, available).toLocaleString()}.`
        );
      }
    }

    // 3. Atomic MongoDB Execution
    const client = await clientPromise;
    const session = client.startSession();

    let completedTx: DbTransaction | null = null;
    let approvedRequest: DbRequest | null = null;
    const now = new Date();
    const transactionId = TransactionService.generateTransactionId(now);

    try {
      await session.withTransaction(async () => {
        // Step A: Conditionally transition request from PENDING -> APPROVED
        const reqResult = await requestsCol.findOneAndUpdate(
          { requestId: request.requestId, status: "PENDING" },
          {
            $set: {
              status: "APPROVED",
              reviewedBy: reviewerEmail.toLowerCase(),
              reviewedAt: now,
              transaction: transactionId,
              updatedAt: now,
            },
          },
          { session, returnDocument: "after" }
        );

        if (!reqResult) {
          throw new BadRequestError("Request was already processed by another reviewer concurrently.");
        }
        approvedRequest = reqResult;

        // Step B: Update Account Balance
        if (request.type === "DEPOSIT") {
          const accUpdate = await accountsCol.findOneAndUpdate(
            { accountNumber: request.account, status: "ACTIVE" },
            {
              $inc: { balance: request.amount },
              $set: { updatedAt: now },
            },
            { session, returnDocument: "after" }
          );

          if (!accUpdate) {
            throw new BadRequestError("Failed to credit account: Account is inactive or does not exist.");
          }

          completedTx = {
            transactionId,
            type: "DEPOSIT",
            status: "COMPLETED",
            receiverAccount: request.account,
            amount: request.amount,
            fee: 0,
            description: request.description || "Deposit request approved",
            initiatedBy: request.user.toLowerCase(),
            processedBy: reviewerEmail.toLowerCase(),
            requestId: request.requestId,
            receiverBalanceAfter: accUpdate.balance,
            createdAt: now,
            updatedAt: now,
          };
        } else {
          // WITHDRAWAL
          const accUpdate = await accountsCol.findOneAndUpdate(
            {
              accountNumber: request.account,
              status: "ACTIVE",
              balance: { $gte: request.amount + account.minBalance },
            },
            {
              $inc: { balance: -request.amount },
              $set: { updatedAt: now },
            },
            { session, returnDocument: "after" }
          );

          if (!accUpdate) {
            throw new BadRequestError("Failed to debit account: Insufficient funds or account status changed.");
          }

          completedTx = {
            transactionId,
            type: "WITHDRAWAL",
            status: "COMPLETED",
            senderAccount: request.account,
            amount: request.amount,
            fee: 0,
            description: request.description || "Withdrawal request approved",
            initiatedBy: request.user.toLowerCase(),
            processedBy: reviewerEmail.toLowerCase(),
            requestId: request.requestId,
            senderBalanceAfter: accUpdate.balance,
            createdAt: now,
            updatedAt: now,
          };
        }

        // Step C: Insert Transaction
        await txCol.insertOne(completedTx, { session });

        // Step D: Write Audit Log
        const role = reviewerRole === "admin" ? "ADMIN" : "STAFF";
        await auditCol.insertOne(
          {
            performedBy: reviewerEmail.toLowerCase(),
            role,
            action: `${request.type}_REQUEST_APPROVED`,
            targetType: "Request",
            target: request.requestId,
            description: `Approved ${request.type.toLowerCase()} request ${request.requestId} of ৳${request.amount.toLocaleString()} for account ${request.account}`,
            metadata: {
              requestId: request.requestId,
              transactionId,
              amount: request.amount,
              account: request.account,
            },
            createdAt: now,
          },
          { session }
        );

        // Step E: Send Customer Notification
        await notifCol.insertOne(
          {
            type: `${request.type}_APPROVED`,
            user: request.user.toLowerCase(),
            title: `${request.type === "DEPOSIT" ? "Deposit" : "Withdrawal"} Approved`,
            message: `Your ${request.type.toLowerCase()} request for ৳${request.amount.toLocaleString()} has been approved. Transaction ID: ${transactionId}.`,
            relatedModel: "Transaction",
            relatedId: transactionId,
            read: false,
            createdAt: now,
            updatedAt: now,
          },
          { session }
        );
      });
    } finally {
      await session.endSession();
    }

    if (!approvedRequest || !completedTx) {
      throw new BadRequestError("Failed to complete request approval.");
    }

    return { request: approvedRequest, transaction: completedTx };
  }

  /**
   * Rejects a pending deposit or withdrawal request (Staff or Admin only).
   * Does NOT modify any account balances.
   */
  static async rejectRequest(
    requestId: string,
    reviewerEmail: string,
    reviewerRole: UserRole,
    rejectionReason?: string
  ): Promise<DbRequest> {
    const db = await getDatabase();
    const requestsCol = db.collection<DbRequest>(COLLECTIONS.REQUESTS);
    const auditCol = db.collection<DbAuditLog>(COLLECTIONS.AUDIT_LOGS);
    const notifCol = db.collection<DbNotification>(COLLECTIONS.NOTIFICATIONS);

    const now = new Date();
    const reason = rejectionReason || "Rejected by banking operations staff.";

    // Fetch and check request before updating
    const existingReq = await requestsCol.findOne({ requestId: requestId.trim() });
    if (!existingReq) {
      throw new NotFoundError(`Request ${requestId} was not found.`);
    }

    if (existingReq.status !== "PENDING") {
      throw new BadRequestError(
        `Request ${requestId} has already been processed (current status: ${existingReq.status}).`
      );
    }

    // Strict self-review prevention: Staff and Admins cannot reject their own requests
    if (existingReq.user.toLowerCase() === reviewerEmail.toLowerCase()) {
      throw new ForbiddenError(
        "Banking staff and administrators cannot review or reject their own deposit or withdrawal requests. An independent staff member or administrator must review this request."
      );
    }

    const reqResult = await requestsCol.findOneAndUpdate(
      { requestId: requestId.trim(), status: "PENDING" },
      {
        $set: {
          status: "REJECTED",
          reviewedBy: reviewerEmail.toLowerCase(),
          reviewedAt: now,
          rejectionReason: reason,
          updatedAt: now,
        },
      },
      { returnDocument: "after" }
    );

    if (!reqResult) {
      throw new BadRequestError(
        `Request ${requestId} has already been processed or is not found.`
      );
    }

    // Write Audit Log
    const role = reviewerRole === "admin" ? "ADMIN" : "STAFF";
    await auditCol.insertOne({
      performedBy: reviewerEmail.toLowerCase(),
      role,
      action: `${reqResult.type}_REQUEST_REJECTED`,
      targetType: "Request",
      target: reqResult.requestId,
      description: `Rejected ${reqResult.type.toLowerCase()} request ${reqResult.requestId}. Reason: ${reason}`,
      metadata: { requestId: reqResult.requestId, reason },
      createdAt: now,
    });

    // Send Customer Notification
    await notifCol.insertOne({
      type: `${reqResult.type}_REJECTED`,
      user: reqResult.user.toLowerCase(),
      title: `${reqResult.type === "DEPOSIT" ? "Deposit" : "Withdrawal"} Request Rejected`,
      message: `Your ${reqResult.type.toLowerCase()} request for ৳${reqResult.amount.toLocaleString()} was rejected. Reason: ${reason}`,
      relatedModel: "Request",
      relatedId: reqResult.requestId,
      read: false,
      createdAt: now,
      updatedAt: now,
    });

    return reqResult;
  }

  /**
   * Retrieves requests with role-based scoping, filtering, and pagination.
   */
  static async listRequests(
    userEmail: string,
    userRole: UserRole,
    query: RequestQueryParams = {}
  ) {
    const db = await getDatabase();
    const collection = db.collection<DbRequest>(COLLECTIONS.REQUESTS);
    const filter: Record<string, unknown> = {};

    if (userRole === "customer") {
      filter.user = userEmail.toLowerCase();
    } else {
      if (query.userEmail) {
        filter.user = query.userEmail.toLowerCase().trim();
      }
    }

    if (query.accountNumber) {
      filter.account = query.accountNumber.trim();
    }

    if (query.status) {
      filter.status = query.status;
    }

    if (query.type) {
      filter.type = query.type;
    }

    const page = Math.max(1, query.page || 1);
    const limit = Math.min(100, Math.max(1, query.limit || 20));
    const skip = (page - 1) * limit;

    const [requests, total] = await Promise.all([
      collection.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
      collection.countDocuments(filter),
    ]);

    return {
      requests,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Retrieves single request by requestId with authorization check.
   */
  static async getRequestById(
    requestId: string,
    userEmail: string,
    userRole: UserRole
  ): Promise<DbRequest> {
    const db = await getDatabase();
    const request = await db
      .collection<DbRequest>(COLLECTIONS.REQUESTS)
      .findOne({ requestId: requestId.trim() });

    if (!request) {
      throw new NotFoundError(`Request ${requestId} was not found.`);
    }

    if (userRole === "customer" && request.user.toLowerCase() !== userEmail.toLowerCase()) {
      throw new ForbiddenError("Access denied. You can only view your own requests.");
    }

    return request;
  }
}
