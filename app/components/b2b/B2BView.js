"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, Building, MapPin, Download, BookOpen, ExternalLink, Phone, Mail, X } from "lucide-react";
import TagInput from "../inputs/TagInput";
import DirectoryNetworkPanel from "./DirectoryNetworkPanel";
import ExportProgress from "../ExportProgress";
import ResultsBottomSheet from "../gmaps/ResultsBottomSheet";
import RippleArrivalSignal from "../gmaps/RippleArrivalSignal";
import { fetchB2BLeads } from "../../lib/api";
import { useSessionState } from "../../hooks/useSessionState";

const DIRECTORIES = [
  { id: "yellowpages", label: "Yellow Pages (US)", icon: BookOpen, color: "text-yellow-600", bg: "bg-yellow-100", border: "border-yellow-200" },
  { id: "justdial", label: "Justdial (India)", icon: Building, color: "text-orange-600", bg: "bg-orange-100", border: "border-orange-200" },
  { id: "indiamart", label: "IndiaMART (B2B)", icon: Building, color: "text-blue-600", bg: "bg-blue-100", border: "border-blue-200" }
];

export default function B2BView() {
  // ─── Search Form State ───────────────────────────────────
  const [directory, setDirectory] = useSessionState("b2b-directory", "yellowpages");
  const [keywords, setKeywords] = useSessionState("b2b-keywords", []);
  const [location, setLocation] = useSessionState("b2b-location", "");
  const [maxResults, setMaxResults] = useSessionState("b2b-max-results", 20);

  // ─── Pagination State ─────────────────────────────────────
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ─── Search State ────────────────────────────────────────
  const [isSearching, setIsSearching] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [resultData, setResultData] = useSessionState("b2b-results", null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // ─── Search Handler ──────────────────────────────────────
  const handleSearch = async () => {
    if (keywords.length === 0) {
      setErrorMsg("Please add at least one keyword (e.g. 'plumber', 'software')");
      return;
    }
    if (!location.trim()) {
      setErrorMsg("Please enter a location");
      return;
    }

    setIsSearching(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    setResultData(null);
    setIsSheetOpen(false);
    setCurrentPage(1);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minutes

      const result = await fetchB2BLeads({
        targetDirectory: directory,
        searchKeywords: keywords,
        location: location.trim(),
        maxResultsPerKeyword: Number(maxResults)
      }, controller.signal);

      clearTimeout(timeoutId);

      const rows = Array.isArray(result) ? result : (result.data || []);
      setResultData(rows);
      setSuccessMsg(`Found ${rows.length} B2B leads from ${directory}!`);
    } catch (err) {
      if (err.name === 'AbortError') {
        setErrorMsg("Search timed out after 5 minutes. Please try a smaller query.");
      } else if (err.message === "Failed to fetch") {
        setErrorMsg("We couldn't reach the search service right now. Please check your internet connection and try again in a moment.");
      } else {
        setErrorMsg(err.message || "Failed to fetch B2B leads. Please try again.");
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleExportCsv = () => {
    if (!resultData || resultData.length === 0) return;
    try {
      // Find all unique keys across all objects for dynamic columns
      const allKeys = new Set();
      resultData.forEach(row => Object.keys(row).forEach(k => allKeys.add(k)));
      const headers = Array.from(allKeys);
      
      const csvContent = [
        headers.join(","),
        ...resultData.map((row) =>
          headers
            .map((h) => {
              let val = row[h];
              if (val === null || val === undefined) val = "";
              if (typeof val === "object") val = JSON.stringify(val);
              return `"${val.toString().replace(/"/g, '""')}"`;
            })
            .join(",")
        ),
      ].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `b2b_leads_${directory}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setErrorMsg("CSV Export failed: " + err.message);
    }
  };

  return (
    <div className="rw-main-content w-full relative min-h-screen pb-20">
      {/* Page header */}
      <div className="mb-8 animate-[rw-fadeInUp_0.3s_ease-out]">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20 shadow-sm text-indigo-600">
            <Building className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold text-brand-dark m-0 tracking-tight font-display">
            B2B Directory Scraper
          </h1>
        </div>
        <p className="text-sm text-gray-500 m-0 ml-14">
          Extract wholesale and local business data from major online directories
        </p>
      </div>

      {/* Elegant Alerts */}
      <AnimatePresence>
        {errorMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mb-6 p-4 bg-red-50/80 backdrop-blur border border-red-200 rounded-xl shadow-sm flex items-start gap-3 relative"
          >
            <div className="mt-0.5 bg-red-100 text-red-600 p-1 rounded-full shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </div>
            <div className="pr-6">
              <h4 className="text-sm font-bold text-red-800 m-0">Error</h4>
              <p className="text-sm text-red-700 mt-1 mb-0">{errorMsg}</p>
            </div>
            <button 
              onClick={() => setErrorMsg(null)}
              className="absolute top-4 right-4 text-red-400 hover:text-red-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {successMsg && !isSearching && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mb-6 p-4 bg-emerald-50/80 backdrop-blur border border-emerald-200 rounded-xl shadow-sm flex items-start gap-3 relative"
          >
             <div className="mt-0.5 bg-emerald-100 text-emerald-600 p-1 rounded-full shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div className="pr-6">
              <h4 className="text-sm font-bold text-emerald-800 m-0">Success</h4>
              <p className="text-sm text-emerald-700 mt-1 mb-0">{successMsg}</p>
            </div>
            <button 
              onClick={() => setSuccessMsg(null)}
              className="absolute top-4 right-4 text-emerald-400 hover:text-emerald-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── ZONE 1: Search Form & Directory Network ─────────────────────────── */}
      <div className="mb-8 grid grid-cols-1 lg:grid-cols-[55%_45%] gap-6 items-stretch">
        <div className="flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 lg:p-7 border border-brand-blue/10 shadow-[0_4px_20px_rgba(2,61,187,0.06)] h-full"
          >
            <div className="flex items-center gap-2.5 mb-6 pb-3 border-b border-brand-blue/5">
              <div className="w-1 h-3.5 bg-gradient-to-b from-brand-blue to-brand-cyan rounded-full" />
              <h2 className="text-[12px] font-bold uppercase tracking-[0.05em] text-brand-blue m-0 leading-none">
                Search Parameters
              </h2>
            </div>

        <div className="mb-6 pb-6 border-b border-gray-100">
          <label className="text-[13px] font-semibold text-brand-dark block mb-3 uppercase tracking-wide">
            Select Data Source Directory
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {DIRECTORIES.map((dir) => {
              const isActive = directory === dir.id;
              const Icon = dir.icon;
              return (
                <button
                  key={dir.id}
                  type="button"
                  onClick={() => setDirectory(dir.id)}
                  className={`
                    relative p-4 rounded-xl flex items-center gap-4 text-left transition-all border-2
                    ${isActive 
                      ? `${dir.border} ${dir.bg} shadow-sm ring-4 ring-opacity-20 ring-brand-blue` 
                      : "border-gray-100 hover:border-gray-200 bg-white"
                    }
                  `}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isActive ? "bg-white/60 shadow-sm" : "bg-gray-50"}`}>
                    <Icon className={`w-5 h-5 ${isActive ? dir.color : "text-gray-400"}`} />
                  </div>
                  <div>
                    <h4 className={`font-bold text-[15px] ${isActive ? "text-brand-dark" : "text-gray-600"}`}>{dir.label}</h4>
                  </div>
                  {isActive && (
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-brand-blue"></div>
                  )}
                </button>
              );
            })}
          </div>
          <AnimatePresence>
            {directory === "yellowpages" && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs font-semibold px-4 py-3 rounded-xl flex items-center gap-2">
                  <span className="shrink-0 bg-yellow-100 p-1 rounded-full text-yellow-700">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  </span>
                  Please note that Yellow Pages data extraction is currently limited to locations within the United States.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="flex-[2]">
            <TagInput
              label="Search Keywords"
              hint="Press enter to add multiple products/industries"
              tags={keywords}
              onChange={setKeywords}
              placeholder="e.g. software, textiles..."
              icon={Search}
            />
          </div>

          <div className="flex-1 relative group">
            <label className="text-[13px] font-semibold text-brand-dark block mb-1.5 uppercase tracking-wide">
              Location
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3.5 flex items-center z-10 text-gray-400">
                <MapPin className="w-4 h-4" />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all hover:border-indigo-500/40 text-brand-dark font-medium"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Mumbai, New York..."
              />
            </div>
          </div>

          <div className="flex-1 relative group">
            <label className="text-[13px] font-semibold text-brand-dark block mb-1.5 uppercase tracking-wide">
              Max Results
            </label>
            <input
              type="number"
              className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all hover:border-indigo-500/40 text-brand-dark font-medium"
              value={maxResults}
              onChange={(e) => setMaxResults(e.target.value)}
              min={1}
              max={100}
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100">
          <motion.button
            type="button"
            onClick={handleSearch}
            disabled={isSearching}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              relative px-8 py-3.5 rounded-xl text-white font-bold text-[15px] tracking-wide flex items-center justify-center gap-2 overflow-hidden transition-all duration-300 min-w-[220px]
              ${isSearching
                ? "bg-brand-sky shadow-inner pointer-events-none"
                : "bg-gradient-to-r from-brand-blue to-brand-cyan shadow-[0_4px_20px_rgba(48,143,239,0.3)] hover:shadow-[0_8px_30px_rgba(48,143,239,0.5)]"
              }
            `}
          >
            {isSearching ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Extracting... (Up to 5 min)</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>Extract B2B Leads</span>
              </>
            )}
          </motion.button>
        </div>
          </motion.div>
          <div className="mt-4">
            <ExportProgress isActive={isSearching} logType="b2b" />
          </div>
        </div>
        <div className="flex flex-col min-h-[500px] gap-6">
          <DirectoryNetworkPanel 
            status={isSearching ? "scanning" : (resultData?.length > 0 ? "complete" : "idle")} 
            selectedDirectory={directory}
            businessCount={resultData?.length || 0}
          />
        </div>
      </div>

      {/* ── Results Delivery System ───────────────────────────────────── */}
      {resultData && resultData.length > 0 && !isSearching && (
        <>
          <RippleArrivalSignal isActive={true} />
          <ResultsBottomSheet 
            isOpen={isSheetOpen} 
            onOpen={() => setIsSheetOpen(true)}
            onClose={() => setIsSheetOpen(false)} 
            onExport={handleExportCsv}
            data={resultData}
            extraExcludeColumns={directory === "indiamart" ? ["price", "Price"] : []}
            subtitle={`${resultData.length} local businesses from ${directory} ready for export`}
          />
        </>
      )}
    </div>
  );
}
