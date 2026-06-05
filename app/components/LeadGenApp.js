"use client";

import { useState, useRef } from "react";
import Papa from "papaparse";
import Header from "./Header";
import Sidebar from "./Sidebar";
import GmapsView from "./gmaps/GmapsView";
import Modal from "./Modal";
import PeopleStep from "./steps/PeopleStep";
import CompanyStep from "./steps/CompanyStep";
import JobsStep from "./steps/JobsStep";
import ScoringStep from "./steps/ScoringStep";
import ExportStep from "./steps/ExportStep";
import { useFormState } from "../hooks/useFormState";
import { useSessionState } from "../hooks/useSessionState";
import { exportLeads, downloadBlob } from "../lib/api";
import { STEPS } from "../lib/constants";

/**
 * Component: LeadGenApp
 * 
 * WHAT IT DOES:
 * This is the main orchestrator component for the entire Lead Generation UI. 
 * It manages the multi-step wizard logic, tracks the active step, and holds the layout 
 * shell (Header, Sidebar, Main Content area). It serves as the bridge connecting the UI 
 * to the `useFormState` custom hook, passing down updater functions to individual step components.
 * 
 * PROPS RECEIVED:
 * - None (It acts as a top-level route component rendered by page.js)
 * 
 * PROPS OUTGOING (to children):
 * - to <Header>: `onClearAll` (function to show clear modal) -> e:\WORK\Renoweb\lead-gen\app\components\Header.js
 * - to <Sidebar>: `activeStep` (number), `onStepChange` (function) -> e:\WORK\Renoweb\lead-gen\app\components\Sidebar.js
 * - to Step Components (<PeopleStep>, <CompanyStep>, etc.): `formState` (object), `updateField` (function), `updateFields` (function) -> e:\WORK\Renoweb\lead-gen\app\components\steps\*.js
 * - to <ExportStep>: additionally `onExport` (function) and `isExporting` (boolean) -> e:\WORK\Renoweb\lead-gen\app\components\steps\ExportStep.js
 * - to <Modal>: `isOpen` (boolean), `onClose` (function), `onConfirm` (function), etc. -> e:\WORK\Renoweb\lead-gen\app\components\Modal.js
 */
export default function LeadGenApp() {
  const { formState, updateField, updateFields, clearAll } = useFormState();
  const [activeStep, setActiveStep] = useSessionState("renoweb-active-step", 0);
  const [activeModule, setActiveModule] = useSessionState("renoweb-active-module", "leadgen");
  const [showClearModal, setShowClearModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState(null);
  const [exportSuccess, setExportSuccess] = useState(null);
  const [exportData, setExportData] = useState(null);
  const [exportResultFile, setExportResultFile] = useState(null);
  const [direction, setDirection] = useState("forward");
  const contentRef = useRef(null);

  const goToStep = (index) => {
    setDirection(index > activeStep ? "forward" : "backward");
    setActiveStep(index);
    setExportError(null);
    setExportSuccess(null);
    setExportData(null);
    setExportResultFile(null);
    // Scroll to top of content area
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const nextStep = () => {
    if (activeStep < STEPS.length - 1) goToStep(activeStep + 1);
  };

  const prevStep = () => {
    if (activeStep > 0) goToStep(activeStep - 1);
  };

  const handleClearAll = () => {
    if (activeModule === "gmaps") {
      sessionStorage.removeItem("gmaps-keywords");
      sessionStorage.removeItem("gmaps-location");
      sessionStorage.removeItem("gmaps-limit");
      sessionStorage.removeItem("gmaps-results");
      sessionStorage.removeItem("gmaps-runid");
      window.location.reload();
      return;
    }

    clearAll();
    setActiveStep(0);
    setShowClearModal(false);
    setExportError(null);
    setExportSuccess(null);
    setExportData(null);
    setExportResultFile(null);
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportError(null);
    setExportSuccess(null);
    setExportData(null);
    setExportResultFile(null);

    try {
      const result = await exportLeads(formState);
      
      // Store the file details for manual download
      setExportResultFile({ blob: result.blob, filename: result.filename });
      
      if (result.type === "csv") {
        // Parse CSV to show in table
        const text = await result.blob.text();
        Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          complete: (parsedResult) => {
            setExportData(parsedResult.data);
            setExportSuccess(`Successfully generated ${parsedResult.data.length} records!`);
          },
          error: (error) => {
            setExportError("Failed to parse results for preview.");
            setExportSuccess(`Successfully generated ${result.filename}!`);
          }
        });
      } else {
        // For ZIP or other formats
        setExportSuccess(`Successfully generated ${result.filename}! (Preview not available for bundles)`);
      }
    } catch (err) {
      setExportError(err.message || "Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const renderStep = () => {
    const props = { formState, updateField, updateFields };

    switch (activeStep) {
      case 0:
        return <PeopleStep {...props} />;
      case 1:
        return <CompanyStep {...props} />;
      case 2:
        return <JobsStep {...props} />;
      case 3:
        return <ScoringStep {...props} />;
      case 4:
        return (
          <ExportStep
            {...props}
            onExport={handleExport}
            isExporting={isExporting}
            exportData={exportData}
            exportResultFile={exportResultFile}
            onDownload={() => downloadBlob(exportResultFile.blob, exportResultFile.filename)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header
        onClearAll={() => setShowClearModal(true)}
        activeModule={activeModule}
        onModuleChange={setActiveModule}
      />

      {/* ── Google Maps Module ─────────────────────────── */}
      <div style={{ display: activeModule === "gmaps" ? "block" : "none", flex: 1, overflowY: "auto", maxHeight: "calc(100vh - 57px)" }}>
        <GmapsView />
      </div>

      {/* ── Lead Gen Pipeline ───────────────────────────── */}
      <div style={{ display: activeModule === "leadgen" ? "flex" : "none", flex: 1 }}>
        <Sidebar
          activeStep={activeStep}
          onStepChange={goToStep}
        />

        {/* Main content area */}
        <main
          ref={contentRef}
          style={{
            flex: 1,
            padding: "32px 40px",
            maxHeight: "calc(100vh - 57px)",
            overflowY: "auto",
          }}
        >
          {/* Step header */}
          <div
            style={{
              marginBottom: 28,
              animation: "rw-fadeInUp 0.3s ease-out",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 4,
              }}
            >
              <span style={{ fontSize: 28 }}>{STEPS[activeStep].icon}</span>
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
                {STEPS[activeStep].label}
              </h1>
            </div>
            <p
              style={{
                fontSize: 14,
                color: "var(--rw-text-muted)",
                margin: 0,
                marginLeft: 38,
              }}
            >
              {STEPS[activeStep].description}
            </p>
          </div>

          {/* Alerts */}
          {exportError && (
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
              {exportError}
            </div>
          )}

          {exportSuccess && (
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
              {exportSuccess}
            </div>
          )}

          {/* Step content */}
          <div
            key={activeStep}
            className={
              direction === "forward" ? "rw-step-enter" : "rw-step-enter-reverse"
            }
            style={{ position: "relative", zIndex: 10 }}
          >
            {renderStep()}
          </div>

          {/* Navigation buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 32,
              paddingTop: 20,
              borderTop: "1px solid var(--rw-border)",
            }}
          >
            <button
              type="button"
              className="rw-btn rw-btn-secondary"
              onClick={prevStep}
              disabled={activeStep === 0}
              style={{
                opacity: activeStep === 0 ? 0.4 : 1,
                cursor: activeStep === 0 ? "not-allowed" : "pointer",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M10 12L6 8L10 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Back
            </button>

            {/* Step indicators */}
            <div style={{ display: "flex", gap: 6 }}>
              {STEPS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goToStep(i)}
                  style={{
                    width: i === activeStep ? 24 : 8,
                    height: 8,
                    borderRadius: "var(--rw-radius-full)",
                    border: "none",
                    background:
                      i === activeStep
                        ? "var(--rw-bright-blue)"
                        : "var(--rw-border)",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    padding: 0,
                  }}
                  aria-label={`Go to step ${i + 1}`}
                />
              ))}
            </div>

            {activeStep < STEPS.length - 1 ? (
              <button
                type="button"
                className="rw-btn rw-btn-primary"
                onClick={nextStep}
              >
                Next Step
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M6 4L10 8L6 12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            ) : (
              <div style={{ width: 120 }} />
            )}
          </div>
        </main>
      </div>

      {/* Clear Confirmation Modal */}
      <Modal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={handleClearAll}
        title={activeModule === "gmaps" ? "Clear GMaps Data?" : "Clear All Data?"}
        description={
          activeModule === "gmaps"
            ? "This will reset your GMaps search parameters and clear current results. Your past runs will remain unaffected."
            : "This will reset all form fields to their defaults and remove all saved progress for this session. This action cannot be undone."
        }
      />
    </div>
  );
}
