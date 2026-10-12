"use client";

import React from "react";
import Link from "next/link";
import { Users, Building2, Briefcase, Sparkles, Compass, Download, ArrowUpRight } from "lucide-react";

import landingData from "@/data/landingData.json";

const ICON_MAP = {
  Users,
  Building2,
  Briefcase,
  Sparkles,
  Compass,
  Download
};

const cards = landingData.featureQuestions.map((c) => ({
  ...c,
  icon: ICON_MAP[c.icon] || Users
}));

export default function FeatureQuestionsGrid() {
  return (
    <section className="py-24 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold uppercase tracking-wider mb-4 border border-slate-200">
            Prospecting Framework
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-slate-900 tracking-tight mb-4">
            Find Them. Understand Them. Qualify Them.
          </h2>
          <p className="text-lg text-slate-600">
            SimpLeads is built around these questions:
          </p>
        </div>

        {/* 6 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={i}
                className="bg-slate-50/60 rounded-2xl border border-slate-200/90 p-8 flex flex-col justify-between hover:bg-white hover:border-[#023dbb]/40 hover:shadow-lg hover:shadow-slate-100 transition-all duration-300 group"
              >
                <div>
                  {/* Question header */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-xs font-semibold text-[#023dbb] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                      {card.question}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      0{i + 1}
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-center gap-3.5 mb-4 mt-2">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 group-hover:text-[#023dbb] group-hover:border-[#023dbb]/30 transition-colors shadow-xs">
                      <Icon className="w-5 h-5 stroke-[1.75]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-xl font-display">
                        {card.title}
                      </h3>
                    </div>
                  </div>

                  {/* Body */}
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    {card.body}
                  </p>

                  {/* Special List for Discovery Tools */}
                  {card.list && (
                    <div className="mb-6 bg-white/80 rounded-xl p-3 border border-slate-200/80">
                      <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-xs text-slate-600">
                        {card.list.map((item, lIdx) => (
                          <div key={lIdx} className="flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-[#023dbb]" />
                            <span className="truncate">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Link */}
                <div className="pt-6 border-t border-slate-200/60 mt-4">
                  <Link
                    href={card.href}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-[#023dbb] hover:text-[#023dbb]/80 group-hover:translate-x-0.5 transition-all"
                  >
                    <span>{card.cta}</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
