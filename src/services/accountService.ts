import { getDatabase } from "@/lib/mongodb";
import { COLLECTIONS, type DbBankAccount, type AccountType, type AccountStatus, type UserRole } from "@/types";
import { NotFoundError, ForbiddenError, BadRequestError } from "@/server/auth/errors";
import { validateAmount } from "@/validators/accountValidator";

export interface AccountQueryOptions {
  owner?: string;
  type?: AccountType;
  status?: AccountStatus;
  search?: string;
  page?: number;
  limit?: number;
}

export class AccountService {
  /**
   * Retrieves all bank accounts belonging to a specific owner.
   */
  static async getAccountsByOwner(ownerEmail: string): Promise<DbBankAccount[]> {
    if (!ownerEmail) return [];
    const db = await getDatabase();
    return db
      .collection<DbBankAccount>(COLLECTIONS.ACCOUNTS)
      .find({ owner: ownerEmail.toLowerCase() })
      .sort({ createdAt: -1 })
      .toArray();
  }

  /**
   * Retrieves a single bank account by its unique account number.
   */
  static async getAccountByNumber(accountNumber: string): Promise<DbBankAccount | null> {
    if (!accountNumber) return null;
    const db = await getDatabase();
    return db
      .collection<DbBankAccount>(COLLECTIONS.ACCOUNTS)
      .findOne({ accountNumber: accountNumber.trim() });
  }

  /**
   * Lists bank accounts with optional filters and pagination (Admin / Staff).
   */
  static async listAccounts(options: AccountQueryOptions = {}) {
    const db = await getDatabase();
    const filter: Record<string, unknown> = {};

    if (options.owner) {
      filter.owner = options.owner.toLowerCase().trim();
    }

    if (options.type) {
      filter.type = options.type;
    }

    if (options.status) {
      filter.status = options.status;
    }

    if (options.search) {
      const searchRegex = new RegExp(options.search.trim(), "i");
      filter.$or = [
        { accountNumber: searchRegex },
        { owner: searchRegex },
      ];
    }

    const page = Math.max(1, options.page || 1);
    const limit = Math.min(100, Math.max(1, options.limit || 20));
    const skip = (page - 1) * limit;

    const collection = db.collection<DbBankAccount>(COLLECTIONS.ACCOUNTS);
    const [accounts, total] = await Promise.all([
      collection.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
      collection.countDocuments(filter),
    ]);

    return {
      accounts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Validates that the requested account exists and that the user is authorized to access it.
   * - Customers can ONLY access accounts they own.
   * - Banking Staff and Admins have authorized operational access.
   */
  static async validateAccountOwnership(
    accountNumber: string,
    userEmail: string,
    userRole: UserRole
  ): Promise<DbBankAccount> {
    const account = await this.getAccountByNumber(accountNumber);

    if (!account) {
      throw new NotFoundError(`Bank account ${accountNumber} was not found.`);
    }

    if (userRole === "customer" && account.owner.toLowerCase() !== userEmail.toLowerCase()) {
      throw new ForbiddenError("Access denied. You can only view and manage your own bank accounts.");
    }

    return account;
  }

  /**
   * Verifies that the bank account is currently ACTIVE.
   * Throws ForbiddenError if FROZEN or CLOSED.
   */
  static validateAccountStatus(account: DbBankAccount): void {
    if (account.status === "FROZEN") {
      throw new ForbiddenError(
        `Account ${account.accountNumber} is currently FROZEN. Transactions are temporarily suspended.`
      );
    }

    if (account.status === "CLOSED") {
      throw new ForbiddenError(
        `Account ${account.accountNumber} is CLOSED. No operations are permitted.`
      );
    }

    if (account.status !== "ACTIVE") {
      throw new ForbiddenError(
        `Account ${account.accountNumber} is inactive (status: ${account.status}).`
      );
    }
  }

  /**
   * Validates account balance and transaction limits before executing a debit operation.
   * Checks:
   * 1. Account status is ACTIVE.
   * 2. Amount > 0.
   * 3. Amount <= maxTransaction limit.
   * 4. Balance - Amount >= minBalance.
   */
  static validateDebitLimits(account: DbBankAccount, rawAmount: number): number {
    this.validateAccountStatus(account);

    const amount = validateAmount(rawAmount);

    if (account.maxTransaction > 0 && amount > account.maxTransaction) {
      throw new BadRequestError(
        `Transaction amount exceeds the single transaction limit of ৳${account.maxTransaction.toLocaleString()}.`
      );
    }

    const availableBalance = account.balance - account.minBalance;
    if (amount > availableBalance) {
      throw new BadRequestError(
        `Insufficient funds. Current balance is ৳${account.balance.toLocaleString()}, with a required minimum balance of ৳${account.minBalance.toLocaleString()}. Maximum available to debit is ৳${Math.max(0, availableBalance).toLocaleString()}.`
      );
    }

    return amount;
  }

  /**
   * Validates that an account can receive a credit/deposit.
   */
  static validateCreditAccount(account: DbBankAccount, rawAmount: number): number {
    this.validateAccountStatus(account);
    return validateAmount(rawAmount);
  }
}
