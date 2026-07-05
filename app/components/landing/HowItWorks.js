"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";


import { Users, Building2, Briefcase, Sparkles, Download } from "lucide-react";

const steps = [
  { id: 1, title: "People Search", icon: Users, desc: "Find target personas across platforms." },
  { id: 2, title: "Company Intel", icon: Building2, desc: "Enrich with firmographic data." },
  { id: 3, title: "Job Postings", icon: Briefcase, desc: "Cross-reference with active hiring." },
  { id: 4, title: "AI Scoring", icon: Sparkles, desc: "Rank leads by conversion intent." },
  { id: 5, title: "Export", icon: Download, desc: "Export as CSV for any campaign." }
];

export default function HowItWorks() {
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray(".flow-card");
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%",
        }
      });

      cards.forEach((card, i) => {
        // Pop in the card
        tl.fromTo(card,
          { scale: 0.8, opacity: 0, y: 20 },
          { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.5)" },
          i * 0.2
        );

        // Animate the connecting line dot if not the first card
        if (i > 0) {
          const dot = document.querySelector(`.dot-${i}`);
          if (dot) {
            tl.fromTo(dot,
              { left: "0%", opacity: 0 },
              { left: "100%", opacity: 1, duration: 1, ease: "power1.inOut" },
              (i - 1) * 0.2 + 0.3
            );
          }
        }
      });
      
      // Continuous loop for dots after initial reveal
      gsap.to(".flow-dot", {
        left: "100%",
        opacity: 0,
        duration: 2,
        ease: "none",
        stagger: 0.4,
        repeat: -1,
        delay: 2
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="py-24 bg-[#f7f9ff] overflow-hidden" ref={containerRef}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-brand-dark mb-4">
            The Enrichment Pipeline
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">
            A precise, multi-layered approach to building your perfect audience.
          </p>
        </div>

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4 lg:gap-8">
          
          {/* Connecting Lines for Desktop */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-[2px] -translate-y-1/2 z-0">
            <div className="w-full h-full border-t-2 border-dashed border-brand-blue/20" />
            
            {/* Animated particles on the lines */}
            {steps.map((_, i) => i > 0 && (
              <div 
                key={`line-${i}`} 
                className="absolute top-1/2 -translate-y-1/2 h-[2px]"
                style={{ 
                  left: `${(i - 1) * 25 + 5}%`, 
                  width: '15%' 
                }}
              >
                <div className={`flow-dot dot-${i} absolute w-2 h-2 rounded-full bg-brand-cyan shadow-[0_0_8px_rgba(78,200,239,0.8)] -top-[3px]`} />
              </div>
            ))}
          </div>

          {steps.map((step, index) => (
            <div 
              key={step.id} 
              className="flow-card relative z-10 w-full md:w-48 bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(2,61,187,0.08)] border border-slate-100 flex flex-col items-center text-center group transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_8px_30px_rgba(2,61,187,0.12)] hover:border-brand-blue/30"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-4 text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors duration-300">
                <step.icon className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h3 className="font-bold text-brand-dark mb-2 text-sm lg:text-base">{step.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {step.desc}
              </p>
              
              {/* Mobile connecting arrow */}
              {index < steps.length - 1 && (
                <div className="md:hidden mt-6 text-brand-blue/30">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              )}
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}
