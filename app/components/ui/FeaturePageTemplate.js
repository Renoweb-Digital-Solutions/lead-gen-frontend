"use client";

import React, { useEffect, useRef, useState } from 'react';
import { HeroHeader } from '@/components/ui/hero-section-1';
import Footer from '@/app/components/landing/Footer';
import AuthModal from '@/app/components/AuthModal';
import BottomCTA from '@/app/components/ui/BottomCTA';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
    CheckCircle2, ChevronDown, ArrowRight
} from 'lucide-react';
import Link from 'next/link';

function FAQItem({ faq }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden transition-all duration-300 hover:border-[#1E61ED]/30 shadow-sm">
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
            >
                <span className="font-bold text-lg text-slate-900 pr-8">{faq.q}</span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${isOpen ? 'bg-[#1E61ED] text-white' : 'bg-slate-100 text-slate-500'}`}>
                    <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </button>
            <div className={`px-6 transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[800px] pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">{faq.a}</div>
            </div>
        </div>
    );
}

export default function FeaturePageTemplate({ data }) {
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
        
        gsap.fromTo('.feature-hero-text', 
            { y: 30, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out' }
        );

        const blocks = gsap.utils.toArray('.feature-block');
        blocks.forEach((block, i) => {
            const isLeft = i % 2 === 0;
            const content = block.querySelector('.feature-content');
            const visual = block.querySelector('.feature-visual');

            if (content) {
                gsap.fromTo(content,
                    { x: isLeft ? -50 : 50, opacity: 0 },
                    { x: 0, opacity: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: block, start: 'top 80%', toggleActions: 'play none none reverse' } }
                );
            }
            if (visual) {
                gsap.fromTo(visual,
                    { x: isLeft ? 50 : -50, opacity: 0, scale: 0.95 },
                    { x: 0, opacity: 1, scale: 1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: block, start: 'top 80%', toggleActions: 'play none none reverse' } }
                );
            }
        });

        gsap.utils.toArray('.fade-up-item').forEach(item => {
            gsap.fromTo(item, 
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: item, start: 'top 85%', toggleActions: 'play none none reverse' } }
            );
        });

        return () => { ScrollTrigger.getAll().forEach(t => t.kill()); };
    }, []);

    const { hero, screenshot, blocks, ctaBand, faqs, extraSections } = data;

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-[#1E61ED]/20 selection:text-[#1E61ED] overflow-x-hidden" ref={containerRef}>
            <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
            <HeroHeader onLoginClick={() => setAuthModalOpen(true)} />
            
            {/* Hero */}
            <section className="pt-36 pb-16 px-6 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-[#3B82F6]/10 via-[#60efff]/10 to-transparent blur-3xl pointer-events-none" />
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <div className="feature-hero-text inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-8">
                        <span className="text-[#1E61ED] text-xs font-bold tracking-[0.2em] uppercase flex items-center gap-2">
                            {hero.badgeIcon && <hero.badgeIcon className="w-3 h-3" />} {hero.badgeText}
                        </span>
                    </div>
                    
                    <h1 className="feature-hero-text text-5xl md:text-7xl font-display font-extrabold text-slate-900 tracking-tight leading-[1.05] mb-8" dangerouslySetInnerHTML={{__html: hero.title}} />
                    
                    <div className="feature-hero-text text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto font-medium mb-10 leading-relaxed whitespace-pre-wrap">
                        {hero.description}
                    </div>

                    <div className="feature-hero-text flex flex-col md:flex-row gap-4 justify-center items-center">
                        <button className="px-8 py-4 bg-gradient-to-r from-[#3B82F6] to-[#1E61ED] text-white rounded-full font-bold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:-translate-y-0.5 transition-all w-full md:w-auto cursor-pointer">
                            {hero.primaryCta}
                        </button>
                        {hero.secondaryCta && (
                            <Link href={hero.secondaryCtaLink || "/features"} className="px-8 py-4 bg-white text-[#1E61ED] border border-blue-100 rounded-full font-bold shadow-sm hover:bg-slate-50 hover:-translate-y-0.5 transition-all w-full md:w-auto flex items-center justify-center gap-2">
                                {hero.secondaryCta} <ArrowRight className="w-4 h-4" />
                            </Link>
                        )}
                    </div>
                </div>
            </section>

            {/* Screenshot */}
            <section className="py-12 px-6 fade-up-item">
                <div className="max-w-6xl mx-auto relative z-20 perspective-1000">
                    <div className="relative rounded-2xl bg-white border border-slate-200 p-2 shadow-2xl transition-transform hover:scale-[1.01] duration-500">
                        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 bg-slate-50/50 rounded-t-xl">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-slate-300" />
                                <div className="w-3 h-3 rounded-full bg-slate-300" />
                                <div className="w-3 h-3 rounded-full bg-slate-300" />
                            </div>
                        </div>
                        <div className="bg-slate-100 rounded-b-xl overflow-hidden flex items-center justify-center aspect-[16/9] md:aspect-[21/9]">
                            <img src={screenshot.imageSrc} alt="Feature View" className="w-full h-full object-cover object-top opacity-95 hover:opacity-100 transition-opacity duration-300" />
                        </div>
                    </div>
                    {screenshot.captions && screenshot.captions.length > 0 && (
                        <div className="grid md:grid-cols-2 gap-8 mt-12 max-w-4xl mx-auto text-center md:text-left">
                            {screenshot.captions.map((cap, i) => (
                                <div key={i} className="flex gap-4 items-start">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                        {cap.icon && <cap.icon className="w-5 h-5 text-[#1E61ED]" />}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 mb-2">{cap.title}</h4>
                                        <div className="text-slate-500 text-sm leading-relaxed whitespace-pre-wrap">{cap.description}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Blocks */}
            <section className="py-24 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 space-y-32">
                    {blocks.map((block, i) => (
                        <div key={i} className={`feature-block flex flex-col ${i % 2 !== 0 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-16 items-center`}>
                            <div className="feature-content flex-1 space-y-8 max-w-xl">
                                {block.icon && (
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${block.iconBgClass || 'bg-blue-50 text-[#1E61ED]'} mb-6`}>
                                        <block.icon className="w-7 h-7" />
                                    </div>
                                )}
                                <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900">{block.title}</h2>
                                <div className="text-lg text-slate-600 leading-relaxed space-y-4">
                                    {block.content}
                                </div>
                                {block.bullets && (
                                    <ul className="space-y-4 pt-2">
                                        {block.bullets.map((item, j) => (
                                            <li key={j} className="flex items-start gap-3">
                                                <div className="mt-1 rounded-full p-1 bg-[#1E61ED] text-white shrink-0">
                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                </div>
                                                <div>
                                                    <span className="text-slate-900 font-bold block">{item.title}</span>
                                                    {item.desc && <div className="text-slate-500 text-sm mt-1">{item.desc}</div>}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {block.callout && (
                                    <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 mt-6">
                                        {block.callout}
                                    </div>
                                )}
                            </div>
                            <div className="feature-visual flex-1 w-full perspective-1000">
                                {block.visualComponent ? (
                                    block.visualComponent
                                ) : block.imageSrc ? (
                                    <div className="relative rounded-2xl bg-white border border-slate-200 p-2 shadow-xl overflow-hidden group">
                                        <div className="absolute inset-0 bg-[#1E61ED]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <img src={block.imageSrc} alt="" className="w-full h-auto rounded-xl object-cover" />
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            
            {/* Custom Extra Sections */}
            {extraSections && extraSections.map((Section, idx) => <Section key={idx} />)}

            {/* Bottom CTA */}
            <BottomCTA 
                title={ctaBand.title}
                buttonText={ctaBand.buttonText}
            />

            {/* FAQs */}
            <section className="py-24 px-6 bg-slate-50 border-t border-slate-200">
                <div className="max-w-3xl mx-auto fade-up-item">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-display font-extrabold text-slate-900 tracking-tight mb-4">Frequently Asked Questions</h2>
                        <div className="w-24 h-1 bg-[#1E61ED] mx-auto rounded-full" />
                    </div>
                    
                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <FAQItem key={i} faq={faq} />
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
