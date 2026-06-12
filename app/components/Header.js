"use client";

import { useState, useEffect } from "react";
import { checkHealth } from "../lib/api";

/**
 * Component: Header
 *
 * WHAT IT DOES:
 * Renders the top navigation bar of the application. It includes the Renoweb logo,
 * module tabs (Lead Gen Pipeline / Google Maps) for switching between tools,
 * a real-time health status indicator for the backend API (polls every 30s),
 * and a "Clear All" button to reset the form session.
 *
 * PROPS RECEIVED:
 * - `onClearAll` (Function): Callback executed when the user clicks the "Clear All" button.
 * - `activeModule` (String): Currently active module — "leadgen" or "gmaps".
 * - `onModuleChange` (Function): Callback to switch between modules.
 *   Comes from: e:\WORK\Renoweb\lead-gen\app\components\LeadGenApp.js
 *
 * PROPS OUTGOING: None.
 */

const MODULES = [
  { id: "leadgen", label: "Lead Gen Pipeline", icon: "🎯" },
  { id: "gmaps", label: "Google Maps", icon: "🗺️" },
];

export default function Header({ onClearAll, activeModule, onModuleChange }) {
  const [health, setHealth] = useState(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Sync with DOM on mount
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    setIsDark(!isDark);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", newTheme);
  };

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
        padding: "0 28px",
        background: "var(--rw-surface)",
        borderBottom: "1px solid var(--rw-border)",
        position: "sticky",
        top: 0,
        zIndex: 40,
        backdropFilter: "blur(10px)",
        height: 57,
      }}
    >
      {/* Left: Logo + Module Tabs */}
      <div style={{ display: "flex", alignItems: "center", gap: 0, height: "100%" }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 3, marginRight: 24 }}>
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
        </div>

        {/* Divider */}
        <div
          style={{
            width: 1,
            height: 24,
            background: "var(--rw-border)",
            marginRight: 8,
          }}
        />

        {/* Module Tabs */}
        <nav style={{ display: "flex", alignItems: "center", gap: 0, height: "100%" }}>
          {MODULES.map((mod) => {
            const isActive = activeModule === mod.id;
            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => onModuleChange(mod.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "0 16px",
                  height: "100%",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: 13.5,
                  fontWeight: isActive ? 600 : 400,
                  fontFamily: "inherit",
                  color: isActive ? "var(--rw-deep-blue)" : "var(--rw-text-muted)",
                  borderBottom: isActive
                    ? "2.5px solid var(--rw-bright-blue)"
                    : "2.5px solid transparent",
                  transition: "all 0.2s ease",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = "var(--rw-text-secondary)";
                    e.currentTarget.style.borderBottomColor = "var(--rw-border)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = "var(--rw-text-muted)";
                    e.currentTarget.style.borderBottomColor = "transparent";
                  }
                }}
              >
                <span style={{ fontSize: 16 }}>{mod.icon}</span>
                {mod.label}
              </button>
            );
          })}
        </nav>
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
          <span>{health?.ok ? "API Online" : "API Offline"}</span>
        </div>

        {/* Dark Mode Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 32,
            height: 32,
            borderRadius: "50%",
            color: "var(--rw-text-secondary)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--rw-surface-hover)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? "☀️" : "🌙"}
        </button>

        {/* Clear Data button */}
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
          {activeModule === "gmaps" ? "Clear GMaps Data" : "Clear Pipeline"}
        </button>
      </div>
    </header>
  );
}
