"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Component: ExportProgress
 *
 * WHAT IT DOES:
 * Displays a friendly progress log area while the backend scraper is running.
 * Shows casual messages every 15–20 seconds to reassure the user that the pipeline
 * is still working. Also displays an elapsed timer and estimated time remaining.
 *
 * PROPS RECEIVED:
 * - `isActive` (Boolean): Whether the export is currently in progress.
 * - `totalResults` (Number): The number of leads requested, used to estimate time.
 *   Props come from: e:\WORK\Renoweb\lead-gen\app\components\steps\ExportStep.js
 *
 * PROPS OUTGOING: None.
 */

// Casual log messages — picked sequentially (no repeats) every 15–20s
const LOG_MESSAGES = [
  { icon: "🔍", text: "Scanning Apollo databases for matching profiles..." },
  { icon: "🌐", text: "Resolving company domains and org charts..." },
  { icon: "📡", text: "Pulling fresh contact data from enrichment APIs..." },
  { icon: "🍳", text: "Cooking your data — almost golden..." },
  { icon: "⚡", text: "Cross-referencing seniority levels with role filters..." },
  { icon: "📊", text: "Building lead indexes for fast lookups..." },
  { icon: "🧹", text: "Deduplicating and cleaning contact records..." },
  { icon: "🔗", text: "Matching LinkedIn profiles to email addresses..." },
  { icon: "📬", text: "Verifying email deliverability status..." },
  { icon: "🏢", text: "Mapping company hierarchies and employee counts..." },
  { icon: "🧠", text: "Running relevance scoring on matched leads..." },
  { icon: "💼", text: "Scraping job postings from target companies..." },
  { icon: "📋", text: "Normalizing job titles across data sources..." },
  { icon: "🔄", text: "Syncing progress with checkpoint storage..." },
  { icon: "🎯", text: "Filtering leads by your targeting criteria..." },
  { icon: "📦", text: "Packaging results into export format..." },
  { icon: "☕", text: "Brewing another batch — this takes a moment..." },
  { icon: "🚀", text: "Pipeline is humming along nicely..." },
  { icon: "🔬", text: "Inspecting data quality across records..." },
  { icon: "🗂️", text: "Organizing leads by company and function..." },
  { icon: "⏳", text: "Still working — large datasets take a bit longer..." },
  { icon: "🛠️", text: "Stitching together multi-source enrichment data..." },
  { icon: "🌍", text: "Resolving geo-locations for person records..." },
  { icon: "📈", text: "Calculating urgency scores based on job activity..." },
  { icon: "🔥", text: "Almost there — finalizing the last batch..." },
];

function formatElapsed(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function ExportProgress({ isActive, totalResults = 1000 }) {
  const [logs, setLogs] = useState([]);
  const [elapsed, setElapsed] = useState(0);
  const nextIndexRef = useRef(0);
  const elapsedRef = useRef(0);
  const logEndRef = useRef(null);

  // Estimate: ~1.5s per lead, minimum 2 minutes
  const estimatedMinutes = Math.max(2, Math.ceil((totalResults * 1.5) / 60));

  // Reset everything when export starts
  useEffect(() => {
    if (!isActive) return;

    nextIndexRef.current = 0;
    elapsedRef.current = 0;
    setElapsed(0);
    setLogs([{ icon: "🚀", text: "Pipeline started — initializing scraper modules...", time: "0:00" }]);
  }, [isActive]);

  // Elapsed timer — ticks every second
  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      elapsedRef.current += 1;
      setElapsed(elapsedRef.current);
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive]);

  // Add a new log message
  const addLogMessage = useCallback(() => {
    const idx = nextIndexRef.current % LOG_MESSAGES.length;
    const msg = LOG_MESSAGES[idx];
    nextIndexRef.current += 1;

    setLogs((prev) => [
      ...prev,
      { ...msg, time: formatElapsed(elapsedRef.current) },
    ]);
  }, []);

  // Log message rotation — every 15–20s
  useEffect(() => {
    if (!isActive) return;

    let timeout;

    const scheduleNext = () => {
      const delay = (Math.floor(Math.random() * 6) + 15) * 1000;
      timeout = setTimeout(() => {
        addLogMessage();
        scheduleNext();
      }, delay);
    };

    scheduleNext();

    return () => clearTimeout(timeout);
  }, [isActive, addLogMessage]);

  // Auto-scroll to bottom when new log appears
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  if (!isActive) return null;

  const remaining = Math.max(0, estimatedMinutes * 60 - elapsed);
  const remainingMin = Math.floor(remaining / 60);
  const remainingSec = remaining % 60;

  return (
    <div
      style={{
        marginTop: 24,
        borderRadius: 12,
        border: "1px solid var(--rw-border)",
        overflow: "hidden",
        animation: "rw-fadeInUp 0.4s ease-out both",
        background: "#ffffff",
      }}
    >
      {/* Header bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 20px",
          background: "linear-gradient(135deg, rgba(2, 61, 187, 0.06) 0%, rgba(48, 143, 239, 0.08) 100%)",
          borderBottom: "1px solid var(--rw-border)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#22c55e",
              animation: "rw-pulse 1.5s ease-in-out infinite",
              boxShadow: "0 0 8px rgba(34, 197, 94, 0.5)",
            }}
          />
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--rw-deep-blue)" }}>
            Pipeline Running
          </span>
        </div>
        <div style={{ display: "flex", gap: 20, fontSize: 12 }}>
          <span style={{ color: "var(--rw-text-muted)" }}>
            Elapsed:{" "}
            <strong style={{ color: "var(--rw-text)" }}>{formatElapsed(elapsed)}</strong>
          </span>
          <span style={{ color: "var(--rw-text-muted)" }}>
            Est. remaining:{" "}
            <strong style={{ color: "#d97706" }}>
              ~{remainingMin > 0 ? `${remainingMin}m ` : ""}{remainingSec}s
            </strong>
          </span>
        </div>
      </div>

      {/* Log area */}
      <div
        style={{
          maxHeight: 220,
          overflowY: "auto",
          padding: "12px 0",
          background: "linear-gradient(180deg, #f8faff 0%, #ffffff 100%)",
          fontFamily: "'Inter', sans-serif",
          fontSize: 13,
          lineHeight: 2,
        }}
      >
        {logs.map((log, i) => (
          <div
            key={`${log.time}-${i}`}
            style={{
              padding: "2px 20px",
              color: i === logs.length - 1 ? "var(--rw-text)" : "var(--rw-text-secondary)",
              fontWeight: i === logs.length - 1 ? 500 : 400,
              animation: i === logs.length - 1 ? "rw-fadeInUp 0.3s ease-out" : "none",
              display: "flex",
              gap: 10,
              alignItems: "center",
            }}
          >
            <span
              style={{
                color: "var(--rw-text-muted)",
                minWidth: 40,
                fontSize: 11,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {log.time}
            </span>
            <span>{log.icon}</span>
            <span>{log.text}</span>
          </div>
        ))}
        <div ref={logEndRef} />
      </div>

      {/* Progress shimmer bar */}
      <div
        style={{
          height: 3,
          background: "rgba(48, 143, 239, 0.08)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "40%",
            background: "linear-gradient(90deg, transparent, #308fef, #60a5fa, transparent)",
            animation: "rw-shimmer 2s ease-in-out infinite",
          }}
        />
      </div>
    </div>
  );
}
