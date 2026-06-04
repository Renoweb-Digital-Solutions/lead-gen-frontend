"use client";

import SliderInput from "../inputs/SliderInput";
import MultiSelect from "../inputs/MultiSelect";
import { SCORING_ROLES } from "../../lib/constants";

export default function ScoringStep({ formState, updateField }) {
  return (
    <div>
      {/* ── Company Context ─────────────────────────────────── */}
      <div className="rw-section">
        <div className="rw-section-title">Company Context</div>

        <div className="rw-field">
          <label className="rw-label">
            Company Description
            <span className="rw-label-hint">
              Describe your company to improve scoring relevance
            </span>
          </label>
          <textarea
            className="rw-input rw-textarea"
            value={formState.companyDescription}
            onChange={(e) => updateField("companyDescription", e.target.value)}
            placeholder="e.g. We are a SaaS company providing digital marketing solutions for small businesses..."
            rows={4}
          />
        </div>
      </div>

      {/* ── Designations ────────────────────────────────────── */}
      <div className="rw-section">
        <div className="rw-section-title">Relevant Designations</div>

        <MultiSelect
          label="Target Roles"
          hint="Roles you're looking to sell to or recruit"
          options={SCORING_ROLES}
          selected={formState.relevantDesignations}
          onChange={(val) => updateField("relevantDesignations", val)}
          placeholder="Select target roles..."
        />

        {/* Info card */}
        <div
          className="rw-card"
          style={{
            marginTop: 16,
            background: "linear-gradient(135deg, rgba(48, 143, 239, 0.04), rgba(78, 200, 239, 0.04))",
            border: "1px solid rgba(48, 143, 239, 0.12)",
            padding: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
            }}
          >
            <span style={{ fontSize: 18, flexShrink: 0 }}>💡</span>
            <div style={{ fontSize: 13, color: "var(--rw-text-secondary)", lineHeight: 1.6 }}>
              <strong>How scoring works:</strong> Each lead's job title is compared
              against your selected designations for relevance. Job postings are
              scored for urgency based on their language and recency. Higher scores
              indicate stronger matches.
            </div>
          </div>
        </div>
      </div>

      {/* ── Concurrency ─────────────────────────────────────── */}
      <div className="rw-section">
        <div className="rw-section-title">Performance</div>
        <SliderInput
          label="Score Concurrency"
          hint="Parallel scoring threads"
          value={formState.scoreConcurrency}
          onChange={(val) => updateField("scoreConcurrency", val)}
          min={1}
          max={16}
          step={1}
        />
      </div>
    </div>
  );
}
