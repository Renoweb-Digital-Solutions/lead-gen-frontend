import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export const GridBackground = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden mix-blend-overlay opacity-20">
    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-30" />
    <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid-pattern" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white" />
        </pattern>
        <pattern id="dot-pattern" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="currentColor" className="text-white opacity-50" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-pattern)" />
      <rect width="100%" height="100%" fill="url(#dot-pattern)" opacity="0.3" />
    </svg>
    <div className="absolute inset-0 bg-gradient-to-b from-[#050507] via-transparent to-[#050507]" />
    <div className="absolute inset-0 bg-gradient-to-r from-[#050507] via-transparent to-[#050507]" />
  </div>
);

export const CornerMarks = () => (
  <>
    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/30 -translate-x-px -translate-y-px transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1" />
    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/30 translate-x-px -translate-y-px transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/30 -translate-x-px translate-y-px transition-transform group-hover:-translate-x-1 group-hover:translate-y-1" />
    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/30 translate-x-px translate-y-px transition-transform group-hover:translate-x-1 group-hover:translate-y-1" />
  </>
);

export const MonoLabel = ({ children, className }) => (
  <div className={cn("font-mono text-[10px] tracking-widest uppercase text-white/40", className)}>
    {children}
  </div>
);

export const SectionHeading = ({ children, className }) => {
  if (typeof children !== 'string') return <h2 className={cn("text-2xl font-semibold text-white", className)}>{children}</h2>;
  
  const words = children.split(' ');
  const splitIndex = Math.ceil(words.length / 2);
  const firstPart = words.slice(0, splitIndex).join(' ');
  const secondPart = words.slice(splitIndex).join(' ');
  
  return (
    <h2 className={cn("text-3xl md:text-4xl font-semibold tracking-tight", className)}>
      <span className="text-white">{firstPart}</span>{' '}
      <span className="text-white/40">{secondPart}</span>
    </h2>
  );
};

const COLOR_MAP = {
  red: '#ef4444',
  pink: '#ec4899',
  yellow: '#eab308',
  orange: '#f97316',
  green: '#22c55e',
  blue: '#3b82f6',
  default: '#ffffff'
};

export const AnimatedBorder = ({ children, accent = 'default', className, containerClassName }) => {
  const color = COLOR_MAP[accent] || COLOR_MAP.default;
  
  return (
    <div className={cn("relative group rounded-xl overflow-hidden p-[1px]", containerClassName)}>
      <div className="absolute inset-0 z-0 bg-white/5 rounded-xl overflow-hidden pointer-events-none">
        <div 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] animate-[spin_4s_linear_infinite]"
          style={{
            background: `conic-gradient(from 0deg, transparent 0%, transparent 40%, ${color} 50%, transparent 60%, transparent 100%)`
          }}
        />
        <div 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] animate-[spin_4s_linear_infinite] blur-[16px] opacity-80"
          style={{
            background: `conic-gradient(from 0deg, transparent 0%, transparent 40%, ${color} 50%, transparent 60%, transparent 100%)`
          }}
        />
      </div>
      <div className={cn("relative z-10 w-full h-full bg-[#050507]/90 backdrop-blur-xl rounded-[calc(0.75rem-1px)]", className)}>
        {children}
      </div>
    </div>
  );
};

