"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RadioCards from "../inputs/RadioCards";
import ExportBottomSheet from "./ExportBottomSheet";
import ExportProgress from "../ExportProgress";
import Toggle from "../inputs/Toggle";
import { EXPORT_FORMATS } from "../../lib/constants";
import { ChevronDown, Download, Rocket, FileText, Database, ArrowRight } from "lucide-react";

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const Card = ({ title, children, onClickTitle, expandable = false, expanded = false }) => (
  <motion.div 
    variants={sectionVariants}
    className="bg-white rounded-2xl p-6 lg:p-7 border border-brand-blue/10 shadow-[0_2px_8px_rgba(2,61,187,0.08)] hover:shadow-[0_8px_24px_rgba(2,61,187,0.12)] hover:-translate-y-[2px] transition-all duration-200 mb-6"
  >
    <div 
      className={`flex items-center justify-between mb-6 pb-3 border-b border-brand-blue/5 ${expandable ? 'cursor-pointer' : ''}`}
      onClick={expandable ? onClickTitle : undefined}
    >
      <div className="flex items-center gap-2.5">
        <div className="w-1 h-3.5 bg-gradient-to-b from-brand-blue to-brand-cyan rounded-full" />
        <h2 className="text-[12px] font-bold uppercase tracking-[0.05em] text-brand-blue m-0 leading-none">{title}</h2>
      </div>
      {expandable && (
        <ChevronDown 
          className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} 
        />
      )}
    </div>
    {children}
  </motion.div>
);

const ShimmerTable = () => (
  <div className="w-full bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
    {/* Table Header */}
    <div className="flex bg-gray-50/80 px-4 py-3 border-b border-gray-100 gap-4">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" style={{ width: `${Math.random() * 20 + 10}%` }} />
      ))}
    </div>
    {/* Table Rows */}
    {[1, 2, 3, 4, 5].map(row => (
      <div key={row} className="flex px-4 py-3.5 border-b border-gray-50 gap-4">
        {[1, 2, 3, 4].map(col => (
          <div 
            key={col} 
            className="h-3.5 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 rounded bg-[length:200%_100%] animate-[rw-shimmer_2s_infinite_linear]" 
            style={{ width: `${Math.random() * 40 + 20}%`, animationDelay: `${(row+col)*0.1}s` }} 
          />
        ))}
      </div>
    ))}
  </div>
);

const AnimatedDocumentStack = () => (
  <div className="flex flex-col items-center justify-center py-8">
    <div className="relative w-24 h-24 mb-4">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{
            y: [-20, 0],
            opacity: [0, 1],
            scale: [0.9, 1],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatType: "reverse",
            delay: i * 0.3,
          }}
          className="absolute inset-0 flex items-center justify-center"
          style={{ zIndex: 3 - i, transform: `translateY(${i * 8}px)` }}
        >
          <div className="w-16 h-20 bg-white border-2 border-brand-blue/20 rounded-lg shadow-md flex flex-col items-center p-2 gap-1.5 bg-gradient-to-br from-white to-brand-sky/5">
             <div className="w-full h-1.5 bg-brand-cyan/40 rounded-full" />
             <div className="w-3/4 h-1.5 bg-brand-sky/40 rounded-full self-start" />
             <div className="w-full h-1.5 bg-gray-200 rounded-full mt-auto" />
          </div>
        </motion.div>
      ))}
    </div>
    <div className="text-brand-blue font-semibold">Generating Preview...</div>
    <div className="text-xs text-gray-400 mt-1">Collecting data from pipeline</div>
  </div>
);

export default function ExportStep({
  formState,
  updateField,
  onExport,
  isExporting,
  exportData,
  exportResultFile,
  onDownload,
}) {
  const [showPipelineOptions, setShowPipelineOptions] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    if (exportData || exportResultFile) {
      setIsSheetOpen(true);
    }
  }, [exportData, exportResultFile]);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.1 }
        }
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
        <div className="flex flex-col">
          {/* ── Export Format ───────────────────────────────────── */}
          <Card title="Export Format">
            <RadioCards
              options={EXPORT_FORMATS}
              value={formState.exportFormat}
              onChange={(val) => updateField("exportFormat", val)}
            />
          </Card>

          {/* ── Output Settings ─────────────────────────────────── */}
          <Card title="Output Settings">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="rw-field">
                <label className="text-[13px] font-semibold text-brand-dark block mb-1.5 uppercase tracking-wide">Filename</label>
                <input
                  type="text"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-brand-sky focus:ring-2 focus:ring-brand-sky/20 transition-all"
                  value={formState.filename}
                  onChange={(e) => updateField("filename", e.target.value)}
                  placeholder={EXPORT_FORMATS.find((f) => f.id === formState.exportFormat)?.defaultFilename || "export.csv"}
                />
              </div>
              <div className="rw-field">
                <label className="text-[13px] font-semibold text-brand-dark block mb-1.5 uppercase tracking-wide">
                  Limit Items
                  <span className="text-[12px] font-normal text-gray-400 ml-2 normal-case">Optional</span>
                </label>
                <input
                  type="number"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-brand-sky focus:ring-2 focus:ring-brand-sky/20 transition-all"
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
          </Card>

          {/* ── Pipeline Options ────────────────────────────────── */}
          <Card 
            title="Advanced Pipeline Options" 
            expandable={true} 
            expanded={showPipelineOptions}
            onClickTitle={() => setShowPipelineOptions(!showPipelineOptions)}
          >
            <AnimatePresence>
              {showPipelineOptions && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-2 flex flex-col gap-2">
                    <Toggle
                      label="Strict Output Schema"
                      hint="Enforce standardized column format"
                      checked={formState.strictOutputSchema}
                      onChange={(val) => updateField("strictOutputSchema", val)}
                    />
                    <Toggle
                      label="Reset Progress"
                      hint="Start fresh instead of resuming"
                      checked={formState.resetProgress}
                      onChange={(val) => updateField("resetProgress", val)}
                    />
                    <Toggle
                      label="Don't Save Progress"
                      hint="Run without saving checkpoint data"
                      checked={formState.dontSaveProgress}
                      onChange={(val) => updateField("dontSaveProgress", val)}
                    />
                    <Toggle
                      label="Count Only"
                      hint="Only return result count, no data"
                      checked={formState.countOnly}
                      onChange={(val) => updateField("countOnly", val)}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* ── Progress Logs ───────────────────────────────────── */}
          {isExporting && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
              <ExportProgress
                isActive={isExporting}
                totalResults={formState.totalResults}
              />
            </motion.div>
          )}

          {/* ── Results Table Preview ───────────────────────────── */}
          <AnimatePresence mode="wait">
            {isExporting ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-2xl p-6 lg:p-7 border border-brand-blue/10 shadow-[0_4px_24px_rgba(2,61,187,0.08)] mt-4"
              >
                <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
                  <AnimatedDocumentStack />
                  <div className="flex-1 w-full max-w-lg">
                    <ShimmerTable />
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <ExportBottomSheet 
            isOpen={isSheetOpen}
            onOpen={() => setIsSheetOpen(true)}
            onClose={() => setIsSheetOpen(false)}
            data={exportData}
            exportResultFile={exportResultFile}
            formState={formState}
            onDownload={onDownload}
          />

        </div>

        {/* ── Summary & Generate Panel (Sidebar for this step) ── */}
        <div className="w-full">
          <div className="sticky top-24 bg-white rounded-2xl p-6 border border-brand-blue/10 shadow-[0_4px_24px_rgba(2,61,187,0.08)] flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-sky" />
              <h3 className="text-xs uppercase tracking-widest text-brand-blue font-semibold">Export Summary</h3>
            </div>
            
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-gray-500">Format</span>
                <span className="font-semibold text-brand-dark">{EXPORT_FORMATS.find((f) => f.id === formState.exportFormat)?.label}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-gray-500">Max Leads</span>
                <span className="font-semibold text-brand-dark">{formState.totalResults.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-50">
                <span className="text-gray-500">Include Jobs</span>
                <span className="font-semibold text-brand-dark">{formState.includeJobs ? "Yes" : "No"}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-500">Concurrency</span>
                <span className="font-semibold text-brand-dark">{formState.scoreConcurrency}</span>
              </div>
            </div>

            <button
              type="button"
              className={`
                relative w-full py-4 px-6 rounded-xl text-white font-bold text-[15px] tracking-wide flex items-center justify-center gap-2 overflow-hidden transition-all duration-300
                ${isExporting 
                  ? "bg-brand-sky shadow-inner pointer-events-none" 
                  : "bg-gradient-to-r from-brand-blue to-brand-cyan shadow-[0_4px_20px_rgba(48,143,239,0.4)] hover:shadow-[0_8px_30px_rgba(48,143,239,0.5)] hover:-translate-y-0.5"
                }
              `}
              onClick={onExport}
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  {/* Inline progress bar background */}
                  <motion.div 
                    className="absolute top-0 left-0 h-full bg-brand-blue/30"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 10, ease: "linear" }}
                  />
                  <span className="relative z-10 flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating...
                  </span>
                </>
              ) : (
                <>
                  <span className="relative z-10 flex items-center gap-2">
                    <Rocket className="w-5 h-5" />
                    Generate & Export
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:animate-[rw-shimmer_1.5s_infinite]" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
