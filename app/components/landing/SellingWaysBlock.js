"use client";

import React from "react";
import Link from "next/link";
import { Users2, Building, Store, UserCheck2, Rocket } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Audience data configuration
 * @typedef {Object} AudienceItem
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} linkText
 * @property {string} href
 * @property {import('lucide-react').LucideIcon} icon
 * @property {string} span
 * @property {'horizontal' | 'vertical'} orientation
 * @property {'card-cut-a' | 'card-cut-b'} cornerClass
 * @property {'left' | 'bottom'} edge
 */

import landingData from "@/data/landingData.json";

const ICON_MAP = {
  Users2,
  Building,
  Store,
  UserCheck2,
  Rocket
};

const audiences = landingData.audiences.map((a) => ({
  ...a,
  icon: ICON_MAP[a.icon] || Users2
}));

export function AudienceCardsSection() {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.05,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 8,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.35,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="py-24 bg-[#f8fafc] border-t border-slate-200/80 relative">
      {/* Per-corner radii and CSS counter styles */}
      <style jsx>{`
        .audience-grid-counter {
          counter-reset: audience-counter;
        }
        .card-cut-a {
          border-radius: 20px 6px 20px 20px;
        }
        .card-cut-b {
          border-radius: 20px 20px 20px 6px;
        }
        .audience-card-numeral::before {
          counter-increment: audience-counter;
          content: "0" counter(audience-counter);
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-[#023dbb] text-xs font-semibold uppercase tracking-wider mb-4">
            Audience Solutions
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-slate-900 tracking-tight mb-4">
            Built for Different Ways of Selling
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            SimpLeads is not limited to one prospecting model.
          </p>
        </div>

        {/* Bento Grid: 6-column layout with no empty slot */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-5 max-w-6xl mx-auto audience-grid-counter"
        >
          {audiences.map((item) => {
            const Icon = item.icon;
            const isHorizontal = item.orientation === "horizontal";

            return (
              <motion.div
                key={item.id}
                variants={cardVariants}
                className={`group relative bg-white border border-slate-200 shadow-[0_2px_8px_rgba(15,23,42,0.04)] hover:border-[#023dbb]/40 focus-within:border-[#023dbb]/40 hover:-translate-y-0.5 focus-within:-translate-y-0.5 transition-all duration-200 ease-out focus-within:ring-2 focus-within:ring-[#023dbb] focus-within:ring-offset-2 focus-within:ring-offset-[#f8fafc] p-7 sm:p-8 flex flex-col justify-between overflow-hidden motion-reduce:transform-none motion-reduce:hover:translate-y-0 ${item.span} ${item.cornerClass} ${
                  item.cornerClass === "card-cut-a"
                    ? "rounded-tl-[20px] rounded-tr-[6px] rounded-br-[20px] rounded-bl-[20px]"
                    : "rounded-tl-[20px] rounded-tr-[20px] rounded-br-[20px] rounded-bl-[6px]"
                }`}
              >
                {/* 3px Accent Edge: alternating left and bottom */}
                {item.edge === "left" ? (
                  <div
                    aria-hidden="true"
                    className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#023dbb] opacity-35 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 pointer-events-none z-10"
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#023dbb] opacity-35 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 pointer-events-none z-10"
                  />
                )}

                {/* Faint Monospace Index Numeral in the unused corner */}
                <span
                  aria-hidden="true"
                  className="audience-card-numeral absolute top-5 right-6 font-mono text-base font-bold tracking-wider text-slate-900 opacity-[0.055] select-none pointer-events-none z-0"
                />

                {/* Content Layout: Varied breadth (horizontal on desktop for wide cards, vertical for narrow) */}
                <div
                  className={`flex flex-col h-full justify-between relative z-[1] ${
                    isHorizontal ? "lg:grid lg:grid-cols-12 lg:gap-7" : ""
                  }`}
                >
                  {/* Left Column in wide cards / Top block in narrow cards */}
                  <div
                    className={
                      isHorizontal
                        ? "lg:col-span-5 flex flex-col justify-start"
                        : "flex flex-col"
                    }
                  >
                    {/* Icon Tile: 48px for wide cards, 40px for narrow cards */}
                    <div
                      className={`rounded-xl bg-blue-50/80 border border-blue-100/60 flex items-center justify-center text-[#023dbb] mb-4 group-hover:bg-[#023dbb] group-hover:text-white group-focus-within:bg-[#023dbb] group-focus-within:text-white transition-colors duration-200 ${
                        isHorizontal ? "w-10 h-10 lg:w-12 lg:h-12" : "w-10 h-10"
                      }`}
                    >
                      <Icon className="w-5 h-5 stroke-[1.8]" />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl sm:text-[22px] font-display font-bold text-slate-900 tracking-tight leading-snug mb-2.5 lg:mb-0">
                      {item.title}
                    </h3>
                  </div>

                  {/* Right Column in wide cards / Bottom block in narrow cards */}
                  <div
                    className={`flex flex-col justify-between ${
                      isHorizontal ? "lg:col-span-7 h-full mt-3 lg:mt-0" : "mt-auto"
                    }`}
                  >
                    {/* Description */}
                    <p className="text-sm sm:text-[14.5px] text-slate-500 leading-relaxed font-normal mb-6">
                      {item.description}
                    </p>

                    {/* Action Link: with stretched pseudo-element for full-card clickability */}
                    <div className="mt-auto pt-2">
                      <Link
                        href={item.href}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#023dbb] group/link focus:outline-none after:absolute after:inset-0 after:z-10 after:content-[''] after:rounded-[inherit]"
                      >
                        <span>{item.linkText.replace(/→$/, "").trimEnd()}</span>
                        <span
                          aria-hidden="true"
                          className="inline-block transition-transform duration-200 group-hover:translate-x-1 group-focus-within:translate-x-1 motion-reduce:transform-none"
                        >
                          →
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

export const SellingWaysBlock = AudienceCardsSection;
export default AudienceCardsSection;
