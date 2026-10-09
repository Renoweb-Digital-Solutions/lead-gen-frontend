"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Target, Briefcase, MapPin, Search, Sparkles, ArrowRight, ArrowDown } from 'lucide-react';

const AUDIENCES = [
    {
        id: 'sales',
        title: 'Sales & GTM Teams',
        tag: 'SALES',
        description: 'Sales teams can define their target people and companies, add business context, identify relevant signals and prioritize prospects before outreach.',
        icon: Target,
        pipeline: { nodes: ['People Search', 'Company Context', 'Job Signals', 'Prioritized List'] },
        stats: [{ label: 'SOURCES', value: '04' }, { label: 'SIGNALS', value: 'ON' }, { label: 'EXPORT', value: 'CSV' }]
    },
    {
        id: 'agencies',
        title: 'Lead Generation & Marketing Agencies',
        tag: 'AGENCY',
        description: 'Agencies can build targeted prospect datasets for different clients and use multiple discovery sources without manually combining every result.',
        icon: Briefcase,
        pipeline: { nodes: ['Multiple Sources', 'Merge Data', 'Client Datasets'] },
        stats: [{ label: 'CLIENTS', value: 'MULTIPLE' }, { label: 'SOURCES', value: '05+' }, { label: 'EXPORT', value: 'API/CSV' }]
    },
    {
        id: 'local',
        title: 'Local & Service Businesses',
        tag: 'LOCAL',
        description: 'Businesses targeting specific locations can use Google Maps Search and other discovery workflows to identify relevant businesses.',
        icon: MapPin,
        pipeline: { nodes: ['Google Maps', 'Opportunity Score', 'Outreach List'] },
        stats: [{ label: 'GEO_RADIUS', value: 'CUSTOM' }, { label: 'AI_SUGGEST', value: 'ON' }, { label: 'EXPORT', value: 'CSV' }]
    },
    {
        id: 'recruiters',
        title: 'Recruiters & Staffing Teams',
        tag: 'RECRUIT',
        description: 'Staffing teams can use People Search and Active Job Signals for business-development prospecting. Job activity is treated as a signal, not as guaranteed evidence of staffing demand.',
        icon: Search,
        pipeline: { nodes: ['People Search', 'Job Signals', 'BD Prospects'] },
        stats: [{ label: 'JOB_SIGNALS', value: 'ACTIVE' }, { label: 'TRACKING', value: 'REALTIME' }, { label: 'EXPORT', value: 'ATS' }]
    },
    {
        id: 'founders',
        title: 'Founders & Small Teams',
        tag: 'FOUNDER',
        description: 'Founders can research accounts, find relevant contacts, qualify opportunities and export only the information needed for their next action.',
        icon: Sparkles,
        pipeline: { nodes: ['Contacts', 'Qualify', 'Export'] },
        stats: [{ label: 'SAAS_STACK', value: '01' }, { label: 'QUALIFY', value: 'AI' }, { label: 'COST', value: 'LOW' }]
    }
];

// Typewriter Effect Component
const Typewriter = ({ text, active, speed = 12 }) => {
    const [displayed, setDisplayed] = useState('');
    const prefersReducedMotion = useReducedMotion();
    
    useEffect(() => {
        if (!active) return;
        if (prefersReducedMotion) {
            setDisplayed(text);
            return;
        }
        
        setDisplayed('');
        let i = 0;
        const interval = setInterval(() => {
            if (i < text.length - 1) {
                setDisplayed(prev => prev + text[i]);
                i++;
            } else {
                setDisplayed(text);
                clearInterval(interval);
            }
        }, speed);
        
        return () => clearInterval(interval);
    }, [text, active, speed, prefersReducedMotion]);

    if (!active) return null;
    return (
        <p className="text-slate-400 text-sm md:text-base leading-relaxed h-[80px] sm:h-[60px]">
            {displayed}
            {!prefersReducedMotion && displayed.length < text.length && (
                <span className="inline-block w-1.5 h-4 ml-1 bg-blue-500 animate-pulse align-middle"></span>
            )}
        </p>
    );
};

// Animated Node Schematic
const PipelineSchematic = ({ nodes, active }) => {
    const prefersReducedMotion = useReducedMotion();
    if (!active) return null;

    return (
        <div 
            className="flex flex-col sm:flex-row items-center w-full mt-8 mb-8"
            aria-label={`Pipeline: ${nodes.join(' to ')}`}
        >
            {nodes.map((node, i) => (
                <React.Fragment key={i}>
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: prefersReducedMotion ? 0 : i * 0.1, duration: 0.3 }}
                        className="relative flex items-center justify-center h-10 px-4 bg-slate-800/80 border border-slate-700/50 rounded-md shadow-sm z-10 shrink-0"
                    >
                        <span className="font-mono text-[10px] text-slate-300 uppercase tracking-widest">{node}</span>
                    </motion.div>
                    
                    {i < nodes.length - 1 && (
                        <div className="flex-1 w-[2px] h-6 sm:w-8 sm:h-[2px] bg-slate-800 relative z-0 shrink-0 mx-2 sm:mx-0 my-2 sm:my-0">
                            {!prefersReducedMotion && (
                                <div className="absolute inset-0 overflow-hidden">
                                    <motion.div 
                                        initial={{ x: '-100%', y: '-100%' }}
                                        animate={{ x: '100%', y: '100%' }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay: i * 0.2 }}
                                        className="hidden sm:block absolute top-0 left-0 w-1/2 h-full bg-blue-500 shadow-[0_0_8px_#3b82f6]"
                                    />
                                    <motion.div 
                                        initial={{ y: '-100%' }}
                                        animate={{ y: '100%' }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay: i * 0.2 }}
                                        className="sm:hidden block absolute top-0 left-0 w-full h-1/2 bg-blue-500 shadow-[0_0_8px_#3b82f6]"
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

export default function AudienceConsoleSection() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isOffscreen, setIsOffscreen] = useState(false);
    const sectionRef = useRef(null);
    const containerRef = useRef(null);
    const prefersReducedMotion = useReducedMotion();

    const activeAudience = AUDIENCES[activeIndex];

    // Intersection Observer
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            setIsOffscreen(!entry.isIntersecting);
        }, { threshold: 0.1 });
        
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    // Pointer Spotlight
    useEffect(() => {
        if (prefersReducedMotion || !containerRef.current) return;
        
        const handlePointerMove = (e) => {
            if (!containerRef.current || isOffscreen) return;
            const rect = containerRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            containerRef.current.style.setProperty('--mouse-x', `${x}px`);
            containerRef.current.style.setProperty('--mouse-y', `${y}px`);
        };

        const container = containerRef.current;
        container.addEventListener('pointermove', handlePointerMove);
        return () => container.removeEventListener('pointermove', handlePointerMove);
    }, [isOffscreen, prefersReducedMotion]);

    // Auto-advance
    useEffect(() => {
        if (isHovered || isOffscreen || prefersReducedMotion) return;
        
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % AUDIENCES.length);
        }, 7000);
        return () => clearInterval(interval);
    }, [isHovered, isOffscreen, prefersReducedMotion]);

    const next = () => setActiveIndex((curr) => (curr + 1) % AUDIENCES.length);
    const prev = () => setActiveIndex((curr) => (curr - 1 + AUDIENCES.length) % AUDIENCES.length);

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') { e.preventDefault(); next(); } 
        else if (e.key === 'ArrowUp') { e.preventDefault(); prev(); }
    };

    return (
        <section ref={sectionRef} className="w-full max-w-7xl mx-auto px-4 sm:px-6 mb-32 fade-up relative z-10">
            {/* Standard Page Heading to match style */}
            <div className="text-center mb-12">
                <span className="inline-block px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 font-semibold text-sm mb-4 border border-slate-200">
                    Who it's for
                </span>
                <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-slate-900 tracking-tight">
                    Who SimpLeads Is Built For
                </h2>
                <p className="text-xl text-slate-500 max-w-3xl mx-auto font-medium">
                    Built for teams that need more than a raw contact database.
                </p>
            </div>

            {/* Product Console Container */}
            <div 
                ref={containerRef}
                className="relative w-full rounded-3xl overflow-hidden flex flex-col lg:flex-row h-auto lg:h-[540px] bg-[#0A0D14] border border-slate-800 shadow-2xl group"
                tabIndex={0}
                onKeyDown={handleKeyDown}
                role="region"
                aria-label="Workflow Console"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    '--mouse-x': '50%',
                    '--mouse-y': '50%',
                }}
            >
                {/* Background Effects */}
                <div className="absolute inset-0 pointer-events-none">
                    {/* Spotlight (Mouse Reactive) */}
                    <div className="hidden lg:block absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                         style={{
                             background: 'radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(59, 130, 246, 0.05), transparent 40%)'
                         }}
                    />
                    
                    {/* Grid Lines */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)]"></div>
                    
                    {/* Dot Matrix */}
                    <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:16px_16px] [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]"></div>
                    
                    {/* Scanline */}
                    {!prefersReducedMotion && (
                        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent animate-[scan_8s_linear_infinite]" />
                    )}

                    {/* Corner Crop Marks */}
                    <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-slate-700"></div>
                    <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-slate-700"></div>
                    <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-slate-700"></div>
                    <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-slate-700"></div>
                    
                    {/* Metadata Labels */}
                    <div className="hidden sm:block absolute top-4 left-10 font-mono text-[9px] text-slate-500 tracking-widest">SYS.AUDIENCE / 05 PROFILES</div>
                    <div className="hidden sm:block absolute top-4 right-10 font-mono text-[9px] text-slate-500 tracking-widest">v2.4_BETA</div>
                </div>

                {/* Left Pane (38%) */}
                <div className="relative z-10 w-full lg:w-[38%] border-b lg:border-b-0 lg:border-r border-slate-800/80 flex flex-col p-6 sm:p-8">
                    <div className="font-mono text-xs text-slate-500 mb-6 flex items-center gap-2 tracking-widest uppercase">
                        <div className="w-1.5 h-1.5 bg-slate-700 rounded-full"></div> Target Profiles
                    </div>
                    
                    <div 
                        className="flex lg:flex-col overflow-x-auto lg:overflow-visible snap-x snap-mandatory hide-scrollbar flex-1 -mx-6 px-6 lg:mx-0 lg:px-0 gap-2"
                        role="tablist"
                    >
                        {AUDIENCES.map((aud, idx) => {
                            const isActive = activeIndex === idx;
                            return (
                                <button
                                    key={aud.id}
                                    role="tab"
                                    aria-selected={isActive}
                                    tabIndex={isActive ? 0 : -1}
                                    onClick={() => setActiveIndex(idx)}
                                    className={`relative flex-shrink-0 w-[260px] lg:w-full snap-start text-left group outline-none py-4 px-4 transition-all duration-200 border border-transparent rounded-lg ${isActive ? 'bg-blue-500/5' : 'hover:bg-slate-800/30'}`}
                                >
                                    {/* Active Left Border / Selection */}
                                    {isActive && (
                                        <motion.div 
                                            layoutId="active-console-row"
                                            className="absolute left-0 top-0 bottom-0 w-[2px] bg-blue-500 rounded-r-full"
                                            initial={false}
                                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                        />
                                    )}

                                    <div className="flex items-center gap-4">
                                        <span className={`font-mono text-xs w-6 transition-colors ${isActive ? 'text-blue-400' : 'text-slate-600 group-hover:text-slate-400'}`}>
                                            {String(idx + 1).padStart(2, '0')}
                                        </span>
                                        <h3 className={`flex-1 font-sans text-sm font-semibold tracking-tight transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                                            {aud.title}
                                        </h3>
                                        <span className={`hidden sm:block font-mono text-[9px] px-1.5 py-0.5 rounded transition-colors ${isActive ? 'bg-blue-500/20 text-blue-300' : 'bg-slate-800/50 text-slate-500'}`}>
                                            {aud.tag}
                                        </span>
                                    </div>

                                    {/* Auto-advance progress line */}
                                    {isActive && (
                                        <div className="absolute bottom-0 left-4 right-4 h-[1px] bg-slate-800 overflow-hidden">
                                            <motion.div 
                                                className="h-full bg-blue-500"
                                                initial={{ width: '0%' }}
                                                animate={{ width: isHovered ? 'var(--current-width)' : '100%' }}
                                                transition={{ duration: 7, ease: 'linear', repeat: isHovered ? 0 : Infinity }}
                                                onUpdate={(latest) => {
                                                    if (!isHovered) {
                                                        document.documentElement.style.setProperty('--current-width', latest.width);
                                                    }
                                                }}
                                            />
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Keyboard Shortcuts Hint */}
                    <div className="hidden lg:flex items-center gap-3 mt-6 pt-6 border-t border-slate-800/50">
                        <span className="font-mono text-[10px] text-slate-500 tracking-wider">NAVIGATE</span>
                        <div className="flex gap-1">
                            <span className="w-5 h-5 flex items-center justify-center rounded bg-slate-800 text-slate-400 font-mono text-xs border border-slate-700 shadow-sm">↑</span>
                            <span className="w-5 h-5 flex items-center justify-center rounded bg-slate-800 text-slate-400 font-mono text-xs border border-slate-700 shadow-sm">↓</span>
                        </div>
                    </div>
                </div>

                {/* Right Pane (62%) */}
                <div className="relative z-10 w-full lg:w-[62%] bg-[#0f141f]/50 backdrop-blur-sm p-6 sm:p-10 flex flex-col justify-center" aria-live="polite">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeAudience.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.25, ease: 'easeOut', staggerChildren: 0.05 }}
                            className="flex flex-col h-full justify-between max-w-lg mx-auto w-full"
                        >
                            {/* Header Strip */}
                            <motion.div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-800/80">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded bg-[#151b28] border border-slate-700/80 flex items-center justify-center text-blue-400 shadow-inner">
                                        <activeAudience.icon size={20} strokeWidth={2} />
                                    </div>
                                    <div>
                                        <div className="font-mono text-[10px] text-slate-500 mb-1">{activeAudience.tag}_CONFIG</div>
                                        <div className="font-sans font-semibold text-white tracking-tight">{activeAudience.title}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 bg-[#151b28] px-3 py-1.5 rounded-full border border-slate-800">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></div>
                                    <span className="font-mono text-[10px] text-emerald-400 tracking-wider">CONFIGURED</span>
                                </div>
                            </motion.div>

                            {/* Description (Typewriter) */}
                            <motion.div className="mb-8">
                                <Typewriter text={activeAudience.description} active={activeIndex === AUDIENCES.findIndex(a => a.id === activeAudience.id)} />
                            </motion.div>

                            {/* Schematic */}
                            <motion.div className="mb-10 w-full overflow-x-auto hide-scrollbar">
                                <PipelineSchematic nodes={activeAudience.pipeline.nodes} active={true} />
                            </motion.div>

                            {/* Status Readouts */}
                            <motion.div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-6 border-t border-slate-800/80">
                                {activeAudience.stats.map((stat, i) => (
                                    <div key={i} className="flex flex-col gap-1">
                                        <span className="font-mono text-[10px] text-slate-500 tracking-widest">{stat.label}</span>
                                        <span className="font-mono text-sm text-slate-300 tabular-nums">{stat.value}</span>
                                    </div>
                                ))}
                            </motion.div>

                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            <style jsx global>{`
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                @keyframes scan {
                    0% { transform: translateY(-100px); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { transform: translateY(640px); opacity: 0; }
                }
            `}</style>
        </section>
    );
}
