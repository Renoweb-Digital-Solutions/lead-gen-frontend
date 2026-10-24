"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Archive, ArchiveRestore, Calendar, CheckCircle2, CircleDot, Clock3, Inbox, Loader2, Mail, MessageSquare, RotateCcw, Search, Send, X } from "lucide-react";
import { createPortal } from "react-dom";
import { updateAdminTicket } from "../lib/api";
import styles from "./TicketManager.module.css";

const STATUS = { open: "Open", in_progress: "In progress", closed: "Closed" };
const DELIVERY = { pending: "Resolution email awaiting send", sending: "Resolution email sending / awaiting confirmation", sent: "Resolution email sent", failed: "Resolution email not confirmed" };

function CloseTicketDialog({ ticket, busy, error, onClose, onConfirm, isDark, changed }) {
  const [comment, setComment] = useState("");
  const textarea = useRef(null);
  const dialog = useRef(null);
  const headingId = useId();
  const commentId = useId();
  const noteId = useId();
  useEffect(() => {
    // # Trap keyboard focus, restore the launching control, and prevent background scrolling.
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    textarea.current?.focus();
    return () => { document.body.style.overflow = overflow; if (previous?.isConnected) previous.focus(); };
  }, []);
  const keyDown = event => {
    if (event.key === "Escape" && !busy) { event.preventDefault(); onClose(); }
    if (event.key !== "Tab") return;
    const controls = Array.from(dialog.current.querySelectorAll("button:not(:disabled), textarea:not(:disabled), [tabindex='0']"));
    const first = controls[0], last = controls.at(-1);
    if (!first) { event.preventDefault(); return; }
    if (event.shiftKey && (document.activeElement === first || !dialog.current.contains(document.activeElement))) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };
  return createPortal(<div className={styles.overlay} onKeyDown={keyDown} data-theme={isDark ? "dark" : "light"} style={{ colorScheme: isDark ? "dark" : "light" }}>
    <div className={styles.modal} ref={dialog} role="dialog" aria-modal="true" aria-labelledby={headingId} aria-describedby={noteId}>
      <div className={styles.modalHeader}><span className={styles.modalIcon}><CheckCircle2 size={24} /></span><button type="button" className={styles.iconButton} onClick={onClose} disabled={busy} aria-label="Cancel closing ticket"><X size={19} /></button></div>
      <span className={styles.eyebrow}>RESOLUTION & CUSTOMER UPDATE</span><h2 id={headingId}>Close the loop.</h2><p id={noteId}>Explain what was fixed. The customer will receive their original issue and your resolution in a Simpleads support email.</p>
      <div className={styles.issue}><strong>{ticket.title}</strong><p>{ticket.description}</p></div>
      <form onSubmit={event => { event.preventDefault(); if (!busy && !changed && comment.trim().length >= 10) onConfirm(comment.trim()); }}>
        <label htmlFor={commentId}>What was fixed? <span>Required</span></label><textarea ref={textarea} id={commentId} value={comment} onChange={event => setComment(event.target.value)} required minLength={10} maxLength={4000} rows={6} disabled={busy} placeholder="Describe the fix and anything the customer needs to do next…" />
        <div className={styles.commentHint}><span>Included verbatim in the customer&apos;s email.</span><span>{comment.length} / 4,000</span></div>
        {error && <div className={styles.error} role="alert">{error}</div>}
        {changed && <div className={styles.error} role="alert">This ticket changed while you were writing. Cancel this dialog, review its latest status, and try again.</div>}
        {busy && <p className={styles.sending} role="status">Saving the resolution and sending the email. Please keep this dialog open.</p>}
        <div className={styles.modalFooter}><button className={styles.secondary} type="button" onClick={onClose} disabled={busy}>Cancel</button><button className={styles.primary} type="submit" disabled={busy || changed || comment.trim().length < 10}>{busy ? <Loader2 className={styles.spin} size={16} /> : <Send size={16} />}{busy ? "Saving & sending…" : "Close ticket & email user"}</button></div>
      </form>
    </div>
  </div>, document.body);
}

export default function TicketManager({ tickets, users, onTicketUpdated, onFeedback, onRefresh, isDark }) {
  const [view, setView] = useState("active");
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [closing, setClosing] = useState(null);
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState("");
  const [modalError, setModalError] = useState("");
  const [notice, setNotice] = useState("");
  const active = tickets.filter(ticket => !ticket.archived);
  const archived = tickets.filter(ticket => ticket.archived);
  const source = view === "archived" ? archived : active;
  const filtered = source.filter(ticket => (status === "all" || ticket.status === status) && `${ticket.title} ${ticket.username} ${ticket.description}`.toLowerCase().includes(search.toLowerCase()));
  const change = async (ticket, action, payload, closingTicket = false) => {
    // # Update the visible record only from the server response; failed mail stays visibly distinct.
    if (busy) return;
    setBusy(ticket.id); setError(""); setModalError(""); setNotice("");
    try {
      const updated = await updateAdminTicket(ticket.id, action, payload);
      onTicketUpdated(updated);
      if (closingTicket) { setClosing(null); setStatus("closed"); }
      if (updated.status === "closed" && action !== "archive") {
        const state = updated.resolution_email?.status;
        setNotice(state === "sent" ? "Ticket closed. The resolution email was sent." : "Ticket closed. The resolution email was not confirmed; use Retry email below.");
      } else setNotice(action === "archive" ? (updated.archived ? "Ticket archived internally. The customer view is unchanged." : "Ticket restored to active tickets.") : "Ticket status updated.");
    } catch (exception) {
      if (closingTicket) setModalError(exception.message);
      else setError(exception.message);
      // # A disconnected response can follow a successful save; refresh before another attempt.
      onRefresh?.();
    } finally { setBusy(null); }
  };

  return <div className={styles.manager}>
    <div className={styles.toolbar}><div><span className={styles.eyebrow}>SUPPORT WORKSPACE</span><h2>A clear path to resolved.</h2><p>Manage progress, send resolutions, and keep your queue organised.</p></div><div className={styles.views} role="group" aria-label="Ticket archive view"><button type="button" aria-pressed={view === "active"} onClick={() => setView("active")}><Inbox size={15} />Active <span>{active.length}</span></button><button type="button" aria-pressed={view === "archived"} onClick={() => setView("archived")}><Archive size={15} />Archived <span>{archived.length}</span></button></div></div>
    <div className={styles.summary}>{[["open", CircleDot], ["in_progress", Clock3], ["closed", CheckCircle2]].map(([key, Icon]) => <button type="button" key={key} aria-pressed={status === key} onClick={() => setStatus(status === key ? "all" : key)}><Icon size={17} /><span>{STATUS[key]}</span><strong>{source.filter(ticket => ticket.status === key).length}</strong></button>)}</div>
    <div className={styles.filters}><label className={styles.search}><Search size={16} /><input aria-label="Search support tickets" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search subject, customer, or issue…" /></label><label className={styles.statusFilter}><span>Status</span><select value={status} onChange={event => setStatus(event.target.value)}><option value="all">All statuses</option>{Object.entries(STATUS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label></div>
    {view === "archived" && <p className={styles.privateNote}><Archive size={14} />Archiving is internal only. Customers can still see their ticket and its actual status.</p>}
    {error && <div className={styles.error} role="alert">{error}</div>}{notice && <div className={styles.notice} role="status">{notice}</div>}
    {!filtered.length ? <div className={styles.empty}><MessageSquare size={30} /><h3>{source.length ? "No matching tickets" : view === "archived" ? "Nothing archived yet" : "Your queue is clear"}</h3><p>{source.length ? "Try another search or status filter." : view === "archived" ? "Archived tickets will appear here. You can restore them at any time." : "New customer feedback and issue reports will appear here."}</p></div> : <div className={styles.list}>{filtered.map(ticket => {
      const user = users.find(item => item._id === String(ticket.user_id));
      const delivery = ticket.resolution_email;
      return <article key={ticket.id} className={styles.ticket}>
        <div className={styles.ticketTop}><div><span className={styles.type} data-type={ticket.type}>{ticket.type}</span><h3>{ticket.title}</h3><p>From <strong>{ticket.username}</strong></p></div><span className={styles.status} data-status={ticket.status}>{ticket.status === "closed" ? <CheckCircle2 size={13} /> : ticket.status === "in_progress" ? <Clock3 size={13} /> : <CircleDot size={13} />}{STATUS[ticket.status] || ticket.status}</span></div>
        <p className={styles.description}>{ticket.description}</p>
        {ticket.status === "closed" && ticket.resolution_comment && <div className={styles.resolution}><span><CheckCircle2 size={14} />Resolution</span><p>{ticket.resolution_comment}</p></div>}
        {ticket.status === "closed" && delivery && <div className={styles.delivery} data-state={delivery.status}><span><Mail size={14} />{DELIVERY[delivery.status] || delivery.status}</span>{["failed", "pending"].includes(delivery.status) && <button type="button" disabled={!!busy} onClick={() => change(ticket, "resolution-email/retry")}><RotateCcw size={13} />Retry email</button>}</div>}
        <div className={styles.ticketFooter}><span className={styles.date}><Calendar size={13} />{new Date(ticket.created_at).toLocaleString()}</span><div className={styles.actions}>
          <button type="button" className={styles.secondary} onClick={() => onFeedback(user)} disabled={!!busy || !user?.email}><Mail size={14} />Ask for feedback</button>
          {!ticket.archived && ticket.status !== "in_progress" && <button type="button" className={styles.secondary} disabled={!!busy || delivery?.status === "sending"} onClick={() => change(ticket, "status", { status: "in_progress", expected_version: ticket.version || 0 })}><Clock3 size={14} />{ticket.status === "closed" ? "Reopen in progress" : "Mark in progress"}</button>}
          {!ticket.archived && ticket.status === "in_progress" && <button type="button" className={styles.secondary} disabled={!!busy} onClick={() => change(ticket, "status", { status: "open", expected_version: ticket.version || 0 })}>Mark open</button>}
          {!ticket.archived && ticket.status !== "closed" && <button type="button" className={styles.primary} disabled={!!busy} onClick={() => { setClosing(ticket); setModalError(""); }}><CheckCircle2 size={14} />Close ticket</button>}
          <button type="button" className={styles.archiveButton} disabled={!!busy} onClick={() => change(ticket, "archive", { archived: !ticket.archived, expected_version: ticket.version || 0 })}>{busy === ticket.id ? <Loader2 className={styles.spin} size={14} /> : ticket.archived ? <ArchiveRestore size={14} /> : <Archive size={14} />}{ticket.archived ? "Restore" : "Archive"}</button>
        </div></div>
      </article>;
    })}</div>}
    {closing && <CloseTicketDialog isDark={isDark} ticket={closing} busy={!!busy} error={modalError} changed={(tickets.find(ticket => ticket.id === closing.id)?.version || 0) !== (closing.version || 0)} onClose={() => { if (!busy) setClosing(null); }} onConfirm={comment => change(closing, "status", { status: "closed", resolution_comment: comment, expected_version: closing.version || 0 }, true)} />}
  </div>;
}
