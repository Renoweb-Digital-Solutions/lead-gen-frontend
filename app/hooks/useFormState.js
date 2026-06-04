"use client";

import { useCallback } from "react";
import { useSessionState } from "./useSessionState";
import { DEFAULT_FORM_STATE } from "../lib/constants";

const STORAGE_KEY = "renoweb-leadgen-form";

/**
 * Custom Hook: useFormState
 * 
 * WHAT IT DOES:
 * Acts as the centralized state manager for the entire lead generation form.
 * It wraps `useSessionState` to ensure all form configurations are persisted
 * across browser refreshes and provides helper methods to update individual 
 * fields or clear the entire form state.
 * 
 * WHERE IT IS USED:
 * - Used directly in: e:\WORK\Renoweb\lead-gen\app\components\LeadGenApp.js
 * 
 * STATE EXPORTED:
 * - `formState`: Object containing all current form field values.
 * - `updateField`: Function(field, value) to update a single form field.
 * - `updateFields`: Function(updates) to apply multiple field updates at once.
 * - `clearAll`: Function() to wipe all form state back to defaults and clear storage.
 */
export function useFormState() {
  const [formState, setFormState, clearState] = useSessionState(
    STORAGE_KEY,
    DEFAULT_FORM_STATE
  );

  /** Update a single field */
  const updateField = useCallback(
    (field, value) => {
      setFormState((prev) => ({ ...prev, [field]: value }));
    },
    [setFormState]
  );

  /** Update multiple fields at once */
  const updateFields = useCallback(
    (updates) => {
      setFormState((prev) => ({ ...prev, ...updates }));
    },
    [setFormState]
  );

  /** Reset everything to defaults and clear storage */
  const clearAll = useCallback(() => {
    clearState();
  }, [clearState]);

  return {
    formState,
    updateField,
    updateFields,
    clearAll,
  };
}
