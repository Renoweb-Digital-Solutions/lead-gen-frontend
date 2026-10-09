"use client";

import React, { useState } from 'react';
import { HeroHeader } from '@/components/ui/hero-section-1';
import Footer from '@/app/components/landing/Footer';
import AuthModal from '@/app/components/AuthModal';
import BottomCTA from '@/app/components/ui/BottomCTA';
import { Mail, Phone, Calendar, ArrowRight, Building2, User, Building, MessageSquare } from 'lucide-react';
import Head from 'next/head';

export default function ContactPage() {
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate form submission
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-[#023dbb]/20">
            <Head>
                <title>Request a Demo | Simpleads Enterprise Lead Intelligence</title>
                <meta name="description" content="See Simpleads in action -- book a demo to explore custom AI scoring, API access and enterprise-grade lead intelligence." />
            </Head>
            
            <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
            
            <div className="relative z-50">
                <HeroHeader onLoginClick={() => setAuthModalOpen(true)} />
            </div>

            <main className="pt-32 pb-24">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-32">
                    
                    {/* LEFT SIDE: Hero Text & Content */}
                    <div className="flex flex-col justify-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 font-bold text-sm mb-6 w-fit border border-blue-100">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            Contact Sales
                        </div>
                        
                        <h1 className="text-5xl md:text-6xl font-display font-extrabold tracking-tight mb-6 text-slate-900">
                            Request a <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#023dbb] to-[#4ec8ef]">SimpLeads</span> Demo
                        </h1>
                        <p className="text-xl text-slate-500 mb-12 leading-relaxed">
                            For teams evaluating Enterprise-scale needs — custom AI scoring, API access, or SSO — talk to us directly before you commit.
                        </p>

                        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 mb-10">
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">Talk to Sales About Enterprise Lead Data</h3>
                            <p className="text-slate-600 leading-relaxed">
                                If your team needs custom AI scoring logic, API access, or dedicated onboarding support beyond the self-serve Starter and Pro plans, a quick call is the fastest way to scope what Enterprise looks like for your workflow.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                                    <Calendar className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">Book a call</h4>
                                    <p className="text-sm text-slate-500">with a data specialist</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center">
                                    <Mail className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">Email us</h4>
                                    <p className="text-sm text-slate-500">enterprise@simpleads.live</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE: Demo Form */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#023dbb]/5 to-purple-500/5 rounded-[2.5rem] transform rotate-3 scale-105 -z-10"></div>
                        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-2xl shadow-slate-200/50 p-8 sm:p-10 relative z-10">
                            {isSubmitted ? (
                                <div className="text-center py-16">
                                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-4">Request Received!</h3>
                                    <p className="text-slate-500">
                                        Our enterprise team will reach out shortly to schedule your personalized demo.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700">First Name</label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                <input required type="text" className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-[#023dbb] focus:ring-2 focus:ring-[#023dbb]/20 transition-all" placeholder="John" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700">Last Name</label>
                                            <div className="relative">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                <input required type="text" className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-[#023dbb] focus:ring-2 focus:ring-[#023dbb]/20 transition-all" placeholder="Doe" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700">Work Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input required type="email" className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-[#023dbb] focus:ring-2 focus:ring-[#023dbb]/20 transition-all" placeholder="john@company.com" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700">Company Name</label>
                                        <div className="relative">
                                            <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input required type="text" className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-[#023dbb] focus:ring-2 focus:ring-[#023dbb]/20 transition-all" placeholder="Acme Corp" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700">How can we help?</label>
                                        <div className="relative">
                                            <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                                            <textarea rows={4} className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-[#023dbb] focus:ring-2 focus:ring-[#023dbb]/20 transition-all resize-none" placeholder="Tell us about your lead generation goals..."></textarea>
                                        </div>
                                    </div>

                                    <button 
                                        type="submit" 
                                        disabled={isSubmitting}
                                        className="w-full bg-[#023dbb] text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 hover:bg-[#023dbb]/90 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? (
                                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : (
                                            <>Request a Demo <ArrowRight className="w-5 h-5" /></>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>

                {/* CTA BAND (Using reusable BottomCTA) */}
                <BottomCTA 
                    title={<>Ready to talk specifics?<br/>Enterprise scoring, API access, SSO.</>}
                    buttonText="Request a Demo"
                    onButtonClick={() => {
                        // Normally this would scroll to the form or open a modal
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                />
            </main>

            <Footer />
        </div>
    );
}
