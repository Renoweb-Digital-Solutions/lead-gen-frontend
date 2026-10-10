"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Building2, Phone, Database, BookUser, Layers, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MonoLabel } from '../../primitives';

const FAKE_DATA = [
  { name: 'Harbor Plumbing Co.', city: 'Austin, TX', phone: '(555) 010-0142' },
  { name: 'Lakeside Dental', city: 'Denver, CO', phone: '(555) 012-4091' },
  { name: 'Apex Builders', city: 'Seattle, WA', phone: '(555) 091-8843' },
  { name: 'Pioneer Supply', city: 'Chicago, IL', phone: '(555) 110-3321' },
  { name: 'IronWorks Fab', city: 'Houston, TX', phone: '(555) 020-9932' }
];

const QUERIES = [
  { keyword: 'plumbers', loc: 'Austin, TX' },
  { keyword: 'dentists', loc: 'Denver, CO' },
  { keyword: 'builders', loc: 'Seattle, WA' }
];

const TypingQuery = ({ isLive }: { isLive: boolean }) => {
  const [text, setText] = useState('');
  const [queryIdx, setQueryIdx] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (!isLive) return;
    
    let timeout: NodeJS.Timeout;
    const currentQ = `${QUERIES[queryIdx].keyword} in ${QUERIES[queryIdx].loc}`;
    
    if (isTyping) {
      if (text.length < currentQ.length) {
        timeout = setTimeout(() => {
          setText(currentQ.slice(0, text.length + 1));
        }, 100);
      } else {
        timeout = setTimeout(() => setIsTyping(false), 2000);
      }
    } else {
      if (text.length > 0) {
        timeout = setTimeout(() => {
          setText(text.slice(0, text.length - 1));
        }, 50);
      } else {
        setQueryIdx((i) => (i + 1) % QUERIES.length);
        setIsTyping(true);
      }
    }
    
    return () => clearTimeout(timeout);
  }, [text, isTyping, isLive, queryIdx]);

  return (
    <span className="font-mono text-xs text-white/80 whitespace-nowrap overflow-hidden">
      {text}<span className="animate-pulse inline-block w-1.5 h-3.5 bg-yellow-400 ml-0.5 align-middle" />
    </span>
  );
};

export const DirectorySearchScene = () => {
  const [isLive, setIsLive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsLive(entry.isIntersecting && !document.hidden);
    }, { threshold: 0 });
    if (containerRef.current) observer.observe(containerRef.current);
    const onVis = () => setIsLive(!document.hidden && document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', onVis);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative w-full h-full min-h-[600px] flex flex-col items-center justify-between p-6 overflow-hidden rounded-xl bg-[#050507] border border-white/5",
        !isLive && "is-paused"
      )}
      aria-hidden="true"
    >
      {/* Decorative Grid & Crop Marks */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '24px 24px', maskImage: 'radial-gradient(ellipse at center, black 10%, transparent 80%)' }} />
      <div className="absolute top-4 left-4 w-3 h-3 border-t border-l border-white/20" />
      <div className="absolute top-4 right-4 w-3 h-3 border-t border-r border-white/20" />
      <div className="absolute bottom-4 left-4 w-3 h-3 border-b border-l border-white/20" />
      <div className="absolute bottom-4 right-4 w-3 h-3 border-b border-r border-white/20" />
      
      {/* Travelling Border Light */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent -translate-x-full animate-[slideRight_4s_linear_infinite]" />

      {/* SVG Background Layer */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 hidden sm:block motion-reduce:hidden">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
          <defs>
            <linearGradient id="yellow-fade-down" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="50%" stopColor="rgba(234,179,8,0.4)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
            <clipPath id="stream-clip">
              <rect x="0" y="35" width="100" height="40" />
            </clipPath>
          </defs>

          {/* Lines from Query to Sources */}
          <path id="q-to-s1" d="M 50 18 C 30 18, 30 35, 30 35" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.2" vectorEffect="non-scaling-stroke" />
          <path id="q-to-s2" d="M 50 18 C 70 18, 70 35, 70 35" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.2" vectorEffect="non-scaling-stroke" />
          
          <path d="M 50 18 C 30 18, 30 35, 30 35" fill="none" stroke="url(#yellow-fade-down)" strokeWidth="1.5" strokeDasharray="10 100" className="animate-[dashMove_2s_linear_infinite]" vectorEffect="non-scaling-stroke" />
          <path d="M 50 18 C 70 18, 70 35, 70 35" fill="none" stroke="url(#yellow-fade-down)" strokeWidth="1.5" strokeDasharray="10 100" className="animate-[dashMove_2.5s_linear_infinite]" vectorEffect="non-scaling-stroke" />

          {/* Lines from Sources to Table */}
          <path id="s1-to-t" d="M 30 45 C 30 65, 45 75, 45 75" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.2" vectorEffect="non-scaling-stroke" />
          <path id="s2-to-t" d="M 70 45 C 70 65, 55 75, 55 75" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.2" vectorEffect="non-scaling-stroke" />

          {/* Stream Container */}
          <g clipPath="url(#stream-clip)">
            {/* Left Stream */}
            <g>
              <g className="packet-anim-1 opacity-0">
                <rect x="-10" y="-3" width="20" height="6" rx="1" fill="#0a0a0c" stroke="rgba(234,179,8,0.3)" strokeWidth="0.3" vectorEffect="non-scaling-stroke" />
                <rect x="-8.5" y="-1.5" width="3" height="3" fill="rgba(234,179,8,0.2)" />
                <text x="-4" y="0.8" fill="rgba(255,255,255,0.9)" fontSize="2.5" fontFamily="monospace">{FAKE_DATA[0].name.split(' ')[0]}</text>
                <text x="3" y="0.8" fill="rgba(255,255,255,0.4)" fontSize="1.8" fontFamily="monospace">TX</text>
              </g>
              <g className="packet-anim-2 opacity-0">
                <rect x="-10" y="-3" width="20" height="6" rx="1" fill="#0a0a0c" stroke="rgba(255,255,255,0.1)" strokeWidth="0.3" vectorEffect="non-scaling-stroke" />
                <rect x="-8.5" y="-1.5" width="3" height="3" fill="rgba(255,255,255,0.1)" />
                <text x="-4" y="0.8" fill="rgba(255,255,255,0.5)" fontSize="2.5" fontFamily="monospace">DUPLICATE</text>
              </g>
            </g>

            {/* Right Stream */}
            <g>
              <g className="packet-anim-3 opacity-0">
                <rect x="-10" y="-3" width="20" height="6" rx="1" fill="#0a0a0c" stroke="rgba(234,179,8,0.3)" strokeWidth="0.3" vectorEffect="non-scaling-stroke" />
                <rect x="-8.5" y="-1.5" width="3" height="3" fill="rgba(234,179,8,0.2)" />
                <text x="-4" y="0.8" fill="rgba(255,255,255,0.9)" fontSize="2.5" fontFamily="monospace">{FAKE_DATA[1].name.split(' ')[0]}</text>
                <text x="4" y="0.8" fill="rgba(255,255,255,0.4)" fontSize="1.8" fontFamily="monospace">CO</text>
              </g>
            </g>

            {/* Scanning Bar */}
            <g className="animate-[scanSweep_4s_linear_infinite]">
              <rect x="20" y="35" width="60" height="1" fill="rgba(234,179,8,0.6)" />
              <rect x="20" y="32" width="60" height="3" fill="url(#yellow-fade-down)" />
            </g>
          </g>
        </svg>
      </div>

      {/* DOM Overlays */}

      {/* 1. QUERY BAR */}
      <div className="relative z-10 w-full max-w-sm mt-4">
        <MonoLabel className="absolute -top-6 left-0 text-white/30 hidden sm:block">SYS.QUERY</MonoLabel>
        <div className="absolute inset-0 bg-yellow-500/10 blur-xl rounded-full" />
        <div className="relative bg-[#0a0a0c] border border-white/10 rounded-lg p-2 sm:p-3 shadow-2xl flex flex-col gap-2">
          <div className="flex gap-2 border-b border-white/5 pb-2">
            <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded text-[9px] font-mono tracking-widest text-white/60">
              <Search className="w-3 h-3 text-yellow-400/80" />
              KEYWORD
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded text-[9px] font-mono tracking-widest text-white/60">
              <MapPin className="w-3 h-3 text-yellow-400/80" />
              LOCATION
            </div>
          </div>
          <div className="px-2 h-6 flex items-center motion-reduce:hidden">
            <TypingQuery isLive={isLive} />
          </div>
          <div className="px-2 h-6 items-center hidden motion-reduce:flex">
             <span className="font-mono text-xs text-white/80">plumbers in Austin, TX</span>
          </div>
        </div>
      </div>

      {/* 2. DIRECTORY SOURCES */}
      <div className="relative z-10 w-full max-w-md flex justify-between gap-4 mt-6 sm:mt-12">
        <MonoLabel className="absolute -top-8 left-1/2 -translate-x-1/2 text-white/30 hidden sm:block">SOURCES</MonoLabel>
        
        {/* Source 1 */}
        <div className="relative flex flex-col items-center flex-1">
          <div className="absolute inset-0 bg-yellow-500/5 blur-lg rounded-full" />
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-[#0a0a0c] border border-yellow-500/30 rounded-xl flex items-center justify-center shadow-lg source-pulse-1 motion-reduce:animate-none">
            <Database className="w-6 h-6 text-yellow-400/80" />
          </div>
          <div className="mt-3 font-mono text-[9px] sm:text-[10px] tracking-widest text-white/60 bg-white/5 px-2 py-1 rounded border border-white/5">DIRECTORY A · US</div>
        </div>

        {/* Source 2 */}
        <div className="relative flex flex-col items-center flex-1">
          <div className="absolute inset-0 bg-yellow-500/5 blur-lg rounded-full" />
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-[#0a0a0c] border border-yellow-500/30 rounded-xl flex items-center justify-center shadow-lg source-pulse-2 motion-reduce:animate-none">
            <BookUser className="w-6 h-6 text-yellow-400/80" />
          </div>
          <div className="mt-3 font-mono text-[9px] sm:text-[10px] tracking-widest text-white/60 bg-white/5 px-2 py-1 rounded border border-white/5">DIRECTORY B · B2B</div>
        </div>
      </div>

      {/* 4. RECORD TABLE */}
      <div className="relative z-10 w-full max-w-lg mt-6 sm:mt-24 mb-4">
        <MonoLabel className="absolute -top-6 left-0 text-white/30 hidden sm:block">RECORDS</MonoLabel>
        <div className="absolute inset-0 bg-yellow-500/5 blur-xl rounded-2xl" />
        <div className="relative bg-[#0a0a0c] border border-white/10 rounded-xl shadow-2xl overflow-hidden table-pulse motion-reduce:animate-none">
          
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-white/5 border-b border-white/10">
            <div className="col-span-5 font-mono text-[9px] tracking-widest text-white/40">NAME</div>
            <div className="col-span-3 font-mono text-[9px] tracking-widest text-white/40">CITY</div>
            <div className="col-span-4 font-mono text-[9px] tracking-widest text-white/40">PHONE</div>
          </div>

          {/* Rows */}
          <div className="flex flex-col">
            {FAKE_DATA.slice(0, 4).map((row, i) => (
              <div 
                key={i} 
                className={cn(
                  "grid grid-cols-12 gap-4 px-4 py-3 border-b border-white/5 last:border-0 items-center",
                  i === 0 ? "bg-yellow-500/10" : (i > 2 ? "hidden sm:grid" : "")
                )}
              >
                <div className="col-span-5 flex items-center gap-2 overflow-hidden">
                  <Building2 className={cn("w-3 h-3 flex-shrink-0", i === 0 ? "text-yellow-400" : "text-white/20")} />
                  <span className={cn("text-xs truncate font-medium", i === 0 ? "text-yellow-400" : "text-white/80")}>{row.name}</span>
                </div>
                <div className="col-span-3 flex items-center gap-1.5 overflow-hidden">
                  <MapPin className={cn("w-2.5 h-2.5 flex-shrink-0 hidden sm:block", i === 0 ? "text-yellow-400/60" : "text-white/20")} />
                  <span className={cn("text-[11px] truncate", i === 0 ? "text-yellow-400/80" : "text-white/50")}>{row.city}</span>
                </div>
                <div className="col-span-4 flex items-center gap-1.5 overflow-hidden">
                  <Phone className={cn("w-2.5 h-2.5 flex-shrink-0 hidden sm:block", i === 0 ? "text-yellow-400/60" : "text-white/20")} />
                  <span className={cn("text-[11px] font-mono truncate", i === 0 ? "text-yellow-400/80" : "text-white/50")}>{row.phone}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Footer & Merge Indicator */}
          <div className="bg-[#050507] border-t border-white/10 px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] tracking-widest text-yellow-400/60 border border-yellow-400/20 bg-yellow-400/10 px-1.5 py-0.5 rounded">SAMPLE DATA</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden hidden sm:flex">
                <div className="h-full bg-yellow-400 animate-[rebalance_4s_ease-in-out_infinite_alternate]" style={{ width: '45%' }} />
                <div className="h-full bg-white/40 flex-1" />
              </div>
              <span className="font-mono text-[9px] tracking-widest text-white/40 flex items-center gap-1">
                RESULTS <span className="text-white/80 counter-anim motion-reduce:hidden">48</span><span className="text-white/80 hidden motion-reduce:inline">48</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .is-paused *, .is-paused {
          animation-play-state: paused !important;
        }

        .packet-anim-1 {
          animation: slideDown1 4s linear infinite;
        }
        .packet-anim-2 {
          animation: slideDown2 4s linear infinite;
          animation-delay: 2s;
        }
        .packet-anim-3 {
          animation: slideDown3 3.5s linear infinite;
          animation-delay: 1s;
        }

        .source-pulse-1 {
          animation: pulseRing 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .source-pulse-2 {
          animation: pulseRing 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          animation-delay: 1s;
        }

        .table-pulse {
          animation: mildPulse 2s ease-in-out infinite alternate;
        }

        .counter-anim {
          animation: countUp 4s steps(4) infinite;
        }

        @keyframes dashMove {
          0% { stroke-dashoffset: 110; }
          100% { stroke-dashoffset: 0; }
        }

        @keyframes slideRight {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes scanSweep {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 1; }
          90% { transform: translateY(40px); opacity: 1; }
          100% { transform: translateY(40px); opacity: 0; }
        }

        @keyframes slideDown1 {
          0% { transform: translate(30px, 45px); opacity: 0; }
          10% { opacity: 1; }
          30% { transform: translate(30px, 65px); }
          50% { transform: translate(45px, 75px); opacity: 1; }
          55% { transform: translate(45px, 75px); opacity: 0; }
          100% { opacity: 0; }
        }
        
        @keyframes slideDown2 {
          0% { transform: translate(30px, 45px); opacity: 0; }
          10% { opacity: 1; }
          30% { transform: translate(30px, 55px); opacity: 0.3; }
          40% { transform: translate(30px, 60px); opacity: 0; }
          100% { opacity: 0; }
        }

        @keyframes slideDown3 {
          0% { transform: translate(70px, 45px); opacity: 0; }
          10% { opacity: 1; }
          30% { transform: translate(70px, 65px); }
          50% { transform: translate(55px, 75px); opacity: 1; }
          55% { transform: translate(55px, 75px); opacity: 0; }
          100% { opacity: 0; }
        }

        @keyframes pulseRing {
          0%, 100% { box-shadow: 0 0 0 0 rgba(234, 179, 8, 0.4); }
          50% { box-shadow: 0 0 0 15px rgba(234, 179, 8, 0); }
        }

        @keyframes mildPulse {
          0% { border-color: rgba(255,255,255,0.1); }
          100% { border-color: rgba(234,179,8,0.3); }
        }

        @keyframes rebalance {
          0% { width: 30%; }
          100% { width: 70%; }
        }
        
        @keyframes countUp {
          0% { content: "48"; }
          25% { content: "51"; }
          50% { content: "53"; }
          75% { content: "54"; }
          100% { content: "48"; }
        }
      `}</style>
    </div>
  );
};
