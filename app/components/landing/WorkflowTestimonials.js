"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Typed testimonial record configuration
 * @typedef {Object} TestimonialItem
 * @property {string} id
 * @property {string} headline
 * @property {string} body
 * @property {string} name
 * @property {string} role
 * @property {string} initials
 */

import landingData from "@/data/landingData.json";

const { testimonials } = landingData;

/**
 * PullTabConnector
 * Kept as clean null export for backward-compatibility
 */
export function PullTabConnector() {
  return null;
}

/**
 * LedgerRow
 * Represents a single slim row in the index ledger with generous breathing room
 */
export function LedgerRow({
  item,
  index,
  isActive,
  onSelect,
  onKeyDown,
  innerRef,
}) {
  return (
    <button
      ref={innerRef}
      id={`testimonial-tab-${item.id}`}
      role="tab"
      type="button"
      aria-selected={isActive}
      aria-controls={`testimonial-panel-${item.id}`}
      tabIndex={isActive ? 0 : -1}
      onClick={() => onSelect(index)}
      onKeyDown={(e) => onKeyDown(e, index)}
      data-active={isActive}
      className={`group relative w-full h-[52px] px-5 sm:px-6 flex items-center text-left transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-[#023dbb] focus-visible:ring-inset border-l-[3px] ${isActive
        ? "bg-blue-50/50 border-l-[#023dbb] text-slate-900 z-10"
        : "border-l-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50/70 hover:translate-x-0.5"
        }`}
    >
      {/* Two-digit CSS counter numeral */}
      <span
        aria-hidden="true"
        className="ledger-counter-numeral font-mono text-xs font-semibold text-slate-400 group-hover:text-slate-600 group-data-[active=true]:text-[#023dbb] mr-3.5 shrink-0 select-none pointer-events-none"
      />

      {/* Quote headline & Name with generous spacing */}
      <div className="flex items-center justify-between min-w-0 flex-1 gap-4">
        <span
          className={`font-display text-[14px] truncate min-w-0 ${isActive
            ? "font-bold text-slate-900"
            : "font-medium text-slate-600 group-hover:text-slate-900"
            }`}
        >
          {item.headline}
        </span>

        {/* Person's name: revealed cleanly with comfortable margin */}
        <span className="hidden md:inline-block text-xs font-medium text-slate-400 group-hover:text-slate-600 group-data-[active=true]:text-slate-500 shrink-0 truncate max-w-[130px] transition-colors">
          {item.name}
        </span>

        {/* Mobile-only name display */}
        <span className="inline-block sm:hidden text-xs font-medium text-slate-500 shrink-0 truncate max-w-[100px]">
          {item.name}
        </span>
      </div>
    </button>
  );
}

/**
 * OpenEntry
 * Renders all 10 testimonial panels in the DOM simultaneously.
 * Inactive panels are hidden via CSS opacity/translate/inert, never unmounted.
 */
export function OpenEntry({
  testimonialsList,
  activeIndex,
  onPrev,
  onNext,
}) {
  return (
    <div className="relative w-full h-full min-h-[400px] sm:min-h-[440px] lg:min-h-[480px] flex flex-col justify-between p-7 sm:p-9 lg:p-11 xl:p-12 bg-white">
      {/* Render all 10 tabpanels in DOM in original order */}
      <div className="relative w-full flex-1">
        {testimonialsList.map((t, idx) => {
          const isActive = activeIndex === idx;

          return (
            <div
              key={t.id}
              id={`testimonial-panel-${t.id}`}
              role="tabpanel"
              aria-labelledby={`testimonial-tab-${t.id}`}
              tabIndex={isActive ? 0 : -1}
              inert={!isActive}
              className={`transition-all duration-300 ease-out ${isActive
                ? "relative z-10 opacity-100 translate-x-0 pointer-events-auto"
                : "absolute inset-0 z-0 opacity-0 translate-x-3 pointer-events-none select-none"
                }`}
            >
              {/* Quote icon indicator */}
              <div className="mb-5">
                <Quote className="w-8 h-8 text-[#023dbb]/25" />
              </div>

              {/* Headline with 12px slide and leading transition */}
              <div
                className={`transition-all duration-300 ease-out ${isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                  }`}
              >
                <h3 className="text-xl sm:text-2xl lg:text-[29px] font-display font-bold text-slate-900 tracking-tight leading-snug mb-5">
                  {t.headline}
                </h3>
              </div>

              {/* Body with staggered follow delay */}
              <div
                className={`transition-all duration-300 ease-out delay-75 ${isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                  }`}
              >
                <p className="text-[17px] sm:text-[18px] text-slate-600 leading-[1.75] font-normal mb-8 max-w-2xl">
                  {t.body}
                </p>
              </div>

              {/* Author Attribution */}
              <div
                className={`pt-6 border-t border-slate-100/90 flex items-center justify-between transition-all duration-300 ease-out delay-150 ${isActive ? "opacity-100" : "opacity-0"
                  }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-blue-50 text-[#023dbb] font-mono text-xs font-bold flex items-center justify-center shrink-0 border border-blue-100/80 shadow-xs">
                    {t.initials}
                  </div>
                  <div className="min-w-0">
                    <div className="text-base font-semibold text-slate-900 leading-snug truncate">
                      {t.name}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-500 leading-snug truncate">
                      {t.role}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ledger Navigation Controls (prev/next buttons + counter) */}
      <div className="pt-4 mt-auto flex items-center justify-between border-t border-slate-100/80">
        <div className="flex items-center gap-2 font-mono text-xs text-slate-400 select-none">
          <span className="font-semibold text-[#023dbb]">
            {String(activeIndex + 1).padStart(2, "0")}
          </span>
          <span>/</span>
          <span>{String(testimonialsList.length).padStart(2, "0")}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onPrev}
            aria-label="Previous testimonial"
            className="w-8 h-8 rounded-lg border border-slate-200/90 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 transition-colors focus-visible:ring-2 focus-visible:ring-[#023dbb] focus-visible:outline-none"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onNext}
            aria-label="Next testimonial"
            className="w-8 h-8 rounded-lg border border-slate-200/90 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 transition-colors focus-visible:ring-2 focus-visible:ring-[#023dbb] focus-visible:outline-none"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Main TestimonialLedgerSection Component
 */
export function TestimonialLedgerSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const rowRefs = useRef([]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = (index + 1) % testimonials.length;
      setActiveIndex(next);
      rowRefs.current[next]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = (index - 1 + testimonials.length) % testimonials.length;
      setActiveIndex(prev);
      rowRefs.current[prev]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      setActiveIndex(0);
      rowRefs.current[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      const last = testimonials.length - 1;
      setActiveIndex(last);
      rowRefs.current[last]?.focus();
    }
  };

  return (
    <section className="py-24 bg-[#f8fafc] border-t border-slate-200/80 relative overflow-hidden">
      {/* CSS Counter style definition */}
      <style jsx>{`
        .ledger-strip {
          counter-reset: ledger-counter;
        }
        .ledger-counter-numeral::before {
          counter-increment: ledger-counter;
          content: counter(ledger-counter, decimal-leading-zero);
        }
      `}</style>

      {/* Screen-reader polite live region for selection changes */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {`Showing testimonial ${activeIndex + 1} of ${testimonials.length}: ${testimonials[activeIndex].name
          }, ${testimonials[activeIndex].headline}`}
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold uppercase tracking-wider mb-4 border border-slate-200">
            Visible Verification
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-slate-900 tracking-tight mb-4">
            See the Workflow Before You Trust the List
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            SimpLeads is designed to make the qualification process visible rather than asking users to blindly trust a score.
          </p>
        </div>

        {/* The Ledger Strip Container */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="max-w-6xl mx-auto bg-white border border-slate-200 rounded-[20px] shadow-[0_2px_12px_rgba(15,23,42,0.04)] overflow-hidden flex flex-col lg:flex-row lg:h-[556px]"
        >
          {/* Left Column (Desktop: 44% width index ledger, Mobile/Tablet: Stacked below) */}
          <div className="order-2 lg:order-1 lg:w-[44%] lg:border-r lg:border-slate-200 flex flex-col justify-between bg-white relative">
            {/* Position Rail indicator (desktop) */}
            <div
              aria-hidden="true"
              className="hidden lg:block absolute left-0 top-0 bottom-0 w-[2px] bg-slate-100 pointer-events-none z-10"
            >
              <div
                className="w-[2px] bg-[#023dbb] h-[52px] transition-transform duration-200 ease-out"
                style={{ transform: `translateY(${activeIndex * 52}px)` }}
              />
            </div>

            {/* List of 10 rows (Tablist) */}
            <div
              role="tablist"
              aria-label="Customer testimonials"
              aria-orientation="vertical"
              className="ledger-strip scroll-styled flex flex-col divide-y divide-slate-100 overflow-y-auto lg:overflow-hidden max-h-[300px] sm:max-h-none sm:grid sm:grid-cols-2 sm:divide-y-0 sm:gap-px sm:bg-slate-100 lg:flex lg:flex-col lg:bg-transparent lg:divide-y lg:divide-slate-100"
            >
              {testimonials.map((t, idx) => (
                <LedgerRow
                  key={t.id}
                  item={t}
                  index={idx}
                  isActive={activeIndex === idx}
                  onSelect={setActiveIndex}
                  onKeyDown={handleKeyDown}
                  innerRef={(el) => (rowRefs.current[idx] = el)}
                />
              ))}
            </div>

            {/* Faint subtle decorative ledger note */}
            <div
              aria-hidden="true"
              className="hidden lg:flex items-center justify-between px-5 py-2.5 bg-slate-50/50 border-t border-slate-100 text-[11px] font-mono text-slate-400 select-none"
            >
              <span>LEDGER ENTRIES (10)</span>
              <span>VERIFIED DIRECT QUOTES</span>
            </div>
          </div>

          {/* Right Column (Desktop: 56% width open testimonial, Mobile/Tablet: Top panel) */}
          <div className="order-1 lg:order-2 lg:w-[56%] flex flex-col bg-white">
            <OpenEntry
              testimonialsList={testimonials}
              activeIndex={activeIndex}
              onPrev={handlePrev}
              onNext={handleNext}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export const WorkflowTestimonials = TestimonialLedgerSection;
export default TestimonialLedgerSection;
