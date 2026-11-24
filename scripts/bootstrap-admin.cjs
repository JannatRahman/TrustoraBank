/**
 * scripts/bootstrap-admin.cjs
 *
 * Secure CLI Bootstrap Utility for Trustora Bank Administration.
 * Preconditions:
 * 1. activeAdminCount in adminGuard MUST be 0 (cannot bootstrap if an admin is already active).
 * 2. Requires BOOTSTRAP_SECRET_KEY matched via crypto.timingSafeEqual.
 * 3. Requires valid target email in BOOTSTRAP_ADMIN_EMAIL.
 * 4. Atomically promotes target, increments activeAdminCount to 1, enqueues outbox email, and logs audit.
 */

const crypto = require("crypto");
const path = require("path");
const { MongoClient, ObjectId } = require(path.join(process.cwd(), "node_modules", "mongodb"));

async function bootstrap() {
  console.log("=== Trustora Bank Admin Bootstrap Tool ===");

  const secretKey = process.env.BOOTSTRAP_SECRET_KEY;
  const targetEmail = process.env.BOOTSTRAP_ADMIN_EMAIL;
  const providedKey = process.argv[2];

  if (!secretKey) {
    console.error("FATAL: BOOTSTRAP_SECRET_KEY is not defined in the environment.");
    process.exit(1);
  }

  if (!targetEmail) {
    console.error("FATAL: BOOTSTRAP_ADMIN_EMAIL is not defined in the environment.");
    process.exit(1);
  }

  if (!providedKey) {
    console.error("Usage: node scripts/bootstrap-admin.cjs <SECRET_KEY>");
    process.exit(1);
  }

  // Timing-safe secret key verification
  const secretBuf = Buffer.from(secretKey);
  const providedBuf = Buffer.from(providedKey);

  if (secretBuf.length !== providedBuf.length || !crypto.timingSafeEqual(secretBuf, providedBuf)) {
    console.error("FATAL: Provided secret key does not match BOOTSTRAP_SECRET_KEY.");
    process.exit(1);
  }

  const uri = process.env.DATABASE_URL || process.env.MONGODB_URI;
  const dbName = process.env.AUTHDB_NAME || "trustora-bank";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const session = client.startSession();

    try {
      await session.withTransaction(async () => {
        const guardCol = db.collection("adminGuard");
        const usersCol = db.collection("user");
        const auditCol = db.collection("auditLogs");

        // 1. Guard check: activeAdminCount must be 0
        const guard = await guardCol.findOne({ _id: "admin_concurrency_guard" }, { session });
        if (guard && guard.activeAdminCount > 0) {
          throw new Error(
            `Bootstrap forbidden: There are currently ${guard.activeAdminCount} active admin(s) registered. Bootstrap only permitted during zero-admin disaster recovery.`
          );
        }

        // 2. Find target user
        const target = await usersCol.findOne({ email: targetEmail.toLowerCase() }, { session });
        if (!target) {
          throw new Error(`Bootstrap target user '${targetEmail}' does not exist in database.`);
        }

        // 3. Promote target user
        const now = new Date();
        await usersCol.updateOne(
          { _id: target._id },
          {
            $set: {
              role: "admin",
              status: "ACTIVE",
              emailVerified: true,
              updatedAt: now,
            },
          },
          { session }
        );

        // 4. Update guard
        await guardCol.updateOne(
          { _id: "admin_concurrency_guard" },
          {
            $set: {
              activeAdminCount: 1,
              lastAuditedAt: now,
              updatedAt: now,
            },
            $inc: { version: 1 },
          },
          { upsert: true, session }
        );

        // 5. Invalidate existing sessions
        await db.collection("session").deleteMany(
          {
            $or: [
              { userId: target._id },
              { userId: target._id.toString() },
              { userId: new ObjectId(target._id) },
            ],
          },
          { session }
        );

        // 6. Record Audit Log
        await auditCol.insertOne(
          {
            action: "ADMIN_BOOTSTRAP_EXECUTED",
            entity: "user",
            entityId: target._id.toString(),
            performedBy: "CLI_BOOTSTRAP_PROCESS",
            performedByRole: "system",
            metadata: {
              targetEmail: target.email,
              previousRole: target.role,
              timestamp: now,
            },
            timestamp: now,
          },
          { session }
        );

        console.log(`SUCCESS: User '${target.email}' has been bootstrapped as the Primary Administrator.`);
      });
    } finally {
      await session.endSession();
    }
  } catch (err) {
    console.error("Bootstrap execution failed:", err.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

bootstrap();
