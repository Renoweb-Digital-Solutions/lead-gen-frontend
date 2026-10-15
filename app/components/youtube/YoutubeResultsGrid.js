"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Check, Copy, Eye, Globe2, Mail, MapPin, Play, Users, CalendarDays } from "lucide-react";
import { safeWebsite } from "../../lib/youtube";

// # Deterministic visual identities distinguish channels without inventing profile images.
const PALETTES = [
  ["#ef4444", "#f97316"], ["#6366f1", "#a855f7"],
  ["#0891b2", "#14b8a6"], ["#db2777", "#f43f5e"],
];
const compactNumber = (value) => new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(Number(value || 0));
const fullNumber = (value) => Number(value || 0).toLocaleString();

export default function YoutubeResultsGrid({ data }) {
  const [copied, setCopied] = useState(null);
  const [copyError, setCopyError] = useState("");
  const reduceMotion = useReducedMotion();
  const copyEmail = async (email) => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(email);
      setCopyError("");
    } catch {
      setCopyError("Could not copy automatically. Select the email and copy it manually.");
    }
  };

  if (!data?.length) return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center text-gray-500">
      <div className="mb-5 rounded-3xl border border-red-500/10 bg-red-500/5 p-5"><Users className="h-9 w-9 text-red-400" /></div>
      <h3 className="text-xl font-semibold text-brand-dark">No matching creators</h3>
      <p className="mt-2 max-w-sm text-sm">Try lowering the minimum subscribers or removing the country or email filter.</p>
    </div>
  );

  return (
    <div>
      {copyError && <p role="alert" className="mb-4 text-sm text-red-600">{copyError}</p>}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {data.map((channel, index) => {
          const name = channel.channelName || "Unnamed channel";
          const initials = Array.from(name.trim().split(/\s+/).map((word) => Array.from(word)[0]).slice(0, 2)).join("").toUpperCase();
          const hash = Array.from(channel.channelUrl).reduce((value, char) => value + char.charCodeAt(0), 0);
          const [accent, secondary] = PALETTES[hash % PALETTES.length];
          const website = safeWebsite(channel.website);
          return (
            <motion.article
              key={channel.channelUrl}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(index, 8) * 0.035 }}
              className="group flex min-w-0 flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-sm transition-shadow hover:shadow-lg"
            >
              {/* # A channel identity strip, audience hero, and contact footer form each creator card. */}
              <div className="relative overflow-hidden px-5 pt-5 pb-4" style={{ background: `linear-gradient(125deg, ${accent}14, ${secondary}05)` }}>
                <div aria-hidden="true" className="pointer-events-none absolute -right-7 -top-10 h-36 w-36 rounded-full border-[18px]" style={{ borderColor: `${accent}08` }} />
                <div className="relative flex items-start justify-between gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-base font-bold text-white shadow-sm" style={{ background: `linear-gradient(135deg, ${accent}, ${secondary})` }}>{initials}</span>
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${channel.email ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600" : "border-border bg-surface text-gray-400"}`}><span className={`h-1.5 w-1.5 rounded-full ${channel.email ? "bg-emerald-500" : "bg-gray-400"}`} />{channel.email ? "PUBLIC EMAIL" : "NO EMAIL"}</span>
                </div>
                <a href={channel.channelUrl} target="_blank" rel="noopener noreferrer" className="relative mt-4 flex items-start justify-between gap-2 text-brand-dark hover:underline">
                  <h3 className="line-clamp-2 text-lg font-bold leading-snug tracking-tight">{name}</h3><ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-gray-400 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500"><span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{channel.country || "Country unavailable"}</span><span className="inline-flex items-center gap-1" title={channel.joinedDate ? `Joined ${channel.joinedDate}` : "Join date unavailable"}><CalendarDays className="h-3 w-3" />{channel.channelAgeYears == null ? "Age unavailable" : `${Number(channel.channelAgeYears).toFixed(1)} years`}</span></div>
              </div>
              <div className="flex-1 px-5 py-4">
                <div className="flex items-end justify-between gap-2"><div><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-400">Subscriber audience</p><p className="mt-1 text-4xl font-bold tracking-tighter text-brand-dark tabular-nums" title={`${fullNumber(channel.subscribers)} subscribers`}>{compactNumber(channel.subscribers)}</p></div><Users className="mb-1 h-7 w-7" style={{ color: `${accent}60` }} /></div>
                <dl className="mt-5 grid grid-cols-3 gap-2 border-t border-border pt-4">
                  {[{ icon: Eye, label: "Total views", value: channel.viewCount }, { icon: Play, label: "Videos", value: channel.videoCount }, { icon: Eye, label: "Avg. views ≈", value: channel.averageViewsPerVideo }].map(({ icon: Icon, label, value }) => <div key={label} title={`${fullNumber(value)}${label === "Avg. views ≈" ? " average views per video (approx., includes Shorts)" : ""}`}><dt className="mb-1 flex items-center gap-1 text-[10px] text-gray-400"><Icon className="h-3 w-3" />{label}</dt><dd className="text-sm font-bold text-brand-dark tabular-nums">{compactNumber(value)}</dd></div>)}
                </dl>
                {channel.joinedDate && <p className="mt-3 text-[10px] text-gray-400">On YouTube since {new Date(`${channel.joinedDate}T00:00:00Z`).toLocaleDateString("en", { month: "short", year: "numeric", timeZone: "UTC" })}</p>}
              </div>
              <div className="border-t border-border p-4">
                {channel.email ? <div className="flex items-center gap-2 rounded-xl border border-emerald-500/15 bg-emerald-500/5 px-3 py-2.5"><Mail className="h-4 w-4 shrink-0 text-emerald-600" /><span className="min-w-0 flex-1 select-all break-all text-xs font-medium text-brand-dark">{channel.email}</span><button type="button" onClick={() => copyEmail(channel.email)} aria-label={`Copy ${channel.email}`} className="shrink-0 rounded-lg p-2 text-emerald-600 transition-colors hover:bg-emerald-500/10">{copied === channel.email ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}</button></div> : <div className="flex items-center gap-2 rounded-xl border border-dashed border-border px-3 py-4 text-xs text-gray-400"><Mail className="h-4 w-4" />No public business email</div>}
                <div className="mt-3 flex items-center justify-between gap-3 text-[11px]"><span className="font-mono text-gray-400">#{String(index + 1).padStart(2, "0")}</span>{website ? <a href={website} target="_blank" rel="noopener noreferrer" className="flex min-w-0 items-center gap-1 text-gray-500 hover:text-brand-blue"><Globe2 className="h-3 w-3 shrink-0" /><span className="truncate">{new URL(website).hostname.replace(/^www\./, "")}</span><ArrowUpRight className="h-3 w-3 shrink-0" /></a> : <span className="text-gray-400">No website listed</span>}</div>
              </div>
            </motion.article>
          );
        })}
      </div>
      <p className="mt-7 text-center text-xs text-gray-400" role="status">{data.length} creators in your current view · Average views include Shorts</p>
      <span className="sr-only" aria-live="polite">{copied ? `Copied ${copied}` : ""}</span>
    </div>
  );
}
