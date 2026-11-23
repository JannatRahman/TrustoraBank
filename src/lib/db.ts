
import { clientPromise, db } from "@/lib/mongo";

export async function getDatabase() {
  await clientPromise;
  return db;
}
