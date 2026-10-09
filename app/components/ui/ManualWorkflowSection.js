"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Database, LayoutDashboard, Briefcase, Globe, Users, FileText, CheckCircle2, RefreshCw } from 'lucide-react';

const PAIN_STEPS = [
    "Search for people by role.",
    "Research their company separately.",
    "Check whether the company has relevant business activity.",
    "Review job postings.",
    "Copy information into a spreadsheet.",
    "Decide manually which prospects appear relevant.",
    "Build another list when the target changes."
];

const SOURCES = [
    { id: 'db', label: 'Databases', icon: Database, flag: 'OUTDATED' },
    { id: 'sheet', label: 'Spreadsheets', icon: LayoutDashboard, flag: 'DUPLICATE' },
    { id: 'jobs', label: 'Job Boards', icon: Briefcase },
    { id: 'web', label: 'Websites', icon: Globe },
    { id: 'social', label: 'LinkedIn', icon: Users },
    { id: 'notes', label: 'Notes', icon: FileText }
];

const ModeToggle = ({ isSimpLeads, setIsSimpLeads }) => (
    <div className="flex items-center bg-slate-100 p-1 rounded-lg w-fit mx-auto mb-6 relative z-20" role="tablist" aria-label="Workflow Mode">
        <button
            role="tab"
            aria-selected={!isSimpLeads}
            onClick={() => setIsSimpLeads(false)}
            className={`relative px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${!isSimpLeads ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
        >
            {!isSimpLeads && <motion.div layoutId="mode-bg" className="absolute inset-0 bg-white rounded-md shadow-sm border border-slate-200" transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }} />}
            <span className="relative z-10">Manual</span>
        </button>
        <button
            role="tab"
            aria-selected={isSimpLeads}
            onClick={() => setIsSimpLeads(true)}
            className={`relative px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${isSimpLeads ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
            {isSimpLeads && <motion.div layoutId="mode-bg" className="absolute inset-0 bg-white rounded-md shadow-sm border border-slate-200" transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }} />}
            <span className="relative z-10">SimpLeads</span>
        </button>
    </div>
);

const PainTimeline = () => {
    return (
        <div className="relative pl-6 sm:pl-8">
            <div className="absolute left-3 sm:left-4 top-2 bottom-2 w-[1px] bg-slate-200 origin-top" />
            <motion.div 
                initial={{ scaleY: 0 }} 
                whileInView={{ scaleY: 1 }} 
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute left-3 sm:left-4 top-2 bottom-2 w-[1px] bg-blue-500 origin-top z-0" 
            />
            
            <ul className="space-y-6 relative z-10">
                {PAIN_STEPS.map((step, i) => (
                    <motion.li 
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ delay: i * 0.06 + 0.2 }}
                        className="flex items-start gap-4"
                    >
                        <div className="w-6 sm:w-8 h-6 sm:h-8 rounded bg-white border border-slate-200 shadow-sm flex items-center justify-center shrink-0 -ml-6 sm:-ml-8 mt-0.5">
                            {i === PAIN_STEPS.length - 1 ? (
                                <RefreshCw className="w-3 sm:w-4 h-3 sm:h-4 text-slate-400 animate-[spin_4s_linear_infinite]" />
                            ) : (
                                <span className="font-mono text-[9px] sm:text-[10px] text-slate-500">{String(i + 1).padStart(2, '0')}</span>
                            )}
                        </div>
                        <span className="text-sm sm:text-base text-slate-600 font-medium pt-1 sm:pt-1.5">{step}</span>
                    </motion.li>
                ))}
            </ul>

            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
                className="mt-10 bg-slate-50 border border-slate-200 border-l-2 border-l-blue-500 p-5 sm:p-6 rounded-r-2xl rounded-l-md flex gap-3"
            >
                <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                <div>
                    <p className="font-bold text-slate-900 mb-1 text-sm sm:text-base">The problem is the repetition and fragmentation.</p>
                    <p className="text-slate-600 text-xs sm:text-sm">SimpLeads puts the core workflow into one place so you can define what you want, add context, qualify, and prioritize without rebuilding the entire research process.</p>
                </div>
            </motion.div>
        </div>
    );
};

const ManualVsUnifiedScene = () => {
    const [isSimpLeads, setIsSimpLeads] = useState(false);
    const prefersReducedMotion = useReducedMotion();
    const [hasScrolled, setHasScrolled] = useState(false);
    
    // Autoplay toggle on scroll in
    useEffect(() => {
        if (!hasScrolled) return;
        if (prefersReducedMotion) {
            setIsSimpLeads(true); // Default to clean state for reduced motion
            return;
        }
        
        const t = setTimeout(() => {
            setIsSimpLeads(true);
        }, 2000);
        return () => clearTimeout(t);
    }, [hasScrolled, prefersReducedMotion]);

    return (
        <motion.div 
            onViewportEnter={() => setHasScrolled(true)}
            viewport={{ once: true, margin: "-100px" }}
            className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col relative overflow-hidden"
        >
            {/* Background grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] pointer-events-none" />
            
            <ModeToggle isSimpLeads={isSimpLeads} setIsSimpLeads={setIsSimpLeads} />

            <div className="relative h-[300px] sm:h-[400px] w-full flex items-center justify-center">
                
                {/* 1. SOURCES (Left) */}
                <div className="absolute left-0 sm:left-4 top-0 bottom-0 w-[100px] sm:w-[140px] flex flex-col justify-between py-4 sm:py-8 z-10">
                    {SOURCES.map((source, i) => {
                        const Icon = source.icon;
                        const isManual = !isSimpLeads;
                        
                        // Chaotic positions for manual mode
                        const yOffset = isManual ? (i % 2 === 0 ? 10 : -10) : 0;
                        const xOffset = isManual ? (i === 1 ? -15 : i === 4 ? 10 : 0) : 0;
                        const rot = isManual ? (i % 2 === 0 ? 4 : -4) : 0;

                        return (
                            <motion.div 
                                key={source.id}
                                layout
                                animate={prefersReducedMotion ? { y: 0, x: 0, rotate: 0 } : {
                                    y: isManual ? [yOffset, yOffset + 5, yOffset] : 0,
                                    x: xOffset,
                                    rotate: rot
                                }}
                                transition={{
                                    y: isManual ? { duration: 3 + i, repeat: Infinity, ease: "easeInOut" } : { type: "spring", bounce: 0 },
                                    layout: { type: "spring", bounce: 0.1, duration: 0.8 }
                                }}
                                className={`relative w-10 sm:w-12 h-10 sm:h-12 rounded-xl border flex items-center justify-center bg-white shadow-sm z-20 transition-colors duration-500 ${isManual ? 'border-slate-300' : 'border-blue-200'}`}
                            >
                                <Icon className={`w-4 sm:w-5 h-4 sm:h-5 transition-colors duration-500 ${isManual ? 'text-slate-400' : 'text-blue-500'}`} />
                                {isManual && source.flag && (
                                    <div className="absolute -top-2 -right-6 px-1.5 py-0.5 bg-rose-100 border border-rose-200 text-rose-600 rounded text-[8px] font-mono font-bold flex items-center gap-1 shadow-sm whitespace-nowrap z-30">
                                        <span className="w-1 h-1 rounded-full bg-rose-500 animate-pulse"></span>
                                        {source.flag}
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>

                {/* 2. SVG CONNECTORS */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" aria-hidden="true">
                    {SOURCES.map((source, i) => {
                        const isManual = !isSimpLeads;
                        const yPercent = (i / (SOURCES.length - 1));
                        
                        // End points: manual goes nowhere (x: 150-200, y: random), simpleads goes to center hub
                        const startY = 32 + (yPercent * (400 - 64)); // Roughly maps to flex-between
                        const hubX = 200; // Center hub roughly at 50% width... wait, need relative % for responsive.
                        // SVG uses 100% width/height. We can use percentages or rely on relative positioning.
                        // Using percentages in line coordinates:
                        return (
                            <g key={`line-${i}`}>
                                <motion.path
                                    d={isManual 
                                        ? `M 60 ${startY} Q 120 ${startY + (i%2===0?20:-20)} ${120 + i*10} ${startY + (i%2===0?40:-40)}` 
                                        : `M 60 ${startY} C 120 ${startY}, 150 200, 50% 200`} // Approximating center hub
                                    fill="none"
                                    stroke={isManual ? "#cbd5e1" : "#93c5fd"}
                                    strokeWidth="1.5"
                                    strokeDasharray={isManual ? "4 4" : "none"}
                                    className="transition-all duration-700 ease-in-out"
                                />
                                {isManual && i % 2 !== 0 && (
                                    <text x={120 + i*10 + 5} y={startY + (i%2===0?40:-40) + 4} fontSize="10" fill="#94a3b8" fontFamily="monospace">x</text>
                                )}
                            </g>
                        );
                    })}
                    {/* Simplified cross-browser reliable lines using static percentages inside a viewBox */}
                </svg>
                {/* A better approach for the lines is an SVG overlay with a viewBox so absolute coordinates work reliably */}
                <div className="absolute inset-0 z-0">
                    <svg viewBox="0 0 400 300" className="w-full h-full" preserveAspectRatio="none">
                        {SOURCES.map((source, i) => {
                            const isManual = !isSimpLeads;
                            const yPos = 30 + (i * 48); // 6 items * 48 = 288
                            
                            const manualPath = `M 40 ${yPos} Q 100 ${yPos + (i%2===0?20:-20)} ${120 + i*10} ${yPos + (i%2===0?30:-30)}`;
                            const cleanPath = `M 40 ${yPos} C 100 ${yPos}, 150 150, 200 150`;

                            return (
                                <g key={`p-${i}`}>
                                    <motion.path
                                        d={isManual ? manualPath : cleanPath}
                                        fill="none"
                                        stroke={isManual ? "#cbd5e1" : "#93c5fd"}
                                        strokeWidth="1"
                                        strokeDasharray={isManual ? "4 4" : "0"}
                                        animate={{ d: isManual ? manualPath : cleanPath, strokeDasharray: isManual ? "4 4" : "0" }}
                                        transition={{ type: "spring", bounce: 0, duration: 0.8 }}
                                    />
                                    {/* Animated packets in simpleads mode */}
                                    {!isManual && !prefersReducedMotion && (
                                        <motion.circle 
                                            r="2" 
                                            fill="#3b82f6"
                                            animate={{ 
                                                offsetDistance: ["0%", "100%"],
                                                opacity: [0, 1, 0]
                                            }}
                                            transition={{
                                                duration: 1.5,
                                                repeat: Infinity,
                                                delay: i * 0.2,
                                                ease: "linear"
                                            }}
                                            style={{ offsetPath: `path('${cleanPath}')` }}
                                        />
                                    )}
                                </g>
                            );
                        })}
                        
                        {/* Output line from hub to list */}
                        {isSimpLeads && (
                            <motion.path 
                                initial={{ pathLength: 0, opacity: 0 }}
                                animate={{ pathLength: 1, opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                                d="M 200 150 L 280 150" 
                                fill="none" 
                                stroke="#3b82f6" 
                                strokeWidth="2" 
                            />
                        )}
                    </svg>
                </div>

                {/* 3. CENTER HUB */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center z-20">
                    <AnimatePresence>
                        {!isSimpLeads ? (
                            <motion.div 
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }} 
                                exit={{ opacity: 0 }}
                                className="text-slate-400 font-mono text-xs mb-2 bg-white px-2 py-1 rounded border border-slate-200"
                            >
                                <span className="inline-block w-2 h-2 bg-slate-300 rounded-full mr-1"></span>
                                {prefersReducedMotion ? "00:00:00" : (
                                    <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 1 }}>03:14:59 LOST</motion.span>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div 
                                initial={{ scale: 0, opacity: 0 }} 
                                animate={{ scale: 1, opacity: 1 }} 
                                transition={{ type: 'spring', bounce: 0.4 }}
                                className="relative flex flex-col items-center"
                            >
                                {!prefersReducedMotion && (
                                    <div className="absolute w-24 h-24 bg-blue-400/20 rounded-full animate-[ping_2.4s_cubic-bezier(0,0,0.2,1)_infinite] -z-10" />
                                )}
                                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 border border-blue-400">
                                    <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center">
                                        <div className="w-4 h-4 rounded-full border-2 border-white translate-x-1 -translate-y-1"></div>
                                    </div>
                                </div>
                                <span className="absolute -bottom-6 font-mono text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-sm border border-blue-100 whitespace-nowrap">
                                    UNIFIED WORKFLOW
                                </span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* 4. OUTPUT LIST (Right) */}
                <div className="absolute right-0 sm:right-4 top-1/2 -translate-y-1/2 w-[110px] sm:w-[140px] z-20">
                    <AnimatePresence>
                        {isSimpLeads && (
                            <motion.div 
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6, type: "spring", bounce: 0.2 }}
                                className="w-full bg-white rounded-xl border border-blue-200 shadow-xl overflow-hidden"
                            >
                                <div className="bg-blue-50 border-b border-blue-100 px-3 py-2 flex items-center justify-between">
                                    <span className="text-[9px] font-mono font-bold text-blue-600">PRIORITY</span>
                                    <CheckCircle2 className="w-3 h-3 text-blue-500" />
                                </div>
                                <div className="p-2 space-y-1.5">
                                    <div className="w-full h-6 bg-blue-50 rounded flex items-center px-2">
                                        <div className="w-full h-1 bg-blue-200 rounded-full overflow-hidden">
                                            <div className="w-[92%] h-full bg-blue-500 rounded-full"></div>
                                        </div>
                                    </div>
                                    <div className="w-full h-6 bg-slate-50 rounded flex items-center px-2">
                                        <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                                            <div className="w-[75%] h-full bg-slate-400 rounded-full"></div>
                                        </div>
                                    </div>
                                    <div className="w-full h-6 bg-slate-50 rounded flex items-center px-2">
                                        <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                                            <div className="w-[45%] h-full bg-slate-300 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-slate-50 px-2 py-1.5 border-t border-slate-100 text-center">
                                    <span className="font-mono text-[8px] text-slate-500 tracking-wider">1 PLACE · 0 COPY-PASTE</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Stats Footer */}
            <div className="mt-auto pt-6 border-t border-slate-200 flex items-center justify-between gap-2 overflow-x-auto hide-scrollbar">
                <div className="flex flex-col bg-white border border-slate-200 px-3 py-1.5 rounded-md shrink-0">
                    <span className="font-mono text-[9px] text-slate-400">STEPS</span>
                    <span className="font-mono text-[11px] font-bold text-slate-700">{isSimpLeads ? '01 WORKFLOW' : '07 MANUAL'}</span>
                </div>
                <div className="flex flex-col bg-white border border-slate-200 px-3 py-1.5 rounded-md shrink-0">
                    <span className="font-mono text-[9px] text-slate-400">SOURCES</span>
                    <span className="font-mono text-[11px] font-bold text-slate-700">{isSimpLeads ? '01 VIEW' : '06 SCATTERED'}</span>
                </div>
                <div className="flex flex-col bg-white border border-slate-200 px-3 py-1.5 rounded-md shrink-0">
                    <span className="font-mono text-[9px] text-slate-400">PROCESS</span>
                    <span className="font-mono text-[11px] font-bold text-slate-700">{isSimpLeads ? 'REUSE' : 'REBUILD'}</span>
                </div>
            </div>
        </motion.div>
    );
};

export default function ManualWorkflowSection() {
    return (
        <section className="max-w-7xl mx-auto px-6 mt-30 mb-32">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                <div className="lg:col-span-5">
                    <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-slate-900 tracking-tight">Why Not Manually Build Every Prospect List?</h2>
                    <p className="text-xl text-slate-500 mb-8 leading-relaxed font-medium">
                        Manually building a prospect list usually means switching between multiple sources.
                    </p>
                    <PainTimeline />
                </div>
                <div className="lg:col-span-7">
                    <ManualVsUnifiedScene />
                </div>
            </div>
        </section>
    );
}
