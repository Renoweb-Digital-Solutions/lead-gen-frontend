"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Custom Hook: useSessionState
 * 
 * WHAT IT DOES: 
 * A specialized useState wrapper that synchronizes its value with the browser's sessionStorage.
 * - On initial mount, it attempts to read the value from sessionStorage so the state survives a page refresh.
 * - Whenever the state updates, it writes the new JSON stringified value back to sessionStorage.
 * - It is SSR (Server-Side Rendering) safe; if executed on the server, it immediately returns the defaultValue.
 * 
 * WHERE IT IS USED:
 * - Used directly in: e:\WORK\Renoweb\lead-gen\app\hooks\useFormState.js (to persist form configuration)
 * - Used directly in: e:\WORK\Renoweb\lead-gen\app\components\LeadGenApp.js (to persist the currently active step)
 * 
 * PROPS/ARGUMENTS:
 * - `key` (String): The unique storage key used in sessionStorage (e.g. "renoweb-leadgen-form").
 * - `defaultValue` (Any): The default state to use if nothing is found in sessionStorage.
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
