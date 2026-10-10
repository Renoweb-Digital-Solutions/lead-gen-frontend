import React from 'react';

export const InvestorOrbit = ({ accent = "green" }) => {
  return (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center relative" aria-hidden="true">
      <svg className="w-full h-full max-w-[500px]" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Rings */}
        <circle cx="250" cy="250" r="200" stroke="currentColor" className="text-white/10" strokeWidth="1" />
        <circle cx="250" cy="250" r="140" stroke="currentColor" className="text-white/20" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx="250" cy="250" r="80" stroke="currentColor" className="text-white/10" strokeWidth="1" />
        
        {/* Center startup node */}
        <rect x="220" y="220" width="60" height="60" rx="12" fill="#050507" stroke="currentColor" className="text-white/20" strokeWidth="1" />
        <circle cx="250" cy="250" r="16" fill="currentColor" className="text-green-500/20" />
        <circle cx="250" cy="250" r="6" fill="#22c55e" />

        {/* Connection lines from inputs */}
        <path d="M 50 250 L 220 250" stroke="currentColor" className="text-white/10" strokeDasharray="2 4" />
        <path d="M 250 50 L 250 220" stroke="currentColor" className="text-white/10" strokeDasharray="2 4" />

        {/* Input chips */}
        <g transform="translate(10, 240)">
          <rect width="80" height="20" rx="4" fill="#18181b" stroke="currentColor" className="text-white/20" />
          <text x="40" y="13" fill="currentColor" className="text-white/80" fontSize="10" fontFamily="monospace" textAnchor="middle">STAGE</text>
        </g>
        <g transform="translate(210, 10)">
          <rect width="80" height="20" rx="4" fill="#18181b" stroke="currentColor" className="text-white/20" />
          <text x="40" y="13" fill="currentColor" className="text-white/80" fontSize="10" fontFamily="monospace" textAnchor="middle">INDUSTRY</text>
        </g>

        {/* Traveling packets */}
        <circle cx="50" cy="250" r="3" fill="#22c55e">
          <animate attributeName="cx" values="50;220" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="250" cy="50" r="3" fill="#22c55e">
          <animate attributeName="cy" values="50;220" dur="2.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0;1;0" dur="2.5s" repeatCount="indefinite" />
        </circle>

        {/* Orbiting Investors */}
        <g className="animate-[spin_20s_linear_infinite]" style={{ transformOrigin: '250px 250px' }}>
          <g transform="translate(250, 110)">
            <circle cx="0" cy="0" r="8" fill="#050507" stroke="#22c55e" strokeWidth="2" />
            <text x="14" y="3" fill="currentColor" className="text-white/90" fontSize="12" fontFamily="sans-serif">a16z</text>
          </g>
        </g>
        
        <g className="animate-[spin_30s_linear_infinite_reverse]" style={{ transformOrigin: '250px 250px' }}>
          <g transform="translate(50, 250)">
             <circle cx="0" cy="0" r="6" fill="#050507" stroke="currentColor" className="text-white/40" strokeWidth="1" />
          </g>
          <g transform="translate(450, 250)">
             <circle cx="0" cy="0" r="6" fill="#050507" stroke="currentColor" className="text-white/40" strokeWidth="1" />
          </g>
        </g>
      </svg>
    </div>
  );
};
