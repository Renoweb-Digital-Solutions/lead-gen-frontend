"use client";

import MultiSelect from "../inputs/MultiSelect";
import TagInput from "../inputs/TagInput";
import ToggleGroup from "../inputs/ToggleGroup";
import ChipSelect from "../inputs/ChipSelect";
import {
  COMPANY_NAME_MATCH_MODES,
  COMPANY_MATCH_MODES,
  COMPANY_DOMAIN_MATCH_MODES,
  COMPANY_KEYWORD_MODES,
  COMPANY_SIZES,
  COMPANY_INDUSTRIES,
  COUNTRIES,
} from "../../lib/constants";

export default function CompanyStep({ formState, updateField }) {
  return (
    <div>
      {/* ── Company Identity ────────────────────────────────── */}
      <div className="rw-section">
        <div className="rw-section-title">Company Identity</div>

        <TagInput
          label="Company Names"
          hint="Target specific companies"
          tags={formState.companyNameIncludes}
          onChange={(val) => updateField("companyNameIncludes", val)}
          placeholder="e.g. Google, Microsoft..."
        />

        <div className="rw-field-row">
          <ToggleGroup
            label="Name Match Mode"
            options={COMPANY_NAME_MATCH_MODES}
            value={formState.companyNameMatchMode}
            onChange={(val) => updateField("companyNameMatchMode", val)}
          />
          <ToggleGroup
            label="Company Match Mode"
            options={COMPANY_MATCH_MODES}
            value={formState.companyMatchMode}
            onChange={(val) => updateField("companyMatchMode", val)}
          />
        </div>
      </div>

      {/* ── Company Domain ──────────────────────────────────── */}
      <div className="rw-section">
        <div className="rw-section-title">Domain</div>

        <TagInput
          label="Company Domains"
          hint="Filter by website domain"
          tags={formState.companyDomainIncludes}
          onChange={(val) => updateField("companyDomainIncludes", val)}
          placeholder="e.g. google.com..."
        />

        <ToggleGroup
          label="Domain Match Mode"
          options={COMPANY_DOMAIN_MATCH_MODES}
          value={formState.companyDomainMatchMode}
          onChange={(val) => updateField("companyDomainMatchMode", val)}
        />
      </div>

      {/* ── Company Size ────────────────────────────────────── */}
      <div className="rw-section">
        <div className="rw-section-title">Company Size</div>
        <ChipSelect
          label="Employee Count"
          hint="Select one or more ranges"
          options={COMPANY_SIZES}
          selected={formState.companyEmployeeSizeIncludes}
          onChange={(val) => updateField("companyEmployeeSizeIncludes", val)}
        />
      </div>

      {/* ── Industry ────────────────────────────────────────── */}
      <div className="rw-section">
        <div className="rw-section-title">Industry</div>
        <MultiSelect
          label="Company Industry"
          options={COMPANY_INDUSTRIES}
          selected={formState.companyIndustryIncludes}
          onChange={(val) => updateField("companyIndustryIncludes", val)}
          placeholder="Select industries..."
        />
      </div>

      {/* ── Keywords ────────────────────────────────────────── */}
      <div className="rw-section">
        <div className="rw-section-title">Keywords</div>

        <TagInput
          label="Company Keywords"
          hint="Industry or tech keywords"
          tags={formState.companyKeywordIncludes}
          onChange={(val) => updateField("companyKeywordIncludes", val)}
          placeholder="e.g. SaaS, AI, B2B..."
        />

        <ToggleGroup
          label="Keyword Match Mode"
          options={COMPANY_KEYWORD_MODES}
          value={formState.companyKeywordMode}
          onChange={(val) => updateField("companyKeywordMode", val)}
        />
      </div>

      {/* ── Location ────────────────────────────────────────── */}
      <div className="rw-section">
        <div className="rw-section-title">Company Location</div>
        <div className="rw-field-row-3">
          <MultiSelect
            label="Country"
            options={COUNTRIES}
            selected={formState.companyLocationCountryIncludes}
            onChange={(val) => updateField("companyLocationCountryIncludes", val)}
            placeholder="Select countries..."
          />
          <TagInput
            label="State / Region"
            tags={formState.companyLocationStateIncludes}
            onChange={(val) => updateField("companyLocationStateIncludes", val)}
            placeholder="e.g. California"
          />
          <TagInput
            label="City"
            tags={formState.companyLocationCityIncludes}
            onChange={(val) => updateField("companyLocationCityIncludes", val)}
            placeholder="e.g. San Francisco"
          />
        </div>
      </div>
    </div>
  );
}
