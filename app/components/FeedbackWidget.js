"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Check, Loader2, MessageCircleHeart, X } from "lucide-react";
import { useAuth } from "../lib/AuthContext";
import { feedbackApi } from "../lib/api";
import { feedbackAccountKey, FEEDBACK_PIPELINES, FEEDBACK_PIPELINE_EVENT, FEEDBACK_RATINGS, randomFeedbackDelay } from "../lib/feedback";
import styles from "./FeedbackWidget.module.css";

function FeedbackCard({ pipeline, onClose, onSaved }) {
  const [rating, setRating] = useState(null);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [locked, setLocked] = useState(false);
  const [error, setError] = useState("");
  const payload = useRef(null);
  const inFlight = useRef(false);
  const cardRef = useRef(null);
  const previousFocus = useRef(null);
  const titleId = useId();
  const commentId = useId();
  const hintId = useId();

  useEffect(() => {
    // # Preserve the existing page focus; opening a nonmodal prompt never steals it.
    previousFocus.current = document.activeElement;
  }, []);

  useEffect(() => {
    // # A successful submission gets a brief acknowledgement before the card closes.
    if (!saved) return;
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [saved, onClose]);

  const close = () => {
    // # Restore focus only when the user was interacting with this nonmodal card.
    if (cardRef.current?.contains(document.activeElement)) {
      if (previousFocus.current?.isConnected) previousFocus.current.focus({ preventScroll: true });
      else document.activeElement.blur();
    }
    onClose();
  };
  const submit = async (event) => {
    event.preventDefault();
    if (!rating || inFlight.current) return;
    inFlight.current = true;
    setBusy(true); setError("");
    // # Preserve the exact request on an uncertain network failure. Retry is idempotent.
    try {
      payload.current ||= { submission_id: crypto.randomUUID(), pipeline, rating, comment: comment.trim() };
      setLocked(true);
      const receipt = await feedbackApi("/feedback", payload.current);
      onSaved(receipt);
      setSaved(true);
    } catch (exception) {
      if (exception.status === 409) {
        // # Another tab/device may already have submitted. Refresh the shared pause.
        try { onSaved(await feedbackApi()); close(); }
        catch { setError("Feedback was shared recently. Close this prompt and try again later."); }
      } else setError("We could not confirm your feedback was saved. Try again to send the same response.");
    } finally { inFlight.current = false; setBusy(false); }
  };

  return <section ref={cardRef} className={styles.card} role="dialog" aria-modal="false" aria-labelledby={titleId}
    onKeyDown={(event) => { if (event.key === "Escape" && !busy) { event.stopPropagation(); close(); } }}>
    <button type="button" className={styles.close} aria-label="Dismiss feedback for now" onClick={close} disabled={busy}><X size={16} /></button>
    {saved ? <div className={styles.thanks} role="status"><span><Check size={22} /></span><h2 id={titleId}>Thanks for sharing!</h2><p>Your feedback helps us make Simpleads better.</p></div> : <>
      <div className={styles.kicker}><MessageCircleHeart size={14} />A QUICK CHECK-IN</div>
      <h2 id={titleId}>How&apos;s Simpleads feeling?</h2>
      <p className={styles.intro}>How was your experience with our tool?</p>
      <form onSubmit={submit}>
        {/* # Accessible labels give each emoji a meaning without relying on appearance. */}
        <fieldset className={styles.ratings} disabled={busy || locked}>
          <legend className={styles.srOnly}>Rate your experience from disappointed to loved it</legend>
          {FEEDBACK_RATINGS.map((item) => <button key={item.value} type="button" aria-label={`${item.value} out of 5: ${item.label}`} aria-pressed={rating === item.value}
            onClick={() => setRating(item.value)}><span aria-hidden="true">{item.emoji}</span><small>{item.label}</small></button>)}
        </fieldset>
        {rating && <div className={styles.details}>
          <label htmlFor={commentId}>Want to add anything? <span>Optional</span></label>
          <textarea id={commentId} rows={3} maxLength={2000} value={comment} disabled={busy || locked} aria-describedby={hintId}
            onChange={(event) => setComment(event.target.value)} placeholder="What worked well, or what could be better?" />
          <div id={hintId} className={styles.hint}>A rating is enough. A few words help even more.</div>
          {error && <p className={styles.error} role="alert">{error}</p>}
          <div className={styles.actions}><button type="button" onClick={close} disabled={busy}>Maybe later</button><button type="submit" disabled={busy}>{busy ? <><Loader2 size={14} className={styles.spin} />Sending...</> : error ? "Try again" : "Submit feedback"}</button></div>
        </div>}
      </form>
    </>}
  </section>;
}

function FeedbackScheduler({ accountKey, token }) {
  const [prompt, setPrompt] = useState(null);
  const [running, setRunning] = useState(false);
  const actions = useRef({});

  useEffect(() => {
    let cancelled = false;
    let timer;
    let queue = null;
    let open = false;
    let checking = false;
    const active = new Set();
    const controller = new AbortController();
    const read = () => {
      // # Persist timing only. A private/disabled storage setting still permits this session.
      try {
        const value = JSON.parse(localStorage.getItem(accountKey));
        if (value && FEEDBACK_PIPELINES[value.pipeline] && Number.isFinite(value.nextPromptAt)) queue = value;
      } catch { /* # Retain the in-memory schedule when storage is unavailable. */ }
      return queue;
    };
    const write = (value) => {
      queue = value;
      try { localStorage.setItem(accountKey, JSON.stringify(value)); }
      catch { /* # Storage failures must never affect a pipeline or a feedback save. */ }
    };
    const schedule = (delay = 15000) => {
      clearTimeout(timer);
      if (!cancelled) timer = setTimeout(check, Math.min(Math.max(delay, 250), 60000));
    };
    const canShow = () => !cancelled && !active.size && document.visibilityState === "visible" && document.body?.style.overflow !== "hidden"
      && !document.querySelector('[role="dialog"][aria-modal="true"], dialog[open], .rw-modal-backdrop, [data-feedback-blocking="true"]');
    const check = async () => {
      const current = read();
      if (!current || open || checking || !canShow()) { schedule(); return; }
      if (current.nextPromptAt > Date.now()) { schedule(current.nextPromptAt - Date.now()); return; }
      checking = true;
      try {
        // # The server is authoritative even when local timing is stale or the clock changes.
        const status = await feedbackApi("/feedback/eligibility", undefined, controller.signal);
        if (cancelled) return;
        const latest = read();
        const nextEligibleAt = Date.parse(status.next_eligible_at) || 0;
        if (!status.eligible) {
          write({ ...latest, nextEligibleAt, nextPromptAt: Math.max(nextEligibleAt, Date.now() + randomFeedbackDelay(true)) });
        } else if (canShow() && !open && latest.nextPromptAt <= Date.now()) {
          open = true;
          write({ ...latest, nextPromptAt: Date.now() + randomFeedbackDelay(true) });
          setPrompt({ pipeline: latest.pipeline, key: Date.now() });
        }
      } catch {
        // # Offline eligibility checks stay quiet and retry independently of the pipeline.
        if (!cancelled) write({ ...read(), nextPromptAt: Date.now() + randomFeedbackDelay(true) });
      } finally { checking = false; schedule(); }
    };
    const close = () => {
      if (cancelled) return;
      open = false;
      setPrompt(null);
      const current = read();
      if (current) write({ ...current, nextPromptAt: Math.max(current.nextEligibleAt || 0, Date.now() + randomFeedbackDelay(true)) });
      schedule();
    };
    actions.current = {
      close,
      saved: (receipt) => {
        if (cancelled) return;
        const current = read();
        const nextEligibleAt = Date.parse(receipt.next_eligible_at);
        if (current && Number.isFinite(nextEligibleAt)) write({ ...current, nextEligibleAt, nextPromptAt: nextEligibleAt + randomFeedbackDelay() });
      },
    };
    const pipelineEvent = ({ detail }) => {
      if (!detail || !FEEDBACK_PIPELINES[detail.pipeline]) return;
      if (detail.type === "started") active.add(detail.id);
      else active.delete(detail.id);
      setRunning(active.size > 0);
      if (detail.type === "finished") {
        const current = read();
        write({ ...current, pipeline: detail.pipeline, nextPromptAt: Math.max(current?.nextPromptAt || 0, current?.nextEligibleAt || 0, Date.now() + randomFeedbackDelay()) });
      }
      schedule();
    };
    const storageEvent = (event) => {
      if (event.key !== accountKey) return;
      const current = read();
      // # A submission in another tab closes a stale prompt and shares the ten-day pause.
      if (current?.nextEligibleAt > Date.now()) { open = false; setPrompt(null); }
      schedule();
    };
    const visible = () => schedule(500);
    window.addEventListener(FEEDBACK_PIPELINE_EVENT, pipelineEvent);
    window.addEventListener("storage", storageEvent);
    document.addEventListener("visibilitychange", visible);
    schedule(500);
    return () => {
      cancelled = true; controller.abort(); clearTimeout(timer);
      window.removeEventListener(FEEDBACK_PIPELINE_EVENT, pipelineEvent);
      window.removeEventListener("storage", storageEvent);
      document.removeEventListener("visibilitychange", visible);
    };
  }, [accountKey, token]);

  // # Keep an existing draft while another run is active, without displaying the popup.
  return prompt && <div className={styles.position} hidden={running}>
    <FeedbackCard key={prompt.key} pipeline={prompt.pipeline} onClose={() => actions.current.close?.()} onSaved={(receipt) => actions.current.saved?.(receipt)} />
  </div>;
}

export default function FeedbackWidget() {
  const { token, isInitializing, isSuspended } = useAuth();
  const pathname = usePathname();
  const accountKey = token && feedbackAccountKey(token);
  // # Prompts belong to the signed-in workspace, never landing, profile, or admin screens.
  if (isInitializing || isSuspended || !accountKey || !pathname?.startsWith("/dashboard")) return null;
  return <FeedbackScheduler key={accountKey} accountKey={accountKey} token={token} />;
}
