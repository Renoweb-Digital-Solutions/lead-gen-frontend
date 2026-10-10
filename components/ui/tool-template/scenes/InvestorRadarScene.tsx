"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Search, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const CONFIG = {
  accent: 'orange',
  colorHex: '#f97316', // orange-500
  inputs: [
    { label: 'DESCRIPTION', x: 20, y: 20 },
    { label: 'INDUSTRY', x: 80, y: 20 },
    { label: 'AUDIENCE', x: 20, y: 80 },
    { label: 'STAGE', x: 80, y: 80 },
  ],
  investors: [
    { id: 1, name: 'Northwind Capital', ring: 1, angle: 45, stage: 'SEED', score: 95 },
    { id: 2, name: 'Alder Ventures', ring: 2, angle: 120, stage: 'SERIES A', score: 82 },
    { id: 3, name: 'Kestrel Angels', ring: 1, angle: 210, stage: 'PRE-SEED', score: 91 },
    { id: 4, name: 'Lumina Partners', ring: 3, angle: 300, stage: 'LATE', score: 65 },
    { id: 5, name: 'Vanguard Seed', ring: 2, angle: 15, stage: 'SEED', score: 85 },
    { id: 6, name: 'Apex Syndicate', ring: 1, angle: 160, stage: 'SEED', score: 89 },
    { id: 7, name: 'Beacon Fund', ring: 3, angle: 250, stage: 'GROWTH', score: 58 },
    { id: 8, name: 'Meridian Capital', ring: 2, angle: 330, stage: 'SERIES A', score: 78 },
  ]
};

// Map angle to a 0-1 percentage of the radar sweep (which starts at 12 o'clock, angle 0, clockwise)
const getDelayForAngle = (angle: number, duration: number) => {
  // Convert standard math angle to clock angle
  let clockAngle = (angle + 90) % 360;
  if (clockAngle < 0) clockAngle += 360;
  return (clockAngle / 360) * duration;
};

export const InvestorRadarScene = () => {
  const [isLive, setIsLive] = useState(false);
  const [resultsCount, setResultsCount] = useState(0);
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
      setResultsCount(prev => (prev >= 24 ? 24 : prev + 1));
    }, 333); // reach 24 in 8 seconds
    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative w-full h-full min-h-[500px] flex items-center justify-center p-4 overflow-hidden rounded-xl bg-transparent",
        !isLive && "is-paused"
      )}
      aria-hidden="true"
    >
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px] mask-radial-fade pointer-events-none" />

      {/* Reduced Motion Static Fallback */}
      <div className="hidden motion-reduce:flex absolute inset-0 z-50 bg-[#050507] items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="relative w-64 h-64 border border-white/10 rounded-full flex items-center justify-center mb-8">
            <div className="w-48 h-48 border border-white/10 rounded-full flex items-center justify-center">
              <div className="w-32 h-32 border border-white/10 rounded-full flex items-center justify-center">
                <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                  <Rocket className="w-5 h-5 text-orange-500" />
                </div>
              </div>
            </div>
            
            {CONFIG.investors.map(inv => {
              const r = inv.ring === 1 ? 16 : inv.ring === 2 ? 24 : 32;
              const x = 50 + r * Math.cos(inv.angle * Math.PI / 180);
              const y = 50 + r * Math.sin(inv.angle * Math.PI / 180);
              return (
                <div key={inv.id} className="absolute w-1.5 h-1.5 bg-orange-500 rounded-full" style={{ left: `${x}%`, top: `${y}%` }} />
              );
            })}
          </div>
          <div className="font-mono text-xs tracking-widest text-white/50">RESULTS: 24</div>
        </div>
      </div>

      <div className="relative w-full h-full min-h-[500px] flex items-center justify-center motion-reduce:hidden">
        
        {/* Radar Rings Container */}
        <div className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] flex items-center justify-center z-10">
          
          {/* Background Glow */}
          <div className="absolute inset-0 bg-orange-500/5 blur-3xl rounded-full" />
          
          {/* Radar Sweep Wedge */}
          <div className="absolute inset-0 rounded-full overflow-hidden border border-white/5">
            <div className="absolute inset-[-50%] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_270deg,rgba(249,115,22,0.2)_360deg)] animate-[spin_8s_linear_infinite]" style={{ transformOrigin: '50% 50%' }} />
          </div>

          {/* Rings */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
            {/* Broad (Ring 3) */}
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.2" className="ring-draw-3" />
            <text x="50" y="7" fill="rgba(255,255,255,0.4)" fontSize="2.5" fontFamily="monospace" textAnchor="middle" letterSpacing="0.1">BROAD</text>
            
            {/* Relevant (Ring 2) */}
            <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.2" className="ring-draw-2" />
            <text x="50" y="22" fill="rgba(255,255,255,0.6)" fontSize="2.5" fontFamily="monospace" textAnchor="middle" letterSpacing="0.1">RELEVANT</text>
            
            {/* Close Fit (Ring 1) */}
            <circle cx="50" cy="50" r="15" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.2" className="ring-draw-1" />
            <text x="50" y="37" fill="rgba(249,115,22,0.9)" fontSize="2.5" fontFamily="monospace" textAnchor="middle" letterSpacing="0.1">CLOSE FIT</text>

            {/* Input Lines connecting chips to center */}
            {CONFIG.inputs.map((input, i) => (
              <g key={i}>
                <line x1={input.x} y1={input.y} x2="50" y2="50" stroke="rgba(255,255,255,0.1)" strokeWidth="0.2" strokeDasharray="1 1" />
                <line x1={input.x} y1={input.y} x2="50" y2="50" stroke="rgba(249,115,22,0.5)" strokeWidth="0.4" strokeDasharray="5 100" className="input-packet" style={{ animationDelay: `${i * 1.2}s` }} />
              </g>
            ))}
          </svg>

          {/* Input Chips */}
          {CONFIG.inputs.map((input, i) => (
            <div 
              key={i} 
              className="absolute bg-[#0a0a0c] border border-white/20 rounded-sm px-2 py-1 font-mono text-[9px] sm:text-[10px] text-white/80 z-20 shadow-lg input-chip-pop"
              style={{ left: `${input.x}%`, top: `${input.y}%`, transform: 'translate(-50%, -50%)', animationDelay: `${0.2 + i * 0.1}s` }}
            >
              {input.label}
            </div>
          ))}

          {/* Center Profile Node */}
          <div className="absolute left-58 top-58 -translate-x-1/2 -translate-y-1/2 w-12 h-12 sm:w-16 sm:h-16 bg-[#0a0a0c] border border-orange-500/30 rounded-full flex flex-col items-center justify-center z-30 shadow-[0_0_20px_rgba(249,115,22,0.2)] center-pop">
            <Rocket className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 mb-0.5 translate-x-[1px] sm:translate-x-0.5" />
            <span className="font-mono text-[5px] sm:text-[6px] tracking-widest text-white/90 hidden sm:block text-center leading-[1.2] translate-x-[1px]">YOUR<br/>COMPANY</span>
          </div>

          {/* Investor Tags Landing */}
          {CONFIG.investors.map((inv, i) => {
            const r = inv.ring === 1 ? 15 : inv.ring === 2 ? 30 : 45;
            // Angle in polar coordinates (0 is 3 o'clock)
            const x = 50 + r * Math.cos(inv.angle * Math.PI / 180);
            const y = 50 + r * Math.sin(inv.angle * Math.PI / 180);
            
            // Calculate delay based on sweep angle
            let sweepAngle = (inv.angle + 90) % 360;
            if (sweepAngle < 0) sweepAngle += 360;
            const appearDelay = (sweepAngle / 360) * 8; // 8s loop
            
            return (
              <div 
                key={inv.id}
                className="absolute flex items-center gap-1.5 bg-[#0a0a0c] border border-white/10 rounded-full px-1.5 py-1 z-20 tag-appear"
                style={{ 
                  left: `${x}%`, 
                  top: `${y}%`, 
                  transform: 'translate(-50%, -50%)',
                  animationDelay: `${appearDelay}s` 
                }}
              >
                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
                  <User className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-orange-400" />
                </div>
                <span className="font-mono text-[8px] sm:text-[9px] text-white/90 whitespace-nowrap hidden sm:block pr-1">
                  {inv.name}
                </span>
              </div>
            );
          })}

        </div>

        {/* Results List Strip (Right or Bottom) */}
        <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 w-48 sm:w-56 bg-[#0a0a0c]/80 backdrop-blur-md border border-white/10 rounded-lg p-3 sm:p-4 z-40 hidden md:block">
          <div className="flex items-center justify-between border-b border-white/20 pb-2 mb-3">
            <span className="font-mono text-[10px] sm:text-xs tracking-widest text-white/80">RESULTS</span>
            <span className="font-mono text-[10px] sm:text-xs text-orange-400">{resultsCount}</span>
          </div>
          <div className="space-y-2">
            {CONFIG.investors.slice(0, 4).map((inv, i) => (
              <div key={inv.id} className="flex items-center justify-between result-row" style={{ animationDelay: `${i * 1 + 2}s` }}>
                <div className="flex flex-col">
                  <span className={cn("font-mono text-[10px] sm:text-[11px]", i === 0 ? "text-orange-300" : "text-white")}>
                    {inv.name}
                  </span>
                  <span className="font-mono text-[8px] sm:text-[9px] text-white/60 mt-0.5">{inv.stage}</span>
                </div>
                <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500/70" style={{ width: `${inv.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Caption */}
        <div className="absolute bottom-4 font-mono text-[10px] sm:text-[11px] tracking-widest text-white/40 uppercase hidden sm:block">
          DISCOVERY ≠ QUALIFICATION
        </div>

      </div>

      <style jsx>{`
        .is-paused *, .is-paused {
          animation-play-state: paused !important;
        }

        .mask-radial-fade {
          mask-image: radial-gradient(ellipse at center, black 40%, transparent 70%);
        }

        .ring-draw-1 { stroke-dasharray: 100; stroke-dashoffset: 100; animation: draw 1.5s ease-out forwards; animation-delay: 0.1s; }
        .ring-draw-2 { stroke-dasharray: 200; stroke-dashoffset: 200; animation: draw 1.5s ease-out forwards; animation-delay: 0.2s; }
        .ring-draw-3 { stroke-dasharray: 300; stroke-dashoffset: 300; animation: draw 1.5s ease-out forwards; animation-delay: 0.3s; }

        .center-pop {
          opacity: 0;
          transform: translate(-50%, -50%) scale(0.8);
          animation: popSpring 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          animation-delay: 0.5s;
        }

        .input-chip-pop {
          opacity: 0;
          transform: translate(-50%, -50%) scale(0.5);
          animation: popSpring 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        .input-packet {
          animation: dashMove 3s linear infinite;
        }

        .tag-appear {
          opacity: 0;
          transform: translate(-50%, -50%) scale(0.5);
          /* Use infinite loop synced to the 8s radar sweep */
          animation: tagSpringCycle 8s infinite;
        }

        .result-row {
          opacity: 0;
          transform: translateY(4px);
          animation: fadeUp 0.5s ease-out forwards;
        }

        @keyframes draw {
          to { stroke-dashoffset: 0; }
        }

        @keyframes popSpring {
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }

        @keyframes dashMove {
          0% { stroke-dashoffset: 105; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 0; }
        }

        @keyframes tagSpringCycle {
          0%, 10% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
          12% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
          15%, 85% { opacity: 1; transform: translate(-50%, -50%) scale(1) translateY(-2px); }
          95%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
        }

        @keyframes fadeUp {
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
