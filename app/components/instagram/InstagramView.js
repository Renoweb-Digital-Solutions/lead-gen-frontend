"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Camera, Link as LinkIcon, Hash, X } from "lucide-react";
import ExportProgress from "../ExportProgress";
import InstagramResultsBottomSheet from "./InstagramResultsBottomSheet";
import RippleArrivalSignal from "../gmaps/RippleArrivalSignal";
import { extractInstagramLeads } from "../../lib/api";
import { useSessionState } from "../../hooks/useSessionState";
import FollowerOrbitPanel from "./FollowerOrbitPanel";

export default function InstagramView() {
  // ─── Search Form State ───────────────────────────────────
  const [sourceType, setSourceType] = useSessionState("instagram-source-type", "followers");
  const [target, setTarget] = useSessionState("instagram-target", "");
  const [maxItems, setMaxItems] = useSessionState("instagram-max-items", 50);

  // ─── Search State ────────────────────────────────────────
  const [isSearching, setIsSearching] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [resultData, setResultData] = useSessionState("instagram-results", null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // ─── Search Handler ──────────────────────────────────────
  const handleSearch = async () => {
    if (!target.trim()) {
      setErrorMsg("Please provide a target URL (e.g. an Instagram profile or post link).");
      return;
    }

    setIsSearching(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    setResultData(null);
    setIsSheetOpen(false);

    try {
      // Create an AbortController for a long timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minutes

      const result = await extractInstagramLeads({
        source_type: sourceType,
        target: target.trim(),
        max_items: Number(maxItems)
      }, controller.signal);

      clearTimeout(timeoutId);

      // Extract array from standard response structures
      let rows = Array.isArray(result) ? result : (result.results || result.data || []);
      
      // Flatten nested structures for the grid
      rows = rows.map(row => {
        const flatRow = { ...row };
        if (flatRow.contact_info) {
          Object.entries(flatRow.contact_info).forEach(([k, v]) => flatRow[k] = v);
          delete flatRow.contact_info;
        }
        if (flatRow.metrics) {
          Object.entries(flatRow.metrics).forEach(([k, v]) => flatRow[k] = v);
          delete flatRow.metrics;
        }
        return flatRow;
      });
      
      setResultData(rows);
      setSuccessMsg(`Extracted ${rows.length} Instagram leads!`);
    } catch (err) {
      if (err.name === 'AbortError') {
        setErrorMsg("Extraction timed out after 5 minutes. Please try a smaller query.");
      } else if (err.message === "Failed to fetch") {
        setErrorMsg("We couldn't reach the search service right now. Please check your internet connection and try again in a moment.");
      } else {
        setErrorMsg(err.message || "Failed to extract Instagram leads. Please try again.");
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleExportCsv = () => {
    if (!resultData || resultData.length === 0) return;
    try {
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
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `instagram_${sourceType}_leads.csv`;
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
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-xl flex items-center justify-center border border-pink-500/20 shadow-sm text-pink-600">
            <Camera className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold text-brand-dark m-0 tracking-tight font-display">
            Instagram Lead Scraper
          </h1>
        </div>
        <p className="text-sm text-gray-500 m-0 ml-14">
          Extract followers or commenters from Instagram profiles and posts
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
              <X className="w-4 h-4" />
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

      {/* ── ZONE 1: Search Form & Signal Scanner ───────────────────────────── */}
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
                Extraction Parameters
              </h2>
            </div>

            <div className="flex flex-col gap-5 mb-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-brand-dark uppercase tracking-wide">
                  Source Type
                </label>
                <select
                  value={sourceType}
                  onChange={(e) => setSourceType(e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-brand-sky focus:ring-4 focus:ring-brand-sky/10 transition-all hover:border-brand-sky/40 text-brand-dark font-medium"
                >
                  <option value="followers">Followers (from a Profile URL)</option>
                  <option value="followings">Followings (from a Profile URL)</option>
                  <option value="comments">Comments (from a Post URL)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5 relative">
                <label className="text-[13px] font-semibold text-brand-dark uppercase tracking-wide">
                  Target URL
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LinkIcon className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    placeholder={sourceType === "comments" ? "https://www.instagram.com/p/..." : "https://www.instagram.com/username"}
                    className="w-full pl-10 pr-4 py-3 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-brand-sky focus:ring-4 focus:ring-brand-sky/10 transition-all hover:border-brand-sky/40 text-brand-dark font-medium placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-brand-dark uppercase tracking-wide">
                  Max Items
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Hash className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    value={maxItems}
                    onChange={(e) => setMaxItems(e.target.value)}
                    min={1}
                    max={sourceType === "comments" ? 10000 : 500}
                    className="w-full pl-10 pr-4 py-3 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-brand-sky focus:ring-4 focus:ring-brand-sky/10 transition-all hover:border-brand-sky/40 text-brand-dark font-medium"
                  />
                </div>
                {sourceType !== "comments" && (
                  <span className="text-[11px] text-gray-500 ml-1">Maximum 500 for {sourceType}</span>
                )}
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
                    ? "bg-fuchsia-400 shadow-inner pointer-events-none"
                    : "bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 shadow-[0_4px_20px_rgba(236,72,153,0.3)] hover:shadow-[0_8px_30px_rgba(236,72,153,0.5)]"
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
                    <Camera className="w-5 h-5" />
                    <span>Extract Leads</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
          <div className="mt-4">
            <ExportProgress isActive={isSearching} logType="instagram" />
          </div>
        </div>
        
        <div className="flex flex-col min-h-[500px] gap-6">
          <FollowerOrbitPanel 
            status={isSearching ? "scanning" : (resultData?.length > 0 ? "complete" : (target.trim() ? "locked" : "idle"))} 
            targetUrl={target}
            followers={resultData || []}
          />
          
          {(!resultData || resultData.length === 0) && !isSearching && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 border border-brand-blue/10 shadow-[0_4px_24px_rgba(2,61,187,0.06)] flex flex-col items-center justify-center h-full min-h-[200px]"
            >
              <Camera className="w-10 h-10 text-gray-200 mb-3" />
              <p className="text-sm font-medium text-gray-500 text-center">Ready to extract Instagram data. Enter a URL to begin.</p>
            </motion.div>
          )}
        </div>
      </div>

      {!isSearching && resultData && resultData.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="bg-white rounded-2xl p-12 border border-brand-blue/10 flex flex-col items-center justify-center text-center"
        >
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
            <Camera className="w-12 h-12 text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">No data found</h3>
          <p className="text-gray-500 max-w-md">
            No leads were found for these parameters. Check the URL and try again.
          </p>
        </motion.div>
      )}

      {/* ── Results Delivery System ───────────────────────────────────── */}
      {resultData && resultData.length > 0 && !isSearching && (
        <>
          <RippleArrivalSignal isActive={true} />
          <InstagramResultsBottomSheet 
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
