"use client";

import { useEffect, useState } from "react";
import { Coins, RefreshCw } from "lucide-react";
import { useAuth } from "../lib/AuthContext";
import { getLeadGenCreditBalance } from "../lib/api";

// # These labels describe confirmed financial states, independently of actor progress.
const CREDIT_STATUSES = {
  RESERVED: "Credits reserved",
  CAPTURED: "Credits charged",
  RELEASED: "Credits released",
  RELEASE_PENDING: "Credit release pending",
  CAPTURE_PENDING: "Credit confirmation pending",
};

// # Balance and status are shown throughout People/Company/Jobs/Scoring/Export.
// # LeadGenApp supplies live progress; no quote is invented while the service lacks a quote API.
export default function LeadGenCredits({ progressState, errorCode }) {
  const { token } = useAuth();
  const [refresh, setRefresh] = useState(0);
  const [resource, setResource] = useState(null);
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
            <p className="text-sm font-semibold text-[var(--rw-text)]">
              Unavailable
            </p>
          </div>
          <button
            type="button"
            onClick={() => setRefresh((value) => value + 1)}
            disabled={!token || loading}
            aria-label="Refresh credit balance"
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
