"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * useState wrapper that persists to sessionStorage.
 * - Hydrates from sessionStorage on mount (client-only)
 * - Writes to sessionStorage on every state change
 * - SSR-safe: returns defaultValue during server render
 */
export function useSessionState(key, defaultValue) {
  const [state, setState] = useState(() => {
    if (typeof window === "undefined") return defaultValue;
    try {
      const stored = sessionStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  // Sync state → sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(key, JSON.stringify(state));
    } catch {
      // sessionStorage full or unavailable — ignore
    }
  }, [key, state]);

  const clearState = useCallback(() => {
    sessionStorage.removeItem(key);
    setState(defaultValue);
  }, [key, defaultValue]);

  return [state, setState, clearState];
}
