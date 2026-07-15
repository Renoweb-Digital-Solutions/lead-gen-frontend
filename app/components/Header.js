"use client";

import { useState, useEffect } from "react";
import { checkHealth } from "../lib/api";
import { Target, Map, Trash2, Activity, LogOut, Menu } from "lucide-react";
import { useAuth } from "../lib/AuthContext";
import { useRouter } from "next/navigation";

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
  { id: "leadgen", label: "Lead Gen Pipeline", icon: Target },
  { id: "gmaps", label: "Google Maps", icon: Map },
  { id: "youtube", label: "YouTube Scraper", icon: Activity },
  { id: "b2b", label: "B2B Scraper", icon: Menu }, // using existing imports for icons
];

export default function Header({ onClearAll, activeModule, onModuleChange, onToggleSidebar }) {
  const [health, setHealth] = useState(null);
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
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
    <header className="rw-header shadow-sm border-b border-brand-blue/10 bg-white/90 backdrop-blur-md">
      {/* Left: Logo + Module Tabs */}
      <div style={{ display: "flex", alignItems: "center", gap: 0, height: "100%" }}>
        {/* Hamburger (Mobile Only) */}
        <button
          className="md:hidden mr-3 text-brand-dark p-2 hover:bg-gray-100 rounded-md transition-colors"
          onClick={onToggleSidebar}
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Logo */}
        <div 
          onClick={() => router.push('/')}
          className="cursor-pointer transition-opacity hover:opacity-80"
          style={{ display: "flex", alignItems: "center", gap: 3, marginRight: 24 }}
        >
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
        <nav className="hidden md:flex items-center gap-0 h-full">
          {MODULES.map((mod) => {
            const isActive = activeModule === mod.id;
            const Icon = mod.icon;
            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => onModuleChange(mod.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "0 16px",
                  height: "100%",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: 13.5,
                  fontWeight: isActive ? 600 : 500,
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
                <Icon className={`w-4 h-4 ${isActive ? 'text-brand-bright-blue' : 'text-gray-400'}`} />
                <span className="rw-hide-mobile">{mod.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Desktop-only items */}
        <div className="hidden md:flex items-center gap-4">
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
            className={`rw-status-dot relative ${
              health?.ok ? "rw-status-dot-online shadow-[0_0_8px_rgba(16,185,129,0.6)]" : "rw-status-dot-offline shadow-[0_0_8px_rgba(239,68,68,0.6)]"
            }`}
          >
            {health?.ok ? (
              <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
            ) : (
              <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-75" />
            )}
          </div>
          <span className="font-medium">{health?.ok ? "API Online" : "API Offline"}</span>
        </div>

        {/* Clear Data button */}
        <button
          type="button"
          className="rw-btn rw-btn-ghost hover:bg-red-50"
          onClick={onClearAll}
          style={{
            color: "var(--rw-error)",
            fontSize: 13,
          }}
        >
          <Trash2 className="w-4 h-4" />
          <span className="rw-hide-mobile font-medium">
            {activeModule === "gmaps" ? "Clear GMaps Data" : 
             activeModule === "youtube" ? "Clear YouTube Data" :
             activeModule === "b2b" ? "Clear B2B Data" :
             "Clear Pipeline"}
          </span>
        </button>

        </div>

        {/* Logout button (Visible on all screens) */}
        <button
          type="button"
          className="rw-btn rw-btn-ghost hover:bg-gray-50 p-2 md:px-3 md:py-2"
          onClick={handleLogout}
          style={{
            color: "var(--rw-text-muted)",
          }}
          title="Logout"
        >
          <LogOut className="w-5 h-5 md:w-4 md:h-4 text-gray-500 hover:text-gray-700" />
          <span className="hidden md:inline font-medium text-[13px]">Logout</span>
        </button>
      </div>
    </header>
  );
}
