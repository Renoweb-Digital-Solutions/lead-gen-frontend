"use client";

import React, { useEffect, useState, useRef } from 'react';

export const TONE_MAP = {
  youtube: { core: '#ef4444', mid: 'rgba(239, 68, 68, 0.35)', edge: 'rgba(153, 27, 27, 0.05)' },
  red: { core: '#ef4444', mid: 'rgba(239, 68, 68, 0.35)', edge: 'rgba(153, 27, 27, 0.05)' },
  
  instagram: { core: '#ec4899', mid: 'rgba(236, 72, 153, 0.35)', edge: 'rgba(157, 23, 77, 0.05)' },
  pink: { core: '#ec4899', mid: 'rgba(236, 72, 153, 0.35)', edge: 'rgba(157, 23, 77, 0.05)' },
  
  b2b: { core: '#eab308', mid: 'rgba(234, 179, 8, 0.35)', edge: 'rgba(161, 98, 7, 0.05)' },
  yellow: { core: '#eab308', mid: 'rgba(234, 179, 8, 0.35)', edge: 'rgba(161, 98, 7, 0.05)' },
  
  investor: { core: '#f97316', mid: 'rgba(249, 115, 22, 0.35)', edge: 'rgba(154, 52, 18, 0.05)' },
  orange: { core: '#f97316', mid: 'rgba(249, 115, 22, 0.35)', edge: 'rgba(154, 52, 18, 0.05)' },
  green: { core: '#f97316', mid: 'rgba(249, 115, 22, 0.35)', edge: 'rgba(154, 52, 18, 0.05)' }, // fallback for investor

  default: { core: '#ffffff', mid: 'rgba(255, 255, 255, 0.25)', edge: 'rgba(148, 163, 184, 0.05)' },
};

export const StaticGlow = ({ tone = 'default' }) => {
  const colors = TONE_MAP[tone] || TONE_MAP.default;
  return (
    <div 
      className="absolute inset-0 pointer-events-none overflow-hidden z-0" 
      aria-hidden="true"
      style={{
        '--glow-core': colors.core,
        '--glow-mid': colors.mid,
        '--glow-edge': colors.edge,
      } as React.CSSProperties}
    >
      <div 
        className="absolute left-1/2 top-0 -translate-x-1/2 w-[80vw] max-w-[1000px] aspect-[2/1]"
        style={{
          background: 'radial-gradient(ellipse at top, var(--glow-mid) 0%, var(--glow-edge) 50%, transparent 80%)',
          opacity: 0.5,
        }}
      />
    </div>
  );
};

export default function AmbientGlow({ tone = 'default' }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const colors = TONE_MAP[tone] || TONE_MAP.default;

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        setIsPaused(true);
      } else {
        // Re-check intersection before unpausing
        checkIntersection();
      }
    };

    const checkIntersection = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      setIsPaused(!isVisible);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!document.hidden) {
            setIsPaused(!entry.isIntersecting);
          }
        });
      },
      { threshold: 0, rootMargin: '100px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    document.addEventListener('visibilitychange', handleVisibility);
    
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden z-0 ambient-glow-container ${isPaused ? 'is-paused' : ''}`}
      aria-hidden="true"
      style={{
        '--glow-core': colors.core,
        '--glow-mid': colors.mid,
        '--glow-edge': colors.edge,
      } as React.CSSProperties}
    >
      {/* Noise Overlay */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay z-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

      {/* Vignette to fade out at bottom/edges */}
      <div className="absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_40%,#050507_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#050507] to-transparent z-10" />

      {/* Main Glow Container with Blur */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-full max-w-[1200px] h-[800px] blur-[48px] md:blur-[80px]">
        
        {/* Core Filament */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[40%] h-[30%] bg-[var(--glow-core)] rounded-[100%] opacity-60 mix-blend-screen animate-pulse-fast origin-top" />
        
        {/* Outer Bulb */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[80%] h-[60%] bg-[var(--glow-mid)] rounded-[100%] opacity-40 mix-blend-screen animate-pulse-slow origin-top" />

        {/* Wobbly Blobs */}
        <div className="absolute left-[20%] top-[10%] w-[40%] h-[40%] bg-[var(--glow-mid)] rounded-[40%_60%_70%_30%] opacity-20 animate-wobble-1 mix-blend-screen hidden sm:block" />
        <div className="absolute right-[20%] top-[5%] w-[45%] h-[35%] bg-[var(--glow-mid)] rounded-[60%_40%_30%_70%] opacity-15 animate-wobble-2 mix-blend-screen" />
        <div className="absolute left-[35%] top-[25%] w-[35%] h-[45%] bg-[var(--glow-edge)] rounded-[50%] opacity-30 animate-wobble-3 mix-blend-screen" />

      </div>

      {/* Sticky Secondary Dimmer Instance */}
      <div className="sticky top-[30vh] w-full h-[50vh] opacity-20 pointer-events-none -z-10 blur-[60px]">
         <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[50%] h-[50%] bg-[var(--glow-edge)] rounded-full mix-blend-screen animate-pulse-slow" />
      </div>

      <style jsx>{`
        .ambient-glow-container {
          will-change: transform, opacity;
        }

        .is-paused *,
        @media (prefers-reduced-motion: reduce) {
          .ambient-glow-container * {
            animation-play-state: paused !important;
            animation: none !important;
          }
        }

        @keyframes pulse-fast {
          0% { transform: scale(1) translateX(-50%); opacity: 0.55; }
          100% { transform: scale(1.15) translateX(-45%); opacity: 0.9; }
        }

        @keyframes pulse-slow {
          0% { transform: scale(1) translateX(-50%); opacity: 0.3; }
          100% { transform: scale(1.08) translateX(-48%); opacity: 0.5; }
        }

        @keyframes wobble-1 {
          0% { transform: translate(0, 0) rotate(0deg) scale(1); }
          33% { transform: translate(30px, -20px) rotate(5deg) scale(1.05); }
          66% { transform: translate(-20px, 20px) rotate(-5deg) scale(0.95); }
          100% { transform: translate(0, 0) rotate(0deg) scale(1); }
        }

        @keyframes wobble-2 {
          0% { transform: translate(0, 0) rotate(0deg) scale(1); }
          33% { transform: translate(-30px, 15px) rotate(-10deg) scale(0.95); }
          66% { transform: translate(25px, -15px) rotate(5deg) scale(1.08); }
          100% { transform: translate(0, 0) rotate(0deg) scale(1); }
        }

        @keyframes wobble-3 {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(0, 40px) scale(1.1); }
          100% { transform: translate(0, 0) scale(1); }
        }

        .animate-pulse-fast {
          animation: pulse-fast 3.8s ease-in-out infinite alternate;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 5.5s ease-in-out infinite alternate;
        }

        .animate-wobble-1 {
          animation: wobble-1 18s ease-in-out infinite;
        }
        
        .animate-wobble-2 {
          animation: wobble-2 24s ease-in-out infinite reverse;
          animation-delay: -5s;
        }

        .animate-wobble-3 {
          animation: wobble-3 15s ease-in-out infinite alternate;
          animation-delay: -2s;
        }
      `}</style>
    </div>
  );
}
