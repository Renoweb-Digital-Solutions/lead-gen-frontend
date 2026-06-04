"use client";

import RadioCards from "../inputs/RadioCards";
import { EXPORT_FORMATS } from "../../lib/constants";

export default function ExportStep({
  formState,
  updateField,
  onExport,
  isExporting,
}) {
  return (
    <div>
      {/* ── Export Format ───────────────────────────────────── */}
      <div className="rw-section">
        <div className="rw-section-title">Export Format</div>
        <RadioCards
          options={EXPORT_FORMATS}
          value={formState.exportFormat}
          onChange={(val) => updateField("exportFormat", val)}
        />
      </div>

      {/* ── Output Settings ─────────────────────────────────── */}
      <div className="rw-section">
        <div className="rw-section-title">Output Settings</div>

        <div className="rw-field-row">
          <div className="rw-field">
            <label className="rw-label">Filename</label>
            <input
              type="text"
              className="rw-input"
              value={formState.filename}
              onChange={(e) => updateField("filename", e.target.value)}
              placeholder="summary.csv"
            />
          </div>
          <div className="rw-field">
            <label className="rw-label">
              Limit Items
              <span className="rw-label-hint">Optional — leave blank for all</span>
            </label>
            <input
              type="number"
              className="rw-input"
              value={formState.limitItems ?? ""}
              onChange={(e) =>
                updateField(
                  "limitItems",
                  e.target.value === "" ? null : parseInt(e.target.value, 10)
                )
              }
              placeholder="No limit"
              min={1}
            />
          </div>
        </div>
      </div>

      {/* ── Pipeline Options ────────────────────────────────── */}
      <div className="rw-section">
        <div className="rw-section-title">Pipeline Options</div>

        <div className="rw-field">
          <div className="rw-toggle-field">
            <div>
              <div className="rw-toggle-field-label">Strict Output Schema</div>
              <div className="rw-toggle-field-hint">Enforce standardized column format</div>
            </div>
            <button
              type="button"
              className="rw-toggle"
              data-checked={formState.strictOutputSchema}
              onClick={() =>
                updateField("strictOutputSchema", !formState.strictOutputSchema)
              }
              aria-label="Strict Output Schema"
            />
          </div>
        </div>

        <div className="rw-field">
          <div className="rw-toggle-field">
            <div>
              <div className="rw-toggle-field-label">Reset Progress</div>
              <div className="rw-toggle-field-hint">Start fresh instead of resuming</div>
            </div>
            <button
              type="button"
              className="rw-toggle"
              data-checked={formState.resetProgress}
              onClick={() =>
                updateField("resetProgress", !formState.resetProgress)
              }
              aria-label="Reset Progress"
            />
          </div>
        </div>

        <div className="rw-field">
          <div className="rw-toggle-field">
            <div>
              <div className="rw-toggle-field-label">Don't Save Progress</div>
              <div className="rw-toggle-field-hint">Run without saving checkpoint data</div>
            </div>
            <button
              type="button"
              className="rw-toggle"
              data-checked={formState.dontSaveProgress}
              onClick={() =>
                updateField("dontSaveProgress", !formState.dontSaveProgress)
              }
              aria-label="Don't Save Progress"
            />
          </div>
        </div>

        <div className="rw-field">
          <div className="rw-toggle-field">
            <div>
              <div className="rw-toggle-field-label">Count Only</div>
              <div className="rw-toggle-field-hint">Only return result count, no data</div>
            </div>
            <button
              type="button"
              className="rw-toggle"
              data-checked={formState.countOnly}
              onClick={() =>
                updateField("countOnly", !formState.countOnly)
              }
              aria-label="Count Only"
            />
          </div>
        </div>
      </div>

      {/* ── Generate Button ─────────────────────────────────── */}
      <div className="rw-section">
        <button
          type="button"
          className="rw-btn-export"
          onClick={onExport}
          disabled={isExporting}
        >
          {isExporting ? (
            <>
              <div className="rw-spinner" />
              <span>Generating Leads...</span>
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 3V14M10 14L6 10M10 14L14 10M3 17H17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Generate & Export Leads</span>
            </>
          )}
        </button>

        {/* Summary of what will happen */}
        <div
          style={{
            marginTop: 16,
            padding: 16,
            background: "#f8fafc",
            borderRadius: "var(--rw-radius-md)",
            border: "1px solid var(--rw-border)",
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "var(--rw-text-secondary)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: 8,
            }}
          >
            Pipeline Summary
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "8px 24px",
              fontSize: 13,
              color: "var(--rw-text-secondary)",
            }}
          >
            <div>
              <span style={{ color: "var(--rw-text-muted)" }}>Format: </span>
              <strong style={{ color: "var(--rw-text)" }}>
                {EXPORT_FORMATS.find((f) => f.id === formState.exportFormat)?.label}
              </strong>
            </div>
            <div>
              <span style={{ color: "var(--rw-text-muted)" }}>Max Leads: </span>
              <strong style={{ color: "var(--rw-text)" }}>
                {formState.totalResults.toLocaleString()}
              </strong>
            </div>
            <div>
              <span style={{ color: "var(--rw-text-muted)" }}>Include Jobs: </span>
              <strong style={{ color: "var(--rw-text)" }}>
                {formState.includeJobs ? "Yes" : "No"}
              </strong>
            </div>
            <div>
              <span style={{ color: "var(--rw-text-muted)" }}>Concurrency: </span>
              <strong style={{ color: "var(--rw-text)" }}>
                {formState.scoreConcurrency}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
