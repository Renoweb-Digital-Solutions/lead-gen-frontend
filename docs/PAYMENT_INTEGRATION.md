# Payment integration

## Implemented request flows

| Action                         | Request path                                                                                                                                                                              |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| New password or Google signup  | Browser calls FastAPI OTP verification. FastAPI calls `POST /api/v1/subscriptions/free`, requires a valid success response, then creates the account and returns the application session. |
| Existing-user login            | Browser calls FastAPI. No starter-tier payment request is made.                                                                                                                           |
| Recurring subscription         | Browser calls `/api/billing` in Next.js. Next.js calls `POST /api/v1/subscriptions` directly.                                                                                             |
| One-time credits / 30-day pass | Browser calls `/api/billing` in Next.js. Next.js calls `POST /api/v1/orders` directly.                                                                                                    |
| Billing dashboard and history  | Browser invokes authenticated Next.js Server Actions; Next.js reads payment MongoDB directly, scoped to the signed account and SIMPLEADS.                                                 |
| Checkout reference status      | Optional `/api/billing?action=status` route checks the payment API.                                                                                                                       |

Paid checkout performs **no MongoDB reads or writes**. Next.js now asks FastAPI to determine the visitor's allowed pricing region before listing plans and again before creating checkout; payment creation still goes directly from Next to the payment microservice. Next.js verifies the signed HS256 session locally and obtains the stable user ID, email, and username from that signature-protected payload. FastAPI adds `user_id` and `email` when issuing sessions after signup or login. The browser cannot override identity, pricing region, prices, application, or return URL. An out-of-region plan ID is rejected server-side before creating an order or mandate. The payment service owns all order, subscription, payment-ledger, webhook, and credit-fulfillment persistence. No duplicate application payment records or checkout-checkpoint collections are maintained. Country and pricing-market policy run in FastAPI using free local DB-IP data, with no account or paid API. See [country pricing setup and Vercel deployment](../../lead-gen-backend/docs/BILLING_REGIONS.md).

The browser does not call the payment microservice itself. It calls a same-origin Next.js server route, preserving the originally requested server-side boundary. Cashfree's browser SDK/hosted page still handles the customer's payment authorization.

## Signup behavior

FastAPI owns signup end to end. The frontend no longer has a registration coordinator route, and there are no public registration claim/completion endpoints or registration tickets. OTP verification returns the usual access-token response after all mandatory steps succeed.

FastAPI reserves identity and a stable future user ID in `registration_intents`, calls the starter endpoint, saves the matching subscription receipt, then creates `users` inside a local MongoDB transaction. It sends welcome emails and issues a token only afterward. A payment error, timeout, duplicate conflict, or invalid receipt prevents account creation. The service call runs outside transaction callbacks so a MongoDB retry cannot dispatch another grant.

A pending intent is a recovery record, not a user account. Unknown remote outcomes remain reserved rather than automatically retrying the non-idempotent grant. See the backend runbook for recovery. A successful HTTP response does not establish synchronous credit-wallet fulfillment: that remains asynchronous in the payment service.

## Settings and checkout

`/settings` loads all available **regional paid plans automatically** after the authenticated session initializes. There is no See plans gate, manual payment-status gate, sandbox reset button, or Spend placeholder. A detailed membership card shows the active entitlement, price, credit allocation, cycle dates/progress, renewal preference, authorization status, cycle counters, and reference. The adjacent identity panel shows billing contact and next scheduled credit action. The payment journal includes server-side reference search, status filters, eight-row pagination, transaction detail dialogs, and copyable references. The responsive layout uses scoped ivory, charcoal, and muted gold styling with reduced-motion support.

Each deliberate checkout submission makes a fresh `POST /api/billing` request. Selecting a plan opens a confirmation dialog that collects the existing gateway-required Indian mobile number. Next verifies identity and region, creates a new order/subscription through the payment service, and returns its new checkout session/link. The browser opens it using the Cashfree hosted link or SDK. A busy flag and synchronous guard prevent simultaneous submissions. The payment service's rejection message is displayed inside the dialog, including plan-change conflicts. No cached-session reuse, checkout-attempt storage, reset button, or automatic mutation retry exists.

Cashfree gets `subsSessionId` for subscriptions and `paymentSessionId` for orders. HTTPS links on Cashfree subdomains can open directly. Gateway redirects are never payment proof; the dashboard refreshes the server records on return, and the refresh control can reload them after webhook processing. Authorization, captured payments, and asynchronous credit delivery are distinct states.

## Direct read-only billing Server Actions

The dashboard's direct database reads were explicitly requested for the detailed billing UI. `app/settings/actions.js` exports `getBillingDashboard(token)` and `getBillingTransactions(token, options)`. `app/lib/server/paymentReadDatabase.js` owns a small reusable server-only MongoDB pool. The existing `mongodb` dependency is reused. No database writes, duplicate payment collections, or payment-microservice changes were added.

Every action verifies the signed FastAPI JWT before connecting. The stable signed `user_id` supplies the MongoDB filter; no user ID, application name, collection name, or arbitrary query is accepted from the browser. Account suspension claims remain snapshots at token issuance, as with existing checkout authentication. Browser local storage currently holds the application token, so the client passes that token to each authenticated action; the MongoDB URI never goes to the client.

- Plans: active SIMPLEADS paid offers filtered by FastAPI's server-detected country/currency. Checkout independently revalidates the region through FastAPI and the plan through the payment API.
- Membership: prefer paid over free starter records; ACTIVE records must not have an expired period. CANCELLED/COMPLETED records remain visible only during an unexpired paid period and display that access ends. Missing dates, counters, and amounts are displayed as unavailable rather than fabricated.
- Transactions: exact signed `userId`, additionally scoped to SIMPLEADS. Older records missing `application` must join an owned SIMPLEADS subscription or order. Orphaned legacy records cannot be attributed safely and are excluded.
- Projection: only display fields leave the server. Raw payment-method objects, gateway sessions, auth links, and MongoDB credentials are never serialized. Methods are reduced to a category such as UPI or Card.
- History: literal escaped search across references, controlled status filters, stable date/ID ordering, eight-row pagination, bounded inputs, and query timeouts. Totals use the complete scoped successful ledger and remain separate for every currency. Zero-value authorization records stay visible; plan prices are never substituted for recorded amounts. Credit allocation is explicitly not a wallet balance.
- Failures: catalog, membership, and history have independent error states. Driver errors are sanitized; no database details are returned. All reads run on demand through actions; no payment records are cached in browser storage.

## Server configuration

Next.js server environment:

```dotenv
PAYMENT_SERVICE_URL=http://127.0.0.1:8081
PAYMENT_SERVICE_INTERNAL_API_KEY=<existing payment service internal key>
APP_ORIGIN=http://localhost:3000
CASHFREE_MODE=sandbox
AUTH_JWT_SECRET=<same persistent value as FastAPI JWT_SECRET_KEY>
PAYMENT_READ_MONGO_URL=<payment MongoDB URI; use a read-only database user in production>
PAYMENT_READ_DB_NAME=payment_service
```

The old `BILLING_MONGO_URL` and `BILLING_DB_NAME` remain unused. The new `PAYMENT_READ_*` variables are used only for dashboard reads. Local values were copied from the existing payment-service configuration without printing credentials. On Vercel, configure these server-only variables, allow the deployment to reach MongoDB, and use TLS with a database principal restricted to reading `plans`, `subscriptions`, `orders`, and `payment_transactions`. Restart the development server after environment changes. `AUTH_JWT_SECRET` must match FastAPI's persistent `JWT_SECRET_KEY`; it stays server-only and rotation must be coordinated. **Sign out and sign in again after the signed-identity deployment**: older tokens lack the new signed user ID/email and are rejected for billing rather than using a browser-supplied identity fallback. Account identity and suspension claims are a snapshot at token issuance; the stateless payment proxy does not perform real-time account-deletion or suspension checks. Sessions remain usable until their expiry unless the signing key is rotated. Checkout routes still perform no database operations; dashboard Server Actions perform the authorized direct reads described above; the pre-existing, separate credit-pricing route is outside this change.

FastAPI server environment:

```dotenv
PAYMENT_SERVICE_URL=http://127.0.0.1:8081
PAYMENT_SERVICE_INTERNAL_API_KEY=<existing payment service internal key>
```

FastAPI retains its existing JWT and MongoDB settings. `REGISTRATION_INTERNAL_SECRET` remains unused. `FASTAPI_INTERNAL_URL` is now used solely for the newly authorized country-policy request. Both servers need the same `BILLING_GEO_INTERNAL_SECRET`; production backend needs `APP_ENV=production`, the country-file path, and automatic refresh enabled. Vercel provides the protected visitor-IP header. See the [regional pricing configuration](../../lead-gen-backend/docs/BILLING_REGIONS.md#configuration-for-vercel-and-fastapi). Missing revised local entries were added without printing secret values. Restart both applications. Open the app using `APP_ORIGIN` exactly, or change it to the correct hostname/port. Production should use the canonical HTTPS app origin and Cashfree mode matching the payment service.

## Verified payment-service limitations

The original README was compared with the local service code, not accepted as an atomicity guarantee:

- Endpoint paths and top-level plan/order/subscription response fields match the controllers.
- Free-tier creation inserts the subscription before queue publication. There is no compensation/revoke endpoint or transactional outbox. A duplicate 409 is not fulfillment proof.
- RabbitMQ publishing uses a regular channel, without publisher confirms. Credit delivery remains asynchronous.
- `internalAuth` exists but is not attached to the financial routes. Keep the payment service private or authenticate it at a gateway; sending an internal header from this app cannot fix missing upstream enforcement.
- Webhook recovery uses persisted `PENDING_QUEUE` state rather than the README's described cross-system rollback.
- The sparse compound unique subscription index includes existing user/application fields. It is not a partial unique index restricted to free plans and may conflict with repeated paid subscriptions after gateway initialization.
- Cancellation changes the subscription before queue publication; it cannot reverse signup safely.

If the free-tier operation succeeds but MongoDB fails afterward, its subscription/credits cannot be undone through the current API. FastAPI returns an error and creates no usable account until its final local transaction commits, but upstream cleanup or fulfillment reconciliation may be necessary. Full distributed rollback still requires a service-owner contract change. Neither microservice source was modified.

## Validation boundary

Backend tests exercise the payment adapter, mandatory signup sequencing, rejection of uncertain/mismatched responses, and existing-user login isolation. No frontend tests, builds, screenshots, browser checks, live grants, or live payments were run. Real MongoDB/RabbitMQ/gateway failure injection remains unverified.

## Payment-service error messages

The Next payment adapter preserves the payment microservice's `message`, HTTP error status, and string `code`. It exposes the message as the same-origin route's `detail`, which the settings page already renders. For example, a service rejection with HTTP 409 and a plan-change explanation is displayed with that explanation instead of the previous generic 503 message. No plan-upgrade rule or explanation is fabricated by Next; the service remains authoritative. Missing messages and non-JSON responses use a generic fallback. The adapter does not forward the complete upstream `details` object. No frontend tests or live payment requests were run for this change.

## Dashboard validation boundary

Source and formatting were reviewed. No frontend tests, builds, screenshots, browser checks, live database queries, or live payment requests were run for the dashboard redesign. The UI and live subscription/history results still need user verification. No FastAPI runtime change was needed for this redesign; signup and region policy remain in FastAPI.
