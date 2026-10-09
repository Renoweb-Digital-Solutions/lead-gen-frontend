"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Target, Briefcase, MapPin, Search, Sparkles, ArrowRight } from 'lucide-react';
import dynamic from 'next/dynamic';

const ShaderCanvas = dynamic(() => import('./AudienceShaderCanvas'), {
    ssr: false,
    loading: () => (
        <div className="absolute inset-0 bg-slate-100 animate-pulse"></div>
    )
});

const AUDIENCES = [
    {
        id: 'sales',
        title: 'Sales & GTM Teams',
        description: 'Define target people and companies, add business context, identify relevant signals and prioritize prospects before outreach.',
        icon: Target,
        palette: ['#eff6ff', '#bfdbfe', '#93c5fd'] // soft blue
    },
    {
        id: 'agencies',
        title: 'Lead Gen & Agencies',
        description: 'Build targeted prospect datasets for different clients and use multiple discovery sources without manually combining every result.',
        icon: Briefcase,
        palette: ['#f5f3ff', '#ddd6fe', '#c4b5fd'] // soft purple
    },
    {
        id: 'local',
        title: 'Local & Service',
        description: 'Use Google Maps Search and other discovery workflows to identify relevant local businesses targeting specific locations.',
        icon: MapPin,
        palette: ['#ecfeff', '#a5f3fc', '#67e8f9'] // soft cyan
    },
    {
        id: 'recruiters',
        title: 'Recruiters & Staffing',
        description: 'Use People Search and Active Job Signals for business-development prospecting. Job activity is treated as a signal, not guaranteed demand.',
        icon: Search,
        palette: ['#f0fdf4', '#bbf7d0', '#86efac'] // soft emerald
    },
    {
        id: 'founders',
        title: 'Founders & Small Teams',
        description: 'Research accounts, find relevant contacts, qualify opportunities and export only the information needed for the next action.',
        icon: Sparkles,
        palette: ['#fffbeb', '#fde68a', '#fcd34d'] // soft amber
    }
];

export default function AudienceShaderSection() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const prefersReducedMotion = useReducedMotion();
    
    // Auto-advance
    useEffect(() => {
        if (isHovered || prefersReducedMotion) return;
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % AUDIENCES.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [isHovered, prefersReducedMotion]);

    const activeAudience = AUDIENCES[activeIndex];
    
    const next = () => setActiveIndex((curr) => (curr + 1) % AUDIENCES.length);
    const prev = () => setActiveIndex((curr) => (curr - 1 + AUDIENCES.length) % AUDIENCES.length);

    // Keyboard navigation
    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            e.preventDefault();
            next();
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            e.preventDefault();
            prev();
        }
    };

    // CSS 3D Tilt Effect on Panel
    const panelRef = useRef(null);
    const [tiltStyle, setTiltStyle] = useState({ transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)' });
    const [glareStyle, setGlareStyle] = useState({ background: 'transparent' });

    const handlePanelMouseMove = (e) => {
        if (prefersReducedMotion || window.innerWidth < 640 || !panelRef.current) return;
        
        const rect = panelRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left; 
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Max tilt 4 degrees
        const tiltX = -((y - centerY) / centerY) * 4;
        const tiltY = ((x - centerX) / centerX) * 4;

        setTiltStyle({
            transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
            transition: 'transform 0.1s ease-out'
        });

        // Specular highlight following cursor
        setGlareStyle({
            background: `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.4) 0%, transparent 60%)`,
            transition: 'background 0.1s ease-out'
        });
    };

    const handlePanelMouseLeave = () => {
        setTiltStyle({
            transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
            transition: 'transform 0.5s ease'
        });
        setGlareStyle({ background: 'transparent', transition: 'background 0.5s ease' });
    };

    const ActiveIcon = activeAudience.icon;

    return (
        <section className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 mb-32 relative fade-up">
            {/* Header */}
            <div className="text-center mb-12 relative z-10 pointer-events-none">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200/50 shadow-sm mb-6 text-sm font-semibold text-slate-600">
                    <Sparkles className="w-4 h-4 text-[#023dbb]" /> Who it's for
                </div>
                <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-slate-900 tracking-tight drop-shadow-sm">
                    Who SimpLeads Is Built For
                </h2>
                <p className="text-xl text-slate-500 max-w-3xl mx-auto font-medium">
                    Built for teams that need more than a raw contact database.
                </p>
            </div>

            {/* Stage Container */}
            <div 
                className="relative w-full rounded-[28px] sm:rounded-[32px] overflow-hidden flex flex-col lg:flex-row min-h-[500px] lg:h-[600px] border border-slate-200 shadow-xl"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Background Shader Layer */}
                <ShaderCanvas palette={activeAudience.palette} />
                
                {/* Overlay Inner Shadow for depth */}
                <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_80px_rgba(0,0,0,0.03)] z-10"></div>

                {/* Content Layout */}
                <div className="relative z-20 w-full flex flex-col lg:flex-row h-full p-4 lg:p-12 gap-8 lg:gap-16 items-center">
                    
                    {/* Left Column: Typographic List */}
                    <div 
                        className="w-full lg:w-[45%] flex lg:flex-col overflow-x-auto lg:overflow-visible snap-x snap-mandatory hide-scrollbar pb-4 lg:pb-0"
                        role="tablist"
                        aria-label="Audience Selector"
                        onKeyDown={handleKeyDown}
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
                                    className={`relative flex-shrink-0 w-[240px] lg:w-full snap-start text-left group outline-none py-5 px-4 lg:px-6 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
                                >
                                    {/* Active Background Pill (Framer Motion) */}
                                    {isActive && (
                                        <motion.div 
                                            layoutId="active-audience-row"
                                            className="absolute inset-0 bg-white/40 backdrop-blur-sm border border-white/60 shadow-sm rounded-2xl z-0"
                                            initial={false}
                                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                        />
                                    )}

                                    {/* Content */}
                                    <div className="relative z-10 flex items-center justify-between">
                                        <div className="flex items-baseline gap-4">
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{String(idx + 1).padStart(2, '0')}</span>
                                            <h3 className={`text-xl lg:text-2xl font-display font-bold ${isActive ? 'text-slate-900' : 'text-slate-800'}`}>
                                                {aud.title}
                                            </h3>
                                        </div>
                                        <ArrowRight className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'translate-x-0 opacity-100 text-[#023dbb]' : '-translate-x-4 opacity-0'}`} />
                                    </div>
                                    
                                    {/* Divider for desktop */}
                                    <div className="hidden lg:block absolute bottom-0 left-6 right-6 h-[1px] bg-slate-900/10" />

                                    {/* Progress Line */}
                                    {isActive && (
                                        <div className="absolute bottom-0 left-6 right-6 h-[2px] overflow-hidden rounded-full">
                                            <motion.div 
                                                className="h-full bg-gradient-to-r from-[#023dbb] to-purple-500"
                                                initial={{ width: '0%' }}
                                                animate={{ width: isHovered ? 'var(--current-width)' : '100%' }}
                                                transition={{ duration: 6, ease: 'linear', repeat: isHovered ? 0 : Infinity }}
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

                    {/* Right Column: Frosted Glass Panel */}
                    <div className="w-full lg:w-[55%] h-[320px] lg:h-full flex items-center justify-center">
                        <div 
                            ref={panelRef}
                            onMouseMove={handlePanelMouseMove}
                            onMouseLeave={handlePanelMouseLeave}
                            style={{ ...tiltStyle, willChange: 'transform' }}
                            className="relative w-full max-w-lg bg-white/70 backdrop-blur-xl border border-white/50 rounded-3xl p-8 lg:p-12 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1),0_0_0_1px_rgba(255,255,255,0.4)_inset] flex flex-col justify-between h-[300px] lg:h-[400px] overflow-hidden"
                            aria-live="polite"
                        >
                            {/* Moving Glare Overlay */}
                            <div className="absolute inset-0 pointer-events-none mix-blend-overlay z-0" style={glareStyle}></div>
                            
                            {/* Inner soft glow */}
                            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_40px_rgba(255,255,255,1)] z-0 rounded-3xl"></div>

                            {/* Content */}
                            <div className="relative z-10 h-full flex flex-col">
                                <div className="flex justify-between items-start mb-6 lg:mb-10">
                                    <div className="w-14 h-14 rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center text-[#023dbb]">
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={activeAudience.id}
                                                initial={{ scale: 0.5, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0.5, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <ActiveIcon size={28} strokeWidth={2.5} />
                                            </motion.div>
                                        </AnimatePresence>
                                    </div>
                                    <span className="text-sm font-bold text-slate-500 bg-white/50 px-3 py-1 rounded-full shadow-sm border border-white/60">
                                        {String(activeIndex + 1).padStart(2, '0')} / 05
                                    </span>
                                </div>
                                
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeAudience.id}
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -16 }}
                                        transition={{ duration: 0.4, staggerChildren: 0.06 }}
                                    >
                                        <motion.h3 className="text-2xl lg:text-3xl font-display font-bold text-slate-900 mb-4 tracking-tight leading-tight drop-shadow-sm">
                                            {activeAudience.title}
                                        </motion.h3>
                                        <motion.p className="text-slate-600 text-sm lg:text-base leading-relaxed">
                                            {activeAudience.description}
                                        </motion.p>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <style jsx global>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </section>
    );
}
