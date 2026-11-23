import { getDatabase } from "@/lib/mongodb";
import { COLLECTIONS, type DbBankSettings } from "@/types";

const DEFAULT_SETTINGS: DbBankSettings = {
  key: "bank-settings",
  dailyTransferLimit: 5000000,
  maxSingleTransaction: 2500000,
  minAccountBalance: 0,
  defaultTransactionFee: {
    percent: 0.1,
    minimum: 50,
  },
  twoFactorThreshold: 1000000,
  loanInterestRates: {
    PERSONAL: 12,
    HOME: 8,
    CAR: 10,
    EDUCATION: 7,
    BUSINESS: 11,
  },
  updatedBy: "system",
  createdAt: new Date(),
  updatedAt: new Date(),
};

export class SettingsService {
  /**
   * Retrieves active bank configuration from bankSettings collection.
   */
  static async getBankSettings(): Promise<DbBankSettings> {
    const db = await getDatabase();
    const settings = await db
      .collection<DbBankSettings>(COLLECTIONS.BANK_SETTINGS)
      .findOne({ key: "bank-settings" });

    return settings || DEFAULT_SETTINGS;
  }

  /**
   * Calculates the transaction fee for a transfer.
   * - Own account transfers are free (৳0 fee).
   * - Customer-to-customer transfers calculate percent fee (e.g. 0.1%) with minimum floor (e.g. ৳50).
   */
  static async calculateTransferFee(
    amount: number,
    isOwnAccount: boolean,
    cachedSettings?: DbBankSettings
  ): Promise<number> {
    if (isOwnAccount) {
      return 0;
    }

    const settings = cachedSettings || (await this.getBankSettings());
    const { percent, minimum } = settings.defaultTransactionFee;

    const rawFee = amount * (percent / 100);
    const fee = Math.max(minimum, Math.round(rawFee));

    return fee;
  }
}
