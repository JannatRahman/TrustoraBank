const path = require("path");
const { MongoClient } = require(path.join(process.cwd(), "node_modules", "mongodb"));

const UNIQUE_INDEXES = [
  {
    collection: "Accounts",
    name: "idx_accounts_accountNumber_unique",
    spec: { accountNumber: 1 },
    unique: true,
  },
  {
    collection: "Transactions",
    name: "idx_transactions_transactionId_unique",
    spec: { transactionId: 1 },
    unique: true,
  },
  {
    collection: "Transactions",
    name: "idx_transactions_idempotencyKey_sparse_unique",
    spec: { idempotencyKey: 1 },
    unique: true,
    sparse: true,
  },
  {
    collection: "Loans",
    name: "idx_loans_loanNumber_unique",
    spec: { loanNumber: 1 },
    unique: true,
  },
  {
    collection: "Repayments",
    name: "idx_repayments_repaymentId_unique",
    spec: { repaymentId: 1 },
    unique: true,
  },
  {
    collection: "Repayments",
    name: "idx_repayments_loan_installment_unique",
    spec: { loan: 1, installmentNo: 1 },
    unique: true,
  },
  {
    collection: "Requests",
    name: "idx_requests_requestId_unique",
    spec: { requestId: 1 },
    unique: true,
  },
  {
    collection: "transactionPins",
    name: "idx_pins_user_unique",
    spec: { user: 1 },
    unique: true,
  },
];

async function runMigration() {
  console.log("=== Trustora Bank - Phase 2 Database Index Migration ===\n");

  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db(process.env.AUTHDB_NAME || "trustora-bank");

  console.log("-> Connected to database:", db.databaseName);

  for (const def of UNIQUE_INDEXES) {
    const col = db.collection(def.collection);

    // 1. Check existing indexes
    const existing = await col.indexes();
    const match = existing.find(
      (idx) => idx.name === def.name || JSON.stringify(idx.key) === JSON.stringify(def.spec)
    );

    if (match) {
      console.log(`[ALREADY_EXISTS] ${def.collection}: ${match.name} on ${JSON.stringify(match.key)}`);
      continue;
    }

    // 2. Pre-check for duplicates immediately before creation
    const keys = Object.keys(def.spec);
    const matchStage = {};
    keys.forEach((k) => { matchStage[k] = { $exists: true, $ne: null }; });
    const groupStageId = keys.length === 1 ? `$${keys[0]}` : keys.reduce((acc, k) => ({ ...acc, [k]: `$${k}` }), {});

    const dups = await col.aggregate([
      { $match: matchStage },
      { $group: { _id: groupStageId, count: { $sum: 1 } } },
      { $match: { count: { $gt: 1 } } }
    ]).toArray();

    if (dups.length > 0) {
      console.error(`[BLOCKED] Duplicate keys found in ${def.collection} on ${JSON.stringify(def.spec)}! Count: ${dups.length}`);
      console.error("Halting index creation for safety. No records modified.");
      continue;
    }

    // 3. Create index
    await col.createIndex(def.spec, {
      name: def.name,
      unique: def.unique,
      sparse: def.sparse || false,
      background: true,
    });

    console.log(`[CREATED] ${def.collection}: ${def.name} on ${JSON.stringify(def.spec)}${def.sparse ? " (sparse)" : ""}`);
  }

  await client.close();
  console.log("\n-> Index migration finished successfully.");
}

runMigration().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
