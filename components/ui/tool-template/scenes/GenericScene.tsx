import React from 'react';

export const GenericScene = ({ accent = "blue" }) => {
  return (
    <div className="w-full h-full min-h-[300px] flex items-center justify-center relative" aria-hidden="true">
      <svg className="w-full h-full max-w-[400px]" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="200" cy="200" r="100" stroke="currentColor" className="text-white/10" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx="200" cy="200" r="150" stroke="currentColor" className="text-white/5" strokeWidth="1" />
        
        {/* Orbiting nodes */}
        <g className="animate-[spin_20s_linear_infinite]" style={{ transformOrigin: '200px 200px' }}>
          <circle cx="200" cy="100" r="6" fill="currentColor" className="text-white/40" />
          <circle cx="200" cy="50" r="4" fill="currentColor" className="text-white/20" />
        </g>
        <g className="animate-[spin_15s_linear_infinite_reverse]" style={{ transformOrigin: '200px 200px' }}>
          <circle cx="100" cy="200" r="8" fill="currentColor" className="text-white/30" />
        </g>
        
        <circle cx="200" cy="200" r="20" fill="currentColor" className="text-white/10" />
        <circle cx="200" cy="200" r="10" fill="currentColor" className="text-white/50" />
      </svg>
    </div>
  );
};
