"use client";

import { LockKeyhole } from "lucide-react";
import SearchableDropdown from "../inputs/SearchableDropdown";
import {
  directoryCountry,
  directoryStates,
  directoryCities,
} from "../../lib/b2bLocations";

// # Reuse the app's searchable dropdowns, exposing only the directory's permitted country.
// # A state change clears the city so a previous region cannot leak into the next request.
export default function DirectoryLocationPicker({
  directory,
  value,
  onChange,
}) {
  const country = directoryCountry(directory);
  const states = directoryStates(country.isoCode);
  const selectedState = states.find((state) => state.value === value.stateCode);
  const cities = selectedState
    ? directoryCities(country.isoCode, selectedState.value)
    : [];

  return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="mb-1.5 text-[13px] font-semibold uppercase tracking-wide text-brand-dark">
          Country
        </p>
        <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-[var(--rw-surface-hover)] px-4 py-2.5 text-sm font-medium text-brand-dark">
          <span>{country.name}</span>
          <LockKeyhole
            size={14}
            className="text-[var(--rw-text-muted)]"
            aria-hidden="true"
          />
          <span className="sr-only">Country is fixed for this directory</span>
        </div>
      </div>
      <SearchableDropdown
        label="State / region"
        options={states}
        value={selectedState?.value || ""}
        onChange={(stateCode) => onChange({ stateCode, city: "" })}
        placeholder="Select a state or region"
      />
      {selectedState && (
        <SearchableDropdown
          label="City"
          hint="Optional"
          options={[
            { value: "", label: "All cities in this state" },
            ...cities,
          ]}
          value={value.city || ""}
          onChange={(city) =>
            onChange({ stateCode: selectedState.value, city })
          }
          placeholder="All cities in this state"
        />
      )}
    </div>
  );
}
