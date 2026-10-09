"use client";

import React, { useEffect, useRef, useState } from 'react';
import { HeroHeader } from '@/components/ui/hero-section-1';
import Footer from '@/app/components/landing/Footer';
import AuthModal from '@/app/components/AuthModal';
import BottomCTA from '@/app/components/ui/BottomCTA';
import { ArrowRight, Target, Users, MapPin, PlaySquare, Search, CheckCircle2, ChevronRight, Briefcase } from 'lucide-react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function AboutPage() {
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        // Fade up animations
        gsap.utils.toArray('.fade-up').forEach((elem) => {
            gsap.fromTo(elem, 
                { y: 30, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
                    scrollTrigger: {
                        trigger: elem,
                        start: 'top 85%',
                    }
                }
            );
        });

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    // Mission Grid Data
    const missionGrid = [
        { title: "Finding contacts is easy, qualifying is hard", hashtag: "#THEPROBLEM" },
        { title: "Don't leave the decision-making for later", hashtag: "#DECIDEFASTER" },
        { title: "Need, Urgency, Relevance, Authority", hashtag: "#QUALIFICATION" },
        { isCenter: true },
        { title: "A structured process, not just a data dump", hashtag: "#STRUCTURE" },
        { title: "One platform, multiple workflows", hashtag: "#CONVERGENCE" },
        { title: "Built from real agency experience", hashtag: "#PRACTICAL" },
        { title: "Spend time deciding, not just searching", hashtag: "#ACTIONABLE" }
    ];

    return (
        <div ref={containerRef} className="min-h-screen bg-white text-slate-900 font-sans selection:bg-[#023dbb]/20 overflow-x-hidden">
            <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
            
            <div className="relative z-50">
                <HeroHeader onLoginClick={() => setAuthModalOpen(true)} />
            </div>

            <main className="pt-32 pb-24">
                {/* HERO SECTION */}
                <section className="px-6 max-w-5xl mx-auto text-center mb-32 fade-up">
                    <h1 className="text-6xl md:text-8xl font-display font-extrabold tracking-tight mb-8 text-slate-900">
                        About SimpLeads
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-500 max-w-4xl mx-auto mb-10 leading-relaxed font-medium">
                        SimpLeads is built around a simple problem: finding contacts is easy, but knowing which prospects are actually worth pursuing takes much more work.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button onClick={() => setAuthModalOpen(true)} className="px-8 py-4 rounded-xl bg-[#023dbb] text-white font-bold text-lg hover:bg-[#023dbb]/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2">
                            Start Free <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </section>

                {/* THE RENOWEB PLUS (Mimicking ClickUp Lifestyle Cards) */}
                <section className="bg-slate-50 py-32 px-6 border-y border-slate-200 mb-32">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16 fade-up">
                            <span className="text-[#023dbb] font-bold tracking-[0.2em] uppercase text-xs mb-4 block">The Suite</span>
                            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-slate-900">The Renoweb Plus</h2>
                            <p className="text-lg text-slate-500 max-w-3xl mx-auto">
                                SimpLeads is part of Renoweb Plus, a suite of easy-to-use, do-it-yourself marketing tools built for solo founders and small, bootstrapped startup teams that need multiple marketing functions without building a separate specialist stack for each one.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 fade-up">
                            {/* Card 1 */}
                            <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-slate-100 group">
                                <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-50 relative overflow-hidden flex items-center justify-center">
                                    <Target className="w-16 h-16 text-blue-500 opacity-50 group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div className="p-8">
                                    <h3 className="text-2xl font-bold mb-2">SimpLeads</h3>
                                    <p className="text-slate-500">Lead generation, qualification, and scoring built into one core pipeline.</p>
                                </div>
                            </div>
                            
                            {/* Card 2 */}
                            <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-slate-100 group">
                                <div className="h-48 bg-gradient-to-br from-purple-100 to-purple-50 relative overflow-hidden flex items-center justify-center">
                                    <Search className="w-16 h-16 text-purple-500 opacity-50 group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div className="p-8">
                                    <h3 className="text-2xl font-bold mb-2">Flawdits</h3>
                                    <p className="text-slate-500">Multi-platform digital presence analysis to ensure your brand stands out.</p>
                                </div>
                            </div>

                            {/* Card 3 */}
                            <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-slate-100 group">
                                <div className="h-48 bg-gradient-to-br from-teal-100 to-teal-50 relative overflow-hidden flex items-center justify-center">
                                    <PlaySquare className="w-16 h-16 text-teal-500 opacity-50 group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div className="p-8">
                                    <h3 className="text-2xl font-bold mb-2">Snooptel</h3>
                                    <p className="text-slate-500">Deep content research to uncover trends, gaps, and content opportunities.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* MISSION GRID (Mimicking ClickUp Core Values) */}
                <section className="max-w-[1400px] mx-auto px-6 mb-40 fade-up">
                    <div className="grid grid-cols-1 md:grid-cols-3 border-l border-t border-slate-200">
                        {missionGrid.map((item, index) => {
                            if (item.isCenter) {
                                return (
                                    <div key={index} className="p-12 md:p-16 border-r border-b border-slate-200 md:col-span-1 flex items-center justify-center bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50">
                                        <h2 className="text-4xl md:text-5xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#023dbb] via-[#8b5cf6] to-[#ff4785] text-center leading-tight">
                                            Our <br/>Mission
                                        </h2>
                                    </div>
                                );
                            }
                            return (
                                <div key={index} className="p-8 md:p-12 border-r border-b border-slate-200 flex flex-col justify-between min-h-[250px] bg-white hover:bg-slate-50 transition-colors">
                                    <h3 className="text-xl md:text-2xl font-bold text-slate-800 leading-tight mb-8 pr-4">
                                        {item.title}
                                    </h3>
                                    <span className="text-[10px] font-bold text-slate-400 tracking-[0.15em] uppercase">
                                        {item.hashtag}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* WHY WE BUILT SIMPLEADS & WORKFLOW (Horizontal Tabs Vibe) */}
                <section className="max-w-5xl mx-auto px-6 mb-40 fade-up">
                    <div className="text-center mb-16">
                        <span className="text-purple-600 font-bold tracking-widest uppercase text-xs mb-4 block">Our Origin</span>
                        <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 text-slate-900">Why We Built SimpLeads</h2>
                        <p className="text-xl text-slate-500 leading-relaxed mb-12">
                            We kept encountering the same workflow problem at Renoweb. Contact databases provided people, but not business context. Hiring tools showed activity, but disconnected from people. Raw lists still required manual research.
                        </p>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/50 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-10">The Core Prospecting Workflow</h3>
                        
                        {/* Horizontal Workflow Mimic */}
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 max-w-4xl mx-auto relative z-10">
                            {['Discover', 'Understand', 'Qualify', 'Score', 'Export'].map((step, i) => (
                                <React.Fragment key={step}>
                                    <div className="flex-1 text-center group">
                                        <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 text-lg font-bold transition-all duration-300 ${i === 2 ? 'bg-gradient-to-br from-purple-100 to-pink-100 text-purple-700 shadow-md scale-110' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-600'}`}>
                                            {i + 1}
                                        </div>
                                        <div className={`font-semibold ${i === 2 ? 'text-slate-900' : 'text-slate-500'}`}>{step}</div>
                                    </div>
                                    {i < 4 && (
                                        <div className="hidden md:block w-8 text-slate-300">
                                            <ChevronRight className="w-6 h-6 mx-auto" />
                                        </div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </section>

                {/* BUILT AROUND REAL PROSPECTING WORKFLOWS & TEAMS */}
                <section className="bg-slate-900 text-white py-32 px-6 mb-32 fade-up relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>
                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                            <div>
                                <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Built Around Real Prospecting Workflows</h2>
                                <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                                    SimpLeads is built by Renoweb, a digital solutions agency that also runs outbound, recruiting, and local-prospecting workflows. That operating experience shapes the product around practical problems rather than simply adding another database of contacts.
                                </p>
                                <ul className="space-y-4">
                                    {["Who should we find?", "Which companies are relevant?", "Does this prospect meet our criteria?", "Who should we prioritize first?"].map((q, i) => (
                                        <li key={i} className="flex items-center gap-4 text-slate-300 bg-white/5 border border-white/10 p-4 rounded-xl">
                                            <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
                                            <span className="font-medium">{q}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm">
                                    <Briefcase className="w-8 h-8 text-blue-400 mb-4" />
                                    <h3 className="text-lg font-bold mb-2">Sales & GTM Teams</h3>
                                    <p className="text-sm text-slate-400">Build lists around target roles, qualify, and prioritize.</p>
                                </div>
                                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm sm:-mt-8 sm:mb-8">
                                    <Users className="w-8 h-8 text-purple-400 mb-4" />
                                    <h3 className="text-lg font-bold mb-2">Recruiters</h3>
                                    <p className="text-sm text-slate-400">Use people, company, and active job info to find candidates.</p>
                                </div>
                                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm">
                                    <MapPin className="w-8 h-8 text-teal-400 mb-4" />
                                    <h3 className="text-lg font-bold mb-2">Agencies</h3>
                                    <p className="text-sm text-slate-400">Run structured prospecting across multiple clients and maps.</p>
                                </div>
                                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm sm:-mt-8 sm:mb-8">
                                    <Target className="w-8 h-8 text-pink-400 mb-4" />
                                    <h3 className="text-lg font-bold mb-2">Founders</h3>
                                    <p className="text-sm text-slate-400">Build targeted lists without a massive stack of tools.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* LEAD GEN IS NOT QUALIFICATION (Clean Typography block) */}
                <section className="max-w-4xl mx-auto px-6 text-center mb-32 fade-up">
                    <h2 className="text-4xl font-display font-bold mb-6 text-slate-900">Lead Generation Is Not Lead Qualification</h2>
                    <p className="text-xl text-slate-500 mb-12">
                        Finding more contacts does not automatically mean finding better prospects. SimpLeads separates these two jobs.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-8 bg-blue-50 rounded-3xl border border-blue-100 text-left">
                            <h3 className="text-2xl font-bold text-blue-900 mb-4">Lead Generation</h3>
                            <p className="text-blue-700">Helps you discover people, companies, businesses, and other potential prospects.</p>
                        </div>
                        <div className="p-8 bg-purple-50 rounded-3xl border border-purple-100 text-left">
                            <h3 className="text-2xl font-bold text-purple-900 mb-4">Lead Qualification</h3>
                            <p className="text-purple-700">Helps you evaluate whether those prospects fit your criteria using Need, Urgency, Relevance, and Authority.</p>
                        </div>
                    </div>
                </section>

                {/* CTA BAND (Using reusable BottomCTA) */}
                <BottomCTA 
                    title={<>Find the Right People,<br/>Not Just More Contacts.</>}
                    buttonText="Start Free →"
                    onButtonClick={() => setAuthModalOpen(true)}
                />
            </main>

            <Footer />
        </div>
    );
}
