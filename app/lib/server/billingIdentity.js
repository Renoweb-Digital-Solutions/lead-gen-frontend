import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { BillingError } from "./payments";

export function billingIdentity(request) {
  // # Verify FastAPI's signed session locally. Payment routes perform no database
  // # operations and never trust user IDs or email supplied in the request body.
  const secret = process.env.AUTH_JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new BillingError("Billing authentication is not configured.");
  }
  let payload;
  try {
    const authorization = request.headers.get("authorization");
    if (!authorization?.startsWith("Bearer ") || authorization.length > 8192)
      throw new Error();
    const parts = authorization.slice(7).split(".");
    if (
      parts.length !== 3 ||
      parts.some((part) => !/^[A-Za-z0-9_-]+$/.test(part))
    )
      throw new Error();
    const [encodedHeader, encodedPayload, signature] = parts;
    const expected = createHmac("sha256", secret)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest();
    const supplied = Buffer.from(signature, "base64url");
    if (
      supplied.length !== expected.length ||
      !timingSafeEqual(supplied, expected)
    )
      throw new Error();
    const header = JSON.parse(
      Buffer.from(encodedHeader, "base64url").toString("utf8"),
    );
    payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8"),
    );
    const now = Date.now() / 1000;
    // # Only normal HS256 sessions are accepted; scoped tickets and unknown
    // # critical extensions cannot be substituted for application authentication.
    if (
      header.alg !== "HS256" ||
      header.crit !== undefined ||
      payload.aud !== undefined ||
      typeof payload.sub !== "string" ||
      !payload.sub ||
      payload.sub.length > 254 ||
      typeof payload.exp !== "number" ||
      !Number.isFinite(payload.exp) ||
      payload.exp <= now
    )
      throw new Error();
    for (const claim of ["nbf", "iat"]) {
      if (
        payload[claim] !== undefined &&
        (typeof payload[claim] !== "number" ||
          !Number.isFinite(payload[claim]) ||
          payload[claim] > now)
      )
        throw new Error();
    }
  } catch {
    throw new BillingError("Please sign in again.", 401);
  }
  // # Older sessions lack these signed fields. Require a fresh sign-in rather
  // # than accepting browser-provided identity as a compatibility fallback.
  if (
    typeof payload.user_id !== "string" ||
    !/^[A-Za-z0-9_-]{1,200}$/.test(payload.user_id) ||
    typeof payload.email !== "string" ||
    payload.email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)
  ) {
    throw new BillingError(
      "Please sign out and sign in again to enable billing.",
      401,
    );
  }
  if (payload.is_suspended !== false)
    throw new BillingError("This session cannot start a payment.", 403);
  return { id: payload.user_id, username: payload.sub, email: payload.email };
}
