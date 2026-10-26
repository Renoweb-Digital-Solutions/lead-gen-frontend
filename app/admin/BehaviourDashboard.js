"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUpRight, BarChart3, CheckCircle2, ChevronLeft, ChevronRight, CircleHelp, Clock3, Download, Filter, MousePointer2, RefreshCw, Search, Settings2, Sparkles, Users, X } from "lucide-react";
import { fetchAnalyticsSummary } from "../lib/api";
import { ACTION_LABELS, CONTROL_LABELS, MODULE_LABELS } from "../lib/interactionAnalytics";
import styles from "./BehaviourDashboard.module.css";

const number = value => Number(value || 0).toLocaleString();
const friendly = value => CONTROL_LABELS[value] || ACTION_LABELS[value] || value.replaceAll("_", " ").replace(/^./, character => character.toUpperCase());
const percent = (value, total) => total ? Math.round(value / total * 100) : 0;
const CARDS = [
  { key: "active_users", title: "Active customers", description: "Signed-in customers with a recorded interaction", icon: Users },
  { key: "submitted_users", title: "Submitted a search", description: "Customers who submitted valid search settings", icon: Search },
  { key: "result_users", title: "Viewed results", description: "Results header visible for at least one second", icon: CheckCircle2 },
  { key: "export_users", title: "Requested an export", description: "Customers who clicked an export action; delivery is not confirmed", icon: Download },
];

function Empty({ children = "No activity recorded for these filters yet." }) {
  // # Empty states never substitute fabricated activity or illustrative numbers.
  return <div className={styles.empty}><BarChart3 size={25} /><p>{children}</p></div>;
}

function Panel({ eyebrow, title, description, children, aside }) {
  // # A shared card hierarchy keeps module reports readable in both existing themes.
  return <section className={styles.panel}><div className={styles.panelHead}><div><span className={styles.eyebrow}>{eyebrow}</span><h3>{title}</h3>{description && <p>{description}</p>}</div>{aside}</div>{children}</section>;
}

export default function BehaviourDashboard({ refreshKey = false }) {
  const [days, setDays] = useState(30);
  const [module, setModule] = useState("all");
  const [mode, setMode] = useState("submitted");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState("");

  const downloadPdf = async () => {
    // # Export only the matching loaded snapshot; pagination does not truncate the PDF.
    if (!data || loading || refreshKey || error || exporting || data.days !== days || data.selected_module !== module) return;
    setExporting(true); setExportError("");
    try {
      const { downloadAnalyticsPdf } = await import("./analyticsPdf");
      await downloadAnalyticsPdf(data);
    } catch {
      setExportError("The PDF could not be generated. Please try again.");
    } finally { setExporting(false); }
  };

  useEffect(() => {
    // # Independent requests prevent report outages from blocking user/ticket administration.
    if (refreshKey) return;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true); setError("");
      try {
        const report = await fetchAnalyticsSummary(days, module, controller.signal);
        if (!controller.signal.aborted) setData(report);
      } catch (exception) {
        if (!controller.signal.aborted) setError(exception.message || "Could not load this report.");
      } finally { if (!controller.signal.aborted) setLoading(false); }
    }, 0);
    return () => { controller.abort(); window.clearTimeout(timer); };
  }, [days, module, retry, refreshKey]);

  const selectModule = value => { setModule(value); setPage(1); setQuery(""); };
  const rows = (data?.modules || []).filter(row => module === "all" || row.module === module);
  const options = (mode === "submitted" ? data?.submitted_options : data?.options) || [];
  const actions = (data?.actions || []).filter(row => `${friendly(row.action)} ${MODULE_LABELS[row.module]}`.toLowerCase().includes(query.toLowerCase()));
  const pages = Math.max(1, Math.ceil(actions.length / 10));
  const currentPage = Math.min(page, pages);
  const firstStage = data?.funnel?.[0]?.count || 0;
  const totals = rows.reduce((result, row) => ({ runs: result.runs + row.runs, completed: result.completed + row.completed, failed: result.failed + row.failed, empty: result.empty + row.empty, cancelled: result.cancelled + row.cancelled, running: result.running + row.running }), { runs: 0, completed: 0, failed: 0, empty: 0, cancelled: 0, running: 0 });
  const comparisonReady = data?.tracking_started_at && new Date(data.tracking_started_at).getTime() <= new Date(data.end).getTime() - days * 2 * 86400000 && !data.truncated;
  const mostUsed = [...rows].sort((a, b) => b.people - a.people)[0];
  const mostUsedOption = options[0];
  const daily = data ? Array.from({ length: data.days }, (_, index) => {
    const day = new Date(new Date(data.end).getTime() - (data.days - index - 1) * 86400000).toISOString().slice(0, 10);
    return { date: day, users: data.daily.find(row => row.date === day)?.users || 0 };
  }) : [];
  const dailyMax = Math.max(1, ...daily.map(row => row.users));

  return <div className={styles.dashboard} aria-busy={loading}>
    <div className={styles.intro}>
      <div><span className={styles.kicker}><span /> CUSTOMER INSIGHTS</span><h2>Every interaction tells a story.</h2><p>See what customers use, what they choose, and where their journey stops.</p></div>
      <div className={styles.filters}>
        <label><span>Time period</span><select value={days} onChange={event => { setDays(Number(event.target.value)); setPage(1); }}><option value={7}>Last 7 days</option><option value={30}>Last 30 days</option><option value={90}>Last 90 days</option></select></label>
        <label><span>Module</span><select value={module} onChange={event => selectModule(event.target.value)}><option value="all">All modules</option>{Object.entries(MODULE_LABELS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
        <button className={styles.iconButton} onClick={() => setRetry(value => value + 1)} aria-label="Refresh behaviour report" disabled={loading}><RefreshCw size={17} className={loading ? styles.spin : ""} /></button>
        <button type="button" className={styles.downloadButton} onClick={downloadPdf} disabled={loading || refreshKey || exporting || !!error || !data || data.days !== days || data.selected_module !== module} title="Download the selected report, including both settings views and all action pages" aria-busy={exporting}><Download size={16} />{exporting ? "Preparing PDF…" : "Download PDF"}</button>
      </div>
    </div>
    <div className={styles.context}><span><Filter size={13} />Customer activity · Internal accounts excluded</span><span><Clock3 size={13} />{data ? `Updated ${new Date(data.generated_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "Waiting for report"}</span></div>
    {error && <div className={styles.error} role="alert"><div><strong>We couldn’t refresh this report.</strong><p>{error} {data ? "The last successful report remains below." : "Your searches and pipelines are unaffected."}</p></div><button onClick={() => setRetry(value => value + 1)}>Try again</button></div>}
    {loading && <div role="status" className={styles.loading}>Updating customer insights…</div>}
    {exportError && <div className={styles.error} role="alert">{exportError}</div>}
    {data && !error && (data.days !== days || data.selected_module !== module) ? <div className={styles.loading}>Loading the selected filters…</div> : data && <>
      {data.truncated && <div className={styles.notice} role="status">This report reached its processing limit. Counts are partial; choose a shorter period or one module. Comparisons are unavailable.</div>}
      <div className={styles.cards}>{CARDS.map(({ key, title, description, icon: Icon }) => {
        const current = data.metrics[key], previous = data.previous_metrics[key];
        const change = previous ? Math.round((current - previous) / previous * 100) : null;
        return <article className={styles.metric} key={key}><div className={styles.metricTop}><Icon size={18} /><span title={description}><CircleHelp size={14} aria-label={description} /></span></div><span className={styles.metricValue}>{number(current)}</span><h3>{title}</h3><p>{description}</p><span className={styles.metricTrend}>{comparisonReady && change !== null ? `${change > 0 ? "+" : ""}${change}% vs previous ${days} days` : "Comparison available after enough history"}</span></article>;
      })}</div>
      <div className={styles.insight}><Sparkles size={20} /><div><strong>A quick read of your customers</strong><p>{mostUsed?.people ? `${mostUsed.label} has the most active customers in this view (${number(mostUsed.people)}).` : "Your first recorded customer interactions will appear here."} {mostUsedOption ? `${friendly(mostUsedOption.control)} is the most ${mode === "submitted" ? "recorded setting in submitted searches" : "frequently changed setting"}.` : "Historical page views cannot tell us which controls were used."}</p></div></div>
      <Panel eyebrow="01 / FEATURE ADOPTION" title="Which modules do customers use?" description="Choose a module to explore its settings and actions. People are unique within each module." aside={module !== "all" && <button className={styles.textButton} onClick={() => selectModule("all")}><X size={14} />Clear module</button>}>
        <div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>Module</th><th>Active customers</th><th>Search submissions</th><th>Requested exports</th><th><span className={styles.srOnly}>Open module report</span></th></tr></thead><tbody>{rows.map((row, index) => <tr key={row.module}><td><button className={styles.moduleButton} onClick={() => selectModule(row.module)}><span className={styles.moduleMark}>{String(index + 1).padStart(2, "0")}</span>{row.label}</button></td><td><div className={styles.adoption}><strong>{number(row.people)}</strong><span><i style={{ width: `${percent(row.people, Math.max(1, ...rows.map(item => item.people)))}%` }} /></span></div></td><td>{number(row.submissions)}</td><td>{number(row.exports)} <small>customers</small></td><td><button className={styles.iconButton} onClick={() => selectModule(row.module)} aria-label={`Explore ${row.label}`}><ArrowUpRight size={17} /></button></td></tr>)}</tbody></table></div>
      </Panel>
      <div className={styles.twoColumn}>
        <Panel eyebrow="02 / CUSTOMER JOURNEY" title="Where does the journey stop?" description="Sequential steps in the same customer session and module. These are sessions, not individual searches.">
          {!firstStage ? <Empty /> : <div className={styles.funnel}>{data.funnel.map((stage, index) => <div key={stage.label} className={styles.stage}><div className={styles.stageTop}><span><b>{index + 1}</b>{stage.label}</span><strong>{number(stage.count)} <small>{percent(stage.count, firstStage)}%</small></strong></div><div className={styles.track}><span style={{ width: `${percent(stage.count, firstStage)}%` }} /></div>{index > 0 && <p><ArrowDown size={11} />{number(data.funnel[index - 1].count - stage.count)} sessions did not reach this step</p>}</div>)}</div>}
          <p className={styles.footnote}>An export click records intent. It does not confirm that a file was saved.</p>
        </Panel>
        <Panel eyebrow="03 / CONFIRMED SEARCH OUTCOMES" title="What happened to submitted searches?" description="Read directly from existing server run records. Grouped by when the search started.">
          {!totals.runs ? <Empty>No server-tracked searches in this period.</Empty> : <><div className={styles.outcomeHeadline}><span>{number(totals.runs)}</span><p>searches accepted by the server</p></div><div className={styles.outcomes}>{[["Completed with results", "completed"], ["Completed without results", "empty"], ["Failed", "failed"], ["Cancelled", "cancelled"], ["Recorded as running", "running"]].map(([label, key]) => <div key={key}><span><i data-status={key} />{label}</span><strong>{number(totals[key])}</strong></div>)}</div></>}
          <p className={styles.footnote}>Running reflects the saved status; older interrupted jobs may not have a final outcome.</p>
        </Panel>
      </div>
      <Panel eyebrow="04 / SETTINGS & PREFERENCES" title="Which options do customers choose?" description={mode === "submitted" ? "Final settings captured when customers submit a search. Defaults are included." : "Deliberate changes to instrumented controls. Repeated changes count separately."} aside={<div className={styles.segment} role="group" aria-label="Settings report type"><button aria-pressed={mode === "submitted"} onClick={() => setMode("submitted")}>Used in searches</button><button aria-pressed={mode === "changed"} onClick={() => setMode("changed")}>Changed by customers</button></div>}>
        {!options.length ? <Empty>No settings recorded yet. Try a different module or date range.</Empty> : <div className={styles.optionGrid}>{options.map(option => <article key={`${option.module}:${option.control}`} className={styles.option}><div className={styles.optionTop}><span className={styles.moduleTag}>{MODULE_LABELS[option.module]}</span><Settings2 size={14} /></div><h4>{friendly(option.control)}</h4><p>{number(option.people)} customers · {number(option.total)} {mode === "submitted" ? "search snapshots" : "changes"}</p>{option.values.map(value => <div key={value.label} className={styles.optionValue}><div><span title={value.label}>{friendly(value.label)}</span><strong>{percent(value.count, option.total)}% <small>({number(value.count)})</small></strong></div><div className={styles.track}><span style={{ width: `${Math.min(100, percent(value.count, option.total))}%` }} /></div></div>)}<small className={styles.optionNote}>Percent of {mode === "submitted" ? "searches recording this setting" : "recorded changes to this setting"}. Multiple selections can total over 100%.</small></article>)}</div>}
      </Panel>
      <Panel eyebrow="05 / ACTION EXPLORER" title="What are customers clicking?" description="Compare distinct customers with total clicks on tracked actions." aside={<label className={styles.search}><Search size={15} /><input aria-label="Find an action or module" placeholder="Find an action…" value={query} onChange={event => { setQuery(event.target.value); setPage(1); }} /></label>}>
        {!actions.length ? <Empty>No matching button activity yet.</Empty> : <><div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>Action</th><th>Module</th><th>Customers</th><th>Total clicks</th></tr></thead><tbody>{actions.slice((currentPage - 1) * 10, currentPage * 10).map(row => <tr key={`${row.module}:${row.action}`}><td><span className={styles.actionName}><MousePointer2 size={14} />{friendly(row.action)}</span></td><td><span className={styles.moduleTag}>{MODULE_LABELS[row.module]}</span></td><td><strong>{number(row.people)}</strong></td><td>{number(row.clicks)}</td></tr>)}</tbody></table></div><div className={styles.pagination}><span>{number(actions.length)} actions · Page {currentPage} of {pages}</span><div><button aria-label="Previous actions page" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}><ChevronLeft size={16} /></button><button aria-label="Next actions page" disabled={currentPage === pages} onClick={() => setPage(currentPage + 1)}><ChevronRight size={16} /></button></div></div></>}
      </Panel>
      <Panel eyebrow="06 / ACTIVITY OVER TIME" title="When are customers active?" description="Daily distinct active customers (UTC). This chart shows activity; returning-customer cohorts are not calculated.">
        {!data.daily.length ? <Empty /> : <div className={styles.timeline} role="img" aria-label={`Daily active customers across ${data.days} days. Highest daily count: ${dailyMax}.`} style={{ gridTemplateColumns: `repeat(${daily.length}, minmax(0, 1fr))` }}>{daily.map(day => <div key={day.date} title={`${day.date}: ${number(day.users)} customers`}><i style={{ height: `${day.users ? Math.max(3, percent(day.users, dailyMax)) : 0}%` }} /><span>{day.date.slice(5)}</span></div>)}</div>}
      </Panel>
      <div className={styles.coverage}><CircleHelp size={16} /><div><strong>About this data</strong><p>{data.coverage}</p><p>{data.tracking_started_at ? `First interaction recorded ${new Date(data.tracking_started_at).toLocaleDateString()}.` : "Interaction tracking is ready. Awaiting the first customer event."} Interaction retention: 180 days. Browser blocking, closed tabs, and network failures can leave gaps.</p></div></div>
    </>}
  </div>;
}
