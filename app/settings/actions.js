"use server";

import { headers } from "next/headers";
import { billingIdentity } from "../lib/server/billingIdentity";
import { billingRegion } from "../lib/server/billingRegion";
import { paymentReadDatabase } from "../lib/server/paymentReadDatabase";
import { BillingError } from "../lib/server/payments";

const PAGE_SIZE = 8;
const MAX_TIME_MS = 8000;
const SUCCESS = ["SUCCESS", "PAID", "COMPLETED"];
const PENDING = ["PENDING", "INITIALIZED", "PROCESSING"];
const FAILED = ["FAILED", "CANCELLED", "EXPIRED", "DECLINED"];

function identity(token) {
  // # Every exported Server Action re-verifies its caller. Neither a user ID nor
  // # application/database/query can be chosen through action arguments.
  if (typeof token !== "string" || token.length > 8192)
    throw new BillingError("Please sign in again.", 401);
  return billingIdentity({
    headers: new Headers({ authorization: `Bearer ${token}` }),
  });
}

function publicError(error) {
  // # Database/provider topology and credentials never leave the server.
  return error instanceof BillingError
    ? error.message
    : "Billing details could not be loaded. Please try again.";
}

function number(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function date(value) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

function planView(plan) {
  return {
    id: plan.planId,
    name: plan.name || "SimpleAds plan",
    description: plan.description || "",
    amount: number(plan.amount),
    currency: plan.currency || null,
    billingType: plan.billingType,
    intervalType: plan.intervalType,
    intervals: number(plan.intervals),
    credits: number(plan.creditsAllocated),
    creditsPerCycle: number(plan.creditsPerCycle),
    totalCycles: number(plan.totalCycles),
    rolloverAllowed: plan.metadata?.rolloverAllowed === true,
    maxRolloverCap: number(plan.metadata?.maxRolloverCap),
    accessDurationDays: number(plan.metadata?.accessDurationDays),
  };
}

async function catalog(db) {
  const region = await billingRegion({ headers: await headers() });
  const plans = await db
    .collection("plans")
    .find(
      {
        application: "SIMPLEADS",
        active: true,
        currency: region.currency,
        amount: { $gt: 0 },
      },
      {
        projection: {
          _id: 0,
          planId: 1,
          name: 1,
          description: 1,
          amount: 1,
          currency: 1,
          billingType: 1,
          intervalType: 1,
          intervals: 1,
          creditsAllocated: 1,
          creditsPerCycle: 1,
          totalCycles: 1,
          "metadata.rolloverAllowed": 1,
          "metadata.maxRolloverCap": 1,
          "metadata.accessDurationDays": 1,
        },
        maxTimeMS: MAX_TIME_MS,
      },
    )
    .sort({ amount: 1, planId: 1 })
    .toArray();
  return { region, plans: plans.map(planView) };
}

async function subscription(db, account) {
  const now = new Date();
  // # Prefer a paid entitlement over a permanently ACTIVE free starter record.
  // # Cancel-at-period-end remains entitled only while its paid period is valid.
  const candidates = await db
    .collection("subscriptions")
    .aggregate(
      [
        {
          $match: {
            userId: account.id,
            application: "SIMPLEADS",
            $or: [
              {
                status: "ACTIVE",
                $or: [
                  { currentPeriodEnd: { $gt: now } },
                  { currentPeriodEnd: { $exists: false } },
                  { currentPeriodEnd: null },
                ],
              },
              {
                status: { $in: ["CANCELLED", "COMPLETED"] },
                currentPeriodEnd: { $gt: now },
              },
            ],
          },
        },
        {
          $addFields: {
            paidPriority: { $cond: [{ $gt: ["$planAmount", 0] }, 1, 0] },
          },
        },
        { $sort: { paidPriority: -1, currentPeriodStart: -1, createdAt: -1 } },
        { $limit: 1 },
        {
          $project: {
            _id: 0,
            subscriptionId: 1,
            planId: 1,
            planAmount: 1,
            planCurrency: 1,
            creditsPerCycle: 1,
            status: 1,
            authStatus: 1,
            currentPeriodStart: 1,
            currentPeriodEnd: 1,
            completedCycles: 1,
            totalCycles: 1,
            totalCyclesCharged: 1,
            nextActionAt: 1,
            isFreeTier: 1,
            cancelAtPeriodEnd: 1,
            createdAt: 1,
            customerEmail: 1,
            customerPhone: 1,
          },
        },
      ],
      { maxTimeMS: MAX_TIME_MS },
    )
    .toArray();
  const sub = candidates[0];
  if (!sub) return { current: null };
  const plan = await db.collection("plans").findOne(
    { planId: sub.planId, application: "SIMPLEADS" },
    {
      projection: {
        name: 1,
        billingType: 1,
        intervalType: 1,
        intervals: 1,
        totalCycles: 1,
        "metadata.maxRolloverCap": 1,
      },
      maxTimeMS: MAX_TIME_MS,
    },
  );
  return {
    current: {
      id: sub.subscriptionId,
      planId: sub.planId,
      name: plan?.name || sub.planId,
      amount: number(sub.planAmount),
      currency: sub.planCurrency || null,
      creditsPerCycle: number(sub.creditsPerCycle),
      status: sub.status,
      authStatus: sub.authStatus,
      periodStart: date(sub.currentPeriodStart),
      periodEnd: date(sub.currentPeriodEnd),
      nextActionAt: date(sub.nextActionAt),
      createdAt: date(sub.createdAt),
      completedCycles: number(sub.completedCycles),
      totalCycles: number(sub.totalCycles ?? plan?.totalCycles),
      chargedCycles: number(sub.totalCyclesCharged),
      isFree: sub.isFreeTier === true || sub.planAmount === 0,
      cancelAtPeriodEnd: sub.cancelAtPeriodEnd === true,
      email: sub.customerEmail || account.email,
      phone: sub.customerPhone || "",
      billingType: plan?.billingType || null,
      intervalType: plan?.intervalType || null,
      maxRolloverCap: number(plan?.metadata?.maxRolloverCap),
    },
  };
}

function transactionScope(account) {
  // # Legacy transaction documents have no application field. Link them only to
  // # an owned SIMPLEADS order/subscription; userId alone is not app isolation.
  const ownedLookup = (from, field, output) => ({
    $lookup: {
      from,
      localField: field,
      foreignField: field,
      pipeline: [
        { $match: { userId: account.id, application: "SIMPLEADS" } },
        { $project: { _id: 0, planId: 1 } },
      ],
      as: output,
    },
  });
  return [
    { $match: { userId: account.id } },
    ownedLookup("subscriptions", "subscriptionId", "ownedSubscription"),
    ownedLookup("orders", "orderId", "ownedOrder"),
    {
      $match: {
        $or: [
          { application: "SIMPLEADS" },
          {
            application: { $exists: false },
            "ownedSubscription.0": { $exists: true },
          },
          {
            application: { $exists: false },
            "ownedOrder.0": { $exists: true },
          },
        ],
      },
    },
    {
      $set: {
        resolvedPlanId: {
          $ifNull: [
            "$planId",
            {
              $ifNull: [
                { $arrayElemAt: ["$ownedSubscription.planId", 0] },
                { $arrayElemAt: ["$ownedOrder.planId", 0] },
              ],
            },
          ],
        },
      },
    },
  ];
}

function paymentMethod(value) {
  // # Never return the raw gateway payment-method object (UPI IDs, tokens, etc.).
  if (typeof value === "string") return value.replace(/_/g, " ").slice(0, 40);
  if (!value || typeof value !== "object") return "Not recorded";
  if (value.upi) return "UPI";
  if (value.card) return "Card";
  if (value.netbanking) return "Net banking";
  if (value.enach || value.nach) return "Bank mandate";
  if (value.wallet) return "Wallet";
  return "Online payment";
}

async function transactions(db, account, options = {}) {
  // # Filters affect the visible page and matching count only. The summary must
  // # continue to describe the complete owned ledger, not eight visible rows.
  const page = Number.isInteger(options.page)
    ? Math.min(10000, Math.max(1, options.page))
    : 1;
  const query =
    typeof options.query === "string" ? options.query.trim().slice(0, 80) : "";
  const statuses = { successful: SUCCESS, pending: PENDING, failed: FAILED };
  const filters = [];
  if (Array.isArray(statuses[options.status]))
    filters.push({ status: { $in: statuses[options.status] } });
  if (query) {
    // # Escape every regex metacharacter; references are literal search text,
    // # never an executable regular expression supplied by the browser.
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filters.push({
      $or: ["paymentId", "subscriptionId", "orderId", "resolvedPlanId"].map(
        (field) => ({ [field]: { $regex: escaped, $options: "i" } }),
      ),
    });
  }
  const match = filters.length ? { $and: filters } : {};
  const [result] = await db
    .collection("payment_transactions")
    .aggregate(
      [
        ...transactionScope(account),
        {
          $facet: {
            // # Independent facets share the same account/application scope. Never
            // # combine currencies or replace a zero authorization with a plan price.
            totals: [
              { $match: { status: { $in: SUCCESS } } },
              {
                $group: {
                  _id: "$currency",
                  amount: { $sum: "$amount" },
                  count: { $sum: 1 },
                },
              },
              { $sort: { _id: 1 } },
            ],
            counts: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
            filteredCount: [{ $match: match }, { $count: "total" }],
            items: [
              { $match: match },
              { $sort: { createdAt: -1, _id: -1 } },
              { $skip: (page - 1) * PAGE_SIZE },
              { $limit: PAGE_SIZE },
              {
                $project: {
                  _id: 1,
                  paymentId: 1,
                  subscriptionId: 1,
                  orderId: 1,
                  resolvedPlanId: 1,
                  amount: 1,
                  currency: 1,
                  status: 1,
                  type: 1,
                  paymentMethod: 1,
                  createdAt: 1,
                },
              },
            ],
          },
        },
      ],
      { maxTimeMS: MAX_TIME_MS },
    )
    .toArray();
  const total = result?.filteredCount[0]?.total || 0;
  return {
    page,
    pageSize: PAGE_SIZE,
    total,
    pages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    totals: (result?.totals || []).map((item) => ({
      currency: item._id || null,
      amount: number(item.amount),
      count: item.count,
    })),
    counts: (result?.counts || []).map((item) => ({
      status: item._id || "UNKNOWN",
      count: item.count,
    })),
    items: (result?.items || []).map((item) => ({
      id: String(item._id),
      paymentId: item.paymentId || null,
      subscriptionId: item.subscriptionId || null,
      orderId: item.orderId || null,
      planId: item.resolvedPlanId || null,
      amount: number(item.amount),
      currency: item.currency || null,
      status: item.status || "UNKNOWN",
      type: item.type || "PAYMENT",
      method: paymentMethod(item.paymentMethod),
      createdAt: date(item.createdAt),
    })),
  };
}

export async function getBillingDashboard(token) {
  try {
    const account = identity(token);
    const db = await paymentReadDatabase();
    // # Independent sections stay useful if country detection or one DB read fails.
    const results = await Promise.allSettled([
      catalog(db),
      subscription(db, account),
      transactions(db, account),
    ]);
    const section = (index) =>
      results[index].status === "fulfilled"
        ? { data: results[index].value, error: null }
        : { data: null, error: publicError(results[index].reason) };
    return {
      ok: true,
      account: { username: account.username, email: account.email },
      catalog: section(0),
      subscription: section(1),
      history: section(2),
      loadedAt: new Date().toISOString(),
    };
  } catch (error) {
    return { ok: false, error: publicError(error) };
  }
}

export async function getBillingTransactions(token, options) {
  try {
    const account = identity(token);
    return {
      ok: true,
      data: await transactions(
        await paymentReadDatabase(),
        account,
        options && typeof options === "object" ? options : {},
      ),
    };
  } catch (error) {
    return { ok: false, error: publicError(error) };
  }
}
