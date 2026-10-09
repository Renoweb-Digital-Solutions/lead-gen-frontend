"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { MapPin, List, PlaySquare, Search, Target, ArrowRight, Sparkles, Mail, Phone, Users, Building, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const TOOLS = [
    {
        id: 'google-maps',
        name: 'Google Maps Search',
        shortDescription: 'Local businesses & AI suggestions',
        fullDescription: 'Discover local businesses using keywords, locations and AI-assisted keyword suggestions.',
        icon: MapPin,
        href: '/tools/google-maps'
    },
    {
        id: 'b2b-directory',
        name: 'B2B Directory Scraper',
        shortDescription: 'Search supported business directories',
        fullDescription: 'Search supported directories like Yellow Pages (US) and IndiaMART (B2B).',
        icon: List,
        href: '/tools/b2b-directory'
    },
    {
        id: 'youtube',
        name: 'YouTube Lead Scraper',
        shortDescription: 'Discover leads from relevant searches',
        fullDescription: 'Discover leads, available emails and social links from relevant YouTube searches.',
        icon: PlaySquare,
        href: '/tools/youtube'
    },
    {
        id: 'instagram',
        name: 'Instagram Lead Scraper',
        shortDescription: 'Supported follower/commenter workflows',
        fullDescription: 'Discover leads through supported follower and commenter-based workflows.',
        icon: Search,
        href: '/tools/instagram'
    },
    {
        id: 'investor',
        name: 'Investor Data Pipeline',
        shortDescription: 'Discover potentially relevant investors',
        fullDescription: 'Discover relevant investors using description, industry, stage, and audience.',
        icon: Target,
        href: '/tools/investor'
    }
];

// Previews
const GoogleMapsPreview = () => (
    <div className="relative w-full h-full min-h-[280px] sm:min-h-[320px] rounded-[24px] bg-[#f8fafc] border border-slate-200 shadow-inner overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="absolute w-[2px] h-full bg-slate-200 left-1/3 skew-x-12"></div>
        <div className="absolute h-[2px] w-full bg-slate-200 top-1/2 -skew-y-6"></div>
        
        {/* Floating Chip */}
        <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="absolute top-6 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md border border-slate-200 shadow-lg px-4 py-2 rounded-full flex items-center gap-2 z-20"
        >
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            <span className="text-xs font-bold text-slate-700">Dentists · California · 142 found</span>
        </motion.div>

        {/* Pins */}
        {[
            { top: '30%', left: '25%' }, { top: '60%', left: '40%' }, { top: '20%', left: '60%' },
            { top: '70%', left: '75%' }, { top: '45%', left: '80%' }, { top: '40%', left: '50%', active: true }
        ].map((pin, i) => (
            <motion.div
                key={i}
                initial={{ y: -20, opacity: 0, scale: 0.5 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ type: 'spring', bounce: 0.5, delay: i * 0.1 }}
                className="absolute z-10"
                style={{ top: pin.top, left: pin.left }}
            >
                {pin.active && (
                    <motion.div 
                        initial={{ scale: 0.5, opacity: 0.8 }}
                        animate={{ scale: 2.5, opacity: 0 }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute inset-0 bg-blue-500 rounded-full"
                    />
                )}
                <MapPin className={`relative w-8 h-8 -ml-4 -mt-8 drop-shadow-md ${pin.active ? 'text-blue-600 fill-blue-100' : 'text-slate-400 fill-white'}`} />
            </motion.div>
        ))}
    </div>
);

const B2BDirectoryPreview = () => (
    <div className="relative w-full h-full min-h-[280px] sm:min-h-[320px] rounded-[24px] bg-white border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="flex items-center gap-4 px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <div className="w-4 h-4 rounded-sm bg-slate-200"></div>
            <div className="h-4 w-24 bg-slate-200 rounded-md"></div>
            <div className="h-4 w-16 bg-slate-200 rounded-md ml-auto"></div>
        </div>
        <div className="flex-1 relative">
            <motion.div 
                className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-blue-50/50 to-transparent border-t-2 border-blue-400 z-10"
                animate={{ top: ['0%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />
            {[1, 2, 3, 4, 5].map((row, i) => (
                <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.15 }}
                    className="flex items-center gap-4 px-6 py-4 border-b border-slate-50 relative"
                >
                    <Building className="w-5 h-5 text-slate-300" />
                    <div className="space-y-2 flex-1">
                        <div className="h-3.5 bg-slate-200 rounded-md" style={{ width: `${Math.random() * 40 + 30}%` }}></div>
                        <div className="h-2.5 bg-slate-100 rounded-md" style={{ width: `${Math.random() * 30 + 20}%` }}></div>
                    </div>
                    <div className="flex gap-2">
                        <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center"><Phone className="w-3 h-3 text-green-500" /></div>
                        <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center"><Mail className="w-3 h-3 text-blue-500" /></div>
                    </div>
                </motion.div>
            ))}
        </div>
    </div>
);

const YouTubePreview = () => {
    const prefersReducedMotion = useReducedMotion();
    return (
        <div className="relative w-full h-full min-h-[280px] sm:min-h-[320px] rounded-[24px] bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 shadow-xl overflow-hidden flex flex-col items-center justify-center gap-4 p-6">
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-[80px]"></div>
            
            <motion.div 
                className="absolute top-4 left-4"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <div className="bg-red-500/20 text-red-400 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-widest flex items-center gap-1.5 border border-red-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Live Search
                </div>
            </motion.div>

            {[
                { name: 'Tech Insider', subs: '1.2M', delay: 0 },
                { name: 'B2B Growth', subs: '840K', delay: 0.2 },
                { name: 'SaaS Weekly', subs: '250K', delay: 0.4 }
            ].map((channel, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                        opacity: 1, 
                        y: prefersReducedMotion ? 0 : [0, -6, 0] 
                    }}
                    transition={{ 
                        opacity: { delay: channel.delay },
                        y: { duration: 4, repeat: Infinity, delay: channel.delay, ease: "easeInOut" }
                    }}
                    className="w-full max-w-sm bg-white/10 backdrop-blur-md border border-white/10 p-3 rounded-2xl flex items-center gap-4 shadow-lg"
                >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-red-400 to-pink-500 flex items-center justify-center shrink-0 shadow-inner">
                        <PlaySquare className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-bold text-white text-sm">{channel.name}</h4>
                        <p className="text-xs text-slate-400">{channel.subs} subscribers</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                        <Mail className="w-4 h-4 text-slate-300" />
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

const InstagramPreview = () => {
    const prefersReducedMotion = useReducedMotion();
    return (
        <div className="relative w-full h-full min-h-[280px] sm:min-h-[320px] rounded-[24px] bg-gradient-to-br from-fuchsia-50 to-orange-50 border border-slate-200 shadow-sm overflow-hidden flex items-center justify-center">
            
            <div className="relative w-48 h-48 flex items-center justify-center">
                {/* Central Avatar */}
                <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[3px] z-20 shadow-xl"
                >
                    <div className="w-full h-full bg-white rounded-full border-2 border-white flex items-center justify-center overflow-hidden">
                        <Users className="w-8 h-8 text-pink-500" />
                    </div>
                </motion.div>

                {/* Orbiting avatars */}
                {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                    <motion.div
                        key={i}
                        className="absolute top-1/2 left-1/2 -mt-5 -ml-5 w-10 h-10 origin-[50px_50px]"
                        initial={{ rotate: deg, opacity: 0, scale: 0 }}
                        animate={{ 
                            rotate: prefersReducedMotion ? deg : deg + 360, 
                            opacity: 1, 
                            scale: 1 
                        }}
                        transition={{ 
                            opacity: { delay: i * 0.1 },
                            scale: { delay: i * 0.1, type: 'spring' },
                            rotate: { duration: 20, repeat: Infinity, ease: "linear" }
                        }}
                        style={{ transformOrigin: '50% 120px' }}
                    >
                        <div className="w-full h-full rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center relative group">
                            <div className="w-6 h-6 rounded-full bg-slate-100"></div>
                            {i % 2 === 0 && (
                                <motion.div 
                                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1 + i * 0.2, type: 'spring' }}
                                    className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center"
                                >
                                    <Mail className="w-2 h-2 text-white" />
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

const InvestorPreview = () => (
    <div className="relative w-full h-full min-h-[280px] sm:min-h-[320px] rounded-[24px] bg-[#050B14] border border-slate-800 shadow-xl overflow-hidden flex items-center justify-center p-6">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
        
        {/* Filter Chip */}
        <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute top-6 left-1/2 -translate-x-1/2 z-20"
        >
            <div className="bg-white/10 backdrop-blur-md border border-white/20 text-blue-300 text-xs font-bold px-4 py-2 rounded-full flex items-center gap-2 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                <Target className="w-3 h-3" /> Seed · Healthtech
            </div>
        </motion.div>

        {/* Concentric Rings */}
        <div className="absolute w-[300px] h-[300px] border border-blue-500/20 rounded-full"></div>
        <div className="absolute w-[200px] h-[200px] border border-blue-400/30 rounded-full"></div>
        <div className="absolute w-[100px] h-[100px] border border-blue-300/40 rounded-full"></div>
        <div className="absolute w-4 h-4 bg-blue-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.8)]"></div>

        {/* Investor Tags */}
        {[
            { name: 'Sequoia', top: '25%', left: '30%', delay: 0.1 },
            { name: 'a16z', top: '70%', left: '35%', delay: 0.3 },
            { name: 'Founders Fund', top: '40%', left: '70%', delay: 0.5 },
            { name: 'Y Combinator', top: '65%', left: '65%', delay: 0.7 }
        ].map((tag, i) => (
            <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0, x: -10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ delay: tag.delay, type: 'spring' }}
                className="absolute bg-[#0f172a]/80 backdrop-blur-sm border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-300 shadow-lg flex items-center gap-2"
                style={{ top: tag.top, left: tag.left }}
            >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                {tag.name}
            </motion.div>
        ))}
    </div>
);


export default function DiscoveryExplorer() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    
    // Auto-advance
    useEffect(() => {
        setIsMounted(true);
        if (isHovered) return;
        
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % TOOLS.length);
        }, 5000);
        
        return () => clearInterval(interval);
    }, [isHovered]);

    // Keyboard navigation for accessibility
    const handleKeyDown = (e, index) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            e.preventDefault();
            setActiveIndex((index + 1) % TOOLS.length);
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            e.preventDefault();
            setActiveIndex((index - 1 + TOOLS.length) % TOOLS.length);
        }
    };

    const activeTool = TOOLS[activeIndex];

    const PreviewComponent = {
        'google-maps': GoogleMapsPreview,
        'b2b-directory': B2BDirectoryPreview,
        'youtube': YouTubePreview,
        'instagram': InstagramPreview,
        'investor': InvestorPreview
    }[activeTool.id];

    return (
        <section className="w-full max-w-7xl mx-auto px-6 mb-32 fade-up relative z-10">
            {/* Header */}
            <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/50 backdrop-blur-sm border border-slate-200/60 shadow-sm mb-6 text-sm font-semibold text-slate-600">
                    <Sparkles className="w-4 h-4 text-[#023dbb]" /> Standalone tools
                </div>
                <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-slate-900 tracking-tight">
                    Separate <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#023dbb] to-purple-600">Discovery</span> Tools
                </h2>
                <p className="text-xl text-slate-500 max-w-3xl mx-auto font-medium">
                    Not every prospecting workflow starts inside the core pipeline. SimpLeads provides separate discovery tools for different sources.
                </p>
            </div>

            {/* Main Stage */}
            <div className="relative w-full rounded-[32px] bg-slate-50/50 overflow-hidden" 
                 onMouseEnter={() => setIsHovered(true)} 
                 onMouseLeave={() => setIsHovered(false)}>
                
                {/* Ambient Orbs */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none animate-[spin_30s_linear_infinite]"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none animate-[spin_40s_linear_infinite_reverse]"></div>
                
                {/* Dotted Mesh */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

                <div className="relative z-10 flex flex-col lg:flex-row min-h-[500px] p-2 sm:p-4 gap-4 sm:gap-6">
                    
                    {/* LEFT PANE: Tool List */}
                    <div 
                        className="lg:w-[40%] flex lg:flex-col overflow-x-auto lg:overflow-visible snap-x snap-mandatory hide-scrollbar pb-4 lg:pb-0 relative pt-4 lg:pt-8 px-2 lg:px-4"
                        role="tablist"
                        aria-label="Discovery Tools"
                    >
                        {TOOLS.map((tool, index) => {
                            const isActive = activeIndex === index;
                            const Icon = tool.icon;
                            
                            return (
                                <button
                                    key={tool.id}
                                    role="tab"
                                    aria-selected={isActive}
                                    aria-controls={`panel-${tool.id}`}
                                    id={`tab-${tool.id}`}
                                    tabIndex={isActive ? 0 : -1}
                                    onClick={() => setActiveIndex(index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    className="relative flex-shrink-0 w-[280px] lg:w-full snap-start text-left group outline-none lg:border-b border-slate-200/50 last:border-0"
                                >
                                    {/* Active Highlight Pill */}
                                    {isActive && (
                                        <motion.div 
                                            layoutId="active-tool-pill"
                                            className="absolute inset-y-1 -inset-x-2 lg:-inset-x-4 bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100/80 z-0"
                                            initial={false}
                                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                        >
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-[#023dbb] to-purple-500 rounded-r-md"></div>
                                        </motion.div>
                                    )}

                                    <div className="relative z-10 p-4 flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${isActive ? 'bg-[#023dbb]/10 text-[#023dbb]' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 min-w-0 transition-transform duration-300 group-hover:translate-x-1">
                                            <h4 className={`font-semibold truncate transition-colors ${isActive ? 'text-slate-900' : 'text-slate-600'}`}>{tool.name}</h4>
                                            <p className={`text-xs truncate transition-colors ${isActive ? 'text-slate-500' : 'text-slate-400'}`}>{tool.shortDescription}</p>
                                        </div>
                                        <ChevronRight className={`w-4 h-4 shrink-0 transition-all duration-300 ${isActive ? 'text-[#023dbb] opacity-100' : 'text-slate-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0'}`} />
                                    </div>
                                    
                                    {/* Progress Line (Desktop only) */}
                                    {isActive && isMounted && (
                                        <div className="hidden lg:block absolute bottom-0 left-4 right-4 h-[1px] bg-slate-100 overflow-hidden z-10">
                                            <motion.div 
                                                className="h-full bg-gradient-to-r from-[#023dbb] to-purple-500"
                                                initial={{ width: '0%' }}
                                                animate={{ width: isHovered ? 'var(--current-width)' : '100%' }}
                                                transition={{ duration: 5, ease: 'linear', repeat: isHovered ? 0 : Infinity }}
                                                onUpdate={(latest) => {
                                                    // CSS variable hack to pause animation width visually (React Framer doesn't have a simple pause)
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

                    {/* RIGHT PANE: Live Preview Stage */}
                    <div className="lg:w-[60%] p-2 lg:p-6 flex flex-col min-h-[400px]">
                        <div 
                            className="flex-1 bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[28px] overflow-hidden relative flex flex-col"
                            role="tabpanel"
                            id={`panel-${activeTool.id}`}
                            aria-labelledby={`tab-${activeTool.id}`}
                        >
                            {/* Preview Visual */}
                            <div className="flex-1 p-2 sm:p-4">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeTool.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.4, ease: "easeOut" }}
                                        className="w-full h-full"
                                    >
                                        <PreviewComponent />
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Description Footer */}
                            <div className="bg-white/80 border-t border-slate-100/50 p-6 sm:px-8 sm:py-6">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={`desc-${activeTool.id}`}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <p className="text-slate-600 leading-relaxed mb-4 text-sm sm:text-base">
                                            {activeTool.fullDescription}
                                        </p>
                                        <Link 
                                            href={activeTool.href} 
                                            className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 group"
                                        >
                                            <span className="relative">
                                                Open tool
                                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#023dbb] to-purple-500 transition-all duration-300 group-hover:w-full"></span>
                                            </span>
                                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                        </Link>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Custom CSS for hide-scrollbar */}
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
