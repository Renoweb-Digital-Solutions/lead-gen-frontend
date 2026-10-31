# Lead Gen slider pricing preview

Set these server-only values in the Next.js `.env`:

```dotenv
# Use a MongoDB account with read-only access to credit_pricing in this database.
CREDIT_PRICING_MONGO_URL=
CREDIT_PRICING_DB_NAME=credit_service
```

The URL is intentionally blank for the operator to fill in. Do not use a
`NEXT_PUBLIC_` prefix. Restart Next.js after setting these values, and configure
the same server environment variables on deployment.

On the first Lead Gen view in a browser document, the frontend fetches
`GET /api/leadgen/pricing`. The Next.js server reads the active
`SIMPLEADS / LEAD_GEN_PIPELINE` record from `credit_pricing`, using the same
effective-date filter and highest-version selection as the Credit Service. It
returns only pricing rules, version, operation, and effective dates. It performs
no writes and reads no wallets, reservations, transactions, or other modules.

The browser saves the returned rules in IndexedDB:

- Database: `simpleads-credit-pricing`
- Object store: `rules`
- Record key: `SIMPLEADS:LEAD_GEN_PIPELINE`

React uses an in-memory copy for instant estimates. Slider and feature changes
make no HTTP requests and require no IndexedDB reads. Dynamic feature pricing
and flat tiers match the current Credit Service calculation, including upward
rounding. All numeric prices come from MongoDB; none are hardcoded.

The page-open fetch is shared across React development effect replays and
component remounts in the same document. A full page reload or a new window
fetches again. Refresh explicitly fetches again and updates the IndexedDB
record. There is no polling or automatic price-change notification.

If network pricing is unavailable, a validated saved IndexedDB record may supply
a clearly labeled cached estimate, subject to its effective dates. If IndexedDB
is blocked, fresh network pricing still works. A missing server URL with no saved
rules displays an unavailable estimate rather than a fabricated price.

These calculations are previews only. Financial enforcement and settlement must
remain authoritative in the Credit Service. The separate FastAPI balance call
remains in place; per-slider FastAPI quote requests have been removed.
