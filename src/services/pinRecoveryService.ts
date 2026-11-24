import crypto from "crypto";
import bcrypt from "bcryptjs";
import { getDatabase } from "@/lib/mongodb";
import { COLLECTIONS, type DbPinRecovery, type DbTransactionPin, type DbUser } from "@/types";
import { BadRequestError, ForbiddenError, TooManyRequestsError } from "@/server/auth/errors";
import { EmailOutboxService } from "@/services/emailOutboxService";
import { validatePinFormat } from "@/validators/pinValidator";
import { PIN_CONFIG } from "@/services/pinService";

export const PIN_RECOVERY_CONFIG = {
  EXPIRATION_MS: 15 * 60 * 1000, // 15 minutes
  MAX_ATTEMPTS: 5,
  MAX_REQUESTS_PER_WINDOW: 3, // Max 3 recovery code requests per 15 minutes
  WINDOW_MS: 15 * 60 * 1000,
  BCRYPT_SALT_ROUNDS: 10,
} as const;

export class PinRecoveryService {
  /**
   * Request a PIN recovery code via email.
   * Rate limited per user.
   * Always returns a generic success message without leaking whether the email exists.
   */
  static async requestRecovery(targetEmail: string): Promise<{ success: boolean; message: string }> {
    if (!targetEmail || typeof targetEmail !== "string") {
      throw new BadRequestError("A valid email address is required.");
    }

    const normalizedEmail = targetEmail.trim().toLowerCase();
    const db = await getDatabase();
    const now = new Date();

    // Rate limiting: check recent requests in window
    const recentRequests = await db
      .collection<DbPinRecovery>(COLLECTIONS.PIN_RECOVERIES)
      .countDocuments({
        user: normalizedEmail,
        createdAt: { $gte: new Date(now.getTime() - PIN_RECOVERY_CONFIG.WINDOW_MS) },
      });

    if (recentRequests >= PIN_RECOVERY_CONFIG.MAX_REQUESTS_PER_WINDOW) {
      throw new TooManyRequestsError(
        "Too many recovery requests. Please wait a few minutes before requesting another code."
      );
    }

    // Check if user exists in the database
    const user = await db
      .collection<DbUser>(COLLECTIONS.USER)
      .findOne({ email: normalizedEmail });

    // If user exists, generate recovery code and queue email
    if (user) {
      // Invalidate any prior active (unconsumed) recovery codes for this user
      await db
        .collection<DbPinRecovery>(COLLECTIONS.PIN_RECOVERIES)
        .updateMany(
          { user: normalizedEmail, consumed: false },
          { $set: { consumed: true, updatedAt: now } }
        );

      // Generate a cryptographically secure 6-digit code
      const rawCode = crypto.randomInt(100000, 1000000).toString();
      const codeHash = await bcrypt.hash(rawCode, PIN_RECOVERY_CONFIG.BCRYPT_SALT_ROUNDS);
      const expiresAt = new Date(now.getTime() + PIN_RECOVERY_CONFIG.EXPIRATION_MS);

      const recoveryDoc: DbPinRecovery = {
        user: normalizedEmail,
        codeHash,
        expiresAt,
        attempts: 0,
        consumed: false,
        createdAt: now,
        updatedAt: now,
      };

      await db
        .collection<DbPinRecovery>(COLLECTIONS.PIN_RECOVERIES)
        .insertOne(recoveryDoc);

      // Enqueue recovery email
      await EmailOutboxService.enqueueEmail({
        recipientEmail: normalizedEmail,
        recipientName: user.name || "Customer",
        subject: "Trustora Bank — Transaction PIN Recovery Code",
        template: "PIN_RECOVERY_CODE",
        templateData: {
          code: rawCode,
          expiresInMinutes: 15,
          customerName: user.name || "Valued Customer",
        },
        referenceEntity: "PIN_RECOVERY",
      });
    }

    // Generic response regardless of existence to prevent user enumeration
    return {
      success: true,
      message:
        "If an account is associated with this email, a 6-digit recovery code has been dispatched. It expires in 15 minutes.",
    };
  }

  /**
   * Confirm PIN recovery with the code and reset the transaction PIN.
   * Single-use, time-limited, and resets PIN lockout upon success.
   */
  static async confirmRecovery(
    userEmail: string,
    code: string,
    newPin: string
  ): Promise<void> {
    if (!userEmail) {
      throw new BadRequestError("User email is required.");
    }
    if (!code || typeof code !== "string" || !/^\d{6}$/.test(code.trim())) {
      throw new BadRequestError("A 6-digit recovery code is required.");
    }

    const validNewPin = validatePinFormat(newPin);
    const normalizedEmail = userEmail.trim().toLowerCase();
    const db = await getDatabase();
    const recoveryCol = db.collection<DbPinRecovery>(COLLECTIONS.PIN_RECOVERIES);
    const pinCol = db.collection<DbTransactionPin>(COLLECTIONS.TRANSACTION_PINS);
    const now = new Date();

    // Find the latest active recovery record
    const activeRecovery = await recoveryCol.findOne(
      {
        user: normalizedEmail,
        consumed: false,
      },
      { sort: { createdAt: -1 } }
    );

    if (!activeRecovery) {
      throw new BadRequestError("No active recovery request found. Please request a new recovery code.");
    }

    // Check expiration
    if (new Date(activeRecovery.expiresAt) < now) {
      await recoveryCol.updateOne(
        { _id: activeRecovery._id },
        { $set: { consumed: true, updatedAt: now } }
      );
      throw new BadRequestError("The recovery code has expired. Please request a new code.");
    }

    // Check max attempts
    if (activeRecovery.attempts >= PIN_RECOVERY_CONFIG.MAX_ATTEMPTS) {
      await recoveryCol.updateOne(
        { _id: activeRecovery._id },
        { $set: { consumed: true, updatedAt: now } }
      );
      throw new ForbiddenError("Too many incorrect recovery code attempts. Please request a new code.");
    }

    // Verify recovery code hash
    const isCodeMatch = await bcrypt.compare(code.trim(), activeRecovery.codeHash);

    if (!isCodeMatch) {
      const updatedAttempts = activeRecovery.attempts + 1;
      const isNowBurned = updatedAttempts >= PIN_RECOVERY_CONFIG.MAX_ATTEMPTS;

      await recoveryCol.updateOne(
        { _id: activeRecovery._id },
        {
          $set: {
            attempts: updatedAttempts,
            consumed: isNowBurned,
            updatedAt: now,
          },
        }
      );

      const remaining = Math.max(0, PIN_RECOVERY_CONFIG.MAX_ATTEMPTS - updatedAttempts);
      throw new BadRequestError(
        isNowBurned
          ? "Too many incorrect recovery attempts. This code has been invalidated."
          : `Invalid recovery code. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`
      );
    }

    // Code is valid! Consume it immediately (single-use enforcement)
    await recoveryCol.updateOne(
      { _id: activeRecovery._id },
      {
        $set: {
          consumed: true,
          updatedAt: now,
        },
      }
    );

    // Hash the new PIN with bcrypt
    const pinHash = await bcrypt.hash(validNewPin, PIN_CONFIG.BCRYPT_SALT_ROUNDS);

    // Update PIN record and completely clear any lockout state
    await pinCol.updateOne(
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
}
