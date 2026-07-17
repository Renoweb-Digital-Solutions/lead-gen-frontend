"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Loader2 } from "lucide-react";

export default function SignalScannerPanel({ status, channelCount }) {
  const [displayedAvatars, setDisplayedAvatars] = useState([]);

  // Generate 24 bars for the waveform
  const bars = Array.from({ length: 24 });

  // Handle fake "results arriving" pop-in
  useEffect(() => {
    if (status === "complete" && channelCount > 0) {
      setDisplayedAvatars([]);
      let count = 0;
      const maxToDisplay = Math.min(channelCount, 12); // Show up to 12 placeholders
      const interval = setInterval(() => {
        if (count < maxToDisplay) {
          const uniqueKey = `avatar-${Date.now()}-${count}`;
          setDisplayedAvatars((prev) => [...prev, uniqueKey]);
          count++;
        } else {
          clearInterval(interval);
        }
      }, 300); // Staggered 300ms apart

      return () => clearInterval(interval);
    } else if (status === "idle" || status === "scanning") {
      setDisplayedAvatars([]);
    }
  }, [status, channelCount]);

  return (
    <div className="w-full h-full min-h-[500px] bg-white rounded-2xl relative overflow-hidden shadow-[0_4px_15px_rgba(220,38,38,0.12)] border border-red-600/10 flex flex-col p-6">
      {/* ── Overlay UI / Status Panel ── */}
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <h3 className="text-brand-dark font-display font-semibold tracking-wide text-lg flex items-center gap-2 drop-shadow-sm">
          <Activity className="w-5 h-5 text-red-500" />
          Signal Scanner
        </h3>

        <AnimatePresence mode="wait">
          {status === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="mt-3 flex items-center gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-red-500/50 animate-[rw-pulse_2s_infinite]" />
              <p className="text-red-500/70 text-xs uppercase tracking-wider font-semibold m-0">
                MONITORING CHANNELS...
              </p>
            </motion.div>
          )}

          {status === "scanning" && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-3 bg-white/90 backdrop-blur-md border border-red-600/20 rounded-xl p-4 inline-block shadow-[0_4px_20px_rgba(220,38,38,0.15)] pointer-events-auto"
            >
              <div className="text-red-500 text-[10px] uppercase tracking-[0.2em] font-bold mb-1.5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                SCANNING FOR CHANNELS...
              </div>
              <div className="text-brand-dark text-3xl font-bold font-display tabular-nums leading-none flex items-baseline gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-red-600" />
                <span className="text-sm text-gray-500 font-sans font-medium tracking-normal">Searching network</span>
              </div>
            </motion.div>
          )}

          {status === "complete" && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-3 bg-emerald-50/90 backdrop-blur-md border border-emerald-200 rounded-xl p-4 inline-flex items-center gap-4 shadow-[0_4px_20px_rgba(16,185,129,0.15)] pointer-events-auto"
            >
              <div className="w-10 h-10 rounded-full bg-[#10b981]/20 flex items-center justify-center shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-[#10b981]">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <div>
                <div className="text-[#10b981] text-[10px] uppercase tracking-[0.2em] font-bold mb-1">
                  Scan Complete
                </div>
                <div className="text-emerald-900 text-2xl font-bold font-display tabular-nums leading-none">
                  {channelCount} <span className="text-sm font-sans font-medium text-emerald-700 tracking-normal">channels found</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Visual Area ── */}
      <div className="flex-1 flex flex-col items-center justify-center relative mt-20">
        
        {/* Sweeping Scanner Line (Visible only while scanning) */}
        <AnimatePresence>
          {status === "scanning" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none overflow-hidden z-20"
            >
              <motion.div
                animate={{ x: ["-10%", "110%"] }}
                transition={{ duration: 1.5, ease: "linear", repeat: Infinity }}
                className="h-full w-1.5 bg-red-500/80 blur-[1px] absolute top-0 bottom-0 shadow-[0_0_15px_rgba(239,68,68,0.8)]"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Audio Waveform / Equalizer */}
        <div className="flex items-end gap-1.5 h-32 w-full max-w-sm relative z-10 px-4">
          {bars.map((_, i) => {
            // Map index to a sine wave phase
            const phase = (i / bars.length) * Math.PI * 2;
            
            // Idle animation values
            const idleHeight = ["20%", `${25 + Math.sin(phase) * 10}%`, "20%"];
            
            // Scanning animation values (higher amplitude, faster)
            const scanHeight = [
              "30%", 
              `${60 + Math.sin(phase * 3) * 40}%`, 
              `${40 + Math.cos(phase * 2) * 30}%`, 
              "30%"
            ];
            
            const isScanning = status === "scanning";
            const currentHeight = isScanning ? scanHeight : idleHeight;
            const currentDuration = isScanning ? 0.6 + (Math.random() * 0.4) : 2 + (Math.random() * 1);
            
            return (
              <motion.div
                key={i}
                className="flex-1 rounded-t-sm bg-gradient-to-t from-red-600 to-red-400 opacity-80"
                animate={{ height: currentHeight }}
                transition={{
                  duration: currentDuration,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.05,
                }}
                style={{ transformOrigin: "bottom" }}
              />
            );
          })}
        </div>

        {/* Arriving Results Area */}
        <div className="mt-8 min-h-[60px] w-full max-w-sm flex flex-wrap justify-center gap-3">
          <AnimatePresence>
            {displayedAvatars.map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="relative group"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/40 flex items-center justify-center overflow-hidden">
                  <Activity className="w-4 h-4 text-red-600 opacity-50" />
                </div>
                {/* Fake subscriber count badge */}
                <div className="absolute -bottom-2 -right-2 bg-brand-dark text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-white shadow-sm">
                  {Math.floor(Math.random() * 900 + 100)}k
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      
    </div>
  );
}


