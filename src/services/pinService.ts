import bcrypt from "bcryptjs";
import { getDatabase } from "@/lib/mongodb";
import { COLLECTIONS, type DbTransactionPin } from "@/types";
import { BadRequestError, ForbiddenError, NotFoundError } from "@/server/auth/errors";
import { validatePinFormat } from "@/validators/pinValidator";

export const PIN_CONFIG = {
  MAX_FAILED_ATTEMPTS: 5,
  LOCKOUT_DURATION_MS: 15 * 60 * 1000, // 15 minutes lockout
  BCRYPT_SALT_ROUNDS: 10,
} as const;

export interface PinStatus {
  hasPin: boolean;
  isLocked: boolean;
  lockedUntil?: string | null;
  remainingAttempts: number;
}

export class PinService {
  /**
   * Retrieves PIN status for a user without ever exposing the hash.
   */
  static async getPinStatus(userEmail: string): Promise<PinStatus> {
    if (!userEmail) {
      throw new BadRequestError("User email is required.");
    }

    const db = await getDatabase();
    const record = await db
      .collection<DbTransactionPin>(COLLECTIONS.TRANSACTION_PINS)
      .findOne({ user: userEmail.toLowerCase() });

    if (!record) {
      return {
        hasPin: false,
        isLocked: false,
        remainingAttempts: PIN_CONFIG.MAX_FAILED_ATTEMPTS,
      };
    }

    const now = new Date();
    const isLocked = Boolean(record.lockedUntil && new Date(record.lockedUntil) > now);
    const failedAttempts = isLocked ? PIN_CONFIG.MAX_FAILED_ATTEMPTS : record.failedAttempts || 0;
    const remainingAttempts = Math.max(0, PIN_CONFIG.MAX_FAILED_ATTEMPTS - failedAttempts);

    return {
      hasPin: true,
      isLocked,
      lockedUntil: isLocked && record.lockedUntil ? new Date(record.lockedUntil).toISOString() : null,
      remainingAttempts,
    };
  }

  /**
   * Verifies the user's transaction PIN against the stored bcrypt hash.
   * Tracks failed attempts and enforces temporary lockout after consecutive failures.
   */
  static async verifyTransactionPin(userEmail: string, rawPin: string): Promise<boolean> {
    const pin = validatePinFormat(rawPin);

    const db = await getDatabase();
    const collection = db.collection<DbTransactionPin>(COLLECTIONS.TRANSACTION_PINS);
    const normalizedEmail = userEmail.toLowerCase();

    const record = await collection.findOne({ user: normalizedEmail });

    if (!record || !record.pinHash) {
      throw new BadRequestError(
        "No transaction PIN has been set. Please set up your transaction PIN first."
      );
    }

    const now = new Date();

    // Check if currently locked out
    if (record.lockedUntil) {
      const lockDate = new Date(record.lockedUntil);
      if (lockDate > now) {
        const remainingMinutes = Math.ceil((lockDate.getTime() - now.getTime()) / 60000);
        throw new ForbiddenError(
          `Your transaction PIN is temporarily locked due to too many failed attempts. Please try again in ${remainingMinutes} minute${remainingMinutes === 1 ? "" : "s"}.`
        );
      }
    }

    // Compare with bcrypt hash
    const isMatch = await bcrypt.compare(pin, record.pinHash);

    if (isMatch) {
      // Reset failed attempts upon successful verification
      if (record.failedAttempts > 0 || record.lockedUntil) {
        await collection.updateOne(
          { _id: record._id },
          {
            $set: {
              failedAttempts: 0,
              lockedUntil: undefined,
              updatedAt: now,
            },
          }
        );
      }
      return true;
    }

    // Handle failed attempt
    const newFailedAttempts = (record.failedAttempts || 0) + 1;

    if (newFailedAttempts >= PIN_CONFIG.MAX_FAILED_ATTEMPTS) {
      const lockUntil = new Date(now.getTime() + PIN_CONFIG.LOCKOUT_DURATION_MS);
      await collection.updateOne(
        { _id: record._id },
        {
          $set: {
            failedAttempts: newFailedAttempts,
            lockedUntil: lockUntil,
            updatedAt: now,
          },
        }
      );

      throw new ForbiddenError(
        "Incorrect transaction PIN. Maximum attempts reached. Your PIN has been temporarily locked for 15 minutes."
      );
    }

    await collection.updateOne(
      { _id: record._id },
      {
        $set: {
          failedAttempts: newFailedAttempts,
          updatedAt: now,
        },
      }
    );

    const remaining = PIN_CONFIG.MAX_FAILED_ATTEMPTS - newFailedAttempts;
    throw new BadRequestError(
      `Incorrect transaction PIN. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining before temporary lockout.`
    );
  }

  /**
   * Sets or updates a transaction PIN with a fresh bcrypt hash.
   * If a PIN already exists, requires the current PIN for confirmation.
   */
  static async setTransactionPin(
    userEmail: string,
    newPin: string,
    currentPin?: string
  ): Promise<void> {
    const validNewPin = validatePinFormat(newPin);

    const db = await getDatabase();
    const collection = db.collection<DbTransactionPin>(COLLECTIONS.TRANSACTION_PINS);
    const normalizedEmail = userEmail.toLowerCase();

    const existing = await collection.findOne({ user: normalizedEmail });

    if (existing && existing.pinHash) {
      if (!currentPin) {
        throw new BadRequestError("Current transaction PIN is required to change your PIN.");
      }
      await this.verifyTransactionPin(normalizedEmail, currentPin);
    }

    const pinHash = await bcrypt.hash(validNewPin, PIN_CONFIG.BCRYPT_SALT_ROUNDS);
    const now = new Date();

    await collection.updateOne(
      { user: normalizedEmail },
      {
        $set: {
          pinHash,
          failedAttempts: 0,
          lockedUntil: undefined,
          updatedAt: now,
        },
        $setOnInsert: {
          user: normalizedEmail,
          createdAt: now,
        },
      },
      { upsert: true }
    );
  }

  /**
   * Unlocks a locked PIN (for authorized banking staff or admin).
   */
  static async unlockPin(userEmail: string): Promise<void> {
    const db = await getDatabase();
    const collection = db.collection<DbTransactionPin>(COLLECTIONS.TRANSACTION_PINS);
    const normalizedEmail = userEmail.toLowerCase();

    const result = await collection.updateOne(
      { user: normalizedEmail },
      {
        $set: {
          failedAttempts: 0,
          lockedUntil: undefined,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      throw new NotFoundError("No transaction PIN record found for this user.");
    }
  }
}
