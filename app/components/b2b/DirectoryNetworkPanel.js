"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Network, Building, BookOpen, Loader2 } from "lucide-react";

const DIR_META = {
  yellowpages: { name: "Yellow Pages", color: "#eab308", icon: BookOpen, glow: "rgba(234, 179, 8, 0.4)" },
  justdial: { name: "Justdial", color: "#ea580c", icon: Building, glow: "rgba(234, 88, 12, 0.4)" },
  indiamart: { name: "IndiaMART", color: "#2563eb", icon: Building, glow: "rgba(37, 99, 235, 0.4)" },
};

const LEAD_MESSAGES = [
  "Lead Discovered",
  "Contact Found",
  "Match Found",
  "Email Verified",
  "Profile Matched",
  "Data Extracted",
  "Phone Number Found",
  "Business Matched"
];

export default function DirectoryNetworkPanel({ status, selectedDirectory, businessCount }) {
  const [nodes, setNodes] = useState([]);
  const [liveCount, setLiveCount] = useState(0);

  const meta = DIR_META[selectedDirectory] || DIR_META.yellowpages;
  const CenterIcon = meta.icon;

  useEffect(() => {
    if (status === "idle") {
      setLiveCount(0);
      // Generate some idle ambient nodes
      const ambientNodes = Array.from({ length: 5 }).map((_, i) => ({
        id: `ambient-${i}`,
        angle: (i / 5) * Math.PI * 2 + Math.random(),
        distance: 80 + Math.random() * 40,
        size: 6 + Math.random() * 6,
        opacity: 0.3,
        label: null
      }));
      setNodes(ambientNodes);
    } else if (status === "scanning") {
      let count = 0;
      const interval = setInterval(() => {
        setLiveCount(prev => prev + Math.floor(Math.random() * 3) + 1);
        
        // Add a new node every interval (up to 20 nodes to keep UI clean)
        setNodes(prev => {
          if (prev.length > 25) return prev;
          
          const angle = Math.random() * Math.PI * 2;
          const distance = 70 + Math.random() * 90;
          const isLabeled = Math.random() > 0.6;
          const randomLabel = LEAD_MESSAGES[Math.floor(Math.random() * LEAD_MESSAGES.length)];
          
          return [...prev, {
            id: `scan-${count++}`,
            angle,
            distance,
            size: 8 + Math.random() * 8,
            opacity: 0.8 + Math.random() * 0.2,
            label: isLabeled ? randomLabel : null
          }];
        });
      }, 400);

      return () => clearInterval(interval);
    } else if (status === "complete") {
      setLiveCount(businessCount || 0);
      // Keep existing nodes but make them all steady
      setNodes(prev => prev.map(n => ({ ...n, opacity: 1, label: null })));
    }
  }, [status, businessCount]);

  return (
    <div className="w-full h-full min-h-[500px] bg-white rounded-2xl relative overflow-hidden shadow-[0_4px_15px_rgba(2,61,187,0.12)] border border-brand-blue/10 flex flex-col p-6">
      {/* ── Overlay UI / Status Panel ── */}
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <h3 className="text-brand-dark font-display font-semibold tracking-wide text-lg flex items-center gap-2 drop-shadow-sm">
          <Network className="w-5 h-5 text-brand-cyan" />
          Directory Network
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
              <motion.div 
                animate={{ backgroundColor: [meta.color, "#e5e7eb", meta.color] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 rounded-full" 
              />
              <p className="text-[#4ec8ef]/70 text-xs uppercase tracking-wider font-semibold m-0">
                READY TO SCAN {meta.name.toUpperCase()}
              </p>
            </motion.div>
          )}

          {status === "scanning" && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-3 bg-white/90 backdrop-blur-md border border-brand-blue/20 rounded-xl p-4 inline-block shadow-[0_4px_20px_rgba(48,143,239,0.15)] pointer-events-auto"
            >
              <div className="text-[#4ec8ef] text-[10px] uppercase tracking-[0.2em] font-bold mb-1.5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse" />
                EXTRACTING FROM {meta.name.toUpperCase()}
              </div>
              <div className="text-brand-dark text-3xl font-bold font-display tabular-nums leading-none flex items-baseline gap-2">
                {liveCount} <span className="text-sm text-gray-500 font-sans font-medium tracking-normal">businesses mapped</span>
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
                  Extraction Complete
                </div>
                <div className="text-emerald-900 text-2xl font-bold font-display tabular-nums leading-none">
                  {businessCount} <span className="text-sm font-sans font-medium text-emerald-700 tracking-normal">businesses found</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Visual Area ── */}
      <div className="flex-1 relative flex items-center justify-center mt-12 overflow-hidden pointer-events-none">
        
        {/* Connection Lines (SVGs drawn between center and nodes) */}
        <svg className="absolute inset-0 w-full h-full z-0">
          <AnimatePresence>
            {nodes.map(node => {
              // Calculate end coordinates relative to center (0,0 in SVG viewBox is top-left, but we can do absolute math)
              // We'll use absolute CSS positioning for nodes, so SVG just covers the whole area
              // Center is 50%, 50%
              const x2 = `calc(50% + ${Math.cos(node.angle) * node.distance}px)`;
              const y2 = `calc(50% + ${Math.sin(node.angle) * node.distance}px)`;
              
              return (
                <motion.line
                  key={`line-${node.id}`}
                  x1="50%"
                  y1="50%"
                  x2={x2}
                  y2={y2}
                  stroke={`url(#grad-${meta.name})`}
                  strokeWidth="1.5"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: node.opacity * 0.6 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              );
            })}
          </AnimatePresence>
          <defs>
            <linearGradient id={`grad-${meta.name}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={meta.color} stopOpacity="0.8" />
              <stop offset="100%" stopColor="#4ec8ef" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </svg>

        {/* Orbiting / Branched Nodes */}
        <AnimatePresence>
          {nodes.map(node => (
            <motion.div
              key={node.id}
              className="absolute z-10 rounded-full"
              style={{
                width: node.size,
                height: node.size,
                backgroundColor: status === "complete" ? "#10b981" : "#4ec8ef",
                boxShadow: `0 0 10px ${status === "complete" ? "rgba(16,185,129,0.5)" : "rgba(78,200,239,0.5)"}`
              }}
              initial={{ 
                opacity: 0, 
                scale: 0,
                x: Math.cos(node.angle) * 10,
                y: Math.sin(node.angle) * 10
              }}
              animate={{ 
                opacity: node.opacity,
                scale: 1,
                x: Math.cos(node.angle) * node.distance,
                y: Math.sin(node.angle) * node.distance
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              {/* Tooltip Label (Scanning only) */}
              {node.label && status === "scanning" && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: -20 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5 }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap bg-white/90 border border-gray-200 text-brand-dark text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm"
                >
                  {node.label}
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Central Directory Node */}
        <motion.div 
          className="relative z-20 flex items-center justify-center rounded-full bg-white shadow-md border-2"
          initial={false}
          animate={{ 
            borderColor: meta.color,
            boxShadow: status === "scanning" 
              ? [`0 0 0px ${meta.glow}`, `0 0 40px ${meta.glow}`, `0 0 0px ${meta.glow}`]
              : `0 0 20px ${meta.glow}`
          }}
          transition={status === "scanning" ? { duration: 1.5, repeat: Infinity } : { duration: 0.5 }}
          style={{ width: 80, height: 80 }}
        >
          {/* Inner pulsating circle for idle/scanning */}
          {status !== "complete" && (
            <motion.div
              className="absolute inset-0 rounded-full"
              initial={false}
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              style={{ backgroundColor: meta.color }}
            />
          )}

          {/* Icon Crossfade */}
          <AnimatePresence mode="wait">
            <motion.div
              key={meta.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="relative z-10"
            >
              <CenterIcon style={{ color: meta.color }} className="w-8 h-8" />
            </motion.div>
          </AnimatePresence>
        </motion.div>
        
        {/* Scanning spinner overlay on central node */}
        <AnimatePresence>
          {status === "scanning" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, rotate: 360 }}
              exit={{ opacity: 0 }}
              transition={{ opacity: { duration: 0.3 }, rotate: { duration: 3, repeat: Infinity, ease: "linear" } }}
              className="absolute z-20"
              style={{ width: 110, height: 110 }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                <circle cx="50" cy="50" r="48" fill="none" stroke={meta.color} strokeWidth="1" strokeDasharray="60 40 10 40" opacity="0.6" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
    </div>
  );
}
