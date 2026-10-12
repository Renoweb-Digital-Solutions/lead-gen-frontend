"use client";

import React, { useState } from "react";
import { Users, Building2, Briefcase, Sparkles, Download, CheckCircle2, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";

import landingData from "@/data/landingData.json";

const ICON_MAP = {
  Users,
  Building2,
  Briefcase,
  Sparkles,
  Download
};

const steps = landingData.pipelineSteps.map((s) => ({
  ...s,
  icon: ICON_MAP[s.icon] || Users
}));

export default function PipelineSteps() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="pipeline" className="py-24 bg-slate-50/60 border-t border-slate-200/80 relative overflow-hidden">
      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-[#023dbb] text-xs font-semibold uppercase tracking-wider mb-4">
            Five-Step Prospecting Pipeline
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-slate-900 tracking-tight mb-6">
            One Pipeline. Five Steps. From Discovery to Priority.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            SimpLeads brings the core prospecting workflow into one guided pipeline. Instead of finding contacts in one place, researching companies somewhere else and manually deciding which leads deserve attention, you can move from People to Company, Jobs, Scoring and finally Export in one workflow.
          </p>
        </div>

        {/* Step Progress Bar / Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 mb-10 max-w-5xl mx-auto">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isActive = activeStep === idx;
            return (
              <button
                key={s.step}
                onClick={() => setActiveStep(idx)}
                className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                  isActive 
                    ? "bg-white border-[#023dbb] shadow-md shadow-[#023dbb]/5 ring-1 ring-[#023dbb]" 
                    : "bg-white/70 border-slate-200 hover:bg-white hover:border-slate-300 text-slate-600"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-mono text-xs font-bold transition-colors ${
                  isActive ? "bg-[#023dbb] text-white" : "bg-slate-100 text-slate-500"
                }`}>
                  {s.step}
                </div>
                <div className="min-w-0">
                  <div className={`text-xs font-medium uppercase tracking-wider ${isActive ? "text-[#023dbb]" : "text-slate-400"}`}>
                    Step {s.step}
                  </div>
                  <div className={`text-sm font-semibold truncate ${isActive ? "text-slate-900" : "text-slate-700"}`}>
                    {s.name}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Stage Highlight Card */}
        {(() => {
          const current = steps[activeStep];
          const Icon = current.icon;
          return (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-8 sm:p-10 shadow-sm max-w-6xl mx-auto mb-16">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#023dbb]/10 text-[#023dbb] flex items-center justify-center">
                    <Icon className="w-7 h-7 stroke-[1.75]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {current.step} — {current.name}
                      </span>
                      <span className="text-xs font-medium text-[#023dbb] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                        {current.badge}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold font-display text-slate-900 mt-1">
                      {current.step} — {current.name}
                    </h3>
                  </div>
                </div>

                <Link
                  href={current.href}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[#023dbb] hover:text-[#023dbb]/80 transition-colors w-fit"
                >
                  Explore {current.name} documentation
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="pt-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                <div className="md:col-span-7 space-y-4">
                  <p className="text-sm sm:text-base font-medium text-slate-800">
                    {current.lead}
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {current.filters.map((filter, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-sm text-slate-600 bg-slate-50/70 border border-slate-200/60 rounded-lg p-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#023dbb] shrink-0 mt-0.5" />
                        <span>{filter}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="md:col-span-5 bg-slate-50 rounded-xl p-6 border border-slate-200/80 space-y-3">
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
                    Pipeline Role
                  </span>
                  <p className="text-sm text-slate-700 leading-relaxed font-normal">
                    {current.summary}
                  </p>
                  <div className="pt-2 flex justify-between items-center text-xs text-slate-500 font-mono">
                    <span>Stage {activeStep + 1} of 5</span>
                    <button 
                      onClick={() => setActiveStep((activeStep + 1) % steps.length)}
                      className="text-[#023dbb] font-sans font-medium flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      Next stage <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* All 5 Steps Detailed Grid (Full Crawlable / SEO-rich View) */}
        <div className="flex lg:grid lg:grid-cols-5 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 gap-4 xl:gap-5 scrollbar-thin">
          {steps.map((s, index) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="min-w-[250px] lg:min-w-0 flex-1 shrink-0 lg:shrink bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 flex flex-col justify-between hover:border-[#023dbb]/40 hover:shadow-md transition-all duration-200 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-bold text-[#023dbb] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                      {s.step}
                    </span>
                    <Icon className="w-4 h-4 text-slate-400 group-hover:text-[#023dbb] transition-colors" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-lg mb-2 font-display">
                    {s.step} — {s.name}
                  </h4>
                  <p className="text-xs text-slate-500 mb-3 font-medium leading-relaxed">
                    {s.lead}
                  </p>
                  <ul className="space-y-1.5 mb-4 text-xs text-slate-600">
                    {s.filters.map((f, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0 mt-1" />
                        <span className="leading-snug">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-2">
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {s.summary}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
