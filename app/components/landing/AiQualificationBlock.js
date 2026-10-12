"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Target, 
  Zap, 
  CheckCircle2, 
  UserCheck, 
  AlertTriangle, 
  ArrowRight,
  TrendingUp,
  SlidersHorizontal
} from "lucide-react";

import landingData from "@/data/landingData.json";

const ICON_MAP = {
  Target,
  Zap,
  CheckCircle2,
  UserCheck
};

// The 4 core criteria (SEO & Content integrity: untouched text)
const criteria = landingData.qualificationCriteria.map((c) => ({
  ...c,
  icon: ICON_MAP[c.icon] || Target
}));

// Fictional decorative sample prospect data
const sampleProspects = landingData.qualificationSampleProspects;

// Smooth count-up hook for decorative composite score
function useAnimatedScore(targetValue, duration = 650, prefersReducedMotion = false) {
  const [displayValue, setDisplayValue] = useState(targetValue);
  const prevValRef = useRef(targetValue);

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayValue(targetValue);
      prevValRef.current = targetValue;
      return;
    }

    const startVal = prevValRef.current;
    const endVal = targetValue;
    const startTime = performance.now();

    let frameId;
    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const nextVal = Math.round(startVal + (endVal - startVal) * ease);
      setDisplayValue(nextVal);

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      } else {
        prevValRef.current = endVal;
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [targetValue, duration, prefersReducedMotion]);

  return displayValue;
}

export default function AiQualificationBlock() {
  const [activeProspectIdx, setActiveProspectIdx] = useState(0);
  const [hoveredCriterionId, setHoveredCriterionId] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isInView, setIsInView] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const sectionRef = useRef(null);
  const pauseTimerRef = useRef(null);

  const activeProspect = sampleProspects[activeProspectIdx];
  const animatedScore = useAnimatedScore(activeProspect.compositeScore, 650, prefersReducedMotion);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(media.matches);
    const listener = (e) => setPrefersReducedMotion(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  // IntersectionObserver to pause when offscreen
  useEffect(() => {
    if (!sectionRef.current || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Pause when tab is inactive
  useEffect(() => {
    const onVisibilityChange = () => {
      setIsInView(document.visibilityState === "visible");
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  // Auto-cycle every 5 seconds
  useEffect(() => {
    if (isPaused || !isInView || prefersReducedMotion) return;

    const interval = setInterval(() => {
      setActiveProspectIdx((prev) => (prev + 1) % sampleProspects.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, isInView, prefersReducedMotion]);

  // Handle manual prospect selection
  const handleSelectProspect = (idx) => {
    setActiveProspectIdx(idx);
    setIsPaused(true);
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    // Pause auto-advance for 10 seconds
    pauseTimerRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 10000);
  };

  // Keyboard navigation for tablist
  const handleProspectKeyDown = (e, idx) => {
    let nextIdx = idx;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      nextIdx = (idx + 1) % sampleProspects.length;
      handleSelectProspect(nextIdx);
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      nextIdx = (idx - 1 + sampleProspects.length) % sampleProspects.length;
      handleSelectProspect(nextIdx);
    }
  };

  // 270° SVG Arc Gauge calculations (radius = 58, center = 75,75)
  // Circumference = 2 * PI * 58 ≈ 364.42
  // 270° arc length = 364.42 * 0.75 ≈ 273.32
  const ARC_LENGTH = 273.32;
  const CIRCUMFERENCE = 364.42;
  const strokeOffset = ARC_LENGTH * (1 - activeProspect.compositeScore / 100);

  return (
    <section ref={sectionRef} className="py-24 bg-slate-50/70 border-t border-slate-200/80 overflow-hidden">
      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block (Exact non-negotiable copy and typography preserved) */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-[#023dbb] text-xs font-semibold uppercase tracking-wider mb-4">
            Prioritization Engine
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-slate-900 tracking-tight mb-4">
            AI Qualification That Helps You Prioritize
          </h2>
          <p className="text-lg sm:text-xl text-slate-700 font-medium mb-3">
            Lead scoring should answer more than “How relevant is this contact?”
          </p>
          <p className="text-base text-slate-600 max-w-2xl mx-auto">
            SimpLeads uses your company context and target roles to help evaluate leads across:
          </p>
        </div>

        {/* Live Scoring Console Panel: Three-Zone Engine Composition */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm shadow-slate-100 overflow-hidden mb-16 relative">
          
          {/* Subtle top edge highlight */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200/80">
            
            {/* ZONE 1: Inputs (~22%) */}
            <div className="lg:col-span-3 p-6 sm:p-7 flex flex-col justify-between bg-slate-50/30">
              <div>
                <div 
                  className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-4 font-semibold"
                  aria-hidden="true"
                >
                  <span className="flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-[#023dbb]" />
                    Sample Prospects
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    {isPaused ? "Paused" : "Cycling 5s"}
                  </span>
                </div>

                {/* Prospect interactive tablist */}
                <div 
                  role="tablist" 
                  aria-label="Sample Prospect Qualification Selector"
                  className="flex lg:flex-col gap-2.5 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-none"
                >
                  {sampleProspects.map((p, idx) => {
                    const isActive = activeProspectIdx === idx;
                    return (
                      <button
                        key={p.id}
                        role="tab"
                        aria-selected={isActive}
                        tabIndex={isActive ? 0 : -1}
                        onClick={() => handleSelectProspect(idx)}
                        onKeyDown={(e) => handleProspectKeyDown(e, idx)}
                        className={`min-w-[210px] lg:min-w-0 w-full text-left p-3.5 rounded-2xl border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#023dbb] cursor-pointer ${
                          isActive
                            ? "bg-white border-[#023dbb] shadow-sm shadow-[#023dbb]/10 ring-1 ring-[#023dbb]"
                            : "bg-white/80 border-slate-200 hover:bg-white hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono text-xs font-bold shrink-0 transition-colors ${
                              isActive 
                                ? "bg-[#023dbb] text-white" 
                                : "bg-slate-100 text-slate-600"
                            }`}
                            aria-hidden="true"
                          >
                            {p.initials}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <span className={`text-sm font-semibold truncate ${isActive ? "text-slate-900" : "text-slate-700"}`}>
                                {p.name}
                              </span>
                              <span 
                                className={`text-[11px] font-mono tabular-nums px-1.5 py-0.5 rounded ${
                                  isActive ? "bg-blue-50 text-[#023dbb] font-bold" : "text-slate-400"
                                }`}
                                aria-hidden="true"
                              >
                                {p.compositeScore}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 truncate mt-0.5">
                              {p.role} · {p.company}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Status footer for inputs zone */}
              <div 
                className="pt-6 border-t border-slate-200/60 mt-6 hidden lg:flex items-center justify-between text-[11px] font-mono text-slate-400"
                aria-hidden="true"
              >
                <span>INPUT STAGE</span>
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Stream
                </span>
              </div>
            </div>

            {/* ZONE 2: The Four Criteria (2x2 Flat Hairline-Divided Grid) (~56%) */}
            <div className="lg:col-span-6 relative flex flex-col justify-between">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80 h-full">
                
                {/* Column 1: Need (top) & Relevance (bottom) */}
                <div className="divide-y divide-slate-200/80 flex flex-col justify-between">
                  
                  {/* CRITERION 01 — Need */}
                  {(() => {
                    const c = criteria[0];
                    const Icon = c.icon;
                    const score = activeProspect.scores.need;
                    const isHovered = hoveredCriterionId === c.id;
                    const isDimmed = hoveredCriterionId !== null && !isHovered;

                    return (
                      <div
                        tabIndex={0}
                        onMouseEnter={() => setHoveredCriterionId(c.id)}
                        onMouseLeave={() => setHoveredCriterionId(null)}
                        onFocus={() => setHoveredCriterionId(c.id)}
                        onBlur={() => setHoveredCriterionId(null)}
                        className={`p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#023dbb] focus-visible:ring-inset ${
                          isHovered 
                            ? "bg-blue-50/40 border-l-2 border-l-[#023dbb]" 
                            : "border-l-2 border-l-transparent"
                        } ${isDimmed ? "opacity-60" : "opacity-100"}`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <div 
                              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                                isHovered 
                                  ? "bg-[#023dbb] text-white" 
                                  : "bg-blue-50/80 text-[#023dbb]"
                              }`}
                            >
                              <Icon className="w-4 h-4 stroke-[1.75]" />
                            </div>
                            <span className="text-xs font-mono font-bold text-slate-400">
                              {c.index}
                            </span>
                          </div>

                          <h3 className="text-xl font-bold font-display text-slate-900 mb-2">
                            {c.name}
                          </h3>
                          <p className="text-sm text-slate-600 leading-relaxed">
                            {c.question}
                          </p>

                          {/* Decorative horizontal meter bar */}
                          <div className="mt-4 pt-1 space-y-1.5" aria-hidden="true">
                            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                              <span>SCORE MATCH</span>
                              <span className="font-semibold text-slate-800 tabular-nums">{score}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#023dbb] rounded-full transition-all duration-700 ease-out"
                                style={{ width: `${score}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 pt-3">
                          <span className="inline-block text-[10px] font-mono uppercase tracking-wider text-[#023dbb] bg-blue-50/90 px-2 py-0.5 rounded border border-blue-100">
                            {c.tag}
                          </span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* CRITERION 03 — Relevance */}
                  {(() => {
                    const c = criteria[2];
                    const Icon = c.icon;
                    const score = activeProspect.scores.relevance;
                    const isHovered = hoveredCriterionId === c.id;
                    const isDimmed = hoveredCriterionId !== null && !isHovered;

                    return (
                      <div
                        tabIndex={0}
                        onMouseEnter={() => setHoveredCriterionId(c.id)}
                        onMouseLeave={() => setHoveredCriterionId(null)}
                        onFocus={() => setHoveredCriterionId(c.id)}
                        onBlur={() => setHoveredCriterionId(null)}
                        className={`p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#023dbb] focus-visible:ring-inset ${
                          isHovered 
                            ? "bg-blue-50/40 border-l-2 border-l-[#023dbb]" 
                            : "border-l-2 border-l-transparent"
                        } ${isDimmed ? "opacity-60" : "opacity-100"}`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <div 
                              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                                isHovered 
                                  ? "bg-[#023dbb] text-white" 
                                  : "bg-blue-50/80 text-[#023dbb]"
                              }`}
                            >
                              <Icon className="w-4 h-4 stroke-[1.75]" />
                            </div>
                            <span className="text-xs font-mono font-bold text-slate-400">
                              {c.index}
                            </span>
                          </div>

                          <h3 className="text-xl font-bold font-display text-slate-900 mb-2">
                            {c.name}
                          </h3>
                          <p className="text-sm text-slate-600 leading-relaxed">
                            {c.question}
                          </p>

                          {/* Decorative horizontal meter bar */}
                          <div className="mt-4 pt-1 space-y-1.5" aria-hidden="true">
                            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                              <span>SCORE MATCH</span>
                              <span className="font-semibold text-slate-800 tabular-nums">{score}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#023dbb] rounded-full transition-all duration-700 ease-out"
                                style={{ width: `${score}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 pt-3">
                          <span className="inline-block text-[10px] font-mono uppercase tracking-wider text-[#023dbb] bg-blue-50/90 px-2 py-0.5 rounded border border-blue-100">
                            {c.tag}
                          </span>
                        </div>
                      </div>
                    );
                  })()}

                </div>

                {/* Column 2: Urgency (top) & Authority (bottom) */}
                <div className="divide-y divide-slate-200/80 flex flex-col justify-between">
                  
                  {/* CRITERION 02 — Urgency */}
                  {(() => {
                    const c = criteria[1];
                    const Icon = c.icon;
                    const score = activeProspect.scores.urgency;
                    const isHovered = hoveredCriterionId === c.id;
                    const isDimmed = hoveredCriterionId !== null && !isHovered;

                    return (
                      <div
                        tabIndex={0}
                        onMouseEnter={() => setHoveredCriterionId(c.id)}
                        onMouseLeave={() => setHoveredCriterionId(null)}
                        onFocus={() => setHoveredCriterionId(c.id)}
                        onBlur={() => setHoveredCriterionId(null)}
                        className={`p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#023dbb] focus-visible:ring-inset ${
                          isHovered 
                            ? "bg-blue-50/40 border-l-2 border-l-[#023dbb]" 
                            : "border-l-2 border-l-transparent"
                        } ${isDimmed ? "opacity-60" : "opacity-100"}`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <div 
                              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                                isHovered 
                                  ? "bg-[#023dbb] text-white" 
                                  : "bg-blue-50/80 text-[#023dbb]"
                              }`}
                            >
                              <Icon className="w-4 h-4 stroke-[1.75]" />
                            </div>
                            <span className="text-xs font-mono font-bold text-slate-400">
                              {c.index}
                            </span>
                          </div>

                          <h3 className="text-xl font-bold font-display text-slate-900 mb-2">
                            {c.name}
                          </h3>
                          <p className="text-sm text-slate-600 leading-relaxed">
                            {c.question}
                          </p>

                          {/* Decorative horizontal meter bar */}
                          <div className="mt-4 pt-1 space-y-1.5" aria-hidden="true">
                            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                              <span>SCORE MATCH</span>
                              <span className="font-semibold text-slate-800 tabular-nums">{score}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#023dbb] rounded-full transition-all duration-700 ease-out"
                                style={{ width: `${score}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 pt-3">
                          <span className="inline-block text-[10px] font-mono uppercase tracking-wider text-[#023dbb] bg-blue-50/90 px-2 py-0.5 rounded border border-blue-100">
                            {c.tag}
                          </span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* CRITERION 04 — Authority */}
                  {(() => {
                    const c = criteria[3];
                    const Icon = c.icon;
                    const score = activeProspect.scores.authority;
                    const isHovered = hoveredCriterionId === c.id;
                    const isDimmed = hoveredCriterionId !== null && !isHovered;

                    return (
                      <div
                        tabIndex={0}
                        onMouseEnter={() => setHoveredCriterionId(c.id)}
                        onMouseLeave={() => setHoveredCriterionId(null)}
                        onFocus={() => setHoveredCriterionId(c.id)}
                        onBlur={() => setHoveredCriterionId(null)}
                        className={`p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#023dbb] focus-visible:ring-inset ${
                          isHovered 
                            ? "bg-blue-50/40 border-l-2 border-l-[#023dbb]" 
                            : "border-l-2 border-l-transparent"
                        } ${isDimmed ? "opacity-60" : "opacity-100"}`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <div 
                              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                                isHovered 
                                  ? "bg-[#023dbb] text-white" 
                                  : "bg-blue-50/80 text-[#023dbb]"
                              }`}
                            >
                              <Icon className="w-4 h-4 stroke-[1.75]" />
                            </div>
                            <span className="text-xs font-mono font-bold text-slate-400">
                              {c.index}
                            </span>
                          </div>

                          <h3 className="text-xl font-bold font-display text-slate-900 mb-2">
                            {c.name}
                          </h3>
                          <p className="text-sm text-slate-600 leading-relaxed">
                            {c.question}
                          </p>

                          {/* Decorative horizontal meter bar */}
                          <div className="mt-4 pt-1 space-y-1.5" aria-hidden="true">
                            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                              <span>SCORE MATCH</span>
                              <span className="font-semibold text-slate-800 tabular-nums">{score}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#023dbb] rounded-full transition-all duration-700 ease-out"
                                style={{ width: `${score}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 pt-3">
                          <span className="inline-block text-[10px] font-mono uppercase tracking-wider text-[#023dbb] bg-blue-50/90 px-2 py-0.5 rounded border border-blue-100">
                            {c.tag}
                          </span>
                        </div>
                      </div>
                    );
                  })()}

                </div>

              </div>
            </div>

            {/* ZONE 3: Output Dial & Ranking Readout (~22%) */}
            <div className="lg:col-span-3 p-6 sm:p-7 flex flex-col justify-between items-center text-center bg-slate-50/20">
              
              <div className="w-full flex flex-col items-center">
                <div 
                  className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2 font-semibold w-full flex items-center justify-between"
                  aria-hidden="true"
                >
                  <span>Output Readout</span>
                  <span className="text-[10px] text-slate-400">AI Scoring</span>
                </div>

                {/* 270° SVG Arc Gauge */}
                <div className="relative my-4 flex items-center justify-center" aria-hidden="true">
                  <svg width="150" height="150" viewBox="0 0 150 150" className="overflow-visible">
                    {/* Background Arc Track (270 degrees) */}
                    <circle
                      cx="75"
                      cy="75"
                      r="58"
                      fill="none"
                      stroke="#f1f5f9"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${ARC_LENGTH} ${CIRCUMFERENCE}`}
                      transform="rotate(135 75 75)"
                    />

                    {/* Active Progress Arc */}
                    <circle
                      cx="75"
                      cy="75"
                      r="58"
                      fill="none"
                      stroke="#023dbb"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${ARC_LENGTH} ${CIRCUMFERENCE}`}
                      strokeDashoffset={strokeOffset}
                      transform="rotate(135 75 75)"
                      className="transition-all duration-700 ease-out"
                    />

                    {/* Criteria Highlight Indicator when hovering cell */}
                    {hoveredCriterionId && (
                      <circle
                        cx="75"
                        cy="75"
                        r="66"
                        fill="none"
                        stroke="#023dbb"
                        strokeWidth="2"
                        strokeDasharray="20 40"
                        className="animate-spin opacity-40"
                        style={{ animationDuration: "6s" }}
                      />
                    )}
                  </svg>

                  {/* Centered Readout */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl sm:text-5xl font-bold font-mono text-slate-900 tracking-tight tabular-nums">
                      {animatedScore}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-0.5">
                      SCORE / 100
                    </span>
                  </div>
                </div>

                {/* Tier Chip */}
                <div 
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider border transition-all duration-300 ${activeProspect.tierStyles}`}
                  aria-hidden="true"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                  {activeProspect.tier}
                </div>

                {/* Priority Position ranking rows */}
                <div className="w-full mt-6 pt-5 border-t border-slate-200/60 space-y-2" aria-hidden="true">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 text-left mb-1.5">
                    Pipeline Position
                  </div>
                  {sampleProspects.map((p, rIdx) => {
                    const isSelected = p.id === activeProspect.id;
                    return (
                      <div
                        key={p.id}
                        className={`flex items-center justify-between text-xs px-2.5 py-1.5 rounded-xl font-mono transition-all ${
                          isSelected
                            ? "bg-blue-50 text-[#023dbb] font-bold border border-blue-200/60 shadow-xs"
                            : "text-slate-500 bg-white/60 border border-transparent"
                        }`}
                      >
                        <span className="truncate flex items-center gap-1.5">
                          <span className="text-slate-400 font-normal">#{rIdx + 1}</span>
                          <span className="truncate">{p.name}</span>
                        </span>
                        <span className="tabular-nums shrink-0 ml-2">{p.compositeScore}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status footer for output zone */}
              <div 
                className="pt-4 border-t border-slate-200/60 w-full mt-5 hidden lg:flex items-center justify-between text-[11px] font-mono text-slate-400"
                aria-hidden="true"
              >
                <span>PRIORITIZATION</span>
                <span className="text-[#023dbb] font-semibold">Active</span>
              </div>
            </div>

          </div>
        </div>

        {/* Supporting Breakdown & Important Qualification Note (Exact original copy preserved) */}
        <div className="max-w-4xl mx-auto space-y-6">
          <p className="text-center text-slate-600 text-sm sm:text-base leading-relaxed">
            The current scoring experience provides visible prioritization and supporting breakdowns so you can make better decisions about where to focus your outreach.
          </p>

          {/* Important Qualification Note Callout */}
          <div className="bg-amber-50/90 rounded-2xl border border-amber-200/90 p-6 flex flex-col sm:flex-row items-start gap-4">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-900 mb-1 uppercase tracking-wide">
                Important qualification note
              </h4>
              <p className="text-sm text-amber-900/90 leading-relaxed">
                SimpLeads is being developed toward broader BANT-style qualification. Budget / financial qualification is in development and should not be presented as a currently available live capability.
              </p>
            </div>
          </div>

          <div className="text-center pt-2">
            <Link
              href="/features/ai-lead-scoring"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#023dbb] text-white hover:bg-[#023dbb]/90 transition-colors text-sm font-semibold shadow-xs"
            >
              <span>Explore AI Lead Qualification & Scoring</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
