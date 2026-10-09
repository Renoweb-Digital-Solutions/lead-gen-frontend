"use client";

import React, { useEffect, useRef, useState } from 'react';
import { HeroHeader } from '@/components/ui/hero-section-1';
import Footer from '@/app/components/landing/Footer';
import AuthModal from '@/app/components/AuthModal';
import BottomCTA from '@/app/components/ui/BottomCTA';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
    Target, MapPin, Activity, Camera, Menu, ArrowRight, Download, Share2, Layers, 
    Users, Building2, Briefcase, BrainCircuit, Search, FolderSearch, 
    TrendingUp, CheckCircle2, ChevronDown, UserPlus, Presentation, LayoutList, HeartHandshake,
    ChevronRight, Zap
} from 'lucide-react';

import Link from 'next/link';

function FAQItem({ faq }) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden transition-all duration-300 hover:border-brand-blue/30 shadow-sm">
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
            >
                <span className="font-bold text-lg text-brand-dark pr-8">{faq.q}</span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${isOpen ? 'bg-brand-blue text-white' : 'bg-slate-100 text-slate-500'}`}>
                    <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </button>
            <div className={`px-6 transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="text-slate-600 leading-relaxed font-medium">{faq.a}</p>
            </div>
        </div>
    );
}

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

        // Fade up sections (Grid items, Workflow cards, etc)
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

    const coreFeatures = [
        {
            id: 'people',
            title: 'People Search',
            subtitle: 'Find the People Who Match Your Target',
            description: 'Start with the people you actually want to reach. People Search lets you filter professionals using:',
            bullets: [
                'Job titles, Extra titles, Similar titles, Title variants',
                'Seniority, Functions / departments',
                'Location, Email availability/status & Phone availability'
            ],
            extraContent: (
                <div className="mt-6 p-5 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-sm text-slate-600 mb-3"><strong className="text-slate-800">Note:</strong> While using people search if you explicitly ask for verified email which will not bounce, it&apos;s also available inbuilt. No need to verify the mails using another tool.</p>
                    <p className="text-sm text-slate-600"><strong className="text-slate-800">Why it matters:</strong> A relevant prospect is more than a name and job title. People Search gives you control over the criteria that determine whether someone belongs in your target audience.</p>
                </div>
            ),
            cta: 'Explore People Search',
            href: '/features/people-search',
            icon: Users,
            color: 'from-[#023dbb] to-[#308fef]',
            textColor: 'text-[#023dbb]',
            image: '/features_images/people_search.png',
            imageAlign: 'right'
        },
        {
            id: 'company',
            title: 'Company Intelligence',
            subtitle: 'Turn a Contact List Into a Target Account List',
            description: 'Once you know who you want to reach, Company Intelligence helps you determine which businesses fit your targeting criteria. Filter companies using:',
            bullets: [
                'Company name & Domain',
                'Industry',
                'Company keywords (Broad or Exact keyword matching)',
                'Location'
            ],
            extraContent: (
                <div className="mt-6 p-5 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-sm text-slate-600 mb-3">This gives sales and marketing teams a way to layer company context onto their prospecting workflow.</p>
                    <p className="text-sm text-slate-600"><strong className="text-slate-800">Why it matters:</strong> The same job title can exist across thousands of companies. Company Intelligence helps narrow those contacts down to businesses that fit your ICP.</p>
                </div>
            ),
            cta: 'Explore Company Intelligence',
            href: '/features/company-intelligence',
            icon: Building2,
            color: 'from-[#0ea5e9] to-[#38bdf8]',
            textColor: 'text-[#0ea5e9]',
            image: '/features_images/company_filter.png',
            imageAlign: 'left'
        },
        {
            id: 'jobs',
            title: 'Active Job Signals',
            subtitle: 'Add Current Business Activity to Your Prospecting',
            description: 'Active Job Signals let you cross-reference prospects and companies with active job activity. You can work with:',
            bullets: [
                'Job title & Job location',
                'Job recency',
                'Job-data availability & result volume'
            ],
            extraContent: (
                <div className="mt-6 p-5 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-sm text-slate-600 mb-3">Recent hiring activity can be a useful business signal. It may indicate expansion, investment, a new initiative or changing operational requirements.</p>
                    <p className="text-sm text-slate-600"><strong>But it is important to distinguish signal from certainty.</strong> Active Job Signals are business intelligence for prospecting, not an HR or recruitment management system, and an active job does not automatically mean a company is ready to buy.</p>
                </div>
            ),
            cta: 'Explore Active Job Signals',
            href: '/features/activejobsignals',
            icon: Briefcase,
            color: 'from-[#ef4444] to-[#f87171]',
            textColor: 'text-[#ef4444]',
            image: '/features_images/job_signal.png',
            imageAlign: 'right'
        },
        {
            id: 'scoring',
            title: 'AI Lead Qualification & Scoring',
            subtitle: 'Finding Leads Is Only the Beginning',
            description: 'Most prospecting workflows answer: "Who can I contact?" SimpLeads adds another question: "Who should I prioritize?" AI Lead Qualification evaluates opportunities across:',
            bullets: [
                'Need: Does available info suggest a relevant business need?',
                'Urgency: Are there signals suggesting attention is needed sooner?',
                'Relevance: How closely does the target match?',
                'Authority: How relevant is the role to decision-making?'
            ],
            extraContent: (
                <div className="mt-6 p-5 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
                    <p className="text-sm text-slate-600">The scoring layer then helps turn that context into a priority order. <strong>Lead Generation ≠ Lead Qualification.</strong> Generating a larger list does not automatically create a better pipeline. SimpLeads helps move from Discovery → Context → Qualification → Priority.</p>
                    <p className="text-sm text-slate-600"><strong>BANT readiness:</strong> SimpLeads is being developed toward broader BANT-style qualification. Budget / financial qualification is currently in development and should not be presented as a live product capability.</p>
                </div>
            ),
            cta: 'Explore AI Lead Qualification',
            href: '/features/ai-lead-scoring',
            icon: BrainCircuit,
            color: 'from-[#d946ef] to-[#f472b6]',
            textColor: 'text-[#d946ef]',
            image: '/features_images/scoring.png',
            imageAlign: 'left'
        },
        {
            id: 'export',
            title: 'Export',
            subtitle: 'Take Your Qualified Results With You',
            description: 'Once your search and qualification workflow is complete, choose the output that fits your next step. Current export options include:',
            bullets: [
                'Full Bundle & Summary CSV',
                'Leads Only',
                'Jobs Only'
            ],
            extraContent: (
                <div className="mt-6 p-5 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-sm text-slate-600 mb-3">The objective is simple: get the data you actually need without forcing every workflow into the same export format.</p>
                    <p className="text-sm text-slate-600"><strong>Important:</strong> SimpLeads does not currently claim direct HubSpot or Salesforce pushing on this page.</p>
                </div>
            ),
            cta: 'Explore Export',
            href: '/features',
            icon: Download,
            color: 'from-[#6366f1] to-[#818cf8]',
            textColor: 'text-[#6366f1]',
            image: '/features_images/export.png',
            imageAlign: 'right'
        }
    ];

    const discoveryTools = [
        {
            title: 'Google Maps Search',
            subtitle: 'Discover Local Businesses With Search Context',
            description: 'Search for businesses using Business keywords, Location, and Maximum result limits. The tool can also suggest relevant keywords based on company information to help expand a local search.',
            cta: 'Try Google Maps Search',
            href: '/features/google-maps-search',
            icon: MapPin,
            color: 'from-[#0ea5e9] to-[#38bdf8]',
            textColor: 'text-[#0ea5e9]',
            image: '/features_images/gmaps.png'
        },
        {
            title: 'Instagram Lead Scraper',
            subtitle: 'Discover Leads From Instagram Sources',
            description: 'Use supported Instagram sources to extract lead information from relevant profiles and audiences. The workflow supports source selection, target URLs and extraction limits.',
            cta: 'Explore Instagram Lead Scraper',
            href: '/features',
            icon: Camera,
            color: 'from-[#d946ef] to-[#f472b6]',
            textColor: 'text-[#d946ef]',
            image: '/features_images/ig.png'
        },
        {
            title: 'YouTube Lead Scraper',
            subtitle: 'Turn YouTube Discovery Into Prospect Research',
            description: 'Search YouTube using targeted keywords and extract supported lead information, including available email and social-link data. The tool also supports custom email-domain targeting.',
            cta: 'Explore YouTube Lead Scraper',
            href: '/features',
            icon: Activity,
            color: 'from-[#ef4444] to-[#f87171]',
            textColor: 'text-[#ef4444]',
            image: '/features_images/yt.png'
        },
        {
            title: 'B2B Directory Scraper',
            subtitle: 'Search Directories Where Prospects Exist',
            description: 'SimpLeads supports directory-based discovery including Yellow Pages (US) and IndiaMART (B2B). Use keywords and location to discover businesses beyond the standard prospect database.',
            cta: 'Explore B2B Directory Search',
            href: '/features',
            icon: FolderSearch,
            color: 'from-[#6366f1] to-[#818cf8]',
            textColor: 'text-[#6366f1]',
            image: '/features_images/b2b.png'
        },
        {
            title: 'Investor Data Pipeline',
            subtitle: 'Find Investors Based on Company Context',
            description: 'Provide information such as Company description, Industry, Target audience, Investment stage, and Maximum investor results. The pipeline uses this context to plan investor discovery queries.',
            cta: 'Explore Investor Data',
            href: '/features',
            icon: TrendingUp,
            color: 'from-[#10b981] to-[#34d399]',
            textColor: 'text-[#10b981]'
        }
    ];

    const workflows = [
        {
            title: 'For Sales & GTM Teams',
            description: 'Build targeted account and contact lists, add business signals and prioritize prospects before outreach.',
            cta: 'Explore Sales & GTM',
            icon: Presentation,
            color: 'text-[#4ec8ef]',
            image: '/features_images/sales_gtm_ui.png'
        },
        {
            title: 'For Lead Generation & Marketing Agencies',
            description: 'Create focused prospect lists for different clients, industries, locations and campaigns using multiple discovery sources.',
            cta: 'Explore Agency Solutions',
            icon: LayoutList,
            color: 'text-[#d946ef]',
            image: '/features_images/agency_ui.png'
        },
        {
            title: 'For Local & Service Businesses',
            description: 'Use Google Maps and location-based discovery to identify relevant businesses in specific markets.',
            cta: 'Explore Local Business Solutions',
            icon: MapPin,
            color: 'text-[#f59e0b]',
            image: '/features_images/local_business_ui.png'
        },
        {
            title: 'For Recruiters & Staffing Teams',
            description: 'Use company intelligence and Active Job Signals to identify organizations with relevant hiring activity.',
            cta: 'Explore Recruiter Solutions',
            icon: UserPlus,
            color: 'text-[#10b981]',
            image: '/features_images/recruiter_ui.png'
        },
        {
            title: 'For Founders & Small Teams',
            description: 'Build targeted prospect lists and qualify opportunities without creating a complicated prospecting workflow.',
            cta: 'Explore Founder Solutions',
            icon: HeartHandshake,
            color: 'text-[#f43f5e]',
            image: '/features_images/founder_ui.png'
        }
    ];

    const faqs = [
        {
            q: 'What features does SimpLeads include?',
            a: 'SimpLeads includes People Search, Company Intelligence, Active Job Signals, AI Lead Qualification and Scoring, Export, plus separate discovery tools for Google Maps, Instagram, YouTube, B2B directories and investor research.'
        },
        {
            q: 'What are the five steps in the SimpLeads pipeline?',
            a: 'The core pipeline has exactly five stages: People → Company → Jobs → Scoring → Export. The other discovery tools are separate capabilities and are not additional pipeline stages.'
        },
        {
            q: 'What is the difference between Lead Generation and Lead Qualification?',
            a: 'Lead generation helps you find potential contacts. Lead qualification helps you determine which of those contacts are worth prioritizing based on available business context and your targeting requirements.'
        },
        {
            q: 'What does AI Lead Qualification evaluate?',
            a: 'The qualification framework considers Need, Urgency, Relevance and Authority using the available information and your target context.'
        },
        {
            q: 'What are Active Job Signals?',
            a: 'Active Job Signals use recent job activity as an additional business-intelligence signal. They can provide context about company activity but should not be treated as guaranteed buying intent.'
        },
        {
            q: 'Can SimpLeads find local businesses?',
            a: 'Yes. Google Maps Search provides a separate discovery workflow for finding businesses based on keywords and location.'
        },
        {
            q: 'What other discovery sources does SimpLeads support?',
            a: 'SimpLeads includes separate tools for Instagram, YouTube, B2B directories such as IndiaMART and Yellow Pages, and investor discovery.'
        },
        {
            q: 'Is Budget qualification available?',
            a: 'Budget or financial qualification is currently in development. It should not be represented as a live BANT capability.'
        }
    ];

    return (
        <div className="min-h-screen bg-white text-brand-dark font-sans selection:bg-brand-cyan/30 selection:text-brand-dark overflow-x-hidden" ref={containerRef}>
            <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
            <HeroHeader onLoginClick={() => setAuthModalOpen(true)} />
            
            {/* Hero Section */}
            <section className="pt-36 pb-20 px-6 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-[#023dbb]/5 via-[#4ec8ef]/5 to-transparent blur-3xl pointer-events-none" />
                
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <div className="feature-hero-text inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-sky/10 border border-brand-blue/10 mb-8">
                        <span className="text-brand-blue text-xs font-bold tracking-[0.2em] uppercase flex items-center gap-2">
                            <Zap className="w-3 h-3" /> Platform Features
                        </span>
                    </div>
                    
                    <h1 className="feature-hero-text text-5xl md:text-7xl font-display font-extrabold text-brand-dark tracking-tight leading-[1.05] mb-8">
                        Everything You Need to <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#023dbb] to-[#4ec8ef]">
                            Find, Understand & Prioritize
                        </span> <br className="hidden md:block" /> Better Leads
                    </h1>
                    
                    <p className="feature-hero-text text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto font-medium mb-10">
                        SimpLeads combines prospect discovery, company intelligence, business signals and AI-assisted qualification into one lead-generation workflow.
                    </p>

                    <div className="feature-hero-text flex flex-col md:flex-row gap-4 justify-center items-center">
                        <button className="px-8 py-4 bg-gradient-to-r from-[#023dbb] to-[#2066d3] text-white rounded-full font-bold shadow-lg shadow-brand-blue/20 hover:shadow-xl hover:-translate-y-0.5 transition-all w-full md:w-auto">
                            Explore the Features
                        </button>
                        <button className="px-8 py-4 bg-white text-brand-blue border border-brand-blue/20 rounded-full font-bold shadow-sm hover:bg-slate-50 hover:-translate-y-0.5 transition-all w-full md:w-auto flex items-center justify-center gap-2">
                            See How SimpLeads Works <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </section>

            {/* Screenshot Placeholder Section */}
            <section className="py-12 px-6 fade-up-item">
                <div className="max-w-6xl mx-auto relative z-20 perspective-1000">
                    <div className="relative rounded-2xl bg-white border border-slate-200 p-2 shadow-2xl transition-transform hover:scale-[1.01] duration-500">
                        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 bg-slate-50/50 rounded-t-xl">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-400" />
                                <div className="w-3 h-3 rounded-full bg-amber-400" />
                                <div className="w-3 h-3 rounded-full bg-green-400" />
                            </div>
                            <div className="ml-4 h-5 w-48 bg-white rounded-md border border-slate-200/60" />
                        </div>
                        <div className="aspect-[16/9] md:aspect-[21/9] bg-slate-100 rounded-b-xl flex flex-col items-center justify-center relative overflow-hidden">
                            <img src="/features_images/lead-gen.png" alt="SimpLeads Dashboard Workflow" className="absolute inset-0 w-full h-full object-cover object-top opacity-95 hover:opacity-100 transition-opacity duration-300" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Pipeline Block */}
            <section className="py-24 px-6 bg-slate-50/50 border-y border-slate-100 relative overflow-hidden fade-up-item">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-cyan/5 rounded-full blur-3xl pointer-events-none" />
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="text-3xl md:text-5xl font-display font-extrabold text-brand-dark mb-8 tracking-tight">One Core Pipeline. <br className="hidden md:block"/>Five Connected Steps.</h2>
                    <p className="text-xl text-slate-600 mb-12 font-medium leading-relaxed">
                        SimpLeads is structured around a simple progression:<br className="hidden md:block" />
                        <span className="text-brand-blue font-bold">Find the right people &rarr; identify the right companies &rarr; understand active signals &rarr; qualify and prioritize &rarr; export the result.</span>
                    </p>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto">Each stage adds another layer of context instead of creating another disconnected research task.</p>
                </div>
            </section>

            {/* Feature Blocks */}
            <section className="py-12 md:py-32 bg-white">
                <div className="max-w-7xl mx-auto px-6 space-y-32 md:space-y-48">
                    {coreFeatures.map((feature, index) => {
                        const Icon = feature.icon;
                        const isRightAlign = feature.imageAlign === 'right';
                        
                        return (
                            <div key={feature.id} className={`feature-block flex flex-col gap-12 lg:gap-24 items-center ${isRightAlign ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                                
                                {/* Content Side */}
                                <div className="feature-content flex-1 space-y-8 max-w-xl">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${feature.color} text-white shadow-lg shadow-${feature.color.split(' ')[0].replace('from-', '')}/30`}>
                                            <Icon className="w-7 h-7" />
                                        </div>
                                        <span className="text-slate-400 font-display font-bold text-2xl tracking-tight">0{index + 1}</span>
                                    </div>
                                    
                                    <div>
                                        <h2 className="text-3xl md:text-4xl font-display font-bold text-brand-dark mb-4">
                                            {feature.title}
                                        </h2>
                                        <p className={`text-xl font-semibold ${feature.textColor} mb-6`}>
                                            {feature.subtitle}
                                        </p>
                                        <p className="text-lg text-slate-500 leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>
                                    
                                    <ul className="space-y-4 pt-4">
                                        {feature.bullets.map((bullet, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <div className={`mt-1 rounded-full p-1 bg-gradient-to-br ${feature.color} text-white shrink-0`}>
                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                </div>
                                                <span className="text-slate-700 font-medium">{bullet}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {feature.extraContent}

                                    <div className="pt-4">
                                        {feature.href ? (
                                            <Link href={feature.href} className={`inline-flex items-center gap-2 font-bold ${feature.textColor} hover:opacity-80 transition-opacity group`}>
                                                {feature.cta} <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </Link>
                                        ) : (
                                            <button className={`inline-flex items-center gap-2 font-bold ${feature.textColor} hover:opacity-80 transition-opacity group`}>
                                                {feature.cta} <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Visual Side */}
                                <div className="feature-visual flex-1 w-full max-w-2xl perspective-1000">
                                    <div className={`relative rounded-2xl bg-white border border-slate-200 p-2 shadow-xl transition-all duration-500 hover:rotate-y-[2deg] hover:rotate-x-[1deg] hover:scale-[1.02] hover:shadow-[0_30px_60px_-15px_${feature.color.split(' ')[0].replace('from-', '')}40]`}>
                                        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 bg-slate-50/50 rounded-t-xl">
                                            <div className="flex gap-1.5">
                                                <div className="w-3 h-3 rounded-full bg-red-400" />
                                                <div className="w-3 h-3 rounded-full bg-amber-400" />
                                                <div className="w-3 h-3 rounded-full bg-green-400" />
                                            </div>
                                        </div>
                                        <div className="relative overflow-hidden rounded-b-xl bg-slate-100 aspect-[4/3] flex items-center justify-center border-t border-slate-100">
                                            {feature.image ? (
                                                <img src={feature.image} alt={feature.title} className="absolute inset-0 w-full h-full object-cover object-top opacity-95 hover:opacity-100 hover:scale-[1.01] transition-all duration-500" />
                                            ) : (
                                                <>
                                                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-10 mix-blend-multiply`} />
                                                    <Icon className={`w-24 h-24 ${feature.textColor} opacity-20`} />
                                                    <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-lg text-xs font-bold text-slate-500 border border-white/20 shadow-sm">
                                                        {feature.title} UI
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Discovery Tools Grid */}
            <section className="py-24 px-6 bg-slate-50 relative overflow-hidden border-t border-slate-200">
                <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-brand-cyan/5 rounded-full blur-3xl pointer-events-none" />
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-20 fade-up-item">
                        <h2 className="text-4xl md:text-5xl font-display font-extrabold text-brand-dark mb-6 tracking-tight">Discovery Tools Beyond the Core Pipeline</h2>
                        <p className="text-lg text-slate-500">Not every prospect starts inside a conventional B2B people database. SimpLeads includes additional discovery tools designed for different sources and prospecting situations.</p>
                    </div>
                    
                    <div className="space-y-32">
                        {discoveryTools.map((tool, idx) => {
                            const Icon = tool.icon;
                            const isRightAlign = idx % 2 !== 0;
                            
                            return (
                                <div key={idx} className={`fade-up-item flex flex-col gap-12 lg:gap-20 items-center ${isRightAlign ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>
                                    {/* Content Side */}
                                    <div className="flex-1 space-y-6 max-w-xl w-full">
                                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br ${tool.color} text-white mb-6 shadow-lg shadow-${tool.color.split(' ')[0].replace('from-', '')}/20`}>
                                            <Icon className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-3xl md:text-4xl font-display font-bold text-brand-dark mb-4">{tool.title}</h3>
                                        <p className={`font-semibold text-xl ${tool.textColor} mb-4`}>{tool.subtitle}</p>
                                        <p className="text-slate-600 text-lg leading-relaxed">{tool.description}</p>
                                        
                                        <div className="pt-6">
                                            {tool.href ? (
                                                <Link href={tool.href} className={`inline-flex items-center gap-2 font-bold text-lg ${tool.textColor} group hover:opacity-80 transition-opacity`}>
                                                    {tool.cta} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                                </Link>
                                            ) : (
                                                <button className={`inline-flex items-center gap-2 font-bold text-lg ${tool.textColor} group hover:opacity-80 transition-opacity`}>
                                                    {tool.cta} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Visual Side */}
                                    <div className="flex-1 w-full max-w-2xl perspective-1000">
                                        {tool.image ? (
                                            <div className="relative rounded-2xl bg-white border border-slate-200 p-2 shadow-xl transition-all duration-500 hover:rotate-y-[2deg] hover:rotate-x-[1deg] hover:scale-[1.02]">
                                                <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 bg-slate-50/50 rounded-t-xl">
                                                    <div className="flex gap-1.5">
                                                        <div className="w-3 h-3 rounded-full bg-red-400" />
                                                        <div className="w-3 h-3 rounded-full bg-amber-400" />
                                                        <div className="w-3 h-3 rounded-full bg-green-400" />
                                                    </div>
                                                </div>
                                                <div className="relative overflow-hidden rounded-b-xl bg-slate-100 aspect-[16/10] border-t border-slate-100">
                                                    <img src={tool.image} alt={tool.title} className="absolute inset-0 w-full h-full object-cover object-top opacity-95 hover:opacity-100 transition-opacity duration-300" />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className={`relative rounded-2xl bg-gradient-to-br ${tool.color} p-2 shadow-xl transition-all duration-500 hover:rotate-y-[2deg] hover:rotate-x-[1deg] hover:scale-[1.02]`}>
                                                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-black/10 rounded-t-xl">
                                                    <div className="flex gap-1.5">
                                                        <div className="w-3 h-3 rounded-full bg-red-400" />
                                                        <div className="w-3 h-3 rounded-full bg-amber-400" />
                                                        <div className="w-3 h-3 rounded-full bg-green-400" />
                                                    </div>
                                                </div>
                                                <div className="relative overflow-hidden rounded-b-xl bg-black/5 aspect-[16/10] flex flex-col items-center justify-center text-white text-center p-8">
                                                    <Icon className="w-24 h-24 mb-6 opacity-80" />
                                                    <h4 className="text-3xl font-bold mb-3">{tool.title}</h4>
                                                    <p className="opacity-80 text-lg">Advanced Discovery Engine</p>
                                                    <div className="absolute inset-0 bg-white opacity-5 mix-blend-overlay" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* From Lead Discovery to Priority Pipeline Visual */}
            <section className="py-32 px-6 bg-[#0a1128] text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-blue/20 via-[#0a1128] to-[#0a1128] pointer-events-none" />
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-cyan/30 to-transparent" />
                
                <div className="max-w-5xl mx-auto relative z-10 text-center">
                    <h2 className="text-4xl md:text-5xl font-display font-bold mb-8 tracking-tight text-white">From Lead Discovery to Lead Priority</h2>
                    <p className="text-xl text-slate-400 mb-20 max-w-3xl mx-auto">The value of SimpLeads is not any individual filter. It is how the layers work together.</p>
                    
                    <div className="relative max-w-2xl mx-auto fade-up-item">
                        {/* Connecting Line */}
                        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#023dbb] via-[#4ec8ef] to-[#023dbb] md:-translate-x-1/2 opacity-30" />
                        
                        <div className="space-y-12">
                            {[
                                { title: 'People Search', desc: 'Find professionals matching your target roles.', icon: Users },
                                { title: 'Company Intelligence', desc: 'Narrow them to companies matching your industry, keyword and location criteria.', icon: Building2 },
                                { title: 'Active Job Signals', desc: 'Identify companies with relevant recent job activity.', icon: Briefcase },
                                { title: 'AI Lead Qualification', desc: 'Evaluate available context against Need, Urgency, Relevance and Authority.', icon: BrainCircuit },
                                { title: 'Export', desc: 'Take the resulting prioritized data into your next workflow.', icon: Download }
                            ].map((step, i) => {
                                const isLeft = i % 2 === 0;
                                return (
                                <div key={i} className="relative flex flex-col md:flex-row items-start md:items-center gap-6 group">
                                    {/* Left Side */}
                                    <div className={`md:w-1/2 md:text-right pl-16 md:pl-0 md:pr-12 ${isLeft ? 'order-2 md:order-1' : 'hidden md:block order-1'}`}>
                                        {isLeft && (
                                            <>
                                                <h4 className="text-xl font-bold text-white mb-2">{step.title}</h4>
                                                <p className="text-slate-400">{step.desc}</p>
                                            </>
                                        )}
                                    </div>

                                    {/* Center Node */}
                                    <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 w-12 h-12 rounded-full bg-[#0a1128] border-2 border-brand-cyan text-brand-cyan flex items-center justify-center z-10 shadow-[0_0_15px_rgba(78,200,239,0.3)] group-hover:scale-110 group-hover:bg-brand-cyan group-hover:text-[#0a1128] transition-all duration-300">
                                        <step.icon className="w-5 h-5" />
                                    </div>

                                    {/* Right Side */}
                                    <div className={`md:w-1/2 pl-16 md:pl-12 ${isLeft ? 'hidden md:block order-3' : 'order-2 md:order-3 md:text-left'}`}>
                                        {!isLeft && (
                                            <>
                                                <h4 className="text-xl font-bold text-white mb-2">{step.title}</h4>
                                                <p className="text-slate-400">{step.desc}</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )})}
                        </div>
                    </div>
                    
                    <div className="mt-24 p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm max-w-3xl mx-auto fade-up-item">
                        <p className="text-xl text-brand-cyan font-semibold">This is the difference between simply building a list and building a prospecting workflow with context and prioritization.</p>
                    </div>
                </div>
            </section>

            {/* Workflows - Glassmorphic Dark Bento Box */}
            <section className="py-32 px-6 bg-[#030712] relative overflow-hidden border-y border-white/5">
                {/* Subtle background glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-brand-blue/10 to-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
                
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-20 fade-up-item">
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 tracking-tight">Built Around Your Prospecting Workflow</h2>
                        <p className="text-lg text-slate-400 max-w-2xl mx-auto">From finding data to making better prospecting decisions, SimpLeads adapts to how you work.</p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {workflows.map((wf, i) => {
                            const getColSpan = (idx) => {
                                if (idx === 0) return 'lg:col-span-1';
                                if (idx === 1) return 'lg:col-span-2';
                                if (idx === 2) return 'lg:col-span-2';
                                if (idx === 3) return 'lg:col-span-1';
                                if (idx === 4) return 'lg:col-span-3 md:col-span-2';
                                return '';
                            };
                            return (
                            <div key={i} className={`fade-up-item rounded-3xl border border-white/10 overflow-hidden transition-all duration-500 hover:border-white/20 flex flex-col bg-white/5 backdrop-blur-sm group cursor-pointer ${getColSpan(i)}`}>
                                <div className="p-8 pb-0">
                                    <h3 className="text-sm font-bold text-slate-300 mb-3 uppercase tracking-[0.15em] flex items-center gap-3">
                                        <wf.icon className={`w-5 h-5 ${wf.color}`} /> {wf.title}
                                    </h3>
                                    <p className="text-slate-400 text-lg leading-relaxed mb-8 pr-4">{wf.description}</p>
                                </div>
                                <div className="mt-auto px-8 pb-8">
                                    <div className="relative w-full aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden border border-white/5 shadow-2xl group-hover:-translate-y-2 group-hover:scale-[1.02] transition-transform duration-700 ease-out bg-black/50">
                                        <img src={wf.image} alt={wf.title} className="absolute inset-0 w-full h-full object-cover mix-blend-lighten opacity-80 group-hover:opacity-100 transition-opacity duration-700" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                                        <div className="absolute bottom-4 left-4 z-20">
                                            <div className="bg-black/80 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10 text-white text-xs font-bold inline-flex items-center gap-2 group-hover:border-white/30 transition-colors">
                                                <div className={`w-2 h-2 rounded-full bg-current ${wf.color} animate-pulse`} />
                                                {wf.cta} <ArrowRight className="w-3 h-3 ml-1" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )})}
                    </div>
                </div>
            </section>

            {/* Layer Comparison Grid */}
            <section className="py-24 px-6 bg-slate-50/50 border-t border-slate-100">
                <div className="max-w-5xl mx-auto fade-up-item">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-brand-dark mb-6 tracking-tight">See Why Each Layer Exists</h2>
                        <p className="text-lg text-slate-500 max-w-2xl mx-auto">SimpLeads is designed to solve different problems at different stages of prospecting. The result is a workflow that moves from finding data to making better prospecting decisions.</p>
                    </div>
                    
                    <div className="bg-white rounded-[2rem] shadow-[0_8px_40px_rgb(0,0,0,0.06)] border border-slate-200 overflow-hidden md:p-4">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr>
                                    <th className="pb-4 pt-6 px-6 md:px-8 font-bold text-slate-400 uppercase tracking-widest text-xs border-b border-slate-100/60 w-1/2">Prospecting Problem</th>
                                    <th className="pb-4 pt-6 px-6 md:px-8 font-bold text-slate-400 uppercase tracking-widest text-xs border-b border-slate-100/60 w-1/2">SimpLeads Capability</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100/60">
                                {[
                                    { p: '“Who should I contact?”', c: 'People Search' },
                                    { p: '“Which companies fit my ICP?”', c: 'Company Intelligence' },
                                    { p: '“What is happening at these companies?”', c: 'Active Job Signals' },
                                    { p: '“Which leads should I prioritize?”', c: 'AI Lead Qualification & Scoring' },
                                    { p: '“Where else can I find prospects?”', c: 'Discovery Tools' },
                                    { p: '“How do I use the results?”', c: 'Export' },
                                ].map((row, i) => (
                                    <tr key={i} className="group hover:bg-slate-50/50 transition-colors cursor-pointer">
                                        <td className="py-6 px-6 md:px-8 text-slate-600 font-medium text-[16px] group-hover:text-brand-dark transition-colors">{row.p}</td>
                                        <td className="py-6 px-6 md:px-8 text-[#023dbb] font-bold text-[16px] flex items-center justify-between">
                                            {row.c}
                                            <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-brand-cyan" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* CTA Band */}
            <BottomCTA 
                title={<>Find More Than Contacts.<br/>Find Your Priorities.</>}
                buttonText="Start Exploring SimpLeads"
            />

            {/* FAQ Section */}
            <section className="py-24 px-6 bg-slate-50 border-t border-slate-200">
                <div className="max-w-3xl mx-auto fade-up-item">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-display font-extrabold text-brand-dark tracking-tight mb-4">Frequently Asked Questions</h2>
                        <div className="w-24 h-1 bg-brand-blue mx-auto rounded-full" />
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
