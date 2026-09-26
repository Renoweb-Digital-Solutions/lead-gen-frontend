"use client";

import { useState, useEffect } from "react";
import { checkHealth } from "../lib/api";
import { Target, Map, Trash2, Activity, LogOut, Menu, Camera, User } from "lucide-react";
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
  { id: "instagram", label: "Instagram Scraper", icon: Camera },
  { id: "b2b", label: "B2B Scraper", icon: Menu }, // using existing imports for icons
  { id: "investors", label: "Investor Data", icon: Activity },
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
          className="lg:hidden mr-3 text-brand-dark p-2 hover:bg-gray-100 rounded-md transition-colors"
          onClick={onToggleSidebar ? onToggleSidebar : undefined}
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
            <span style={{ color: "var(--rw-deep-blue)" }}>SIMPLE</span>
            <span style={{ color: "var(--rw-bright-blue)" }}>ADS</span>
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

        {/* Module Tabs (Dropdown) */}
        <div className="hidden lg:flex relative items-center h-full group">
          {/* Active Module Trigger */}
          <div className="flex items-center gap-2 px-4 h-full cursor-pointer text-brand-dark font-semibold border-b-[2.5px] border-brand-bright-blue transition-colors hover:text-brand-bright-blue">
            {(() => {
              const activeModuleObj = MODULES.find(m => m.id === activeModule) || MODULES[0];
              const ActiveIcon = activeModuleObj.icon;
              return (
                <>
                  <ActiveIcon className="w-4 h-4 text-brand-bright-blue" />
                  <span>{activeModuleObj.label}</span>
                </>
              );
            })()}
            <svg className="w-4 h-4 text-gray-400 group-hover:rotate-180 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* Dropdown Menu */}
          <div className="absolute top-[calc(100%-1px)] left-0 mt-0 w-56 bg-white border border-gray-100 rounded-b-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
            {MODULES.map((mod) => {
              const Icon = mod.icon;
              const isActive = activeModule === mod.id;
              return (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => {
                    if (onModuleChange) onModuleChange(mod.id);
                    else router.push('/');
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 ${isActive ? 'bg-blue-50/50 text-[#023dbb] font-semibold' : 'text-gray-600'}`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#308fef]' : 'text-gray-400'}`} />
                  <span className="text-[13.5px]">{mod.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 lg:gap-4">
        {/* Desktop-only items */}
        <div className="hidden lg:flex items-center gap-4">
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
        {onClearAll && (
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
               activeModule === "instagram" ? "Clear Instagram Data" :
               activeModule === "b2b" ? "Clear B2B Data" :
               activeModule === "investors" ? "Clear Investor Data" :
               "Clear Pipeline"}
            </span>
          </button>
        )}

        </div>

        {/* Profile button */}
        <button
          type="button"
          className="rw-btn rw-btn-ghost hover:bg-blue-50 p-2 lg:px-3 lg:py-2"
          onClick={() => router.push('/profile')}
          style={{
            color: "var(--rw-text-muted)",
          }}
          title="Profile"
        >
          <User className="w-5 h-5 lg:w-4 lg:h-4 text-[#023dbb] hover:text-[#308fef]" />
          <span className="hidden lg:inline font-bold text-[13px] text-[#023dbb]">Profile</span>
        </button>

        {/* Logout button (Visible on all screens) */}
        <button
          type="button"
          className="rw-btn rw-btn-ghost hover:bg-gray-50 p-2 lg:px-3 lg:py-2"
          onClick={handleLogout}
          style={{
            color: "var(--rw-text-muted)",
          }}
          title="Logout"
        >
          <LogOut className="w-5 h-5 lg:w-4 lg:h-4 text-gray-500 hover:text-gray-700" />
          <span className="hidden lg:inline font-medium text-[13px]">Logout</span>
        </button>
      </div>
    </header>
  );
}
