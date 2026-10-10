"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, AtSign, Users, Briefcase, Building2, MapPin, Mail, Phone, Layers, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const CONFIG = {
  sourceLane: {
    title: 'ACCOUNT → PROFILES',
    label: 'SOURCE',
    accent: 'pink',
    colorHex: '#ec4899', // pink-500
    icon: Camera,
    path: 'M 15 25 C 45 25, 55 50, 85 50',
    packetDur: 5,
  },
  roleLane: {
    title: 'ROLE → CONTACTS',
    label: 'CRITERIA',
    accent: 'slate',
    colorHex: '#94a3b8', // slate-400
    icon: Briefcase,
    path: 'M 15 75 L 45 75 L 45 50 L 85 50',
    packetDur: 7,
  }
};

const MODE_STATES = ['BOTH', 'SOURCE', 'ROLE'];

export const InstagramVsPeopleScene = () => {
  const [modeIdx, setModeIdx] = useState(0);
  const [isLive, setIsLive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsLive(entry.isIntersecting && !document.hidden);
      },
      { threshold: 0, rootMargin: '100px' }
    );
    if (containerRef.current) observer.observe(containerRef.current);

    const onVis = () => setIsLive(!document.hidden && document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', onVis);

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setModeIdx((prev) => (prev + 1) % MODE_STATES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isLive]);

  const activeMode = MODE_STATES[modeIdx];
  const pinkOpacity = activeMode === 'BOTH' || activeMode === 'SOURCE' ? '1' : '0.35';
  const slateOpacity = activeMode === 'BOTH' || activeMode === 'ROLE' ? '1' : '0.35';

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative w-full h-full min-h-[500px] flex flex-col items-center justify-center p-4 overflow-hidden rounded-xl bg-[rgba(5,5,7,0.7)] border border-white/5",
        !isLive && "is-paused"
      )}
      aria-hidden="true"
    >
      {/* Indicator */}
      <div className="absolute top-6 flex items-center justify-center gap-2 z-20">
        {MODE_STATES.map((m, i) => (
          <div key={m} className="flex flex-col items-center gap-1">
            <span className={cn(
              "text-[11px] font-mono tracking-widest transition-colors duration-500",
              modeIdx === i ? "text-white" : "text-white/40"
            )}>
              {m}
            </span>
            <div className={cn(
              "h-[2px] w-8 rounded-full transition-colors duration-500",
              modeIdx === i ? "bg-white/60" : "bg-white/10"
            )} />
          </div>
        ))}
      </div>

      {/* Reduced Motion Overlay */}
      <div className="hidden motion-reduce:flex absolute inset-0 z-50 bg-[#050507] items-center justify-center">
        <div className="font-mono text-white/50 text-xs text-center">
          <div className="mb-2 text-pink-400">SOURCE: ACCOUNT → PROFILES</div>
          <div className="text-white/20 text-[10px] mb-2">▼</div>
          <div className="mb-2 text-white">LEAD LIST</div>
          <div className="text-white/20 text-[10px] mb-2">▲</div>
          <div className="text-slate-400">ROLE: CRITERIA → CONTACTS</div>
        </div>
      </div>

      <div className="relative w-full h-full min-h-[400px] motion-reduce:hidden sm:block flex flex-col sm:flex-row items-center sm:items-stretch">
        
        {/* SVG Paths & Packets */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 hidden sm:block" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="pink-packet-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="100%" stopColor={CONFIG.sourceLane.colorHex} />
            </linearGradient>
            <linearGradient id="slate-packet-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="100%" stopColor={CONFIG.roleLane.colorHex} />
            </linearGradient>
          </defs>

          {/* Paths */}
          <path d={CONFIG.sourceLane.path} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.2" strokeDasharray="0.5 1" vectorEffect="non-scaling-stroke" style={{ opacity: pinkOpacity, transition: 'opacity 0.5s' }} />
          <path d={CONFIG.roleLane.path} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.2" strokeDasharray="0.5 1" vectorEffect="non-scaling-stroke" style={{ opacity: slateOpacity, transition: 'opacity 0.5s' }} />

          {/* Flowing Avatars (Pink) */}
          <g style={{ opacity: pinkOpacity, transition: 'opacity 0.5s' }}>
            {[0, 1, 2, 3].map(i => (
              <g key={`pink-${i}`}>
                <circle r="1" fill="#ec4899" opacity="0.8" vectorEffect="non-scaling-stroke" />
                <animateMotion dur={`${CONFIG.sourceLane.packetDur}s`} repeatCount="indefinite" path={CONFIG.sourceLane.path} begin={`-${i * (CONFIG.sourceLane.packetDur / 4)}s`} />
              </g>
            ))}
          </g>

          {/* Flowing Nodes (Slate) */}
          <g style={{ opacity: slateOpacity, transition: 'opacity 0.5s' }}>
            {[0, 1, 2].map(i => (
              <g key={`slate-${i}`}>
                <rect x="-1" y="-1" width="2" height="2" fill="#94a3b8" opacity="0.8" vectorEffect="non-scaling-stroke" />
                <animateMotion dur={`${CONFIG.roleLane.packetDur}s`} repeatCount="indefinite" path={CONFIG.roleLane.path} begin={`-${i * (CONFIG.roleLane.packetDur / 3)}s`} />
              </g>
            ))}
          </g>
          
          {/* Dash Packets */}
          <path d={CONFIG.sourceLane.path} fill="none" stroke="url(#pink-packet-grad)" strokeWidth="1" strokeDasharray="10 100" className="dash-packet-pink" vectorEffect="non-scaling-stroke" style={{ opacity: pinkOpacity, transition: 'opacity 0.5s' }} />
          <path d={CONFIG.roleLane.path} fill="none" stroke="url(#slate-packet-grad)" strokeWidth="1" strokeDasharray="10 100" className="dash-packet-slate" vectorEffect="non-scaling-stroke" style={{ opacity: slateOpacity, transition: 'opacity 0.5s' }} />
        </svg>

        {/* HTML OVERLAYS */}
        
        {/* Source Node (Top Left) */}
        <div 
          className="absolute left-1/2 sm:left-[15%] top-[15%] sm:top-[25%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10"
          style={{ opacity: pinkOpacity, transition: 'opacity 0.5s' }}
        >
          <div className="absolute inset-0 bg-pink-500/10 blur-xl rounded-full" />
          <div className="relative w-12 h-12 mb-2">
            <svg className="absolute inset-0 w-full h-full animate-[spin_8s_linear_infinite]" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="src-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#facc15" />
                  <stop offset="50%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="48" fill="none" stroke="url(#src-grad)" strokeWidth="4" strokeDasharray="250" strokeDashoffset="0" />
            </svg>
            <div className="absolute inset-1 rounded-full bg-[#121214] border border-white/20 flex items-center justify-center">
              <Camera className="w-5 h-5 text-white/80" />
            </div>
          </div>
          <div className="font-mono text-xs tracking-widest text-pink-400 mb-1">{CONFIG.sourceLane.label}</div>
          <div className="font-mono text-[10px] text-white/70 tracking-wider whitespace-nowrap">{CONFIG.sourceLane.title}</div>
        </div>

        {/* Role Node (Bottom Left) */}
        <div 
          className="absolute left-1/2 sm:left-[15%] top-[85%] sm:top-[75%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10"
          style={{ opacity: slateOpacity, transition: 'opacity 0.5s' }}
        >
          <div className="absolute inset-0 bg-slate-500/10 blur-xl rounded-full" />
          <div className="relative w-12 h-12 mb-2 rounded border border-slate-400 bg-[#121214] flex items-center justify-center shadow-lg shadow-slate-900">
            <Briefcase className="w-5 h-5 text-white/80" />
          </div>
          
          <div className="font-mono text-xs tracking-widest text-slate-400 mb-1">{CONFIG.roleLane.label}</div>
          <div className="font-mono text-[10px] text-white/70 tracking-wider whitespace-nowrap">{CONFIG.roleLane.title}</div>
          
          {/* Filter Chips */}
          <div className="absolute top-1/2 left-full ml-4 -translate-y-1/2 flex-col gap-1 hidden sm:flex">
            {["TITLE", "SENIORITY", "LOCATION"].map(c => (
              <div key={c} className="px-1.5 py-0.5 bg-white/10 border border-white/20 rounded-sm text-[9px] font-mono text-white/70 whitespace-nowrap">
                {c}
              </div>
            ))}
          </div>
        </div>

        {/* Merge Node (Right) */}
        <div className="absolute left-1/2 sm:left-[85%] top-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20">
          <div className="absolute inset-0 bg-white/5 blur-xl rounded-full" />
          
          <div className="relative w-32 bg-[#121214] border border-white/20 rounded-lg p-3 shadow-2xl pulse-merge">
            {/* Input ports */}
            <div className="absolute -left-2 top-3 w-1.5 h-1.5 rounded-full bg-pink-500 border border-pink-500/50" style={{ opacity: pinkOpacity, transition: 'opacity 0.5s' }} />
            <div className="absolute -left-2 bottom-3 w-1.5 h-1.5 rounded-sm bg-slate-400 border border-slate-400/50" style={{ opacity: slateOpacity, transition: 'opacity 0.5s' }} />
            
            <div className="flex items-center gap-2 mb-3 border-b border-white/20 pb-2">
              <Layers className="w-4 h-4 text-white" />
              <span className="font-mono text-xs tracking-widest text-white">LEAD LIST</span>
            </div>
            
            {/* Rows */}
            <div className="space-y-1.5">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden flex">
                  <div className="h-full bg-pink-500/80 w-[40%]" />
                  <div className="h-full bg-slate-400/80 w-[60%]" />
                </div>
              ))}
            </div>
            
            {/* Balance Bar */}
            <div className="mt-3 w-full h-0.5 flex rounded-full overflow-hidden bg-white/20">
               <div className="h-full bg-pink-500 transition-all duration-[4s] ease-in-out" style={{ width: activeMode === 'SOURCE' ? '80%' : activeMode === 'ROLE' ? '20%' : '50%' }} />
               <div className="h-full bg-slate-400 transition-all duration-[4s] ease-in-out" style={{ width: activeMode === 'SOURCE' ? '20%' : activeMode === 'ROLE' ? '80%' : '50%' }} />
            </div>
          </div>
        </div>

      </div>

      <style jsx>{`
        .is-paused *, .is-paused {
          animation-play-state: paused !important;
        }

        .dash-packet-pink {
          animation: dashMovePink 5s linear infinite;
        }

        .dash-packet-slate {
          animation: dashMoveSlate 7s linear infinite;
        }

        .pulse-merge {
          animation: mildPulse 1.5s ease-in-out infinite alternate;
        }

        @keyframes dashMovePink {
          0% { stroke-dashoffset: 110; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 0; }
        }

        @keyframes dashMoveSlate {
          0% { stroke-dashoffset: 110; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 0; }
        }

        @keyframes mildPulse {
          0% { transform: scale(1); border-color: rgba(255,255,255,0.1); }
          100% { transform: scale(1.02); border-color: rgba(255,255,255,0.2); }
        }
      `}</style>
    </div>
  );
};
