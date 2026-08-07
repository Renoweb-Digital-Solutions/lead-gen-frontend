"use client";

import React, { useState } from 'react';
import { HeroHeader } from '@/components/ui/hero-section-1';
import Footer from '@/app/components/landing/Footer';
import AuthModal from '@/app/components/AuthModal';
import { Send, Building2, Mail, MessageSquare } from 'lucide-react';

export default function ContactPage() {
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 5000);
            e.target.reset();
        }, 1200);
    };

    return (
        <div className="min-h-screen bg-white text-brand-dark overflow-x-hidden font-sans selection:bg-brand-cyan/30 selection:text-brand-dark">
            <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
            <HeroHeader onLoginClick={() => setAuthModalOpen(true)} />
            
            <main className="pt-36 pb-24 px-6 max-w-5xl mx-auto min-h-[75vh] flex flex-col md:flex-row gap-12 md:gap-16">
                
                {/* Left side: Copy & Info */}
                <div className="flex-1 pt-4 md:pt-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-sky/10 border border-brand-blue/10 mb-8">
                        <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
                        <span className="text-brand-blue text-xs font-bold tracking-[0.2em] uppercase">
                            Get in Touch
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-display font-extrabold text-brand-dark tracking-tight leading-[1.05] mb-6">
                        Let's Talk <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#023dbb] to-[#4ec8ef]">
                            Growth.
                        </span>
                    </h1>
                    
                    <p className="text-lg text-slate-500 max-w-md font-medium mb-10 leading-relaxed">
                        Whether you need a custom demo, want to discuss enterprise pricing, or simply want to explore how Simpleads can accelerate your pipeline, our team is here for you.
                    </p>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4 text-slate-600">
                            <div className="w-12 h-12 rounded-2xl bg-[#023dbb]/5 flex items-center justify-center text-[#023dbb] shrink-0">
                                <Building2 className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-brand-dark">Headquarters</h3>
                                <p className="text-sm">63/T Bama Charan Roy Road, Behala, Kolkata, 700034</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-slate-600">
                            <div className="w-12 h-12 rounded-2xl bg-[#023dbb]/5 flex items-center justify-center text-[#023dbb] shrink-0">
                                <Building2 className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-brand-dark">US Office</h3>
                                <p className="text-sm">7364 Kathleen Road, Lakeland, Florida, 33810</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-slate-600">
                            <div className="w-12 h-12 rounded-2xl bg-[#4ec8ef]/10 flex items-center justify-center text-[#4ec8ef] shrink-0">
                                <Mail className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-brand-dark">Support & Sales</h3>
                                <p className="text-sm">sales@renoweb.in</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right side: Form */}
                <div className="flex-[1.2]">
                    <div className="bg-white rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden">
                        
                        {/* Decorative gradient corner */}
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-[#023dbb]/20 to-[#4ec8ef]/20 blur-2xl rounded-full pointer-events-none" />

                        {success ? (
                            <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center animate-in fade-in zoom-in duration-500">
                                <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-green-500 mb-6">
                                    <Send className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-brand-dark mb-2">Message Sent!</h3>
                                <p className="text-slate-500 font-medium">We'll be in touch with you shortly.</p>
                            </div>
                        ) : (
                            <form className="space-y-6 relative" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700">First Name <span className="text-red-500">*</span></label>
                                        <input required type="text" className="w-full px-4 py-3.5 rounded-xl bg-slate-50/50 border border-slate-200 focus:outline-none focus:ring-4 focus:ring-[#023dbb]/10 focus:border-[#023dbb] transition-all font-medium text-brand-dark placeholder:font-normal" placeholder="John" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700">Last Name <span className="text-red-500">*</span></label>
                                        <input required type="text" className="w-full px-4 py-3.5 rounded-xl bg-slate-50/50 border border-slate-200 focus:outline-none focus:ring-4 focus:ring-[#023dbb]/10 focus:border-[#023dbb] transition-all font-medium text-brand-dark placeholder:font-normal" placeholder="Doe" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Work Email <span className="text-red-500">*</span></label>
                                    <input required type="email" className="w-full px-4 py-3.5 rounded-xl bg-slate-50/50 border border-slate-200 focus:outline-none focus:ring-4 focus:ring-[#023dbb]/10 focus:border-[#023dbb] transition-all font-medium text-brand-dark placeholder:font-normal" placeholder="john@company.com" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4 text-slate-400" />
                                        How can we help? <span className="text-red-500">*</span>
                                    </label>
                                    <textarea required rows="4" className="w-full px-4 py-3.5 rounded-xl bg-slate-50/50 border border-slate-200 focus:outline-none focus:ring-4 focus:ring-[#023dbb]/10 focus:border-[#023dbb] transition-all resize-none font-medium text-brand-dark placeholder:font-normal" placeholder="I'd like to schedule a demo to see..."></textarea>
                                </div>

                                <button 
                                    disabled={isSubmitting}
                                    type="submit" 
                                    className="w-full py-4 px-6 bg-gradient-to-r from-[#023dbb] to-[#4ec8ef] text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(2,61,187,0.25)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(2,61,187,0.3)] transition-all duration-300 disabled:opacity-70 disabled:pointer-events-none"
                                >
                                    {isSubmitting ? (
                                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <span>Send Message</span>
                                            <Send className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
