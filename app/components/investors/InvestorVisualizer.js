"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Loader2, CheckCircle2, Database, Briefcase, Zap } from "lucide-react";

const FloatingNode = ({ delay, icon: Icon, color, label, status }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ delay, type: "spring", stiffness: 200, damping: 20 }}
      className={`absolute flex flex-col items-center gap-2`}
    >
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg border-2 border-white ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="bg-surface/90 backdrop-blur px-2 py-1 rounded-md text-[10px] font-bold text-gray-600 shadow-sm whitespace-nowrap">
        {label}
      </div>
    </motion.div>
  );
};

export default function InvestorVisualizer({ status, targetUrl, resultCount = 0 }) {
  const [nodes, setNodes] = useState([]);

  // Status mapping
  const statusConfig = {
    idle: { text: "AWAITING TARGET COMPANY...", icon: <Building2 className="w-4 h-4 text-gray-400" />, color: "text-gray-500" },
    locked: { text: "TARGET LOCKED — READY TO ENRICH", icon: <CheckCircle2 className="w-4 h-4 text-blue-600" />, color: "text-blue-600" },
    scanning: { text: "ORCHESTRATING ENRICHMENT PIPELINE...", icon: <Loader2 className="w-4 h-4 text-[#4ec8ef] animate-spin" />, color: "text-[#4ec8ef]" },
    complete: { text: "ENRICHMENT COMPLETE", icon: <CheckCircle2 className="w-4 h-4 text-emerald-500" />, color: "text-emerald-600" }
  };

  const currentStatus = statusConfig[status] || statusConfig.idle;

  useEffect(() => {
    if (status === 'scanning' || status === 'complete') {
      const newNodes = [
        { id: 'cb', icon: Database, color: 'bg-[var(--rw-surface-hover)]0', label: 'Private Market Data', delay: 0.2, pos: { top: '15%', left: '20%' } },
        { id: 'pb', icon: Briefcase, color: 'bg-indigo-600', label: 'Venture Capital DB', delay: 0.8, pos: { top: '15%', right: '20%' } },
        { id: 'ap', icon: Zap, color: 'bg-[#ffc857]', label: 'Enrichment Engine', delay: 0.5, pos: { bottom: '20%', left: '50%', transform: 'translateX(-50%)' } }
      ];
      setNodes(newNodes);
    } else {
      setNodes([]);
    }
  }, [status]);

  return (
    <div className="bg-surface rounded-2xl p-6 border border-border shadow-md flex flex-col h-full min-h-[400px] lg:min-h-[500px] overflow-hidden relative">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6 relative z-10 shrink-0">
        <div className="w-1 h-3 bg-gradient-to-b from-[#023dbb] to-[#4ec8ef] rounded-full" />
        <h3 className="text-xs uppercase tracking-widest text-[#023dbb] font-bold flex items-center gap-2">
          Data Pipeline Visualizer
        </h3>
      </div>

      {/* Main Visualization Area */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden w-full h-full">
        
        {/* Background Pulses when scanning */}
        <AnimatePresence>
          {status === 'scanning' && (
            <>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 2.5, opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                className="absolute w-32 h-32 rounded-full border-2 border-[#4ec8ef]/30"
              />
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 2.5, opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 1 }}
                className="absolute w-32 h-32 rounded-full border-2 border-[#308fef]/30"
              />
            </>
          )}
        </AnimatePresence>

        {/* Floating Data Nodes */}
        <AnimatePresence>
          {nodes.map(node => (
            <div key={node.id} className="absolute" style={node.pos}>
              <FloatingNode {...node} />
              
              {/* Connection Line to Center */}
              {status === 'scanning' && (
                <svg className="absolute top-1/2 left-1/2 w-64 h-64 -translate-x-1/2 -translate-y-1/2 pointer-events-none -z-10 overflow-visible">
                  <motion.line
                    x1="50%" y1="50%"
                    x2="50%" y2="50%"
                    stroke="url(#gradient)"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    initial={{ x2: "50%", y2: "50%", opacity: 0 }}
                    animate={{ 
                      x2: node.pos.left ? "0%" : (node.pos.right ? "100%" : "50%"), 
                      y2: node.pos.top ? "0%" : "100%",
                      opacity: 0.4
                    }}
                    transition={{ delay: node.delay + 0.3, duration: 1 }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#023dbb" />
                      <stop offset="100%" stopColor="#4ec8ef" />
                    </linearGradient>
                  </defs>
                </svg>
              )}
            </div>
          ))}
        </AnimatePresence>

        {/* Central Company Node */}
        <div className="relative z-20">
          <AnimatePresence>
            {status !== 'idle' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-[-8px] rounded-full"
                style={{
                  background: "conic-gradient(from 0deg, #023dbb, #308fef, #4ec8ef, #ffc857, #023dbb)",
                  padding: "3px" 
                }}
              >
                <motion.div 
                  className="w-full h-full rounded-full bg-surface"
                  animate={status === 'scanning' ? { rotate: -360 } : { rotate: 0 }}
                  transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full mix-blend-overlay"
                  style={{ background: "conic-gradient(from 0deg, transparent 50%, white)" }}
                  animate={status === 'scanning' ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                />
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className={`
            w-20 h-20 rounded-full flex items-center justify-center relative z-10
            ${status === 'idle' ? 'bg-[var(--rw-border)] border-2 border-border' : 'bg-gradient-to-tr from-[#023dbb] to-[#4ec8ef] border-4 border-white shadow-xl'}
            transition-all duration-500
          `}>
            {status === 'idle' ? (
              <Building2 className="w-8 h-8 text-gray-300" />
            ) : (
              <span className="text-white font-bold text-2xl uppercase">
                {targetUrl ? targetUrl.replace(/^https?:\/\/(www\.)?/, '').charAt(0).toUpperCase() : 'C'}
              </span>
            )}
          </div>
        </div>

        {/* Simulated Particle Stream when scanning */}
        {status === 'scanning' && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 15 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 bg-[#ffc857] rounded-full"
                initial={{
                  top: "100%",
                  left: `${Math.random() * 100}%`,
                  opacity: 0
                }}
                animate={{
                  top: "-10%",
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "linear"
                }}
              />
            ))}
          </div>
        )}

      </div>

      {/* Footer / Status Bar */}
      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between shrink-0 relative z-10">
        <div className={`flex items-center gap-2 text-xs font-bold tracking-wide ${currentStatus.color}`}>
          {currentStatus.icon}
          {status === 'complete' ? (
            <span>{resultCount} INVESTORS ENRICHED</span>
          ) : (
            <span>{currentStatus.text}</span>
          )}
        </div>
      </div>
    </div>
  );
}
