import { MongoClient } from "mongodb";
import {
  normalizeLeadGenPricing,
  PIPELINE_PRICING_OPERATIONS,
} from "../../../lib/leadGenPricing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// # Reuse only the MongoDB connection; every page-open request reads current active pricing.
let connection;
let connectionUrl;

// # Called only by this server route. A missing URI must not fall back to a local database.
async function pricingDatabase() {
  const uri = process.env.CREDIT_PRICING_MONGO_URL?.trim();
  const name = process.env.CREDIT_PRICING_DB_NAME?.trim();
  if (!uri || !name) throw new Error("Pricing connection is not configured.");
  if (!connection || connectionUrl !== uri) {
    const client = new MongoClient(uri, {
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
    connectionUrl = uri;
    connection = client.connect().catch(async () => {
      connection = undefined;
      await client.close().catch(() => {});
      throw new Error("Pricing database is unavailable.");
    });
  }
  return (await connection).db(name);
}

// # Accept only an allowlisted operation; collection names, queries and wallet IDs stay server-controlled.
export async function GET(request) {
  const headers = { "Cache-Control": "no-store" };
  const operation =
    new URL(request.url).searchParams.get("operation") || "LEAD_GEN_PIPELINE";
  if (!PIPELINE_PRICING_OPERATIONS.includes(operation)) {
    return Response.json(
      { message: "Unsupported pricing operation." },
      { status: 400, headers },
    );
  }
  try {
    const db = await pricingDatabase();
    const now = new Date();
    const record = await db.collection("credit_pricing").findOne(
      {
        application: "SIMPLEADS",
        operation,
        active: true,
        effectiveFrom: { $lte: now },
        $or: [
          { effectiveTo: { $exists: false } },
          { effectiveTo: { $gt: now } },
        ],
      },
      {
        sort: { version: -1 },
        projection: {
          _id: 0,
          application: 1,
          operation: 1,
          version: 1,
          pricingConfig: 1,
          effectiveFrom: 1,
          effectiveTo: 1,
        },
      },
    );
    return Response.json(normalizeLeadGenPricing(record, operation), { headers });
  } catch {
    // # Never expose MongoDB URIs, credentials, topology details or raw database exceptions.
    return Response.json(
      {
        message:
          "Run pricing is currently unavailable. Please refresh to try again.",
      },
      { status: 503, headers },
    );
  }
}
