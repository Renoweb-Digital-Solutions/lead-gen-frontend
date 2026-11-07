"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Copy,
  CreditCard,
  LoaderCircle,
  LockKeyhole,
  RefreshCw,
  Moon,
  Sun,
  ShieldCheck,
  X,
} from "lucide-react";
import { useAuth } from "../../lib/AuthContext";
import {
  getBillingDashboard,
  getBillingTransactions,
} from "../../settings/actions";
import {
  AccountCard,
  Notice,
  PlanGallery,
  SubscriptionCard,
  SummaryStrip,
  TransactionHistory,
} from "./BillingPanels";
import { cadence, day, money, statusLabel, statusTone } from "./format";
import s from "./Billing.module.css";
import AccountMenu from "../AccountMenu";
import { useSessionState } from "../../hooks/useSessionState";

function Dialog({ open, onDismiss, locked = false, label, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);
  // # Native dialogs provide focus trapping, escape handling, and inert background.
  return (
    <dialog
      ref={ref}
      className={s.dialog}
      aria-label={label}
      onCancel={(event) => {
        event.preventDefault();
        if (!locked) onDismiss();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget && !locked) onDismiss();
      }}
    >
      <div className={s.dialogBody}>
        <button
          type="button"
          className={s.dialogClose}
          disabled={locked}
          onClick={onDismiss}
          aria-label="Close dialog"
        >
          <X size={19} />
        </button>
        {children}
      </div>
    </dialog>
  );
}

export default function BillingDashboard() {
  const { token, isInitializing } = useAuth();
  // # Reuse the dashboard/profile preference and its same-tab change event.
  // # Scope data-theme to this page; never mutate document/global theme state.
  const [isDark, setIsDark] = useSessionState("renoweb-theme-dark", false);
  const router = useRouter();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [history, setHistory] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [phone, setPhone] = useState("");
  const [checkoutBusy, setCheckoutBusy] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [sdkReady, setSdkReady] = useState(false);
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const checkoutInFlight = useRef(false);
  const historyRequest = useRef(0);

  useEffect(() => {
    // # Discard account-specific dialog/filter state when the signed session
    // # changes. A newly signed-in account must never inherit another receipt.
    setSelectedPlan(null);
    setSelectedTransaction(null);
    setPhone("");
    setQuery("");
    setSearch("");
    setStatus("all");
    setPage(1);
    setMessage("");
  }, [token]);

  useEffect(() => {
    if (!isInitializing && !token) router.replace("/");
  }, [isInitializing, token, router]);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    setLoading(true);
    setError("");
    // # One authenticated Server Action loads the catalog, membership, and ledger
    // # automatically. Late responses cannot update an account after sign-out.
    getBillingDashboard(token)
      .then((result) => {
        if (cancelled) return;
        if (!result.ok) {
          setDashboard(null);
          setError(result.error);
          return;
        }
        setDashboard({ ...result, token });
        setPhone(
          (value) =>
            value ||
            (/^[6-9][0-9]{9}$/.test(
              result.subscription.data?.current?.phone || "",
            )
              ? result.subscription.data.current.phone
              : ""),
        );
      })
      .catch(() => {
        if (!cancelled)
          setError(
            "Your billing details could not be loaded. Please refresh to try again.",
          );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token, refreshKey]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(query);
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const request = ++historyRequest.current;
    if (!dashboard || dashboard.token !== token) {
      setHistory(null);
      return;
    }
    if (!search && status === "all" && page === 1) {
      setHistory(dashboard.history);
      setHistoryLoading(false);
      return;
    }
    setHistoryLoading(true);
    // # Search and pagination are server-side. Never filter a partial page and
    // # present it as the user's complete history or calculate totals from it.
    getBillingTransactions(token, { page, query: search, status })
      .then((result) => {
        if (request !== historyRequest.current) return;
        if (result.ok && page > result.data.pages) {
          setPage(result.data.pages);
          return;
        }
        setHistory(
          result.ok
            ? { data: result.data, error: null }
            : { data: null, error: result.error },
        );
      })
      .catch(() => {
        if (request === historyRequest.current)
          setHistory({
            data: null,
            error: "Payment history could not be loaded.",
          });
      })
      .finally(() => {
        if (request === historyRequest.current) setHistoryLoading(false);
      });
  }, [dashboard, token, page, search, status]);

  useEffect(() => {
    // # Returning from Cashfree is a reason to show the latest server records,
    // # never evidence of payment. The transaction and subscription states decide.
    const query = new URLSearchParams(window.location.search);
    if (query.has("order_id") || query.has("sub_id"))
      setMessage(
        "Welcome back. Your latest billing records are shown below. Payment updates may take a moment to arrive.",
      );
  }, []);

  const currentDashboard = dashboard?.token === token ? dashboard : null;
  const current = currentDashboard?.subscription?.data?.current;
  const unavailable = error ? { data: null, error } : null;

  function choosePlan(plan) {
    setCheckoutError("");
    setSelectedPlan(plan);
  }

  async function checkout(event) {
    event.preventDefault();
    if (checkoutInFlight.current || !selectedPlan) return;
    if (!/^[6-9][0-9]{9}$/.test(phone)) {
      setCheckoutError("Enter a valid 10-digit Indian mobile number.");
      return;
    }
    if (!sdkReady || !window.Cashfree) {
      setCheckoutError(
        "Secure checkout is still loading. Please try again in a moment.",
      );
      return;
    }
    checkoutInFlight.current = true;
    setCheckoutBusy(true);
    setCheckoutError("");
    try {
      // # Every deliberate submission creates a fresh checkout. Read-only MongoDB
      // # access is for display; all payment writes stay in the payment service.
      const response = await fetch("/api/billing", {
        method: "POST",
        cache: "no-store",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planId: selectedPlan.id, phone }),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.detail || "Checkout could not be opened.");
      const url = new URL(window.location.href);
      url.searchParams.delete("order_id");
      url.searchParams.delete("sub_id");
      window.history.replaceState(window.history.state, "", url.toString());
      if (result.session.startsWith("https://")) {
        const destination = new URL(result.session);
        if (
          !destination.hostname.endsWith(".cashfree.com") ||
          destination.username ||
          destination.password
        )
          throw new Error("Unsupported checkout destination.");
        window.location.assign(destination.href);
        return;
      }
      const cashfree = window.Cashfree({ mode: result.mode });
      const outcome =
        result.kind === "subscriptions"
          ? await cashfree.subscriptionsCheckout({
              subsSessionId: result.session,
              redirectTarget: "_self",
            })
          : await cashfree.checkout({
              paymentSessionId: result.session,
              redirectTarget: "_self",
            });
      if (outcome?.error)
        throw new Error(
          outcome.error.message || "Checkout could not be opened.",
        );
      setSelectedPlan(null);
      setMessage(
        "Checkout returned. Your billing records will reflect the payment once it is confirmed.",
      );
      setRefreshKey((value) => value + 1);
    } catch (error) {
      setCheckoutError(error.message || "Checkout could not be opened.");
    } finally {
      checkoutInFlight.current = false;
      setCheckoutBusy(false);
    }
  }

  async function copyReference() {
    try {
      await navigator.clipboard.writeText(
        selectedTransaction.paymentId || selectedTransaction.id,
      );
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  if (isInitializing || !token)
    return (
      <main className={s.authLoading} data-theme={isDark ? "dark" : "light"}>
        <span className={s.loadingMark}>
          <CreditCard size={24} />
        </span>
        <p>Opening your billing space…</p>
      </main>
    );

  return (
    <div className={s.shell} data-theme={isDark ? "dark" : "light"}>
      <Script
        src="https://sdk.cashfree.com/js/v3/cashfree.js"
        onReady={() => setSdkReady(true)}
        onError={() =>
          setMessage(
            "Cashfree checkout could not load. You can still view your billing details.",
          )
        }
      />
      <header className={s.topbar}>
        <Link href="/dashboard" className={s.brand}>
          simpleads<span>®</span>
        </Link>
        <span className={s.topbarDivider} />
        <span className={s.workspaceLabel}>YOUR WORKSPACE</span>
        <nav>
          <Link href="/dashboard">
            <ArrowLeft size={14} />
            Dashboard
          </Link>
          <button
            type="button"
            className={s.themeToggle}
            onClick={() => setIsDark((value) => !value)}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            aria-pressed={isDark}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
            <span>{isDark ? "Light" : "Dark"}</span>
          </button>
          <AccountMenu />
        </nav>
      </header>
      <main className={s.main}>
        <div className={s.pageHeading}>
          <div>
            <span className={s.sectionKicker}>
              WORKSPACE SETTINGS / BILLING
            </span>
            <h1>
              Billing & <span>subscriptions</span>
            </h1>
            <p>
              Manage your subscription, explore plans, and track your payments
              from one place.
            </p>
          </div>
          <div className={s.pageTools}>
            <span className={s.privateBadge}>
              <LockKeyhole size={13} />
              SECURE BILLING WORKSPACE
            </span>
            <button
              className={s.refreshButton}
              onClick={() => setRefreshKey((value) => value + 1)}
              disabled={loading}
              aria-label="Refresh billing details"
            >
              <RefreshCw size={15} className={loading ? s.spin : ""} />
              Refresh details
            </button>
            {currentDashboard?.loadedAt && (
              <small>
                Updated{" "}
                {new Intl.DateTimeFormat("en", {
                  hour: "numeric",
                  minute: "2-digit",
                }).format(new Date(currentDashboard.loadedAt))}
              </small>
            )}
          </div>
        </div>
        <nav className={s.sectionNav} aria-label="Billing sections">
          <a href="#membership" className={s.sectionNavActive}>
            Membership <span>01</span>
          </a>
          <a href="#plans">
            Available plans <span>02</span>
          </a>
          <a href="#history">
            Transactions <span>03</span>
          </a>
        </nav>
        {message && <Notice>{message}</Notice>}
        {error && <Notice error>{error}</Notice>}
        <div id="membership" className={s.membershipGrid}>
          <SubscriptionCard
            loading={loading}
            section={currentDashboard?.subscription || unavailable}
          />
          <AccountCard
            loading={loading}
            account={currentDashboard?.account}
            current={current}
          />
        </div>
        <SummaryStrip
          loading={loading}
          history={currentDashboard?.history}
          current={current}
        />
        <PlanGallery
          loading={loading}
          section={currentDashboard?.catalog || unavailable}
          current={current}
          onChoose={choosePlan}
          busy={checkoutBusy}
        />
        <TransactionHistory
          loading={loading || historyLoading}
          section={history || unavailable}
          query={query}
          onQuery={setQuery}
          status={status}
          onStatus={(value) => {
            setStatus(value);
            setPage(1);
          }}
          page={page}
          onPage={setPage}
          onSelect={(transaction) => {
            setSelectedTransaction(transaction);
            setCopied(false);
          }}
        />
        <footer className={s.footer}>
          <span>SimpleAds ? Account & billing</span>
          <span>
            <ShieldCheck size={13} />
            Payments by Cashfree
            <span className={s.footerDot} />
            <a
              href="https://db-ip.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              IP Geolocation by DB-IP
            </a>
          </span>
        </footer>
      </main>
      <Dialog
        open={!!selectedPlan}
        onDismiss={() => setSelectedPlan(null)}
        locked={checkoutBusy}
        label="Continue to secure checkout"
      >
        {selectedPlan && (
          <>
            <span className={s.dialogIcon}>
              <CreditCard size={23} />
            </span>
            <span className={s.sectionKicker}>PLAN CHECKOUT</span>
            <h2>Confirm your plan.</h2>
            <p className={s.dialogIntro}>
              You’re choosing {selectedPlan.name}.
            </p>
            <div className={s.checkoutRecap}>
              <span>
                {selectedPlan.billingType === "ONE_TIME"
                  ? "One-time pass"
                  : "Recurring membership"}
              </span>
              <strong>
                {money(selectedPlan.amount, selectedPlan.currency)}
                <small>{cadence(selectedPlan)}</small>
              </strong>
            </div>
            <form onSubmit={checkout}>
              <label className={s.phoneLabel} htmlFor="billing-phone">
                Mobile number<span>Required by the payment gateway</span>
              </label>
              <div className={s.phoneField}>
                <span>+91</span>
                <input
                  id="billing-phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  maxLength={10}
                  value={phone}
                  onChange={(event) =>
                    setPhone(event.target.value.replace(/\D/g, ""))
                  }
                  placeholder="10-digit mobile number"
                  required
                  disabled={checkoutBusy}
                />
              </div>
              {checkoutError && <Notice error>{checkoutError}</Notice>}
              <button
                type="submit"
                className={s.checkoutButton}
                disabled={checkoutBusy || !sdkReady}
              >
                {checkoutBusy ? (
                  <>
                    <LoaderCircle size={17} className={s.spin} />
                    Opening secure checkout…
                  </>
                ) : (
                  <>
                    Continue to payment <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>
            <p className={s.secureNote}>
              <LockKeyhole size={13} />
              Your payment details are entered securely on Cashfree.
            </p>
          </>
        )}
      </Dialog>
      <Dialog
        open={!!selectedTransaction}
        onDismiss={() => setSelectedTransaction(null)}
        label="Transaction details"
      >
        {selectedTransaction && (
          <>
            <span className={s.dialogIcon}>
              <ArrowUpRight size={23} />
            </span>
            <span className={s.sectionKicker}>TRANSACTION RECORD</span>
            <h2>Payment details.</h2>
            <div className={s.receiptAmount}>
              {money(selectedTransaction.amount, selectedTransaction.currency)}
            </div>
            <span
              className={`${s.status} ${s[statusTone(selectedTransaction.status)]}`}
            >
              <i />
              {statusLabel(selectedTransaction.status)}
            </span>
            <dl className={s.receiptDetails}>
              <div>
                <dt>Recorded on</dt>
                <dd>{day(selectedTransaction.createdAt)}</dd>
              </div>
              <div>
                <dt>Payment method</dt>
                <dd>{selectedTransaction.method}</dd>
              </div>
              <div>
                <dt>Transaction type</dt>
                <dd>{statusLabel(selectedTransaction.type)}</dd>
              </div>
              <div>
                <dt>Plan reference</dt>
                <dd>{selectedTransaction.planId || "Not recorded"}</dd>
              </div>
              <div>
                <dt>
                  {selectedTransaction.subscriptionId
                    ? "Membership reference"
                    : "Order reference"}
                </dt>
                <dd>
                  {selectedTransaction.subscriptionId ||
                    selectedTransaction.orderId ||
                    "Not recorded"}
                </dd>
              </div>
              <div>
                <dt>Payment reference</dt>
                <dd>
                  {selectedTransaction.paymentId || selectedTransaction.id}
                </dd>
              </div>
            </dl>
            <button className={s.copyButton} onClick={copyReference}>
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? "Reference copied" : "Copy payment reference"}
            </button>
            <p className={s.receiptNote}>
              This is a payment record, not a tax invoice.
              {selectedTransaction.amount === 0
                ? " A zero-value record may represent gateway authorization rather than a plan charge."
                : ""}
            </p>
          </>
        )}
      </Dialog>
    </div>
  );
}
