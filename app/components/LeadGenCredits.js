"use client";

import { useEffect, useState } from "react";
import { Coins, RefreshCw } from "lucide-react";
import { useAuth } from "../lib/AuthContext";
import { getLeadGenCreditBalance } from "../lib/api";
import { calculateLeadGenEstimate } from "../lib/leadGenPricing";
import {
  loadLeadGenPricing,
  resetLeadGenPricing,
} from "../lib/leadGenPricingCache";

// # These labels describe confirmed financial states, independently of actor progress.
const CREDIT_STATUSES = {
  RESERVED: "Credits reserved",
  CAPTURED: "Credits charged",
  RELEASED: "Credits released",
  RELEASE_PENDING: "Credit release pending",
  CAPTURE_PENDING: "Credit confirmation pending",
};

// # Balance and status are shown throughout People/Company/Jobs/Scoring/Export.
// # LeadGenApp supplies selections and progress; slider previews use downloaded Credit Service pricing rules.
export default function LeadGenCredits({
  formState,
  progressState,
  errorCode,
}) {
  const { token } = useAuth();
  const [refresh, setRefresh] = useState(0);
  const [resource, setResource] = useState(null);
  const [pricingResource, setPricingResource] = useState(null);
  // # These are feature keys from the service guide, not prices. Jobs scoring runs with jobs intelligence.
  const features = [];
  if (formState.emailStatus === "verified") features.push("email_verified");
  if (formState.hasPhone === true) features.push("has_phone");
  if (formState.includeJobs)
    features.push("include_jobs_data", "ai_relevance_scoring");
  if (formState.exportFormat === "bundle") features.push("export_full_bundle");
  if (formState.exportFormat === "summary") features.push("export_summary_csv");
  const quantity = formState.totalResults;
  const validQuantity =
    Number.isSafeInteger(quantity) && quantity > 0 && quantity <= 1000;
  const currentPricing =
    pricingResource?.token === token && pricingResource?.refresh === refresh
      ? pricingResource
      : null;
  // # Calculation is synchronous and local: slider movement never triggers an effect or an HTTP request.
  let estimate;
  let estimateError = currentPricing?.error;
  if (currentPricing?.pricing && validQuantity) {
    try {
      estimate = calculateLeadGenEstimate(
        currentPricing.pricing,
        quantity,
        features,
      );
    } catch (error) {
      estimateError = error.message;
    }
  }
  const credits = progressState?.credits;
  const terminal = ["completed", "failed", "cancelled"].includes(
    progressState?.status,
  )
    ? progressState.status
    : "running";
  // # A rejected start can mean another run spent the balance; reload it after credit errors too.
  const requestKey = `${refresh}:${terminal}:${credits?.status || ""}:${errorCode || ""}`;
  // # A session change immediately hides the previous user's wallet until its own request completes.
  const current =
    resource?.token === token && resource?.requestKey === requestKey
      ? resource
      : null;
  const loading = Boolean(token && !current);
  const balance = current?.balance;
  const creditLabel = CREDIT_STATUSES[credits?.status];

  useEffect(() => {
    if (!token) return;
    const controller = new AbortController();
    // # Cancel stale requests when leaving Lead Gen, changing accounts, or receiving settlement updates.
    getLeadGenCreditBalance(controller.signal).then(
      (value) => {
        if (!controller.signal.aborted)
          setResource({ token, requestKey, balance: value });
      },
      (error) => {
        if (!controller.signal.aborted)
          setResource({ token, requestKey, error: error.message });
      },
    );
    return () => controller.abort();
  }, [token, requestKey]);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    // # The module shares a single page-open fetch across remounts and React development effect replays.
    loadLeadGenPricing().then(
      (value) => {
        if (!cancelled) setPricingResource({ token, refresh, ...value });
      },
      (error) => {
        if (!cancelled)
          setPricingResource({ token, refresh, error: error.message });
      },
    );
    return () => {
      cancelled = true;
    };
  }, [token, refresh]);

  return (
    <section
      aria-label="Lead generation credits"
      className="mb-6 rounded-2xl border border-border bg-surface p-4 sm:p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-brand-sky/10 p-2.5 text-brand-blue">
            <Coins size={20} aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--rw-text-muted)]">
              Available credits
            </p>
            <p
              className="text-lg font-bold text-[var(--rw-text)]"
              aria-live="polite"
            >
              {!token
                ? "Sign in to view"
                : loading
                  ? "Loading…"
                  : balance
                    ? balance.availableCredits.toLocaleString()
                    : "Unavailable"}
            </p>
            {balance && (
              <p className="text-xs text-[var(--rw-text-muted)]">
                {balance.reservedCredits.toLocaleString()} reserved
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--rw-text-muted)]">
              Run estimate
            </p>
            <p
              className="text-sm font-semibold text-[var(--rw-text)]"
              aria-live="polite"
            >
              {!token
                ? "Sign in to view"
                : !validQuantity
                  ? "Choose lead count"
                  : !currentPricing
                    ? "Loading…"
                    : estimate
                      ? `${estimate.credits.toLocaleString()} credits`
                      : "Unavailable"}
            </p>
            {estimate && (
              <p className="text-xs text-[var(--rw-text-muted)]">
                For up to {estimate.quantity.toLocaleString()} leads
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              resetLeadGenPricing();
              setRefresh((value) => value + 1);
            }}
            disabled={!token || loading}
            aria-label="Refresh credit balance and estimate"
            className="rounded-lg border border-border p-2 text-brand-blue transition-colors hover:bg-brand-sky/10 disabled:opacity-40"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
      {current?.error && (
        <p role="status" className="mt-3 text-sm text-[var(--rw-text-muted)]">
          {current.error}
        </p>
      )}
      {estimateError && (
        <p role="status" className="mt-3 text-sm text-[var(--rw-text-muted)]">
          {estimateError}
        </p>
      )}
      {estimate && currentPricing?.cached && (
        <p role="status" className="mt-3 text-xs text-[var(--rw-text-muted)]">
          Estimate uses saved pricing. Refresh to check the latest price.
        </p>
      )}
      {estimate && balance && estimate.credits > balance.availableCredits && (
        <p role="status" className="mt-3 text-sm font-medium text-amber-600">
          This estimate exceeds your available credits.
        </p>
      )}
      {errorCode === "INSUFFICIENT_CREDITS" && (
        <p role="alert" className="mt-3 text-sm font-medium text-red-600">
          Not enough credits for this run. Please add credits and try again.
        </p>
      )}
      {creditLabel && (
        <p role="status" className="mt-3 text-sm font-medium text-brand-blue">
          {creditLabel}
        </p>
      )}
    </section>
  );
}
