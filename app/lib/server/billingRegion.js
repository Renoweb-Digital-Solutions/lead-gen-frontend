import "server-only";
import { isIP } from "node:net";
import { BillingError } from "./payments";

function visitorIp(request) {
  // # Only Vercel's protected visitor-IP header is trusted in production. Merely
  // # sending a Vercel-looking header to a different host cannot enable this path.
  // # Never guess from X-Forwarded-For chains or a browser-submitted country/IP.
  if (process.env.NODE_ENV === "development") return "127.0.0.1";
  if (process.env.VERCEL !== "1")
    throw new BillingError(
      "Regional pricing requires the configured Vercel ingress.",
    );
  const value = request.headers.get("x-vercel-forwarded-for")?.trim();
  if (!value || !isIP(value))
    throw new BillingError(
      "Your country could not be determined. Please try again later.",
    );
  return value;
}

export async function billingRegion(request, planCurrency) {
  const base = process.env.FASTAPI_INTERNAL_URL?.replace(/\/$/, "");
  const secret = process.env.BILLING_GEO_INTERNAL_SECRET;
  if (!base || !secret || secret.length < 32)
    throw new BillingError("Regional pricing is not configured.");
  const url = new URL(base);
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.search ||
    url.hash
  )
    throw new BillingError("Regional pricing is not configured.");
  // # The backend owns country-to-currency policy. Selected plan currency comes
  // # from the payment catalog, not from the browser, and is rechecked at checkout.
  const response = await fetch(`${base}/internal/billing/region`, {
    method: "POST",
    cache: "no-store",
    redirect: "error",
    headers: {
      "Content-Type": "application/json",
      "x-billing-geo-secret": secret,
    },
    body: JSON.stringify({
      visitor_ip: visitorIp(request),
      ...(planCurrency ? { plan_currency: planCurrency } : {}),
    }),
    signal: AbortSignal.timeout(10000),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new BillingError(
      response.status === 403
        ? typeof data.detail === "string"
          ? data.detail
          : "This plan is not available in your region."
        : "Regional pricing is temporarily unavailable.",
      response.status === 403 ? 403 : 503,
    );
  }
  if (
    !/^[A-Z]{2}$/.test(data.country || "") ||
    !["INR", "USD", "EUR"].includes(data.currency)
  )
    throw new BillingError("Regional pricing is temporarily unavailable.");
  return { country: data.country, currency: data.currency };
}
