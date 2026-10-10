import React from 'react';

export const YoutubeSignal = ({ accent = "red" }) => {
  return (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center relative" aria-hidden="true">
      <div className="absolute inset-0 flex flex-col items-center justify-start pt-10">
        <div className="bg-[#121214] border border-white/10 rounded px-3 py-1 flex items-center gap-2 shadow-2xl z-20">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="font-mono text-sm text-white/80">youtube_keyword: "saas sales"</span>
          <span className="w-1 h-3 bg-white/60 animate-[ping_1s_steps(2,start)_infinite]" />
        </div>
      </div>

      <svg className="w-full h-full max-w-[500px]" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="sweep-gradient" x1="250" y1="250" x2="250" y2="0">
            <stop offset="0%" stopColor="rgba(239, 68, 68, 0)" />
            <stop offset="100%" stopColor="rgba(239, 68, 68, 0.4)" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Concentric radar rings */}
        <circle cx="250" cy="250" r="80" stroke="currentColor" className="text-white/10" strokeWidth="1" />
        <circle cx="250" cy="250" r="160" stroke="currentColor" className="text-white/20" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx="250" cy="250" r="240" stroke="currentColor" className="text-white/10" strokeWidth="1" />

        {/* Play button center node */}
        <circle cx="250" cy="250" r="24" fill="#050507" stroke="currentColor" className="text-white/40" strokeWidth="2" />
        <path d="M245 240v20l15-10-15-10z" fill="currentColor" className="text-white/90" />

        {/* Expanding rings */}
        <circle cx="250" cy="250" r="80" stroke="currentColor" className="text-red-500/30" strokeWidth="1">
          <animate attributeName="r" values="24;240" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0" dur="3s" repeatCount="indefinite" />
        </circle>

        {/* Sweep rotation */}
        <g className="animate-[spin_4s_linear_infinite]" style={{ transformOrigin: '250px 250px' }}>
          <path d="M 250 250 L 250 10 A 240 240 0 0 1 350 30 Z" fill="url(#sweep-gradient)" />
          <line x1="250" y1="250" x2="250" y2="10" stroke="#ef4444" strokeWidth="2" filter="url(#glow)" />
        </g>

        {/* Channel chips */}
        <g transform="translate(120, 140)">
          <circle cx="0" cy="0" r="12" fill="#18181b" stroke="currentColor" className="text-white/40" />
          <rect x="20" y="-8" width="60" height="4" rx="2" fill="currentColor" className="text-white/40" />
          <rect x="20" y="4" width="40" height="4" rx="2" fill="currentColor" className="text-white/30" />
          <rect x="-30" y="-30" width="60" height="14" rx="2" fill="#ef4444" className="opacity-0 animate-[pulse_4s_linear_infinite]" />
          <text x="0" y="-20" fill="white" fontSize="10" fontFamily="monospace" textAnchor="middle" className="opacity-0 animate-[pulse_4s_linear_infinite]">FOUND</text>
        </g>
        
        <g transform="translate(380, 200)">
          <circle cx="0" cy="0" r="16" fill="#18181b" stroke="currentColor" className="text-white/40" />
          <rect x="-80" y="-8" width="50" height="4" rx="2" fill="currentColor" className="text-white/40" />
          <rect x="-70" y="4" width="40" height="4" rx="2" fill="currentColor" className="text-white/30" />
        </g>
      </svg>
    </div>
  );
};
