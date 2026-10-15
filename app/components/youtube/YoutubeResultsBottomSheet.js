"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { animated, useSpring } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { ChevronUp, Download, Mail, SlidersHorizontal, Users, Video, X } from "lucide-react";
import YoutubeResultsGrid from "./YoutubeResultsGrid";

// # Track viewport changes without a mount-time state update or a stale drag boundary.
const subscribeViewport = (callback) => {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
};
const viewportHeight = () => Math.round(window.innerHeight * 0.88);
const serverHeight = () => 800;

export default function YoutubeResultsBottomSheet({ isOpen, onOpen, onClose, onExport, onExportJson, data, totalFound, withEmail, costUsd, query, message, filters }) {
  const height = useSyncExternalStore(subscribeViewport, viewportHeight, serverHeight);
  const closedY = Math.max(0, height - 76);
  const sheetRef = useRef(null);
  const closeRef = useRef(null);
  const [{ y, opacity }, api] = useSpring(() => ({ y: closedY, opacity: 0, config: { tension: 280, friction: 32 } }));

  useEffect(() => {
    api.start({ y: isOpen ? 0 : closedY, opacity: isOpen ? 1 : 0, immediate: false });
  }, [isOpen, closedY, api]);

  useEffect(() => {
    if (!isOpen) return;
    // # Restore page scrolling and keyboard focus when the sheet closes or unmounts.
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });
    const handleKey = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab") return;
      const focusable = [...sheetRef.current.querySelectorAll('button:not(:disabled), a[href], input, select, summary')];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKey);
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [isOpen, onClose]);

  // # Use the same spring and drag-to-dismiss interaction as the other pipeline sheets.
  const bind = useDrag(({ active, offset: [, offsetY], velocity: [, velocityY], direction: [, directionY] }) => {
    if (active) api.start({ y: Math.max(0, offsetY), immediate: true });
    else if (offsetY > height * 0.3 || velocityY > 0.5 && directionY > 0) {
      onClose();
      api.start({ y: closedY, immediate: false });
    } else {
      onOpen();
      api.start({ y: 0, immediate: false });
    }
  }, { from: () => [0, y.get()], bounds: { top: 0, bottom: closedY }, rubberband: true, filterTaps: true });

  return (
    <>
      <animated.div aria-hidden="true" onClick={onClose} style={{ opacity, pointerEvents: isOpen ? "auto" : "none" }} className="fixed inset-0 z-[100] bg-slate-950/25 backdrop-blur-sm" />
      <animated.section ref={sheetRef} role={isOpen ? "dialog" : undefined} aria-modal={isOpen || undefined} aria-labelledby="youtube-results-title" style={{ y, height }} className="fixed inset-x-0 bottom-0 z-[110] flex flex-col overflow-hidden rounded-t-[32px] border-t border-border bg-surface shadow-[0_-12px_60px_rgba(15,23,42,0.18)] will-change-transform">
        {/* # The persistent peek doubles as a keyboard-accessible result launcher. */}
        <button {...bind()} type="button" onClick={isOpen ? onClose : onOpen} aria-expanded={isOpen} aria-label={isOpen ? "Collapse YouTube results" : `Open ${data.length} YouTube channel results`} className="flex h-[76px] shrink-0 touch-none flex-col items-center justify-center gap-2 border-b border-border bg-surface cursor-grab active:cursor-grabbing">
          <span className="h-1 w-12 rounded-full bg-gray-300" />
          <span className="flex items-center gap-2 text-xs font-semibold text-brand-dark"><Video className="h-4 w-4 text-red-500" />{data.length} creators ready to explore<ChevronUp className={`h-4 w-4 text-red-500 transition-transform ${isOpen ? "rotate-180" : ""}`} /></span>
        </button>
        <div inert={!isOpen} className="flex min-h-0 flex-1 flex-col">
          <header className="flex shrink-0 flex-wrap items-start justify-between gap-4 border-b border-border px-5 py-5 sm:px-8">
            <div className="min-w-0">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.22em] text-red-500">YouTube discovery / Creator collection</p>
              <h2 id="youtube-results-title" className="text-2xl font-bold tracking-tight text-brand-dark sm:text-3xl">Your next collaboration starts here.</h2>
              <p className="mt-1 max-w-2xl truncate text-sm text-gray-500" title={query}>{query ? `Results for “${query}”` : "Explore your channel shortlist"}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-[11px]"><span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-gray-500"><Users className="h-3 w-3" />{totalFound} discovered</span><span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-600"><Mail className="h-3 w-3" />{withEmail} with public email</span>{costUsd != null && <span className="rounded-full border border-border px-3 py-1 text-gray-500">Source cost ${Number(costUsd).toFixed(5)}</span>}</div>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={onExport} disabled={!data.length} className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-semibold text-white disabled:opacity-40"><Download className="h-4 w-4" />Export CSV</button>
              <button type="button" onClick={onExportJson} disabled={!data.length} className="rounded-xl border border-border px-3 py-2.5 text-xs font-semibold text-brand-dark disabled:opacity-40">JSON</button>
              <button ref={closeRef} type="button" onClick={onClose} aria-label="Close results" className="rounded-full border border-border p-2.5 text-gray-500 hover:bg-[var(--rw-surface-hover)]"><X className="h-4 w-4" /></button>
            </div>
          </header>
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-[var(--rw-surface-hover)] px-4 pt-5 pb-10 sm:px-8">
            <div className="mx-auto max-w-[1800px]">
              <div className="mb-6 rounded-2xl border border-border bg-surface p-4"><div className="mb-3 flex items-center justify-between gap-3"><span className="inline-flex items-center gap-2 text-xs font-semibold text-brand-dark"><SlidersHorizontal className="h-3.5 w-3.5 text-red-500" />Curate your shortlist</span><span className="text-xs text-gray-500">{data.filter((row) => row.email).length} of {data.length} shown have email</span></div>{filters}</div>
              {message && <p className="mb-4 text-xs text-gray-500" role="status">{message}</p>}
              <YoutubeResultsGrid data={data} />
            </div>
          </div>
        </div>
      </animated.section>
    </>
  );
}
