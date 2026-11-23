import { MongoClient, type Db } from "mongodb";
import { COLLECTIONS } from "@/types";

export interface IndexDefinition {
  collection: string;
  name: string;
  spec: Record<string, 1 | -1>;
  unique: boolean;
  sparse?: boolean;
}

export const UNIQUE_INDEXES: IndexDefinition[] = [
  {
    collection: COLLECTIONS.ACCOUNTS,
    name: "idx_accounts_accountNumber_unique",
    spec: { accountNumber: 1 },
    unique: true,
  },
  {
    collection: COLLECTIONS.TRANSACTIONS,
    name: "idx_transactions_transactionId_unique",
    spec: { transactionId: 1 },
    unique: true,
  },
  {
    collection: COLLECTIONS.TRANSACTIONS,
    name: "idx_transactions_idempotencyKey_sparse_unique",
    spec: { idempotencyKey: 1 },
    unique: true,
    sparse: true,
  },
  {
    collection: COLLECTIONS.LOANS,
    name: "idx_loans_loanNumber_unique",
    spec: { loanNumber: 1 },
    unique: true,
  },
  {
    collection: COLLECTIONS.REPAYMENTS,
    name: "idx_repayments_repaymentId_unique",
    spec: { repaymentId: 1 },
    unique: true,
  },
  {
    collection: COLLECTIONS.REPAYMENTS,
    name: "idx_repayments_loan_installment_unique",
    spec: { loan: 1, installmentNo: 1 },
    unique: true,
  },
  {
    collection: COLLECTIONS.REQUESTS,
    name: "idx_requests_requestId_unique",
    spec: { requestId: 1 },
    unique: true,
  },
  {
    collection: COLLECTIONS.TRANSACTION_PINS,
    name: "idx_pins_user_unique",
    spec: { user: 1 },
    unique: true,
  },
];

/**
 * Checks if duplicates exist on the target field(s) in a collection before indexing.
 */
async function checkForDuplicates(
  db: Db,
  def: IndexDefinition
): Promise<{ hasDuplicates: boolean; duplicateCount: number; sample?: unknown[] }> {
  const col = db.collection(def.collection);
  const keys = Object.keys(def.spec);

  const matchStage: Record<string, unknown> = {};
  keys.forEach((k) => {
    matchStage[k] = { $exists: true, $ne: null };
  });

  const groupStageId: Record<string, string> | string =
    keys.length === 1 ? `$${keys[0]}` : keys.reduce((acc, k) => ({ ...acc, [k]: `$${k}` }), {});

  const dups = await col
    .aggregate([
      { $match: matchStage },
      { $group: { _id: groupStageId, count: { $sum: 1 } } },
      { $match: { count: { $gt: 1 } } },
    ])
    .toArray();

  return {
    hasDuplicates: dups.length > 0,
    duplicateCount: dups.length,
    sample: dups.slice(0, 3),
  };
}

export interface MigrationResult {
  collection: string;
  indexName: string;
  status: "CREATED" | "ALREADY_EXISTS" | "BLOCKED_BY_DUPLICATES";
  details?: string;
}

/**
 * Executes idempotent migration of required unique indexes.
 * Checks for duplicates before creation and safely detects already existing indexes.
 */
export async function runIndexMigration(db: Db): Promise<MigrationResult[]> {
  const results: MigrationResult[] = [];

  for (const def of UNIQUE_INDEXES) {
    const col = db.collection(def.collection);

    // 1. Check if index already exists
    const existingIndexes = await col.indexes();
    const foundIndex = existingIndexes.find(
      (idx) =>
        idx.name === def.name ||
        JSON.stringify(idx.key) === JSON.stringify(def.spec)
    );

    if (foundIndex) {
      results.push({
        collection: def.collection,
        indexName: foundIndex.name || def.name,
        status: "ALREADY_EXISTS",
        details: `Index already present on ${def.collection}: ${JSON.stringify(foundIndex.key)}`,
      });
      continue;
    }

    // 2. Pre-check for duplicate keys
    const dupCheck = await checkForDuplicates(db, def);
    if (dupCheck.hasDuplicates) {
      results.push({
        collection: def.collection,
        indexName: def.name,
        status: "BLOCKED_BY_DUPLICATES",
        details: `Found ${dupCheck.duplicateCount} duplicate records in ${def.collection}. Migration halted for safety.`,
      });
      continue;
    }

    // 3. Create unique index safely
    try {
      await col.createIndex(def.spec, {
        name: def.name,
        unique: def.unique,
        sparse: def.sparse || false,
        background: true,
      });

      results.push({
        collection: def.collection,
        indexName: def.name,
        status: "CREATED",
        details: `Successfully created unique index on ${def.collection}: ${JSON.stringify(def.spec)}${def.sparse ? " (sparse)" : ""}`,
      });
    } catch (err: unknown) {
      results.push({
        collection: def.collection,
        indexName: def.name,
        status: "BLOCKED_BY_DUPLICATES",
        details: `Error creating index: ${err instanceof Error ? err.message : String(err)}`,
      });
    }
  }

  return results;
}
