"use client";

import { useState, useRef } from "react";
import Papa from "papaparse";
import Header from "./Header";
import Sidebar from "./Sidebar";
import GmapsView from "./gmaps/GmapsView";
import YoutubeView from "./youtube/YoutubeView";
import InstagramView from "./instagram/InstagramView";
import B2BView from "./b2b/B2BView";
import Modal from "./Modal";
import PeopleStep from "./steps/PeopleStep";
import CompanyStep from "./steps/CompanyStep";
import JobsStep from "./steps/JobsStep";
import ScoringStep from "./steps/ScoringStep";
import ExportStep from "./steps/ExportStep";
import LiveContextSidebar from "./LiveContextSidebar";
import { useFormState } from "../hooks/useFormState";
import { AnimatePresence, motion } from "framer-motion";
import { Users, Building2, Briefcase, Zap, Rocket } from "lucide-react";

const ICON_MAP = {
  Users: <Users className="w-8 h-8 text-brand-blue" />,
  Building2: <Building2 className="w-8 h-8 text-brand-blue" />,
  Briefcase: <Briefcase className="w-8 h-8 text-brand-blue" />,
  Zap: <Zap className="w-8 h-8 text-brand-blue" />,
  Rocket: <Rocket className="w-8 h-8 text-brand-blue" />,
};
import { useSessionState } from "../hooks/useSessionState";
import { startPipelineJob, downloadBlob } from "../lib/api";
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
  const [exportResults, setExportResults] = useState({});
  const [direction, setDirection] = useState("forward");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const contentRef = useRef(null);
  const wsRef = useRef(null);

  const handleCancelExport = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "cancel" }));
      setIsExporting(false);
    }
  };

  const goToStep = (index) => {
    setDirection(index > activeStep ? "forward" : "backward");
    setActiveStep(index);
    setSidebarOpen(false); // Close sidebar on mobile when navigating
    // State is intentionally persisted when navigating between steps
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

    if (activeModule === "youtube") {
      sessionStorage.removeItem("youtube-keywords");
      sessionStorage.removeItem("youtube-max-channels");
      sessionStorage.removeItem("youtube-min-subs");
      sessionStorage.removeItem("youtube-results");
      window.location.reload();
      return;
    }

    if (activeModule === "instagram") {
      sessionStorage.removeItem("instagram-source-type");
      sessionStorage.removeItem("instagram-target");
      sessionStorage.removeItem("instagram-max-items");
      sessionStorage.removeItem("instagram-results");
      window.location.reload();
      return;
    }

    if (activeModule === "b2b") {
      sessionStorage.removeItem("b2b-directory");
      sessionStorage.removeItem("b2b-keywords");
      sessionStorage.removeItem("b2b-location");
      sessionStorage.removeItem("b2b-max-results");
      sessionStorage.removeItem("b2b-results");
      window.location.reload();
      return;
    }

    clearAll();
    setActiveStep(0);
    setShowClearModal(false);
    setExportResults({});
  };

  const handleExport = async () => {
    setIsExporting(true);
    const format = formState.exportFormat;
    
    setExportResults(prev => ({
      ...prev,
      [format]: {
        ...prev[format],
        error: null,
        success: null,
        data: null,
        file: null,
        progress: { percent: 0, message: "Initializing...", status: "running" }
      }
    }));

    try {
      const jobData = await startPipelineJob(formState);
      const wsAbsoluteUrl = jobData.ws_url.startsWith('ws') 
        ? jobData.ws_url 
        : `${process.env.NEXT_PUBLIC_API_URL.replace('http', 'ws')}${jobData.ws_url}`;
      
      const ws = new WebSocket(wsAbsoluteUrl);
      
      // Store the ws connection to allow cancellation
      wsRef.current = ws;

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          
          setExportResults(prev => {
            const current = prev[format] || {};
            return {
              ...prev,
              [format]: {
                ...current,
                progress: { 
                  percent: msg.percent || current.progress?.percent || 0, 
                  message: msg.message || current.progress?.message || "Running...", 
                  status: msg.status || current.progress?.status || "running" 
                }
              }
            };
          });

          if (msg.status === "completed") {
            ws.close();
            
            let parsedData = msg.data || msg.result || msg.results || null;
            let resultFile = null;

            const completeExport = () => {
              setExportResults(prev => ({
                ...prev,
                [format]: {
                  ...prev[format],
                  success: `Successfully completed pipeline! Downloads ready.`,
                  error: null,
                  data: parsedData,
                  file: resultFile
                }
              }));
              setIsExporting(false);
            };

            if (!parsedData && jobData.downloads && Object.keys(jobData.downloads).length > 0) {
              // Find the URL that matches the selected format, fallback to finding by string include
              const urlPaths = Object.values(jobData.downloads);
              const fileUrlPath = jobData.downloads[format] || urlPaths.find(url => url.includes(format)) || urlPaths[0];
              const fileUrl = `${process.env.NEXT_PUBLIC_API_URL}${fileUrlPath}`;
              
              fetch(fileUrl, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("renoweb_jwt")}` }
              })
              .then(res => res.blob())
              .then(blob => {
                const ext = format === "bundle" ? ".zip" : ".csv";
                let finalName = formState.filename || `${format}${ext}`;
                if (!finalName.endsWith(ext)) {
                  // Replace any incorrect extension with the correct one
                  finalName = finalName.replace(/\.[^/.]+$/, "") + ext;
                }
                resultFile = { blob, filename: finalName };
                
                if (format !== "bundle") {
                  return blob.text().then(text => {
                    Papa.parse(text, {
                      header: true,
                      skipEmptyLines: true,
                      complete: (results) => {
                        parsedData = results.data;
                        completeExport();
                      },
                      error: () => {
                        completeExport();
                      }
                    });
                  });
                } else {
                  completeExport();
                }
              })
              .catch(err => {
                console.error("Failed to fetch export file:", err);
                completeExport();
              });
            } else {
              completeExport();
            }
          } else if (msg.status === "failed") {
            ws.close();
            setExportResults(prev => ({
              ...prev,
              [format]: {
                ...prev[format],
                error: msg.error || "Pipeline failed.",
                success: null
              }
            }));
            setIsExporting(false);
          }
        } catch (e) {
          console.error("Failed to parse WS message", e);
        }
      };

      ws.onerror = (error) => {
        setExportResults(prev => ({
          ...prev,
          [format]: {
            ...prev[format],
            error: "WebSocket error occurred.",
          }
        }));
        setIsExporting(false);
      };

      ws.onclose = () => {
        setIsExporting(false);
      };
      
    } catch (err) {
      console.error("Pipeline error in handleExport:", err);
      setExportResults(prev => ({
        ...prev,
        [format]: {
          ...prev[format],
          error: err.message || "Pipeline failed to start.",
          success: null
        }
      }));
      setIsExporting(false);
    }
  };

  const currentFormat = formState.exportFormat;
  const currentExportState = exportResults[currentFormat] || {};

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
            exportData={currentExportState.data || null}
            exportResultFile={currentExportState.file || null}
            progressState={currentExportState.progress}
            onCancel={handleCancelExport}
            onDownload={() => {
              if (currentExportState.file) {
                downloadBlob(currentExportState.file.blob, currentExportState.file.filename);
              }
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="rw-app-container">
      <Header
        onClearAll={() => setShowClearModal(true)}
        activeModule={activeModule}
        onModuleChange={setActiveModule}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* ── Google Maps Module ─────────────────────────── */}
      <div className="rw-main-layout" style={{ display: activeModule === "gmaps" ? "flex" : "none" }}>
        {/* Render sidebar for mobile only in GMaps view so the hamburger menu works */}
        <div className="md:hidden block">
          <Sidebar
            activeStep={0}
            onStepChange={()=>{}}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            activeModule={activeModule}
            onModuleChange={setActiveModule}
            onClearAll={() => setShowClearModal(true)}
            isMobileOnly={true}
          />
        </div>
        <GmapsView />
      </div>

      {/* ── YouTube Module ─────────────────────────────── */}
      <div className="rw-main-layout" style={{ display: activeModule === "youtube" ? "flex" : "none" }}>
        <div className="md:hidden block">
          <Sidebar
            activeStep={0}
            onStepChange={()=>{}}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            activeModule={activeModule}
            onModuleChange={setActiveModule}
            onClearAll={() => setShowClearModal(true)}
            isMobileOnly={true}
          />
        </div>
        <YoutubeView />
      </div>

      {/* ── Instagram Module ─────────────────────────────── */}
      <div className="rw-main-layout" style={{ display: activeModule === "instagram" ? "flex" : "none" }}>
        <div className="md:hidden block">
          <Sidebar
            activeStep={0}
            onStepChange={()=>{}}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            activeModule={activeModule}
            onModuleChange={setActiveModule}
            onClearAll={() => setShowClearModal(true)}
            isMobileOnly={true}
          />
        </div>
        <InstagramView />
      </div>

      {/* ── B2B Module ─────────────────────────────────── */}
      <div className="rw-main-layout" style={{ display: activeModule === "b2b" ? "flex" : "none" }}>
        <div className="md:hidden block">
          <Sidebar
            activeStep={0}
            onStepChange={()=>{}}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            activeModule={activeModule}
            onModuleChange={setActiveModule}
            onClearAll={() => setShowClearModal(true)}
            isMobileOnly={true}
          />
        </div>
        <B2BView />
      </div>

      {/* ── Lead Gen Pipeline ───────────────────────────── */}
      <div className="rw-main-layout" style={{ display: activeModule === "leadgen" ? "flex" : "none" }}>
        <Sidebar
          activeStep={activeStep}
          onStepChange={goToStep}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeModule={activeModule}
          onModuleChange={setActiveModule}
          onClearAll={() => setShowClearModal(true)}
        />

        {/* Main content area */}
        <main
          ref={contentRef}
          className="rw-main-content"
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
              <span>{ICON_MAP[STEPS[activeStep].iconName]}</span>
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
          {currentExportState.error && (
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
              {currentExportState.error}
            </div>
          )}

          {activeStep === 4 && currentExportState.success && (
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
              {currentExportState.success}
            </div>
          )}

          {/* Step content */}
          <div
            className="w-full relative z-10"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: direction === "forward" ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction === "forward" ? -20 : 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={activeStep < 4 ? "grid grid-cols-1 lg:grid-cols-[65%_1fr] gap-8" : "w-full"}
              >
                <div className="w-full">
                  {renderStep()}
                </div>
                {activeStep < 4 && (
                  <div className="hidden lg:block relative">
                    <LiveContextSidebar formState={formState} activeStep={activeStep} />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
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
