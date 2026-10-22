"use client";

// # Mailbox setup is a separate native modal, keeping provider credentials and
// # connection controls outside the writing canvas. showModal provides focus
// # containment, Escape handling and a top layer above the dashboard split.
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Mail, ShieldCheck, Unplug, X, LockKeyhole, CheckCircle2 } from "lucide-react";
import { outreachApi } from "./api";
import styles from "./Outreach.module.css";

const defaults = { name: "", email: "", username: "", password: "", host: "smtp.hostinger.com", port: 465 };

export default function MailboxModal({ mailboxes, mailboxId, onSelect, onRefresh, onClose }) {
  const dialogRef = useRef(null);
  const [smtp, setSmtp] = useState(defaults);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [provider, setProvider] = useState(null);
  const [connected, setConnected] = useState(false);
  const [googleBaseline, setGoogleBaseline] = useState(null);
  const ready = connected || Boolean(provider === "google" && googleBaseline && mailboxes.some((mailbox) =>
    mailbox.provider === "google" && googleBaseline[mailbox._id] !== mailbox.created_at));

  useEffect(() => {
    const dialog = dialogRef.current;
    const trigger = document.activeElement;
    dialog.showModal();
    return () => {
      dialog.close();
      if (trigger?.isConnected) trigger.focus();
    };
  }, []);

  async function connectGoogle() {
    // # Create the popup within the click event so browser popup blockers do not
    // # mistake the awaited authorization request for an unsolicited new window.
    const popup = window.open("about:blank", "simpleads-gmail", "width=620,height=740");
    if (!popup) { setError("Allow popups to connect Gmail."); return; }
    setBusy(true); setError("");
    setGoogleBaseline(Object.fromEntries(mailboxes.filter((mailbox) => mailbox.provider === "google").map((mailbox) => [mailbox._id, mailbox.created_at])));
    try {
      const result = await outreachApi("/outreach/mailboxes/google/connect", {});
      popup.location.href = result.url;
      setNotice("Finish connecting in the Google window, then close it. Your mailbox will appear here automatically.");
    } catch (failure) { popup.close(); setError(failure.message); }
    finally { setBusy(false); }
  }

  async function connectSMTP(event) {
    event.preventDefault(); setBusy(true); setError(""); setNotice("");
    try {
      const mailbox = await outreachApi("/outreach/mailboxes/smtp", {
        ...smtp, username: smtp.username || smtp.email, port: Number(smtp.port),
      });
      // # Clear credentials immediately after successful authentication. Closing
      // # this modal unmounts its state and also discards unfinished credentials.
      setSmtp(defaults);
      await onRefresh();
      onSelect(mailbox._id);
      setConnected(true);
      setNotice("Mailbox authenticated and connected. Select Done to return to your email.");
    } catch (failure) { setError(failure.message); }
    finally { setBusy(false); }
  }

  async function manageMailbox(action) {
    setBusy(true); setError(""); setNotice("");
    try {
      await outreachApi(`/outreach/mailboxes/${mailboxId}${action === "check" ? "/check" : ""}`,
        action === "check" ? {} : undefined, action === "check" ? "POST" : "DELETE");
      await onRefresh();
      setNotice(action === "check" ? "Mailbox authentication succeeded. No email was sent." : "Mailbox disconnected.");
    } catch (failure) { setError(failure.message); }
    finally { setBusy(false); }
  }

  return <dialog ref={dialogRef} className={`${styles.studio} ${styles.mailboxModal}`}
    aria-labelledby="mailbox-modal-title" aria-describedby="mailbox-modal-description"
    onCancel={(event) => { event.preventDefault(); onClose(); }}>
    <header className={styles.studioHeader}>
      <div><span className={styles.eyebrow}>SENDER SETTINGS</span><h2 id="mailbox-modal-title"><Mail size={20} /> Mailboxes</h2></div>
      <button type="button" onClick={onClose} aria-label="Close mailbox settings"><X size={20} /></button>
    </header>
    <div className={styles.studioBody}>
      <div className={styles.mailboxIntro}>
        <h3>Let&apos;s link your mailbox</h3>
        <p id="mailbox-modal-description" className={styles.muted}>Send personal outreach from your own inbox. Choose a provider to get started.</p>
      </div>
      {error && <p role="alert" className={styles.error}>{error}</p>}
      {notice && <p role="status" className={styles.notice}>{notice}</p>}
      {mailboxes.length > 0 && <section className={styles.setup} aria-label="Connected mailboxes">
        <label>Send from<select value={mailboxId} onChange={(event) => onSelect(event.target.value)}>
          <option value="">Choose a mailbox</option>
          {mailboxes.map((mailbox) => <option key={mailbox._id} value={mailbox._id}>{mailbox.email} · {mailbox.provider === "google" ? "Gmail" : "SMTP"}</option>)}
        </select></label>
        <div className={styles.connectionBar}>
          <button type="button" disabled={!mailboxId || busy} onClick={() => manageMailbox("check")}><ShieldCheck size={15} /> Check connection</button>
          <button type="button" disabled={!mailboxId || busy} onClick={() => manageMailbox("disconnect")}><Unplug size={15} /> Disconnect</button>
        </div>
      </section>}
      {!provider && <section aria-label="Choose your email provider">
        <h4 className={styles.providerLabel}>Choose your email provider</h4>
        <div className={styles.providerGrid}>
          <button type="button" className={styles.providerCard} onClick={() => { setProvider("google"); setError(""); setNotice(""); }}>
            {/* # Provider marks are inline vectors; setup does not depend on an
                # external logo request or expose mailbox details to image hosts. */}
            <svg viewBox="0 0 24 24" width="36" height="36" aria-hidden="true"><path fill="#4285f4" d="M21.6 12.2c0-.7-.1-1.4-.2-2.1H12v4h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.8 3-4.3 3-7.4Z"/><path fill="#34a853" d="M12 22c2.7 0 5-1 6.6-2.4L15.4 17c-.9.6-2 .9-3.4.9-2.6 0-4.9-1.8-5.7-4.2H3v2.6A10 10 0 0 0 12 22Z"/><path fill="#fbbc05" d="M6.3 13.7a6 6 0 0 1 0-3.4V7.7H3a10 10 0 0 0 0 8.6Z"/><path fill="#ea4335" d="M12 6.1c1.5 0 2.8.5 3.8 1.5l2.8-2.8A9.5 9.5 0 0 0 12 2a10 10 0 0 0-9 5.7l3.3 2.6C7.1 7.9 9.4 6.1 12 6.1Z"/></svg>
            <strong>Google</strong><small>Gmail / Google Workspace</small>
          </button>
          <button type="button" className={styles.providerCard} disabled title="Outlook integration is deferred">
            <LockKeyhole className={styles.providerLock} size={13}/><span className={styles.outlookMark} aria-hidden="true">O</span><strong>Outlook</strong><small>Coming later</small>
          </button>
          <button type="button" className={styles.providerCard} onClick={() => { setProvider("smtp"); setError(""); setNotice(""); }}>
            <Mail size={36}/><strong>Other</strong><small>Hostinger / custom SMTP</small>
          </button>
        </div>
      </section>}
      {provider && <section className={styles.providerSteps} aria-label="Mailbox setup steps">
        <button type="button" className={styles.backButton} disabled={busy} onClick={() => { setProvider(null); setSmtp(defaults); setError(""); setNotice(""); setConnected(false); setGoogleBaseline(null); }}><ArrowLeft size={15}/> All providers</button>
        <div className={styles.setupSteps}><span>1 · Provider</span><span className={ready ? "" : styles.activeSetupStep}>2 · Connect</span><span className={ready ? styles.activeSetupStep : ""}>3 · Ready</span></div>
        {ready ? <div className={styles.connectionSuccess}><CheckCircle2 size={34}/><h3>Your mailbox is connected</h3><p>You&apos;re ready to write. Choose your sender above, then close settings to continue your draft.</p></div> : provider === "google" ? <div className={styles.googleInstructions}>
          <h3>Connect your Google inbox</h3><ol><li>Choose the Google account you want to send from.</li><li>Approve sending access for SimpLeads.</li><li>Return here and choose your connected mailbox.</li></ol>
          <p>We request sending access. Your inbox messages are not read.</p>
          <button type="button" className={styles.primary} disabled={busy} onClick={connectGoogle}>Continue with Google ↗</button>
        </div> : <>
          <h3 className={styles.providerLabel}>Connect your SMTP mailbox</h3>
          <p className={styles.muted}>Use the outgoing mail settings from your email provider. We&apos;ll verify them securely before saving.</p>
          <form onSubmit={connectSMTP} className={styles.setupForm}>
            <label>Provider preset<select value={["smtp.hostinger.com", "smtp.titan.email"].includes(smtp.host) ? smtp.host : ""}
              onChange={(event) => setSmtp({ ...smtp, host: event.target.value })}>
              <option value="smtp.hostinger.com">Hostinger Email</option><option value="smtp.titan.email">Titan Email</option><option value="">Other SMTP</option>
            </select></label>
            {/* # Explicit metadata defines safe input types/autocomplete without
                # putting password values into browser persistence or API logs. */}
            {[
              ["name", "Sender name", "text", "name", ""],
              ["email", "Email address", "email", "email", ""],
              ["username", "SMTP username", "text", "off", "Defaults to email address"],
              ["password", "Mailbox / app password", "password", "new-password", ""],
              ["host", "SMTP host", "text", "off", "smtp.your-provider.com"],
            ].map(([key, label, type, autoComplete, placeholder]) => <label key={key}>{label}
              <input type={type} autoComplete={autoComplete} placeholder={placeholder} value={smtp[key]}
                required={["email", "password", "host"].includes(key)} maxLength={key === "name" ? 120 : key === "password" ? 1024 : 254}
                onChange={(event) => setSmtp({ ...smtp, [key]: event.target.value })} />
            </label>)}
            <label>Secure connection<select value={smtp.port} onChange={(event) => setSmtp({ ...smtp, port: Number(event.target.value) })}>
              <option value={465}>465 · SSL/TLS</option><option value={587}>587 · STARTTLS</option>
            </select></label>
            <button className={styles.primary} disabled={busy} type="submit">{busy ? "Connecting…" : "Check & connect"}</button>
            <small>Use your mailbox password, not your hosting account password. Credentials are encrypted on the server.</small>
          </form>
        </>}
      </section>}
    </div>
    <footer className={styles.modalFooter}><button type="button" className={styles.primary} onClick={onClose}>Done</button></footer>
  </dialog>;
}
