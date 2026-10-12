"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, Building, MapPin, Download, BookOpen, ExternalLink, Phone, Mail, X, Globe, ChevronDown } from "lucide-react";
import TagInput from "../inputs/TagInput";
import DirectoryNetworkPanel from "./DirectoryNetworkPanel";
import ExportProgress from "../ExportProgress";
import ResultsBottomSheet from "../gmaps/ResultsBottomSheet";
import RippleArrivalSignal from "../gmaps/RippleArrivalSignal";
import { fetchB2BLeads } from "../../lib/api";
import { useSessionState } from "../../hooks/useSessionState";
import { useAuth } from "../../lib/AuthContext";

const DIRECTORIES = [
  { id: "yellowpages", label: "Yellow Pages (US)", icon: BookOpen, color: "text-yellow-600", bg: "bg-yellow-100", border: "border-yellow-200" },
  { id: "indiamart", label: "IndiaMART (B2B)", icon: Building, color: "text-blue-600", bg: "bg-blue-100", border: "border-blue-200" },
  { id: "europages", label: "Europages (Europe)", icon: Globe, color: "text-emerald-600", bg: "bg-emerald-100", border: "border-emerald-200" }
];

const EUROPAGES_COUNTRIES = {
  "AL": "Albania",
  "AT": "Austria",
  "BY": "Belarus",
  "BE": "Belgium",
  "BA": "Bosnia and Herzegovina",
  "BG": "Bulgaria",
  "HR": "Croatia",
  "CY": "Cyprus",
  "CZ": "Czechia",
  "DK": "Denmark",
  "EE": "Estonia",
  "FI": "Finland",
  "FR": "France",
  "DE": "Germany",
  "GR": "Greece",
  "HU": "Hungary",
  "IS": "Iceland",
  "IE": "Ireland",
  "IT": "Italy",
  "LV": "Latvia",
  "LT": "Lithuania",
  "LU": "Luxembourg",
  "MT": "Malta",
  "MD": "Moldova",
  "MC": "Monaco",
  "ME": "Montenegro",
  "NL": "Netherlands",
  "MK": "North Macedonia",
  "NO": "Norway",
  "PL": "Poland",
  "PT": "Portugal",
  "RO": "Romania",
  "RU": "Russia",
  "RS": "Serbia",
  "SK": "Slovakia",
  "SI": "Slovenia",
  "ES": "Spain",
  "SE": "Sweden",
  "CH": "Switzerland",
  "TR": "Turkey",
  "UA": "Ukraine",
  "GB": "United Kingdom"
};

function europagesTableRow(row) {
  // Older results kept in session storage already contain coordinates.
  let mapsUrl = row.google_maps_url || "";
  if (!mapsUrl) {
    const lat = Number(row.latitude);
    const lng = Number(row.longitude);
    const hasCoordinates = row.latitude !== "" && row.latitude != null && row.longitude !== "" && row.longitude != null;
    const validCoordinates = hasCoordinates && Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180;
    const query = validCoordinates
      ? `${row.latitude},${row.longitude}`
      : (row.address || row.city) ? [row.name, row.address, row.city, row.zip_code, row.country].filter(Boolean).join(", ") : "";
    if (query) mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  }
  return { ...row, google_maps_url: mapsUrl };
}

export default function B2BView() {
  const { isSuspended } = useAuth();
  // ─── Search Form State ───────────────────────────────────
  const [directory, setDirectory] = useSessionState("b2b-directory", "yellowpages");
  const [keywords, setKeywords] = useSessionState("b2b-keywords", []);
  const [location, setLocation] = useSessionState("b2b-location", "");
  const [countries, setCountries] = useState([]);
  const [enrichEmails, setEnrichEmails] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [progress, setProgress] = useState(null);
  const [resultDirectory, setResultDirectory] = useSessionState("b2b-result-directory", "yellowpages");
  const [resultCsv, setResultCsv] = useSessionState("b2b-result-csv", null);
  const [maxResults, setMaxResults] = useSessionState("b2b-max-results", 20);
  const isEuropages = directory === "europages";
  const hasKeywords = keywords.some(keyword => keyword.trim());
  const validMaxResults = Number.isInteger(Number(maxResults)) && Number(maxResults) >= 1 && Number(maxResults) <= 100;
  const canExtract = hasKeywords && validMaxResults && (isEuropages ? countries.length > 0 : Boolean(location.trim()));

  // ─── Pagination State ─────────────────────────────────────
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ─── Search State ────────────────────────────────────────
  const [isSearching, setIsSearching] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [resultData, setResultData] = useSessionState("b2b-results", null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

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
      setErrorMsg("Please add at least one keyword (e.g. 'plumber', 'software')");
      return;
    }
    if (isEuropages && countries.length === 0) {
      setErrorMsg("Please select at least one European country");
      return;
    }
    if (!validMaxResults) {
      setErrorMsg("Max Results must be a whole number from 1 to 100");
      return;
    }
    if (!isEuropages && !location.trim()) {
      setErrorMsg("Please enter a location");
      return;
    }

    setIsSearching(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    setResultData(null);
    setResultCsv(null);
    setResultDirectory(directory);
    setProgress(null);
    setIsSheetOpen(false);
    setCurrentPage(1);

    try {
      const jobData = await fetchB2BLeads({
        targetDirectory: directory,
        searchKeywords: keywords,
        maxResultsPerKeyword: Number(maxResults),
        ...(isEuropages
          ? { countries, enrich_emails: enrichEmails }
          : { location: location.trim() })
      });

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
          setProgress({ message: msg.message, percent: msg.percent });
          
          if (msg.status === "completed") {
            ws.close();
            try {
              let result = msg.data || [];
              const rows = Array.isArray(result) ? result : (result.data || []);
              setResultData(rows);
              setResultCsv(msg.csv ?? null);
              setSuccessMsg(msg.message || `Found ${rows.length} B2B leads from ${directory}!`);
            } catch (err) {
              setErrorMsg(err.message || "Failed to process final B2B leads.");
            } finally {
              setIsSearching(false);
            }
          } else if (msg.status === "failed") {
            ws.close();
            setErrorMsg(msg.message || msg.error || "B2B search failed.");
            setIsSearching(false);
          } else if (msg.status === "cancelled") {
            ws.close();
            setErrorMsg("Job cancelled.");
            setIsSearching(false);
          }
        } catch (err) {
          console.error("WS Message Error:", err);
        }
      };

      ws.onerror = () => {
        ws.close();
        setErrorMsg("WebSocket connection error occurred.");
        setIsSearching(false);
      };

    } catch (err) {
      if (err.message === "Failed to fetch") {
        setErrorMsg("We couldn't reach the search service right now. Please check your internet connection and try again in a moment.");
      } else {
        setErrorMsg(err.message || "Failed to fetch B2B leads. Please try again.");
      }
      setIsSearching(false);
    }
  };

  const handleAbort = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "abort" }));
      setErrorMsg("Cancelling search... Please wait.");
    }
  };

  const handleExportCsv = () => {
    if (!resultData || (resultData.length === 0 && resultCsv === null)) return;
    try {
      // Find all unique keys across all objects for dynamic columns
      const allKeys = new Set();
      resultData.forEach(row => Object.keys(row).forEach(k => allKeys.add(k)));
      const headers = Array.from(allKeys);
      
      const csvContent = resultCsv ?? [
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
      a.download = `b2b_leads_${resultDirectory}.csv`;
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
            key="error-alert"
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

      {resultData?.length === 0 && resultCsv !== null && !isSearching && (
        <button type="button" onClick={handleExportCsv} className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm text-brand-dark">
          <Download className="w-4 h-4" /> Download empty CSV
        </button>
      )}

      {/* ── ZONE 1: Search Form & Directory Network ─────────────────────────── */}
      <div className="mb-8 grid grid-cols-1 lg:grid-cols-[55%_45%] gap-6 items-stretch">
        <div className="flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface rounded-2xl p-6 lg:p-7 border border-border shadow-md h-full"
          >
            <div className="flex items-center gap-2.5 mb-6 pb-3 border-b border-brand-blue/5">
              <div className="w-1 h-3.5 bg-gradient-to-b from-brand-blue to-brand-cyan rounded-full" />
              <h2 className="text-[12px] font-bold uppercase tracking-[0.05em] text-brand-blue m-0 leading-none">
                Search Parameters
              </h2>
            </div>

        <div className="mb-6 pb-6 border-b border-border">
          <label className="text-[13px] font-semibold text-brand-dark block mb-3 uppercase tracking-wide">
            Select Data Source Directory
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {DIRECTORIES.map((dir) => {
              const isActive = directory === dir.id;
              const Icon = dir.icon;
              return (
                <button
                  key={dir.id}
                  type="button"
                  onClick={() => {
                    setDirectory(dir.id);
                    setCountrySearch("");
                    setErrorMsg(null);
                  }}
                  disabled={isSearching}
                  className={`
                    relative p-3 rounded-xl flex items-center gap-3 text-left transition-all border-2 disabled:opacity-60
                    ${isActive 
                      ? `${dir.border} ${dir.bg} shadow-sm ring-4 ring-opacity-20 ring-brand-blue` 
                      : "border-border hover:border-border bg-surface"
                    }
                  `}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isActive ? "bg-surface/60 shadow-sm" : "bg-[var(--rw-surface-hover)]"}`}>
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
            {isEuropages && (
              <motion.div
                key="europages-note"
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold px-4 py-3 rounded-xl flex items-center gap-2">
                  <Globe className="w-4 h-4 shrink-0" />
                  Europages covers European companies. Select one or more countries.
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
            {isEuropages && !hasKeywords && (
              <p className="mt-2 text-xs text-amber-700">Add at least one keyword and press Enter.</p>
            )}
          </div>

          {isEuropages ? (
            <div className="flex-1 relative group min-w-0">
              <label className="text-[13px] font-semibold text-brand-dark block mb-1.5 uppercase tracking-wide">
                Countries
              </label>
              <details className="relative">
                <summary className="list-none cursor-pointer px-4 py-2.5 text-sm bg-surface border border-border rounded-xl flex items-center justify-between gap-2 text-brand-dark">
                  {countries.length ? `${countries.length} selected` : "Select countries"}
                  <ChevronDown className="w-4 h-4 shrink-0" />
                </summary>
                <div className="absolute top-full mt-2 left-0 w-full min-w-[220px] z-30 bg-surface border border-border rounded-xl shadow-lg p-3">
                  <input
                    type="search"
                    aria-label="Search European countries"
                    className="w-full px-3 py-2 text-sm bg-surface border border-border rounded-lg text-brand-dark"
                    value={countrySearch}
                    onChange={e => setCountrySearch(e.target.value)}
                    placeholder="Search countries..."
                  />
                  <div className="max-h-56 overflow-y-auto mt-2">
                    {Object.entries(EUROPAGES_COUNTRIES)
                      .filter(([code, name]) => `${code} ${name}`.toLowerCase().includes(countrySearch.toLowerCase()))
                      .map(([code, name]) => (
                        <label key={code} className="flex items-center gap-2 py-2 text-sm text-brand-dark cursor-pointer">
                          <input
                            type="checkbox"
                            checked={countries.includes(code)}
                            onChange={e => setCountries(e.target.checked ? [...countries, code] : countries.filter(c => c !== code))}
                          />
                          {name}
                        </label>
                      ))}
                    {!Object.entries(EUROPAGES_COUNTRIES).some(([code, name]) => `${code} ${name}`.toLowerCase().includes(countrySearch.toLowerCase())) && (
                      <p className="text-xs text-gray-500 py-2">No countries match your search.</p>
                    )}
                  </div>
                </div>
              </details>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {countries.map(code => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setCountries(countries.filter(c => c !== code))}
                    aria-label={`Remove ${EUROPAGES_COUNTRIES[code]}`}
                    className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 px-2 py-1 text-xs"
                  >
                    {EUROPAGES_COUNTRIES[code]} <X className="w-3 h-3" />
                  </button>
                ))}
              </div>
              {countries.length === 0 && <p className="mt-2 text-xs text-amber-700">Select at least one country.</p>}
            </div>
          ) : (
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
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-surface border border-border rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all hover:border-indigo-500/40 text-brand-dark font-medium"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Mumbai, New York..."
              />
            </div>
          </div>

          )}

          <div className="flex-1 relative group">
            <label className="text-[13px] font-semibold text-brand-dark block mb-1.5 uppercase tracking-wide">
              Max Results
            </label>
            <input
              type="number"
              className="w-full px-4 py-2.5 text-sm bg-surface border border-border rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all hover:border-indigo-500/40 text-brand-dark font-medium"
              value={maxResults}
              onChange={(e) => setMaxResults(e.target.value)}
              min={1}
              max={100}
            />
          </div>
        </div>

        {!validMaxResults && <p className="mb-3 text-xs text-amber-700">Max Results must be a whole number from 1 to 100.</p>}
        {isEuropages && (
          <label className="flex items-center gap-2 text-sm text-brand-dark mb-6 cursor-pointer">
            <input type="checkbox" checked={enrichEmails} onChange={e => setEnrichEmails(e.target.checked)} />
            Find emails (extra cost, slower)
          </label>
        )}

        <div className="flex justify-end pt-4 border-t border-border gap-3">
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
            type="button"
            onClick={handleSearch}
            disabled={isSearching || isSuspended || !canExtract}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              relative px-8 py-3.5 rounded-xl text-white font-bold text-[15px] tracking-wide flex items-center justify-center gap-2 overflow-hidden transition-all duration-300 min-w-[220px]
              ${(isSearching || isSuspended || !canExtract)
                ? "bg-brand-sky shadow-inner pointer-events-none"
                : "bg-gradient-to-r from-brand-blue to-brand-cyan shadow-md hover:shadow-lg"
              }
            `}
            title={isSuspended ? "Account suspended" : ""}
          >
            {isSearching ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Extracting... (Up to 5 min)</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>{isSuspended ? "Account Suspended" : "Extract B2B Leads"}</span>
              </>
            )}
          </motion.button>
        </div>
          </motion.div>
          <div className="mt-4">
            {isSearching && progress?.message && (
              <p role="status" aria-live="polite" className="mb-2 text-sm text-gray-500">
                {progress.message}{progress.percent != null ? ` (${progress.percent}%)` : ""}
              </p>
            )}
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
            data={resultDirectory === "europages" ? resultData.map(europagesTableRow) : resultData}
            extraExcludeColumns={resultDirectory === "indiamart" ? ["price", "Price"] : resultDirectory === "europages" ? ["latitude", "longitude"] : []}
            subtitle={`${resultData.length} businesses from ${resultDirectory} ready for export`}
          />
        </>
      )}
    </div>
  );
}
