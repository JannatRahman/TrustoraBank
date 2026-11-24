import { ObjectId, ClientSession } from "mongodb";
import { getDatabase } from "@/lib/mongodb";
import { COLLECTIONS, type DbEmailOutbox } from "@/types";

export interface OutboxEmailInput {
  recipientEmail: string;
  recipientName?: string;
  subject: string;
  template: string;
  templateData: Record<string, unknown>;
  referenceEntity?: string;
  referenceId?: string;
}

export class EmailOutboxService {
  /**
   * Atomically enqueue an email inside a MongoDB transaction session.
   * Ensures that transactional operations (like role promotion or demotion)
   * guarantee atomic notification enqueueing without external side effects failing the transaction.
   */
  static async enqueueEmail(
    input: OutboxEmailInput,
    session?: ClientSession
  ): Promise<ObjectId> {
    const db = await getDatabase();
    const outboxCol = db.collection<DbEmailOutbox>(COLLECTIONS.EMAIL_OUTBOX);

    const emailRecord: DbEmailOutbox = {
      recipientEmail: input.recipientEmail.toLowerCase(),
      recipientName: input.recipientName,
      subject: input.subject,
      template: input.template,
      templateData: input.templateData,
      status: "PENDING",
      attempts: 0,
      createdAt: new Date(),
      referenceEntity: input.referenceEntity,
      referenceId: input.referenceId,
    };

    const options = session ? { session } : {};
    const res = await outboxCol.insertOne(emailRecord, options);
    return res.insertedId;
  }

  /**
   * Outbox Dispatcher Worker: Pulls PENDING or RETRY emails and dispatches them.
   */
  static async dispatchPendingEmails(batchSize = 20): Promise<{ processed: number; succeeded: number; failed: number }> {
    const db = await getDatabase();
    const outboxCol = db.collection<DbEmailOutbox>(COLLECTIONS.EMAIL_OUTBOX);

    const now = new Date();
    const pendingEmails = await outboxCol
      .find({
        status: { $in: ["PENDING", "FAILED"] },
        attempts: { $lt: 5 },
        $or: [{ nextRetryAt: { $exists: false } }, { nextRetryAt: { $lte: now } }],
      })
      .limit(batchSize)
      .toArray();

    let succeeded = 0;
    let failed = 0;

    for (const email of pendingEmails) {
      try {
        // Here real email sending (e.g. Resend, SendGrid, SES) occurs.
        // For Trustora Bank in this environment, we simulate successful delivery:
        console.log(`[EmailOutbox] Dispatched email to ${email.recipientEmail}: "${email.subject}"`);

        await outboxCol.updateOne(
          { _id: email._id },
          {
            $set: {
              status: "SENT",
              sentAt: new Date(),
              lastAttemptAt: new Date(),
            },
            $inc: { attempts: 1 },
          }
        );
        succeeded++;
      } catch (err: unknown) {
        failed++;
        const errMsg = err instanceof Error ? err.message : String(err);
        const nextRetry = new Date(Date.now() + Math.pow(2, email.attempts + 1) * 60 * 1000); // exponential backoff
        await outboxCol.updateOne(
          { _id: email._id },
          {
            $set: {
              status: "FAILED",
              lastError: errMsg,
              lastAttemptAt: new Date(),
              nextRetryAt: nextRetry,
            },
            $inc: { attempts: 1 },
          }
        );
      }
    }

    return { processed: pendingEmails.length, succeeded, failed };
  }
}
