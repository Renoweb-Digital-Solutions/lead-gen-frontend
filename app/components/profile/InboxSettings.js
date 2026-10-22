"use client";

// # Profile inbox settings use only the user-owned outreach mailbox endpoints.
// # Removing a sender deletes its stored connection; it never revokes Google
// # sign-in grants, changes the account password, or edits outreach history.
import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Inbox, Loader2, Mail, RefreshCw, ShieldCheck, Unplug, X } from "lucide-react";
import { outreachApi } from "../outreach/api";
import styles from "./InboxSettings.module.css";

function DisconnectDialog({ mailbox, busy, error, onClose, onConfirm }) {
  const dialogRef = useRef(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    const trigger = document.activeElement;
    dialog.showModal();
    return () => { dialog.close(); if (trigger?.isConnected) trigger.focus({ preventScroll: true }); };
  }, []);
  return <dialog ref={dialogRef} className={styles.dialog} aria-labelledby="disconnect-inbox-title"
    aria-describedby="disconnect-inbox-description" onCancel={(event) => { event.preventDefault(); if (!busy) onClose(); }}>
    <div className={styles.dialogTop}><span className={styles.disconnectIcon}><Unplug size={23} /></span>
      <button type="button" disabled={busy} onClick={onClose} aria-label="Close disconnect confirmation"><X size={18} /></button></div>
    <h3 id="disconnect-inbox-title">Disconnect this inbox?</h3>
    <p className={styles.dialogEmail}>{mailbox.email}</p>
    <p id="disconnect-inbox-description">This removes the inbox from outreach sending. Emails already being sent may still finish. Your sent history is kept, and your account sign-in is unchanged.</p>
    {error && <p className={styles.error} role="alert">{error}</p>}
    <div className={styles.dialogActions}><button type="button" disabled={busy} onClick={onClose}>Keep connected</button>
      <button type="button" className={styles.danger} disabled={busy} onClick={onConfirm}>{busy ? <Loader2 size={15} className={styles.spin} /> : <Unplug size={15} />}{busy ? "Disconnecting…" : "Disconnect inbox"}</button></div>
  </dialog>;
}

export default function InboxSettings() {
  const [state, setState] = useState({ mailboxes: [], loading: true, loaded: false, error: "" });
  const [selected, setSelected] = useState(null);
  const [busy, setBusy] = useState(false);
  const [disconnectError, setDisconnectError] = useState("");
  const [notice, setNotice] = useState("");
  const requestVersion = useRef(0);
  const disconnecting = useRef(false);
  const headingRef = useRef(null);

  const load = useCallback(async () => {
    const version = ++requestVersion.current;
    try {
      const data = await outreachApi("/outreach/mailboxes");
      if (!Array.isArray(data.mailboxes) || data.mailboxes.some((item) => typeof item._id !== "string" || typeof item.email !== "string")) throw new Error("Invalid inbox list");
      if (version === requestVersion.current) setState({ mailboxes: data.mailboxes, loading: false, loaded: true, error: "" });
    } catch (failure) {
      if (version === requestVersion.current) setState((current) => ({ ...current, loading: false,
        error: failure.message === "Invalid inbox list" ? "Your connected inboxes could not be read. Please refresh." : failure.message }));
    }
  }, []);

  useEffect(() => {
    load();
    return () => { requestVersion.current += 1; };
  }, [load]);

  function refresh() {
    setState((current) => ({ ...current, loading: true, error: "" }));
    load();
  }
  async function disconnect() {
    if (!selected || disconnecting.current) return;
    disconnecting.current = true; setBusy(true); setDisconnectError(""); setNotice("");
    try {
      await outreachApi(`/outreach/mailboxes/${encodeURIComponent(selected._id)}`, undefined, "DELETE");
      // # Update only after server confirmation. Invalidate any older list fetch
      // # so a late response cannot visually reconnect the inbox we just removed.
      requestVersion.current += 1;
      setState((current) => ({ ...current, mailboxes: current.mailboxes.filter((item) => item._id !== selected._id), loading: false }));
      setNotice(`${selected.email} has been disconnected from outreach.`);
      setSelected(null);
      requestAnimationFrame(() => headingRef.current?.focus({ preventScroll: true }));
    } catch (failure) { setDisconnectError(failure.message); }
    finally { disconnecting.current = false; setBusy(false); }
  }

  return <section className={styles.settings} aria-labelledby="profile-inbox-settings">
    <div className={styles.heading}>
      <div className={styles.headingMain}><span className={styles.brandMark}><Inbox size={23} /></span><div>
        <p className={styles.eyebrow}>ACCOUNT SETTINGS</p><h2 ref={headingRef} tabIndex={-1} id="profile-inbox-settings">Connected inboxes</h2>
        <p className={styles.description}>Manage the inboxes you use to send outreach.</p>
      </div></div>
      <button type="button" className={styles.refresh} onClick={refresh} disabled={state.loading || busy} aria-label="Refresh connected inboxes"><RefreshCw size={15} className={state.loading ? styles.spin : ""} /><span>Refresh</span></button>
    </div>
    {notice && <p className={styles.notice} role="status"><Check size={16} />{notice}</p>}
    {state.error && <p className={styles.error} role="alert">{state.error}{state.mailboxes.length ? " Any inboxes below reflect the last successful load." : " Refresh to try again."}</p>}
    {state.loading && !state.loaded && <div className={styles.empty} role="status"><Loader2 size={24} className={styles.spin} /><p>Loading your connected inboxes…</p></div>}
    {!state.loading && state.loaded && !state.error && state.mailboxes.length === 0 && <div className={styles.empty}>
      <span className={styles.emptyMark}><Mail size={26} /></span><h3>No inboxes connected</h3>
      <p>Connect a sending inbox from Email Studio when you&apos;re ready to reach out.</p>
    </div>}
    {state.mailboxes.length > 0 && <div className={styles.inboxGrid}>{state.mailboxes.map((mailbox) => {
      const linked = mailbox.created_at ? new Date(mailbox.created_at) : null;
      return <article className={styles.inboxCard} key={mailbox._id}>
        <div className={styles.cardTop}><span className={styles.providerMark} data-provider={mailbox.provider}>{mailbox.provider === "google" ? "G" : <Mail size={20} />}</span>
          <span className={styles.linked}><span />Linked for sending</span></div>
        <h3>{mailbox.email}</h3>
        <p className={styles.metadata}>{mailbox.provider === "google" ? "Gmail / Google Workspace" : mailbox.provider === "smtp" ? "Custom SMTP inbox" : "Sending inbox"}{mailbox.name ? ` · ${mailbox.name}` : ""}</p>
        <div className={styles.cardBottom}><span>{linked && !Number.isNaN(linked.getTime()) ? `Linked ${linked.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}` : "Outreach connection"}</span>
          <button type="button" disabled={state.loading || busy} aria-label={`Disconnect inbox ${mailbox.email}`} onClick={() => { setDisconnectError(""); setSelected(mailbox); }}><Unplug size={14} />Disconnect</button></div>
      </article>;
    })}</div>}
    <div className={styles.footnote}><ShieldCheck size={15} /><p>These are sending connections only. Disconnecting an inbox does not change how you sign in.</p></div>
    {selected && <DisconnectDialog mailbox={selected} busy={busy} error={disconnectError} onClose={() => setSelected(null)} onConfirm={disconnect} />}
  </section>;
}
