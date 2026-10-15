"use client";

import { Sun, Moon } from "lucide-react";

export default function ThemeToggle({ isDark, onToggleTheme }) {
  const label = `Switch to ${isDark ? "light" : "dark"} mode`;

  return (
    <button
      type="button"
      onClick={onToggleTheme}
      aria-label={label}
      title={label}
      aria-pressed={isDark}
      className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-[var(--rw-border)] bg-[var(--rw-surface)] px-3 text-[var(--rw-bright-blue)] shadow-sm transition-colors hover:bg-[var(--rw-surface-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--rw-bright-blue)]"
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      <span className="hidden text-[13px] font-bold sm:inline">{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}
