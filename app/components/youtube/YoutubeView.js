"use client";

// # Analytics metadata is allowlisted; search text and result contents are never captured.
import { trackInteraction } from "../../lib/interactionAnalytics";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Info, Loader2, Search, Video, X } from "lucide-react";
import { Country } from "country-state-city";
import { cancelYoutubeJob, fetchYoutubeJobStatus, fetchYoutubeLeads } from "../../lib/api";
import { selectYoutubeChannels, youtubeCsv, YOUTUBE_FIELDS } from "../../lib/youtube";
import { useSessionState } from "../../hooks/useSessionState";
import { useAuth } from "../../lib/AuthContext";
import YoutubeResultsBottomSheet from "./YoutubeResultsBottomSheet";
import ExportProgress from "../ExportProgress";
import RippleArrivalSignal from "../gmaps/RippleArrivalSignal";
import SignalScannerPanel from "./SignalScannerPanel";

// # Search and filter state share one result list with CSV and JSON exports.
export default function YoutubeView() {
  const { isSuspended } = useAuth();
  const [query, setQuery] = useSessionState("youtube-keyword", "");
  const [target, setTarget] = useSessionState("youtube-target-count", 50);
  const [result, setResult] = useSessionState("youtube-results-v2", null);
  const [minSubscribers, setMinSubscribers] = useState("");
  const [country, setCountry] = useState("");
  const [onlyEmail, setOnlyEmail] = useState(false);
  const [sort, setSort] = useState("subscribers");
  const [searching, setSearching] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const openSheet = useCallback(() => setIsSheetOpen(true), []);
  const closeSheet = useCallback(() => setIsSheetOpen(false), []);
  const [cancelling, setCancelling] = useState(false);
  const [canCancel, setCanCancel] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState({ message: "", percent: 0 });
  const jobRef = useRef(null);
  const timerRef = useRef(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      clearTimeout(timerRef.current);
      // # Leaving the tool stops paid work rather than abandoning an active actor.
      if (jobRef.current) cancelYoutubeJob(jobRef.current).catch(() => {});
      jobRef.current = null;
    };
  }, []);

  const channels = useMemo(() => result?.channels || [], [result]);
  // # Populate countries before searching, using only the installed package's country list.
  const countries = useMemo(() => Country.getAllCountries().map(({ name }) => name).sort(), []);
  const ageAvailable = channels.some((row) => row.joinedDate);
  const visibleChannels = useMemo(() => selectYoutubeChannels(channels, {
    minSubscribers, country, onlyEmail, sort: ageAvailable ? sort : "subscribers",
  }), [channels, minSubscribers, country, onlyEmail, sort, ageAvailable]);
  const visibleEmailCount = visibleChannels.filter((row) => row.email).length;
  const inputClass = "w-full px-4 py-3 bg-surface border border-border rounded-xl text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500";

  // # Share filter controls between the form and the open results sheet.
  const renderFilters = () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="text-sm font-semibold text-brand-dark">Minimum subscribers
            <input data-analytics-control="min_subscribers" className={`${inputClass} mt-2`} type="number" min={0} step={1} placeholder="No minimum" value={minSubscribers} onChange={(e) => setMinSubscribers(e.target.value)} />
          </label>
          <label className="text-sm font-semibold text-brand-dark">Country
            <select data-analytics-control="country" className={`${inputClass} mt-2`} value={country} onChange={(e) => setCountry(e.target.value)}><option value="">Any</option>{countries.map((name) => <option key={name} value={name}>{name}</option>)}</select>
          </label>
          <label className="text-sm font-semibold text-brand-dark">Sort by
            <select data-analytics-control="sort" className={`${inputClass} mt-2`} value={ageAvailable ? sort : "subscribers"} onChange={(e) => setSort(e.target.value)}><option value="subscribers">Subscribers (highest first)</option><option value="age" disabled={!ageAvailable}>Channel age (oldest first)</option></select>
          </label>
        </div>
  );

  const handleSearch = async (event) => {
    event.preventDefault();
    if (searching || isSuspended) return;
    if (!query.trim() || !Number.isInteger(Number(target)) || Number(target) < 1 || Number(target) > 500) {
      setError("Enter a niche and location, and a target between 1 and 500 channels.");
      return;
    }
    // # Track validated submission without awaiting analytics or changing pipeline inputs.
    trackInteraction("run_submitted", "youtube", { settings: { result_limit: Number(target), only_email: onlyEmail } });
    setSearching(true);
    setIsSheetOpen(false);
    setCancelling(false);
    setCanCancel(false);
    setError("");
    setResult(null);
    setProgress({ message: "Starting YouTube search...", percent: 0 });
    try {
      const job = await fetchYoutubeLeads({ query: query.trim(), target_count: Number(target) });
      if (!mountedRef.current) {
        await cancelYoutubeJob(job.job_id);
        return;
      }
      jobRef.current = job.job_id;
      setCanCancel(true);
      // # Poll authenticated snapshots so progress and cancellation survive socket failures.
      const poll = async () => {
        if (!mountedRef.current || jobRef.current !== job.job_id) return;
        try {
          const snapshot = await fetchYoutubeJobStatus(job.job_id);
          if (!mountedRef.current || jobRef.current !== job.job_id) return;
          setError("");
          setProgress({ message: snapshot.message, percent: snapshot.percent || 0 });
          setResult({ ...snapshot.result, channels: snapshot.result?.channels || snapshot.yt_data || [], costUsd: snapshot.cost_usd, message: snapshot.message, keywords: snapshot.keywords || [] });
          if (["completed", "failed", "cancelled"].includes(snapshot.status)) {
            jobRef.current = null;
            setSearching(false);
            setCancelling(false);
            setCanCancel(false);
            if (snapshot.status === "failed") setError(snapshot.message || "YouTube search failed. Any partial results are available below.");
            return;
          }
        } catch (err) {
          if (!mountedRef.current || jobRef.current !== job.job_id) return;
          setError(`${err.message} Reconnecting automatically; you can still cancel the search.`);
        }
        timerRef.current = setTimeout(poll, 2000);
      };
      await poll();
    } catch (err) {
      if (!mountedRef.current) return;
      setError(typeof err.message === "string" ? err.message : "Could not start YouTube search. Please try again.");
      setSearching(false);
    }
  };

  const handleCancel = async () => {
    if (!jobRef.current) return;
    setCancelling(true);
    try {
      await cancelYoutubeJob(jobRef.current);
      if (mountedRef.current) setProgress((current) => ({ ...current, message: "Cancelling search..." }));
    } catch (err) {
      if (mountedRef.current) {
        setError(err.message);
        setCancelling(false);
      }
    }
  };

  const exportResults = (format) => {
    // # Both formats export exactly the current filtered order using the documented fields.
    const rows = visibleChannels.map((row) => Object.fromEntries(YOUTUBE_FIELDS.map((field) => [field, row[field] ?? null])));
    const content = format === "csv" ? youtubeCsv(rows) : JSON.stringify({ query: result.query, totalFound: rows.length, withEmail: visibleEmailCount, channels: rows }, null, 2);
    const url = URL.createObjectURL(new Blob([content], { type: format === "csv" ? "text/csv;charset=utf-8" : "application/json;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `youtube_leads.${format}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="rw-main-content w-full min-h-screen pb-20">
      {/* # One search screen keeps filters and results accessible together. */}
      <div className="mb-8 flex items-center gap-3">
        <Video className="w-9 h-9 text-red-500" />
        <div><h1 className="text-2xl font-bold text-brand-dark font-display">YouTube Leads</h1><p className="text-sm text-gray-500">Discover channels in your niche and their public business emails.</p></div>
      </div>
      {error && <div role="alert" className="mb-5 p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm">{error}</div>}
      {/* # Restore the original animated scanner beside the updated search controls. */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-6 items-stretch mb-6">
      <div className="min-w-0">
      <form onSubmit={handleSearch} className="min-w-0 bg-surface border border-border rounded-2xl p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_180px] gap-4">
          <label className="text-sm font-semibold text-brand-dark">Niche and location
            <input className={`${inputClass} mt-2`} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="e.g. vloggers in mumbai" maxLength={500} required disabled={searching} />
          </label>
          <label className="text-sm font-semibold text-brand-dark">Target channels
            <input data-analytics-control="result_limit" className={`${inputClass} mt-2`} type="number" min={1} max={500} step={1} value={target} onChange={(e) => setTarget(e.target.value)} required disabled={searching} />
          </label>
        </div>
        {renderFilters()}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <label className="flex items-center gap-2 text-sm text-brand-dark"><input data-analytics-control="only_email" type="checkbox" checked={onlyEmail} onChange={(e) => setOnlyEmail(e.target.checked)} className="accent-red-500" />Only channels with email</label>
          <div className="flex items-center gap-3">
            {searching && <button type="button" data-analytics-action="cancel_search" onClick={handleCancel} disabled={cancelling || !canCancel} className="flex items-center gap-2 px-5 py-3 rounded-xl border border-border text-sm disabled:opacity-50"><X className="w-4 h-4" />{cancelling ? "Cancelling..." : "Cancel"}</button>}
            <button data-analytics-action="start_search" type="submit" disabled={searching || isSuspended} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 text-white font-semibold text-sm disabled:opacity-50">{searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}{isSuspended ? "Account suspended" : searching ? "Searching..." : "Search"}</button>
          </div>
        </div>
        {!!result?.keywords?.length && <p className="text-xs text-gray-500">Search angles: {result.keywords.join(" · ")}</p>}
        {result && !searching && !ageAvailable && <p className="text-xs text-gray-500">Channel age is unavailable for this data source in these results.</p>}
        <details className="text-xs text-gray-500"><summary className="cursor-pointer inline-flex items-center gap-1"><Info className="w-3.5 h-3.5" />About these results</summary><ul className="mt-2 space-y-1 list-disc pl-5"><li>Country comes from the channel’s own profile and may be blank.</li><li>Email means a publicly listed business email; some channels have none.</li><li>Use minimum subscribers to filter very small channels. Inactive channels may appear.</li><li>Average views per video is approximate and includes Shorts.</li></ul></details>
      </form>
      {/* # Reuse the shared elapsed timer, running log, and progress styling. */}
      <ExportProgress isActive={searching} logType="youtube" totalResults={Number(target)} progressState={progress} />
      </div>
      <div className="min-w-0">
        <SignalScannerPanel
          status={searching ? "scanning" : channels.length > 0 ? "complete" : "idle"}
          channelCount={channels.length}
        />
      </div>
      </div>
      {/* # Results arrive through the same spring sheet and ripple signal as other tools. */}
      {result && !searching && <>
        <RippleArrivalSignal isActive={true} />
        <YoutubeResultsBottomSheet
          isOpen={isSheetOpen}
          onOpen={openSheet}
          onClose={closeSheet}
          onExport={() => exportResults("csv")}
          onExportJson={() => exportResults("json")}
          data={visibleChannels}
          totalFound={result.totalFound ?? channels.length}
          withEmail={result.withEmail ?? channels.filter((row) => row.email).length}
          costUsd={result.costUsd}
          query={result.query}
          message={result.message}
          filters={<>
            {renderFilters()}
            <label className="mt-3 flex items-center gap-2 text-xs text-brand-dark"><input data-analytics-control="only_email" type="checkbox" checked={onlyEmail} onChange={(e) => setOnlyEmail(e.target.checked)} className="accent-red-500" />Only channels with email</label>
            {!ageAvailable && <p className="mt-2 text-xs text-gray-500">Channel age is unavailable for this data source in these results.</p>}
          </>}
        />
      </>}

    </div>
  );
}
