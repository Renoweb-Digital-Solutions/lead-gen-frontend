"use client";

import { LockKeyhole } from "lucide-react";
import SearchableDropdown from "../inputs/SearchableDropdown";
import styles from "./B2BView.module.css";
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
    <div className={styles.locationGrid}>
      <div>
        <p className="rw-label">Country</p>
        <div className={styles.lockedCountry}>
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
      {/* # Reserve the city column before state selection so choosing a region never moves the form. */}
      <SearchableDropdown
        label="City"
        hint="Optional"
        options={[{ value: "", label: "All cities in this state" }, ...cities]}
        value={selectedState ? value.city || "" : ""}
        disabled={!selectedState}
        onChange={(city) => onChange({ stateCode: selectedState.value, city })}
        placeholder={
          selectedState ? "All cities in this state" : "Select a state first"
        }
      />
    </div>
  );
}
