"use client";

// # The dashboard shell owns one studio, outside every animated results sheet.
// # A transformed left pane gives fixed descendants (sheets/backdrops/modals) a
// # containing block, so they resize with the app instead of covering the studio.
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import EmailStudio from "./EmailStudio";
import styles from "./Outreach.module.css";

const OutreachContext = createContext(null);

export function useOutreachWorkspace() {
  const workspace = useContext(OutreachContext);
  if (!workspace) throw new Error("ResultsTable must be inside OutreachWorkspace");
  return workspace;
}

export default function OutreachWorkspace({ children, theme, navigation }) {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [wave, setWave] = useState(false);
  const [selection, setSelection] = useState({ source: null, recipients: [], excluded: [] });
  const trigger = useRef(null);
  const closeTimer = useRef(null);
  const gridRef = useRef(null);
  const drag = useRef(null);
  const frame = useRef(null);
  const [split, setSplit] = useState(50);

  useEffect(() => () => { clearTimeout(closeTimer.current); cancelAnimationFrame(frame.current); }, []);

  // # A real separator supports pointer capture and keyboard resizing. Measure
  // # bounds once per gesture; commit CSS once per frame and React once on release.
  // # Minimum pane widths protect the table/composer at common desktop sizes.
  const clampSplit = (value) => {
    const minimum = Math.max(32, 360 / (gridRef.current?.clientWidth || 1125) * 100);
    return Math.min(100 - minimum, Math.max(minimum, value));
  };
  function startResize(event) {
    if (event.button !== 0) return;
    const bounds = gridRef.current.getBoundingClientRect();
    drag.current = { bounds, value: split };
    event.currentTarget.setPointerCapture(event.pointerId);
    gridRef.current.dataset.resizing = "true";
  }
  function moveResize(event) {
    if (!drag.current) return;
    const { bounds } = drag.current;
    const minimum = Math.max(32, 360 / bounds.width * 100);
    drag.current.value = Math.min(100 - minimum, Math.max(minimum, (event.clientX - bounds.left) / bounds.width * 100));
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      if (drag.current) gridRef.current.style.setProperty("--outreach-split", `${drag.current.value}%`);
    });
  }
  function stopResize() {
    if (!drag.current) return;
    cancelAnimationFrame(frame.current);
    setSplit(drag.current.value);
    gridRef.current.style.setProperty("--outreach-split", `${drag.current.value}%`);
    delete gridRef.current.dataset.resizing;
    drag.current = null;
  }

  const openStudio = useCallback((source, recipients, button) => {
    trigger.current = button;
    setSelection((current) => ({ source, recipients, excluded: current.source === source ? current.excluded : [] }));
    clearTimeout(closeTimer.current);
    setClosing(false);
    if (!open) setWave(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setOpen(true);
  }, [open]);

  const updateRecipients = useCallback((source, recipients) => {
    // # Only the table that opened this draft may update its recipients. Other
    // # pipeline views remain mounted but must not overwrite the active list.
    setSelection((current) => current.source !== source || JSON.stringify(current.recipients) === JSON.stringify(recipients)
      ? current : { ...current, recipients });
  }, []);

  const removeRecipient = useCallback((email) => {
    setSelection((current) => ({ ...current, excluded: [...new Set([...current.excluded, email])] }));
  }, []);
  const restoreRecipients = useCallback(() => setSelection((current) => ({ ...current, excluded: [] })), []);
  const closeStudio = useCallback(() => {
    // # Keep both panes mounted during the brief exit, preserving the draft and
    // # table selection. Focus returns only after the full-width view is restored.
    setClosing(true);
    setWave(false);
    clearTimeout(closeTimer.current);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    closeTimer.current = setTimeout(() => {
      setOpen(false);
      setClosing(false);
      if (trigger.current?.isConnected) trigger.current.focus({ preventScroll: true });
    }, reduced ? 120 : 240);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event) => {
      // # Native mailbox dialogs own Escape while open; do not dismiss the
      // # entire workspace when the user only meant to leave sender settings.
      if (event.key === "Escape" && !event.defaultPrevented && !document.querySelector("dialog[open]")) {
        event.preventDefault();
        closeStudio();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, closeStudio]);
  const value = useMemo(() => ({ source: selection.source, excluded: selection.excluded,
    openStudio, updateRecipients, restoreRecipients }), [selection.source, selection.excluded, openStudio, updateRecipients, restoreRecipients]);

  return <OutreachContext.Provider value={value}>
    <div className={`${styles.screenWorkspace} ${open ? styles.screenSplit : ""} ${closing ? styles.workspaceClosing : ""}`} data-theme={theme}>
      <div className={styles.navigation}>{navigation}</div>
      <div ref={gridRef} className={styles.paneGrid} style={{ "--outreach-split": `${split}%` }}>
      {/* # Animate the empty surface rather than scaling table text or asking
          # AG Grid to lay out every animation frame. Data commits once. */}
      {open && <div aria-hidden="true" className={styles.surfaceReveal} />}
      <div className={styles.appPane}>
        <div className={styles.appCanvas}>{children}</div>
        {open && wave && <span aria-hidden="true" className={styles.energyWave} onAnimationEnd={(event) => {
          if (event.target === event.currentTarget) setWave(false);
        }} />}
      </div>
      <div className={styles.resizeHandle} hidden={!open} role="separator" tabIndex={0}
        aria-label="Resize leads preview and Email Studio" aria-orientation="vertical"
        aria-valuemin={32} aria-valuemax={68} aria-valuenow={Math.round(split)}
        onPointerDown={startResize} onPointerMove={moveResize} onPointerUp={stopResize}
        onPointerCancel={stopResize} onLostPointerCapture={stopResize}
        onDoubleClick={() => setSplit(50)} onKeyDown={(event) => {
          if (["ArrowLeft", "ArrowRight", "Home"].includes(event.key)) {
            event.preventDefault();
            setSplit(event.key === "Home" ? 50 : clampSplit(split + (event.key === "ArrowLeft" ? -2 : 2)));
          }
        }}><span /></div>
      {/* # Keep the single studio mounted when closed to preserve the in-memory
          # draft. It scrolls independently and is never nested in a sheet. */}
      <div className={styles.studioPane} hidden={!open}>
        <EmailStudio open={open} recipients={selection.recipients.filter((item) => !selection.excluded.includes(item.email))}
          onRemove={removeRecipient} onClose={closeStudio} />
      </div>
      </div>
    </div>
  </OutreachContext.Provider>;
}
