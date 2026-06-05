"use client";

import { useState, useEffect, useCallback } from "react";
import Papa from "papaparse";
import ResultsTable from "../ResultsTable";
import ExportProgress from "../ExportProgress";
import TagInput from "../inputs/TagInput";
import SliderInput from "../inputs/SliderInput";
import {
  gmapsSearch,
  gmapsGetRuns,
  gmapsGetRun,
  gmapsExportCsv,
  gmapsExportEnrichedCsv,
  downloadBlob,
} from "../../lib/api";
import { useSessionState } from "../../hooks/useSessionState";

/**
 * Component: GmapsView
 *
 * WHAT IT DOES:
 * Full-page view for the Google Maps local business search module.
 * Lets the user enter domain keywords + location, run a search via
 * the Compass Google Places actor, view results in a table,
 * load past runs, and download CSV / enriched CSV exports.
 *
 * PROPS RECEIVED:
 * - None. It manages its own state internally.
 *   Rendered from: e:\WORK\Renoweb\lead-gen\app\components\LeadGenApp.js
 *
 * PROPS OUTGOING:
 * - to <ResultsTable>: `data` -> e:\WORK\Renoweb\lead-gen\app\components\ResultsTable.js
 * - to <ExportProgress>: `isActive`, `totalResults` -> e:\WORK\Renoweb\lead-gen\app\components\ExportProgress.js
 */
export default function GmapsView() {
  // ─── Search Form State ───────────────────────────────────
  const [keywords, setKeywords] = useSessionState("gmaps-keywords", []);
  const [location, setLocation] = useSessionState("gmaps-location", "");
  const [limit, setLimit] = useSessionState("gmaps-limit", 100);

  // ─── Search State ────────────────────────────────────────
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [searchSuccess, setSearchSuccess] = useState(null);
  const [resultData, setResultData] = useSessionState("gmaps-results", null);
  const [currentRunId, setCurrentRunId] = useSessionState("gmaps-runid", null);

  // ─── Past Runs State ─────────────────────────────────────
  const [runs, setRuns] = useState([]);
  const [loadingRuns, setLoadingRuns] = useState(false);
  const [isExportingCsv, setIsExportingCsv] = useState(false);
  const [isExportingEnriched, setIsExportingEnriched] = useState(false);

  // Load past runs on mount
  useEffect(() => {
    loadRuns();
  }, []);

  const loadRuns = async () => {
    setLoadingRuns(true);
    try {
      const data = await gmapsGetRuns();
      setRuns(Array.isArray(data) ? data : []);
    } catch {
      // silently fail — runs list is non-critical
    } finally {
      setLoadingRuns(false);
    }
  };

  // ─── Search Handler ──────────────────────────────────────
  const handleSearch = async () => {
    if (keywords.length === 0) {
      setSearchError("Please add at least one keyword (e.g. 'dentist', 'plumber')");
      return;
    }
    if (!location.trim()) {
      setSearchError("Please enter a location (e.g. 'Manchester, UK')");
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    setSearchSuccess(null);
    setResultData(null);
    setCurrentRunId(null);

    try {
      const result = await gmapsSearch({ keywords, location: location.trim(), limit });

      // The backend may return results in different formats — handle arrays or objects with rows
      let rows = [];
      let runId = null;

      if (Array.isArray(result)) {
        rows = result;
      } else if (result.rows && Array.isArray(result.rows)) {
        rows = result.rows;
        runId = result.run_id || result.id || null;
      } else if (result.data && Array.isArray(result.data)) {
        rows = result.data;
        runId = result.run_id || result.id || null;
      } else if (result.run_id || result.id) {
        // Backend returned just a run_id — fetch the actual data
        runId = result.run_id || result.id;
        const runData = await gmapsGetRun(runId);
        rows = Array.isArray(runData) ? runData : (runData.rows || runData.data || []);
      }

      setResultData(rows);
      setCurrentRunId(runId);
      setSearchSuccess(`Found ${rows.length} businesses!`);

      // Refresh runs list
      loadRuns();
    } catch (err) {
      setSearchError(err.message || "Search failed. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  // ─── Load Past Run ───────────────────────────────────────
  const handleLoadRun = async (runId) => {
    setSearchError(null);
    setSearchSuccess(null);
    setResultData(null);
    setCurrentRunId(null);

    try {
      const data = await gmapsGetRun(runId);
      const rows = Array.isArray(data) ? data : (data.rows || data.data || []);
      setResultData(rows);
      setCurrentRunId(runId);
      setSearchSuccess(`Loaded ${rows.length} results from run ${runId}`);
    } catch (err) {
      setSearchError(err.message || "Failed to load run");
    }
  };

  // ─── Export Handlers ─────────────────────────────────────
  const handleExportCsv = async () => {
    if (!currentRunId) return;
    setIsExportingCsv(true);
    try {
      const result = await gmapsExportCsv(currentRunId);
      downloadBlob(result.blob, result.filename);
    } catch (err) {
      setSearchError(err.message);
    } finally {
      setIsExportingCsv(false);
    }
  };

  const handleExportEnriched = async () => {
    if (!currentRunId) return;
    setIsExportingEnriched(true);
    try {
      const result = await gmapsExportEnrichedCsv(currentRunId);
      downloadBlob(result.blob, result.filename);
    } catch (err) {
      setSearchError(err.message);
    } finally {
      setIsExportingEnriched(false);
    }
  };

  return (
    <div style={{ width: "100%", padding: "32px 40px" }}>
      {/* Page header */}
      <div style={{ marginBottom: 32, animation: "rw-fadeInUp 0.3s ease-out" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <span style={{ fontSize: 28 }}>🗺️</span>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: "var(--rw-text)",
              margin: 0,
              fontFamily: "var(--font-oswald), system-ui",
              letterSpacing: "0.01em",
            }}
          >
            Google Maps Search
          </h1>
        </div>
        <p style={{ fontSize: 14, color: "var(--rw-text-muted)", margin: 0, marginLeft: 38 }}>
          Find local businesses, analyze opportunities, and export enriched contacts
        </p>
      </div>

      {/* Alerts */}
      {searchError && (
        <div
          className="rw-animate-fade-in-up"
          style={{
            padding: "12px 16px",
            marginBottom: 20,
            background: "#fee2e2",
            border: "1px solid #fecaca",
            borderRadius: "var(--rw-radius-md)",
            color: "#991b1b",
            fontSize: 14,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span>❌</span>
          {searchError}
        </div>
      )}

      {searchSuccess && !isSearching && (
        <div
          className="rw-animate-fade-in-up"
          style={{
            padding: "12px 16px",
            marginBottom: 20,
            background: "#d1fae5",
            border: "1px solid #a7f3d0",
            borderRadius: "var(--rw-radius-md)",
            color: "#065f46",
            fontSize: 14,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span>✅</span>
          {searchSuccess}
        </div>
      )}

      {/* ── Search Form ───────────────────────────────────── */}
      <div className="rw-section">
        <div className="rw-section-title">Search Parameters</div>

        <div className="rw-field-row">
          <div className="rw-field" style={{ flex: 2 }}>
            <TagInput
              label="Business Keywords"
              hint="e.g. dentist, plumber, restaurant"
              tags={keywords}
              onChange={setKeywords}
              placeholder="Type keyword and press Enter..."
            />
          </div>
          <div className="rw-field" style={{ flex: 1 }}>
            <label className="rw-label">Location</label>
            <input
              type="text"
              className="rw-input"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Manchester, UK"
            />
          </div>
        </div>

        <SliderInput
          label="Max Results"
          hint="Maximum number of places to crawl"
          value={limit}
          onChange={setLimit}
          min={10}
          max={500}
          step={10}
        />
      </div>

      {/* ── Search Button ─────────────────────────────────── */}
      <div className="rw-section">
        <button
          type="button"
          className="rw-btn-export"
          onClick={handleSearch}
          disabled={isSearching}
        >
          {isSearching ? (
            <>
              <div className="rw-spinner" />
              <span>Searching Google Maps...</span>
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="2" />
                <path d="M14 14L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span>Search Local Businesses</span>
            </>
          )}
        </button>

        {/* Progress logs */}
        <ExportProgress isActive={isSearching} totalResults={limit} logType="gmaps" />
      </div>

      {/* ── Past Runs ─────────────────────────────────────── */}
      {runs.length > 0 && (
        <div className="rw-section">
          <div className="rw-section-title">Past Runs</div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            {runs.map((run) => {
              const runId = run.run_id || run.id || run;
              const isActive = currentRunId === runId;
              return (
                <button
                  key={runId}
                  type="button"
                  onClick={() => handleLoadRun(runId)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "var(--rw-radius-md)",
                    border: isActive
                      ? "1.5px solid var(--rw-bright-blue)"
                      : "1px solid var(--rw-border)",
                    background: isActive
                      ? "rgba(48, 143, 239, 0.08)"
                      : "var(--rw-surface)",
                    color: isActive ? "var(--rw-bright-blue)" : "var(--rw-text-secondary)",
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 400,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    fontFamily: "inherit",
                  }}
                >
                  {run.created_at
                    ? `${new Date(run.created_at).toLocaleDateString()} — ${run.total_results || "?"} results`
                    : `Run ${typeof runId === "string" ? runId.slice(0, 8) : runId}`}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Results Table ─────────────────────────────────── */}
      {resultData && resultData.length > 0 && (
        <div className="rw-section" style={{ marginTop: 8, animation: "rw-fadeInUp 0.4s ease-out both" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div className="rw-section-title" style={{ marginBottom: 0 }}>
              Results ({resultData.length} businesses)
            </div>

            {currentRunId && (
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  type="button"
                  className="rw-btn rw-btn-secondary"
                  onClick={handleExportCsv}
                  disabled={isExportingCsv}
                  style={{ padding: "8px 14px", fontSize: 13 }}
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ marginRight: 6 }}>
                    <path d="M14 11V14H2V11M8 3V11M8 11L4 7M8 11L12 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {isExportingCsv ? "Exporting..." : "CSV"}
                </button>
                <button
                  type="button"
                  className="rw-btn rw-btn-primary"
                  onClick={handleExportEnriched}
                  disabled={isExportingEnriched}
                  style={{ padding: "8px 14px", fontSize: 13 }}
                >
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ marginRight: 6 }}>
                    <path d="M14 11V14H2V11M8 3V11M8 11L4 7M8 11L12 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {isExportingEnriched ? "Exporting..." : "Enriched CSV"}
                </button>
              </div>
            )}
          </div>

          <ResultsTable data={resultData} />
        </div>
      )}
    </div>
  );
}
