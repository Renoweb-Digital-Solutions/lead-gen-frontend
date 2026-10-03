"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, Building2, MapPin, Globe, Database, TrendingUp, AlertCircle, Briefcase, Zap, CheckCircle2, X } from "lucide-react";
import { discoverInvestorsV2 } from "../../lib/api";
import InvestorVisualizer from "./InvestorVisualizer";
import InvestorResultsBottomSheet from "./InvestorResultsBottomSheet";
import RippleArrivalSignal from "../gmaps/RippleArrivalSignal";
import SliderInput from "../inputs/SliderInput";
import ExportProgress from "../ExportProgress";
import { useAuth } from "../../lib/AuthContext";

export default function InvestorsView() {
  const { isSuspended } = useAuth();
  const [companyDescription, setCompanyDescription] = useState("");
  const [industry, setIndustry] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [investmentStage, setInvestmentStage] = useState("");
  const [investorLimit, setInvestorLimit] = useState(10);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!companyDescription.trim() || !industry || !investmentStage) {
      setErrorMsg("Please fill out all required fields.");
      return;
    }

    setIsSearching(true);
    setErrorMsg("");
    setSuccessMsg("");
    setResults(null);
    setIsSheetOpen(false);

    try {
      const data = await discoverInvestorsV2(companyDescription, industry, targetAudience, investmentStage, investorLimit);
      setResults(data);
      if (data.investors && data.investors.length > 0) {
        setSuccessMsg(`Successfully discovered ${data.investors.length} relevant investors!`);
      } else {
        setErrorMsg("No relevant investors found for these criteria.");
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
      a.download = `investors_discovery.csv`;
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
          Uncover relevant investors using LLM-powered query planning and filtering
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
            className="bg-surface rounded-2xl p-6 lg:p-7 border border-border shadow-md h-full"
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
                  Company Description
                </label>
                <textarea
                  required
                  value={companyDescription}
                  onChange={(e) => setCompanyDescription(e.target.value)}
                  placeholder="e.g. A B2B SaaS platform that helps retailers manage payments..."
                  rows={3}
                  className="w-full px-4 py-3 text-sm bg-surface border border-border rounded-xl focus:outline-none focus:border-[#4ec8ef] focus:ring-4 focus:ring-[#4ec8ef]/10 transition-all hover:border-[#4ec8ef]/40 text-brand-dark font-medium placeholder:text-gray-400 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 relative">
                  <label className="text-[13px] font-semibold text-brand-dark uppercase tracking-wide">
                    Industry
                  </label>
                  <select
                    required
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-4 py-3 text-sm bg-surface border border-border rounded-xl focus:outline-none focus:border-[#4ec8ef] focus:ring-4 focus:ring-[#4ec8ef]/10 transition-all hover:border-[#4ec8ef]/40 text-brand-dark font-medium"
                  >
                    <option value="" disabled>Select industry</option>
                    {[
                      "SaaS", "Fintech", "Healthtech", "E-commerce", "Marketing & Advertising Technology",
                      "Artificial Intelligence", "Cybersecurity", "Enterprise Software", "Developer Tools",
                      "HR Tech", "Real Estate Technology (Proptech)", "EdTech", "Logistics & Supply Chain",
                      "CleanTech / Climate Tech", "Biotech", "Consumer Apps", "Gaming", "Web3 / Blockchain",
                      "InsurTech", "Legal Tech", "Food & Beverage", "Hardware / IoT", "Media & Entertainment",
                      "Travel & Hospitality", "Agriculture Technology (Agtech)"
                    ].map(ind => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex flex-col gap-1.5 relative">
                  <label className="text-[13px] font-semibold text-brand-dark uppercase tracking-wide">
                    Target Audience
                  </label>
                  <input
                    type="text"
                    required
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="e.g. Small retailers, Enterprise HR"
                    className="w-full px-4 py-3 text-sm bg-surface border border-border rounded-xl focus:outline-none focus:border-[#4ec8ef] focus:ring-4 focus:ring-[#4ec8ef]/10 transition-all hover:border-[#4ec8ef]/40 text-brand-dark font-medium placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5 mt-2">
                <label className="text-[13px] font-semibold text-brand-dark uppercase tracking-wide">
                  Investment Stage
                </label>
                <select
                  required
                  value={investmentStage}
                  onChange={(e) => setInvestmentStage(e.target.value)}
                  className="w-full px-4 py-3 text-sm bg-surface border border-border rounded-xl focus:outline-none focus:border-[#4ec8ef] focus:ring-4 focus:ring-[#4ec8ef]/10 transition-all hover:border-[#4ec8ef]/40 text-brand-dark font-medium"
                >
                  <option value="" disabled>Select target stage</option>
                  {[
                    "Pre Seed Round", "Seed Round", "Series A", "Series B", "Series C", "Series D", 
                    "Venture Round", "Angel Round", "Convertible Note", "Grant", "Debt Financing", 
                    "Private Equity Round", "Corporate Round"
                  ].map(stage => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
              </div>

              <div className="mb-2">
                <SliderInput
                  label="Max Investors to Fetch"
                  hint="Maximum number of candidates to merge and score"
                  value={investorLimit}
                  onChange={setInvestorLimit}
                  min={10}
                  max={300}
                  step={1}
                />
              </div>

              <div className="flex justify-end pt-6 border-t border-border gap-3 mt-auto">
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
                  disabled={isSearching || !companyDescription || isSuspended}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    relative px-8 py-3.5 rounded-xl text-white font-bold text-[15px] tracking-wide flex items-center justify-center gap-2 overflow-hidden transition-all duration-300 min-w-[220px]
                    ${(isSearching || !companyDescription || isSuspended)
                      ? "bg-[var(--rw-surface-hover)] text-[var(--rw-text-muted)] shadow-inner pointer-events-none"
                      : "bg-gradient-to-r from-brand-blue to-brand-cyan shadow-[0_0_15px_rgba(48,143,239,0.4)] hover:shadow-[0_0_25px_rgba(78,200,239,0.6)] border border-brand-sky/50"
                    }
                  `}
                  title={isSuspended ? "Account suspended" : ""}
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Discovering... (Up to 3 min)</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      <span>{isSuspended ? "Account Suspended" : "Run Discovery"}</span>
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
          <div className="mt-4">
            <ExportProgress isActive={isSearching} logType="investors" />
          </div>
        </div>
        
        {/* Right Side Visualizer */}
        <div className="flex flex-col min-h-[500px]">
          <InvestorVisualizer 
            status={isSearching ? "scanning" : (results?.investors?.length > 0 ? "complete" : (companyDescription.trim() ? "locked" : "idle"))} 
            targetUrl={companyDescription.substring(0, 20) + "..."}
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
              <div className="bg-surface rounded-3xl shadow-md border border-border p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#308fef]/10 to-transparent rounded-full -mr-10 -mt-10 pointer-events-none" />
                <h3 className="text-lg font-bold text-[#191919] mb-5 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#308fef]" />
                  Search Criteria
                </h3>
                <div className="space-y-3">
                  <p className="flex items-center gap-2 text-gray-600 font-medium text-sm">
                    <Briefcase className="w-4 h-4 text-gray-400" />
                    Industry: {industry}
                  </p>
                  <p className="flex items-center gap-2 text-gray-600 font-medium text-sm">
                    <Search className="w-4 h-4 text-gray-400" />
                    Target Audience: {targetAudience}
                  </p>
                  <p className="flex items-center gap-2 text-gray-600 font-medium text-sm">
                    <TrendingUp className="w-4 h-4 text-gray-400" />
                    Stage: {investmentStage}
                  </p>
                  {results.metadata?.eligibility_stats && (
                    <div className="flex flex-col gap-1.5 mt-2">
                      <p className="flex items-center justify-between text-gray-600 font-medium text-xs">
                        <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-green-500" /> Scraped Successfully:</span>
                        <span className="font-bold text-gray-800">{results.metadata.eligibility_stats.success}</span>
                      </p>
                      <p className="flex items-center justify-between text-gray-600 font-medium text-xs">
                        <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-amber-500" /> Scrape Failed:</span>
                        <span className="font-bold text-gray-800">{results.metadata.eligibility_stats.scrape_failed}</span>
                      </p>
                      <p className="flex items-center justify-between text-gray-600 font-medium text-xs">
                        <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-gray-400" /> No URL Available:</span>
                        <span className="font-bold text-gray-800">{results.metadata.eligibility_stats.no_url}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-surface rounded-3xl shadow-md border border-border p-6 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-500/10 to-transparent rounded-full -mr-10 -mt-10 pointer-events-none" />
                <h3 className="text-lg font-bold text-[#191919] mb-5 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  Pipeline Status
                </h3>
                <div className="space-y-3">
                  {results.metadata?.source_status && Object.entries(results.metadata.source_status).map(([key, status]) => {
                    if (typeof status !== 'string') return null;
                    return (
                    <div key={key} className="flex items-center justify-between p-3 bg-[var(--rw-surface-hover)] rounded-xl border border-border">
                      <span className="font-medium text-gray-600 capitalize text-xs">
                        {key.replace(/-/g, " ")}
                      </span>
                      <span className={`text-[11px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
                        status.includes('success') ? 'bg-green-100 text-green-700' :
                        status === 'skipped' ? 'bg-gray-200 text-gray-600' :
                        status.includes('failed') ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {status.includes('success') ? 'SUCCESS' : status.split(':')[0]}
                      </span>
                    </div>
                  )})}
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
          <InvestorResultsBottomSheet 
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
