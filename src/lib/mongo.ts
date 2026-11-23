
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.AUTHDB_NAME;

if (!uri) {
  throw new Error("MONGODB_URI is missing from environment variables");
}

if (!dbName) {
  throw new Error("AUTHDB_NAME is missing from environment variables");
}

const options = {};

declare global {
  // eslint-disable-next-line no-var
  var _mongoClient: MongoClient | undefined;

  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClient) {
    global._mongoClient = new MongoClient(uri, options);
  }

  client = global._mongoClient;

  if (!global._mongoClientPromise) {
    global._mongoClientPromise = client.connect();
  }

  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export { client, clientPromise };

export const db = client.db(dbName);
