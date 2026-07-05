"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";


import { Globe2, FileSearch, Sparkles, Map, Download, Zap } from "lucide-react";

const features = [
  {
    title: "Global Data Reach",
    desc: "Access a continuously updated index of 250M+ professionals across 150+ countries.",
    icon: Globe2,
    colSpan: "col-span-1 md:col-span-2",
    rowSpan: "row-span-1",
    visual: (
      <div className="w-full h-24 mt-4 bg-slate-50 rounded-lg overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiNjYmQ1ZTEiLz48L3N2Zz4=')] opacity-50" />
        <div className="absolute left-1/4 top-1/2 w-2 h-2 rounded-full bg-brand-blue shadow-[0_0_10px_rgba(2,61,187,0.5)] animate-ping" />
        <div className="absolute right-1/3 bottom-1/3 w-1.5 h-1.5 rounded-full bg-brand-cyan shadow-[0_0_8px_rgba(78,200,239,0.5)] animate-pulse" />
      </div>
    )
  },
  {
    title: "AI Scoring",
    desc: "Proprietary models rank prospects based on buying intent and fit.",
    icon: Sparkles,
    colSpan: "col-span-1 md:col-span-1",
    rowSpan: "row-span-2",
    visual: (
      <div className="w-full h-full mt-4 flex items-end justify-center gap-2 min-h-[120px]">
        {[40, 70, 50, 90, 60].map((h, i) => (
          <div key={i} className="w-6 bg-gradient-to-t from-brand-blue to-brand-cyan rounded-t-sm opacity-80 animate-[rw-pulse_2s_infinite]" style={{ height: `${h}%`, animationDelay: `${i * 0.2}s` }} />
        ))}
      </div>
    )
  },
  {
    title: "Job Cross-Referencing",
    desc: "Target companies actively hiring for specific roles.",
    icon: FileSearch,
    colSpan: "col-span-1 md:col-span-1",
    rowSpan: "row-span-1",
    visual: null
  },
  {
    title: "Google Maps Search",
    desc: "Find hyper-local businesses and decision makers instantly.",
    icon: Map,
    colSpan: "col-span-1 md:col-span-1",
    rowSpan: "row-span-1",
    visual: null
  },
  {
    title: "Flexible Export",
    desc: "Push data to HubSpot, Salesforce, or CSV in one click.",
    icon: Download,
    colSpan: "col-span-1 md:col-span-1",
    rowSpan: "row-span-1",
    visual: null
  },
  {
    title: "Real-time Enrichment",
    desc: "Never deal with stale data. We ping emails live.",
    icon: Zap,
    colSpan: "col-span-1 md:col-span-2",
    rowSpan: "row-span-1",
    visual: (
      <div className="w-full h-12 mt-4 bg-slate-50 rounded-lg overflow-hidden relative flex items-center px-4">
        <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full w-1/2 bg-gradient-to-r from-brand-blue to-brand-cyan animate-[rw-shimmer_2s_infinite]" />
        </div>
      </div>
    )
  }
];

export default function FeatureBento() {
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".bento-card",
        { y: 40, opacity: 0, scale: 0.95 },
        { 
          y: 0, 
          opacity: 1, 
          scale: 1, 
          duration: 0.6, 
          stagger: 0.1, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
          }
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="py-24 bg-white" ref={containerRef}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-brand-dark mb-4">
            Everything you need. <span className="text-brand-blue">Nothing you don't.</span>
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">
            A complete toolset designed for modern growth teams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[200px] gap-6">
          {features.map((feature, i) => (
            <div 
              key={i} 
              className={`bento-card group relative bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(2,61,187,0.06)] border border-slate-200 flex flex-col overflow-hidden transition-transform duration-300 hover:-translate-y-1 ${feature.colSpan} ${feature.rowSpan}`}
            >
              {/* Hover Glow Border Effect using pseudo-element */}
              <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
                background: 'conic-gradient(from 0deg at 50% 50%, transparent 0%, rgba(2,61,187,0.1) 25%, rgba(78,200,239,0.3) 50%, transparent 75%, transparent 100%)',
                animation: 'rw-spin 4s linear infinite',
                padding: '2px',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
                borderRadius: '16px'
              }} />

              <div className="relative z-10 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-brand-blue group-hover:bg-brand-blue/5 group-hover:border-brand-blue/20 transition-colors">
                    <feature.icon className="w-5 h-5 stroke-[1.5]" />
                  </div>
                  <h3 className="font-bold text-brand-dark">{feature.title}</h3>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {feature.desc}
                </p>
                {feature.visual && (
                  <div className="mt-auto flex-1 flex items-end">
                    {feature.visual}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
