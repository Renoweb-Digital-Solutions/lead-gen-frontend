"use client";

import React, { useEffect, useRef, useState } from 'react';
import { HeroHeader } from '@/components/ui/hero-section-1';
import Footer from '@/app/components/landing/Footer';
import AuthModal from '@/app/components/AuthModal';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Briefcase, MapPin, Video, Building, LineChart, CheckCircle2, Target } from 'lucide-react';
import Link from 'next/link';

export default function SolutionsPage() {
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const containerRef = useRef(null);

    const solutions = [
        {
            id: 'sales-teams',
            title: 'Sales Teams',
            hero: 'Outbound prospecting, AI-scored pipeline, hiring-signal prioritization.',
            narrative: 'Sales teams use Simpleads for outbound prospecting and pipeline prioritization. Combine People Search, Company Intelligence, and AI Scoring to build lists that are already ICP-fit.',
            icon: Target,
            color: 'blue',
            bgGlow: 'from-blue-500/20 to-indigo-500/20',
            activeColor: 'bg-blue-50 text-blue-600 border-blue-200',
            gradientText: 'from-blue-600 to-indigo-600',
            benefits: ['Hyper-Targeted Prospect Lists', 'Hiring-Signal Prioritization', 'AI Scoring Pipeline', 'Direct CRM Exports'],
            image: '/features_images/ai_lead_scoring/from_raw_leads_to_qualified_prospects.png',
            link: '/solutions/sales-teams'
        },
        {
            id: 'recruiters',
            title: 'Recruiters & Staffing Agencies',
            hero: 'Hiring-signal leads for business development, not just candidate sourcing.',
            narrative: 'Recruiters and staffing agencies use the same hiring-signal data to find new business. Find companies actively hiring, cross-reference job data and build client outreach lists.',
            icon: Briefcase,
            color: 'teal',
            bgGlow: 'from-teal-500/20 to-emerald-500/20',
            activeColor: 'bg-teal-50 text-teal-600 border-teal-200',
            gradientText: 'from-teal-600 to-emerald-600',
            benefits: ['Business Development', 'Open Role Filtering', 'Hiring Manager Contact Details', 'Client Sourcing Tool'],
            image: '/features_images/active_job_signals/job_activity_filters_dashboard.png',
            link: '/solutions/recruiters'
        },
        {
            id: 'agencies',
            title: 'Marketing & Growth Agencies',
            hero: 'Local and B2B client prospecting for new-business outreach.',
            narrative: 'Marketing and growth agencies use Google Maps Search and firmographic filtering to build local and B2B client lists in one platform.',
            icon: MapPin,
            color: 'purple',
            bgGlow: 'from-purple-500/20 to-fuchsia-500/20',
            activeColor: 'bg-purple-50 text-purple-600 border-purple-200',
            gradientText: 'from-purple-600 to-fuchsia-600',
            benefits: ['Local Client Acquisition', 'Google Maps Search', 'B2B Prospecting', 'Clean Agency Reporting'],
            image: '/features_images/google_maps_search/discover_local_businesses_map.png',
            link: '/solutions/agencies'
        }
    ];

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
        
        // Initial hero fade in
        gsap.fromTo('.solutions-hero', 
            { y: 30, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out' }
        );

        // Animate tabs container in
        gsap.fromTo('.solutions-tabs',
            { y: 40, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.3,
                scrollTrigger: {
                    trigger: '.solutions-tabs',
                    start: 'top 85%',
                }
            }
        );

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    // Animate content change when tab switches
    useEffect(() => {
        gsap.fromTo('.solution-content-block',
            { opacity: 0, x: -20 },
            { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out' }
        );
        gsap.fromTo('.solution-visual-block',
            { opacity: 0, scale: 0.95 },
            { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.2)' }
        );
    }, [activeTab]);

    const activeSolution = solutions[activeTab];

    return (
        <div className="min-h-screen bg-white text-brand-dark font-sans selection:bg-brand-cyan/30 selection:text-brand-dark" ref={containerRef}>
            <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
            <HeroHeader onLoginClick={() => setAuthModalOpen(true)} />
            
            {/* Hero Section */}
            <section className="pt-36 pb-16 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-brand-sky/10 to-transparent blur-3xl pointer-events-none rounded-full" />
                
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 font-semibold text-sm mb-6">
                        <Briefcase className="w-4 h-4" />
                        Solutions By Team
                    </div>
                    <h1 className="solutions-hero text-5xl md:text-6xl lg:text-7xl font-display font-extrabold text-brand-dark tracking-tight leading-[1.05] mb-8">
                        One Platform, <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#023dbb] to-[#4ec8ef]">
                            Three Core Use Cases.
                        </span>
                    </h1>
                    
                    <p className="solutions-hero text-xl text-slate-500 max-w-2xl mx-auto font-medium">
                        The same pipeline, three very different jobs to be done. See how each team actually uses Simpleads day to day.
                    </p>
                </div>
            </section>

            {/* Interactive Solutions Section */}
            <section className="py-12 pb-32">
                <div className="max-w-7xl mx-auto px-6 solutions-tabs">
                    
                    {/* Desktop Tabs / Mobile Select */}
                    <div className="flex overflow-x-auto hide-scrollbar gap-3 mb-12 pb-4 border-b border-slate-100 snap-x">
                        {solutions.map((sol, idx) => {
                            const Icon = sol.icon;
                            const isActive = activeTab === idx;
                            return (
                                <button
                                    key={sol.id}
                                    onClick={() => setActiveTab(idx)}
                                    className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all whitespace-nowrap snap-start border ${
                                        isActive 
                                        ? sol.activeColor + ' shadow-sm' 
                                        : 'bg-white text-slate-500 border-transparent hover:bg-slate-50 hover:text-slate-800'
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {sol.title}
                                </button>
                            );
                        })}
                    </div>

                    {/* Active Solution Content */}
                    <div className="relative rounded-3xl border border-slate-100 bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] overflow-hidden">
                        
                        {/* Dynamic Background Glow */}
                        <div className={`absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br ${activeSolution.bgGlow} blur-3xl rounded-full transition-colors duration-700 pointer-events-none`} />
                        <div className={`absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr ${activeSolution.bgGlow} blur-3xl rounded-full transition-colors duration-700 pointer-events-none`} />

                        <div className="flex flex-col lg:flex-row p-8 lg:p-16 gap-12 lg:gap-20 items-center relative z-10">
                            
                            {/* Text Content */}
                            <div className="solution-content-block flex-1 space-y-8">
                                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${activeSolution.activeColor.split(' ')[0]} ${activeSolution.activeColor.split(' ')[1]} font-bold text-xs tracking-wider uppercase border border-white/20 shadow-sm`}>
                                    <activeSolution.icon className="w-3.5 h-3.5" />
                                    {activeSolution.title}
                                </div>
                                
                                <div>
                                    <h2 className="text-4xl lg:text-5xl font-display font-extrabold text-brand-dark mb-6 tracking-tight leading-tight">
                                        {activeSolution.hero}
                                    </h2>
                                    <p className="text-lg text-slate-600 leading-relaxed font-medium">
                                        {activeSolution.narrative}
                                    </p>
                                </div>

                                <ul className="space-y-4 pt-4 border-t border-slate-100">
                                    {activeSolution.benefits.map((benefit, i) => (
                                        <li key={i} className="flex items-center gap-3">
                                            <CheckCircle2 className={`w-5 h-5 text-transparent bg-clip-text bg-gradient-to-br ${activeSolution.gradientText} fill-current opacity-80`} />
                                            <span className="text-slate-700 font-semibold">{benefit}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="pt-4 flex items-center gap-4">
                                    <button onClick={() => setAuthModalOpen(true)} className={`px-8 py-4 rounded-xl text-white font-bold bg-gradient-to-r ${activeSolution.gradientText} shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300`}>
                                        Start Free
                                    </button>
                                    <Link href={activeSolution.link} className={`px-6 py-4 rounded-xl font-bold bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors`}>
                                        View Full Solution
                                    </Link>
                                </div>
                            </div>

                            {/* Visual Content */}
                            <div className="solution-visual-block flex-1 w-full max-w-xl">
                                <div className="relative rounded-2xl bg-white border border-slate-200 p-2 shadow-2xl shadow-slate-200/50 group animate-[breathing_6s_ease-in-out_infinite]">
                                    <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 bg-slate-50/50 rounded-t-xl">
                                        <div className="flex gap-1.5">
                                            <div className="w-3 h-3 rounded-full bg-slate-300 group-hover:bg-red-400 transition-colors" />
                                            <div className="w-3 h-3 rounded-full bg-slate-300 group-hover:bg-amber-400 transition-colors" />
                                            <div className="w-3 h-3 rounded-full bg-slate-300 group-hover:bg-green-400 transition-colors" />
                                        </div>
                                    </div>
                                    <div className="relative overflow-hidden rounded-b-xl bg-slate-100 aspect-[4/3]">
                                        <img 
                                            src={activeSolution.image} 
                                            alt={activeSolution.hero} 
                                            className="absolute inset-0 w-full h-full object-cover object-top opacity-95" 
                                        />
                                        <div className={`absolute inset-0 bg-gradient-to-br ${activeSolution.bgGlow} mix-blend-overlay`} />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            <style jsx global>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                @keyframes breathing {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
            `}</style>

            <section className="py-24 px-6 bg-[#0a1128] text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1E61ED]/20 via-[#0a1128] to-[#0a1128] pointer-events-none" />
                <div className="max-w-3xl mx-auto relative z-10 fade-up-item">
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">Not sure which fits? Start free and find out.</h2>
                    <p className="text-xl text-slate-400 mb-10">Every solution runs on the same pipeline.</p>
                    <button onClick={() => setAuthModalOpen(true)} className="px-10 py-5 rounded-2xl bg-[#1E61ED] text-white font-bold text-lg hover:bg-blue-600 transition-colors shadow-lg hover:shadow-blue-500/25">
                        Start Free — No Card Required
                    </button>
                </div>
            </section>

            <Footer />
        </div>
    );
}
