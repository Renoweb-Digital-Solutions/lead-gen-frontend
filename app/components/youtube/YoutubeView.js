"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, Video, Users, Mail, Link as LinkIcon, Download, X } from "lucide-react";
import TagInput from "../inputs/TagInput";
import SignalScannerPanel from "./SignalScannerPanel";
import ExportProgress from "../ExportProgress";
import ResultsBottomSheet from "../gmaps/ResultsBottomSheet";
import RippleArrivalSignal from "../gmaps/RippleArrivalSignal";
import { fetchYoutubeLeads } from "../../lib/api";
import { useSessionState } from "../../hooks/useSessionState";

export default function YoutubeView() {
  // ─── Search Form State ───────────────────────────────────
  const [keywords, setKeywords] = useSessionState("youtube-keywords", []);
  const [maxChannels, setMaxChannels] = useSessionState("youtube-max-channels", 10);
  const [minSubscribers, setMinSubscribers] = useSessionState("youtube-min-subs", 2000000);

  // ─── Search State ────────────────────────────────────────
  const [isSearching, setIsSearching] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [resultData, setResultData] = useSessionState("youtube-results", null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // ─── Search Handler ──────────────────────────────────────
  const handleSearch = async () => {
    if (keywords.length === 0) {
      setErrorMsg("Please add at least one keyword (e.g. 'tech reviews', 'gaming')");
      return;
    }

    setIsSearching(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    setResultData(null);
    setIsSheetOpen(false);

    try {
      // Create an AbortController for a long timeout, fetchYoutubeLeads accepts a signal
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minutes

      const result = await fetchYoutubeLeads({
        searchKeywords: keywords,
        maxChannelsPerKeyword: Number(maxChannels),
        minSubscribers: Number(minSubscribers)
      }, controller.signal);

      clearTimeout(timeoutId);

      // Assuming API returns { data: [...] } or just an array
      const rows = Array.isArray(result) ? result : (result.data || []);
      setResultData(rows);
      setSuccessMsg(`Found ${rows.length} YouTube leads!`);
    } catch (err) {
      if (err.name === 'AbortError') {
        setErrorMsg("Search timed out after 5 minutes. Please try a smaller query.");
      } else if (err.message === "Failed to fetch") {
        setErrorMsg("We couldn't reach the search service right now. Please check your internet connection and try again in a moment.");
      } else {
        setErrorMsg(err.message || "Failed to fetch YouTube leads. Please try again.");
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
      a.download = "youtube_leads.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setErrorMsg("CSV Export failed: " + err.message);
    }
  };

  const formatNumber = (num) => {
    if (num === null || num === undefined) return "N/A";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="rw-main-content w-full relative min-h-screen pb-20">
      {/* Page header */}
      <div className="mb-8 animate-[rw-fadeInUp_0.3s_ease-out]">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-xl flex items-center justify-center border border-red-500/20 shadow-sm text-red-600">
            <Video className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold text-brand-dark m-0 tracking-tight font-display">
            YouTube Lead Scraper
          </h1>
        </div>
        <p className="text-sm text-gray-500 m-0 ml-14">
          Extract high-quality leads, emails, and social links from YouTube channels
        </p>
      </div>

      {/* Elegant Alerts (replaces toasts) */}
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
                Search Parameters
              </h2>
            </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <div className="flex-[2]">
            <TagInput
              label="Target Keywords"
              hint="Press enter to add multiple keywords"
              tags={keywords}
              onChange={setKeywords}
              placeholder="e.g. tech reviews, vloggers..."
              icon={Search}
            />
          </div>

          <div className="flex-1 relative group">
            <label className="text-[13px] font-semibold text-brand-dark block mb-1.5 uppercase tracking-wide">
              Max Channels / Keyword
            </label>
            <input
              type="number"
              className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-brand-sky focus:ring-4 focus:ring-brand-sky/10 transition-all hover:border-brand-sky/40 text-brand-dark font-medium"
              value={maxChannels}
              onChange={(e) => setMaxChannels(e.target.value)}
              min={1}
              max={100}
            />
          </div>

          <div className="flex-1 relative group">
            <label className="text-[13px] font-semibold text-brand-dark block mb-1.5 uppercase tracking-wide">
              Min Subscribers
            </label>
            <input
              type="number"
              className="w-full px-4 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-brand-sky focus:ring-4 focus:ring-brand-sky/10 transition-all hover:border-brand-sky/40 text-brand-dark font-medium"
              value={minSubscribers}
              onChange={(e) => setMinSubscribers(e.target.value)}
              min={0}
              step={10000}
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
                <Video className="w-5 h-5" />
                <span>Extract YouTube Leads</span>
              </>
            )}
          </motion.button>
        </div>
          </motion.div>
          <div className="mt-4">
            <ExportProgress isActive={isSearching} logType="youtube" />
          </div>
        </div>
        <div className="flex flex-col min-h-[500px] gap-6">
          <SignalScannerPanel 
            status={isSearching ? "scanning" : (resultData?.length > 0 ? "complete" : "idle")} 
            channelCount={resultData?.length || 0}
          />
          
          {(!resultData || resultData.length === 0) && !isSearching && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-6 border border-brand-blue/10 shadow-[0_4px_24px_rgba(2,61,187,0.06)] flex flex-col"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-3 bg-gradient-to-b from-brand-blue to-brand-cyan rounded-full" />
                <h3 className="text-xs uppercase tracking-widest text-brand-blue font-semibold">Sample Channels</h3>
              </div>

              <div className="flex flex-col gap-3">
                {[
                  { name: "TechReviewHQ", category: "Technology", subs: "1.2M" },
                  { name: "DailyVlogz", category: "Lifestyle", subs: "850K" },
                  { name: "CodeWithMe", category: "Education", subs: "2.5M" },
                ].map((channel, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + (idx * 0.1) }}
                    className="p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-brand-blue/5 hover:border-brand-blue/20 transition-colors flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-blue to-brand-sky flex items-center justify-center text-white font-bold text-xs shrink-0">
                      {channel.name.charAt(0)}
                    </div>
                    <div className="overflow-hidden w-full">
                      <div className="text-sm font-semibold text-brand-dark truncate">{channel.name}</div>
                      <div className="text-xs text-gray-500 truncate flex items-center gap-1 mt-0.5">
                        <Users className="w-3 h-3 text-brand-sky" />
                        {channel.subs} subscribers
                      </div>
                      <div className="text-[11px] text-gray-400 truncate mt-0.5 uppercase tracking-wider font-medium">
                        {channel.category}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
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
            <Video className="w-12 h-12 text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">No channels found</h3>
          <p className="text-gray-500 max-w-md">
            No leads were found for these parameters. Try broadening your keywords or lowering the minimum subscriber count.
          </p>
        </motion.div>
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
