"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown, ArrowUpRight, Building2, Camera, Check, ChevronLeft, ChevronRight, Compass, Gem, LockKeyhole, MapPin, MessageSquare, Navigation, Network, RotateCcw, SearchX, Sparkles, Video, Workflow, X } from "lucide-react";
import { calendarMonth, dayKey, dayLabel, emailPattern, groupReportDays, pipelineCollection, recordDate, shiftMonth, statusKey, statusLabel } from "../../lib/profileLogbook";
import styles from "./ProfileLogbook.module.css";

// # Pipeline glyphs describe real report types; no unrun pipeline is added to the collection.
export function pipelineAppearance(type) {
  const name = type.toLowerCase();
  if (name.includes("youtube")) return { Icon: Video, tone: "red" };
  if (name.includes("instagram")) return { Icon: Camera, tone: "purple" };
  if (name.includes("maps") && name.includes("bulk")) return { Icon: Navigation, tone: "teal" };
  if (name.includes("maps")) return { Icon: MapPin, tone: "teal" };
  if (name.includes("investor") && name.includes("v2")) return { Icon: Sparkles, tone: "purple" };
  if (name.includes("investor") && name.includes("discovery")) return { Icon: Compass, tone: "purple" };
  if (name.includes("investor")) return { Icon: Gem, tone: "purple" };
  if (name.includes("direct") || name.includes("directory")) return { Icon: Building2, tone: "amber" };
  if (name.includes("b2b") || name.includes("lead")) return { Icon: Network, tone: "blue" };
  return { Icon: Workflow, tone: "blue" };
}

export function EmailSignature({ email }) {
  const cells = useMemo(() => emailPattern(email), [email]);
  return <svg viewBox="0 0 100 100" className={styles.signature} role="img" aria-label="An abstract signature generated from your email address"><circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" strokeWidth="0.8" /><circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4" />{cells.map(({ row, column }) => <rect key={`${row}-${column}`} x={24 + column * 7.5} y={24 + row * 7.5} width="5.5" height="5.5" rx="1.5" fill="currentColor" opacity={0.55 + row * 0.06} />)}</svg>;
}

export function StatusMark({ status }) {
  // # Shape and visible text carry meaning independently of color and animation.
  const key = statusKey(status);
  const complete = ["success", "completed"].includes(key);
  const failed = key === "failed";
  const transit = ["submitted", "running", "queued"].includes(key);
  return <span className={styles.status} data-state={complete ? "complete" : failed ? "failed" : transit ? "transit" : "other"}>
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.statusMark} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {complete ? <><circle cx="12" cy="12" r="9" /><path d="m8 12 2.5 2.5L16 9" className={styles.completeStroke} /></> : failed ? <><path d="M7 3.8A9 9 0 0 1 20.2 17M17 20.2A9 9 0 0 1 3.8 7" /><path d="m9 9 6 6m0-6-6 6" /></> : transit ? <><circle cx="12" cy="12" r="9" strokeDasharray="16 7" className={styles.transitOrbit} /><path d="M8 12h8m-3-3 3 3-3 3" /></> : <><rect x="4" y="4" width="16" height="16" rx="3" /><path d="M8 12h8" /></>}
    </svg><span>{statusLabel(status)}</span>
  </span>;
}

export function LoadingNote({ children }) {
  return <p className={styles.loading} role="status"><span aria-hidden="true" />{children}</p>;
}

export function ErrorNote({ children, onRetry }) {
  return <div role="alert" className={styles.error}><p>{children}</p><button type="button" onClick={onRetry}><RotateCcw size={13} />Try again</button></div>;
}

export function ActivityMap({ reports, complete, selectedDay, onSelectDay, loading }) {
  const [chosenMonth, setChosenMonth] = useState("");
  const [preview, setPreview] = useState("");
  const dated = useMemo(() => groupReportDays(reports).filter(({ key }) => key !== "undated"), [reports]);
  const latestMonth = dated[0]?.key.slice(0, 7);
  const earliestMonth = dated.at(-1)?.key.slice(0, 7);
  const month = chosenMonth || latestMonth;
  const calendar = useMemo(() => month ? calendarMonth(month, reports) : null, [month, reports]);
  const previewKey = preview || selectedDay || dated[0]?.key;
  const previewEntries = useMemo(() => reports.filter((entry) => dayKey(entry.created_at) === previewKey), [reports, previewKey]);
  const maximum = Math.max(1, ...dated.map(({ entries }) => entries.length));
  if (!reports.length) return <section className={styles.activity} aria-labelledby="activity-title"><p className={styles.eyebrow}>The rhythm of your work</p><h2 id="activity-title">Activity map</h2>{loading ? <LoadingNote>Reading report timestamps...</LoadingNote> : <p className={styles.muted}>Your report dates will make a pattern here.</p>}</section>;
  if (!calendar) return <section className={styles.activity}><h2>Activity map</h2><p className={styles.muted}>No dated reports are available to map.</p></section>;
  return <section className={styles.activity} aria-labelledby="activity-title">
    <div className={styles.activityIntro}><p className={styles.eyebrow}>The rhythm of your work</p><h2 id="activity-title">Every day leaves a mark.</h2><p className={styles.muted}>Hover to read. Tap a day to follow its entries.</p><p className={styles.scope}>{complete ? "Built from your complete report history." : `Based on ${reports.length} loaded reports. History is ${loading ? "still loading" : "incomplete"}.`}</p><div className={styles.legend}><span>Fewer reports</span>{[0, 1, 2, 3].map((level) => <i key={level} data-level={level} aria-hidden="true" />)}<span>More</span></div></div>
    <div className={styles.calendar}>
      <div className={styles.monthNavigation}><button type="button" aria-label="Previous month" disabled={month <= earliestMonth} onClick={() => { setChosenMonth(shiftMonth(month, -1)); setPreview(""); }}><ChevronLeft size={16} /></button><h3>{dayLabel(`${month}-01`, { weekday: undefined, day: undefined })}</h3><button type="button" aria-label="Next month" disabled={month >= latestMonth} onClick={() => { setChosenMonth(shiftMonth(month, 1)); setPreview(""); }}><ChevronRight size={16} /></button></div>
      <div className={styles.calendarGrid} onMouseLeave={() => setPreview("")}>
        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => <span key={day} className={styles.weekday} aria-hidden="true">{day}</span>)}
        {Array.from({ length: calendar.offset }, (_, index) => <span key={`space-${index}`} aria-hidden="true" />)}
        {calendar.cells.map((cell) => <button key={cell.key} type="button" data-level={!cell.reports.length ? 0 : Math.max(1, Math.ceil(cell.reports.length / maximum * 3))} data-selected={selectedDay === cell.key} aria-pressed={selectedDay === cell.key} aria-label={`${dayLabel(cell.key)}: ${cell.reports.length} ${complete ? "reports" : "loaded reports"}. Filter timeline by this day.`} aria-describedby="activity-day-preview" onMouseEnter={() => setPreview(cell.key)} onFocus={() => setPreview(cell.key)} onClick={() => onSelectDay(selectedDay === cell.key ? "" : cell.key)}>{cell.day}</button>)}
      </div>
    </div>
    <div className={styles.dayPreview} id="activity-day-preview" aria-live="polite" aria-atomic="true"><p className={styles.eyebrow}>Inside the logbook</p><h3>{dayLabel(previewKey, { weekday: "short" })}</h3><p className={styles.previewCount}>{previewEntries.length} {complete ? "reports" : "loaded reports"}</p>{previewEntries.length ? <ul>{previewEntries.slice(0, 3).map((report) => { const { Icon, tone } = pipelineAppearance(report.report_type || ""); return <li key={report.id} data-tone={tone}><Icon size={15} /><span>{report.report_type || "Unspecified pipeline"}</span><span className={styles.previewStatus}>{statusLabel(report.status)}</span></li>; })}</ul> : <p className={styles.muted}>{complete ? "No reports recorded on this day." : "No reports loaded for this day yet."}</p>}{previewEntries.length > 3 && <p className={styles.scope}>+{previewEntries.length - 3} more in the timeline</p>}</div>
  </section>;
}

export function PipelinePassport({ reports, selected, onSelect, complete }) {
  const collection = useMemo(() => pipelineCollection(reports), [reports]);
  return <section className={styles.passport} aria-labelledby="passport-title"><p className={styles.eyebrow}>Your pipeline passport</p><h2 id="passport-title">Tools you have put to work.</h2><p className={styles.muted}>{complete ? "Every stamp is a pipeline you have run." : "Stamps reflect the reports loaded so far."} Tap one to trace its history.</p>{collection.length ? <div className={styles.stamps}>{collection.map(({ type, count }) => { const { Icon, tone } = pipelineAppearance(type); return <button type="button" key={type} className={styles.stamp} data-tone={tone} data-selected={selected === type} aria-pressed={selected === type} onClick={() => onSelect(selected === type ? "" : type)}><Icon size={24} strokeWidth={1.4} /><strong>{count}<span>{count === 1 ? "run" : "runs"}</span></strong><span className={styles.stampName}>{type}</span></button>; })}</div> : <p className={styles.emptyInline}>{complete ? "Your first report will leave its stamp here." : "Your pipeline collection will appear when history is available."}</p>}</section>;
}

export function ReportTimeline({ reports, total, loading, complete, error, onRetry, filters, onFilter, visibleDays, onLoadEarlier, allReports }) {
  const reduceMotion = useReducedMotion();
  const groups = useMemo(() => groupReportDays(reports), [reports]);
  const shown = groups.slice(0, visibleDays);
  const shownCount = shown.reduce((count, group) => count + group.entries.length, 0);
  const pipelines = useMemo(() => pipelineCollection(allReports), [allReports]);
  const statuses = useMemo(() => [...new Set(allReports.map((report) => statusKey(report.status)))].sort(), [allReports]);
  const filtered = filters.pipeline || filters.status || filters.day;
  return <section className={styles.timeline} id="report-timeline" aria-labelledby="history-title" aria-busy={loading}>
    <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>Lead report history</p><h2 id="history-title">The running record.</h2></div>{total != null && <span className={styles.historyTotal}>{total.toLocaleString()} total reports</span>}</div>
    <div className={styles.filters}>
      <div className={styles.glyphFilters} role="group" aria-label="Filter by pipeline"><button type="button" className={styles.allFilter} aria-pressed={!filters.pipeline} onClick={() => onFilter({ pipeline: "" })}><Workflow size={15} />All pipelines</button>{pipelines.map(({ type }) => { const { Icon, tone } = pipelineAppearance(type); return <button type="button" key={type} data-tone={tone} aria-label={`Filter ${type}`} aria-pressed={filters.pipeline === type} title={type} onClick={() => onFilter({ pipeline: filters.pipeline === type ? "" : type })}><Icon size={18} /><span>{type}</span></button>; })}</div>
      <div className={styles.statusFilters} role="group" aria-label="Filter by status"><button type="button" aria-pressed={!filters.status} onClick={() => onFilter({ status: "" })}>All statuses</button>{statuses.map((status) => <button type="button" key={status} aria-pressed={filters.status === status} onClick={() => onFilter({ status: filters.status === status ? "" : status })}><StatusMark status={status} /></button>)}</div>
      {filtered && <div className={styles.filterSummary}>{filters.day && <span>{dayLabel(filters.day, { weekday: undefined })}</span>}<button type="button" onClick={() => onFilter({ pipeline: "", status: "", day: "" })}><X size={13} />Clear filters</button></div>}
    </div>
    {loading && <LoadingNote>{allReports.length ? "Reading the rest of your history..." : "Opening your report history..."}</LoadingNote>}
    {error && <ErrorNote onRetry={onRetry}>{error}</ErrorNote>}
    {!reports.length && !loading && (!error || filtered) && <div className={styles.empty}><SearchX size={26} /><h3>{filtered ? "No entries match this view." : "No reports yet."}</h3><p>{filtered ? "Try a different stamp, status, or day." : "Run a pipeline from the dashboard to start your logbook."}</p>{filtered && <button type="button" onClick={() => onFilter({ pipeline: "", status: "", day: "" })}>Show all reports<ArrowUpRight size={15} /></button>}</div>}
    <motion.div key={JSON.stringify(filters)} className={styles.spine} initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
      {shown.map((group) => <motion.section key={group.key} className={styles.dayGroup} initial={reduceMotion ? false : { opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.05 }} transition={{ duration: 0.2 }} aria-label={dayLabel(group.key)}>
        <div className={styles.dayAnchor}><span aria-hidden="true" /><h3>{dayLabel(group.key, { weekday: "short", year: undefined })}</h3><span className={styles.dayYear}>{group.key === "undated" ? "" : group.key.slice(0, 4)}</span><span className={styles.dayCount}>{group.entries.length} {group.entries.length === 1 ? "report" : "reports"}</span></div>
        <ol className={styles.entries}>
          {group.entries.map((report) => { const { Icon, tone } = pipelineAppearance(report.report_type || ""); const date = recordDate(report.created_at); return <li key={report.id} className={styles.entry} data-tone={tone}><span className={styles.node} aria-hidden="true"><Icon size={18} strokeWidth={1.6} /></span><div className={styles.entryBody}><div className={styles.entryTop}><span className={styles.entryType}>Pipeline report</span>{date ? <time dateTime={date.toISOString()} title={date.toLocaleString()}>{date.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" })}</time> : <span className={styles.scope}>Time unavailable</span>}</div><h4>{report.report_type || "Unspecified pipeline"}</h4><StatusMark status={report.status} /></div></li>; })}
        </ol>
      </motion.section>)}
    </motion.div>
    {groups.length > shown.length ? <button type="button" className={styles.loadEarlier} onClick={onLoadEarlier}><span className={styles.loadDot}><ArrowDown size={18} /></span><span>Load earlier days<small>{reports.length - shownCount} more matching {reports.length - shownCount === 1 ? "report" : "reports"}</small></span></button> : !!shown.length && <p className={styles.endNote}><Check size={14} />{complete ? "You have reached the beginning of this view." : "All available entries are shown."}</p>}
    {!!shown.length && <p className={styles.scope}>{shownCount} of {reports.length} matching reports shown · Times in {Intl.DateTimeFormat().resolvedOptions().timeZone}</p>}
  </section>;
}

export function SupportThread({ tickets, loading, error, onRetry }) {
  return <section className={styles.support} aria-labelledby="support-title"><p className={styles.eyebrow}>A conversation with Simpleads</p><div className={styles.supportHeading}><h2 id="support-title">Your support notes.</h2><MessageSquare size={19} /></div>{loading ? <LoadingNote>Opening your notes...</LoadingNote> : error ? <ErrorNote onRetry={onRetry}>{error}</ErrorNote> : !tickets.length ? <p className={styles.emptyInline}>No support tickets yet. Your feedback and questions will appear here.</p> : <ol className={styles.notes}>{tickets.map((ticket) => { const date = recordDate(ticket.created_at); return <li key={ticket.id}><span className={styles.noteDot} aria-hidden="true" /><div className={styles.noteMeta}><span>{ticket.type || "Category unavailable"}</span>{date ? <time dateTime={date.toISOString()} title={date.toLocaleString()}>{date.toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" })}</time> : <span>Date unavailable</span>}</div><h3>{ticket.title || "Untitled ticket"}</h3><p>{ticket.description || "No description provided."}</p></li>; })}</ol>}</section>;
}

export function PasswordVault({ onOpen, disabled }) {
  return <section className={styles.vault} aria-labelledby="vault-title"><LockKeyhole size={21} strokeWidth={1.5} /><div><p className={styles.eyebrow}>The private compartment</p><h2 id="vault-title">Account security</h2><p>Change your password after verifying a one-time code sent to your registered email.</p><button type="button" onClick={onOpen} disabled={disabled}>Change password<ArrowUpRight size={15} /></button></div></section>;
}
