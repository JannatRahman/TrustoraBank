/**
 * scripts/migrate-user-status-and-guard.cjs
 *
 * 1. Safely updates legacy users without status to "ACTIVE"
 * 2. Initializes the dedicated admin concurrency guard document in adminGuard collection
 */

const path = require("path");
const { MongoClient } = require(path.join(process.cwd(), "node_modules", "mongodb"));

async function run() {
  const uri = process.env.DATABASE_URL || process.env.MONGODB_URI;
  if (!uri) {
    console.error("Missing DATABASE_URL / MONGODB_URI");
    process.exit(1);
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const dbName = process.env.AUTHDB_NAME || "trustora-bank";
    const db = client.db(dbName);
    console.log("Connected to MongoDB database:", db.databaseName);

    // 1. Update legacy users without status or emailVerified
    const usersCol = db.collection("user");
    const legacyUsers = await usersCol.find({
      $or: [
        { status: { $exists: false } },
        { status: null },
        { status: "" }
      ]
    }).toArray();

    console.log(`Found ${legacyUsers.length} legacy users without valid status.`);
    for (const u of legacyUsers) {
      await usersCol.updateOne(
        { _id: u._id },
        {
          $set: {
            status: "ACTIVE",
            updatedAt: new Date()
          }
        }
      );
      console.log(`Updated user ${u.email} (${u.role || 'customer'}) -> status: ACTIVE`);
    }

    // 2. Count active admins in user collection
    const activeAdminCount = await usersCol.countDocuments({
      role: "admin",
      status: "ACTIVE"
    });
    console.log(`Current active admin count in user collection: ${activeAdminCount}`);

    // 3. Initialize or reconcile adminGuard collection
    const guardCol = db.collection("adminGuard");
    const existingGuard = await guardCol.findOne({ _id: "admin_concurrency_guard" });

    if (!existingGuard) {
      await guardCol.insertOne({
        _id: "admin_concurrency_guard",
        activeAdminCount: activeAdminCount,
        version: 1,
        lastAuditedAt: new Date(),
        updatedAt: new Date()
      });
      console.log(`Created admin_concurrency_guard with activeAdminCount: ${activeAdminCount}, version: 1`);
    } else {
      await guardCol.updateOne(
        { _id: "admin_concurrency_guard" },
        {
          $set: {
            activeAdminCount: activeAdminCount,
            lastAuditedAt: new Date(),
            updatedAt: new Date()
          },
          $inc: { version: 1 }
        }
      );
      console.log(`Reconciled admin_concurrency_guard to activeAdminCount: ${activeAdminCount}`);
    }

    console.log("Migration script completed successfully!");
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  } finally {
    await client.close();
  }
}

run();
