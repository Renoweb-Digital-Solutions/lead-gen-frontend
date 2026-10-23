"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Loader2, ShieldCheck } from "lucide-react";
import { identityApi } from "../lib/api";
import styles from "./GoogleAuthButton.module.css";

export default function GoogleAuthButton({ intent, disabled, onVerified, onError, onBusyChange }) {
  const [busy, setBusy] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const cleanup = useRef(null);
  useEffect(() => () => cleanup.current?.(), []);

  const start = async () => {
    // # A synchronous open avoids popup blocking. Keep one active browser-bound run.
    if (cleanup.current || busy || disabled) return;
    const popup = window.open("about:blank", "simpleads-google-identity", "popup=yes,width=520,height=700");
    if (!popup) return onError(new Error("Allow popups for Simpleads, then try Google again."));
    setBusy(true);
    onBusyChange(true);
    const controller = new AbortController();
    const secret = Array.from(crypto.getRandomValues(new Uint8Array(32)), (byte) => byte.toString(16).padStart(2, "0")).join("");
    let settled = false;
    let timer;
    let pollTimer;
    let attemptId;
    let callbackOrigin;
    const isCurrent = () => cleanup.current === release;
    const release = () => {
      window.removeEventListener("message", receive);
      window.clearTimeout(timer);
      window.clearTimeout(pollTimer);
      controller.abort();
      popup.close();
      // # An obsolete response must never cancel a newer sign-in attempt.
      if (isCurrent()) {
        cleanup.current = null;
        setBusy(false);
        onBusyChange(false);
      }
    };
    const complete = async (payload) => {
      if (settled || !isCurrent()) return;
      settled = true;
      setVerifying(true);
      window.clearTimeout(pollTimer);
      try {
        if (payload.error) throw new Error(payload.error);
        const result = await identityApi("/google/signin/exchange", { ticket: payload.ticket, browser_secret: secret }, false, controller.signal);
        if (isCurrent()) onVerified({ ...result, browser_secret: secret });
      } catch (error) { if (isCurrent()) onError(error); }
      finally { release(); }
    };
    const receive = (event) => {
      // # Preserve exact origin AND source checks on the fast postMessage path.
      if (event.origin !== callbackOrigin || event.source !== popup || event.data?.type !== "simpleads:google-auth") return;
      void complete(event.data);
    };
    const poll = async () => {
      if (settled || !isCurrent()) return;
      try {
        // # A browser-bound backend check also works when window.opener is severed.
        // # Schedule after completion rather than overlapping interval requests.
        const result = await identityApi("/google/signin/status", { attempt_id: attemptId, browser_secret: secret }, false, controller.signal);
        if (!isCurrent() || settled) return;
        if (result.status === "ready" || result.status === "error") { await complete(result); return; }
        pollTimer = window.setTimeout(poll, 1500);
      } catch (error) {
        if (isCurrent() && !settled) { onError(error); release(); }
      }
    };
    cleanup.current = release;
    setVerifying(false);
    window.addEventListener("message", receive);
    // # Keep the deadline through ticket exchange/SMTP, not just Google navigation.
    timer = window.setTimeout(() => {
      if (isCurrent()) { onError(new Error("Google sign-in did not finish. Close the Google window and try again.")); release(); }
    }, 180000);
    try {
      const result = await identityApi("/google/signin/start", { intent, browser_secret: secret }, false, controller.signal);
      if (!isCurrent()) return;
      attemptId = result.attempt_id;
      // # API transport can use 127.0.0.1 while Google's registered callback uses
      // # localhost. Validate the actual backend-issued redirect origin, not BASE_URL.
      callbackOrigin = new URL(new URL(result.authorization_url).searchParams.get("redirect_uri")).origin;
      popup.location.href = result.authorization_url;
      popup.focus();
      pollTimer = window.setTimeout(poll, 1500);
    } catch (error) { if (isCurrent()) { onError(error); release(); } }
  };

  return (
    <div className={styles.gateway}>
      <div className={styles.eyebrow}><span /> YOUR ACCOUNT. ONE CONNECTION.</div>
      <div className={styles.frame}>
        <button type="button" className={styles.button} onClick={start} disabled={disabled || busy} aria-busy={busy}>
          {/* # Keep the Google mark static, proportionate and in its original colors. */}
          <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6C44.4 38.03 46.98 31.87 46.98 24.55Z" />
            <path fill="#FBBC05" d="M10.53 28.59A14.4 14.4 0 0 1 9.77 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.87 23.87 0 0 0 0 24c0 3.87.92 7.52 2.56 10.78l7.97-6.19Z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.15 1.45-4.92 2.3-8.18 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z" />
          </svg>
          <span>{busy ? "Waiting for Google…" : intent === "signup" ? "Sign up with Google" : "Sign in with Google"}</span>
          {busy ? <Loader2 size={17} className="animate-spin motion-reduce:animate-none" /> : <ArrowUpRight size={17} className={styles.arrow} />}
        </button>
      </div>
      <p className={styles.note}><ShieldCheck size={13} /> Google sign-in, followed by email verification.</p>
      {busy && <button type="button" className={styles.cancel} onClick={() => cleanup.current?.()}>Cancel Google sign-in</button>}
      <div className={styles.divider}><span />or continue with email<span /></div>
    </div>
  );
}
