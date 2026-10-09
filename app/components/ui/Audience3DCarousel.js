"use client";

import React, { useState, useEffect, useRef, Suspense, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Target, Briefcase, MapPin, Search, Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';
import dynamic from 'next/dynamic';

const Scene = dynamic(() => import('./Audience3DScene'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-slate-50/50">
            <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-[#023dbb] animate-spin"></div>
        </div>
    )
});

const AUDIENCES = [
    {
        id: 'sales',
        title: 'Sales & GTM Teams',
        description: 'Define target people and companies, add business context, identify relevant signals and prioritize prospects before outreach.',
        icon: Target,
        shape: 'roundedTorus',
        color: '#3b82f6' // blue
    },
    {
        id: 'agencies',
        title: 'Lead Gen & Agencies',
        description: 'Build targeted prospect datasets for different clients and use multiple discovery sources without manually combining every result.',
        icon: Briefcase,
        shape: 'sphereWithRing',
        color: '#8b5cf6', // purple
        glass: true
    },
    {
        id: 'local',
        title: 'Local & Service',
        description: 'Use Google Maps Search and other discovery workflows to identify relevant local businesses targeting specific locations.',
        icon: MapPin,
        shape: 'roundedBox',
        color: '#06b6d4' // cyan
    },
    {
        id: 'recruiters',
        title: 'Recruiters & Staffing',
        description: 'Use People Search and Active Job Signals for business-development prospecting. Job activity is treated as a signal, not guaranteed demand.',
        icon: Search,
        shape: 'capsule',
        color: '#10b981' // emerald
    },
    {
        id: 'founders',
        title: 'Founders & Small Teams',
        description: 'Research accounts, find relevant contacts, qualify opportunities and export only the information needed for the next action.',
        icon: Sparkles,
        shape: 'pill',
        color: '#f59e0b', // amber
        glass: true
    }
];

export default function Audience3DCarousel() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isWebGLAvailable, setIsWebGLAvailable] = useState(true);
    const prefersReducedMotion = useReducedMotion();

    useEffect(() => {
        // Simple WebGL feature detect
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (!gl) setIsWebGLAvailable(false);
        } catch (e) {
            setIsWebGLAvailable(false);
        }
    }, []);

    const activeAudience = AUDIENCES[activeIndex];

    const next = () => setActiveIndex((curr) => (curr + 1) % AUDIENCES.length);
    const prev = () => setActiveIndex((curr) => (curr - 1 + AUDIENCES.length) % AUDIENCES.length);

    // Keyboard navigation
    const handleKeyDown = (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            next();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            prev();
        }
    };

    // Fallback UI if WebGL fails
    if (!isWebGLAvailable) {
        return (
            <section className="max-w-7xl mx-auto px-6 mb-32 fade-up">
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-slate-100 text-slate-600 font-semibold text-sm mb-4">Who it's for</span>
                    <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-slate-900">Who SimpLeads Is Built For</h2>
                    <p className="text-xl text-slate-500 max-w-3xl mx-auto">Built for teams that need more than a raw contact database.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {AUDIENCES.map((aud, i) => (
                        <div key={i} className={`bg-white border border-slate-200 rounded-3xl p-8 shadow-sm ${i === 4 ? 'md:col-span-2' : ''}`}>
                            <div className="w-12 h-12 rounded-full flex items-center justify-center mb-6 bg-slate-50 border border-slate-100">
                                <aud.icon className="w-6 h-6 text-[#023dbb]" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{aud.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed">{aud.description}</p>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 mb-32 relative fade-up">
            {/* Header */}
            <div className="text-center mb-12 relative z-10 pointer-events-none">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200/50 shadow-sm mb-6 text-sm font-semibold text-slate-600">
                    <Sparkles className="w-4 h-4 text-[#023dbb]" /> Who it's for
                </div>
                <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-slate-900 tracking-tight">
                    Who SimpLeads Is Built For
                </h2>
                <p className="text-xl text-slate-500 max-w-3xl mx-auto font-medium">
                    Built for teams that need more than a raw contact database.
                </p>
            </div>

            {/* Layout Container: Two columns */}
            <div 
                className="w-full bg-white border border-slate-200 rounded-[32px] sm:rounded-[40px] shadow-sm overflow-hidden flex flex-col lg:flex-row h-auto lg:h-[640px]"
                tabIndex={0}
                onKeyDown={handleKeyDown}
                role="region"
                aria-label="3D Audience Carousel"
            >
                
                {/* Left Column (40%): HTML Only */}
                <div className="w-full lg:w-[40%] flex flex-col justify-center p-8 md:p-12 z-20 border-b lg:border-b-0 lg:border-r border-slate-100 bg-slate-50/30">
                    
                    {/* Number Indicator */}
                    <div className="flex items-center gap-3 mb-8">
                        <span className="text-sm font-bold text-[#023dbb] bg-blue-50/80 px-3 py-1.5 rounded-full">
                            {String(activeIndex + 1).padStart(2, '0')} <span className="text-blue-300">/ 05</span>
                        </span>
                        <div className="flex gap-1.5" role="tablist" aria-label="Audience Selector">
                            {AUDIENCES.map((_, idx) => (
                                <button
                                    key={idx}
                                    role="tab"
                                    aria-selected={activeIndex === idx}
                                    onClick={() => setActiveIndex(idx)}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${activeIndex === idx ? 'w-8 bg-[#023dbb]' : 'w-1.5 bg-slate-300 hover:bg-slate-400'}`}
                                    aria-label={`Select audience ${idx + 1}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Text Content */}
                    <div className="h-[140px] md:h-[180px] relative" aria-live="polite">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeAudience.id}
                                initial={{ opacity: 0, x: -16 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 16 }}
                                transition={{ duration: 0.3, staggerChildren: 0.1 }}
                                className="absolute inset-0"
                            >
                                <h3 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4 tracking-tight leading-tight pr-4">
                                    {activeAudience.title}
                                </h3>
                                <p className="text-slate-500 text-sm md:text-base leading-relaxed pr-4">
                                    {activeAudience.description}
                                </p>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Navigation Arrows */}
                    <div className="flex gap-3 mt-4 md:mt-8">
                        <button 
                            onClick={prev}
                            className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50 hover:shadow-sm transition-all focus:ring-2 focus:ring-[#023dbb] outline-none"
                            aria-label="Previous audience"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={next}
                            className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50 hover:shadow-sm transition-all focus:ring-2 focus:ring-[#023dbb] outline-none"
                            aria-label="Next audience"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Right Column (60%): Canvas Only */}
                <div 
                    className="w-full lg:w-[60%] h-[420px] lg:h-full relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100/50"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {/* Scene wrapper */}
                    {isWebGLAvailable ? (
                        <div className="absolute inset-0 z-0">
                            <Scene 
                                audiences={AUDIENCES}
                                activeIndex={activeIndex}
                                setActiveIndex={setActiveIndex}
                                isHovered={isHovered}
                                prefersReducedMotion={prefersReducedMotion}
                            />
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-slate-400">
                            WebGL not available
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
