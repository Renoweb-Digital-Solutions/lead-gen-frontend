import React from 'react';

export const ComparisonTrack = ({ accent = "blue" }) => {
  return (
    <div className="w-full h-full min-h-[200px] flex items-center justify-center relative" aria-hidden="true">
      <svg className="w-full h-full max-w-[400px]" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        
        {/* Left Track */}
        <path d="M 50 50 L 150 50 C 180 50, 200 80, 200 100" stroke="currentColor" className="text-white/20" strokeWidth="2" fill="none" strokeDasharray="4 4" />
        <rect x="20" y="40" width="30" height="20" rx="4" fill="#050507" stroke="currentColor" className="text-white/40" />
        <text x="35" y="53" fill="currentColor" className="text-white/60" fontSize="8" fontFamily="monospace" textAnchor="middle">SRC</text>
        
        {/* Right Track */}
        <path d="M 350 50 L 250 50 C 220 50, 200 80, 200 100" stroke="currentColor" className="text-white/20" strokeWidth="2" fill="none" strokeDasharray="4 4" />
        <rect x="350" y="40" width="30" height="20" rx="4" fill="#050507" stroke="currentColor" className="text-white/40" />
        <text x="365" y="53" fill="currentColor" className="text-white/60" fontSize="8" fontFamily="monospace" textAnchor="middle">DB</text>

        {/* Convergence Node */}
        <circle cx="200" cy="120" r="20" fill="#050507" stroke="currentColor" className="text-white/30" strokeWidth="2" />
        <path d="M195 115l10 5-10 5v-10z" fill="currentColor" className="text-white/60" />

        {/* Output Track */}
        <path d="M 200 140 L 200 180" stroke="currentColor" className="text-white/30" strokeWidth="2" fill="none" />
        
        {/* Packets */}
        <circle cx="50" cy="50" r="3" fill="#3b82f6">
          <animateMotion path="M 50 50 L 150 50 C 180 50, 200 80, 200 100" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="350" cy="50" r="3" fill="#8b5cf6">
          <animateMotion path="M 350 50 L 250 50 C 220 50, 200 80, 200 100" dur="2s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
};
