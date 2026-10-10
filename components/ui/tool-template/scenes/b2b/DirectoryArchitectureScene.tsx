"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Users, Building2, Briefcase, Gauge, Download, Database, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SectionHeading, MonoLabel } from '../../primitives';

const PIPELINE_NODES = [
  { id: 'people', label: 'People', icon: Users },
  { id: 'company', label: 'Company', icon: Building2 },
  { id: 'jobs', label: 'Jobs', icon: Briefcase },
  { id: 'scoring', label: 'Scoring', icon: Gauge },
  { id: 'export', label: 'Export', icon: Download },
];

const B2B_NODE = { id: 'b2b', label: 'B2B Directory', icon: Database };

const StatusBadge = ({ type }: { type: 'correct' | 'wrong' | 'neutral' }) => {
  if (type === 'correct') return <div className="flex items-center gap-1 bg-green-500/10 border border-green-500/30 text-green-400 px-1.5 py-0.5 rounded text-[8px] font-mono"><Check className="w-2.5 h-2.5" /> CORRECT</div>;
  if (type === 'wrong') return <div className="flex items-center gap-1 bg-rose-500/10 border border-rose-500/30 text-rose-400 px-1.5 py-0.5 rounded text-[8px] font-mono"><X className="w-2.5 h-2.5" /> INCORRECT</div>;
  return <div className="flex items-center gap-1 bg-white/5 border border-white/10 text-white/40 px-1.5 py-0.5 rounded text-[8px] font-mono">OUTSIDE CORE</div>;
};

const PipelineTrack = ({ state, className }: { state: 'core' | 'wrong' | 'entry', className?: string }) => {
  const nodes = state === 'wrong' ? [...PIPELINE_NODES, B2B_NODE] : PIPELINE_NODES;
  const isWrong = state === 'wrong';
  const isEntry = state === 'entry';

  return (
    <div className={cn("relative flex items-center w-full max-w-2xl mx-auto py-8", className)}>
      {/* Background Line */}
      <div className={cn("absolute left-4 right-4 h-px top-1/2 -translate-y-1/2 z-0", isWrong ? "bg-white/10" : "bg-white/20")} />
      
      {/* Nodes */}
      <div className="relative z-10 flex justify-between w-full">
        {nodes.map((node, i) => {
          const isExtraNode = isWrong && i === nodes.length - 1;
          const Icon = node.icon;
          
          return (
            <div key={node.id} className="flex flex-col items-center gap-2">
              <div className={cn(
                "w-8 h-8 md:w-10 md:h-10 rounded border flex items-center justify-center bg-[#0a0a0c]",
                isExtraNode ? "border-rose-500/50 border-dashed text-rose-400 opacity-60 bg-rose-500/5" :
                (isEntry && i === 0) ? "border-yellow-500/50 text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.2)]" :
                "border-white/20 text-white/60"
              )}>
                {isExtraNode && <div className="absolute inset-0 opacity-10 bg-[repeating-linear-gradient(45deg,transparent,transparent_2px,#fff_2px,#fff_4px)]" />}
                <Icon className="w-4 h-4" />
                {isExtraNode && <div className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-0.5"><X className="w-2.5 h-2.5" /></div>}
              </div>
              <span className={cn(
                "font-mono text-[8px] md:text-[10px]",
                isExtraNode ? "text-rose-400/60" : "text-white/40"
              )}>
                {node.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const EntryLane = () => {
  return (
    <div className="relative w-full max-w-2xl mx-auto h-32 flex flex-col items-center justify-end pb-8 mt-4">
      {/* Curved feeding line */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" preserveAspectRatio="none">
        <defs>
          <linearGradient id="yellow-flow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(234, 179, 8, 0)" />
            <stop offset="50%" stopColor="rgba(234, 179, 8, 0.5)" />
            <stop offset="100%" stopColor="rgba(234, 179, 8, 0)" />
          </linearGradient>
        </defs>
        <path 
          id="feed-path"
          d="M 50% 20% C 50% 80%, 10% 80%, 10% 100%" 
          fill="none" 
          stroke="url(#yellow-flow)" 
          strokeWidth="2"
        />
        <path 
          d="M 50% 20% C 50% 80%, 10% 80%, 10% 100%" 
          fill="none" 
          stroke="rgba(234, 179, 8, 0.4)" 
          strokeWidth="2"
          className="animate-[dashMove_2s_linear_infinite]"
          strokeDasharray="4 8"
        />
        {/* Flowing Packets */}
        {[0, 1, 2].map((i) => (
          <g key={i} className="opacity-80">
            <rect x="-15" y="-6" width="30" height="12" rx="2" fill="#0a0a0c" stroke="rgba(234,179,8,0.5)" strokeWidth="1" />
            <line x1="-10" y1="-2" x2="10" y2="-2" stroke="rgba(234,179,8,0.3)" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="-10" y1="2" x2="5" y2="2" stroke="rgba(234,179,8,0.3)" strokeWidth="1.5" strokeLinecap="round" />
            <animateMotion dur="4s" repeatCount="indefinite" begin={`-${i * 1.33}s`}>
              <mpath href="#feed-path" />
            </animateMotion>
          </g>
        ))}
      </svg>
      
      {/* Directory Node */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <div className="w-12 h-12 rounded border border-yellow-500 bg-yellow-500/10 flex items-center justify-center text-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.3)]">
          <Database className="w-6 h-6" />
        </div>
        <span className="font-mono text-[10px] text-yellow-400 tracking-widest bg-[#0a0a0c] px-1">DIRECTORIES</span>
      </div>
    </div>
  );
};

export const DirectoryArchitectureScene = ({ block, accent }: { block: any, accent: string }) => {
  const [isLive, setIsLive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsLive(entry.isIntersecting && !document.hidden);
    }, { threshold: 0.1 });
    
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const p = block.paragraphs || [];

  return (
    <div ref={containerRef} className="w-full">
      <SectionHeading className="mb-4">{block.title}</SectionHeading>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative w-full bg-[rgba(5,5,7,0.7)] border border-yellow-500/20 rounded-xl overflow-hidden mt-8 architecture-panel"
      >
        {/* Travelling border light */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-50 -translate-x-full animate-[slideRight_3s_linear_infinite]" />
        
        {/* Grid layout ensuring DOM order matches visual order as strictly as possible */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/5">
          
          {/* BAND A */}
          <div className="col-span-1 lg:col-span-2 bg-[#0a0a0c] p-6 md:p-8 flex items-start justify-between gap-4">
            <p className="text-xl md:text-2xl text-white font-medium max-w-3xl leading-relaxed" dangerouslySetInnerHTML={{ __html: p[0] }} />
            <StatusBadge type="neutral" />
          </div>

          {/* BAND B */}
          <div className="col-span-1 lg:col-span-2 bg-[#0a0a0c] p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <p className="text-white/60" dangerouslySetInnerHTML={{ __html: p[1] }} />
              <p className="font-mono text-xs text-white/40 bg-white/5 px-3 py-1.5 rounded border border-white/10" dangerouslySetInnerHTML={{ __html: p[2] }} />
            </div>
            <div className="relative">
              <PipelineTrack state="core" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4">
                <StatusBadge type="correct" />
              </div>
            </div>
          </div>

          {/* BAND C CAPTION */}
          <div className="col-span-1 lg:col-span-2 bg-[#0a0a0c] p-6 md:p-8 border-t border-white/5">
            <p className="text-lg text-white/80" dangerouslySetInnerHTML={{ __html: p[3] }} />
          </div>

          {/* BAND C LEFT (WRONG) */}
          <div className="col-span-1 bg-[#0a0a0c] p-6 md:p-8 border-t lg:border-t-0 lg:border-r border-white/5 flex flex-col">
            <div className="mb-6 flex flex-col gap-3">
              <p className="text-rose-400/80" dangerouslySetInnerHTML={{ __html: p[4] }} />
              <p className="font-mono text-[10px] text-rose-400/40 bg-rose-500/5 px-2 py-1.5 rounded border border-rose-500/10 leading-relaxed" dangerouslySetInnerHTML={{ __html: p[5] }} />
            </div>
            <div className="mt-auto opacity-60">
              <PipelineTrack state="wrong" />
              <div className="flex justify-center mt-4">
                <StatusBadge type="wrong" />
              </div>
            </div>
          </div>

          {/* BAND C RIGHT (CORRECT) */}
          <div className="col-span-1 bg-[#0a0a0c] p-6 md:p-8 border-t lg:border-t-0 border-white/5 flex flex-col relative overflow-hidden">
            <div className="absolute inset-0 bg-yellow-500/5 z-0 pointer-events-none" />
            <div className="mb-6 flex flex-col gap-3 relative z-10">
              <p className="text-yellow-400/90 font-medium" dangerouslySetInnerHTML={{ __html: p[6] }} />
            </div>
            <div className="mt-auto relative z-10">
              <EntryLane />
              <PipelineTrack state="entry" />
            </div>
          </div>

        </div>
      </motion.div>

      <style jsx>{`
        @keyframes slideRight {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes dashMove {
          0% { stroke-dashoffset: 24; }
          100% { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
};
