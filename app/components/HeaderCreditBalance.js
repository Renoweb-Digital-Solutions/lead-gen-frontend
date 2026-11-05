"use client";

import { useEffect, useState } from "react";
import { Coins, RefreshCw } from "lucide-react";
import { useAuth } from "../lib/AuthContext";
import { getLeadGenCreditBalance } from "../lib/api";

// # The shared header shows spendable credits across modules, independently of run estimates.
export default function HeaderCreditBalance({ refreshKey = "" }) {
  const { token } = useAuth();
  const [resource, setResource] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const requestKey = `${refreshKey}:${refresh}`;
  // # Never render a previous account's wallet or an amount from before a pipeline update.
  const current =
    resource?.token === token && resource?.requestKey === requestKey
      ? resource
      : null;
  const loading = Boolean(token && !current);
  const balance = current?.balance;

  useEffect(() => {
    if (!token) return;
    let controller;
    let disposed = false;

    // # Abort older refreshes so a slow response cannot overwrite a newer wallet result.
    const loadBalance = async () => {
      controller?.abort();
      const request = new AbortController();
      controller = request;
      try {
        const value = await getLeadGenCreditBalance(request.signal);
        if (!disposed && !request.signal.aborted) {
          setResource({ token, requestKey, balance: value });
        }
      } catch (error) {
        // # Failed refreshes replace the old amount with an explicit unavailable state.
        if (!disposed && !request.signal.aborted) {
          setResource({ token, requestKey, error: error.message });
        }
      }
    };

    // # Reload after tab focus and every 30 seconds to pick up purchases or other runs.
    // # Hidden tabs skip polling; focus performs the next refresh when the user returns.
    const refreshVisibleBalance = () => {
      if (document.visibilityState === "visible") void loadBalance();
    };
    void loadBalance();
    const interval = window.setInterval(refreshVisibleBalance, 30000);
    window.addEventListener("focus", refreshVisibleBalance);
    window.addEventListener("simpleads:credits-changed", refreshVisibleBalance);
    return () => {
      disposed = true;
      controller?.abort();
      window.clearInterval(interval);
      window.removeEventListener("focus", refreshVisibleBalance);
      window.removeEventListener("simpleads:credits-changed", refreshVisibleBalance);
    };
  }, [token, requestKey]);

  if (!token) return null;

  const amount = loading
    ? "Loading..."
    : balance
      ? balance.availableCredits.toLocaleString()
      : "Unavailable";

  return (
    <div className="flex shrink-0 items-center gap-2 rounded-lg border border-border bg-[var(--rw-bg)] px-2.5 py-1.5">
      <Coins size={16} className="text-amber-500" aria-hidden="true" />
      <div
        className="flex items-baseline gap-2"
        aria-live="polite"
        aria-atomic="true"
      >
        <span className="text-xs font-medium text-[var(--rw-text-muted)]">
          <span className="hidden sm:inline">Available </span>credits
        </span>
        <span className="text-sm font-bold tabular-nums text-[var(--rw-text)]">
          {amount}
        </span>
      </div>
      <button
        type="button"
        onClick={() => setRefresh((value) => value + 1)}
        disabled={loading}
        aria-label="Refresh available credit balance"
        title={current?.error || "Refresh available credit balance"}
        className="rounded p-1 text-[var(--rw-text-muted)] transition-colors hover:bg-[var(--rw-surface-hover)] hover:text-[var(--rw-text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 disabled:opacity-40"
      >
        <RefreshCw
          size={13}
          className={loading ? "animate-spin motion-reduce:animate-none" : ""}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}
