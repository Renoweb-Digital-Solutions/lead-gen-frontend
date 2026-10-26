"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MotionConfig } from "framer-motion";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { fetchAccountIdentity, fetchMyTickets, fetchReportRuns } from "../lib/api";
import { filterReports, sortReports } from "../lib/profileLogbook";
import { useAuth } from "../lib/AuthContext";
import { useSessionState } from "../hooks/useSessionState";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import AccountAvatar from "../components/AccountAvatar";
import ChangePasswordModal from "../components/profile/ChangePasswordModal";
import { ActivityMap, EmailSignature, ErrorNote, LoadingNote, PasswordVault, PipelinePassport, ReportTimeline, SupportThread } from "../components/profile/ProfileLogbook";
import styles from "../components/profile/ProfileLogbook.module.css";

// # Profile counters start unknown; a failed request is never presented as zero activity.
const initialHistory = { reports: [], total: null, loading: true, complete: false, error: "" };

export default function ProfilePage() {
  const { token, isInitializing } = useAuth();
  const router = useRouter();
  const [identity, setIdentity] = useState({ account: null, loading: true, error: "" });
  const [history, setHistory] = useState(initialHistory);
  const [support, setSupport] = useState({ tickets: [], loading: true, error: "" });
  const [reload, setReload] = useState(0);
  const [filters, setFilters] = useState({ pipeline: "", status: "", day: "" });
  const [visibleDays, setVisibleDays] = useState(3);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const closePassword = useCallback(() => setPasswordOpen(false), []);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useSessionState("renoweb-theme-dark", false);

  useEffect(() => {
    if (isInitializing) return;
    if (!token) { router.replace("/"); return; }
    let cancelled = false;
    const loadIdentity = async () => {
      try {
        const account = await fetchAccountIdentity();
        if (!cancelled) setIdentity({ account, loading: false, error: "" });
      } catch {
        if (!cancelled) setIdentity({ account: null, loading: false, error: "Your account identity could not be loaded." });
      }
    };
    const loadTickets = async () => {
      try {
        const data = await fetchMyTickets();
        if (!Array.isArray(data.tickets)) throw new Error("Invalid tickets response");
        if (!cancelled) setSupport({ tickets: data.tickets, loading: false, error: "" });
      } catch {
        if (!cancelled) setSupport((current) => ({ ...current, loading: false, error: "Your support notes could not be loaded." }));
      }
    };
    const loadHistory = async () => {
      try {
        const first = await fetchReportRuns(1, 100);
        if (!Array.isArray(first.reports) || !Number.isInteger(first.total) || !Number.isInteger(first.pages)) throw new Error("Invalid history response");
        if (cancelled) return;
        const firstComplete = first.pages <= 1 && first.reports.length === first.total;
        setHistory({ reports: sortReports(first.reports), total: first.total, complete: firstComplete, loading: first.pages > 1,
          error: first.pages <= 1 && !firstComplete ? "History changed while loading. Refresh to read the complete record." : "" });
        if (first.pages <= 1) return;
        // # Fetch every server page before describing aggregates as complete history.
        const pages = await Promise.allSettled(Array.from({ length: first.pages - 1 }, (_, index) => fetchReportRuns(index + 2, 100)));
        if (cancelled) return;
        const records = [...first.reports];
        let failed = false;
        for (const page of pages) {
          if (page.status === "fulfilled" && Array.isArray(page.value.reports)) records.push(...page.value.reports);
          else failed = true;
        }
        const unique = [...new Map(records.map((report, index) => [report.id || `record-${index}`, report])).values()];
        const complete = !failed && unique.length === first.total;
        setHistory({ reports: sortReports(unique), total: first.total, loading: false, complete,
          error: complete ? "" : "Some history is missing or changed while loading. The activity map and passport use only the loaded reports. Refresh to try again." });
      } catch {
        if (!cancelled) setHistory((current) => ({ ...current, loading: false, complete: false, error: "Your report history could not be loaded. Any entries already shown are still available." }));
      }
    };
    // # Identity, support, and history fail independently so one error cannot hide another feature.
    Promise.allSettled([loadIdentity(), loadTickets(), loadHistory()]);
    return () => { cancelled = true; };
  }, [token, isInitializing, router, reload]);

  const retry = () => {
    setIdentity((current) => ({ ...current, loading: true, error: "" }));
    setSupport((current) => ({ ...current, loading: true, error: "" }));
    setHistory((current) => ({ ...current, loading: true, complete: false, error: "" }));
    setReload((value) => value + 1);
  };
  const onFilter = (changes) => {
    setFilters((current) => ({ ...current, ...changes }));
    setVisibleDays(3);
  };
  const filteredReports = useMemo(() => filterReports(history.reports, filters), [history.reports, filters]);
  const email = identity.account?.email;

  if (isInitializing || !token) return <div className={styles.authLoading}><LoadingNote>Opening your account...</LoadingNote></div>;

  return (
    <MotionConfig reducedMotion="user">
      <div className={styles.page} data-theme={isDark ? "dark" : "light"}>
        <Header isDark={isDark} onToggleTheme={() => setIsDark(!isDark)} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="lg:hidden"><Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} isMobileOnly onModuleChange={(module) => { sessionStorage.setItem("renoweb-active-module", JSON.stringify(module)); window.dispatchEvent(new Event("local-session-storage")); router.push("/dashboard"); }} /></div>
        <main className={styles.paper} id="account-logbook">
          <div className={styles.masthead}><span><BookOpen size={15} />Simpleads / Account overview</span><a href="/dashboard">Back to the workspace<ArrowUpRight size={14} /></a></div>
          {/* # Show the verified Google photo, with the email signature as a fallback. */}
          <header className={styles.identity}>
            <div className={styles.identityAnchor}>{email && <AccountAvatar picture={identity.account?.picture} fallback={<EmailSignature email={email} />} className={styles.signature} />}<div>{identity.loading ? <LoadingNote>Reading your account identity...</LoadingNote> : identity.error ? <ErrorNote onRetry={retry}>{identity.error}</ErrorNote> : <><p className={styles.welcome}>Welcome,</p><p className={styles.email}>{email || identity.account?.username}</p>{!email && <p className={styles.muted}>No email address is available for this account.</p>}<p className={styles.signatureCaption}>{email ? "Your address. Your signature. Your work." : "Your personal work logbook."}</p></>}</div></div>
            <span className={styles.edition}>Personal logbook</span>
          </header>
          <div className={styles.introduction}><div><p className={styles.eyebrow}>A record, not a dashboard</p><h1>Your work,<br /><em>on the record.</em></h1><p className={styles.introDescription}>Follow the days, revisit the runs, and see the shape of your work.</p></div>{history.total != null && <div className={styles.total}><strong>{history.total.toLocaleString()}</strong><span>reports recorded</span><span className={styles.totalRule} /></div>}</div>
          <ActivityMap reports={history.reports} complete={history.complete} selectedDay={filters.day} onSelectDay={(day) => onFilter({ day })} loading={history.loading} />
          <div className={styles.body}>
            <ReportTimeline reports={filteredReports} allReports={history.reports} total={history.total} complete={history.complete} loading={history.loading} error={history.error} onRetry={retry} filters={filters} onFilter={onFilter} visibleDays={visibleDays} onLoadEarlier={() => setVisibleDays((value) => value + 3)} />
            <aside className={styles.marginNotes} aria-label="Pipeline collection, support, and security">
              <PipelinePassport reports={history.reports} complete={history.complete} selected={filters.pipeline} onSelect={(pipeline) => onFilter({ pipeline })} />
              <SupportThread {...support} onRetry={retry} />
              <PasswordVault disabled={!identity.account?.username} onOpen={() => setPasswordOpen(true)} />
            </aside>
          </div>
          <footer className={styles.colophon}><BookOpen size={13} /><span>{history.complete ? "Your logbook is up to date with the history loaded for this visit." : "This logbook reflects the records available for this visit."}</span></footer>
        </main>
        {/* # Mount the existing OTP flow fresh for every vault opening. */}
        {passwordOpen && <ChangePasswordModal isOpen onClose={closePassword} username={identity.account.username} />}
      </div>
    </MotionConfig>
  );
}
