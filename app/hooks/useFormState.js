"use client";

import { useCallback } from "react";
import { useSessionState } from "./useSessionState";
import { DEFAULT_FORM_STATE } from "../lib/constants";

const STORAGE_KEY = "renoweb-leadgen-form";

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
