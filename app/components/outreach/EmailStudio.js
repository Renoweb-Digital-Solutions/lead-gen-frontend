"use client";

// # This panel remains mounted while hidden so closing/reopening preserves the
// # draft in memory. Mailbox credentials are transient and cleared after saving.
// # Queue status is server-owned; closing the panel never cancels submitted mail.
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Mail,
  Send,
  X,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { outreachApi } from "./api";
import { personalize } from "./recipients";
import MailboxModal from "./MailboxModal";
import RichComposer from "./RichComposer";
import { PersonalizedSubject } from "./PersonalizedFields";
import { renderStudioEmail } from "./emailPresentation";
import { STARTER_TEMPLATES, composePayload, plainText, personalizeHTML } from "./composer";
import styles from "./Outreach.module.css";

export default function EmailStudio({ open, recipients, onRemove, onClose }) {
  const [mailboxes, setMailboxes] = useState([]);
  const [mailboxId, setMailboxId] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [signature, setSignature] = useState("");
  const [presentation, setPresentation] = useState("minimal");
  const [templates, setTemplates] = useState(STARTER_TEMPLATES);
  const [templateName, setTemplateName] = useState("");
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [signatureOpen, setSignatureOpen] = useState(false);
  // # The studio exposes a sender button; credentials/management live in a modal.
  const [mailboxModalOpen, setMailboxModalOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [batches, setBatches] = useState([]);
  const [preview, setPreview] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const request = useRef(null);
  const sending = useRef(false);
  const studioRef = useRef(null);

  useEffect(() => {
    // # Focus the region without scrolling either canvas; its label remains
    // # visible while keyboard users continue into sender/composer controls.
    if (open) studioRef.current?.focus({ preventScroll: true });
  }, [open]);

  const refresh = useCallback(async () => {
    const [connections, history] = await Promise.all([
      outreachApi("/outreach/mailboxes"),
      outreachApi("/outreach/batches"),
    ]);
    setMailboxes(connections.mailboxes);
    setMailboxId((current) =>
      connections.mailboxes.some((item) => item._id === current)
        ? current
        : connections.mailboxes[0]?._id || "",
    );
    setBatches(history.batches);
  }, []);

  useEffect(() => {
    if (!open) return;
    let active = true;
    const update = () =>
      refresh().catch((failure) => {
        if (active) setError(failure.message);
      });
    update();
    const timer = setInterval(update, 4000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [open, refresh]);

  async function send(event) {
    event.preventDefault();
    if (sending.current) return;
    sending.current = true;
    setBusy(true);
    setError("");
    setNotice("");
    const content = composePayload(body, signature);
    if (!content.body.trim() || content.body.length > 30000 || content.body_html.length > 60000) {
      setError("Write a message within 30,000 text characters and 60,000 formatting characters.");
      sending.current = false; setBusy(false); return;
    }
    const payload = { mailbox_id: mailboxId, recipients, subject, presentation, ...content };
    const fingerprint = JSON.stringify(payload);
    // # Retain the same request ID after a network failure, so retrying the same
    // # payload cannot send twice. Editing any field creates a new intent.
    if (request.current?.fingerprint !== fingerprint)
      request.current = {
        fingerprint,
        id: crypto.randomUUID(),
        accepted: false,
      };
    if (request.current.accepted) {
      setNotice(
        "This draft has already been queued. Edit it to create a new send.",
      );
      sending.current = false;
      setBusy(false);
      return;
    }
    try {
      await outreachApi("/outreach/batches", {
        ...payload,
        request_id: request.current.id,
      });
      request.current.accepted = true;
      setNotice(
        `Queued ${recipients.length} separate emails. Sending continues on the server.`,
      );
      await refresh();
    } catch (failure) {
      setError(failure.message);
    } finally {
      sending.current = false;
      setBusy(false);
    }
  }

  const recipient = recipients[Math.min(preview, recipients.length - 1)];
  const messageText = body ? plainText(body) : "";
  const words = messageText.trim() ? messageText.trim().split(/\s+/).length : 0;
  const previewHTML = showPreview && recipient ? personalizeHTML(composePayload(body, signature).body_html, recipient) : "";
  const sender = mailboxes.find((mailbox) => mailbox._id === mailboxId);
  // # Match the sent design without inventing a sender or issuing a live
  // # unsubscribe action from the preview. The real URL is generated at send.
  const previewDocument = presentation === "studio" ? renderStudioEmail(previewHTML,
    sender?.name || "Your name", sender?.email || "Connect a mailbox to set the sender", "#unsubscribe-preview") : null;

  function applyTemplate(template) {
    setSubject(template.subject); setBody(template.html); setPresentation(template.presentation || "minimal"); setLibraryOpen(false);
    if (template.presentation === "studio") setShowPreview(true);
    setNotice(`Loaded "${template.name}". Make it your own before sending.`);
  }
  function saveTemplate() {
    if (!templateName.trim() || !subject.trim() || !messageText.trim()) return;
    setTemplates((current) => [...current, { id: crypto.randomUUID(), name: templateName.trim(), subject, html: body, presentation }]);
    setTemplateName(""); setNotice("Template saved for this studio session.");
  }
  return (
    <aside ref={studioRef} tabIndex={-1} hidden={!open} className={styles.studio} aria-label="Email Studio">
      <header className={styles.studioHeader}>
        <div>
          <span className={styles.eyebrow}>OUTREACH WORKSPACE</span>
          <h2>
            <Mail size={20} /> Email Studio
          </h2>
        </div>
        <button type="button" onClick={() => { setMailboxModalOpen(false); onClose(); }} aria-label="Close Email Studio">
          <X size={20} />
        </button>
      </header>
      <div className={styles.studioBody}>
        <div className={styles.writingHeading}>
          <div><span className={styles.eyebrow}>MAKE IT PERSONAL</span><h3>Good conversations start here.</h3></div>
          <span className={styles.draftBadge}>DRAFT</span>
        </div>
        <div className={styles.composerActions}>
          <button type="button" aria-expanded={libraryOpen} onClick={() => setLibraryOpen(!libraryOpen)}>? Templates <small>{templates.length}</small></button>
          <button type="button" aria-pressed={showPreview} onClick={() => setShowPreview(!showPreview)}>{showPreview ? "Hide preview" : "Preview email"}</button>
          <button type="button" aria-expanded={signatureOpen} onClick={() => setSignatureOpen(!signatureOpen)}>Signature</button>
        </div>
        {libraryOpen && <section className={styles.templateLibrary} aria-label="Outreach templates">
          <div className={styles.connectionBar}><span>A starting point, in your voice</span><small>Editable templates</small></div>
          {templates.map((template) => <button type="button" key={template.id} onClick={() => applyTemplate(template)}><strong>{template.name}</strong><small>{recipient ? personalize(template.subject, recipient) : "Personalized email"}</small><span>Use template</span></button>)}
        </section>}
        {error && (
          <p role="alert" className={styles.error}>
            {error}
          </p>
        )}
        {notice && (
          <p role="status" className={styles.notice}>
            {notice}
          </p>
        )}
        {/* # Keep the writing canvas compact. The single button opens all
            # sender selection, connection and management in the native dialog. */}
        <button type="button" className={styles.mailboxButton} onClick={() => setMailboxModalOpen(true)}
          aria-haspopup="dialog" aria-expanded={mailboxModalOpen}>
          <Mail size={17} />
          <span>{mailboxes.find((mailbox) => mailbox._id === mailboxId)?.email || "Connect mailbox"}</span>
          <small>{mailboxId ? "Change / manage" : "Choose your sender"}</small>
        </button>
        {mailboxModalOpen && open && <MailboxModal mailboxes={mailboxes} mailboxId={mailboxId}
          onSelect={setMailboxId} onRefresh={refresh} onClose={() => setMailboxModalOpen(false)} />}
        <div className={styles.connectionBar}>
          <span>To</span>
          <span>{recipients.length}/10 recipients</span>
        </div>
        <div className={styles.chips}>
          {recipients.map((item) => (
            <span key={item.email}>
              {item.email}
              <button
                type="button"
                aria-label={`Remove ${item.email}`}
                onClick={() => onRemove(item.email)}
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
        {!recipients.length && (
          <p className={styles.muted}>
            Select leads with email addresses in the table to begin.
          </p>
        )}
        <form onSubmit={send} className={styles.composer}>
          {/* # Choose whose real details appear while editing. The shared draft
              # retains personalization fields, so every recipient gets their own. */}
          <label className={styles.recipientSwitcher}>Viewing email for
            <select value={recipient?.email || ""} disabled={!recipients.length} onChange={(event) => setPreview(recipients.findIndex((item) => item.email === event.target.value))}>
              {!recipients.length && <option value="">Select a lead</option>}
              {recipients.map((item) => <option key={item.email} value={item.email}>{item.first_name ? `${item.first_name} - ` : ""}{item.email}</option>)}
            </select>
            <small>One message, automatically personalized for each lead.</small>
          </label>
          <div className={styles.subjectField}><span>Subject</span>
            <PersonalizedSubject value={subject} recipient={recipient} onChange={setSubject} disabled={busy} />
          </div>
          <label>Email design<select value={presentation} onChange={(event) => setPresentation(event.target.value)}>
            <option value="minimal">Minimal personal email</option><option value="studio">Blue note · designed outreach</option>
          </select><small>Design is applied when sending. Use Preview email to see the finished layout.</small></label>
          <div className={styles.messageHeading}><span>Your message</span><small>{words} words ? {messageText.length}/30,000 characters</small></div>
          <RichComposer value={body} onChange={setBody} disabled={busy} recipient={recipient} />
          {signatureOpen && <label className={styles.signatureField}>Email signature<textarea rows={3} maxLength={1000} value={signature} placeholder="Your name, role and contact details" onChange={(event) => setSignature(event.target.value)} /><small>Appended to each email. Your signature stays in this draft.</small></label>}
          <div className={styles.saveTemplateRow}><input aria-label="New template name" maxLength={100} value={templateName} placeholder="Name this template?" onChange={(event) => setTemplateName(event.target.value)} />
            <button type="button" disabled={!templateName.trim() || !subject.trim() || !messageText.trim()} onClick={saveTemplate}>Save template</button></div>
          <small>Custom templates are saved for this studio session.</small>
          <small>
            Names, company details and email addresses update automatically for each lead. Any unavailable details must be filled in before sending.
          </small>
          <button
            type="button"
            className={styles.previewButton}
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? "Hide preview" : "Preview personalization"}
          </button>
          {showPreview && recipient && (
            <div className={styles.preview}>
              <select
                aria-label="Preview recipient"
                value={Math.min(preview, recipients.length - 1)}
                onChange={(event) => setPreview(Number(event.target.value))}
              >
                {recipients.map((item, index) => (
                  <option key={item.email} value={index}>
                    {item.email}
                  </option>
                ))}
              </select>
              <strong>{personalize(subject, recipient)}</strong>
              <iframe title="Personalized email preview" sandbox="" className={`${styles.previewFrame} ${presentation === "studio" ? styles.designedPreview : ""}`}
                srcDoc={previewDocument ? previewDocument.replace("<head>", "<head><meta http-equiv=\"Content-Security-Policy\" content=\"default-src 'none'; style-src 'unsafe-inline'\">") : `<!doctype html><html><head><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'"><style>body{font:14px/1.75 system-ui;color:#24324a;padding:16px;margin:0;overflow-wrap:anywhere}a{color:#155eef}p{margin:0 0 14px}ul,ol{padding-left:24px}</style></head><body>${previewHTML}</body></html>`} />
            </div>
          )}
          <p className={styles.security}>
            <ShieldCheck size={15} /> Each recipient gets a separate email and
            an unsubscribe link.
          </p>
          <button
            type="submit"
            className={styles.primary}
            disabled={
              busy ||
              !mailboxId ||
              !recipients.length ||
              recipients.length > 10 ||
              !subject.trim() ||
              !messageText.trim()
            }
          >
            <Send size={16} />
            {busy
              ? "Working…"
              : `Send to ${recipients.length} ${recipients.length === 1 ? "lead" : "leads"}`}
          </button>
        </form>
        <section className={styles.history}>
          <div className={styles.connectionBar}>
            <h3>Recent outreach</h3>
            <button
              type="button"
              aria-label="Refresh send results"
              onClick={() =>
                refresh().catch((failure) => setError(failure.message))
              }
            >
              <RefreshCw size={15} />
            </button>
          </div>
          {!batches.length && (
            <p className={styles.muted}>Your send results will appear here.</p>
          )}
          {batches.slice(0, 5).map((batch) => (
            <details key={batch._id}>
              <summary>
                {batch.subject} <small>· {batch.status}</small>
              </summary>
              <time>{new Date(batch.created_at).toLocaleString()}</time>
              {batch.messages.map((item) => (
                <div className={styles.result} key={item.email}>
                  <span>{item.email}</span>
                  <b data-status={item.status}>
                    {item.status === "accepted"
                      ? "Provider accepted"
                      : item.status}
                  </b>
                  {item.detail && <small>{item.detail}</small>}
                </div>
              ))}
            </details>
          ))}
        </section>
      </div>
    </aside>
  );
}
