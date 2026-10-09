"use client";

import React, { useEffect, useRef, useState } from 'react';
import { HeroHeader } from '@/components/ui/hero-section-1';
import Footer from '@/app/components/landing/Footer';
import AuthModal from '@/app/components/AuthModal';
import BottomCTA from '@/app/components/ui/BottomCTA';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
    Users, ShieldCheck, MapPin, Building2, Search, ArrowRight, Zap, 
    CheckCircle2, ChevronDown, Filter, Briefcase, BrainCircuit, Download,
    Layers, Target
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
            <div className={`px-6 transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="text-slate-600 leading-relaxed font-medium">{faq.a}</p>
            </div>
        </div>
    );
}

export default function PeopleSearchPage() {
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

            if (content) {
                gsap.fromTo(content,
                    { x: isLeft ? -50 : 50, opacity: 0 },
                    {
                        x: 0, opacity: 1, duration: 1, ease: 'power3.out',
                        scrollTrigger: { trigger: block, start: 'top 80%', toggleActions: 'play none none reverse' }
                    }
                );
            }

            if (visual) {
                gsap.fromTo(visual,
                    { x: isLeft ? 50 : -50, opacity: 0, scale: 0.95 },
                    {
                        x: 0, opacity: 1, scale: 1, duration: 1, ease: 'power3.out',
                        scrollTrigger: { trigger: block, start: 'top 80%', toggleActions: 'play none none reverse' }
                    }
                );
            }
        });

        // Fade up items
        gsap.utils.toArray('.fade-up-item').forEach(item => {
            gsap.fromTo(item, 
                { y: 40, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
                    scrollTrigger: { trigger: item, start: 'top 85%', toggleActions: 'play none none reverse' }
                }
            );
        });

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    const faqs = [
        {
            q: 'What is People Search in SimpLeads?',
            a: 'People Search is the first stage of the SimpLeads pipeline. It helps you find professionals based on job title, seniority, function, location and available contact information.'
        },
        {
            q: 'Can I search by exact job title?',
            a: 'Yes. People Search includes Person Titles and additional title controls for defining the roles you want to find.'
        },
        {
            q: 'Can I add custom job titles?',
            a: 'Yes. The workflow includes an Extra Titles option for adding custom roles beyond the standard title selections.'
        },
        {
            q: 'Can I search for similar titles?',
            a: 'Yes. People Search includes Include Similar Titles and Include Title Variants options to broaden your search beyond one exact job-title phrase.'
        },
        {
            q: 'Can I filter by seniority?',
            a: 'Yes. Seniority is a separate filtering layer and includes levels such as C-Suite, VP, Director, Manager, Senior, Entry, Owner, Partner and Intern.'
        },
        {
            q: 'Can I filter by department or function?',
            a: 'Yes. Function / Department can be used alongside title, seniority and location criteria.'
        },
        {
            q: 'Can I filter people by location?',
            a: 'Yes. Location can be used as part of your People Search targeting criteria.'
        },
        {
            q: 'Can I filter for people with email or phone information?',
            a: 'Yes. The People Search workflow includes Email Status, Has Email and Has Phone controls.'
        },
        {
            q: 'Does SimpLeads guarantee 100% contact accuracy?',
            a: 'No. SimpLeads should not make a 100% accuracy or deliverability guarantee, particularly while the product is in public beta.'
        },
        {
            q: 'Do I need a separate email-verification workflow?',
            a: 'People Search includes contact-data status controls within the product. However, the exact backend verification methodology should not be overstated until it is formally confirmed.'
        },
        {
            q: 'Can People Search be combined with Company Intelligence?',
            a: 'Yes. People Search is the first stage of the five-step pipeline and can be followed by Company, Jobs, Scoring and Export.'
        },
        {
            q: 'Who is People Search designed for?',
            a: 'It is useful for sales and GTM teams, lead-generation agencies, recruiters, staffing teams, founders and other operators building targeted prospect lists.'
        }
    ];

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-[#1E61ED]/20 selection:text-[#1E61ED] overflow-x-hidden" ref={containerRef}>
            <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
            <HeroHeader onLoginClick={() => setAuthModalOpen(true)} />
            
            {/* Hero Section */}
            <section className="pt-36 pb-16 px-6 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-[#3B82F6]/10 via-[#60efff]/10 to-transparent blur-3xl pointer-events-none" />
                
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <div className="feature-hero-text inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-8">
                        <span className="text-[#1E61ED] text-xs font-bold tracking-[0.2em] uppercase flex items-center gap-2">
                            <Users className="w-3 h-3" /> People Search
                        </span>
                    </div>
                    
                    <h1 className="feature-hero-text text-5xl md:text-7xl font-display font-extrabold text-slate-900 tracking-tight leading-[1.05] mb-8">
                        Find the Right People, <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E61ED] to-[#60efff]">
                            Not Just More Contacts
                        </span>
                    </h1>
                    
                    <p className="feature-hero-text text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto font-medium mb-10 leading-relaxed">
                        Finding more contacts is easy. Finding the right people for your target audience is the harder part. SimpLeads People Search helps you build targeted prospect lists using job titles, seniority, function, location and contact-data filters.
                    </p>

                    <div className="feature-hero-text flex flex-col md:flex-row gap-4 justify-center items-center">
                        <button className="px-8 py-4 bg-gradient-to-r from-[#3B82F6] to-[#1E61ED] text-white rounded-full font-bold shadow-lg shadow-blue-500/25 hover:shadow-xl hover:-translate-y-0.5 transition-all w-full md:w-auto cursor-pointer">
                            Try People Search
                        </button>
                        <Link href="/features" className="px-8 py-4 bg-white text-[#1E61ED] border border-blue-100 rounded-full font-bold shadow-sm hover:bg-slate-50 hover:-translate-y-0.5 transition-all w-full md:w-auto flex items-center justify-center gap-2">
                            See the Five-Step Pipeline <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Main Screenshot Section */}
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
                            <img src="/features_images/people_search.png" alt="People Search Dashboard" className="w-full h-full object-cover object-top opacity-95 hover:opacity-100 transition-opacity duration-300" />
                        </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-8 mt-12 max-w-4xl mx-auto text-center md:text-left">
                        <div className="flex gap-4 items-start">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                <Filter className="w-5 h-5 text-[#1E61ED]" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 mb-2">Targeting Criteria</h4>
                                <p className="text-slate-500 text-sm leading-relaxed">Filters for titles, seniority, function, location and available contact data.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                <Target className="w-5 h-5 text-[#1E61ED]" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 mb-2">Result Estimation</h4>
                                <p className="text-slate-500 text-sm leading-relaxed">Understand filter impact before moving into Company, Jobs or Scoring layers.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Blocks */}
            <section className="py-24 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 space-y-32">
                    
                    {/* Block 1: Role */}
                    <div className="feature-block flex flex-col lg:flex-row gap-16 items-center">
                        <div className="feature-content flex-1 space-y-8 max-w-xl">
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-blue-50 text-[#1E61ED] mb-6">
                                <Users className="w-7 h-7" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900">Search by the Role You Actually Want to Reach</h2>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                A single job title rarely captures every person who could fit your target audience. Someone responsible for growth might appear as:
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {['Head of Growth', 'Growth Lead', 'VP Growth', 'Director of Growth', 'Chief Growth Officer'].map((badge, i) => (
                                    <span key={i} className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-sm font-medium border border-slate-200">{badge}</span>
                                ))}
                            </div>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                SimpLeads gives you controls to broaden or narrow your search without manually building every possible title variation.
                            </p>
                            <ul className="space-y-4 pt-2">
                                {[
                                    { title: 'Person Titles', desc: 'Select the core roles you want to target.' },
                                    { title: 'Extra Titles', desc: 'Add custom titles important to your specific ICP.' },
                                    { title: 'Include Similar Titles', desc: 'Expand search to relevant variations automatically.' },
                                    { title: 'Include Title Variants', desc: 'Capture alternative spellings or phrasings.' }
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <div className="mt-1 rounded-full p-1 bg-[#1E61ED] text-white shrink-0">
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                        </div>
                                        <div>
                                            <span className="text-slate-900 font-bold block">{item.title}</span>
                                            <span className="text-slate-500 text-sm">{item.desc}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <div className="feature-visual flex-1 w-full perspective-1000">
                            {/* Custom UI Block for Roles */}
                            <div className="relative rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xl bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
                                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-2xl" />
                                <div className="relative z-10 space-y-6">
                                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="font-bold text-sm text-slate-700">Person Titles</label>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            <div className="px-3 py-1.5 rounded-md bg-blue-50 border border-blue-100 text-blue-700 text-sm flex items-center gap-2">Marketing Manager <span className="opacity-50 hover:opacity-100 cursor-pointer">×</span></div>
                                            <div className="px-3 py-1.5 rounded-md bg-blue-50 border border-blue-100 text-blue-700 text-sm flex items-center gap-2">Head of Marketing <span className="opacity-50 hover:opacity-100 cursor-pointer">×</span></div>
                                            <input type="text" placeholder="Add title..." className="outline-none text-sm bg-transparent w-24" />
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                                        <label className="font-bold text-sm text-slate-700 block mb-4">Role Match Mode</label>
                                        <div className="flex items-center gap-3 bg-slate-50 p-1 rounded-lg border border-slate-200">
                                            <button className="flex-1 py-2 rounded-md bg-white shadow-sm border border-slate-200 text-sm font-bold text-slate-800">Any</button>
                                            <button className="flex-1 py-2 rounded-md text-sm font-medium text-slate-500 hover:text-slate-800">All</button>
                                            <button className="flex-1 py-2 rounded-md text-sm font-medium text-slate-500 hover:text-slate-800">Exact</button>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center justify-between">
                                            <span className="text-sm font-bold text-slate-700">Include Similar Titles</span>
                                            <div className="w-10 h-6 bg-[#1E61ED] rounded-full relative shadow-inner">
                                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                                            </div>
                                        </div>
                                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center justify-between">
                                            <span className="text-sm font-bold text-slate-700">Include Title Variants</span>
                                            <div className="w-10 h-6 bg-[#1E61ED] rounded-full relative shadow-inner">
                                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Block 2: Seniority */}
                    <div className="feature-block flex flex-col lg:flex-row-reverse gap-16 items-center">
                        <div className="feature-content flex-1 space-y-8 max-w-xl">
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-purple-50 text-purple-600 mb-6">
                                <Layers className="w-7 h-7" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900">Filter by Seniority, Not Just Job Title</h2>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                The same title can represent very different levels of authority. A search for Marketing Manager, for example, should not be treated the same way as a search for a VP of Marketing or CMO.
                            </p>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                People Search lets you combine job-title targeting with seniority criteria, giving you another layer of control over who enters your prospect list.
                            </p>

                            <div className="mt-6 p-6 rounded-2xl bg-purple-50 border border-purple-100">
                                <h4 className="font-bold text-purple-900 mb-2">Why it matters</h4>
                                <p className="text-purple-800 text-sm leading-relaxed">
                                    If your product is designed for decision-makers, filtering by title alone may leave your team with a list that is technically relevant but commercially weak. <strong>Target the role. Then target the level of responsibility.</strong>
                                </p>
                            </div>
                        </div>
                        
                        <div className="feature-visual flex-1 w-full perspective-1000">
                            <div className="relative rounded-2xl bg-slate-900 p-8 shadow-2xl overflow-hidden border border-slate-800">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />
                                <div className="relative z-10">
                                    <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2"><Layers className="w-5 h-5 text-purple-400" /> Seniority Levels</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {['C-Suite', 'VP', 'Director', 'Manager', 'Senior', 'Entry', 'Owner', 'Partner', 'Intern'].map((level, i) => (
                                            <div key={i} className={`px-4 py-2 rounded-lg font-bold text-sm cursor-pointer transition-all ${['C-Suite', 'VP', 'Director'].includes(level) ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] border border-purple-400' : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700 hover:text-white'}`}>
                                                {level}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-8 p-4 rounded-xl bg-slate-800/50 border border-slate-700 backdrop-blur-sm">
                                        <div className="flex justify-between text-slate-400 text-sm font-medium mb-2">
                                            <span>Results preview</span>
                                            <span className="text-purple-400">Targeting Decision Makers</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-purple-500 w-[65%]" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Block 3: Function & Location */}
                    <div className="feature-block flex flex-col lg:flex-row gap-16 items-center">
                        <div className="feature-content flex-1 space-y-8 max-w-xl">
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-emerald-50 text-emerald-600 mb-6">
                                <MapPin className="w-7 h-7" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900">Target by Function and Location</h2>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                Job title is only one part of your targeting criteria. Use Function / Department and Location to narrow your audience further.
                            </p>
                            
                            <div className="grid sm:grid-cols-2 gap-4 my-6">
                                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                                    <div className="text-sm text-slate-500 mb-1 font-medium">Search A</div>
                                    <div className="font-bold text-slate-800">Sales + VP + India</div>
                                </div>
                                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                                    <div className="text-sm text-slate-500 mb-1 font-medium">Search B</div>
                                    <div className="font-bold text-slate-800">Marketing + Manager + US</div>
                                </div>
                            </div>

                            <p className="text-lg text-slate-600 leading-relaxed">
                                Layering these filters helps you move from broad professional discovery toward a more specific ICP. Use People Search to define:
                            </p>
                            <ul className="space-y-3 pt-2">
                                <li className="flex items-center gap-3"><strong className="text-slate-800 min-w-[100px]">Who</strong> <span className="text-slate-500">&rarr; Job title</span></li>
                                <li className="flex items-center gap-3"><strong className="text-slate-800 min-w-[100px]">What level</strong> <span className="text-slate-500">&rarr; Seniority</span></li>
                                <li className="flex items-center gap-3"><strong className="text-slate-800 min-w-[100px]">Which function</strong> <span className="text-slate-500">&rarr; Department / function</span></li>
                                <li className="flex items-center gap-3"><strong className="text-slate-800 min-w-[100px]">Where</strong> <span className="text-slate-500">&rarr; Location</span></li>
                            </ul>
                        </div>
                        
                        <div className="feature-visual flex-1 w-full perspective-1000">
                             <div className="relative rounded-2xl bg-white border border-slate-200 p-8 shadow-xl">
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-sm font-bold text-slate-700 block mb-3">Location</label>
                                        <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700">
                                            <MapPin className="w-5 h-5 text-emerald-500" />
                                            <span className="font-medium">United States, United Kingdom, Canada</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold text-slate-700 block mb-3">Department / Function</label>
                                        <div className="flex flex-wrap gap-2">
                                            {['Marketing', 'Sales', 'Engineering', 'Operations', 'Finance', 'HR'].map((dep, i) => (
                                                <div key={i} className={`px-4 py-2 rounded-lg text-sm font-medium border ${['Marketing', 'Sales'].includes(dep) ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-slate-200 text-slate-600'}`}>
                                                    {dep}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div className="pt-4 border-t border-slate-100">
                                        <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                                    <Users className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <div className="text-xs font-bold text-emerald-100 uppercase tracking-wider">Estimated Audience</div>
                                                    <div className="text-xl font-bold">14,500 leads</div>
                                                </div>
                                            </div>
                                            <ArrowRight className="w-5 h-5 text-emerald-100" />
                                        </div>
                                    </div>
                                </div>
                             </div>
                        </div>
                    </div>

                    {/* Block 4: Contact Info */}
                    <div className="feature-block flex flex-col lg:flex-row-reverse gap-16 items-center">
                        <div className="feature-content flex-1 space-y-8 max-w-xl">
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-sky-50 text-sky-600 mb-6">
                                <ShieldCheck className="w-7 h-7" />
                            </div>
                            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900">Find Available Contact Information Before You Export</h2>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                Not every prospect record contains the same contact information. SimpLeads provides contact-data controls so you can filter your results based on what is available.
                            </p>
                            <ul className="space-y-4 pt-2">
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 rounded-full p-1 bg-sky-500 text-white shrink-0"><CheckCircle2 className="w-3.5 h-3.5" /></div>
                                    <div><strong className="text-slate-800">Email Status:</strong> <span className="text-slate-600">Use the available email-status options when refining your search.</span></div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 rounded-full p-1 bg-sky-500 text-white shrink-0"><CheckCircle2 className="w-3.5 h-3.5" /></div>
                                    <div><strong className="text-slate-800">Has Email:</strong> <span className="text-slate-600">Filter for records where email information is available.</span></div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 rounded-full p-1 bg-sky-500 text-white shrink-0"><CheckCircle2 className="w-3.5 h-3.5" /></div>
                                    <div><strong className="text-slate-800">Has Phone:</strong> <span className="text-slate-600">Filter for records where phone information is available.</span></div>
                                </li>
                            </ul>
                            
                            <div className="p-5 rounded-xl border border-amber-200 bg-amber-50">
                                <div className="font-bold text-amber-900 mb-2 flex items-center gap-2">Important Notice</div>
                                <p className="text-sm text-amber-800 leading-relaxed">
                                    SimpLeads does not claim that every contact is accurate, deliverable or complete. The product is in public beta, and the exact backend verification methodology should not be overstated until technically confirmed.
                                </p>
                            </div>
                        </div>
                        
                        <div className="feature-visual flex-1 w-full perspective-1000">
                             <div className="relative rounded-2xl bg-slate-900 p-8 shadow-2xl overflow-hidden border border-slate-800">
                                <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-sky-500/20 rounded-full blur-3xl" />
                                <div className="relative z-10 space-y-6">
                                    
                                    <div className="bg-slate-800/80 backdrop-blur-md rounded-xl p-5 border border-slate-700">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-white font-bold text-sm">Has Email</span>
                                            <div className="flex gap-2">
                                                <button className="px-4 py-1.5 rounded-lg bg-sky-500 text-white text-sm font-bold shadow-sm">Yes</button>
                                                <button className="px-4 py-1.5 rounded-lg bg-slate-700 text-slate-400 text-sm font-bold">No</button>
                                                <button className="px-4 py-1.5 rounded-lg bg-slate-700 text-slate-400 text-sm font-bold">Any</button>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-white font-bold text-sm">Has Phone</span>
                                            <div className="flex gap-2">
                                                <button className="px-4 py-1.5 rounded-lg bg-sky-500 text-white text-sm font-bold shadow-sm">Yes</button>
                                                <button className="px-4 py-1.5 rounded-lg bg-slate-700 text-slate-400 text-sm font-bold">No</button>
                                                <button className="px-4 py-1.5 rounded-lg bg-slate-700 text-slate-400 text-sm font-bold">Any</button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-slate-800/80 backdrop-blur-md rounded-xl p-5 border border-slate-700">
                                        <label className="text-white font-bold text-sm block mb-4">Email Status</label>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-5 h-5 rounded-full bg-sky-500 flex items-center justify-center"><CheckCircle2 className="w-3 h-3 text-white" /></div>
                                                <span className="text-slate-300 text-sm">Verified (Highest Deliverability)</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-5 h-5 rounded-full border-2 border-slate-600" />
                                                <span className="text-slate-400 text-sm">Catch-All (Accept-All)</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-5 h-5 rounded-full border-2 border-slate-600" />
                                                <span className="text-slate-400 text-sm">Guessed / Extrapolated</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                </div>
                             </div>
                        </div>
                    </div>
                    
                </div>
            </section>

            {/* Pipeline Section */}
            <section className="py-24 px-6 bg-[#0a1128] text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1E61ED]/20 via-[#0a1128] to-[#0a1128] pointer-events-none" />
                <div className="max-w-5xl mx-auto relative z-10 text-center">
                    <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 tracking-tight text-white fade-up-item">See How Your Filters Change the Search</h2>
                    <p className="text-lg text-slate-400 mb-20 max-w-3xl mx-auto fade-up-item">
                        Before moving deeper into the workflow, use the available result estimation to understand how your criteria affect the size of your prospect set. People Search is not an isolated database—it is the starting point of the qualification workflow.
                    </p>

                    <div className="relative max-w-4xl mx-auto fade-up-item">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 relative">
                            {/* Line connecting items */}
                            <div className="absolute top-[28px] left-0 w-full h-[2px] bg-slate-800 hidden md:block" />
                            <div className="absolute top-[28px] left-0 w-[15%] h-[2px] bg-gradient-to-r from-transparent to-[#1E61ED] hidden md:block" />
                            
                            {[
                                { title: 'People Search', icon: Users, color: 'text-blue-400 border-blue-400 shadow-[0_0_15px_rgba(96,165,250,0.5)] bg-blue-400/10' },
                                { title: 'Company', icon: Building2, color: 'text-slate-500 border-slate-700 bg-[#0a1128]' },
                                { title: 'Jobs', icon: Briefcase, color: 'text-slate-500 border-slate-700 bg-[#0a1128]' },
                                { title: 'Qualification', icon: BrainCircuit, color: 'text-slate-500 border-slate-700 bg-[#0a1128]' },
                                { title: 'Export', icon: Download, color: 'text-slate-500 border-slate-700 bg-[#0a1128]' }
                            ].map((step, i) => (
                                <div key={i} className="relative z-10 flex flex-col items-center gap-3">
                                    <div className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all ${step.color}`}>
                                        <step.icon className="w-6 h-6" />
                                    </div>
                                    <div className={`font-bold text-sm ${i === 0 ? 'text-white' : 'text-slate-500'}`}>{step.title}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Progression Text Section */}
            <section className="py-24 px-6 bg-slate-50">
                <div className="max-w-4xl mx-auto text-center fade-up-item">
                    <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 mb-8 tracking-tight">People Search Is the First Step, Not the Final Answer</h2>
                    <p className="text-xl text-slate-600 mb-12 leading-relaxed">
                        A person can match your target role and still be the wrong prospect. They may work at the wrong type of company, lack a relevant business signal, or lack the authority you need. That is why SimpLeads continues beyond People Search.
                    </p>
                    
                    <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-4">
                        {[
                            { title: 'People', desc: 'Who is relevant?' },
                            { title: 'Company', desc: 'Does the account fit?' },
                            { title: 'Jobs', desc: 'Active business signal?' },
                            { title: 'Scoring', desc: 'Worth prioritizing?' },
                            { title: 'Export', desc: 'Take to next workflow' }
                        ].map((step, i) => (
                            <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
                                <div className="text-xs font-bold text-[#1E61ED] uppercase tracking-wider mb-2">Step {i + 1}</div>
                                <div className="font-bold text-slate-900 mb-1">{step.title}</div>
                                <div className="text-sm text-slate-500">{step.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Band */}
            <BottomCTA 
                title={<>Build a More Targeted<br/>Contact List</>}
                buttonText="Try People Search"
            />

            {/* FAQ Section */}
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
