"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, XCircle, Sparkles, Filter, Users, ShieldAlert } from "lucide-react";

export default function LeadGenVsQual() {
  return (
    <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
            Core Philosophy
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold tracking-tight mb-6">
            Lead Generation ≠ Lead Qualification
          </h2>
          <p className="text-xl sm:text-2xl text-slate-300 font-medium max-w-2xl mx-auto mb-4">
            Finding 1,000 contacts does not tell you which 100 deserve your attention.
          </p>
          <p className="text-slate-400 text-base leading-relaxed max-w-2xl mx-auto">
            Traditional prospecting workflows often stop after contact discovery. The salesperson or marketer is then left with another task: researching each company, understanding the opportunity and deciding who should be contacted first.
          </p>
        </div>

        {/* The Separation Grid */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          
          {/* Box 1: Lead Gen */}
          <div className="group relative bg-slate-800/60 rounded-2xl p-8 border border-slate-700/80 backdrop-blur-xs flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:border-slate-500 hover:shadow-2xl hover:shadow-black/50 cursor-default overflow-hidden">
            {/* Ambient hover light */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-slate-400/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 group-hover:text-slate-300 transition-colors">
                  Step 1
                </span>
                <div className="w-9 h-9 rounded-lg bg-slate-700/40 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:scale-110 group-hover:bg-slate-700 transition-all duration-300">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 font-display group-hover:text-slate-100 transition-colors">
                Lead Generation
              </h3>
              <p className="text-slate-300 text-base leading-relaxed">
                Helps you find potential contacts.
              </p>
            </div>
            <div className="relative z-10 mt-8 pt-4 border-t border-slate-700/60 text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
              Focuses on raw discovery across people, titles, seniority, and company domains.
            </div>
          </div>

          {/* Box 2: Lead Qualification */}
          <div className="group relative bg-gradient-to-br from-blue-950/80 via-slate-900 to-slate-900 rounded-2xl p-8 border border-blue-500/40 shadow-lg shadow-blue-950/50 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-cyan-400 hover:shadow-[0_0_40px_rgba(6,182,212,0.25)] cursor-default">
            {/* Ambient hover glow */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-400/15 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500 pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400 group-hover:text-cyan-300 transition-colors">
                  Step 2
                </span>
                <div className="w-9 h-9 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-115 group-hover:rotate-12 group-hover:bg-cyan-500/20 group-hover:border-cyan-400/50 transition-all duration-300">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 font-display group-hover:text-cyan-200 transition-colors">
                Lead Qualification
              </h3>
              <p className="text-cyan-100 text-base leading-relaxed">
                Helps you determine which of those contacts are worth prioritizing.
              </p>
            </div>
            <div className="relative z-10 mt-8 pt-4 border-t border-blue-500/20 text-xs text-blue-200/80 group-hover:text-blue-100 transition-colors">
              Evaluates Need, Urgency, Relevance, and Authority before you start outreach.
            </div>
          </div>

        </div>

        {/* Narrative Flow banner */}
        <div className="max-w-4xl mx-auto bg-slate-800/40 rounded-2xl border border-slate-700/60 p-8 text-center space-y-6">
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            SimpLeads separates those two jobs. SimpLeads combines people and company information with available business signals and AI-assisted qualification so your prospecting workflow can move from:
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-sm sm:text-base font-semibold">
            <span className="px-3.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200">
              discovery
            </span>
            <ArrowRight className="w-4 h-4 text-cyan-400" />
            <span className="px-3.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200">
              context
            </span>
            <ArrowRight className="w-4 h-4 text-cyan-400" />
            <span className="px-3.5 py-1.5 rounded-lg bg-blue-900/60 border border-blue-500/40 text-cyan-300">
              qualification
            </span>
            <ArrowRight className="w-4 h-4 text-cyan-400" />
            <span className="px-3.5 py-1.5 rounded-lg bg-[#023dbb] text-white shadow-xs">
              priority
            </span>
          </div>

          <div className="pt-2">
            <Link
              href="/features/ai-lead-scoring"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#023dbb] text-white hover:bg-blue-600 transition-colors text-sm font-semibold shadow-md shadow-blue-900/30"
            >
              <span>See AI Lead Qualification</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
