"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Camera, Video, BookOpen, Coins } from "lucide-react";

import landingData from "@/data/landingData.json";

const ICON_MAP = {
  MapPin,
  Camera,
  Video,
  BookOpen,
  Coins
};

const tools = landingData.discoveryTools.map((t) => ({
  ...t,
  icon: ICON_MAP[t.icon] || MapPin
}));

export default function MultiSourceDiscovery() {
  return (
    <section className="py-24 bg-slate-50/60 border-t border-slate-200/80">
      <style jsx>{`
        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .gradient-flow-anim {
          animation: gradientFlow 3.5s ease infinite;
        }
      `}</style>

      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block (Exact non-negotiable copy and typography preserved) */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold uppercase tracking-wider mb-4 border border-slate-200">
            Dedicated Discovery Tooling
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-slate-900 tracking-tight mb-4">
            More Ways to Find the Leads You Need
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Not every prospect starts with a traditional B2B database.
          </p>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto mt-1">
            SimpLeads includes separate discovery tools for different prospecting environments.
          </p>
        </div>

        {/* Single Ruled List Panel (6-column unified container, hairline dividers) */}
        <motion.div 
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="max-w-7xl mx-auto rounded-3xl border border-slate-200 bg-slate-200/90 shadow-xs overflow-hidden"
        >
          <div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-px"
            style={{ counterReset: "tool-counter" }}
          >
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <div
                  key={tool.id}
                  className={`group relative bg-white p-7 sm:p-8 lg:p-9 flex flex-col justify-between transition-all duration-300 focus-within:ring-2 ${tool.focusRing} focus-within:ring-inset ${tool.colSpanLg} ${tool.colSpanMd}`}
                >
                  {/* Subtle dedicated background gradient wash on hover */}
                  <div 
                    className={`absolute inset-0 bg-gradient-to-br ${tool.cardHoverBg} opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none`}
                    aria-hidden="true"
                  />

                  {/* Top hairline animated moving gradient border line */}
                  <div 
                    className={`absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r ${tool.topLineGradient} bg-[length:200%_auto] gradient-flow-anim origin-left scale-x-0 group-hover:scale-x-100 group-focus-within:scale-x-100 transition-transform duration-300 ease-out motion-reduce:transition-none pointer-events-none z-20`} 
                    aria-hidden="true" 
                  />

                  {/* Faint Monospace Decorative Numeral (01-05 via CSS Counter) */}
                  <span 
                    className={`absolute bottom-5 right-7 text-6xl sm:text-7xl font-mono font-bold text-slate-900/[0.06] ${tool.numeralHover} transition-colors duration-300 select-none pointer-events-none [counter-increment:tool-counter] before:content-[counter(tool-counter,decimal-leading-zero)]`} 
                    aria-hidden="true" 
                  />

                  {/* Content (Original DOM Order Preserved) */}
                  <div className="relative z-10">
                    {/* Top Row: Icon tile & Monospace Tag */}
                    <div className="flex items-center justify-between gap-3 mb-5">
                      <div className={`w-10 h-10 rounded-xl ${tool.iconTileBase} border flex items-center justify-center ${tool.iconTileHover} group-focus-within:opacity-100 transition-all duration-300 shadow-xs shrink-0`}>
                        <Icon className="w-5 h-5 stroke-[1.75]" />
                      </div>
                      <span className={`text-[11px] font-mono text-slate-500 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-full whitespace-nowrap ${tool.tagHover} transition-all duration-300`}>
                        {tool.tag}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900 mb-2.5 leading-snug">
                      {tool.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-slate-600 leading-relaxed font-normal mb-8">
                      {tool.desc}
                    </p>
                  </div>

                  {/* Pinned Bottom Link with Stretched Pseudo-element */}
                  <div className="relative z-10 mt-auto pt-4 border-t border-slate-100/80">
                    <Link
                      href={tool.href}
                      className={`inline-flex items-center text-sm font-semibold text-[#023dbb] ${tool.linkHover} transition-colors duration-200 focus:outline-none after:absolute after:inset-0 after:z-10`}
                    >
                      <span className="transition-transform duration-200 ease-out group-hover:translate-x-1 group-focus-within:translate-x-1">
                        {tool.cta}
                      </span>
                    </Link>
                  </div>

                </div>
              );
            })}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
