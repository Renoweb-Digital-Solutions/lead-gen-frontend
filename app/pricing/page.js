"use client";

import React, { useEffect, useRef, useState } from 'react';
import { HeroHeader } from '@/components/ui/hero-section-1';
import Footer from '@/app/components/landing/Footer';
import AuthModal from '@/app/components/AuthModal';
import { Check, Info, X } from 'lucide-react';

export default function PricingPage() {
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [isAnnual, setIsAnnual] = useState(false);
    const [hoveredTier, setHoveredTier] = useState(null);

    const tiers = [
        {
            id: 'starter',
            name: 'Starter',
            positioning: 'For solo prospectors.',
            monthlyPrice: 49,
            annualPrice: 39,
            features: [
                '1,000 Export Credits /mo',
                'Core Lead Gen Pipeline',
                'Standard Support',
                '1 User Seat'
            ],
            missingFeatures: [
                'Google Maps Engine',
                'YouTube & IG Scrapers',
                'B2B Directory Scraper'
            ],
            color: 'slate',
            ctaText: 'Start Building',
            popular: false
        },
        {
            id: 'growth',
            name: 'Growth',
            positioning: 'For scaling outreach.',
            monthlyPrice: 99,
            annualPrice: 79,
            features: [
                '5,000 Export Credits /mo',
                'Core Lead Gen Pipeline',
                'Google Maps Engine',
                'Priority Support',
                '3 User Seats'
            ],
            missingFeatures: [
                'YouTube & IG Scrapers',
                'B2B Directory Scraper'
            ],
            color: 'blue',
            ctaText: 'Start Growing',
            popular: true
        },
        {
            id: 'scale',
            name: 'Scale',
            positioning: 'The complete arsenal.',
            monthlyPrice: 199,
            annualPrice: 159,
            features: [
                '20,000 Export Credits /mo',
                'All 5 Extraction Engines',
                'YouTube & IG Scrapers',
                'B2B Directory Scraper',
                'Dedicated Success Manager',
                'Unlimited User Seats'
            ],
            missingFeatures: [],
            color: 'indigo',
            ctaText: 'Get the Arsenal',
            popular: false
        }
    ];

    return (
        <div className="min-h-screen bg-white text-brand-dark font-sans selection:bg-brand-cyan/30 selection:text-brand-dark overflow-x-hidden relative">
            <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
            <HeroHeader onLoginClick={() => setAuthModalOpen(true)} />
            
            {/* Animated Background Blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-sky/20 rounded-full mix-blend-multiply filter blur-[100px] animate-[blob_7s_infinite]" />
                <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-300/20 rounded-full mix-blend-multiply filter blur-[100px] animate-[blob_7s_infinite_2s]" />
                <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-pink-300/20 rounded-full mix-blend-multiply filter blur-[100px] animate-[blob_7s_infinite_4s]" />
            </div>
            
            <main className="relative z-10 pt-36 pb-24 px-6 max-w-7xl mx-auto">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-display font-extrabold text-brand-dark tracking-tight leading-[1.05] mb-6">
                        Pricing that scales with <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#023dbb] to-[#4ec8ef]">
                            your pipeline.
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-medium mb-10">
                        Start for free, then upgrade as you grow. No hidden fees, no complex credit systems. Just raw lead generation power.
                    </p>

                    {/* Toggle Switch */}
                    <div className="flex items-center justify-center gap-4">
                        <span className={`text-sm font-semibold transition-colors ${!isAnnual ? 'text-brand-dark' : 'text-slate-400'}`}>Monthly</span>
                        
                        <button 
                            onClick={() => setIsAnnual(!isAnnual)}
                            className="relative w-16 h-8 rounded-full bg-slate-200 border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
                        >
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#023dbb] to-[#4ec8ef] opacity-0 transition-opacity" style={{ opacity: isAnnual ? 1 : 0 }} />
                            <div className={`absolute top-1/2 -translate-y-1/2 left-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ease-spring ${isAnnual ? 'translate-x-8' : 'translate-x-0'}`} />
                        </button>
                        
                        <div className="flex items-center gap-2">
                            <span className={`text-sm font-semibold transition-colors ${isAnnual ? 'text-brand-dark' : 'text-slate-400'}`}>Annually</span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-bold animate-in fade-in zoom-in duration-300">
                                Save 20%
                            </span>
                        </div>
                    </div>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 perspective-1000">
                    {tiers.map((tier) => {
                        const isHovered = hoveredTier === tier.id;
                        const anyHovered = hoveredTier !== null;
                        const isDimmed = anyHovered && !isHovered;
                        
                        return (
                            <div 
                                key={tier.id}
                                onMouseEnter={() => setHoveredTier(tier.id)}
                                onMouseLeave={() => setHoveredTier(null)}
                                className={`relative rounded-3xl p-8 bg-white border transition-all duration-500 flex flex-col
                                    ${tier.popular ? 'border-[#023dbb]/30 shadow-[0_20px_60px_-15px_rgba(2,61,187,0.15)] md:-mt-4 md:mb-4' : 'border-slate-200 shadow-xl'}
                                    ${isHovered ? 'scale-105 shadow-2xl rotate-y-[2deg] rotate-x-[2deg] z-20' : ''}
                                    ${isDimmed ? 'opacity-60 scale-95 blur-[2px] z-0' : 'z-10'}
                                `}
                                style={{ transformStyle: 'preserve-3d' }}
                            >
                                {tier.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#023dbb] to-[#4ec8ef] text-white text-xs font-bold uppercase tracking-wider shadow-lg transform translate-z-[20px]">
                                        Most Popular
                                    </div>
                                )}
                                
                                <div className="mb-8 transform translate-z-[10px]">
                                    <h3 className="text-2xl font-bold text-brand-dark mb-2">{tier.name}</h3>
                                    <p className="text-sm text-slate-500 font-medium h-5">{tier.positioning}</p>
                                </div>
                                
                                <div className="mb-8 transform translate-z-[30px]">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-5xl font-display font-extrabold text-brand-dark tracking-tight transition-all duration-300">
                                            ${isAnnual ? tier.annualPrice : tier.monthlyPrice}
                                        </span>
                                        <span className="text-slate-500 font-medium">/mo</span>
                                    </div>
                                    <div className="h-6 mt-1 text-sm text-green-600 font-semibold opacity-0 transition-opacity duration-300" style={{ opacity: isAnnual ? 1 : 0 }}>
                                        Billed ${tier.annualPrice * 12} yearly
                                    </div>
                                </div>
                                
                                <button 
                                    onClick={() => setAuthModalOpen(true)}
                                    className={`w-full py-3.5 rounded-xl font-bold transition-all duration-300 transform translate-z-[40px] mb-8
                                        ${tier.popular 
                                            ? 'bg-gradient-to-r from-[#023dbb] to-[#4ec8ef] text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5' 
                                            : 'bg-slate-100 text-brand-dark hover:bg-slate-200'
                                        }
                                    `}
                                >
                                    {tier.ctaText}
                                </button>
                                
                                <div className="flex-1 transform translate-z-[20px]">
                                    <ul className="space-y-4">
                                        {tier.features.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <div className="mt-0.5 rounded-full p-0.5 bg-green-100 text-green-600 shrink-0">
                                                    <Check className="w-3.5 h-3.5" />
                                                </div>
                                                <span className="text-slate-700 text-sm font-medium">{feature}</span>
                                            </li>
                                        ))}
                                        {tier.missingFeatures.map((feature, i) => (
                                            <li key={`missing-${i}`} className="flex items-start gap-3 opacity-50">
                                                <div className="mt-0.5 rounded-full p-0.5 bg-slate-100 text-slate-400 shrink-0">
                                                    <X className="w-3.5 h-3.5" />
                                                </div>
                                                <span className="text-slate-500 text-sm">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* FAQ Section */}
                <div className="mt-32 max-w-3xl mx-auto">
                    <h2 className="text-3xl font-display font-bold text-center text-brand-dark mb-12">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {[
                            { q: "What counts as an 'Export Credit'?", a: "One credit equals one lead row exported with contact data. Viewing leads in the platform does not consume credits." },
                            { q: "Can I upgrade or downgrade anytime?", a: "Absolutely. When you upgrade, your new limits are applied immediately and prorated. Downgrades take effect at the next billing cycle." },
                            { q: "Do unused credits roll over?", a: "No, export credits reset at the beginning of each billing month to keep pricing simple and predictable." },
                            { q: "What if I need custom limits or API access?", a: "We offer custom Enterprise plans. Contact us via the Request a Demo page to discuss your specific high-volume requirements." }
                        ].map((faq, i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                <h3 className="text-lg font-bold text-brand-dark mb-2">{faq.q}</h3>
                                <p className="text-slate-600 font-medium">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <style jsx global>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .perspective-1000 {
                    perspective: 1000px;
                }
                .ease-spring {
                    transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
                }
            `}</style>

            <Footer />
        </div>
    );
}
