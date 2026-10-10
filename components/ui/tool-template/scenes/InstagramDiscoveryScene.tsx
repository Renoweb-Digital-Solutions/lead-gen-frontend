"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Heart, MessageCircle, UserPlus, Users, Mail, Phone, AtSign, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const DATA = {
  source: "@lumina_skincare",
  followers: "42.5K",
  following: "128",
  commenters: "854",
  hashtags: ["#skincare", "#vegan", "#wellness", "#cleanbeauty", "#glow"],
  avatars: [
    { initial: 'A', id: 1, contact: 'mail', handle: 'alex_glow', score: 92 },
    { initial: 'M', id: 2, contact: 'phone', handle: 'm_beauty', score: 88 },
    { initial: 'S', id: 3, contact: 'mail', handle: 'sarah.vgn', score: 95 },
    { initial: 'K', id: 4, contact: 'phone', handle: 'kris_skin', score: 81 },
    { initial: 'R', id: 5, contact: 'mail', handle: 'rachel.o', score: 79 }
  ]
};

const MODES = [
  { id: 'followers', label: 'FOLLOWERS', icon: UserPlus, count: DATA.followers },
  { id: 'following', label: 'FOLLOWING', icon: Users, count: DATA.following },
  { id: 'commenters', label: 'COMMENTERS', icon: MessageCircle, count: DATA.commenters }
];

export const InstagramDiscoveryScene = ({ accent = 'pink' }) => {
  const [modeIdx, setModeIdx] = useState(0);
  const [isLive, setIsLive] = useState(false);
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
      setModeIdx((prev) => (prev + 1) % MODES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isLive]);

  const activeMode = MODES[modeIdx];
  const ModeIcon = activeMode.icon;

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative w-full h-full min-h-[450px] flex flex-col items-center justify-center p-4 overflow-hidden rounded-xl bg-[rgba(5,5,7,0.7)] border border-white/5",
        !isLive && "is-paused"
      )}
      aria-hidden="true"
    >
      <div className="absolute top-4 left-4 font-mono text-xs tracking-widest text-white/60 uppercase">
        SYS.SOURCE / INSTAGRAM
      </div>
      <div className="absolute top-4 right-4 flex gap-1 z-20">
        {MODES.map((_, i) => (
          <div key={i} className={cn("w-6 h-1 rounded-full transition-colors duration-500", i === modeIdx ? "bg-pink-400" : "bg-white/20")} />
        ))}
      </div>
      
      {/* Reduced Motion Static Overlay */}
      <div className="hidden motion-reduce:flex absolute inset-0 z-50 bg-[#050507] items-center justify-center">
        <div className="w-[80px] h-[80px] rounded-full border-2 border-pink-500/50 flex items-center justify-center bg-pink-500/10">
          <Camera className="w-8 h-8 text-pink-400" />
        </div>
      </div>

      {/* Main Stage */}
      <div className="relative w-full max-w-lg aspect-square sm:aspect-auto sm:h-[300px] flex items-center justify-between z-10 motion-reduce:hidden">
        
        {/* LEFT: SOURCE ACCOUNT */}
        <div className="relative flex flex-col items-center w-1/3 z-20">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-4">
            {/* Story Gradient Ring */}
            <svg className="absolute inset-0 w-full h-full animate-[spin_8s_linear_infinite]" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#facc15" />
                  <stop offset="50%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="48" fill="none" stroke="url(#ig-grad)" strokeWidth="2" strokeDasharray="300" strokeDashoffset="0" />
            </svg>
            {/* Pulse */}
            <div className="absolute inset-0 rounded-full border border-pink-500/50 animate-[ping_2.4s_ease-out_infinite] opacity-0" />
            {/* Avatar Base */}
            <div className="absolute inset-1 rounded-full bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden">
              <Camera className="w-8 h-8 text-white/40" />
              {activeMode.id === 'commenters' && (
                 <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm animate-in fade-in duration-300">
                   <MessageCircle className="w-6 h-6 text-pink-400 animate-pulse" />
                 </div>
              )}
            </div>
          </div>
          
          <div className="font-mono text-sm text-white mb-3">{DATA.source}</div>
          
          {/* Stat Chips */}
          <div className="flex gap-2 bg-[#121214] p-1 rounded border border-white/20">
            {MODES.map((m, i) => (
              <div key={m.id} className={cn(
                "flex flex-col items-center justify-center w-12 h-10 rounded transition-colors duration-300",
                i === modeIdx ? "bg-white/20 text-pink-400" : "text-white/50"
              )}>
                <span className="text-[10px] font-mono leading-none mb-1 opacity-80">{m.label.substring(0,3)}</span>
                <span className="text-xs font-mono leading-none">{m.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CENTER: HARVEST STREAM */}
        <div className="relative w-1/3 h-full flex items-center justify-center">
          <div className="absolute w-full h-[60px] top-1/2 -translate-y-1/2 flex items-center">
            {/* Dashed Path */}
            <div className="absolute w-full h-px border-t border-dashed border-white/30 top-1/2" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-[#0a0a0c] border border-white/20 rounded-full flex items-center justify-center z-10">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={activeMode.id}
                  initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
                  transition={{ duration: 0.3 }}
                >
                  <ModeIcon className="w-3 h-3 text-white/80" />
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Drifting Avatars */}
            {[...Array(6)].map((_, i) => (
              <div 
                key={i} 
                className="absolute left-0 w-4 h-4 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-white/20 z-0 stream-avatar"
                style={{ animationDelay: `-${i * 1.5}s` }}
              />
            ))}
          </div>
        </div>

        {/* RIGHT: ENRICH & LEADS */}
        <div className="relative flex flex-col items-end w-1/3 z-20 h-full justify-center">
          
          <div className="relative w-full max-w-[160px] bg-[#0a0a0c] border border-white/10 rounded-md p-3 overflow-hidden shadow-2xl">
            {/* Scanning Lens */}
            <div className="absolute left-0 right-0 h-12 bg-gradient-to-b from-transparent via-pink-500/20 to-pink-500/5 border-b border-pink-500/50 z-10 scan-bar" />
            
            <div className="font-mono text-[10px] text-white/70 mb-3 border-b border-white/20 pb-1 flex justify-between">
              <span>ENRICHED LEADS</span>
              <span className="text-pink-400">5/5</span>
            </div>
            
            <div className="space-y-2 relative z-0">
              {DATA.avatars.map((avatar, i) => (
                <div key={avatar.id} className="flex items-center gap-2 group lead-row" style={{ animationDelay: `${i * 0.8}s` }}>
                  <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[9px] font-mono text-white/80">
                    {avatar.initial}
                  </div>
                  <div className="flex-1">
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-0.5">
                      <div className="h-full bg-pink-500/50 rounded-full w-0 fill-bar" style={{ animationDelay: `${i * 0.8 + 0.4}s`, '--target-width': `${avatar.score}%` } as React.CSSProperties} />
                    </div>
                    <div className="text-[10px] font-mono text-white/60">{avatar.handle}</div>
                  </div>
                  <div className="w-3 h-3 badge-pop" style={{ animationDelay: `${i * 0.8 + 0.6}s` }}>
                    {avatar.contact === 'mail' ? <Mail className="w-3 h-3 text-pink-400" /> : <Phone className="w-3 h-3 text-pink-400" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM: HASHTAG FINGERPRINT */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 overflow-hidden px-8 pointer-events-none opacity-80 hidden sm:flex">
        {DATA.hashtags.map((tag, i) => (
          <div 
            key={i} 
            className="px-2 py-1 rounded-full border border-white/20 bg-white/10 text-[11px] font-mono text-white/70 whitespace-nowrap hashtag-drift"
            style={{ animationDelay: `-${i * 2}s` }}
          >
            {tag}
          </div>
        ))}
      </div>

      <style jsx>{`
        .is-paused *, .is-paused {
          animation-play-state: paused !important;
        }
        
        .stream-avatar {
          animation: driftRight 9s linear infinite;
          opacity: 0;
        }

        .scan-bar {
          animation: scanUpAndDown 4s ease-in-out infinite;
        }

        .lead-row {
          opacity: 0.2;
          animation: fadeRowIn 4s ease-in-out infinite alternate;
        }

        .fill-bar {
          animation: fillWidth 4s ease-in-out infinite alternate;
        }

        .badge-pop {
          transform: scale(0);
          animation: popSpring 4s ease-in-out infinite alternate;
        }

        .hashtag-drift {
          animation: slightDrift 10s ease-in-out infinite alternate;
        }

        @keyframes driftRight {
          0% { transform: translate(0, 0) scale(0.8); opacity: 0; }
          10% { opacity: 1; }
          50% { transform: translate(120px, -15px) scale(1); opacity: 0.8; }
          90% { opacity: 1; }
          100% { transform: translate(250px, 0) scale(0.5); opacity: 0; }
        }

        @keyframes scanUpAndDown {
          0% { top: -20%; }
          50% { top: 120%; }
          100% { top: -20%; }
        }

        @keyframes fadeRowIn {
          0%, 40% { opacity: 0.2; }
          60%, 100% { opacity: 1; }
        }

        @keyframes fillWidth {
          0%, 40% { width: 0; }
          60%, 100% { width: var(--target-width); }
        }

        @keyframes popSpring {
          0%, 50% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes slightDrift {
          0% { transform: translateX(-10px); }
          100% { transform: translateX(10px); }
        }
      `}</style>
    </div>
  );
};
