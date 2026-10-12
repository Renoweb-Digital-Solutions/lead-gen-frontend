"use client";

import React from "react";
import { ShieldCheck, AlertCircle, XCircle, CheckCircle2 } from "lucide-react";

import landingData from "@/data/landingData.json";

const { nonGuarantees } = landingData;

export default function TrustTransparencyBand() {
  return (
    <section className="py-20 bg-slate-900 text-white border-t border-slate-800">
      <div className="max-w-5xl mx-auto px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
            Beta & Decision-Support Notice
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight mb-4 text-white">
            Built for Practical Prospecting. Transparent About What AI Can Do.
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            SimpLeads is currently in public beta. Some features are experimental, and AI-generated content may occasionally make mistakes. Lead qualification and scoring should be used as decision-support, not as a substitute for human judgment.
          </p>
        </div>

        {/* What SimpLeads Does Not Guarantee */}
        <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-8 sm:p-10 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <AlertCircle className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 font-display">
              SimpLeads does not guarantee:
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {nonGuarantees.map((item, idx) => (
              <div 
                key={idx}
                className="flex items-center gap-2.5 bg-slate-900/70 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-slate-300"
              >
                <XCircle className="w-4 h-4 text-amber-400/80 shrink-0" />
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Straightforward Goal */}
        <div className="text-center bg-blue-950/40 border border-blue-500/20 rounded-xl p-6">
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400 mb-1.5">
            The goal is straightforward:
          </div>
          <p className="text-lg sm:text-xl font-medium text-slate-100">
            Give you better information and better prioritization before you spend time on outreach.
          </p>
        </div>

      </div>
    </section>
  );
}
