"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { HeroHeader } from './hero-section-1';
import Footer from '@/app/components/landing/Footer';
import AuthModal from '@/app/components/AuthModal';
import { cn } from '@/lib/utils';
import { SectionRenderer } from './tool-template/SectionRenderer';
import { GridBackground } from './tool-template/primitives';
import dynamic from 'next/dynamic';
import { StaticGlow } from './tool-template/AmbientGlow';

const AmbientGlow = dynamic(() => import('./tool-template/AmbientGlow'), { 
  ssr: false, 
  loading: (props) => <StaticGlow tone={props?.tone || 'default'} /> 
});

export default function ToolTemplate({ data }) {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    return () => {
      document.documentElement.setAttribute('data-theme', 'light');
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#050507] text-white selection:bg-brand-blue/30 font-sans relative overflow-x-hidden">
      <AmbientGlow tone={data.tone || data.accent || 'default'} />
      <GridBackground />
      <div className="fixed inset-y-0 left-4 md:left-8 w-px border-l border-dashed border-white/10 pointer-events-none z-0 hidden lg:block" />
      <div className="fixed inset-y-0 right-4 md:right-8 w-px border-r border-dashed border-white/10 pointer-events-none z-0 hidden lg:block" />

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      
      <div className="tools-nav-wrapper relative z-50">
        <HeroHeader onLoginClick={() => setAuthModalOpen(true)} />
      </div>

      <main className="relative z-10 pt-32 pb-0 flex flex-col items-center">
        {/* HERO INTRO */}
        <section className="px-6 w-full max-w-4xl mx-auto text-center mb-24 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
              <span className="text-white">{data.hero.title.split(':')[0]}</span>
              {data.hero.title.includes(':') && (
                <span className="text-white/40">:{data.hero.title.split(':')[1]}</span>
              )}
            </h1>
            <p className="text-xl md:text-2xl text-white/60 mb-8 max-w-3xl mx-auto font-light leading-relaxed">
              {data.hero.subtitle}
            </p>
            <div className="space-y-4 mb-12">
              {data.hero.paragraphs.map((p, i) => (
                <p key={i} className="text-lg text-white/50 max-w-3xl mx-auto">{p}</p>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {data.hero.ctaText.split('\\n').map((cta, i) => (
                <button 
                  key={i}
                  className={cn(
                    "px-8 py-4 rounded font-medium text-sm tracking-wide transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-xl flex items-center justify-center gap-2",
                    i === 0 
                      ? "bg-white text-black hover:bg-slate-200" 
                      : "bg-[#0a0a0c] border border-white/10 text-white hover:bg-white/5"
                  )}
                  onClick={() => setAuthModalOpen(true)}
                >
                  {cta}
                  {i === 0 && <ArrowRight className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </motion.div>
        </section>

        {/* CONTENT BLOCKS */}
        <div className="w-full flex flex-col">
          {data.contentBlocks.map((block, idx) => (
            <SectionRenderer key={idx} block={block} accent={data.accent} index={idx} />
          ))}
        </div>

        {/* CTA BAND */}
        <section className="w-full py-24 border-t border-white/5 bg-[#050507] overflow-hidden relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-brand-blue/5 blur-[120px] pointer-events-none rounded-[100%]" />
          
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-white">
              {data.ctaBand.title}
            </h2>
            {data.ctaBand.paragraphs.map((p, i) => (
              <p key={i} className="text-xl text-white/60 mb-10 max-w-2xl mx-auto">
                {p}
              </p>
            ))}
            
            <button 
              onClick={() => setAuthModalOpen(true)}
              className="px-8 py-4 rounded bg-white text-black font-medium text-sm tracking-wide hover:bg-slate-200 transition-all duration-300 hover:scale-105 active:scale-95 inline-flex items-center justify-center gap-3"
            >
              {data.ctaBand.ctaText}
              <ArrowRight className="w-4 h-4" />
            </button>
            
            {data.ctaBand.betaNote && (
              <p className="mt-8 text-xs font-mono text-white/40 uppercase tracking-widest max-w-md mx-auto flex items-center justify-center gap-2">
                <span className="w-1 h-1 rounded-full bg-brand-blue animate-pulse" />
                NOTE: {data.ctaBand.betaNote}
              </p>
            )}
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="w-full border-t border-white/5 bg-[#050507]">
          <div className="max-w-3xl mx-auto px-6 py-32">
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-4 tracking-tight">FAQ</h2>
            </div>
            
            <div className="border-t border-white/10">
              {data.faqs.map((faq, i) => (
                <div key={i} className="border-b border-white/5">
                  <button
                    className="w-full py-6 flex items-center justify-between text-left focus:outline-none group"
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  >
                    <span className="font-medium text-lg text-white/80 group-hover:text-white transition-colors pr-8">{faq.question}</span>
                    <ChevronDown 
                      className={cn(
                        "w-5 h-5 text-white/40 transition-transform duration-300 flex-shrink-0",
                        activeFaq === i ? "rotate-180" : ""
                      )} 
                    />
                  </button>
                  <AnimatePresence>
                    {activeFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pb-8 text-white/50 leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <div className="bg-[#050507] border-t border-white/5 relative z-10">
        <Footer theme="dark" />
      </div>

      <style jsx global>{`
        /* Override Header for Dark Page */
        .tools-nav-wrapper header nav {
            transition: all 0.3s ease;
        }
        
        /* Make the navbar glassmorphic dark when scrolled */
        .tools-nav-wrapper .scrolled-nav-pill {
            background-color: rgba(5, 5, 10, 0.7) !important;
            border-color: rgba(255, 255, 255, 0.1) !important;
        }
        
        /* Force links to white */
        .tools-nav-wrapper .text-slate-700 {
            color: rgba(255, 255, 255, 0.8) !important;
        }
        .tools-nav-wrapper .text-slate-700:hover {
            color: rgba(255, 255, 255, 1) !important;
        }
        
        /* Fix Logo Text Colors */
        .tools-nav-wrapper .text-brand-dark {
            color: #ffffff !important;
        }
        .tools-nav-wrapper .text-\\[\\#023dbb\\] {
            color: #1E61ED !important;
        }
        
        /* Ensure logo paths become white */
        .tools-nav-wrapper svg path[fill="#0f172a"], 
        .tools-nav-wrapper svg path:not([fill="none"]) {
            fill: #ffffff;
        }
        .tools-nav-wrapper svg path[fill="#023dbb"] {
            fill: #1E61ED !important;
        }
        
        /* Override Login button */
        .tools-nav-wrapper button.border-input,
        .tools-nav-wrapper a.border-input {
            border-color: rgba(255, 255, 255, 0.2) !important;
            color: white !important;
            background: transparent !important;
        }
        .tools-nav-wrapper button.border-input:hover,
        .tools-nav-wrapper a.border-input:hover {
            background: rgba(255, 255, 255, 0.1) !important;
        }
        
        /* Exclude dropdowns from white text override */
        .tools-nav-wrapper .bg-\\[\\#f8f9fa\\] .text-slate-700,
        .tools-nav-wrapper .bg-\\[\\#f8f9fa\\] .text-slate-900,
        .tools-nav-wrapper .bg-\\[\\#f8f9fa\\] .text-slate-500 {
            color: inherit !important;
        }
        .tools-nav-wrapper .bg-\\[\\#f8f9fa\\] svg path {
            fill: inherit !important;
        }
      `}</style>
    </div>
  );
}
