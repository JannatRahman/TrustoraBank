// Re-export MongoDB client and db for backwards and explicit mongodb.ts compatibility
export { client, clientPromise, db } from "./mongo";
export { getDatabase } from "./db";
