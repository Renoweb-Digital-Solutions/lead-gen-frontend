"use client";

import React, { useEffect, useRef, useState } from 'react';
import { HeroHeader } from '@/components/ui/hero-section-1';
import Footer from '@/app/components/landing/Footer';
import AuthModal from '@/app/components/AuthModal';
import { Check, X, Zap, ChevronDown, Database, Cpu, Search, Layers, Box, Code } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function PricingPage() {
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [isAnnual, setIsAnnual] = useState(false);
    const containerRef = useRef(null);

    const tiers = [
        {
            id: 'starter',
            name: 'Starter',
            positioning: 'For testing the pipeline.',
            monthlyPrice: 49,
            annualPrice: 39,
            features: [
                'Core People + Company search',
                '1,000 monthly leads',
                'CSV export',
                'Standard Support'
            ],
            missingFeatures: [
                'Hiring Signals',
                'AI Lead Scoring',
                'CRM Push',
                'Custom AI scoring',
                'API access'
            ],
            color: 'from-slate-400 to-slate-600',
            buttonColor: 'bg-white/10 hover:bg-white/20 text-white',
            borderColor: 'border-white/10 hover:border-slate-400/50',
            ctaText: 'Start on Starter',
            popular: false
        },
        {
            id: 'pro',
            name: 'Pro',
            positioning: 'For active outbound teams.',
            monthlyPrice: 99,
            annualPrice: 79,
            features: [
                'Full pipeline included',
                'Hiring Signals integration',
                'AI Lead Scoring',
                'Higher monthly limits',
                'Direct CRM push'
            ],
            missingFeatures: [
                'Custom AI scoring',
                'API access'
            ],
            color: 'from-[#1E61ED] to-[#60efff]',
            buttonColor: 'bg-gradient-to-r from-[#1E61ED] to-[#60efff] text-white hover:shadow-[0_0_20px_rgba(30,97,237,0.4)]',
            borderColor: 'border-[#1E61ED]/50 shadow-[0_0_30px_rgba(30,97,237,0.15)]',
            ctaText: 'Start Free on Pro',
            popular: true
        },
        {
            id: 'enterprise',
            name: 'Enterprise',
            positioning: 'For teams at scale.',
            monthlyPrice: 'Custom',
            annualPrice: 'Custom',
            features: [
                'Unlimited leads',
                'Custom AI scoring models',
                'API access',
                'Dedicated support',
                'Usage-based billing'
            ],
            missingFeatures: [],
            color: 'from-amber-400 to-yellow-600',
            buttonColor: 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]',
            borderColor: 'border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.15)]',
            ctaText: 'Contact Sales',
            popular: false
        }
    ];

    const faqs = [
        {
            q: "How much does a real-time lead enrichment tool cost per month?",
            a: "Simpleads offers Starter, Pro and Enterprise tiers with published monthly pricing -- see the plans table above for current rates and limits."
        },
        {
            q: "What's an affordable alternative to ZoomInfo's enterprise pricing?",
            a: "Simpleads' Enterprise plan is usage-based rather than a fixed multi-year contract -- see the Simpleads vs ZoomInfo comparison page for a full breakdown."
        },
        {
            q: "Is there a lead gen tool with transparent, published pricing like Apollo?",
            a: "Yes -- Simpleads publishes Starter and Pro pricing directly; only Enterprise-scale custom needs require a sales conversation."
        }
    ];

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        // Hero stagger
        gsap.fromTo('.pricing-hero', 
            { y: 30, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out' }
        );

        // 3D Wobble cards
        const cards = gsap.utils.toArray('.pricing-card');
        cards.forEach((card, i) => {
            gsap.fromTo(card,
                { y: 50, opacity: 0, rotateX: 10, rotateY: i === 0 ? -10 : i === 2 ? 10 : 0 },
                {
                    y: 0, opacity: 1, rotateX: 0, rotateY: 0, duration: 1.2, delay: 0.2 + i * 0.1, ease: 'elastic.out(1, 0.75)'
                }
            );

            // Add smooth silky floating animation
            gsap.to(card, {
                y: "-=10",
                duration: 2 + Math.random(),
                yoyo: true,
                repeat: -1,
                ease: "sine.inOut",
                delay: Math.random()
            });
        });

        // Feature blocks scroll reveal
        gsap.utils.toArray('.feature-block').forEach(block => {
            gsap.fromTo(block,
                { y: 30, opacity: 0, scale: 0.95 },
                {
                    y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out',
                    scrollTrigger: { trigger: block, start: 'top 85%' }
                }
            );
        });

        // FAQ reveal
        gsap.fromTo('.faq-item',
            { x: -20, opacity: 0 },
            {
                x: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out',
                scrollTrigger: { trigger: '.faq-container', start: 'top 80%' }
            }
        );

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    // FAQ Component
    const FAQItem = ({ faq }) => {
        const [isOpen, setIsOpen] = useState(false);
        return (
            <div className="faq-item border border-white/10 rounded-2xl bg-white/5 backdrop-blur-md overflow-hidden transition-all duration-300 hover:border-white/20">
                <button 
                    onClick={() => setIsOpen(!isOpen)} 
                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                    <span className="font-bold text-lg text-white pr-8">{faq.q}</span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${isOpen ? 'bg-[#1E61ED] text-white' : 'bg-white/10 text-white/50'}`}>
                        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                </button>
                <div className={`px-6 transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <p className="text-slate-300 leading-relaxed font-medium">{faq.a}</p>
                </div>
            </div>
        );
    };

    return (
        <div ref={containerRef} className="min-h-screen bg-[#05050A] text-white font-sans selection:bg-[#1E61ED]/30 selection:text-white overflow-x-hidden relative">
            <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
            
            {/* Nav Wrapper - Dark Theme Override */}
            <div className="pricing-nav-wrapper relative z-50">
                <HeroHeader onLoginClick={() => setAuthModalOpen(true)} />
            </div>

            {/* Dark Theme Ambient Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                {/* 3D Rotating Module Visuals */}
                <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-gradient-to-br from-[#1E61ED]/20 to-purple-600/10 rounded-full blur-[120px] animate-[spin_15s_linear_infinite]" />
                <div className="absolute bottom-[10%] left-[5%] w-[600px] h-[600px] bg-gradient-to-tr from-[#60efff]/10 to-amber-500/10 rounded-full blur-[150px] animate-[spin_20s_linear_infinite_reverse]" />
                <div className="absolute top-[50%] right-[30%] w-[400px] h-[400px] bg-gradient-to-br from-yellow-500/10 to-amber-600/10 rounded-full blur-[120px] animate-[spin_18s_linear_infinite]" />
                
                <div className="absolute top-[30%] left-[20%] text-white/5 animate-[spin_30s_linear_infinite]">
                    <Box className="w-64 h-64" strokeWidth={0.5} />
                </div>
                <div className="absolute bottom-[20%] right-[15%] text-[#1E61ED]/5 animate-[spin_25s_linear_infinite_reverse]">
                    <Layers className="w-96 h-96" strokeWidth={0.5} />
                </div>
            </div>

            <main className="relative z-10 pt-32 pb-24 px-6 max-w-7xl mx-auto">
                {/* Hero Section */}
                <div className="text-center mb-20">
                    <div className="pricing-hero inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300 font-semibold text-sm mb-6 backdrop-blur-md">
                        <Zap className="w-4 h-4 text-[#60efff]" />
                        B2B Lead Generation Software Pricing
                    </div>
                    <h1 className="pricing-hero text-5xl md:text-6xl lg:text-7xl font-display font-extrabold text-white tracking-tight leading-[1.05] mb-6">
                        Plans for Every <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E61ED] to-[#60efff]">
                            Team Size.
                        </span>
                    </h1>
                    <p className="pricing-hero text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-medium mb-12">
                        Straightforward, published pricing -- no "contact sales" wall before you can see a number, unless you actually need enterprise-scale customization.
                    </p>

                    {/* Toggle Switch */}
                    <div className="pricing-hero flex items-center justify-center gap-4">
                        <span className={`text-sm font-semibold transition-colors ${!isAnnual ? 'text-white' : 'text-slate-500'}`}>Monthly</span>
                        
                        <button 
                            onClick={() => setIsAnnual(!isAnnual)}
                            className="relative w-16 h-8 rounded-full bg-white/10 border border-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-[#1E61ED]/50 backdrop-blur-md hover:bg-white/20"
                        >
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#1E61ED] to-[#60efff] opacity-0 transition-opacity" style={{ opacity: isAnnual ? 1 : 0 }} />
                            <div className={`absolute top-1/2 -translate-y-1/2 left-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ease-spring ${isAnnual ? 'translate-x-8' : 'translate-x-0'}`} />
                        </button>
                        
                        <div className="flex items-center gap-2">
                            <span className={`text-sm font-semibold transition-colors ${isAnnual ? 'text-white' : 'text-slate-500'}`}>Annually</span>
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#1E61ED]/20 text-[#60efff] border border-[#1E61ED]/30 text-xs font-bold">
                                Save 20%
                            </span>
                        </div>
                    </div>
                </div>

                {/* Pricing Cards - 3D Wobble */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 perspective-1000 mb-32">
                    {tiers.map((tier) => (
                        <div 
                            key={tier.id}
                            className={`pricing-card relative rounded-[2rem] p-8 backdrop-blur-xl border transition-all duration-300 flex flex-col group
                                ${tier.borderColor} 
                                bg-gradient-to-b from-white/5 to-white/[0.02]
                                hover:-translate-y-2 hover:shadow-2xl hover:border-white/30
                            `}
                        >
                            {tier.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#1E61ED] to-[#60efff] text-white text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(30,97,237,0.5)]">
                                    Most Popular
                                </div>
                            )}
                            
                            <div className="mb-6">
                                <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                                <p className="text-sm text-slate-400 font-medium">{tier.positioning}</p>
                            </div>
                            
                            <div className="mb-8">
                                <div className="flex items-baseline gap-1">
                                    {typeof tier.monthlyPrice === 'number' ? (
                                        <>
                                            <span className={`text-5xl font-display font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br ${tier.color}`}>
                                                ${isAnnual ? tier.annualPrice : tier.monthlyPrice}
                                            </span>
                                            <span className="text-slate-500 font-medium">/mo</span>
                                        </>
                                    ) : (
                                        <span className={`text-5xl font-display font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br ${tier.color}`}>
                                            {tier.monthlyPrice}
                                        </span>
                                    )}
                                </div>
                                <div className="h-6 mt-1 text-sm text-[#60efff] font-semibold opacity-0 transition-opacity duration-300" style={{ opacity: isAnnual && typeof tier.monthlyPrice === 'number' ? 1 : 0 }}>
                                    Billed ${tier.annualPrice * 12} yearly
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => setAuthModalOpen(true)}
                                className={`w-full py-4 rounded-xl font-bold transition-all duration-300 mb-8 ${tier.buttonColor}`}
                            >
                                {tier.ctaText}
                            </button>
                            
                            <div className="flex-1">
                                <ul className="space-y-4">
                                    {tier.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <div className="mt-0.5 rounded-full p-0.5 bg-white/10 text-[#60efff] shrink-0 border border-white/5">
                                                <Check className="w-3.5 h-3.5" />
                                            </div>
                                            <span className="text-slate-200 text-sm font-medium">{feature}</span>
                                        </li>
                                    ))}
                                    {tier.missingFeatures.map((feature, i) => (
                                        <li key={`missing-${i}`} className="flex items-start gap-3 opacity-40">
                                            <div className="mt-0.5 rounded-full p-0.5 bg-white/5 text-slate-500 shrink-0 border border-white/5">
                                                <X className="w-3.5 h-3.5" />
                                            </div>
                                            <span className="text-slate-400 text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Content Blocks + Feature Grid */}
                <div className="space-y-8 mb-32">
                    <h2 className="text-3xl font-display font-bold text-center text-white mb-12">Lead Database Pricing Plans, Side by Side</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="feature-block bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm hover:bg-white/10 transition-colors group">
                            <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform duration-300">
                                <Database className="w-6 h-6 text-slate-300" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Starter covers the core</h3>
                            <p className="text-slate-400 leading-relaxed">
                                People and Company search for teams testing the pipeline. Ideal for solo prospectors running focused campaigns.
                            </p>
                        </div>
                        
                        <div className="feature-block bg-[#1E61ED]/10 border border-[#1E61ED]/30 p-8 rounded-3xl backdrop-blur-sm hover:bg-[#1E61ED]/20 transition-colors group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#60efff]/20 blur-3xl rounded-full" />
                            <div className="w-12 h-12 bg-[#1E61ED] rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(30,97,237,0.5)] group-hover:scale-110 transition-transform duration-300 relative z-10">
                                <Cpu className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3 relative z-10">AI Lead Scoring Pricing</h3>
                            <p className="text-slate-300 leading-relaxed relative z-10">
                                AI Scoring is included from the Pro plan up -- not a separate add-on purchase, unlike several competing platforms that price hiring-signal or scoring data as a premium tier.
                            </p>
                        </div>

                        <div className="feature-block bg-gradient-to-br from-amber-900/10 to-yellow-900/5 border border-amber-500/30 p-8 rounded-3xl backdrop-blur-sm hover:bg-amber-900/20 transition-colors group relative overflow-hidden">
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-amber-500/20 blur-3xl rounded-full" />
                            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(245,158,11,0.4)] group-hover:scale-110 transition-transform duration-300 relative z-10">
                                <Code className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3 relative z-10">Enterprise Sales Intelligence</h3>
                            <p className="text-slate-300 leading-relaxed relative z-10">
                                Enterprise plans include custom AI scoring and API access, priced against actual usage rather than a fixed multi-year contract. See the ZoomInfo comparison for a direct contrast.
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA Band */}
                <div className="feature-block relative rounded-[3rem] overflow-hidden bg-gradient-to-r from-[#071330] to-[#0A051A] border border-white/10 p-12 md:p-20 text-center mb-32 shadow-2xl">
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#1E61ED]/20 rounded-full blur-[100px] pointer-events-none"></div>
                    
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">Start on Starter, upgrade only when you need to.</h2>
                        <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">Every solution runs on the same pipeline. See full plan details and current limits.</p>
                        <button onClick={() => setAuthModalOpen(true)} className="inline-flex items-center gap-2 px-10 py-5 rounded-2xl bg-white text-black font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                            See Full Pricing
                        </button>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="faq-container max-w-3xl mx-auto mb-20">
                    <h2 className="text-3xl font-display font-bold text-center text-white mb-12">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <FAQItem key={i} faq={faq} />
                        ))}
                    </div>
                </div>
            </main>

            <style jsx global>{`
                .ease-spring {
                    transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                .perspective-1000 {
                    perspective: 1000px;
                }
                
                /* Override Header for Dark Page */
                .pricing-nav-wrapper header nav {
                    transition: all 0.3s ease;
                }
                
                /* Make the navbar glassmorphic dark when scrolled */
                .pricing-nav-wrapper .bg-background\\/50 {
                    background-color: rgba(5, 5, 10, 0.7) !important;
                    border-color: rgba(255, 255, 255, 0.1) !important;
                }
                
                /* Force links to white */
                .pricing-nav-wrapper .text-slate-700 {
                    color: rgba(255, 255, 255, 0.8) !important;
                }
                .pricing-nav-wrapper .text-slate-700:hover {
                    color: rgba(255, 255, 255, 1) !important;
                }
                
                /* Fix Logo Text Colors */
                .pricing-nav-wrapper .text-brand-dark {
                    color: #ffffff !important;
                }
                .pricing-nav-wrapper .text-\[\#023dbb\] {
                    color: #60efff !important;
                }
                
                /* Ensure logo paths become white */
                .pricing-nav-wrapper svg path[fill="#0f172a"], 
                .pricing-nav-wrapper svg path:not([fill="none"]) {
                    fill: #ffffff;
                }
                .pricing-nav-wrapper svg path[fill="#023dbb"] {
                    fill: #60efff !important;
                }
                
                /* Override Login button (Outline variant) */
                .pricing-nav-wrapper button.border-input {
                    border-color: rgba(255, 255, 255, 0.2) !important;
                    color: white !important;
                    background: transparent !important;
                }
                .pricing-nav-wrapper button.border-input:hover {
                    background: rgba(255, 255, 255, 0.1) !important;
                }
                
                /* Exclude dropdowns from white text override */
                .pricing-nav-wrapper .bg-\\[\\#f8f9fa\\] .text-slate-700,
                .pricing-nav-wrapper .bg-\\[\\#f8f9fa\\] .text-slate-900,
                .pricing-nav-wrapper .bg-\\[\\#f8f9fa\\] .text-slate-500 {
                    color: inherit !important;
                }
                .pricing-nav-wrapper .bg-\\[\\#f8f9fa\\] svg path {
                    fill: inherit !important;
                }
            `}</style>

            <Footer theme="dark" />
        </div>
    );
}
