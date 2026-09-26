"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, Building2, MapPin, Globe, Database, TrendingUp, AlertCircle, Briefcase, Zap, CheckCircle2, X } from "lucide-react";
import { fetchInvestors } from "../../lib/api";
import InvestorVisualizer from "./InvestorVisualizer";
import ResultsBottomSheet from "../gmaps/ResultsBottomSheet";
import RippleArrivalSignal from "../gmaps/RippleArrivalSignal";
import { useAuth } from "../../lib/AuthContext";

export default function InvestorsView() {
  const { isSuspended } = useAuth();
  const [target, setTarget] = useState("");
  const [fullEnrichment, setFullEnrichment] = useState(true);
  const [investorLimit, setInvestorLimit] = useState(10);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!target.trim()) {
      setErrorMsg("Please provide a target company (Name, Domain, or LinkedIn URL).");
      return;
    }

    setIsSearching(true);
    setErrorMsg("");
    setSuccessMsg("");
    setResults(null);
    setIsSheetOpen(false);

    try {
      const data = await fetchInvestors(target, fullEnrichment, investorLimit);
      setResults(data);
      if (data.investors && data.investors.length > 0) {
        setSuccessMsg(`Successfully enriched ${data.investors.length} investors!`);
      } else {
        setErrorMsg("No investors found for this company.");
      }
    } catch (err) {
      setErrorMsg(err.message || "Failed to fetch investor data.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleAbort = () => {
    setIsSearching(false);
    setErrorMsg("Enrichment cancelled.");
  };

  const handleExportCsv = () => {
    if (!results?.investors || results.investors.length === 0) return;
    try {
      const allKeys = new Set();
      results.investors.forEach(row => Object.keys(row).forEach(k => allKeys.add(k)));
      const headers = Array.from(allKeys);
      
      const csvContent = [
        headers.map(h => h.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())).join(","),
        ...results.investors.map((row) =>
          headers
            .map((h) => {
              let val = row[h];
              if (val === null || val === undefined || val === "" || val === "None") val = "—";
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
      a.download = `investors_${target}.csv`;
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
          <div className="w-10 h-10 bg-gradient-to-br from-[#023dbb]/10 to-[#308fef]/10 rounded-xl flex items-center justify-center border border-[#023dbb]/20 shadow-sm text-[#023dbb]">
            <Database className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold text-brand-dark m-0 tracking-tight font-display">
            Investor Data Pipeline
          </h1>
        </div>
        <p className="text-sm text-gray-500 m-0 ml-14">
          Uncover deep insights on company investors powered by Crunchbase & PitchBook
        </p>
      </div>

      {/* Elegant Alerts */}
      <AnimatePresence>
        {errorMsg && (
          <motion.div 
            key="error-alert"
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
            key="success-alert"
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

      {/* ── ZONE 1: Search Form & Visualizer ───────────────────────────── */}
      <div className="mb-10 grid grid-cols-1 lg:grid-cols-[55%_45%] gap-6 items-stretch">
        <div className="flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 lg:p-7 border border-[#023dbb]/10 shadow-[0_4px_20px_rgba(2,61,187,0.06)] h-full"
          >
            <div className="flex items-center gap-2.5 mb-6 pb-3 border-b border-[#023dbb]/5">
              <div className="w-1 h-3.5 bg-gradient-to-b from-[#023dbb] to-[#4ec8ef] rounded-full" />
              <h2 className="text-[12px] font-bold uppercase tracking-[0.05em] text-[#023dbb] m-0 leading-none">
                Enrichment Parameters
              </h2>
            </div>

            <form onSubmit={handleSearch} className="flex flex-col gap-5 mb-6">
              <div className="flex flex-col gap-1.5 relative">
                <label className="text-[13px] font-semibold text-brand-dark uppercase tracking-wide">
                  Target Company
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    placeholder="Company Name, Domain, or LinkedIn URL"
                    className="w-full pl-10 pr-4 py-3 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#4ec8ef] focus:ring-4 focus:ring-[#4ec8ef]/10 transition-all hover:border-[#4ec8ef]/40 text-brand-dark font-medium placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5 mt-2">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div>
                    <h4 className="font-bold text-[13px] text-brand-dark uppercase tracking-wide">Deep Enrichment</h4>
                    <p className="text-xs text-gray-500 font-medium mt-1">Include Crunchbase & PitchBook data</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={fullEnrichment}
                      onChange={(e) => setFullEnrichment(e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#023dbb] peer-checked:to-[#308fef]"></div>
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 mt-2">
                <label className="text-[13px] font-semibold text-brand-dark uppercase tracking-wide flex justify-between items-center">
                  <span>Max Investors to Fetch</span>
                  <span className="text-[#023dbb] bg-blue-50 px-2 py-0.5 rounded text-xs font-bold border border-blue-100">{investorLimit}</span>
                </label>
                <input
                  type="range"
                  min="10"
                  max="300"
                  step="10"
                  value={investorLimit}
                  onChange={(e) => setInvestorLimit(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#023dbb] mt-2"
                />
                <div className="flex justify-between text-xs text-gray-400 font-medium px-1 mt-1">
                  <span>10</span>
                  <span>300</span>
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-gray-100 gap-3 mt-auto">
                {isSearching && (
                  <motion.button
                    type="button"
                    onClick={handleAbort}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3.5 rounded-xl text-white font-bold text-[15px] tracking-wide flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 shadow-md transition-all duration-300"
                  >
                    <X className="w-5 h-5" />
                    <span>Abort</span>
                  </motion.button>
                )}
                <motion.button
                  type="submit"
                  disabled={isSearching || !target || isSuspended}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    relative px-8 py-3.5 rounded-xl text-white font-bold text-[15px] tracking-wide flex items-center justify-center gap-2 overflow-hidden transition-all duration-300 min-w-[220px]
                    ${(isSearching || !target || isSuspended)
                      ? "bg-gray-400 shadow-inner pointer-events-none"
                      : "bg-gradient-to-r from-[#023dbb] via-[#4460ef] to-[#308fef] shadow-[0_4px_20px_rgba(2,61,187,0.3)] hover:shadow-[0_8px_30px_rgba(48,143,239,0.4)]"
                    }
                  `}
                  title={isSuspended ? "Account suspended" : ""}
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Enriching... (Up to 3 min)</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      <span>{isSuspended ? "Account Suspended" : "Run Enrichment"}</span>
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
        
        {/* Right Side Visualizer */}
        <div className="flex flex-col min-h-[500px]">
          <InvestorVisualizer 
            status={isSearching ? "scanning" : (results?.investors?.length > 0 ? "complete" : (target.trim() ? "locked" : "idle"))} 
            targetUrl={target}
            resultCount={results?.investors?.length || 0}
          />
        </div>
      </div>

      {/* ── ZONE 2: Results Display ─────────────────────────────────── */}
      <AnimatePresence>
        {results && !isSearching && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Status & Company Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#308fef]/10 to-transparent rounded-full -mr-10 -mt-10 pointer-events-none" />
                <h3 className="text-lg font-bold text-[#191919] mb-5 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#308fef]" />
                  Company Profile
                </h3>
                {results.company_metadata?.name ? (
                  <div className="space-y-3">
                    <p className="text-2xl font-black text-[#023dbb]">{results.company_metadata.name}</p>
                    <p className="flex items-center gap-2 text-gray-600 font-medium text-sm">
                      <Briefcase className="w-4 h-4 text-gray-400" />
                      {results.company_metadata.industry || "Unknown Industry"}
                    </p>
                    <p className="flex items-center gap-2 text-gray-600 font-medium text-sm">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {results.company_metadata.hq_location || "Location not found"}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-500 italic text-sm">No company profile data available.</p>
                )}
              </div>

              <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 p-6 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-500/10 to-transparent rounded-full -mr-10 -mt-10 pointer-events-none" />
                <h3 className="text-lg font-bold text-[#191919] mb-5 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  Pipeline Status
                </h3>
                <div className="space-y-3">
                  {results.match_status && Object.entries(results.match_status).map(([key, status]) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <span className="font-medium text-gray-600 capitalize text-xs">
                        {key.replace("step", "Step ").replace(/_/g, " ")}
                      </span>
                      <span className={`text-[11px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
                        status === 'success' ? 'bg-green-100 text-green-700' :
                        status === 'skipped' ? 'bg-gray-200 text-gray-600' :
                        status.includes('failed') ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {status.split(':')[0]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Results Delivery System ───────────────────────────────────── */}
      {results && results.investors && results.investors.length > 0 && !isSearching && (
        <>
          <RippleArrivalSignal isActive={true} />
          <ResultsBottomSheet 
            isOpen={isSheetOpen} 
            onOpen={() => setIsSheetOpen(true)}
            onClose={() => setIsSheetOpen(false)} 
            onExport={handleExportCsv}
            data={results.investors}
            subtitle={`${results.investors.length} enriched investors ready for export`}
          />
        </>
      )}
    </div>
  );
}
