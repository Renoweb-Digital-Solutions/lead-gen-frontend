"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowRight, ChevronDown } from "lucide-react";
import HeroScene from "./HeroScene";

export default function Hero() {
  const headlineRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    // GSAP Staggered reveal for headline words
    const tl = gsap.timeline();
    
    tl.fromTo(
      ".hero-reveal",
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out", delay: 0.2 }
    );
    
    tl.fromTo(
      contentRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
      "-=0.4"
    );
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-12 overflow-hidden bg-[#f7f9ff]">
      {/* 3D Network Background */}
      <HeroScene />

      {/* Blurred Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-sky/10 rounded-full blur-[80px] pointer-events-none mix-blend-multiply" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-brand-cyan/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />
      
      {/* Grid overlay for techy feel */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Eyebrow */}
        <div className="hero-reveal inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-brand-blue/10 mb-8 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
          <span className="text-brand-blue text-xs font-bold tracking-[0.2em] uppercase">
            AI-Powered Lead Intelligence
          </span>
        </div>

        {/* Headline */}
        <h1 ref={headlineRef} className="text-6xl md:text-8xl font-display font-extrabold text-brand-dark tracking-tight leading-[1.05] mb-8">
          <span className="hero-reveal inline-block mr-3">Uncover</span>
          <span className="hero-reveal inline-block mr-3">the</span>
          <span className="hero-reveal inline-block mr-3">signal</span>
          <br className="hidden md:block" />
          <span className="hero-reveal inline-block mr-3">in</span>
          <span className="hero-reveal inline-block mr-3">the</span>
          <span className="hero-reveal inline-block text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-cyan">
            noise.
          </span>
        </h1>

        <div ref={contentRef}>
          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-slate-500 mb-10 max-w-2xl mx-auto font-medium">
            Scale your B2B pipeline with precise, real-time data enrichment and AI scoring. 
            Find your next best customer in seconds.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 text-white font-semibold rounded-xl bg-gradient-to-r from-brand-blue to-brand-sky overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(2,61,187,0.25)]">
              <span className="relative z-10">Start for Free</span>
              <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="inline-flex items-center justify-center px-8 py-4 text-brand-blue font-semibold rounded-xl bg-transparent border-2 border-brand-blue/20 transition-all duration-300 hover:border-brand-blue hover:bg-brand-blue/5">
              Book a Demo
            </button>
          </div>

          {/* Trust Row */}
          <div className="pt-8 border-t border-slate-200/60 inline-block">
            <p className="text-xs text-slate-400 font-semibold tracking-wider uppercase mb-4">
              Powering growth for innovative teams
            </p>
            <div className="flex items-center justify-center gap-8 opacity-60">
              {/* Dummy SVG Logos for demo */}
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-8 w-24 bg-slate-300 rounded animate-pulse [animation-delay:0.2s]" style={{ animationDuration: '3s' }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60 animate-bounce">
        <span className="text-[10px] uppercase tracking-widest text-brand-blue font-semibold">Scroll</span>
        <ChevronDown className="w-4 h-4 text-brand-blue" />
      </div>
    </section>
  );
}
