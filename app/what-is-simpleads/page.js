"use client";

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { HeroHeader } from '@/components/ui/hero-section-1';
import Footer from '@/app/components/landing/Footer';
import AuthModal from '@/app/components/AuthModal';
import BottomCTA from '@/app/components/ui/BottomCTA';
import PipelineVisualizer from '@/app/components/ui/PipelineVisualizer';
import DiscoveryExplorer from '@/app/components/ui/DiscoveryExplorer';
import AudienceConsoleSection from '@/app/components/ui/AudienceConsoleSection';
import RenowebPlusSuite from '@/app/components/ui/RenowebPlusSuite';
import { ArrowRight, CheckCircle2, ChevronRight, Target, Users, MapPin, PlaySquare, Search, Briefcase, Plus, Minus, CheckCircle, List, ArrowDownToLine, MousePointerClick, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function WhatIsSimpleadsPage() {
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [openFaq, setOpenFaq] = useState(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

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

    const faqs = [
        {
            q: "What is SimpLeads in one sentence?",
            a: "SimpLeads is a lead intelligence and qualification platform that combines people, company, job-signal, scoring and discovery workflows."
        },
        {
            q: "What problem does SimpLeads solve?",
            a: "It helps reduce the manual work involved in finding prospects, researching their companies, identifying useful business signals and prioritizing which prospects deserve attention."
        },
        {
            q: "What are the five stages of SimpLeads?",
            a: "The core pipeline has exactly five stages: People → Company → Jobs → Scoring → Export."
        },
        {
            q: "What is the difference between lead generation and lead qualification?",
            a: "Lead generation finds potential contacts or businesses. Lead qualification evaluates which prospects fit your requirements and deserve attention."
        },
        {
            q: "What is Active Job Signals?",
            a: "Active Job Signals is a business-intelligence feature based on recent job-posting activity. It can provide useful context for prospecting, but it does not guarantee buying intent."
        },
        {
            q: "How does AI Lead Qualification work?",
            a: "It evaluates available context around Need, Urgency, Relevance and Authority."
        },
        {
            q: "Does scoring guarantee that a prospect will convert?",
            a: "No. Scoring is a prioritization mechanism and should be used as decision support, not as a guarantee of conversion or revenue."
        },
        {
            q: "Is Budget qualification available?",
            a: "No. Budget or financial qualification is currently in development and should not be presented as a live BANT capability."
        },
        {
            q: "Does SimpLeads replace a CRM?",
            a: "No. SimpLeads is a prospecting, intelligence, qualification and export platform."
        },
        {
            q: "Is SimpLeads in beta?",
            a: "Yes. SimpLeads is currently in public beta. Some features are experimental, and AI-generated content may occasionally contain mistakes."
        }
    ];

    const pipelineStages = [
        { icon: Users, title: "People", desc: "Find professionals using titles, seniority, functions, and email status." },
        { icon: Briefcase, title: "Company", desc: "Add account-level context using industry, keywords, and domain matching." },
        { icon: Target, title: "Jobs", desc: "Use Active Job Signals to identify relevant recent job-posting activity." },
        { icon: CheckCircle, title: "Scoring", desc: "Evaluate prospects based on Need, Urgency, Relevance, and Authority." },
        { icon: ArrowDownToLine, title: "Export", desc: "Take the resulting dataset into the next stage of your workflow." }
    ];

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-[#023dbb]/20 overflow-x-hidden">
            <Head>
                <title>What Is SimpLeads? | Lead Intelligence, Qualification & Scoring</title>
                <meta name="description" content="SimpLeads is a lead intelligence and qualification platform that helps businesses find people, understand companies, identify active business signals, qualify prospects and prioritize leads." />
            </Head>
            
            <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
            
            <div className="relative z-50">
                <HeroHeader onLoginClick={() => setAuthModalOpen(true)} />
            </div>

            <main className="pt-32 pb-24">
                {/* HERO SECTION */}
                <section className="px-6 max-w-5xl mx-auto text-center mb-24 fade-up">
                    <h1 className="text-5xl md:text-7xl font-display font-extrabold tracking-tight mb-8 text-slate-900">
                        What Is <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#023dbb] to-[#4ec8ef]">SimpLeads?</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-500 max-w-4xl mx-auto mb-10 leading-relaxed font-medium">
                        SimpLeads is a lead intelligence and qualification platform that helps you find the right people, understand the companies behind them, identify relevant business signals, and prioritize which prospects deserve attention.
                    </p>
                    <p className="text-lg text-slate-400 max-w-3xl mx-auto mb-12">
                        Instead of treating lead generation as simply collecting more contacts, SimpLeads brings prospect discovery, company intelligence, Active Job Signals, AI Lead Qualification and scoring into one structured workflow.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                        <button onClick={() => setAuthModalOpen(true)} className="px-8 py-4 rounded-full bg-[#023dbb] text-white font-bold text-lg hover:bg-[#023dbb]/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2">
                            Start Using SimpLeads <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-50 border border-slate-200 text-slate-700 font-semibold shadow-sm">
                        Find the right people. Understand the account. Qualify the opportunity. Prioritize the next action.
                    </div>
                </section>

                {/* SCREENSHOT SECTION -> Replaced by Animated Pipeline Visualizer */}
                <section className="px-6 max-w-7xl mx-auto mb-32 fade-up">
                    <PipelineVisualizer />
                </section>

                {/* THE PROBLEM IT SOLVES & WORKFLOW */}
                <section className="max-w-5xl mx-auto px-6 mb-32 fade-up">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-slate-900">The Problem SimpLeads Solves</h2>
                        <p className="text-xl text-slate-500 leading-relaxed mb-8 max-w-3xl mx-auto">
                            Finding a lead is not the same as finding the right lead. A typical prospecting workflow involves one tool for contact discovery, another for company research, another for job activity, and a manual process to decide who deserves attention.
                        </p>
                        <p className="text-lg text-slate-400 font-medium">
                            The problem is not a lack of data. The problem is turning scattered data into a useful decision.
                        </p>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-200/40 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-12">SimpLeads brings this into one workflow:</h3>
                        
                        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-0 max-w-5xl mx-auto relative z-10">
                            {['Find', 'Understand', 'Identify Signals', 'Qualify', 'Prioritize', 'Export'].map((step, i) => (
                                <React.Fragment key={step}>
                                    <div className="text-center group px-2 sm:px-4">
                                        <div className={`px-6 py-3 rounded-2xl flex items-center justify-center mb-4 text-base font-bold transition-all duration-300 ${i === 3 ? 'bg-gradient-to-br from-[#023dbb] to-blue-500 text-white shadow-lg scale-110' : 'bg-slate-50 text-slate-500 border border-slate-100 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100'}`}>
                                            {step}
                                        </div>
                                    </div>
                                    {i < 5 && (
                                        <div className="hidden md:block w-8 text-slate-300 mb-4">
                                            <ChevronRight className="w-6 h-6 mx-auto" />
                                        </div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </section>

                {/* WHAT IT ACTUALLY DOES (ClickUp Values Grid Style) */}
                <section className="max-w-6xl mx-auto px-6 mb-32 fade-up">
                    <h2 className="text-4xl md:text-5xl font-display font-bold mb-12 text-center text-slate-900">What SimpLeads Actually Does</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-l border-t border-slate-200">
                        {pipelineStages.map((stage, index) => {
                            const Icon = stage.icon;
                            return (
                                <div key={index} className="p-10 border-r border-b border-slate-200 flex flex-col min-h-[250px] bg-white hover:bg-slate-50 transition-colors group">
                                    <Icon className="w-8 h-8 text-[#023dbb] mb-6 group-hover:scale-110 transition-transform" />
                                    <h3 className="text-2xl font-bold text-slate-900 mb-4">{stage.title}</h3>
                                    <p className="text-slate-500 leading-relaxed text-sm">{stage.desc}</p>
                                </div>
                            );
                        })}
                        <div className="p-10 border-r border-b border-slate-200 flex flex-col justify-center min-h-[250px] bg-gradient-to-br from-blue-50/50 to-purple-50/50">
                            <h3 className="text-3xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#023dbb] to-purple-600 leading-tight">
                                Exactly five stages. <br/>One pipeline.
                            </h3>
                        </div>
                    </div>
                </section>

                {/* LEAD GEN IS ONLY FIRST STEP */}
                <section className="bg-slate-900 text-white py-32 px-6 mb-32 fade-up relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>
                    <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Lead Generation Is Only the First Step</h2>
                            <p className="text-xl text-slate-400 mb-8 leading-relaxed">
                                SimpLeads separates finding prospects from deciding which prospects deserve attention. More leads do not automatically mean better leads.
                            </p>
                            <p className="text-lg font-bold text-white bg-white/10 border border-white/20 p-6 rounded-2xl inline-block">
                                The platform helps users transition from lead volume to lead priority.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { t: "Lead Generation", d: "Find potential people, companies and businesses." },
                                { t: "Company Intelligence", d: "Understand whether the account fits the criteria." },
                                { t: "Active Job Signals", d: "Identify recent activity for business context." },
                                { t: "Lead Qualification", d: "Evaluate Need, Urgency, Relevance, Authority." },
                                { t: "Lead Scoring", d: "Turn context into a prioritized list." }
                            ].map((item, i) => (
                                <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
                                    <h3 className="text-lg font-bold text-blue-400 mb-2">{item.t}</h3>
                                    <p className="text-sm text-slate-400">{item.d}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* SEPARATE DISCOVERY TOOLS */}
                <DiscoveryExplorer />

                {/* WHO IT IS BUILT FOR */}
                <AudienceConsoleSection />

                {/* THE RENOWEB PLUS (Mimicking ClickUp Lifestyle Cards) */}
                <RenowebPlusSuite />

                {/* FAQ SECTION */}
                <section className="max-w-3xl mx-auto px-6 mb-32 fade-up">
                    <h2 className="text-4xl font-display font-bold mb-12 text-center text-slate-900">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
                                <button 
                                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                    className="w-full text-left px-6 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors"
                                >
                                    <span className="font-bold text-slate-900 pr-8">{faq.q}</span>
                                    {openFaq === idx ? (
                                        <Minus className="w-5 h-5 text-[#023dbb] shrink-0" />
                                    ) : (
                                        <Plus className="w-5 h-5 text-slate-400 shrink-0" />
                                    )}
                                </button>
                                {openFaq === idx && (
                                    <div className="px-6 pb-5 text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA BAND (Using reusable BottomCTA) */}
                <BottomCTA 
                    title={<>Find the Right People.<br/>Qualify the Opportunity.<br/>Prioritize What Matters.</>}
                    buttonText="Start Using SimpLeads →"
                    onButtonClick={() => setAuthModalOpen(true)}
                />
            </main>

            <Footer />
        </div>
    );
}
