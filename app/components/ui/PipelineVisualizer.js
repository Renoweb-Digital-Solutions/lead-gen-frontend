"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Building2, Briefcase, Sparkles, Check, X, Loader2, DownloadCloud, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';

const STAGES = [
    { id: 'people', label: 'People', description: 'Find professionals', icon: Users, color: 'blue' },
    { id: 'company', label: 'Company', description: 'Add account context', icon: Building2, color: 'indigo' },
    { id: 'jobs', label: 'Jobs', description: 'Identify active signals', icon: Briefcase, color: 'purple' },
    { id: 'scoring', label: 'Scoring', description: 'Prioritize prospects', icon: Sparkles, color: 'amber' }
];

const LOGS_MOCK = [
    "Initializing pipeline sequence...",
    "[People] Querying database for target roles...",
    "[People] Found 1,240 matching professionals.",
    "[Company] Enriching account-level context...",
    "[Company] Matched 312 target companies.",
    "[Jobs] Scanning active job postings...",
    "[Jobs] Identified 87 active job signals.",
    "[Scoring] Running AI qualification models...",
    "[Scoring] Scored 64 high-priority prospects.",
    "Pipeline complete. Generating export bundles...",
    "Export ready: summary.csv, leads.csv, jobs.csv"
];

// Helper to get color classes
const getColorClasses = (color, status) => {
    if (status === 'pending') return { bg: 'bg-slate-100', text: 'text-slate-400', border: 'border-slate-200' };
    if (status === 'failed') return { bg: 'bg-rose-100', text: 'text-rose-600', border: 'border-rose-200' };
    
    const colors = {
        blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200', activeRing: 'border-blue-400' },
        indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', border: 'border-indigo-200', activeRing: 'border-indigo-400' },
        purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200', activeRing: 'border-purple-400' },
        amber: { bg: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-200', activeRing: 'border-amber-400' },
    };
    return colors[color] || colors.blue;
};

// SVG Connector Component
const Connector = ({ status }) => {
    return (
        <div className="hidden md:flex flex-1 items-center justify-center relative min-w-[30px] h-full z-0 px-2">
            <svg width="100%" height="24" className="overflow-visible absolute top-1/2 -translate-y-1/2 left-0">
                <defs>
                    <linearGradient id="gradient-line" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill={status === 'completed' ? '#8b5cf6' : '#cbd5e1'} />
                    </marker>
                    <marker id="arrowhead-active" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
                    </marker>
                </defs>
                
                {/* Background dashed line */}
                <line 
                    x1="0" y1="12" x2="100%" y2="12" 
                    stroke={status === 'completed' ? "url(#gradient-line)" : "#e2e8f0"} 
                    strokeWidth="2" 
                    strokeDasharray={status === 'pending' ? "4 4" : "none"}
                    markerEnd={`url(#${status === 'completed' ? 'arrowhead' : status === 'active' ? 'arrowhead-active' : 'arrowhead'})`}
                    className="transition-all duration-500"
                />

                {/* Animated data packet */}
                {status === 'active' && (
                    <motion.circle 
                        r="4" 
                        fill="#3b82f6" 
                        cy="12"
                        initial={{ cx: "0%" }}
                        animate={{ cx: "100%" }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        style={{ filter: 'drop-shadow(0 0 6px rgba(59, 130, 246, 0.8))' }}
                    />
                )}
            </svg>
        </div>
    );
};
const VerticalConnector = ({ status }) => {
    return (
        <div className="md:hidden flex justify-center py-2 h-10 relative z-0">
             <svg width="24" height="100%" className="overflow-visible">
                <defs>
                    <marker id="arrowhead-v" markerWidth="10" markerHeight="7" refX="5" refY="7" orient="auto">
                        <polygon points="0 0, 10 0, 5 7" fill={status === 'completed' ? '#8b5cf6' : '#cbd5e1'} />
                    </marker>
                </defs>
                <line 
                    x1="12" y1="0" x2="12" y2="100%" 
                    stroke={status === 'completed' ? "#8b5cf6" : "#e2e8f0"} 
                    strokeWidth="2" 
                    strokeDasharray={status === 'pending' ? "4 4" : "none"}
                    markerEnd="url(#arrowhead-v)"
                />
             </svg>
        </div>
    );
};

const AnimatedCounter = ({ value }) => {
    const [display, setDisplay] = useState(0);
    
    useEffect(() => {
        let start = display;
        const end = parseInt(value, 10) || 0;
        if (start === end) return;
        
        const duration = 1000;
        const startTime = performance.now();
        
        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // ease out quart
            const ease = 1 - Math.pow(1 - progress, 4);
            setDisplay(Math.floor(start + (end - start) * ease));
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                setDisplay(end);
            }
        };
        requestAnimationFrame(update);
    }, [value]);

    return <span>{display.toLocaleString()}</span>;
};


export default function PipelineVisualizer() {
    const [pipelineState, setPipelineState] = useState('idle'); // idle, running, completed, failed
    const [activeStageIdx, setActiveStageIdx] = useState(-1);
    const [metrics, setMetrics] = useState([0, 0, 0, 0]);
    const [logs, setLogs] = useState([]);
    const [logsOpen, setLogsOpen] = useState(false);
    
    const logsEndRef = useRef(null);

    // Simulated Demo Mode Timeline
    useEffect(() => {
        // Auto-start demo after 1s
        const timer = setTimeout(() => {
            startDemo();
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const startDemo = async () => {
        setPipelineState('running');
        setActiveStageIdx(0);
        setMetrics([0, 0, 0, 0]);
        setLogs([LOGS_MOCK[0]]);
        
        const delay = (ms) => new Promise(res => setTimeout(res, ms));

        // Stage 1: People
        await delay(1000);
        setLogs(prev => [...prev, LOGS_MOCK[1]]);
        await delay(1500);
        setMetrics([1240, 0, 0, 0]);
        setLogs(prev => [...prev, LOGS_MOCK[2]]);
        await delay(800);
        
        // Stage 2: Company
        setActiveStageIdx(1);
        setLogs(prev => [...prev, LOGS_MOCK[3]]);
        await delay(1800);
        setMetrics([1240, 312, 0, 0]);
        setLogs(prev => [...prev, LOGS_MOCK[4]]);
        await delay(800);

        // Stage 3: Jobs
        setActiveStageIdx(2);
        setLogs(prev => [...prev, LOGS_MOCK[5]]);
        await delay(2000);
        setMetrics([1240, 312, 87, 0]);
        setLogs(prev => [...prev, LOGS_MOCK[6]]);
        await delay(800);

        // Stage 4: Scoring
        setActiveStageIdx(3);
        setLogs(prev => [...prev, LOGS_MOCK[7]]);
        await delay(2500);
        setMetrics([1240, 312, 87, 64]);
        setLogs(prev => [...prev, LOGS_MOCK[8]]);
        await delay(800);

        // Complete
        setActiveStageIdx(4); // All done
        setLogs(prev => [...prev, LOGS_MOCK[9], LOGS_MOCK[10]]);
        setPipelineState('completed');
    };

    useEffect(() => {
        if (logsEndRef.current && logsOpen) {
            logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [logs, logsOpen]);

    const getStageStatus = (idx) => {
        if (pipelineState === 'idle') return 'pending';
        if (pipelineState === 'completed') return 'completed';
        if (idx < activeStageIdx) return 'completed';
        if (idx === activeStageIdx) return 'active';
        return 'pending';
    };

    const metricLabels = ['leads', 'companies', 'jobs', 'scored'];

    return (
        <div className="w-full max-w-6xl mx-auto font-sans relative">
            {/* Outer Container */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-[24px] sm:rounded-[28px] p-6 sm:p-10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden"
            >
                {/* Subtle Grid Background */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/5 rounded-full blur-[100px] pointer-events-none"></div>

                {/* Header Row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 relative z-10 gap-4">
                    <div>
                        <h3 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">SimpLeads Pipeline</h3>
                        <p className="text-slate-500 font-medium">Live lead generation workflow</p>
                    </div>
                    
                    {/* Status Pill */}
                    <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm relative overflow-hidden">
                        {pipelineState === 'running' && (
                            <motion.div 
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50/50 to-transparent"
                                animate={{ x: ['-100%', '200%'] }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                            />
                        )}
                        <span className="relative flex h-2.5 w-2.5">
                            {pipelineState === 'running' && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>}
                            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                                pipelineState === 'idle' ? 'bg-slate-300' :
                                pipelineState === 'running' ? 'bg-blue-500' :
                                pipelineState === 'completed' ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}></span>
                        </span>
                        <span className="text-sm font-bold text-slate-700 capitalize relative z-10">
                            {pipelineState}
                        </span>
                    </div>
                </div>

                {/* Pipeline Nodes Layout */}
                <div className="flex flex-col md:flex-row items-stretch justify-between relative z-10 w-full mb-8">
                    {STAGES.map((stage, idx) => {
                        const status = getStageStatus(idx);
                        const colors = getColorClasses(stage.color, status);
                        const Icon = stage.icon;
                        const isLast = idx === STAGES.length - 1;
                        
                        return (
                            <React.Fragment key={stage.id}>
                                <motion.div 
                                    initial={{ opacity: 0, y: 12, scale: 0.95 }}
                                    animate={{ opacity: 1, y: status === 'active' ? -4 : 0, scale: 1 }}
                                    transition={{ duration: 0.4, delay: idx * 0.15 }}
                                    className={`relative flex-1 bg-white rounded-[20px] border p-5 transition-all duration-500 flex flex-col justify-between
                                        ${status === 'active' ? 'border-blue-400 shadow-[0_12px_24px_-8px_rgba(59,130,246,0.2)]' : 
                                          status === 'completed' ? 'border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1' : 'border-slate-200 shadow-sm opacity-80'}
                                    `}
                                >
                                    <div>
                                        {/* Top Row: Icon & Status Badge */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="relative">
                                                {/* Pulse Ring when active */}
                                                {status === 'active' && (
                                                    <motion.div 
                                                        className={`absolute inset-0 rounded-xl border-2 ${colors.activeRing}`}
                                                        initial={{ scale: 1, opacity: 0.8 }}
                                                        animate={{ scale: 1.6, opacity: 0 }}
                                                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                                                    />
                                                )}
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center relative z-10 transition-colors duration-300 ${colors.bg}`}>
                                                    <Icon className={`w-5 h-5 ${colors.text}`} />
                                                </div>
                                            </div>
                                            
                                            {/* Corner Status Indicator */}
                                            <div className="h-6 flex items-center justify-center">
                                                <AnimatePresence mode="wait">
                                                    {status === 'active' && (
                                                        <motion.div key="loader" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }}>
                                                            <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                                                        </motion.div>
                                                    )}
                                                    {status === 'completed' && (
                                                        <motion.div key="check" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                                                            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                                                                <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                        
                                        {/* Content */}
                                        <h4 className="font-semibold text-slate-900 tracking-tight mb-1">{stage.label}</h4>
                                        <p className="text-[13px] text-slate-500 truncate leading-tight mb-6">{stage.description}</p>
                                    </div>

                                    {/* Footer Metric */}
                                    <div>
                                        <div className="flex items-end gap-1 mb-3">
                                            <span className="text-xl font-bold text-slate-900 leading-none">
                                                {status === 'pending' ? '0' : <AnimatedCounter value={metrics[idx]} />}
                                            </span>
                                            <span className="text-xs text-slate-500 font-medium pb-0.5">{metricLabels[idx]}</span>
                                        </div>
                                        
                                        {/* Progress Bar */}
                                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden relative">
                                            <motion.div 
                                                className={`absolute top-0 left-0 h-full rounded-full ${
                                                    status === 'completed' ? 'bg-emerald-500' : 
                                                    status === 'failed' ? 'bg-rose-500' : 'bg-blue-500'
                                                }`}
                                                initial={{ width: '0%' }}
                                                animate={{ 
                                                    width: status === 'completed' ? '100%' : 
                                                           status === 'active' ? '40%' : '0%' 
                                                }}
                                                transition={{ duration: 0.8 }}
                                            />
                                            {status === 'active' && (
                                                <motion.div 
                                                    className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
                                                    initial={{ x: '-100%' }}
                                                    animate={{ x: '100%' }}
                                                    transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Connector */}
                                {!isLast && (
                                    <>
                                        <Connector status={getStageStatus(idx + 1) === 'pending' && status === 'active' ? 'active' : status} />
                                        <VerticalConnector status={getStageStatus(idx + 1) === 'pending' && status === 'active' ? 'active' : status} />
                                    </>
                                )}
                            </React.Fragment>
                        );
                    })}

                    {/* Final Export Chip */}
                    <div className="hidden md:flex items-center justify-center relative min-w-[30px] h-[200px] z-0 px-2">
                         <Connector status={pipelineState === 'completed' ? 'completed' : 'pending'} />
                    </div>
                    <div className="md:hidden flex justify-center py-2 h-10 relative z-0">
                         <VerticalConnector status={pipelineState === 'completed' ? 'completed' : 'pending'} />
                    </div>
                    
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8 }}
                        className={`md:w-32 flex flex-col items-center justify-center rounded-[20px] border p-4 transition-all duration-500
                            ${pipelineState === 'completed' ? 'bg-gradient-to-br from-indigo-50 to-purple-50 border-purple-200 shadow-md' : 'bg-slate-50 border-slate-200 border-dashed opacity-60'}
                        `}
                    >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${pipelineState === 'completed' ? 'bg-purple-100 text-purple-600' : 'bg-slate-200 text-slate-400'}`}>
                            <DownloadCloud className="w-5 h-5" />
                        </div>
                        <span className={`text-sm font-bold text-center ${pipelineState === 'completed' ? 'text-purple-700' : 'text-slate-400'}`}>Export Ready</span>
                        {pipelineState === 'completed' && (
                            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] text-purple-500 font-medium mt-1 uppercase tracking-wider">
                                CSV / API
                            </motion.span>
                        )}
                    </motion.div>
                </div>

                {/* Collapsible Live Log */}
                <div className="relative z-10 mt-6 border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
                    <button 
                        onClick={() => setLogsOpen(!logsOpen)}
                        className="w-full flex items-center justify-between px-4 py-3 bg-white/50 hover:bg-white text-sm font-medium text-slate-600 transition-colors"
                    >
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                            View Live Logs
                        </span>
                        {logsOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </button>
                    
                    <AnimatePresence>
                        {logsOpen && (
                            <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="border-t border-slate-200 bg-[#0A0A0A] text-slate-300 font-mono text-[13px] p-4 max-h-[160px] overflow-y-auto"
                            >
                                {logs.map((log, i) => (
                                    <div key={i} className="mb-1.5 flex gap-3">
                                        <span className="text-slate-500 select-none">[{new Date().toISOString().substring(11, 19)}]</span>
                                        <span className={log.includes('complete') || log.includes('ready') ? 'text-emerald-400' : 'text-slate-300'}>{log}</span>
                                    </div>
                                ))}
                                {pipelineState === 'running' && (
                                    <div className="flex gap-3 text-slate-500">
                                        <span>[{new Date().toISOString().substring(11, 19)}]</span>
                                        <span className="animate-pulse">_</span>
                                    </div>
                                )}
                                <div ref={logsEndRef} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Demo Replay Button (Dev Only visually) */}
                <button 
                    onClick={startDemo} 
                    disabled={pipelineState === 'running'}
                    className="absolute top-8 right-8 md:top-auto md:bottom-8 md:right-8 text-xs font-bold text-slate-400 hover:text-blue-500 transition-colors disabled:opacity-50"
                >
                    Replay Demo
                </button>
            </motion.div>
        </div>
    );
}
