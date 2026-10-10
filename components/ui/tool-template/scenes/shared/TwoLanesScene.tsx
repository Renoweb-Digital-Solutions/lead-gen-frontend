"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Briefcase, Camera, Database, Layers, Users, Building2, MapPin, Mail, Play, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export type Tone = 'red' | 'slate' | 'pink' | 'yellow' | 'green' | 'orange';
export type Shape = 'organic' | 'orthogonal';

export interface LaneItem {
  id: string;
  type: 'channel' | 'square' | 'avatar';
  label: string;
  sub?: string;
  hasMail?: boolean;
  iconName?: 'Users' | 'Building2' | 'MapPin';
}

export interface LaneConfig {
  id: string;
  label: string;
  shortLabel: string;
  tone: Tone;
  shape: Shape;
  startNode: {
    type: 'search' | 'briefcase' | 'camera' | 'database';
    chips?: string[];
  };
  items: LaneItem[];
  packetDur: number;
}

export interface TwoLanesSceneProps {
  lane1: LaneConfig;
  lane2: LaneConfig;
  mergeLabel: string;
}

const TONE_COLORS: Record<Tone, string> = {
  red: '#ef4444',
  slate: '#94a3b8',
  pink: '#ec4899',
  yellow: '#eab308',
  green: '#22c55e',
  orange: '#f97316',
};

const getIcon = (name?: string) => {
  if (name === 'Users') return Users;
  if (name === 'Building2') return Building2;
  if (name === 'MapPin') return MapPin;
  return User;
};

const StartNode = ({ config, isActive }: { config: LaneConfig, isActive: boolean }) => {
  const color = TONE_COLORS[config.tone];
  
  if (config.startNode.type === 'search') {
    return (
      <div className={cn("relative flex flex-col items-center", !isActive && "opacity-35 transition-opacity duration-500")}>
        <div className="absolute inset-0 blur-xl rounded-full opacity-20" style={{ backgroundColor: color }} />
        <div className="relative w-28 h-10 bg-[#0a0a0c] border rounded-md flex items-center px-3 shadow-lg z-10" style={{ borderColor: `${color}40` }}>
          <Search className="w-4 h-4 mr-2" style={{ color: `${color}80` }} />
          <div className="flex gap-1 items-center">
            {config.startNode.chips?.map(chip => (
              <div key={chip} className="px-1.5 py-0.5 rounded text-[8px] font-mono tracking-widest bg-white/10 text-white/80 border border-white/20">
                {chip}
              </div>
            ))}
            <div className="w-0.5 h-3 bg-white/60 animate-pulse ml-1" />
          </div>
        </div>
      </div>
    );
  }
  
  if (config.startNode.type === 'briefcase') {
    return (
      <div className={cn("relative flex flex-col items-center", !isActive && "opacity-35 transition-opacity duration-500")}>
        <div className="absolute inset-0 blur-xl rounded-full opacity-20" style={{ backgroundColor: color }} />
        <div className="relative w-12 h-12 bg-[#0a0a0c] border rounded-md flex items-center justify-center shadow-lg z-10" style={{ borderColor: `${color}40` }}>
          <Briefcase className="w-5 h-5" style={{ color: `${color}80` }} />
          {/* Filter Chips */}
          <div className="absolute top-1/2 left-full ml-3 -translate-y-1/2 flex flex-col gap-1 hidden sm:flex z-20">
            {config.startNode.chips?.map(chip => (
              <div key={chip} className="px-1.5 py-0.5 rounded-sm text-[8px] font-mono tracking-widest bg-white/5 text-white/60 border border-white/10 whitespace-nowrap">
                {chip}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export const TwoLanesScene = ({ lane1, lane2, mergeLabel }: TwoLanesSceneProps) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isLive, setIsLive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const MODES = ['BOTH', lane1.shortLabel, lane2.shortLabel];

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

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % MODES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isLive, MODES.length]);

  const activeMode = MODES[activeIdx];
  const isLane1Active = activeMode === 'BOTH' || activeMode === lane1.shortLabel;
  const isLane2Active = activeMode === 'BOTH' || activeMode === lane2.shortLabel;

  const path1 = lane1.shape === 'organic' ? 'M 15 25 C 45 25, 55 50, 85 50' : 'M 15 25 L 45 25 L 45 50 L 85 50';
  const path2 = lane2.shape === 'orthogonal' ? 'M 15 75 L 45 75 L 45 50 L 85 50' : 'M 15 75 C 45 75, 55 50, 85 50';

  const color1 = TONE_COLORS[lane1.tone];
  const color2 = TONE_COLORS[lane2.tone];

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative w-full h-full min-h-[500px] flex flex-col items-center justify-center p-4 overflow-hidden rounded-xl bg-[rgba(5,5,7,0.7)] border border-white/5",
        !isLive && "is-paused"
      )}
      aria-hidden="true"
    >
      {/* Decorative Grid & Crop Marks */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '24px 24px', maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)' }} />
      <div className="absolute top-4 left-4 w-3 h-3 border-t border-l border-white/20" />
      <div className="absolute top-4 right-4 w-3 h-3 border-t border-r border-white/20" />
      <div className="absolute bottom-4 left-4 w-3 h-3 border-b border-l border-white/20" />
      <div className="absolute bottom-4 right-4 w-3 h-3 border-b border-r border-white/20" />
      
      {/* Travelling Border Light */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[slideRight_4s_linear_infinite]" />

      {/* Indicator */}
      <div className="absolute top-6 flex items-center justify-center gap-2 z-20 hidden sm:flex">
        {MODES.map((m, i) => (
          <div key={m} className="flex flex-col items-center gap-1">
            <span className={cn(
              "text-[10px] font-mono tracking-widest transition-colors duration-500",
              activeIdx === i ? "text-white" : "text-white/40"
            )}>
              {m}
            </span>
            <div className={cn(
              "h-[2px] w-8 rounded-full transition-colors duration-500",
              activeIdx === i ? "bg-white/80" : "bg-white/10"
            )} />
          </div>
        ))}
      </div>

      <div className="relative w-full h-full min-h-[500px] flex flex-col sm:block justify-around sm:justify-start">
        
        {/* SVG Paths & Packets */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 hidden sm:block motion-reduce:hidden" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id={`grad-${lane1.id}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="100%" stopColor={color1} />
            </linearGradient>
            <linearGradient id={`grad-${lane2.id}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="100%" stopColor={color2} />
            </linearGradient>
          </defs>

          {/* Base Paths */}
          <path d={path1} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.2" strokeDasharray="0.5 1.5" vectorEffect="non-scaling-stroke" className={cn("transition-opacity duration-500", !isLane1Active && "opacity-35")} />
          <path d={path2} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.2" strokeDasharray="0.5 1.5" vectorEffect="non-scaling-stroke" className={cn("transition-opacity duration-500", !isLane2Active && "opacity-35")} />

          {/* Dash Packets */}
          <path d={path1} fill="none" stroke={`url(#grad-${lane1.id})`} strokeWidth="1.5" strokeDasharray="15 150" className={cn("dash-packet-1 transition-opacity duration-500", !isLane1Active && "opacity-35")} vectorEffect="non-scaling-stroke" />
          <path d={path2} fill="none" stroke={`url(#grad-${lane2.id})`} strokeWidth="1.5" strokeDasharray="15 150" className={cn("dash-packet-2 transition-opacity duration-500", !isLane2Active && "opacity-35")} vectorEffect="non-scaling-stroke" />

          {/* Flowing Items Lane 1 */}
          <g className={cn("transition-opacity duration-500", !isLane1Active && "opacity-35")}>
            {lane1.items.map((item, i) => (
              <g key={`l1-${i}`}>
                {item.type === 'channel' && (
                  <g>
                    <rect x="-3" y="-3.5" width="28" height="7" rx="3.5" fill="#0a0a0c" stroke={color1} strokeWidth="0.2" vectorEffect="non-scaling-stroke" />
                    <circle cx="0.5" cy="0" r="2.5" fill={color1} opacity="0.2" />
                    <circle cx="0.5" cy="0" r="2" fill="none" stroke={color1} strokeWidth="0.3" vectorEffect="non-scaling-stroke" />
                    <text x="4" y="1" fill="rgba(255,255,255,0.9)" fontSize="2.5" fontFamily="monospace">{item.label}</text>
                    <rect x="21" y="-2" width="5" height="4" rx="1" fill="rgba(255,255,255,0.1)" />
                    <text x="21.5" y="1" fill="rgba(255,255,255,0.5)" fontSize="1.8" fontFamily="monospace">{item.sub}</text>
                    {item.hasMail && (
                      <g className="mail-blip">
                        <rect x="6" y="-8" width="14" height="3" rx="0.5" fill={color1} />
                        <text x="6.5" y="-5.7" fill="#fff" fontSize="1.8" fontFamily="monospace" fontWeight="bold">EMAIL FOUND</text>
                      </g>
                    )}
                  </g>
                )}
                {item.type === 'square' && (
                  <g>
                    <rect x="-1" y="-1" width="2" height="2" fill="#18181b" stroke={color1} strokeWidth="0.3" vectorEffect="non-scaling-stroke" />
                  </g>
                )}
                <animateMotion dur={`${lane1.packetDur}s`} repeatCount="indefinite" path={path1} begin={`-${i * (lane1.packetDur / lane1.items.length)}s`} />
              </g>
            ))}
          </g>

          {/* Flowing Items Lane 2 */}
          <g className={cn("transition-opacity duration-500", !isLane2Active && "opacity-35")}>
            {lane2.items.map((item, i) => (
              <g key={`l2-${i}`}>
                {item.type === 'square' && (
                  <g>
                    <rect x="-4" y="-3.5" width="18" height="7" rx="1" fill="#0a0a0c" stroke={color2} strokeWidth="0.2" vectorEffect="non-scaling-stroke" />
                    <rect x="-2.5" y="-2" width="4" height="4" rx="0.5" fill={color2} opacity="0.15" />
                    <text x="3" y="1" fill="rgba(255,255,255,0.9)" fontSize="2.5" fontFamily="monospace">{item.label}</text>
                  </g>
                )}
                <animateMotion dur={`${lane2.packetDur}s`} repeatCount="indefinite" path={path2} begin={`-${i * (lane2.packetDur / lane2.items.length)}s`} />
              </g>
            ))}
          </g>
        </svg>

        {/* HTML OVERLAYS */}
        
        {/* Source Node (Top Left) */}
        <div className="relative sm:absolute sm:left-[15%] sm:top-[25%] sm:-translate-x-1/2 sm:-translate-y-1/2 flex flex-col items-center z-10 my-6 sm:my-0">
          <StartNode config={lane1} isActive={isLane1Active} />
          <div className={cn("mt-3 font-mono text-[10px] tracking-widest transition-opacity duration-500", !isLane1Active ? "opacity-35 text-white/40" : "text-white/80")} style={{ color: isLane1Active ? color1 : undefined }}>{lane1.label}</div>
        </div>

        {/* Role Node (Bottom Left) */}
        <div className="relative sm:absolute sm:left-[15%] sm:top-[75%] sm:-translate-x-1/2 sm:-translate-y-1/2 flex flex-col items-center z-10 my-6 sm:my-0">
          <StartNode config={lane2} isActive={isLane2Active} />
          <div className={cn("mt-3 font-mono text-[10px] tracking-widest transition-opacity duration-500", !isLane2Active ? "opacity-35 text-white/40" : "text-white/80")} style={{ color: isLane2Active ? color2 : undefined }}>{lane2.label}</div>
        </div>

        {/* Merge Node (Right) */}
        <div className="relative sm:absolute sm:left-[85%] sm:top-[50%] sm:-translate-x-1/2 sm:-translate-y-1/2 flex flex-col items-center z-20 my-6 sm:my-0 motion-reduce:animate-none">
          <div className="absolute inset-0 bg-white/5 blur-2xl rounded-full" />
          
          <div className="relative w-40 bg-[#121214] border border-white/20 rounded-xl p-4 shadow-2xl pulse-merge motion-reduce:animate-none">
            {/* Input ports */}
            <div className={cn("absolute -left-2 top-4 w-2 h-2 rounded-full border transition-colors duration-500 hidden sm:block", isLane1Active ? "bg-red-500 border-red-400" : "bg-white/10 border-white/20")} />
            <div className={cn("absolute -left-2 bottom-4 w-2 h-2 rounded-sm border transition-colors duration-500 hidden sm:block", isLane2Active ? "bg-slate-400 border-slate-300" : "bg-white/10 border-white/20")} />
            
            <div className="flex items-center gap-2 mb-4 border-b border-white/20 pb-2">
              <Layers className="w-5 h-5 text-white" />
              <span className="font-mono text-xs tracking-widest text-white">{mergeLabel}</span>
            </div>
            
            {/* Rows */}
            <div className="space-y-2">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="w-full h-2 bg-white/10 rounded-full overflow-hidden flex">
                  <div className="h-full bg-white/80 transition-all duration-1000 ease-out" style={{ width: '40%', backgroundColor: isLane1Active && !isLane2Active ? color1 : (!isLane1Active && isLane2Active ? color2 : 'rgba(255,255,255,0.8)') }} />
                  <div className="h-full bg-white/40 transition-all duration-1000 ease-out" style={{ width: '60%', backgroundColor: isLane2Active && !isLane1Active ? color2 : (!isLane2Active && isLane1Active ? color1 : 'rgba(255,255,255,0.4)') }} />
                </div>
              ))}
            </div>
            
            {/* Balance Bar */}
            <div className="mt-4 w-full h-1 flex rounded-full overflow-hidden bg-white/20">
               <div className="h-full transition-all duration-[4s] ease-in-out" style={{ width: isLane1Active && !isLane2Active ? '80%' : (!isLane1Active && isLane2Active ? '20%' : '50%'), backgroundColor: color1 }} />
               <div className="h-full transition-all duration-[4s] ease-in-out" style={{ width: isLane1Active && !isLane2Active ? '20%' : (!isLane1Active && isLane2Active ? '80%' : '50%'), backgroundColor: color2 }} />
            </div>
          </div>
        </div>

      </div>

      <style jsx>{`
        .is-paused *, .is-paused {
          animation-play-state: paused !important;
        }

        .dash-packet-1 {
          animation: dashMove1 ${lane1.packetDur}s linear infinite;
        }

        .dash-packet-2 {
          animation: dashMove2 ${lane2.packetDur}s linear infinite;
        }

        .pulse-merge {
          animation: mildPulse 1.5s ease-in-out infinite alternate;
        }

        .mail-blip {
          opacity: 0;
          animation: blipOn 5s linear infinite;
        }

        @keyframes dashMove1 {
          0% { stroke-dashoffset: 165; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 0; }
        }

        @keyframes dashMove2 {
          0% { stroke-dashoffset: 165; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 0; }
        }

        @keyframes mildPulse {
          0% { transform: scale(1); border-color: rgba(255,255,255,0.1); }
          100% { transform: scale(1.02); border-color: rgba(255,255,255,0.3); }
        }

        @keyframes blipOn {
          0%, 45% { opacity: 0; }
          50%, 80% { opacity: 1; }
          85%, 100% { opacity: 0; }
        }
        
        @keyframes slideRight {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};
