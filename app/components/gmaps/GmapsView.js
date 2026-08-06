"use client";

import { useState, useEffect, useRef } from "react";
import {
  suggestKeywords,
  gmapsBulkSearch,
  gmapsGetRuns,
  gmapsGetRun,
  gmapsExportCsv,
  downloadBlob,
} from "../../lib/api";
import { useSessionState } from "../../hooks/useSessionState";
import { Map, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SearchParametersCard from "./SearchParametersCard";
import GlobeVisualization from "./GlobeVisualization";
import ExportProgress from "../ExportProgress";
import RippleArrivalSignal from "./RippleArrivalSignal";
import ResultsBottomSheet from "./ResultsBottomSheet";

export default function GmapsView() {
  // ─── Search Form State ───────────────────────────────────
  const [keywords, setKeywords] = useSessionState("gmaps-keywords", []);
  const [location, setLocation] = useSessionState("gmaps-location", "");
  const [limit, setLimit] = useSessionState("gmaps-limit", 50);
  const [companyName, setCompanyName] = useSessionState("gmaps-company-name", "");
  const [companyDescription, setCompanyDescription] = useSessionState("gmaps-company-desc", "");

  useEffect(() => {
    if (limit > 50) {
      setLimit(50);
    }
  }, [limit, setLimit]);

  // ─── Search State ────────────────────────────────────────
  const [isSearching, setIsSearching] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [searchSuccess, setSearchSuccess] = useState(null);
  const [resultData, setResultData] = useSessionState("gmaps-results", null);
  const [currentRunId, setCurrentRunId] = useSessionState("gmaps-runid", null);
  
  // ─── Results UI State ────────────────────────────────────
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // ─── Past Runs State ─────────────────────────────────────
  const [runs, setRuns] = useState([]);
  const [loadingRuns, setLoadingRuns] = useState(false);
  const [isExportingCsv, setIsExportingCsv] = useState(false);

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

  const handleSuggestKeywords = async () => {
    if (!companyName.trim() || !companyDescription.trim()) {
      setSearchError("Please enter both Company Name and Description to suggest keywords.");
      return;
    }
    
    setIsSuggesting(true);
    setSearchError(null);
    setSearchSuccess(null);
    
    try {
      const data = await suggestKeywords(companyName.trim(), companyDescription.trim());
      if (data.keywords && Array.isArray(data.keywords)) {
        // Clean up keywords by removing placeholders like "[city]" or "in [city]"
        const cleanedKeywords = data.keywords.map(kw => 
          kw.replace(/\s*in\s*\[city\]/gi, '')
            .replace(/\s*\[city\]/gi, '')
            .replace(/\s*in\s*city/gi, '')
            .trim()
        );
        setKeywords(cleanedKeywords);
        setSearchSuccess("Keywords generated successfully!");
      } else {
        setSearchError("Failed to parse suggested keywords.");
      }
    } catch (err) {
      setSearchError(err.message || "Failed to suggest keywords.");
    } finally {
      setIsSuggesting(false);
    }
  };

  const wsRef = useRef(null);

  // Cleanup WebSocket on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

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
    setIsSheetOpen(false);

    try {
      const jobData = await gmapsBulkSearch({ keywords, location: location.trim(), limit });

      const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsHost = process.env.NEXT_PUBLIC_API_URL 
        ? process.env.NEXT_PUBLIC_API_URL.replace(/^https?:\/\//, "") 
        : window.location.host;
      const wsAbsoluteUrl = `${wsProtocol}//${wsHost}${jobData.ws_url}`;
      
      const ws = new WebSocket(wsAbsoluteUrl);
      wsRef.current = ws;

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          
          if (msg.status === "completed") {
            ws.close();
            try {
              let rows = msg.data || [];
              let runId = jobData.job_id;
              
              setResultData(rows);
              setCurrentRunId(runId);
              setSearchSuccess(`Found ${rows.length} businesses!`);
              loadRuns();
            } catch (err) {
              setSearchError(err.message || "Failed to process final GMaps leads.");
            } finally {
              setIsSearching(false);
            }
          } else if (msg.status === "failed") {
            ws.close();
            setSearchError(msg.message || msg.error || "Google Maps search failed.");
            setIsSearching(false);
          } else if (msg.status === "cancelled") {
            ws.close();
            setSearchError("Job cancelled.");
            setIsSearching(false);
          }
        } catch (err) {
          console.error("WS Message Error:", err);
        }
      };

      ws.onerror = () => {
        ws.close();
        setSearchError("WebSocket connection error occurred.");
        setIsSearching(false);
      };

    } catch (err) {
      setSearchError(err.message || "Search failed. Please try again.");
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
    if (!resultData || resultData.length === 0) return;
    setIsExportingCsv(true);
    try {
      if (currentRunId) {
        const result = await gmapsExportCsv(currentRunId);
        downloadBlob(result.blob, result.filename);
      } else {
        const headers = Object.keys(resultData[0]);
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
        downloadBlob(blob, "gmaps_export.csv");
      }
    } catch (err) {
      alert("CSV Export failed: " + err.message);
      setSearchError(err.message);
    } finally {
      setIsExportingCsv(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="rw-main-content w-full relative min-h-screen">
      {/* Page header */}
      <div className="mb-8 animate-[rw-fadeInUp_0.3s_ease-out]">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 bg-gradient-to-br from-brand-sky/10 to-brand-cyan/10 rounded-xl flex items-center justify-center border border-brand-sky/20 shadow-sm text-brand-blue">
            <Map className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold text-brand-dark m-0 tracking-tight font-display">
            Google Maps Search
          </h1>
        </div>
        <p className="text-sm text-gray-500 m-0 ml-14">
          Find local businesses, analyze opportunities, and export enriched contacts
        </p>
      </div>

      {/* Alerts */}
      <AnimatePresence>
        {searchError && (
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
              <p className="text-sm text-red-700 mt-1 mb-0">{searchError}</p>
            </div>
            <button 
              onClick={() => setSearchError(null)}
              className="absolute top-4 right-4 text-red-400 hover:text-red-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {searchSuccess && !isSearching && (
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
              <p className="text-sm text-emerald-700 mt-1 mb-0">{searchSuccess}</p>
            </div>
            <button 
              onClick={() => setSearchSuccess(null)}
              className="absolute top-4 right-4 text-emerald-400 hover:text-emerald-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── ZONE 1: Search Form & Globe ───────────────────────────────────── */}
      <div className="mb-8 grid grid-cols-1 lg:grid-cols-[55%_45%] gap-6 items-stretch">
        <div className="flex flex-col">
          <SearchParametersCard 
            keywords={keywords}
            setKeywords={setKeywords}
            location={location}
            setLocation={setLocation}
            limit={limit}
            setLimit={setLimit}
            companyName={companyName}
            setCompanyName={setCompanyName}
            companyDescription={companyDescription}
            setCompanyDescription={setCompanyDescription}
            isSearching={isSearching}
            isSuggesting={isSuggesting}
            onSearch={handleSearch}
            onSuggestKeywords={handleSuggestKeywords}
          />
          <div className="mt-4">
            <ExportProgress isActive={isSearching} logType="gmaps" />
          </div>
        </div>
        <div className="flex flex-col min-h-[500px]">
          <GlobeVisualization 
            status={isSearching ? "scanning" : (resultData?.length > 0 ? "complete" : "idle")}
            targetLocation={location}
            resultCount={resultData?.length || 0}
          />
        </div>
      </div>

      {/* ── Past Runs ─────────────────────────────────────── */}
      {runs.length > 0 && !isSearching && (!resultData || resultData.length === 0) && (
        <div className="mb-8 animate-[rw-fadeInUp_0.4s_ease-out]">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-1 h-3.5 bg-gray-300 rounded-full" />
            <h3 className="text-[12px] font-bold uppercase tracking-[0.05em] text-gray-500 m-0 leading-none">
              Past Searches
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {runs.map((run) => {
              const runId = run.run_id || run.id || run;
              const isActive = currentRunId === runId;
              return (
                <button
                  key={runId}
                  type="button"
                  onClick={() => handleLoadRun(runId)}
                  className={`
                    px-4 py-2 rounded-xl text-[13px] transition-all font-medium border
                    ${isActive 
                      ? "border-brand-sky bg-brand-sky/10 text-brand-blue shadow-sm" 
                      : "border-gray-200 bg-white text-gray-500 hover:border-brand-sky/30 hover:bg-gray-50"
                    }
                  `}
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
          />
        </>
      )}
    </div>
  );
}
