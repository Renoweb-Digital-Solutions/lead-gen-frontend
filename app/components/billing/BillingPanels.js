"use client";

import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Coins,
  CreditCard,
  Crown,
  Globe2,
  Receipt,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { cadence, count, day, money, statusLabel, statusTone } from "./format";
import s from "./Billing.module.css";

export function Notice({ children, error = false }) {
  return (
    <div
      className={`${s.notice} ${error ? s.noticeError : ""}`}
      role={error ? "alert" : "status"}
    >
      <CircleHelp size={17} />
      <span>{children}</span>
    </div>
  );
}

export function Skeleton({ compact = false }) {
  return (
    <div
      className={`${s.skeleton} ${compact ? s.skeletonCompact : ""}`}
      aria-label="Loading billing details"
    >
      <span />
      <span />
      <span />
    </div>
  );
}

function SubscriptionWaves() {
  // # Two seamless SVG surfaces drift at different speeds behind the content.
  // # They do not represent usage, balance, or cycle progress; CSS disables all
  // # motion when the user requests reduced motion.
  return (
    <div className={s.waveField} aria-hidden="true">
      <svg
        className={s.waveBack}
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path d="M0 160 C180 60 540 260 720 160 C900 60 1260 260 1440 160 V320 H0 Z" />
      </svg>
      <svg
        className={s.waveFront}
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <path d="M0 160 C180 260 540 60 720 160 C900 260 1260 60 1440 160 V320 H0 Z" />
      </svg>
    </div>
  );
}

export function SubscriptionCard({ section, loading }) {
  if (loading) return <Skeleton />;
  if (section?.error)
    return (
      <div className={s.sectionError}>
        <Notice error>{section.error}</Notice>
      </div>
    );
  const sub = section?.data?.current;
  if (!sub)
    return (
      <section className={`${s.subscription} ${s.emptySubscription}`}>
        <div className={s.heroGlow} aria-hidden="true" />
        <SubscriptionWaves />
        <span className={s.eyebrowLight}>
          <span className={s.liveDot} /> YOUR MEMBERSHIP
        </span>
        <div className={s.emptyMembershipIcon}>
          <Sparkles size={30} />
        </div>
        <h2>
          Ready for your
          <br />
          <em>next upgrade.</em>
        </h2>
        <p>
          No active subscription is recorded for your account. Find your fit in
          the plans below.
        </p>
        <a href="#plans" className={s.heroLink}>
          Explore your options <ArrowDownLeft size={17} />
        </a>
      </section>
    );
  const start = sub.periodStart ? new Date(sub.periodStart).getTime() : null;
  const end = sub.periodEnd ? new Date(sub.periodEnd).getTime() : null;
  // # This track measures elapsed membership time, not credit consumption.
  // # A free tier or incomplete record may have no bounded cycle at all.
  const progress =
    start && end && end > start
      ? Math.min(100, Math.max(0, ((Date.now() - start) / (end - start)) * 100))
      : null;
  const daysLeft = end
    ? Math.max(0, Math.ceil((end - Date.now()) / 86400000))
    : null;
  const entitledCancellation =
    sub.cancelAtPeriodEnd || ["CANCELLED", "COMPLETED"].includes(sub.status);
  return (
    <section className={s.subscription}>
      <div className={s.heroGlow} aria-hidden="true" />
      <SubscriptionWaves />
      <div className={s.subscriptionTop}>
        <span className={s.eyebrowLight}>
          <span className={s.liveDot} /> YOUR CURRENT MEMBERSHIP
        </span>
        <span className={s.heroBadge}>
          {entitledCancellation ? "Ends this cycle" : statusLabel(sub.status)}
        </span>
      </div>
      <div className={s.subscriptionBody}>
        <div>
          <span className={s.membershipType}>
            {sub.isFree ? "STARTER SUBSCRIPTION" : "SIMPLEADS SUBSCRIPTION"}
          </span>
          <h2>{sub.name}</h2>
          <div className={s.heroPrice}>
            {money(sub.amount, sub.currency)}{" "}
            <span>/ {cadence(sub).replace(/^per /, "")}</span>
          </div>
          <p className={s.heroDescription}>
            {sub.isFree
              ? "Starter access is active on your workspace."
              : "Your plan details, renewal schedule, and credit allocation."}
          </p>
        </div>
        <div
          className={s.orbit}
          aria-label={`${count(sub.creditsPerCycle)} credits per cycle`}
        >
          <div className={s.orbitInner}>
            <Coins size={23} />
            <strong>{count(sub.creditsPerCycle)}</strong>
            <span>credits / cycle</span>
          </div>
          <span className={s.orbitDot} />
        </div>
      </div>
      <div className={s.cycleTrack}>
        <div className={s.cycleLabel}>
          <span>
            <CalendarDays size={14} />
            {sub.periodStart
              ? `Cycle started ${day(sub.periodStart)}`
              : `Member since ${day(sub.createdAt)}`}
          </span>
          <strong>
            {daysLeft !== null
              ? `${daysLeft} days left in cycle`
              : "No renewal scheduled"}
          </strong>
        </div>
        <div className={s.progressTrack}>
          <span style={{ width: `${progress ?? 0}%` }} />
        </div>
      </div>
      <div className={s.subscriptionDetails}>
        <div>
          <span>Current cycle ends</span>
          <strong>{day(sub.periodEnd)}</strong>
        </div>
        <div>
          <span>Renewal preference</span>
          <strong>
            {sub.isFree
              ? "No payment mandate"
              : sub.billingType === "ONE_TIME"
                ? "One-time access"
                : entitledCancellation
                  ? "Ends at period close"
                  : "Auto-renewing"}
          </strong>
        </div>
        <div>
          <span>Credit cycles delivered</span>
          <strong>
            {count(sub.completedCycles)}
            {sub.totalCycles > 1
              ? ` of ${count(sub.totalCycles)}`
              : " recorded"}
          </strong>
        </div>
        <div>
          <span>Mandate authorization</span>
          <strong>{statusLabel(sub.authStatus)}</strong>
        </div>
        <div>
          <span>Charged cycles recorded</span>
          <strong>{count(sub.chargedCycles)}</strong>
        </div>
        <div>
          <span>Plan reference</span>
          <strong>{sub.planId}</strong>
        </div>
      </div>
      <div className={s.subscriptionFoot}>
        <span className={s.reference} title={sub.id}>
          Membership / {sub.id}
        </span>
        <span>
          <ShieldCheck size={14} />
          {sub.isFree ? "Free starter" : "Cashfree checkout"}
        </span>
      </div>
    </section>
  );
}

export function AccountCard({ account, current, loading }) {
  return (
    <aside className={s.accountCard}>
      <div className={s.accountHeader}>
        <span className={s.sectionKicker}>BILLING DETAILS</span>
        <CreditCard size={18} />
      </div>
      <h3>Account details.</h3>
      <p>Contact and schedule for your current subscription.</p>
      <dl>
        <div>
          <dt>Account holder</dt>
          <dd>{loading ? "Loading…" : account?.username || "—"}</dd>
        </div>
        <div>
          <dt>Billing email</dt>
          <dd className={s.email}>{account?.email || "—"}</dd>
        </div>
        <div>
          <dt>Member since</dt>
          <dd>{current?.createdAt ? day(current.createdAt) : "—"}</dd>
        </div>
        {current?.phone && (
          <div>
            <dt>Billing mobile</dt>
            <dd>{current.phone}</dd>
          </div>
        )}
        <div>
          <dt>Next credit action</dt>
          <dd>
            {current?.nextActionAt
              ? day(current.nextActionAt)
              : "Not scheduled"}
          </dd>
        </div>
        {current?.maxRolloverCap !== null &&
          current?.maxRolloverCap !== undefined && (
            <div>
              <dt>Credit rollover ceiling</dt>
              <dd>{count(current.maxRolloverCap)} credits</dd>
            </div>
          )}
      </dl>
      <div className={s.accountNote}>
        <ShieldCheck size={19} />
        <span>
          Payments handled by Cashfree.
          <br />
          Your card details stay with the gateway.
        </span>
      </div>
    </aside>
  );
}

export function SummaryStrip({ history, current, loading }) {
  // # These are server-calculated ledger totals. Credit allocation is separate
  // # from the credit service's live balance and must never impersonate it.
  if (loading) return <Skeleton compact />;
  const data = history?.data;
  const totalRecords = data?.counts?.reduce((sum, item) => sum + item.count, 0);
  const successful = data?.counts
    ?.filter((item) => ["SUCCESS", "PAID", "COMPLETED"].includes(item.status))
    .reduce((sum, item) => sum + item.count, 0);
  return (
    <div className={s.summaryStrip}>
      <div>
        <span className={s.summaryIcon}>
          <Receipt size={19} />
        </span>
        <div>
          <span className={s.statLabel}>Recorded payments</span>
          <strong>
            {data
              ? data.totals.length
                ? data.totals
                    .map((item) => money(item.amount, item.currency))
                    .join(" · ")
                : "No settled payments"
              : "Unavailable"}
          </strong>
          <small>Successful ledger amounts, by currency</small>
        </div>
      </div>
      <div>
        <span className={s.summaryIcon}>
          <Check size={19} />
        </span>
        <div>
          <span className={s.statLabel}>Successful transactions</span>
          <strong>
            {data ? count(successful) : "—"}
            <em> / {data ? count(totalRecords) : "—"} total</em>
          </strong>
          <small>Includes zero-value authorizations</small>
        </div>
      </div>
      <div>
        <span className={s.summaryIcon}>
          <Coins size={19} />
        </span>
        <div>
          <span className={s.statLabel}>Your cycle allocation</span>
          <strong>
            {count(current?.creditsPerCycle)}
            <em> credits</em>
          </strong>
          <small>Plan allocation, not remaining balance</small>
        </div>
      </div>
    </div>
  );
}

export function PlanGallery({ section, loading, current, onChoose, busy }) {
  const plans = section?.data?.plans || [];
  const region = section?.data?.region;
  const country = region
    ? new Intl.DisplayNames(["en"], { type: "region" }).of(region.country)
    : null;
  return (
    <section id="plans" className={s.plansSection}>
      <div className={s.sectionHeading}>
        <div>
          <span className={s.sectionKicker}>PLANS & PRICING</span>
          <h2>
            Choose your next plan<span>.</span>
          </h2>
          <p>
            Compare billing options and find the right fit for your workspace.
          </p>
        </div>
        {region && (
          <span className={s.regionBadge}>
            <Globe2 size={14} />
            {country}
            <span />
            {region.currency}
          </span>
        )}
      </div>
      {loading ? (
        <div className={s.planGrid}>
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </div>
      ) : section?.error ? (
        <Notice error>{section.error}</Notice>
      ) : !plans.length ? (
        <div className={s.emptyState}>
          <Globe2 size={28} />
          <h3>No plans available here yet.</h3>
          <p>There are no active paid offers for your detected location.</p>
        </div>
      ) : (
        <div className={s.planGrid}>
          {plans.map((plan) => {
            const annual = plan.intervalType === "YEAR" || plan.totalCycles > 1;
            const oneTime = plan.billingType === "ONE_TIME";
            const highlighted = annual && !oneTime;
            const isCurrent = current?.planId === plan.id;
            const credits = plan.creditsPerCycle ?? plan.credits;
            const Icon = oneTime ? CreditCard : annual ? Crown : Sparkles;
            return (
              <article
                key={plan.id}
                className={`${s.planCard} ${highlighted ? s.planFeatured : oneTime ? s.planPass : s.planMonthly} ${isCurrent ? s.planCurrent : ""}`}
              >
                <div className={s.planCardTop}>
                  <span className={s.planIcon}>
                    <Icon size={22} strokeWidth={1.5} />
                  </span>
                  <span className={s.planTag}>
                    {isCurrent
                      ? "YOUR CURRENT PLAN"
                      : oneTime
                        ? "ONE-TIME PASS"
                        : annual
                          ? "ANNUAL MEMBERSHIP"
                          : "MONTHLY MEMBERSHIP"}
                  </span>
                </div>
                <h3>{plan.name}</h3>
                <p className={s.planDescription}>
                  {plan.description ||
                    "Your next step toward better connections."}
                </p>
                <div className={s.planPrice}>
                  {money(plan.amount, plan.currency)}
                  <span>{cadence(plan)}</span>
                </div>
                <div className={s.planDivider} />
                <ul>
                  <li>
                    <Check size={15} />
                    <span>
                      <strong>{count(credits)} credits</strong>
                      {plan.creditsPerCycle ? " per cycle" : " included"}
                    </span>
                  </li>
                  {annual && (
                    <li>
                      <Check size={15} />
                      <span>
                        {count(plan.totalCycles)} scheduled credit cycles
                      </span>
                    </li>
                  )}
                  <li>
                    <Check size={15} />
                    <span>
                      {oneTime
                        ? `${plan.accessDurationDays || 30}-day access, no auto-renewal`
                        : "Automatic renewal, consistent access"}
                    </span>
                  </li>
                  {plan.rolloverAllowed && (
                    <li>
                      <Check size={15} />
                      <span>
                        {plan.maxRolloverCap !== null
                          ? `Rollover up to ${count(plan.maxRolloverCap)} credits`
                          : "Credit rollover included"}
                      </span>
                    </li>
                  )}
                  <li>
                    <ShieldCheck size={15} />
                    <span>Secure checkout with Cashfree</span>
                  </li>
                </ul>
                <button
                  onClick={() => onChoose(plan)}
                  disabled={busy}
                  className={s.planButton}
                >
                  Choose this plan <ArrowUpRight size={17} />
                </button>
                <span className={s.planIndex}>
                  {isCurrent
                    ? "Currently active on your workspace"
                    : oneTime
                      ? "Single payment ? Fixed access period"
                      : annual
                        ? "Annual billing ? Scheduled credit cycles"
                        : "Monthly billing ? Recurring access"}
                </span>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export function TransactionHistory({
  section,
  loading,
  query,
  onQuery,
  status,
  onStatus,
  page,
  onPage,
  onSelect,
}) {
  const data = section?.data;
  const filters = [
    { id: "all", label: "All activity" },
    { id: "successful", label: "Successful" },
    { id: "pending", label: "Pending" },
    { id: "failed", label: "Unsuccessful" },
  ];
  return (
    <section id="history" className={s.historySection}>
      <div className={s.sectionHeading}>
        <div>
          <span className={s.sectionKicker}>PAYMENT ACTIVITY</span>
          <h2>
            Transaction history<span>.</span>
          </h2>
          <p>A clear record of your transactions, all in one place.</p>
        </div>
        <span className={s.historyCount}>
          {data ? count(data.total) : "—"} records
        </span>
      </div>
      <div className={s.historyCard}>
        <div className={s.historyToolbar}>
          <div
            className={s.filterTabs}
            role="group"
            aria-label="Filter transaction status"
          >
            {filters.map((filter) => (
              <button
                key={filter.id}
                aria-pressed={status === filter.id}
                onClick={() => onStatus(filter.id)}
                className={status === filter.id ? s.filterActive : ""}
              >
                {filter.label}
              </button>
            ))}
          </div>
          <label className={s.search}>
            <Search size={16} />
            <input
              aria-label="Search payment history by reference"
              value={query}
              onChange={(event) => onQuery(event.target.value)}
              placeholder="Search a payment reference"
              maxLength={80}
            />
          </label>
        </div>
        {section?.error ? (
          <div className={s.historyError}>
            <Notice error>{section.error}</Notice>
          </div>
        ) : loading ? (
          <Skeleton compact />
        ) : !data?.items?.length ? (
          <div className={s.emptyState}>
            <Receipt size={30} />
            <h3>
              {query || status !== "all"
                ? "No matching entries."
                : "No transactions yet."}
            </h3>
            <p>
              {query || status !== "all"
                ? "Try another reference or status filter."
                : "Transactions appear here after they are recorded by the payment service."}
            </p>
          </div>
        ) : (
          <div className={s.tableScroll}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th>Transaction</th>
                  <th>Date & time</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th className={s.amountColumn}>Amount</th>
                  <th>
                    <span className={s.visuallyHidden}>Details</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((transaction) => (
                  <tr
                    key={transaction.id}
                    onClick={() => onSelect(transaction)}
                  >
                    <td>
                      <div className={s.transactionCell}>
                        <span className={s.transactionIcon}>
                          {transaction.subscriptionId ? (
                            <ArrowDownLeft size={17} />
                          ) : (
                            <CreditCard size={17} />
                          )}
                        </span>
                        <div>
                          <strong>
                            {transaction.type === "SUBSCRIPTION_CYCLE"
                              ? "Subscription payment"
                              : transaction.type === "ONE_TIME_PASS"
                                ? "One-time pass"
                                : statusLabel(transaction.type)}
                          </strong>
                          <span
                            className={s.shortReference}
                            title={transaction.paymentId || transaction.id}
                          >
                            {transaction.paymentId || transaction.id}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <strong className={s.dateText}>
                        {day(transaction.createdAt)}
                      </strong>
                      <span className={s.timeText}>
                        {transaction.createdAt
                          ? new Intl.DateTimeFormat("en", {
                              hour: "numeric",
                              minute: "2-digit",
                            }).format(new Date(transaction.createdAt))
                          : "—"}
                      </span>
                    </td>
                    <td>
                      <span className={s.method}>{transaction.method}</span>
                    </td>
                    <td>
                      <span
                        className={`${s.status} ${s[statusTone(transaction.status)]}`}
                      >
                        <i />
                        {statusLabel(transaction.status)}
                      </span>
                    </td>
                    <td className={s.amountColumn}>
                      <strong className={s.transactionAmount}>
                        {money(transaction.amount, transaction.currency)}
                      </strong>
                      {transaction.amount === 0 && (
                        <span className={s.zeroNote}>Zero-value record</span>
                      )}
                    </td>
                    <td>
                      <button
                        className={s.rowButton}
                        onClick={(event) => {
                          event.stopPropagation();
                          onSelect(transaction);
                        }}
                        aria-label={`View transaction ${transaction.paymentId || transaction.id}`}
                      >
                        <ArrowUpRight size={17} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className={s.tableFooter}>
          <span>
            {data?.total
              ? `Showing ${(page - 1) * data.pageSize + 1}–${Math.min(page * data.pageSize, data.total)} of ${count(data.total)} entries`
              : "Payment records will appear here."}
          </span>
          <div className={s.pagination}>
            <button
              disabled={loading || page <= 1}
              onClick={() => onPage(page - 1)}
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </button>
            <span>
              {page}
              <em> / {data?.pages || 1}</em>
            </span>
            <button
              disabled={loading || !data || page >= data.pages}
              onClick={() => onPage(page + 1)}
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
      <p className={s.ledgerNote}>
        <ShieldCheck size={13} />
        Amounts come from recorded payments. Zero-value authorizations can
        appear separately from a plan’s listed price.
      </p>
    </section>
  );
}
