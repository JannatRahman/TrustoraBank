import { clientPromise, getDatabase } from "@/lib/mongodb";
import {
  COLLECTIONS,
  type DbTransaction,
  type DbBankAccount,
  type DbAuditLog,
  type DbNotification,
  type UserRole,
} from "@/types";
import {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} from "@/server/auth/errors";
import { PinService } from "@/services/pinService";
import { SettingsService } from "@/services/settingsService";
import { AccountService } from "@/services/accountService";
import type { TransferPayload, TransactionQueryParams } from "@/validators/transactionValidator";

export class TransactionService {
  /**
   * Generates a transaction ID matching the pattern: TXN-YYYYMMDD-HEX8
   */
  static generateTransactionId(date: Date = new Date()): string {
    const yyyymmdd = date.toISOString().slice(0, 10).replace(/-/g, "");
    const hex = Math.random().toString(16).substring(2, 10).toUpperCase();
    return `TXN-${yyyymmdd}-${hex}`;
  }

  /**
   * Executes an atomic money transfer between accounts.
   * Handles:
   * 1. Own account transfers (0 fee)
   * 2. Customer-to-customer transfers (calculated fee from bankSettings)
   * 3. Server-side PIN verification & failed-attempt tracking
   * 4. Multi-document atomic MongoDB transaction with rollback on any failure
   * 5. Audit logging & user notifications
   */
  static async executeTransfer(
    senderUserEmail: string,
    payload: TransferPayload
  ): Promise<DbTransaction> {
    const {
      senderAccount,
      receiverAccount,
      amount,
      pin,
      description,
      idempotencyKey,
    } = payload;

    const db = await getDatabase();
    const transactionsCol = db.collection<DbTransaction>(COLLECTIONS.TRANSACTIONS);
    const accountsCol = db.collection<DbBankAccount>(COLLECTIONS.ACCOUNTS);
    const auditCol = db.collection<DbAuditLog>(COLLECTIONS.AUDIT_LOGS);
    const notificationsCol = db.collection<DbNotification>(COLLECTIONS.NOTIFICATIONS);

    // 1. Idempotency Check
    if (idempotencyKey) {
      const existingTx = await transactionsCol.findOne({ idempotencyKey });
      if (existingTx) {
        if (existingTx.status === "COMPLETED") {
          return existingTx; // Safely return idempotent completed transfer
        }
        if (existingTx.status === "PENDING") {
          throw new BadRequestError("A transaction with this idempotency key is currently pending.");
        }
      }
    }

    // 2. Fetch & Validate Sender Account
    const senderDoc = await AccountService.getAccountByNumber(senderAccount);
    if (!senderDoc) {
      throw new NotFoundError(`Sender account ${senderAccount} was not found.`);
    }

    if (senderDoc.owner.toLowerCase() !== senderUserEmail.toLowerCase()) {
      throw new ForbiddenError("Access denied. You can only debit your own bank accounts.");
    }

    AccountService.validateAccountStatus(senderDoc);

    // 3. Fetch & Validate Recipient Account
    const receiverDoc = await AccountService.getAccountByNumber(receiverAccount);
    if (!receiverDoc) {
      throw new NotFoundError(`Recipient account ${receiverAccount} was not found.`);
    }

    AccountService.validateAccountStatus(receiverDoc);

    // 4. Verify Transaction PIN
    await PinService.verifyTransactionPin(senderUserEmail, pin);

    // 5. Determine Transfer Mode & Calculate Fee
    const isOwnAccount = senderDoc.owner.toLowerCase() === receiverDoc.owner.toLowerCase();
    const settings = await SettingsService.getBankSettings();
    const fee = await SettingsService.calculateTransferFee(amount, isOwnAccount, settings);
    const totalDebit = amount + fee;

    // 6. Enforce Transaction Limits
    const maxTxn = Math.min(
      senderDoc.maxTransaction || Infinity,
      settings.maxSingleTransaction || Infinity
    );
    if (amount > maxTxn) {
      throw new BadRequestError(
        `Transfer amount exceeds the maximum single transaction limit of ৳${maxTxn.toLocaleString()}.`
      );
    }

    // Daily transfer limit check
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const todayAgg = await transactionsCol
      .aggregate([
        {
          $match: {
            senderAccount: senderAccount,
            type: "TRANSFER",
            status: "COMPLETED",
            createdAt: { $gte: startOfDay },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ])
      .toArray();

    const transferredToday = todayAgg[0]?.total || 0;
    const maxDaily = Math.min(
      senderDoc.dailyLimit || Infinity,
      settings.dailyTransferLimit || Infinity
    );

    if (transferredToday + amount > maxDaily) {
      throw new BadRequestError(
        `Transfer would exceed the daily transfer limit of ৳${maxDaily.toLocaleString()}. Already transferred today: ৳${transferredToday.toLocaleString()}.`
      );
    }

    // Check available balance (including minimum balance & fee)
    const availableBalance = senderDoc.balance - senderDoc.minBalance;
    if (totalDebit > availableBalance) {
      throw new BadRequestError(
        `Insufficient available funds. Required: ৳${totalDebit.toLocaleString()} (৳${amount.toLocaleString()} + ৳${fee.toLocaleString()} fee), Available: ৳${Math.max(0, availableBalance).toLocaleString()} (Min balance: ৳${senderDoc.minBalance.toLocaleString()}).`
      );
    }

    // 7. Atomic MongoDB Transaction Execution
    const client = await clientPromise;
    const session = client.startSession();

    let completedTransaction: DbTransaction | null = null;
    const now = new Date();
    const transactionId = this.generateTransactionId(now);

    try {
      await session.withTransaction(async () => {
        // Atomic debit with balance & status check
        const senderUpdate = await accountsCol.findOneAndUpdate(
          {
            accountNumber: senderAccount,
            status: "ACTIVE",
            balance: { $gte: totalDebit + senderDoc.minBalance },
          },
          {
            $inc: { balance: -totalDebit },
            $set: { updatedAt: now },
          },
          { session, returnDocument: "after" }
        );

        if (!senderUpdate) {
          throw new BadRequestError("Insufficient available balance or account status changed concurrently.");
        }

        // Atomic credit to receiver
        const receiverUpdate = await accountsCol.findOneAndUpdate(
          {
            accountNumber: receiverAccount,
            status: "ACTIVE",
          },
          {
            $inc: { balance: amount },
            $set: { updatedAt: now },
          },
          { session, returnDocument: "after" }
        );

        if (!receiverUpdate) {
          throw new BadRequestError("Recipient account could not receive funds or is inactive.");
        }

        // Create transaction record
        completedTransaction = {
          transactionId,
          type: "TRANSFER",
          status: "COMPLETED",
          senderAccount,
          receiverAccount,
          amount,
          fee,
          description:
            description ||
            (isOwnAccount ? "Transfer between own accounts" : `Transfer to account ${receiverAccount}`),
          initiatedBy: senderUserEmail.toLowerCase(),
          senderBalanceAfter: senderUpdate.balance,
          receiverBalanceAfter: receiverUpdate.balance,
          idempotencyKey,
          createdAt: now,
          updatedAt: now,
        };

        await transactionsCol.insertOne(completedTransaction, { session });

        // Record Audit Log
        await auditCol.insertOne(
          {
            performedBy: senderUserEmail.toLowerCase(),
            role: "CUSTOMER",
            action: "TRANSFER_EXECUTED",
            targetType: "Transaction",
            target: transactionId,
            description: `Transferred ৳${amount.toLocaleString()} from ${senderAccount} to ${receiverAccount} (Fee: ৳${fee})`,
            metadata: {
              amount,
              fee,
              senderAccount,
              receiverAccount,
              isOwnAccount,
              idempotencyKey,
            },
            createdAt: now,
          },
          { session }
        );

        // Sender Notification
        await notificationsCol.insertOne(
          {
            type: "TRANSFER_SENT",
            user: senderUserEmail.toLowerCase(),
            title: "Transfer Sent",
            message: `Successfully sent ৳${amount.toLocaleString()} to account ${receiverAccount}. Transaction ID: ${transactionId}.`,
            relatedModel: "Transaction",
            relatedId: transactionId,
            read: false,
            createdAt: now,
            updatedAt: now,
          },
          { session }
        );

        // Recipient Notification (if distinct user)
        if (!isOwnAccount) {
          await notificationsCol.insertOne(
            {
              type: "TRANSFER_RECEIVED",
              user: receiverDoc.owner.toLowerCase(),
              title: "Money Received",
              message: `You received ৳${amount.toLocaleString()} in account ${receiverAccount} from ${senderAccount}. Transaction ID: ${transactionId}.`,
              relatedModel: "Transaction",
              relatedId: transactionId,
              read: false,
              createdAt: now,
              updatedAt: now,
            },
            { session }
          );
        }
      });
    } catch (err: unknown) {
      // Gracefully handle concurrent duplicate key race conditions on idempotencyKey
      if (
        idempotencyKey &&
        err &&
        typeof err === "object" &&
        "code" in err &&
        (err as { code: number }).code === 11000
      ) {
        const existingTx = await transactionsCol.findOne({ idempotencyKey });
        if (existingTx && existingTx.status === "COMPLETED") {
          return existingTx;
        }
      }
      throw err;
    } finally {
      await session.endSession();
    }

    if (!completedTransaction) {
      throw new BadRequestError("Transaction failed to complete.");
    }

    return completedTransaction;
  }

  /**
   * Retrieves transaction history with pagination and role-based filtering.
   */
  static async getTransactionHistory(
    userEmail: string,
    userRole: UserRole,
    query: TransactionQueryParams = {}
  ) {
    const db = await getDatabase();
    const collection = db.collection<DbTransaction>(COLLECTIONS.TRANSACTIONS);
    const filter: Record<string, unknown> = {};

    // Role-based scope
    if (userRole === "customer") {
      // Find all accounts owned by the customer
      const myAccounts = await AccountService.getAccountsByOwner(userEmail);
      const myAccountNumbers = myAccounts.map((a) => a.accountNumber);

      if (query.accountNumber) {
        // Must be one of their own accounts
        if (!myAccountNumbers.includes(query.accountNumber)) {
          throw new ForbiddenError("Access denied. You can only view transactions for your own accounts.");
        }
        filter.$or = [
          { senderAccount: query.accountNumber },
          { receiverAccount: query.accountNumber },
        ];
      } else {
        filter.$or = [
          { senderAccount: { $in: myAccountNumbers } },
          { receiverAccount: { $in: myAccountNumbers } },
          { initiatedBy: userEmail.toLowerCase() },
        ];
      }
    } else {
      // Staff / Admin can filter by any account
      if (query.accountNumber) {
        filter.$or = [
          { senderAccount: query.accountNumber },
          { receiverAccount: query.accountNumber },
        ];
      }
    }

    if (query.type) {
      filter.type = query.type;
    }

    if (query.status) {
      filter.status = query.status;
    }

    if (query.startDate || query.endDate) {
      const dateFilter: Record<string, Date> = {};
      if (query.startDate) {
        dateFilter.$gte = new Date(query.startDate);
      }
      if (query.endDate) {
        dateFilter.$lte = new Date(query.endDate);
      }
      filter.createdAt = dateFilter;
    }

    const page = Math.max(1, query.page || 1);
    const limit = Math.min(100, Math.max(1, query.limit || 20));
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      collection.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
      collection.countDocuments(filter),
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
   * Retrieves single transaction details by transactionId with authorization check.
   */
  static async getTransactionById(
    transactionId: string,
    userEmail: string,
    userRole: UserRole
  ): Promise<DbTransaction> {
    const db = await getDatabase();
    const transaction = await db
      .collection<DbTransaction>(COLLECTIONS.TRANSACTIONS)
      .findOne({ transactionId: transactionId.trim() });

    if (!transaction) {
      throw new NotFoundError(`Transaction ${transactionId} was not found.`);
    }

    if (userRole === "customer") {
      const myAccounts = await AccountService.getAccountsByOwner(userEmail);
      const myAccountNumbers = myAccounts.map((a) => a.accountNumber);

      const isParticipant =
        (transaction.senderAccount && myAccountNumbers.includes(transaction.senderAccount)) ||
        (transaction.receiverAccount && myAccountNumbers.includes(transaction.receiverAccount)) ||
        transaction.initiatedBy.toLowerCase() === userEmail.toLowerCase();

      if (!isParticipant) {
        throw new ForbiddenError("Access denied. You can only view your own transactions.");
      }
    }

    return transaction;
  }
}
