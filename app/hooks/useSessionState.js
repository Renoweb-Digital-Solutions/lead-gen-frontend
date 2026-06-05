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
  const [state, setState] = useState(defaultValue);
  const [isHydrated, setIsHydrated] = useState(false);

  // Read from storage on mount (after initial render to prevent hydration mismatch)
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(key);
      if (stored !== null) {
        setState(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
    setIsHydrated(true);
  }, [key]);

  // Sync state → sessionStorage
  useEffect(() => {
    // Only sync after hydration is complete to prevent overwriting stored values with defaultValue
    if (!isHydrated) return;
    
    try {
      sessionStorage.setItem(key, JSON.stringify(state));
    } catch {
      // sessionStorage full or unavailable — ignore
    }
  }, [key, state, isHydrated]);

  const clearState = useCallback(() => {
    sessionStorage.removeItem(key);
    setState(defaultValue);
  }, [key, defaultValue]);

  // Before hydration, we return the server-rendered default value.
  return [state, setState, clearState];
}
