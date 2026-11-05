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
no writes and reads no wallets, reservations, or transactions.

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

## Estimates in other pipeline forms

The same route now accepts an allowlisted `operation` query parameter. Each
operation has a separate in-memory request and IndexedDB key
(`SIMPLEADS:<operation>`). Slider and option changes calculate locally; the
panel refresh button reloads the selected operation's rules from MongoDB.
Existing Lead Gen calls retain the default `LEAD_GEN_PIPELINE` behavior.

| Form | MongoDB operation | Quantity passed to calculation |
| --- | --- | --- |
| Google Maps | `GOOGLE_MAPS` | Selected place count (`RESULT`) |
| YouTube | `YOUTUBE_SCRAPER` | 1 run |
| Instagram | `INSTAGRAM_SCRAPER` | Selected item count (`RESULT`, minimum 50) |
| B2B directories | `B2B_SCRAPER` | Business count, including per-query limits |
| Investors | `INVESTOR_DATA_PIPELINE` | 1 run |

Rules with `pricingConfig.quantityUnit: "RESULT"` calculate against the selected
result count. Rules with `"RUN"`, or older scraper records without this field,
calculate against one run. Lead Gen retains its existing per-lead calculation.
The public rule validator preserves quantity metadata in the IndexedDB cache.

### Google Maps slider rule

The active Maps rule uses the Credit Service's existing dynamic calculation:

```json
{
  "type": "DYNAMIC_FEATURES",
  "basePricePerUnit": 1,
  "quantityUnit": "RESULT",
  "defaultQuantity": 50,
  "addons": {},
  "multipliers": {}
}
```

`basePricePerUnit` is one credit per place, not the price for the default block.
The UI derives the default base from `1 * 50 = 50 credits`. Each place added or
removed changes the estimate by one credit: 10 places cost 10, 49 cost 49,
50 cost 50, 51 cost 51, 100 cost 100, and 195 cost 195. There is no minimum
50-credit charge below the default result count.

The Credit Service backend is unchanged. Its quote/reserve calculation already
supports `basePricePerUnit * quantity`; callers must supply the place count as
`quantity`, not one run. The new `quantityUnit` and `defaultQuantity` fields guide
the UI and are ignored by that existing service calculation. These panels remain
previews and do not enable financial charging in the scraper execution routes.

Rules are fetched once per operation on page load, saved in IndexedDB, and kept
in memory for synchronous slider calculations. Changing the slider makes no
pricing API calls or IndexedDB reads. Explicit refresh or a full page reload
fetches current rules again; an offline fallback is visibly marked as saved pricing.

To enable YouTube estimates, add an active `SIMPLEADS / YOUTUBE_SCRAPER` record
in `credit_pricing`, using the same version, effective dates, and
`pricingConfig` schema as the other operations. Its dynamic `basePricePerUnit`
is the credits for one run. No YouTube price is hardcoded or seeded by this change.

For Europages Find emails, configure `pricingConfig.addons.enrich_emails` on
`SIMPLEADS / B2B_SCRAPER` (credits added per business), or the matching
`pricingConfig.multipliers.enrich_emails` if the intended rule is a multiplier.
Without either rule, selecting Find emails shows an unavailable total so its
extra cost cannot be mistaken for zero. Unselected enrichment keeps the base
B2B estimate. Other source and filter controls currently have no configured
surcharges and do not change the configured base rate.

Missing or invalid rules produce an explicit unavailable state. After updating
MongoDB, click the relevant panel's refresh button or reload the page. The
financial reserve/capture/release integration is unchanged by these previews.

### Instagram minimum and item pricing

The active `INSTAGRAM_SCRAPER` rule uses one credit per item with
`quantityUnit: "RESULT"`, `defaultQuantity: 50`, and `minimumQuantity: 50`.
The validator preserves minimum metadata in the cached public pricing snapshot.
The estimate calculates locally: 50 items = 50 credits, 51 = 51, 100 = 100.
FastAPI rejects requests below 50. Successful nonempty extraction charges at
least 50 items; failures and empty runs release the reservation. See the backend
`docs/INSTAGRAM_BILLING.md` for durable capture/release and source-specific limits.

### B2B result pricing

The active B2B rule uses one credit per business with `quantityUnit: "RESULT"`,
`defaultQuantity: 20`, and `minimumQuantity: 1`. For a single query, 20 results
estimate 20 credits and 21 estimate 21; smaller requests remain supported.
IndiaMART estimates multiply the limit by unique keyword count. Europages uses
a batch-wide total, while Yellow Pages uses only its first keyword.

FastAPI now reserves before actor startup and captures returned quantity after
success. Empty and failed runs release the reservation. Optional email
surcharges must be configured before Find emails can execute; FastAPI checks
existing service quotes only on submission. See `docs/B2B_BILLING.md` in the
backend for the financial and directory contracts. Slider/input estimate changes
remain entirely local using cached rules.
