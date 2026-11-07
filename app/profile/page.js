"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MotionConfig } from "framer-motion";
import {
  ArrowUpRight,
  Activity,
  CreditCard,
  FileText,
  LayoutGrid,
  LockKeyhole,
  Mail,
  MessageSquare,
  RefreshCw,
  ShieldCheck,
  UserRound,
  Workflow,
} from "lucide-react";
import Link from "next/link";
import {
  fetchAccountIdentity,
  fetchMyTickets,
  fetchReportRuns,
} from "../lib/api";
import { filterReports, sortReports } from "../lib/profileLogbook";
import { useAuth } from "../lib/AuthContext";
import { useSessionState } from "../hooks/useSessionState";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import AccountAvatar from "../components/AccountAvatar";
import ChangePasswordModal from "../components/profile/ChangePasswordModal";
import {
  ActivityMap,
  ErrorNote,
  LoadingNote,
  PasswordVault,
  PipelinePassport,
  ReportTimeline,
  SupportThread,
} from "../components/profile/ProfileLogbook";
import styles from "../components/profile/ProfileLogbook.module.css";

// # Profile counters start unknown; a failed request is never presented as zero activity.
// # Tab IDs are stable for keyboard navigation and their labelled panels.
const PROFILE_TABS = [
  { id: "overview", label: "Overview", Icon: LayoutGrid },
  { id: "reports", label: "Reports", Icon: FileText },
  { id: "support", label: "Support", Icon: MessageSquare },
  { id: "security", label: "Security", Icon: ShieldCheck },
];
const initialHistory = {
  reports: [],
  total: null,
  loading: true,
  complete: false,
  error: "",
};

export default function ProfilePage() {
  const { token, isInitializing } = useAuth();
  const router = useRouter();
  const [identity, setIdentity] = useState({
    account: null,
    loading: true,
    error: "",
  });
  const [history, setHistory] = useState(initialHistory);
  const [support, setSupport] = useState({
    tickets: [],
    loading: true,
    error: "",
  });
  const [reload, setReload] = useState(0);
  const [filters, setFilters] = useState({ pipeline: "", status: "", day: "" });
  const [visibleDays, setVisibleDays] = useState(3);
  const [activeTab, setActiveTab] = useState("overview");
  const [passwordOpen, setPasswordOpen] = useState(false);
  const closePassword = useCallback(() => setPasswordOpen(false), []);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useSessionState("renoweb-theme-dark", false);

  useEffect(() => {
    if (isInitializing) return;
    if (!token) {
      router.replace("/");
      return;
    }
    let cancelled = false;
    const loadIdentity = async () => {
      try {
        const account = await fetchAccountIdentity();
        if (!cancelled) setIdentity({ account, loading: false, error: "" });
      } catch {
        if (!cancelled)
          setIdentity({
            account: null,
            loading: false,
            error: "Your account identity could not be loaded.",
          });
      }
    };
    const loadTickets = async () => {
      try {
        const data = await fetchMyTickets();
        if (!Array.isArray(data.tickets))
          throw new Error("Invalid tickets response");
        if (!cancelled)
          setSupport({ tickets: data.tickets, loading: false, error: "" });
      } catch {
        if (!cancelled)
          setSupport((current) => ({
            ...current,
            loading: false,
            error: "Your support tickets could not be loaded.",
          }));
      }
    };
    const loadHistory = async () => {
      try {
        const first = await fetchReportRuns(1, 100);
        if (
          !Array.isArray(first.reports) ||
          !Number.isInteger(first.total) ||
          !Number.isInteger(first.pages)
        )
          throw new Error("Invalid history response");
        if (cancelled) return;
        const firstComplete =
          first.pages <= 1 && first.reports.length === first.total;
        setHistory({
          reports: sortReports(first.reports),
          total: first.total,
          complete: firstComplete,
          loading: first.pages > 1,
          error:
            first.pages <= 1 && !firstComplete
              ? "History changed while loading. Refresh to read the complete record."
              : "",
        });
        if (first.pages <= 1) return;
        // # Fetch every server page before describing aggregates as complete history.
        const pages = await Promise.allSettled(
          Array.from({ length: first.pages - 1 }, (_, index) =>
            fetchReportRuns(index + 2, 100),
          ),
        );
        if (cancelled) return;
        const records = [...first.reports];
        let failed = false;
        for (const page of pages) {
          if (page.status === "fulfilled" && Array.isArray(page.value.reports))
            records.push(...page.value.reports);
          else failed = true;
        }
        const unique = [
          ...new Map(
            records.map((report, index) => [
              report.id || `record-${index}`,
              report,
            ]),
          ).values(),
        ];
        const complete = !failed && unique.length === first.total;
        setHistory({
          reports: sortReports(unique),
          total: first.total,
          loading: false,
          complete,
          error: complete
            ? ""
            : "Some history is missing or changed while loading. The activity overview and pipeline counts use only the loaded reports. Refresh to try again.",
        });
      } catch {
        if (!cancelled)
          setHistory((current) => ({
            ...current,
            loading: false,
            complete: false,
            error:
              "Your report history could not be loaded. Any entries already shown are still available.",
          }));
      }
    };
    // # Identity, support, and history fail independently so one error cannot hide another feature.
    Promise.allSettled([loadIdentity(), loadTickets(), loadHistory()]);
    return () => {
      cancelled = true;
    };
  }, [token, isInitializing, router, reload]);

  const retry = () => {
    setIdentity((current) => ({ ...current, loading: true, error: "" }));
    setSupport((current) => ({ ...current, loading: true, error: "" }));
    setHistory((current) => ({
      ...current,
      loading: true,
      complete: false,
      error: "",
    }));
    setReload((value) => value + 1);
  };
  const onFilter = (changes) => {
    setFilters((current) => ({ ...current, ...changes }));
    setVisibleDays(3);
  };
  const filteredReports = useMemo(
    () => filterReports(history.reports, filters),
    [history.reports, filters],
  );
  const email = identity.account?.email;
  const username = identity.account?.username;
  const pipelineCount = useMemo(
    () =>
      new Set(
        history.reports.map(
          (report) => report.report_type || "Unspecified pipeline",
        ),
      ).size,
    [history.reports],
  );

  function openReportFilter(changes) {
    // # Calendar and pipeline selections open the Reports tab with their actual
    // # filter retained. Switching tabs never discards already loaded reports.
    onFilter(changes);
    setActiveTab("reports");
  }

  function navigateTabs(event, index) {
    // # Use automatic activation with roving focus; Tab enters the selected
    // # panel, while arrows/Home/End move among the account sections.
    const keys = {
      ArrowRight: (index + 1) % PROFILE_TABS.length,
      ArrowLeft: (index + PROFILE_TABS.length - 1) % PROFILE_TABS.length,
      Home: 0,
      End: PROFILE_TABS.length - 1,
    };
    if (!Object.hasOwn(keys, event.key)) return;
    event.preventDefault();
    const next = PROFILE_TABS[keys[event.key]].id;
    setActiveTab(next);
    document.getElementById(`profile-tab-${next}`)?.focus();
  }

  if (isInitializing || !token)
    return (
      <div className={styles.page} data-theme={isDark ? "dark" : "light"}>
        <div className={styles.authLoading}>
          <LoadingNote>Opening your account...</LoadingNote>
        </div>
      </div>
    );

  return (
    <MotionConfig reducedMotion="user">
      <div className={styles.page} data-theme={isDark ? "dark" : "light"}>
        <Header
          isDark={isDark}
          onToggleTheme={() => setIsDark((value) => !value)}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        <div className="lg:hidden">
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            isMobileOnly
            onModuleChange={(module) => {
              sessionStorage.setItem(
                "renoweb-active-module",
                JSON.stringify(module),
              );
              window.dispatchEvent(new Event("local-session-storage"));
              router.push("/dashboard");
            }}
          />
        </div>
        <main className={styles.paper} id="account-profile">
          <div className={styles.masthead}>
            <div>
              <span className={styles.eyebrow}>WORKSPACE / ACCOUNT</span>
              <h1>
                My profile<span>.</span>
              </h1>
              <p>Your identity, workspace activity, and account controls.</p>
            </div>
            <Link href="/dashboard">
              Back to dashboard
              <ArrowUpRight size={15} />
            </Link>
          </div>
          <header className={styles.identity}>
            <div className={styles.heroMesh} aria-hidden="true" />
            <div className={styles.identityAnchor}>
              <div className={styles.avatarFrame}>
                <AccountAvatar
                  picture={identity.account?.picture}
                  fallback={(username || email || "?").charAt(0).toUpperCase()}
                  className={styles.signature}
                />
                <span className={styles.avatarAccent} aria-hidden="true" />
              </div>
              <div>
                {identity.loading ? (
                  <LoadingNote>Loading your account...</LoadingNote>
                ) : identity.error ? (
                  <ErrorNote onRetry={retry}>{identity.error}</ErrorNote>
                ) : (
                  <>
                    <p className={styles.welcome}>
                      <UserRound size={13} />
                      YOUR SIMPLEADS ACCOUNT
                    </p>
                    <h2 className={styles.accountName}>
                      {username || "Your account"}
                    </h2>
                    <p className={styles.email}>
                      <Mail size={15} />
                      {email || "Email not available"}
                    </p>
                    <span className={styles.accountCaption}>
                      Your workspace. Your next opportunity.
                    </span>
                  </>
                )}
              </div>
            </div>
            <div
              className={styles.heroStats}
              aria-label="Account activity summary"
            >
              <div>
                <span className={styles.statIcon}>
                  <FileText size={19} />
                </span>
                <strong>
                  {history.total === null
                    ? "?"
                    : history.total.toLocaleString()}
                </strong>
                <span>Total reports</span>
              </div>
              <div>
                <span className={styles.statIcon}>
                  <Workflow size={19} />
                </span>
                <strong>
                  {history.complete || history.reports.length
                    ? pipelineCount.toLocaleString()
                    : "?"}
                </strong>
                <span>
                  {history.complete ? "Pipelines used" : "Pipelines loaded"}
                </span>
              </div>
            </div>
          </header>
          <div className={styles.tabBar}>
            <div
              className={styles.tabs}
              role="tablist"
              aria-label="Profile sections"
            >
              {PROFILE_TABS.map(({ id, label, Icon }, index) => (
                <button
                  key={id}
                  type="button"
                  id={`profile-tab-${id}`}
                  role="tab"
                  aria-selected={activeTab === id}
                  aria-controls={`profile-panel-${id}`}
                  tabIndex={activeTab === id ? 0 : -1}
                  onClick={() => setActiveTab(id)}
                  onKeyDown={(event) => navigateTabs(event, index)}
                >
                  <Icon size={17} />
                  {label}
                </button>
              ))}
            </div>
            <button
              type="button"
              className={styles.refresh}
              onClick={retry}
              disabled={identity.loading || history.loading || support.loading}
              aria-label="Refresh profile data"
            >
              <RefreshCw size={15} />
              <span>Refresh data</span>
            </button>
          </div>
          {/* # All panels stay mounted so filters, selected calendar month, and
              scrollable report state survive tab changes without another fetch. */}
          <section
            id="profile-panel-overview"
            className={styles.tabPanel}
            role="tabpanel"
            aria-labelledby="profile-tab-overview"
            tabIndex={0}
            hidden={activeTab !== "overview"}
          >
            {history.error && (
              <ErrorNote onRetry={retry}>{history.error}</ErrorNote>
            )}
            <ActivityMap
              reports={history.reports}
              complete={history.complete}
              selectedDay={filters.day}
              onSelectDay={(day) => openReportFilter({ day })}
              loading={history.loading}
            />
            <div className={styles.overviewGrid}>
              <PipelinePassport
                reports={history.reports}
                complete={history.complete}
                selected={filters.pipeline}
                onSelect={(pipeline) => openReportFilter({ pipeline })}
              />
              <aside className={styles.quickAccess}>
                <span className={styles.shortcutIcon}>
                  <CreditCard size={25} />
                </span>
                <p className={styles.eyebrow}>BILLING & SUBSCRIPTIONS</p>
                <h2>Your plan. One place.</h2>
                <p>
                  View your current subscription, compare plans, and manage your
                  payment history.
                </p>
                <Link href="/settings">
                  Open billing settings
                  <ArrowUpRight size={17} />
                </Link>
                <div className={styles.shortcutFoot}>
                  <LockKeyhole size={14} />
                  Account access stays protected.
                </div>
              </aside>
            </div>
          </section>
          <section
            id="profile-panel-reports"
            className={styles.tabPanel}
            role="tabpanel"
            aria-labelledby="profile-tab-reports"
            tabIndex={0}
            hidden={activeTab !== "reports"}
          >
            <ReportTimeline
              reports={filteredReports}
              allReports={history.reports}
              total={history.total}
              complete={history.complete}
              loading={history.loading}
              error={history.error}
              onRetry={retry}
              filters={filters}
              onFilter={onFilter}
              visibleDays={visibleDays}
              onLoadEarlier={() => setVisibleDays((value) => value + 3)}
            />
          </section>
          <section
            id="profile-panel-support"
            className={styles.tabPanel}
            role="tabpanel"
            aria-labelledby="profile-tab-support"
            tabIndex={0}
            hidden={activeTab !== "support"}
          >
            <SupportThread {...support} onRetry={retry} />
          </section>
          <section
            id="profile-panel-security"
            className={styles.tabPanel}
            role="tabpanel"
            aria-labelledby="profile-tab-security"
            tabIndex={0}
            hidden={activeTab !== "security"}
          >
            <div className={styles.securityGrid}>
              <PasswordVault
                disabled={!username}
                onOpen={() => setPasswordOpen(true)}
              />
              <aside className={styles.securityInfo}>
                <span className={styles.shortcutIcon}>
                  <ShieldCheck size={25} />
                </span>
                <p className={styles.eyebrow}>EMAIL VERIFICATION</p>
                <h2>A secure password update.</h2>
                <p>
                  Password changes use a one-time code sent to your registered
                  email. Keep access to this inbox before you begin.
                </p>
                <dl>
                  <div>
                    <dt>Account username</dt>
                    <dd>{username || "Unavailable"}</dd>
                  </div>
                  <div>
                    <dt>Registered email</dt>
                    <dd>{email || "Unavailable"}</dd>
                  </div>
                </dl>
              </aside>
            </div>
          </section>
          <footer className={styles.colophon}>
            <Activity size={14} />
            <span>
              {history.complete
                ? "Activity is up to date with the reports loaded for this visit."
                : "Activity reflects the records currently available for this visit."}
            </span>
          </footer>
        </main>
        {/* # Preserve the existing OTP reset contract and fresh state per opening. */}
        {passwordOpen && (
          <ChangePasswordModal
            isOpen
            onClose={closePassword}
            username={identity.account.username}
          />
        )}
      </div>
    </MotionConfig>
  );
}
