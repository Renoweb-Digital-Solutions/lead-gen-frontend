import "server-only";
import { MongoClient } from "mongodb";
import { BillingError } from "./payments";

let connection;
let connectionUri;

export async function paymentReadDatabase() {
  // # Explicitly authorized read-only billing access. Use a database principal
  // # with find/aggregate privileges only; checkout mutations still use the API.
  const uri = process.env.PAYMENT_READ_MONGO_URL?.trim();
  const name = process.env.PAYMENT_READ_DB_NAME?.trim();
  if (!uri || !name)
    throw new BillingError("Billing details are temporarily unavailable.");
  if (!connection || connectionUri !== uri) {
    const client = new MongoClient(uri, {
      appName: "simpleads-billing-read",
      maxPoolSize: 5,
      connectTimeoutMS: 5000,
      serverSelectionTimeoutMS: 5000,
    });
    connectionUri = uri;
    connection = client.connect().catch(async () => {
      connection = undefined;
      await client.close().catch(() => {});
      throw new BillingError("Billing details are temporarily unavailable.");
    });
  }
  return (await connection).db(name);
}
