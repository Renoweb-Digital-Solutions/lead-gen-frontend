"use client";

import React, { useEffect, useRef, useState } from 'react';
import { HeroHeader } from '@/components/ui/hero-section-1';
import Footer from '@/app/components/landing/Footer';
import AuthModal from '@/app/components/AuthModal';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Target, MapPin, Activity, Camera, Building, ArrowRight, Zap, Sparkles } from 'lucide-react';

export default function ChangelogPage() {
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const containerRef = useRef(null);
    const timelineRef = useRef(null);

    const milestones = [
        {
            id: 'may',
            month: 'May 2026',
            title: 'Foundation: Raw Lead Generation',
            description: 'Launch of the core Lead Gen Pipeline: person and company filters, contact data requirements, job title targeting, live lead estimator, and scoring/export flow. The powerful engine the rest of the platform was built around.',
            color: 'from-blue-500 to-indigo-500',
            textColor: 'text-blue-600',
            icons: [Target],
            animationType: 'pulse'
        },
        {
            id: 'june',
            month: 'June 2026',
            title: 'Local Expansion: Google Maps',
            description: 'SimpleAds goes local — any city, any niche. Launch of the Google Maps Search tool featuring AI-suggested keywords and an animated global radar search experience.',
            color: 'from-teal-400 to-cyan-500',
            textColor: 'text-teal-500',
            icons: [MapPin],
            animationType: 'radar'
        },
        {
            id: 'july',
            month: 'July 2026',
            title: 'Multi-Channel Explosion',
            description: 'One platform, every corner of the internet. A massive triple launch month introducing the YouTube Lead Scraper, Instagram Lead Scraper, and B2B Directory Scraper (Yellow Pages & IndiaMART).',
            color: 'from-rose-500 via-fuchsia-500 to-indigo-500',
            textColor: 'text-fuchsia-500',
            icons: [Activity, Camera, Building],
            animationType: 'orbit'
        }
    ];

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
        
        // Hero animation
        gsap.fromTo('.changelog-hero', 
            { y: 30, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out' }
        );

        // Timeline central line "draw" animation
        gsap.fromTo('.timeline-line-fill',
            { height: '0%' },
            {
                height: '100%',
                ease: 'none',
                scrollTrigger: {
                    trigger: timelineRef.current,
                    start: 'top 50%',
                    end: 'bottom 80%',
                    scrub: 1
                }
            }
        );

        // Milestone nodes and cards scroll reveal
        const nodes = gsap.utils.toArray('.milestone-node');
        nodes.forEach((node, i) => {
            const isLeft = i % 2 === 0;
            const card = node.querySelector('.milestone-card');
            const dot = node.querySelector('.milestone-dot');

            // Dot pop in
            gsap.fromTo(dot,
                { scale: 0, opacity: 0 },
                {
                    scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)',
                    scrollTrigger: {
                        trigger: node,
                        start: 'top 75%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );

            // Card slide and 3D tilt in
            gsap.fromTo(card,
                { x: isLeft ? 50 : -50, opacity: 0, rotationY: isLeft ? -15 : 15, rotationX: 10 },
                {
                    x: 0, opacity: 1, rotationY: 0, rotationX: 0, duration: 1, ease: 'power3.out',
                    scrollTrigger: {
                        trigger: node,
                        start: 'top 75%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });

        // Future node animation
        gsap.fromTo('.future-node',
            { scale: 0.9, opacity: 0, y: 30 },
            {
                scale: 1, opacity: 1, y: 0, duration: 1, ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.future-node',
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            }
        );

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return (
        <div className="min-h-screen bg-white text-brand-dark font-sans selection:bg-brand-cyan/30 selection:text-brand-dark overflow-x-hidden" ref={containerRef}>
            <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
            <HeroHeader onLoginClick={() => setAuthModalOpen(true)} />
            
            {/* Hero Section */}
            <section className="pt-36 pb-24 px-6 relative overflow-hidden">
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="changelog-hero inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-sky/10 border border-brand-blue/10 mb-8">
                        <Sparkles className="w-4 h-4 text-brand-blue" />
                        <span className="text-brand-blue text-xs font-bold tracking-[0.2em] uppercase">
                            Product Updates
                        </span>
                    </div>
                    
                    <h1 className="changelog-hero text-5xl md:text-7xl font-display font-extrabold text-brand-dark tracking-tight leading-[1.05] mb-8">
                        The evolution of <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#023dbb] to-[#4ec8ef]">
                            SimpleAds.
                        </span>
                    </h1>
                    
                    <p className="changelog-hero text-xl text-slate-500 max-w-2xl mx-auto font-medium">
                        See how we're constantly shipping powerful new engines to help you find and engage your best buyers instantly.
                    </p>
                </div>
            </section>

            {/* Vertical Timeline Section */}
            <section className="py-12 pb-32">
                <div className="max-w-5xl mx-auto px-6 relative" ref={timelineRef}>
                    
                    {/* The Central Line */}
                    <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-slate-100 md:-translate-x-1/2 rounded-full overflow-hidden">
                        <div className="timeline-line-fill w-full bg-gradient-to-b from-[#023dbb] via-[#4ec8ef] to-purple-500 shadow-[0_0_15px_rgba(48,143,239,0.5)]" />
                    </div>

                    <div className="space-y-24 md:space-y-32 perspective-1000">
                        {milestones.map((milestone, i) => {
                            const isLeft = i % 2 === 0;
                            return (
                                <div key={milestone.id} className={`milestone-node relative flex flex-col md:flex-row items-start md:items-center ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                                    
                                    {/* Timeline Dot */}
                                    <div className="absolute left-8 md:left-1/2 top-0 md:top-1/2 -translate-x-1/2 md:-translate-y-1/2 z-10 milestone-dot w-6 h-6 md:w-8 md:h-8 rounded-full bg-white border-4 border-slate-100 shadow-[0_0_0_4px_white] flex items-center justify-center">
                                        <div className={`w-full h-full rounded-full bg-gradient-to-br ${milestone.color} animate-pulse`} />
                                    </div>

                                    {/* Empty Spacer for alternating layout */}
                                    <div className="hidden md:block w-1/2 px-12" />

                                    {/* Content Card */}
                                    <div className="w-full md:w-1/2 pl-20 md:pl-0 md:px-12 pt-1 md:pt-0">
                                        <div className="milestone-card relative bg-white p-8 md:p-10 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:border-slate-200 transition-all duration-300" style={{ transformStyle: 'preserve-3d' }}>
                                            
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className={`px-4 py-1.5 rounded-full bg-slate-50 border border-slate-100 ${milestone.textColor} font-bold text-sm tracking-wider uppercase`}>
                                                    {milestone.month}
                                                </div>
                                                <div className="flex gap-2">
                                                    {milestone.icons.map((Icon, idx) => (
                                                        <div key={idx} className={`w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br ${milestone.color} text-white shadow-md`}>
                                                            <Icon className="w-4 h-4" />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            
                                            <h3 className="text-3xl font-display font-bold text-brand-dark mb-4">{milestone.title}</h3>
                                            <p className="text-lg text-slate-600 font-medium leading-relaxed">{milestone.description}</p>
                                            
                                            {/* Mini Animation Decorator */}
                                            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl -z-10 transform rotate-12 opacity-50" />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Future "What's Next" Node */}
                        <div className="future-node relative pt-12">
                            <div className="absolute left-8 md:left-1/2 top-12 -translate-x-1/2 z-10 w-8 h-8 rounded-full bg-white border-4 border-slate-100 shadow-[0_0_0_4px_white] flex items-center justify-center">
                                <Zap className="w-4 h-4 text-amber-500 animate-[pulse_2s_infinite]" />
                            </div>

                            <div className="pl-20 md:pl-0 w-full max-w-2xl mx-auto text-center mt-12 md:mt-24">
                                <div className="relative p-1 bg-gradient-to-r from-[#023dbb] via-purple-500 to-[#4ec8ef] rounded-3xl overflow-hidden shadow-[0_10px_40px_rgba(48,143,239,0.2)]">
                                    <div className="absolute inset-0 bg-white/20 backdrop-blur-3xl" />
                                    <div className="relative bg-white p-8 md:p-12 rounded-[22px] flex flex-col items-center">
                                        <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-500 mb-6 shadow-inner">
                                            <Sparkles className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-3xl font-display font-extrabold text-brand-dark mb-4">What's Next?</h3>
                                        <p className="text-lg text-slate-600 font-medium mb-8 max-w-md">
                                            We're building the future of outbound. Join our insider list to get early access to our next massive engine.
                                        </p>
                                        
                                        <form className="w-full max-w-sm relative flex items-center group" onSubmit={(e) => e.preventDefault()}>
                                            <input 
                                                type="email" 
                                                placeholder="Enter your email" 
                                                className="w-full pl-6 pr-32 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-4 focus:ring-brand-blue/10 focus:border-brand-blue transition-all font-medium text-brand-dark"
                                            />
                                            <button 
                                                type="submit"
                                                className="absolute right-2 px-5 py-2.5 bg-gradient-to-r from-[#023dbb] to-[#4ec8ef] text-white font-bold rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all group-hover:scale-105"
                                            >
                                                Notify Me
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
