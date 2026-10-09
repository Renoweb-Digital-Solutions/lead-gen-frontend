"use client";

import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { HeroHeader } from '@/components/ui/hero-section-1';
import Footer from '@/app/components/landing/Footer';
import AuthModal from '@/app/components/AuthModal';
import BottomCTA from '@/app/components/ui/BottomCTA';
import PipelineVisualizer from '@/app/components/ui/PipelineVisualizer';
import ManualWorkflowSection from '@/app/components/ui/ManualWorkflowSection';
import QualifiedListSection from '@/app/components/ui/QualifiedListSection';
import RenowebPlusSuite from '@/app/components/ui/RenowebPlusSuite';
import { ArrowRight, CheckCircle2, Target, Users, Briefcase, MousePointerClick, Search, PlaySquare, Plus, Minus, ArrowDownToLine, CheckCircle, Database, LayoutDashboard, DownloadCloud } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function WhySimpleadsPage() {
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
            q: "Why use SimpLeads instead of manually building prospect lists?",
            a: "SimpLeads brings people discovery, company intelligence, business signals, qualification and scoring into a structured workflow instead of requiring users to manually reconcile multiple sources."
        },
        {
            q: "Is SimpLeads just another lead-generation tool?",
            a: "No. Lead generation is one part of the platform. SimpLeads also provides company intelligence, Active Job Signals, AI Lead Qualification, scoring and export workflows."
        },
        {
            q: "What makes qualification different from lead generation?",
            a: "Lead generation finds potential prospects. Qualification evaluates available context to help determine which prospects fit the user's requirements and deserve attention."
        },
        {
            q: "Can SimpLeads guarantee that a scored lead will convert?",
            a: "No. Scoring is a prioritization mechanism and should be treated as decision support rather than a guarantee of conversion or revenue."
        },
        {
            q: "What is Active Job Signals?",
            a: "Active Job Signals uses recent job-posting activity as a business-intelligence signal. It does not guarantee buying intent or prove that a company needs a particular service."
        },
        {
            q: "Who is SimpLeads built for?",
            a: "SimpLeads is designed for sales and GTM teams, lead-generation and marketing agencies, local and service businesses, recruiters and staffing teams, and founders or small teams."
        },
        {
            q: "Does SimpLeads replace a CRM?",
            a: "No. SimpLeads is a prospecting, intelligence, qualification and export platform."
        },
        {
            q: "Is Budget qualification available?",
            a: "Budget or financial qualification is currently in development and should not be presented as a live BANT capability."
        }
    ];

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-[#023dbb]/20 overflow-x-hidden">
            <Head>
                <title>Why SimpLeads? | Lead Intelligence, Qualification & Scoring</title>
                <meta name="description" content="Discover why SimpLeads combines lead generation, company intelligence, Active Job Signals, AI lead qualification and scoring into one structured prospecting workflow." />
            </Head>

            <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />

            <div className="relative z-50">
                <HeroHeader onLoginClick={() => setAuthModalOpen(true)} />
            </div>

            <main className="pt-32 pb-24">
                {/* HERO SECTION */}
                <section className="px-6 max-w-5xl mx-auto text-center mb-24 fade-up">
                    <h1 className="text-5xl md:text-7xl font-display font-extrabold tracking-tight mb-8 text-slate-900">
                        Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#023dbb] to-[#4ec8ef]">SimpLeads?</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-500 max-w-4xl mx-auto mb-10 leading-relaxed font-medium">
                        The practical reason to use SimpLeads is focus and consistency: instead of collecting contacts from separate sources, researching companies manually, checking business activity elsewhere and deciding which leads matter in a spreadsheet, you can run a structured prospecting and qualification workflow in one platform.
                    </p>
                    <p className="text-lg text-slate-400 max-w-3xl mx-auto mb-12">
                        SimpLeads brings together People Search, Company Intelligence, Active Job Signals, AI Lead Qualification, Lead Scoring and Export, alongside separate discovery tools for different prospecting sources.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                        <button onClick={() => setAuthModalOpen(true)} className="px-8 py-4 rounded-full bg-[#023dbb] text-white font-bold text-lg hover:bg-[#023dbb]/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2">
                            Start Using SimpLeads <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-slate-50 border border-slate-200 text-slate-700 font-semibold shadow-sm">
                        The objective is not simply to produce more leads. It is to find relevant prospects.
                    </div>
                </section>

                {/* PIPELINE VISUALIZER SECTION */}
                <PipelineVisualizer />

                {/* WHY NOT MANUALLY BUILD... */}
                <ManualWorkflowSection />

                {/* ONE STRUCTURED PLATFORM */}
                <section className="bg-slate-900 text-white py-32 px-6 mb-32 fade-up relative overflow-hidden">
                    <div className="max-w-5xl mx-auto relative z-10 text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Why Use One Structured Lead Intelligence Platform?</h2>
                        <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                            A single structured platform gives your prospecting workflow a consistent process. Instead of treating every campaign as a separate research project, you move through the same core stages:
                        </p>
                    </div>

                    <div className="max-w-6xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-5 gap-4">
                        {[
                            { title: "People", desc: "Helps define who you want to reach." },
                            { title: "Company", desc: "Adds context about where they work." },
                            { title: "Jobs", desc: "Provides context about recent activity." },
                            { title: "Scoring", desc: "Turns context into a priority order." },
                            { title: "Export", desc: "Gives you the dataset you need." }
                        ].map((stage, i) => (
                            <div key={i} className="bg-white/10 border border-white/20 p-6 rounded-2xl backdrop-blur-md hover:bg-white/15 transition-all text-center">
                                <div className="w-10 h-10 rounded-full bg-[#023dbb] text-white font-bold flex items-center justify-center mx-auto mb-4">{i + 1}</div>
                                <h3 className="font-bold text-lg mb-2 text-white">{stage.title}</h3>
                                <p className="text-sm text-slate-400">{stage.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* WHO SHOULD USE SIMPLEADS */}
                <section className="max-w-7xl mx-auto px-6 mb-32 fade-up">
                    <h2 className="text-4xl md:text-5xl font-display font-bold mb-16 text-center text-slate-900">Who Should Use SimpLeads?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Sales */}
                        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                                <Target className="w-6 h-6 text-[#023dbb]" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Sales & GTM Teams</h3>
                            <p className="text-slate-600 text-sm leading-relaxed mb-4">Build targeted prospect lists instead of starting with broad contact databases.</p>
                            <ul className="text-sm text-slate-500 space-y-2">
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> People Search by title/function</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> AI Qualification & Scoring</li>
                            </ul>
                        </div>
                        {/* Agencies */}
                        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center mb-6">
                                <Briefcase className="w-6 h-6 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Agencies</h3>
                            <p className="text-slate-600 text-sm leading-relaxed mb-4">Build different prospect datasets for different clients, industries and campaigns with a repeatable workflow.</p>
                            <ul className="text-sm text-slate-500 space-y-2">
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Google Maps & IG Scrapers</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Export campaign-ready data</li>
                            </ul>
                        </div>
                        {/* Local */}
                        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                            <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center mb-6">
                                <Search className="w-6 h-6 text-teal-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Local Businesses</h3>
                            <p className="text-slate-600 text-sm leading-relaxed mb-4">Begin prospecting with a location rather than a large B2B database.</p>
                            <ul className="text-sm text-slate-500 space-y-2">
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Google Maps Search</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> "Which businesses exist here?"</li>
                            </ul>
                        </div>
                        {/* Recruiters */}
                        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm md:col-span-1 lg:col-span-2">
                            <h3 className="text-2xl font-bold text-slate-900 mb-3">Recruiters & Staffing</h3>
                            <p className="text-slate-600 leading-relaxed mb-4">Use People Search to identify professionals and Active Job Signals to identify companies with relevant recent job activity. Job activity is treated as a business-intelligence signal, useful for business development while avoiding assumptions.</p>
                        </div>
                        {/* Founders */}
                        <div className="bg-[#023dbb] text-white border border-[#023dbb] rounded-3xl p-8 shadow-xl">
                            <h3 className="text-2xl font-bold mb-3">Founders & Small Teams</h3>
                            <p className="text-blue-100 leading-relaxed">Instead of building a complex prospecting stack, a small team can use one workflow and export the information required for the next step.</p>
                        </div>
                    </div>
                </section>

                {/* WHY A QUALIFIED LIST IS BETTER */}
                <QualifiedListSection />

                {/* WHY STRUCTURED & EXPORTABLE */}
                <section className="max-w-7xl mx-auto px-6 mb-32 fade-up">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white border border-slate-200 rounded-3xl p-10 shadow-sm">
                            <h3 className="text-2xl font-bold text-slate-900 mb-6">Why Structured Prospect Intelligence Is Useful</h3>
                            <p className="text-slate-600 mb-4 leading-relaxed">
                                A spreadsheet can store contacts. A database can provide records. But none of those automatically answers: <strong>"Which prospect should I work on first?"</strong>
                            </p>
                            <p className="text-slate-600 leading-relaxed mb-6">
                                SimpLeads connects the pieces into a repeatable workflow: Discovery → Context → Signals → Qualification → Prioritization.
                            </p>
                            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-sm text-slate-500">
                                This is particularly useful when requirements change frequently—different industries or roles can require a new list without needing an entirely new research process.
                            </div>
                        </div>
                        <div className="bg-[#023dbb] text-white rounded-3xl p-10 shadow-xl overflow-hidden relative">
                            <DownloadCloud className="absolute -bottom-10 -right-10 w-64 h-64 text-white opacity-5" />
                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold mb-6">Why Exportable, Prioritized Data Is Useful</h3>
                                <p className="text-blue-100 mb-6 leading-relaxed">
                                    The objective of prospecting is not to keep data inside a dashboard. Once the research is complete, export the information you need:
                                </p>
                                <ul className="space-y-3 mb-8">
                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-blue-300" /> Full Bundle</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-blue-300" /> Summary CSV</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-blue-300" /> Leads Only</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-blue-300" /> Jobs Only</li>
                                </ul>
                                <p className="text-sm text-blue-200 italic">
                                    SimpLeads is not positioned as a CRM replacement. It is a prospecting, intelligence, qualification and export platform.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

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
                    title={<>Stop Building Prospect Lists the Long Way.<br />Find the right people, understand the account, identify useful signals.</>}
                    buttonText="Start Using SimpLeads →"
                    onButtonClick={() => setAuthModalOpen(true)}
                />
            </main>

            <Footer />
        </div>
    );
}
