"use client";

import SliderInput from "../inputs/SliderInput";
import SearchableDropdown from "../inputs/SearchableDropdown";
import { JOB_RECENCY_OPTIONS } from "../../lib/constants";

export default function JobsStep({ formState, updateField }) {
  return (
    <div>
      {/* ── Include Jobs Toggle ─────────────────────────────── */}
      <div className="rw-section">
        <div className="rw-section-title">Job Search</div>

        <div className="rw-field">
          <div
            className="rw-card"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 20px",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: "var(--rw-text)",
                }}
              >
                Include Jobs Data
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "var(--rw-text-muted)",
                  marginTop: 4,
                }}
              >
                Fetch and cross-reference job postings with leads
              </div>
            </div>
            <button
              type="button"
              className="rw-toggle"
              data-checked={formState.includeJobs}
              onClick={() => updateField("includeJobs", !formState.includeJobs)}
              aria-label="Include Jobs"
            />
          </div>
        </div>
      </div>

      {formState.includeJobs && (
        <>
          {/* ── Volume ──────────────────────────────────────── */}
          <div className="rw-section">
            <div className="rw-section-title">Volume</div>
            <SliderInput
              label="Jobs Rows"
              hint="Maximum jobs to fetch"
              value={formState.jobsRows}
              onChange={(val) => updateField("jobsRows", val)}
              min={10}
              max={5000}
              step={10}
            />
          </div>

          {/* ── Filters ─────────────────────────────────────── */}
          <div className="rw-section">
            <div className="rw-section-title">Job Filters</div>

            <div className="rw-field-row">
              <div className="rw-field">
                <label className="rw-label">Job Title</label>
                <input
                  type="text"
                  className="rw-input"
                  value={formState.jobsTitle}
                  onChange={(e) => updateField("jobsTitle", e.target.value)}
                  placeholder="e.g. Marketing Manager"
                />
              </div>
              <div className="rw-field">
                <label className="rw-label">Job Location</label>
                <input
                  type="text"
                  className="rw-input"
                  value={formState.jobsLocation}
                  onChange={(e) => updateField("jobsLocation", e.target.value)}
                  placeholder="e.g. United States"
                />
              </div>
            </div>

            <SearchableDropdown
              label="Job Recency"
              hint="How recent should the job posting be?"
              options={JOB_RECENCY_OPTIONS}
              value={formState.jobsPublishedAt}
              onChange={(val) => updateField("jobsPublishedAt", val)}
              placeholder="Select recency..."
            />
          </div>

          {/* ── Advanced ────────────────────────────────────── */}
          <div className="rw-section">
            <div className="rw-section-title">Advanced</div>
            <div className="rw-field">
              <div className="rw-toggle-field">
                <div>
                  <div className="rw-toggle-field-label">Fail Open Jobs</div>
                  <div className="rw-toggle-field-hint">
                    If a job query fails, continue with other results
                  </div>
                </div>
                <button
                  type="button"
                  className="rw-toggle"
                  data-checked={formState.failOpenJobs}
                  onClick={() =>
                    updateField("failOpenJobs", !formState.failOpenJobs)
                  }
                  aria-label="Fail Open Jobs"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
