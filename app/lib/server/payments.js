import "server-only";

// # Destinations come from deployment configuration, never browser input.
export function configuration() {
  const payment = process.env.PAYMENT_SERVICE_URL?.replace(/\/$/, "");
  const origin = process.env.APP_ORIGIN;
  const mode = process.env.CASHFREE_MODE;
  if (!payment || !origin || !["sandbox", "production"].includes(mode)) {
    throw new Error("Billing integration is not configured.");
  }
  for (const url of [payment, origin]) {
    const parsed = new URL(url);
    if (
      !["https:", "http:"].includes(parsed.protocol) ||
      parsed.username ||
      parsed.password
    )
      throw new Error("Invalid billing configuration.");
  }
  if (new URL(origin).origin !== origin)
    throw new Error("APP_ORIGIN must be an origin without a trailing slash.");
  return { payment, origin, mode };
}

export class BillingError extends Error {
  constructor(message, status = 503, code) {
    super(message);
    this.status = status;
    this.code = typeof code === "string" ? code : undefined;
  }
}

export async function payment(path, body) {
  return request(`${configuration().payment}/api/v1${path}`, {
    headers: {
      "x-internal-api-key": process.env.PAYMENT_SERVICE_INTERNAL_API_KEY || "",
    },
    body,
  });
}

// # Never retry upstream mutations: the service has no idempotency-key contract.
async function request(url, { headers, body }) {
  const response = await fetch(url, {
    method: body === undefined ? "GET" : "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    cache: "no-store",
    redirect: "error",
    signal: AbortSignal.timeout(20000),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok || data?.success !== true) {
    // # Preserve the payment service's published message, status, and code so
    // # business rejections reach the user. Do not forward the full details payload.
    const message =
      typeof data?.message === "string" && data.message.trim()
        ? data.message
        : "Payment service could not complete the request.";
    throw new BillingError(
      message,
      response.status >= 400 ? response.status : 502,
      data?.code,
    );
  }
  return data;
}

export function mutationOrigin(request) {
  if (request.headers.get("origin") !== configuration().origin)
    throw new BillingError("Request origin is not allowed.", 403);
}

export function failure(error) {
  return Response.json(
    {
      ...(error instanceof BillingError && error.code
        ? { code: error.code }
        : {}),
      detail:
        error instanceof BillingError
          ? error.message
          : "Billing is temporarily unavailable.",
    },
    {
      status: error instanceof BillingError ? error.status : 503,
      headers: { "Cache-Control": "no-store" },
    },
  );
}

export function json(data) {
  return Response.json(data, { headers: { "Cache-Control": "no-store" } });
}
