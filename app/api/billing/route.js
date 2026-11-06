import {
  payment,
  configuration,
  mutationOrigin,
  BillingError,
  failure,
  json,
} from "../../lib/server/payments";
import { billingIdentity } from "../../lib/server/billingIdentity";
import { billingRegion } from "../../lib/server/billingRegion";

export const runtime = "nodejs";

export async function GET(request) {
  try {
    const account = billingIdentity(request);
    const query = new URL(request.url).searchParams;
    if (query.get("action") === "status") {
      const kind = query.get("kind");
      const id = query.get("id");
      if (
        !["orders", "subscriptions"].includes(kind) ||
        !/^[a-zA-Z0-9_-]{1,200}$/.test(id || "")
      )
        throw new BillingError("Invalid payment reference.", 400);
      const data = await payment(`/${kind}/${encodeURIComponent(id)}`);
      const record = kind === "orders" ? data.order : data.subscription;
      if (record?.userId !== account.id || record.application !== "SIMPLEADS")
        throw new BillingError("Payment reference not found.", 404);
      // # Return state only; redirect query parameters never confirm payment.
      return json({
        status: record.status,
        authStatus: record.authStatus,
        kind,
        id,
      });
    }
    const region = await billingRegion(request);
    const data = await payment(
      `/plans?application=SIMPLEADS&currency=${region.currency}`,
    );
    if (!Array.isArray(data.plans))
      throw new BillingError("Plan catalog is unavailable.");
    return json({
      region,
      plans: data.plans
        .filter(
          (plan) =>
            plan.application === "SIMPLEADS" &&
            plan.active &&
            plan.amount > 0 &&
            plan.currency === region.currency,
        )
        .map((plan) => ({
          planId: plan.planId,
          name: plan.name,
          description: plan.description,
          amount: plan.amount,
          currency: plan.currency,
          billingType: plan.billingType,
          creditsAllocated: plan.creditsAllocated,
          creditsPerCycle: plan.creditsPerCycle,
          totalCycles: plan.totalCycles,
          intervalType: plan.intervalType,
        })),
    });
  } catch (error) {
    return failure(error);
  }
}

export async function POST(request) {
  try {
    mutationOrigin(request);
    const account = billingIdentity(request);
    const input = await request.json();
    if (
      typeof input.planId !== "string" ||
      !/^[a-zA-Z0-9_-]{1,100}$/.test(input.planId) ||
      !/^[6-9][0-9]{9}$/.test(input.phone || "")
    ) {
      throw new BillingError(
        "Choose a plan and enter a valid 10-digit Indian mobile number.",
        422,
      );
    }
    const { plan } = await payment(
      `/plans/${encodeURIComponent(input.planId)}`,
    );
    if (
      !plan?.active ||
      plan.application !== "SIMPLEADS" ||
      !(plan.amount > 0) ||
      !["INR", "USD", "EUR"].includes(plan.currency) ||
      !["SUBSCRIPTION", "ONE_TIME"].includes(plan.billingType)
    )
      throw new BillingError("This plan is unavailable.", 400);
    // # A filtered list alone is insufficient: reject a manually substituted
    // # plan ID against FastAPI's current region policy before any money request.
    await billingRegion(request, plan.currency);
    // # The payment service owns order/subscription persistence. This route only
    // # validates identity and plan details, then returns the checkout response.
    const kind =
      plan.billingType === "SUBSCRIPTION" ? "subscriptions" : "orders";
    const config = configuration();
    const placeholder =
      kind === "orders" ? "order_id={order_id}" : "sub_id={sub_id}";
    const receipt = await payment(`/${kind}`, {
      userId: account.id,
      planId: plan.planId,
      application: "SIMPLEADS",
      customerName: account.username,
      customerEmail: account.email,
      customerPhone: input.phone,
      returnUrl: `${config.origin}/settings?${placeholder}`,
    });
    const record = kind === "orders" ? receipt.order : receipt.subscription;
    if (record?.userId !== account.id || record.application !== "SIMPLEADS")
      throw new BillingError("Checkout needs support reconciliation.");
    const result = {
      kind,
      id: kind === "orders" ? record.orderId : record.subscriptionId,
      session:
        kind === "orders"
          ? receipt.paymentSessionId || receipt.paymentLink
          : receipt.authLink,
      mode: config.mode,
    };
    // # Never return the service's localhost checkout simulator URL to the browser.
    if (!result.id || typeof result.session !== "string" || !result.session)
      throw new BillingError(
        "Checkout session was not returned. Contact support.",
      );
    return json(result);
  } catch (error) {
    return failure(error);
  }
}
