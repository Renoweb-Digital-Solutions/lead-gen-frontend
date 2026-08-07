"use client";

import React, { useEffect, useRef, useState } from 'react';
import { HeroHeader } from '@/components/ui/hero-section-1';
import Footer from '@/app/components/landing/Footer';
import AuthModal from '@/app/components/AuthModal';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Target, MapPin, Activity, Camera, Menu, ArrowRight, Download, Share2, Layers } from 'lucide-react';

export default function FeaturesPage() {
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
        
        // Initial hero fade in
        gsap.fromTo('.feature-hero-text', 
            { y: 30, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: 'power3.out' }
        );

        // Feature blocks scroll reveal
        const blocks = gsap.utils.toArray('.feature-block');
        blocks.forEach((block, i) => {
            const isLeft = i % 2 === 0;
            const content = block.querySelector('.feature-content');
            const visual = block.querySelector('.feature-visual');

            gsap.fromTo(content,
                { x: isLeft ? -50 : 50, opacity: 0 },
                {
                    x: 0, opacity: 1, duration: 1, ease: 'power3.out',
                    scrollTrigger: {
                        trigger: block,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );

            gsap.fromTo(visual,
                { x: isLeft ? 50 : -50, opacity: 0, scale: 0.95 },
                {
                    x: 0, opacity: 1, scale: 1, duration: 1, ease: 'power3.out',
                    scrollTrigger: {
                        trigger: block,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });

        // Unifying strip animation
        gsap.fromTo('.unifying-icon',
            { scale: 0, opacity: 0, y: 20 },
            {
                scale: 1, opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'back.out(1.5)',
                scrollTrigger: {
                    trigger: '.unifying-section',
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            }
        );

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    const features = [
        {
            id: 'leadgen',
            title: 'Lead Gen Pipeline',
            subtitle: 'Target with pinpoint precision.',
            description: 'Build hyper-targeted lead lists with our guided workflow. Filter by job title, seniority, and verify contact data instantly.',
            bullets: [
                'Live estimator recalculates matches in real time',
                'Verified email & phone contact data',
                'Preview cards showing real contact results'
            ],
            icon: Target,
            color: 'from-[#023dbb] to-[#308fef]',
            textColor: 'text-[#023dbb]',
            image: '/features_images/lead-gen.png',
            imageAlign: 'right'
        },
        {
            id: 'gmaps',
            title: 'Google Maps Engine',
            subtitle: 'Dominate local markets globally.',
            description: 'Turn any city or region into a fully enriched list of local businesses in seconds using AI-assisted keywords.',
            bullets: [
                'AI auto-suggests relevant search terms',
                'Global radar-style scanning visual',
                'Extract business names, phones, and websites'
            ],
            icon: MapPin,
            color: 'from-[#0ea5e9] to-[#38bdf8]',
            textColor: 'text-[#0ea5e9]',
            image: '/features_images/gmaps.png',
            imageAlign: 'left'
        },
        {
            id: 'youtube',
            title: 'YouTube Lead Scraper',
            subtitle: 'Find contactable creators at scale.',
            description: 'Extract creator and channel leads with verified emails from any niche keyword.',
            bullets: [
                'Filter by Gmail, Yahoo, or custom domains',
                'Real-time signal-scanner visual',
                'Uncover hidden creator contact info'
            ],
            icon: Activity,
            color: 'from-[#ef4444] to-[#f87171]',
            textColor: 'text-[#ef4444]',
            image: '/features_images/yt.png',
            imageAlign: 'right'
        },
        {
            id: 'instagram',
            title: 'Instagram Scraper',
            subtitle: 'Capture engaged followers directly.',
            description: 'Pull followers or commenters directly from any profile or post URL into a clean lead list.',
            bullets: [
                'Adjustable extraction volume (50–500)',
                'Target competitor followers instantly',
                'Follower orbit visualization'
            ],
            icon: Camera,
            color: 'from-[#d946ef] to-[#f472b6]',
            textColor: 'text-[#d946ef]',
            image: '/features_images/ig.png',
            imageAlign: 'left'
        },
        {
            id: 'b2b',
            title: 'B2B Directory Scraper',
            subtitle: 'Source from major marketplaces.',
            description: 'Extract structured business data from directories like Yellow Pages and IndiaMART by keyword and location.',
            bullets: [
                'Bulk extraction from top B2B directories',
                'Directory network node graph visualization',
                'Verified supplier and buyer data'
            ],
            icon: Menu,
            color: 'from-[#6366f1] to-[#818cf8]',
            textColor: 'text-[#6366f1]',
            image: '/features_images/b2b.png',
            imageAlign: 'right'
        }
    ];

    return (
        <div className="min-h-screen bg-white text-brand-dark font-sans selection:bg-brand-cyan/30 selection:text-brand-dark overflow-x-hidden" ref={containerRef}>
            <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
            <HeroHeader onLoginClick={() => setAuthModalOpen(true)} />
            
            {/* Hero Section */}
            <section className="pt-36 pb-20 px-6 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#023dbb]/5 to-transparent blur-3xl pointer-events-none" />
                
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <div className="feature-hero-text inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-sky/10 border border-brand-blue/10 mb-8">
                        <span className="text-brand-blue text-xs font-bold tracking-[0.2em] uppercase">
                            Platform Features
                        </span>
                    </div>
                    
                    <h1 className="feature-hero-text text-5xl md:text-7xl font-display font-extrabold text-brand-dark tracking-tight leading-[1.05] mb-8">
                        The ultimate engine for <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#023dbb] to-[#4ec8ef]">
                            predictable growth.
                        </span>
                    </h1>
                    
                    <p className="feature-hero-text text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto font-medium">
                        Stop stitching together fragmented tools. SimpleAds gives you five powerful extraction engines in one unified platform.
                    </p>
                </div>
            </section>

            {/* Feature Blocks */}
            <section className="py-12 md:py-24">
                <div className="max-w-7xl mx-auto px-6 space-y-32 md:space-y-48">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        const isRightAlign = feature.imageAlign === 'right';
                        
                        return (
                            <div key={feature.id} className={`feature-block flex flex-col gap-12 lg:gap-24 items-center ${isRightAlign ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                                
                                {/* Content Side */}
                                <div className="feature-content flex-1 space-y-8 max-w-xl">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${feature.color} text-white shadow-lg shadow-${feature.color.split(' ')[0].replace('from-', '')}/30`}>
                                        <Icon className="w-7 h-7" />
                                    </div>
                                    
                                    <div>
                                        <h2 className="text-3xl md:text-4xl font-display font-bold text-brand-dark mb-4">
                                            {feature.title}
                                        </h2>
                                        <p className={`text-xl font-semibold ${feature.textColor} mb-4`}>
                                            {feature.subtitle}
                                        </p>
                                        <p className="text-lg text-slate-500 leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                    
                                    <ul className="space-y-4 pt-4 border-t border-slate-100">
                                        {feature.bullets.map((bullet, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <div className={`mt-1 rounded-full p-1 bg-gradient-to-br ${feature.color} text-white shrink-0`}>
                                                    <ArrowRight className="w-3 h-3" />
                                                </div>
                                                <span className="text-slate-600 font-medium">{bullet}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                
                                {/* Visual Side */}
                                <div className="feature-visual flex-1 w-full max-w-2xl perspective-1000">
                                    <div className={`relative rounded-2xl bg-white border border-slate-200 p-2 shadow-xl transition-all duration-500 hover:rotate-y-[5deg] hover:rotate-x-[2deg] hover:scale-[1.02] hover:shadow-[0_20px_40px_-10px_${feature.color.split(' ')[0].replace('from-', '')}40]`}>
                                        {/* Browser Chrome */}
                                        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 bg-slate-50/50 rounded-t-xl">
                                            <div className="flex gap-1.5">
                                                <div className="w-3 h-3 rounded-full bg-red-400" />
                                                <div className="w-3 h-3 rounded-full bg-amber-400" />
                                                <div className="w-3 h-3 rounded-full bg-green-400" />
                                            </div>
                                            <div className="ml-4 h-5 w-48 bg-white rounded-md border border-slate-200/60" />
                                        </div>
                                        {/* App Image Mockup */}
                                        <div className="relative overflow-hidden rounded-b-xl bg-slate-100 aspect-[16/10]">
                                            <img 
                                                src={feature.image} 
                                                alt={feature.title} 
                                                className="absolute inset-0 w-full h-full object-cover object-top opacity-90 mix-blend-multiply" 
                                            />
                                            {/* Subtle animated glow overlays based on feature type */}
                                            <div className={`absolute inset-0 bg-gradient-to-tr ${feature.color} opacity-5 mix-blend-overlay`} />
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Unifying Strip Section */}
            <section className="unifying-section py-24 md:py-32 relative bg-slate-50/50 border-t border-slate-100 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />
                
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-display font-extrabold text-brand-dark mb-16 tracking-tight">
                        One Pipeline. <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#023dbb] to-[#4ec8ef]">Every Source.</span>
                    </h2>
                    
                    <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-4 lg:gap-8">
                        {/* Source Icons */}
                        <div className="flex items-center justify-center gap-3 flex-wrap">
                            {features.map((f, i) => {
                                const Icon = f.icon;
                                return (
                                    <div key={i} className={`unifying-icon w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center bg-white shadow-lg border border-slate-100 text-[#023dbb] relative z-10`}>
                                        <Icon className="w-6 h-6 md:w-8 md:h-8" />
                                    </div>
                                );
                            })}
                        </div>
                        
                        {/* Funnel/Pipeline Flow (Desktop) */}
                        <div className="hidden md:flex items-center gap-2 unifying-icon opacity-40 text-brand-blue">
                            <span className="w-12 h-[2px] bg-brand-blue" />
                            <Layers className="w-8 h-8" />
                            <span className="w-12 h-[2px] bg-brand-blue" />
                        </div>
                        
                        {/* Funnel/Pipeline Flow (Mobile) */}
                        <div className="flex md:hidden flex-col items-center gap-2 unifying-icon opacity-40 text-brand-blue py-4">
                            <span className="w-[2px] h-8 bg-brand-blue" />
                            <Layers className="w-8 h-8" />
                            <span className="w-[2px] h-8 bg-brand-blue" />
                        </div>
                        
                        {/* Export Destination */}
                        <div className="unifying-icon w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#023dbb] to-[#4ec8ef] text-white shadow-[0_10px_30px_rgba(2,61,187,0.3)] relative z-10">
                            <Download className="w-8 h-8 md:w-10 md:h-10" />
                        </div>
                    </div>
                    
                    <p className="mt-16 text-lg text-slate-500 font-medium max-w-2xl mx-auto">
                        Stop managing CSVs from five different scrapers. Every contact you extract flows seamlessly into one centralized, enriched database ready for outreach.
                    </p>
                </div>
            </section>

            <Footer />
        </div>
    );
}
