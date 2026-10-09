"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Info } from 'lucide-react';

const PROSPECTS = [
    { id: 'p1', name: 'Prospect 1', scores: { need: 30, urgency: 20, relevance: 40, authority: 50 }, final: 35 },
    { id: 'p2', name: 'Prospect 2', scores: { need: 95, urgency: 80, relevance: 90, authority: 85 }, final: 88, highlight: true },
    { id: 'p3', name: 'Prospect 3', scores: { need: 40, urgency: 30, relevance: 50, authority: 40 }, final: 40 },
    { id: 'p4', name: 'Prospect 4', scores: { need: 85, urgency: 60, relevance: 75, authority: 90 }, final: 78, highlight: true },
    { id: 'p5', name: 'Prospect 5', scores: { need: 20, urgency: 40, relevance: 30, authority: 20 }, final: 28 },
    { id: 'p6', name: 'Prospect 6', scores: { need: 60, urgency: 50, relevance: 60, authority: 55 }, final: 56 },
    { id: 'p7', name: 'Prospect 7', scores: { need: 90, urgency: 95, relevance: 85, authority: 80 }, final: 87, highlight: true },
    { id: 'p8', name: 'Prospect 8', scores: { need: 50, urgency: 40, relevance: 45, authority: 60 }, final: 49 },
];

const CRITERIA = [
    { id: 'need', label: 'Need', question: 'Does the prospect appear relevant to the problem you solve?' },
    { id: 'urgency', label: 'Urgency', question: 'Are there available signals suggesting the need may be immediate?' },
    { id: 'relevance', label: 'Relevance', question: 'Does the person, company and available context fit your target?' },
    { id: 'authority', label: 'Authority', question: 'Does the information indicate an appropriate level of influence?' }
];

const RawVsQualifiedList = () => {
    const prefersReducedMotion = useReducedMotion();
    const [isSorted, setIsSorted] = useState(false);
    
    // Sort array when isSorted is true
    const displayProspects = isSorted 
        ? [...PROSPECTS].sort((a, b) => b.final - a.final) 
        : PROSPECTS;

    return (
        <motion.div 
            onViewportEnter={() => !prefersReducedMotion && setTimeout(() => setIsSorted(true), 500)}
            viewport={{ once: true, margin: "-100px" }}
            className="w-full grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-200 border border-slate-200 rounded-3xl overflow-hidden shadow-sm"
        >
            {/* LEFT: RAW */}
            <div className="bg-slate-50 p-6 sm:p-10 flex flex-col h-full">
                <div className="mb-8">
                    <h3 className="font-mono text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Raw Contact List</h3>
                    <p className="text-sm text-slate-500">Tells you who exists.</p>
                </div>
                <div className="space-y-2 flex-1 flex flex-col justify-center">
                    {PROSPECTS.map((p, i) => (
                        <div key={`raw-${p.id}`} className="bg-white border border-slate-200 px-4 py-2.5 rounded-lg flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center">
                                    <span className="text-[10px] text-slate-400 font-mono">{i + 1}</span>
                                </div>
                                <div className="w-24 h-2 bg-slate-200 rounded-full"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT: QUALIFIED */}
            <div className="bg-white p-6 sm:p-10 flex flex-col h-full relative">
                <div className="mb-8">
                    <h3 className="font-mono text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Qualified Prospect List</h3>
                    <p className="text-sm text-slate-500">Shows who deserves attention.</p>
                </div>
                <div className="space-y-2 flex-1 flex flex-col justify-center relative">
                    {displayProspects.map((p, i) => (
                        <motion.div 
                            key={`qual-${p.id}`}
                            layout={!prefersReducedMotion}
                            transition={{ type: "spring", bounce: 0.2, duration: 0.9 }}
                            className={`px-4 py-2.5 rounded-lg flex items-center justify-between border ${
                                isSorted && p.highlight 
                                    ? 'bg-blue-50 border-blue-200 shadow-sm z-10' 
                                    : 'bg-white border-slate-200 z-0'
                            }`}
                            style={{ opacity: isSorted && !p.highlight ? 0.4 : 1 }}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-5 h-5 rounded flex items-center justify-center ${isSorted && p.highlight ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                                    <span className="text-[10px] font-mono font-bold">{i + 1}</span>
                                </div>
                                <span className={`text-xs font-semibold ${isSorted && p.highlight ? 'text-blue-900' : 'text-slate-400'}`}>
                                    {p.name}
                                </span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div 
                                        className="h-full bg-blue-500 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: isSorted ? `${p.final}%` : 0 }}
                                        transition={{ duration: 0.8, delay: 0.5 }}
                                    />
                                </div>
                                <span className={`font-mono text-[9px] w-4 text-right ${isSorted && p.highlight ? 'text-blue-600 font-bold' : 'text-slate-400'}`}>
                                    {isSorted ? p.final : 0}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
            
            {/* Center Arrow Connector */}
            <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-slate-200 rounded-full items-center justify-center shadow-sm z-20">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
            </div>
        </motion.div>
    );
};

const CriteriaRadar = () => {
    const [hoveredCriteria, setHoveredCriteria] = useState(null);
    const [activeProspectIdx, setActiveProspectIdx] = useState(1); // Default to Prospect 2 (High score)
    const activeProspect = PROSPECTS[activeProspectIdx];
    
    const size = 280;
    const center = size / 2;
    const radius = size * 0.35; // leaves room for labels
    
    // Angles for 4 axes: Top, Right, Bottom, Left
    const getPoint = (val, angleIdx) => {
        const angle = (Math.PI / 2) * angleIdx - (Math.PI / 2); // Start top, go clockwise
        const r = (val / 100) * radius;
        return {
            x: center + r * Math.cos(angle),
            y: center + r * Math.sin(angle)
        };
    };

    const s = activeProspect.scores;
    const p0 = getPoint(s.need, 0);
    const p1 = getPoint(s.urgency, 1);
    const p2 = getPoint(s.authority, 2);
    const p3 = getPoint(s.relevance, 3);
    const polygonPath = `M ${p0.x} ${p0.y} L ${p1.x} ${p1.y} L ${p2.x} ${p2.y} L ${p3.x} ${p3.y} Z`;

    const PRESETS = [0, 1, 4]; // Poor, Great, Terrible

    return (
        <div className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm flex flex-col lg:flex-row items-center gap-10 mt-6">
            
            {/* SVG RADAR CHART */}
            <div className="relative shrink-0 flex flex-col items-center">
                {/* Prospect switcher */}
                <div className="flex bg-white border border-slate-200 rounded-lg p-1 mb-4 z-10 relative">
                    {PRESETS.map((idx, buttonI) => (
                        <button
                            key={idx}
                            onClick={() => setActiveProspectIdx(idx)}
                            className={`px-3 py-1 text-[10px] font-mono font-bold rounded-md transition-colors ${activeProspectIdx === idx ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            P{buttonI + 1}
                        </button>
                    ))}
                </div>

                <div className="relative w-[280px] h-[280px]">
                    <svg width={size} height={size} className="overflow-visible" aria-label="Radar chart showing scoring criteria">
                        <title>Lead Scoring Radar</title>
                        
                        {/* Background rings */}
                        {[0.25, 0.5, 0.75, 1].map((r, i) => (
                            <circle key={i} cx={center} cy={center} r={radius * r} fill="none" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4 4" />
                        ))}

                        {/* Axes */}
                        {[0, 1, 2, 3].map(i => {
                            const pEnd = getPoint(100, i);
                            const isActive = hoveredCriteria === CRITERIA[i].id;
                            return (
                                <line 
                                    key={i} 
                                    x1={center} y1={center} x2={pEnd.x} y2={pEnd.y} 
                                    stroke={isActive ? "#3b82f6" : "#cbd5e1"} 
                                    strokeWidth={isActive ? "2" : "1"} 
                                    className="transition-all duration-300"
                                />
                            );
                        })}

                        {/* Labels */}
                        <text x={center} y={center - radius - 10} textAnchor="middle" fill={hoveredCriteria === 'need' ? '#3b82f6' : '#94a3b8'} className="font-mono text-[9px] font-bold tracking-widest transition-colors duration-300">NEED</text>
                        <text x={center + radius + 10} y={center + 3} textAnchor="start" fill={hoveredCriteria === 'urgency' ? '#3b82f6' : '#94a3b8'} className="font-mono text-[9px] font-bold tracking-widest transition-colors duration-300">URGENCY</text>
                        <text x={center} y={center + radius + 15} textAnchor="middle" fill={hoveredCriteria === 'authority' ? '#3b82f6' : '#94a3b8'} className="font-mono text-[9px] font-bold tracking-widest transition-colors duration-300">AUTHORITY</text>
                        <text x={center - radius - 10} y={center + 3} textAnchor="end" fill={hoveredCriteria === 'relevance' ? '#3b82f6' : '#94a3b8'} className="font-mono text-[9px] font-bold tracking-widest transition-colors duration-300">RELEVANCE</text>

                        {/* Animated Polygon */}
                        <motion.path 
                            d={polygonPath}
                            fill="rgba(59, 130, 246, 0.12)"
                            stroke="#3b82f6"
                            strokeWidth="2"
                            animate={{ d: polygonPath }}
                            transition={{ type: "spring", bounce: 0.3, duration: 0.8 }}
                        />
                        
                        {/* Dots */}
                        {[p0, p1, p2, p3].map((pt, i) => (
                            <motion.circle 
                                key={`dot-${i}`}
                                r="4" 
                                fill="#ffffff"
                                stroke="#3b82f6"
                                strokeWidth="2"
                                animate={{ cx: pt.x, cy: pt.y }}
                                transition={{ type: "spring", bounce: 0.3, duration: 0.8 }}
                            />
                        ))}
                    </svg>
                    
                    {/* Score Readout Center */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                        <span className="text-2xl font-bold text-slate-800">{activeProspect.final}</span>
                    </div>
                </div>
            </div>

            {/* CRITERIA LEGEND */}
            <div className="flex-1 flex flex-col gap-4">
                {CRITERIA.map((crit) => {
                    const val = activeProspect.scores[crit.id];
                    return (
                        <div 
                            key={crit.id}
                            onMouseEnter={() => setHoveredCriteria(crit.id)}
                            onMouseLeave={() => setHoveredCriteria(null)}
                            className={`p-4 rounded-xl transition-colors duration-200 border ${hoveredCriteria === crit.id ? 'bg-white border-blue-100 shadow-sm' : 'bg-transparent border-transparent'}`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <span className={`font-mono text-[10px] font-bold uppercase tracking-widest transition-colors ${hoveredCriteria === crit.id ? 'text-blue-600' : 'text-slate-500'}`}>{crit.label}</span>
                                <span className="font-mono text-[10px] text-slate-400 tabular-nums">{val} / 100</span>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed mb-3">{crit.question}</p>
                            <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                                <motion.div 
                                    className="h-full bg-blue-500 rounded-full"
                                    animate={{ width: `${val}%` }}
                                    transition={{ type: "spring", bounce: 0, duration: 0.8 }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

        </div>
    );
};

export default function QualifiedListSection() {
    return (
        <section className="max-w-5xl mx-auto px-6 mb-32 fade-up">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-slate-900 tracking-tight">Why a Qualified Prospect List Is More Useful Than a Raw Contact List</h2>
                <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
                    A raw contact list tells you who exists.<br />
                    A qualified prospect list helps you understand who deserves attention.
                </p>
            </div>

            <RawVsQualifiedList />
            <CriteriaRadar />
            
            <p className="flex items-center justify-center gap-2 text-[11px] text-slate-400 mt-6 italic">
                <Info className="w-3.5 h-3.5 text-slate-300" />
                Lead Scoring helps prioritize the resulting prospects. The score is a prioritization aid, not a guarantee of conversion.
            </p>
        </section>
    );
}
