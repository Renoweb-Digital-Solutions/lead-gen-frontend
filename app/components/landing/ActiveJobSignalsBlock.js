"use client";

import React from "react";
import Link from "next/link";
import { Briefcase, TrendingUp, Clock, MapPin, Building, ArrowRight, Info, Check } from "lucide-react";

export default function ActiveJobSignalsBlock() {
  return (
    <section className="py-24 bg-white border-t border-slate-100 relative">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-semibold uppercase tracking-wider">
              Business Intelligence Signal
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-slate-900 tracking-tight leading-tight">
              Active Job Signals: A Business Signal, Not a Hiring Tool
            </h2>

            <p className="text-base sm:text-lg text-slate-700 leading-relaxed">
              A company’s recent hiring activity can reveal something about what is happening inside the business.
            </p>

            <p className="text-base text-slate-600 leading-relaxed">
              A new sales team, technology role, operations expansion or other active opening may indicate that a company is investing, changing or growing.
            </p>

            <p className="text-base text-slate-600 leading-relaxed">
              SimpLeads lets you use job activity as an additional layer of business intelligence by filtering relevant job titles, locations and recency.
            </p>

            {/* Nuance callout */}
            <div className="bg-slate-50 border-l-4 border-amber-400 p-4 rounded-r-xl">
              <p className="text-sm text-slate-700 font-medium leading-relaxed">
                It does not mean that every actively hiring company is ready to buy. Instead, Active Job Signals give you another piece of context to consider when deciding where your outreach deserves attention.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/features/activejobsignals"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#023dbb] text-white hover:bg-[#023dbb]/90 transition-colors text-sm font-semibold shadow-xs"
              >
                <span>See Active Job Signals</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Visual Signal Widget */}
          <div className="lg:col-span-5">
            <div className="group bg-slate-900 text-white rounded-2xl p-7 border border-slate-800 shadow-xl relative overflow-hidden transition-all duration-300 hover:border-slate-700 hover:shadow-2xl hover:shadow-slate-950/80 hover:-translate-y-1.5">
              {/* Subtle ambient light */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="relative z-10 flex items-center justify-between pb-5 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 group-hover:bg-amber-500/20 transition-all duration-300">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-amber-100 transition-colors">Live Account Hiring Signal</h3>
                    <p className="text-xs text-slate-400">Business context layer</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Expansion Signal
                </span>
              </div>

              {/* Sample Signal Feed */}
              <div className="relative z-10 mt-5 space-y-3 font-sans">
                {/* Signal Card 1 */}
                <div className="group/item bg-slate-800/80 hover:bg-slate-800 rounded-xl p-4 border border-slate-700/80 hover:border-amber-500/50 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/40 cursor-pointer">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                    <span className="font-semibold text-slate-200 group-hover/item:text-white transition-colors">Acme Cloud Technologies</span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-400 group-hover/item:text-amber-400/90 transition-colors">
                      <Clock className="w-3 h-3" /> 2 days ago
                    </span>
                  </div>
                  <div className="text-sm font-bold text-white mb-2 group-hover/item:text-amber-200 transition-colors">
                    Hiring: VP of Enterprise Sales (New Team Build)
                  </div>
                  <div className="flex flex-wrap gap-2 text-[11px]">
                    <span className="bg-slate-900/80 px-2 py-0.5 rounded text-slate-300 border border-slate-700 group-hover/item:border-slate-600 flex items-center gap-1 transition-colors">
                      <MapPin className="w-3 h-3 text-cyan-400" /> New York, NY
                    </span>
                    <span className="bg-amber-500/10 px-2 py-0.5 rounded text-amber-300 border border-amber-500/20 group-hover/item:border-amber-500/40 group-hover/item:bg-amber-500/20 transition-all">
                      Sales Outbound Expansion
                    </span>
                  </div>
                </div>

                {/* Signal Card 2 */}
                <div className="group/item bg-slate-800/80 hover:bg-slate-800 rounded-xl p-4 border border-slate-700/80 hover:border-cyan-500/50 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/40 cursor-pointer">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                    <span className="font-semibold text-slate-200 group-hover/item:text-white transition-colors">Northstar Financial</span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-400 group-hover/item:text-cyan-400/90 transition-colors">
                      <Clock className="w-3 h-3" /> 5 days ago
                    </span>
                  </div>
                  <div className="text-sm font-bold text-white mb-2 group-hover/item:text-cyan-200 transition-colors">
                    Hiring: Head of Information Security
                  </div>
                  <div className="flex flex-wrap gap-2 text-[11px]">
                    <span className="bg-slate-900/80 px-2 py-0.5 rounded text-slate-300 border border-slate-700 group-hover/item:border-slate-600 flex items-center gap-1 transition-colors">
                      <MapPin className="w-3 h-3 text-cyan-400" /> Austin, TX
                    </span>
                    <span className="bg-blue-500/10 px-2 py-0.5 rounded text-cyan-300 border border-blue-500/20 group-hover/item:border-cyan-500/40 group-hover/item:bg-cyan-500/20 transition-all">
                      Infrastructure Upgrade
                    </span>
                  </div>
                </div>
              </div>

              {/* Monospace Micro-legend */}
              <div className="relative z-10 mt-5 pt-4 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span className="text-emerald-400 font-mono text-[11px] font-medium tracking-wide">
                    Signal Status: Verified Live
                  </span>
                </div>
                <span className="text-amber-400/90 font-mono text-[11px] hover:text-amber-300 transition-colors">
                  Filters: Title · Location · Recency
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
