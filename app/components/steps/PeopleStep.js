"use client";

import SliderInput from "../inputs/SliderInput";
import MultiSelect from "../inputs/MultiSelect";
import TagInput from "../inputs/TagInput";
import ToggleGroup from "../inputs/ToggleGroup";
import ChipSelect from "../inputs/ChipSelect";
import SearchableDropdown from "../inputs/SearchableDropdown";
import {
  EMAIL_STATUS_OPTIONS,
  BOOLEAN_OPTIONS,
  ROLE_MATCH_MODES,
  SENIORITY_OPTIONS,
  PERSON_FUNCTIONS,
  PERSON_TITLES,
  COUNTRIES,
} from "../../lib/constants";

export default function PeopleStep({ formState, updateField }) {
  return (
    <div>
      {/* ── Results ─────────────────────────────────────────── */}
      <div className="rw-section">
        <div className="rw-section-title">Search Volume</div>
        <SliderInput
          label="Total Results"
          hint="Maximum leads to fetch"
          value={formState.totalResults}
          onChange={(val) => updateField("totalResults", val)}
          min={10}
          max={5000}
          step={10}
        />
      </div>

      {/* ── Contact Filters ─────────────────────────────────── */}
      <div className="rw-section">
        <div className="rw-section-title">Contact Filters</div>

        <div className="rw-field-row-3">
          <SearchableDropdown
            label="Email Status"
            options={EMAIL_STATUS_OPTIONS}
            value={formState.emailStatus}
            onChange={(val) => updateField("emailStatus", val)}
            placeholder="Any"
          />
          <ToggleGroup
            label="Has Email"
            options={BOOLEAN_OPTIONS}
            value={formState.hasEmail}
            onChange={(val) => updateField("hasEmail", val)}
          />
          <ToggleGroup
            label="Has Phone"
            options={BOOLEAN_OPTIONS}
            value={formState.hasPhone}
            onChange={(val) => updateField("hasPhone", val)}
          />
        </div>
      </div>

      {/* ── Titles & Roles ──────────────────────────────────── */}
      <div className="rw-section">
        <div className="rw-section-title">Titles & Roles</div>

        <MultiSelect
          label="Person Titles"
          hint="Primary titles to target"
          options={PERSON_TITLES}
          selected={formState.personTitleIncludes}
          onChange={(val) => updateField("personTitleIncludes", val)}
          placeholder="Search and select titles..."
        />

        <TagInput
          label="Extra Titles"
          hint="Custom titles not in the list"
          tags={formState.personTitleExtraIncludes}
          onChange={(val) => updateField("personTitleExtraIncludes", val)}
          placeholder="Type a title and press Enter..."
        />

        <div className="rw-field-row">
          <div className="rw-field">
            <div className="rw-toggle-field">
              <div>
                <div className="rw-toggle-field-label">Include Similar Titles</div>
                <div className="rw-toggle-field-hint">Broaden search with related titles</div>
              </div>
              <button
                type="button"
                className="rw-toggle"
                data-checked={formState.includeSimilarTitles}
                onClick={() =>
                  updateField("includeSimilarTitles", !formState.includeSimilarTitles)
                }
                aria-label="Include Similar Titles"
              />
            </div>
          </div>

          <div className="rw-field">
            <div className="rw-toggle-field">
              <div>
                <div className="rw-toggle-field-label">Include Title Variants</div>
                <div className="rw-toggle-field-hint">Match different spellings</div>
              </div>
              <button
                type="button"
                className="rw-toggle"
                data-checked={formState.includeTitleVariants}
                onClick={() =>
                  updateField("includeTitleVariants", !formState.includeTitleVariants)
                }
                aria-label="Include Title Variants"
              />
            </div>
          </div>
        </div>

        <ToggleGroup
          label="Role Match Mode"
          hint="Match any or all roles"
          options={ROLE_MATCH_MODES}
          value={formState.roleMatchMode}
          onChange={(val) => updateField("roleMatchMode", val)}
        />
      </div>

      {/* ── Seniority ───────────────────────────────────────── */}
      <div className="rw-section">
        <div className="rw-section-title">Seniority Level</div>
        <ChipSelect
          options={SENIORITY_OPTIONS}
          selected={formState.seniorityIncludes}
          onChange={(val) => updateField("seniorityIncludes", val)}
        />
      </div>

      {/* ── Functions ───────────────────────────────────────── */}
      <div className="rw-section">
        <div className="rw-section-title">Functions</div>
        <MultiSelect
          label="Person Functions"
          hint="Department / functional area"
          options={PERSON_FUNCTIONS}
          selected={formState.personFunctionIncludes}
          onChange={(val) => updateField("personFunctionIncludes", val)}
          placeholder="Select departments..."
        />
      </div>

      {/* ── Location ────────────────────────────────────────── */}
      <div className="rw-section">
        <div className="rw-section-title">Person Location</div>
        <div className="rw-field-row-3">
          <MultiSelect
            label="Country"
            options={COUNTRIES}
            selected={formState.personLocationCountryIncludes}
            onChange={(val) => updateField("personLocationCountryIncludes", val)}
            placeholder="Select countries..."
          />
          <TagInput
            label="State / Region"
            tags={formState.personLocationStateIncludes}
            onChange={(val) => updateField("personLocationStateIncludes", val)}
            placeholder="e.g. California"
          />
          <TagInput
            label="City"
            tags={formState.personLocationCityIncludes}
            onChange={(val) => updateField("personLocationCityIncludes", val)}
            placeholder="e.g. Los Angeles"
          />
        </div>
      </div>
    </div>
  );
}
