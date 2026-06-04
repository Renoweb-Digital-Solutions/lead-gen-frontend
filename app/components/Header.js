"use client";

import { useState, useEffect } from "react";
import { checkHealth } from "../lib/api";

/**
 * Component: Header
 * 
 * WHAT IT DOES:
 * Renders the top navigation bar of the application. It includes the Renoweb logo,
 * a real-time health status indicator for the backend API (polls every 30s), 
 * and a "Clear All" button to reset the form session.
 * 
 * PROPS RECEIVED:
 * - `onClearAll` (Function): Callback executed when the user clicks the "Clear All" button.
 *   Comes from: e:\WORK\Renoweb\lead-gen\app\components\LeadGenApp.js
 * 
 * PROPS OUTGOING: None.
 */
export default function Header({ onClearAll }) {
  const [health, setHealth] = useState(null);

  useEffect(() => {
    let mounted = true;
    const check = async () => {
      try {
        const data = await checkHealth();
        if (mounted) setHealth(data);
      } catch {
        if (mounted) setHealth(null);
      }
    };
    check();
    const interval = setInterval(check, 30000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 28px",
        background: "var(--rw-surface)",
        borderBottom: "1px solid var(--rw-border)",
        position: "sticky",
        top: 0,
        zIndex: 40,
        backdropFilter: "blur(10px)",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            fontWeight: 800,
            fontSize: 22,
            letterSpacing: "-0.02em",
          }}
        >
          <span style={{ color: "var(--rw-deep-blue)" }}>RENO</span>
          <span style={{ color: "var(--rw-bright-blue)" }}>WEB</span>
        </div>
        <div
          style={{
            width: 1,
            height: 24,
            background: "var(--rw-border)",
            margin: "0 4px",
          }}
        />
        <span
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: "var(--rw-text-secondary)",
            letterSpacing: "0.02em",
          }}
        >
          Lead Gen Tool
        </span>
      </div>

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {/* Health status */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            color: "var(--rw-text-muted)",
          }}
        >
          <div
            className={`rw-status-dot ${
              health?.ok ? "rw-status-dot-online" : "rw-status-dot-offline"
            }`}
          />
          <span>{health?.ok ? `API v${health.version}` : "API Offline"}</span>
        </div>

        {/* Clear All button */}
        <button
          type="button"
          className="rw-btn rw-btn-ghost"
          onClick={onClearAll}
          style={{
            color: "var(--rw-error)",
            fontSize: 13,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M2 4H14M5 4V3C5 2.44772 5.44772 2 6 2H10C10.5523 2 11 2.44772 11 3V4M6 7V11M10 7V11M3 4L4 13C4 13.5523 4.44772 14 5 14H11C11.5523 14 12 13.5523 12 13L13 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Clear All
        </button>
      </div>
    </header>
  );
}
