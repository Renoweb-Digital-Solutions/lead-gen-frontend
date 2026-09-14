import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function BetaBanner() {
  return (
    <div className="bg-[#308FEF] text-white px-4 py-2 text-sm font-medium flex items-center justify-center gap-2 shadow-sm border-b border-blue-400 relative z-50">
      <AlertCircle size={16} className="text-white shrink-0" />
      <span className="text-center">
        <strong className="font-bold text-white tracking-wide">BETA</strong> &middot; SimpleAds is currently in beta. Some features are experimental and AI-generated content may occasionally make mistakes.
      </span>
    </div>
  );
}
