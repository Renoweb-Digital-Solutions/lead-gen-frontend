"use client";

import { useEffect, useState } from "react";
import { Coins, RefreshCw } from "lucide-react";
import { calculateLeadGenEstimate } from "../lib/leadGenPricing";
import {
  loadPipelinePricing,
  resetPipelinePricing,
} from "../lib/leadGenPricingCache";

// # Reused by scraper forms. Prices come only from the active public MongoDB rules.
// # RESULT rules use the selected slider count; legacy RUN rules keep quantity one.
export default function PipelineCreditEstimate({
  operation,
  resultCount,
  minResults = 1,
  maxResults,
  resultLabel = "results",
  unitLabel,
  options = [],
  features = [],
  onPricingChange,
}) {
  const [refresh, setRefresh] = useState(0);
  const [resource, setResource] = useState(null);
  const current =
    resource?.operation === operation && resource?.refresh === refresh
      ? resource
      : null;
  const count = Number(resultCount);
  const validCount =
    Number.isSafeInteger(count) && count >= minResults && count <= maxResults;
  const selectedOptions = options.filter(Boolean);

  useEffect(() => {
    let cancelled = false;
    // # Options change the local calculation only; they never trigger quote or wallet mutations.
    loadPipelinePricing(operation).then(
      (value) => {
        if (!cancelled) setResource({ operation, refresh, ...value });
      },
      (error) => {
        if (!cancelled)
          setResource({ operation, refresh, error: error.message });
      },
    );
    return () => {
      cancelled = true;
    };
  }, [operation, refresh]);

  // # Optional form copy shares this exact rule and refresh lifecycle, without a second fetch.
  // # The callback should be stable (for example, a React state setter).
  useEffect(() => {
    onPricingChange?.(current?.pricing || null);
  }, [current, onPricingChange]);

  let estimate;
  let defaultEstimate;
  let message = current?.error;
  const perResult = current?.pricing?.pricingConfig.quantityUnit === "RESULT";
  if (current?.pricing && validCount) {
    const config = current.pricing.pricingConfig;
    // # A paid extra without a configured rule must not silently become a free option.
    const unpricedFeature = features.some(
      (feature) =>
        !Object.hasOwn(config.addons || {}, feature) &&
        !Object.hasOwn(config.fixedAddons || {}, feature) &&
        !Object.hasOwn(config.multipliers || {}, feature),
    );
    if (unpricedFeature) {
      message = "Pricing for the selected extra options is not configured yet.";
    } else {
      try {
        // # Slider movement recalculates from memory only. No fetching or storage reads occur here.
        // # Pass the same quantity that a backend quote/reservation must use for this operation.
        estimate = calculateLeadGenEstimate(
          current.pricing,
          perResult ? count : 1,
          features,
        );
        const defaultQuantity = config.defaultQuantity;
        if (perResult && defaultQuantity) {
          defaultEstimate = calculateLeadGenEstimate(
            current.pricing,
            defaultQuantity,
            features,
          );
        }
      } catch (error) {
        message = error.message;
      }
    }
  }

  // # An optional unit-rate label uses this same cached rule, never another pricing request.
  // # Show it only for plain per-result pricing so tiers or selected extras cannot imply a false rate.
  const unitRate =
    estimate &&
    unitLabel &&
    perResult &&
    current.pricing.pricingConfig.type === "DYNAMIC_FEATURES" &&
    features.length === 0
      ? current.pricing.pricingConfig.basePricePerUnit
      : null;

  return (
    <section
      aria-label="Estimated credit usage"
      className="my-5 rounded-xl border border-border bg-[var(--rw-bg)] p-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Coins
            size={19}
            className="shrink-0 text-amber-500"
            aria-hidden="true"
          />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--rw-text-muted)]">
              Estimated credit usage
            </p>
            <p
              className="mt-1 text-base font-bold tabular-nums text-[var(--rw-text)]"
              aria-live="polite"
            >
              {!validCount
                ? "Choose a valid result limit"
                : !current
                  ? "Loading..."
                  : estimate
                    ? `${estimate.credits.toLocaleString()} credits`
                    : "Pricing unavailable"}
            </p>
            {unitRate !== null && (
              <p className="mt-1 text-xs font-medium text-[var(--rw-text)]">
                <span className="text-amber-600 dark:text-amber-400">
                  {unitRate.toLocaleString()}{" "}
                  {unitRate === 1 ? "credit" : "credits"}
                </span>{" "}
                per {unitLabel}
              </p>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            resetPipelinePricing(operation);
            setRefresh((value) => value + 1);
          }}
          disabled={!current}
          aria-label="Refresh module credit estimate"
          className="rounded-lg border border-border p-2 text-[var(--rw-text-muted)] transition-colors hover:bg-[var(--rw-surface-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-40"
        >
          <RefreshCw
            size={15}
            className={
              !current ? "animate-spin motion-reduce:animate-none" : ""
            }
            aria-hidden="true"
          />
        </button>
      </div>
      {validCount && (
        <p className="mt-3 text-xs text-[var(--rw-text-muted)]">
          One run | Up to {count.toLocaleString()} {resultLabel}
          {selectedOptions.length > 0 && ` | ${selectedOptions.join(" | ")}`}
        </p>
      )}
      {estimate && (
        <p className="mt-2 text-xs text-[var(--rw-text-muted)]">
          {perResult
            ? "Estimate adjusts with your selected result limit."
            : "Current pricing is per run; the result limit does not change this estimate."}
          {defaultEstimate && (
            <span className="mt-1 block">
              {current.pricing.pricingConfig.minimumQuantity ===
              defaultEstimate.quantity
                ? "Minimum"
                : "Base"}
              : {defaultEstimate.credits.toLocaleString()} credits for{" "}
              {defaultEstimate.quantity.toLocaleString()} {resultLabel}.
            </span>
          )}
        </p>
      )}
      {message && (
        <p role="status" className="mt-2 text-xs text-amber-600">
          {message}
        </p>
      )}
      {current?.cached && (
        <p role="status" className="mt-2 text-xs text-[var(--rw-text-muted)]">
          Using saved pricing. Refresh to check the latest rates.
        </p>
      )}
    </section>
  );
}
