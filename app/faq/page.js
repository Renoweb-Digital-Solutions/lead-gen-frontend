"use client";

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { HeroHeader } from '@/components/ui/hero-section-1';
import Footer from '@/app/components/landing/Footer';
import AuthModal from '@/app/components/AuthModal';
import { ChevronDown, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function FaqPage() {
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [openFaq, setOpenFaq] = useState({}); // { sectionIndex: { itemIndex: boolean } }
    const [activeSection, setActiveSection] = useState(0);

    const toggleFaq = (sIdx, iIdx) => {
        setOpenFaq(prev => ({
            ...prev,
            [sIdx]: {
                ...prev[sIdx],
                [iIdx]: !prev[sIdx]?.[iIdx]
            }
        }));
    };

    const faqSections = [
        {
            title: "General FAQ",
            id: "general-faq",
            items: [
                {
                    q: "What is SimpLeads?",
                    a: "SimpLeads is a prospecting and lead intelligence platform designed to help teams discover people and companies, use business activity as context, qualify prospects, prioritize them through scoring, and export the resulting data. Its core workflow is: People → Company → Jobs → Scoring → Export. It also provides separate discovery tools for sources such as Google Maps, Instagram, YouTube, B2B directories, and investor discovery."
                },
                {
                    q: "What is the difference between lead generation and lead qualification?",
                    a: "Lead generation is about finding potential prospects. Lead qualification is about evaluating whether those prospects fit the criteria that matter to your business. SimpLeads supports both. You can discover prospects through its search and discovery workflows, then qualify them using Need, Urgency, Relevance, and Authority before prioritizing them through scoring."
                },
                {
                    q: "What are the five steps in the SimpLeads pipeline?",
                    a: "The core pipeline has exactly five stages: People (find relevant professionals), Company (identify and filter relevant companies), Jobs (use Active Job Signals as business context), Scoring (qualify and prioritize prospects), and Export (export the resulting data). Google Maps, Instagram, YouTube, B2B Directory, and Investor Data are separate discovery tools, not additional pipeline stages."
                }
            ]
        },
        {
            title: "People Search FAQ",
            id: "people-search",
            items: [
                {
                    q: "What can I filter in People Search?",
                    a: "People Search supports filters such as: Job titles, Extra titles, Similar titles, Title variants, Seniority, Functions / departments, Location, Email status, Has email, and Has phone. You can also use the live result breakdown to understand how your filters affect the available results."
                },
                {
                    q: "Can I search for similar job titles?",
                    a: "Yes. People Search includes options for similar titles and title variants, helping you expand a role search beyond one exact job-title phrase."
                },
                {
                    q: "Can I filter people by seniority?",
                    a: "Yes. Seniority can be used alongside titles, functions, and location to narrow the people you want to find."
                },
                {
                    q: "Does SimpLeads guarantee that every contact detail is accurate?",
                    a: "No platform should treat contact information as an absolute guarantee. SimpLeads is designed to surface the most recent available profile and contact information and lets you filter by available email and phone status. Always validate critical contact information before high-volume outreach."
                }
            ]
        },
        {
            title: "Company Intelligence FAQ",
            id: "company-intelligence",
            items: [
                {
                    q: "What can Company Intelligence filter?",
                    a: "Company Intelligence can use criteria including: Company name, Domain, Industry, Company keywords, Location, Company-name matching, and Domain matching. This helps you define the types of companies you want before moving deeper into prospect research."
                },
                {
                    q: "Can I search companies by keywords?",
                    a: "Yes. Company Intelligence supports keyword-based company discovery, including Broad and Exact keyword matching."
                },
                {
                    q: "Can I search by company domain?",
                    a: "Yes. Domain-based matching can be used to narrow company results according to the domain criteria available in the search workflow."
                }
            ]
        },
        {
            title: "Active Job Signals FAQ",
            id: "active-job-signals",
            items: [
                {
                    q: "What are Active Job Signals?",
                    a: "Active Job Signals are business-intelligence signals based on available job activity. They help you identify companies showing hiring activity for particular roles, locations, or time periods. They are not HR software and they are not proof that a company intends to buy your product or service."
                },
                {
                    q: "How can Active Job Signals help sales teams?",
                    a: "A company hiring for relevant roles may provide useful business context for prospecting. For example, a sales team can look for companies hiring for roles related to the problem their product solves, then use that information alongside People and Company data when prioritizing prospects. The signal should be treated as context, not guaranteed buying intent."
                },
                {
                    q: "Can I filter job activity by title, location, and recency?",
                    a: "Yes. The Active Job Signals workflow supports criteria such as Job title, Location, Recency, and Include Jobs Data. The available result breakdown can help you understand the impact of your filters before generating the final list."
                }
            ]
        },
        {
            title: "AI Lead Qualification & Scoring FAQ",
            id: "ai-lead-qual",
            items: [
                {
                    q: "What does AI Lead Qualification do?",
                    a: "AI Lead Qualification helps evaluate prospects against the context you provide rather than simply returning a larger contact list. You can provide information such as Company description, Target roles, and Relevant designations. The qualification framework considers: Need → Urgency → Relevance → Authority."
                },
                {
                    q: "Is AI Lead Qualification the same as lead scoring?",
                    a: "No. Qualification evaluates whether a prospect fits the criteria. Scoring helps prioritize qualified or relevant prospects relative to one another. SimpLeads keeps these concepts distinct so a score is not presented as a guarantee that a prospect will convert."
                },
                {
                    q: "Does a high score guarantee that a prospect will convert?",
                    a: "No. A score is a prioritization signal, not a prediction of guaranteed conversion. It helps teams decide which prospects may deserve more attention based on the information and criteria used in the workflow."
                },
                {
                    q: "Can I see why a prospect received its score?",
                    a: "SimpLeads provides scoring context through its sample matches, live estimator, and filter breakdown, helping users understand how the configured criteria affect the results."
                },
                {
                    q: "Does SimpLeads currently qualify prospects based on budget?",
                    a: "Budget or financial qualification is part of the broader BANT-ready direction, but full budget/financial qualification should not be presented as a live SimpLeads feature unless specifically released. The current qualification framework is centered on: Need, Urgency, Relevance, and Authority."
                }
            ]
        },
        {
            title: "Discovery Tools FAQ",
            id: "discovery-tools",
            items: [
                {
                    q: "Is Google Maps Search part of the five-step pipeline?",
                    a: "No. Google Maps Search is a separate discovery tool. It helps users discover local businesses using business keywords and locations, after which relevant results can be used within the broader prospecting workflow."
                },
                {
                    q: "What can I do with the Instagram Lead Scraper?",
                    a: "The Instagram Lead Scraper provides a separate discovery workflow for finding leads from Instagram-based sources. You can configure the available source and target URL, set the maximum number of items, and extract available leads."
                },
                {
                    q: "How does the YouTube Lead Scraper work?",
                    a: "You can search using a target keyword, optionally specify a custom email domain, set the maximum number of emails, and run the extraction workflow. It is a discovery tool, not an additional stage of the core SimpLeads pipeline."
                },
                {
                    q: "What is the B2B Directory Scraper?",
                    a: "The B2B Directory Scraper provides business discovery through supported directories, including Yellow Pages in the US and IndiaMART for B2B discovery. You can configure keywords, location, and maximum results before extracting the available data."
                },
                {
                    q: "What is the Investor Data Pipeline?",
                    a: "The Investor Data Pipeline is a separate investor-discovery workflow. It uses inputs such as Company description, Industry, Target audience, Investment stage, and Maximum investors. It then runs an investor discovery process using LLM-powered query planning. It is designed for investor discovery, not a guarantee of investor interest, funding, or introductions."
                }
            ]
        },
        {
            title: "Export FAQ",
            id: "export",
            items: [
                {
                    q: "What can I export from SimpLeads?",
                    a: "The export workflow supports options including Full Bundle, Summary CSV, Leads Only, Jobs Only, Limit Items, Export Summary, and Generate & Export. This lets you choose the output that best fits your next workflow."
                },
                {
                    q: "Does SimpLeads directly push leads into HubSpot or Salesforce?",
                    a: "Do not position direct HubSpot or Salesforce pushing as a current core feature. SimpLeads is built around exportable prospect data, which can then be used in the user's downstream workflow."
                }
            ]
        },
        {
            title: "Data, AI & Transparency FAQ",
            id: "data-ai",
            items: [
                {
                    q: "Does SimpLeads use AI?",
                    a: "Yes. AI is used in parts of the product such as lead qualification, scoring, and investor discovery/query planning. AI-generated outputs should be treated as decision-support information and reviewed where the business decision is important."
                },
                {
                    q: "Can AI-generated results make mistakes?",
                    a: "Yes. The product should not be positioned as infallible. Qualification and scoring are designed to support prospecting decisions, not replace human judgment."
                },
                {
                    q: "Does SimpLeads guarantee lead quality?",
                    a: "No. SimpLeads helps teams structure discovery, qualification, and prioritization, but no prospecting platform can guarantee that every exported lead is a good fit or will convert."
                }
            ]
        },
        {
            title: "Who Is SimpLeads For?",
            id: "who-is-it-for",
            items: [
                {
                    q: "Who should use SimpLeads?",
                    a: "SimpLeads is designed for: Sales & GTM Teams, Lead Generation & Marketing Agencies, Local & Service Businesses, Recruiters & Staffing Teams, Founders & Small Teams. Each group can use different combinations of People, Company, Jobs, Scoring, Export, and the separate discovery tools."
                },
                {
                    q: "Can recruiters use SimpLeads?",
                    a: "Yes. Recruiters and staffing teams can use People Search, Company Intelligence, and Active Job Signals for prospect and company research. Active Job Signals can provide useful context around companies that are currently hiring."
                },
                {
                    q: "Can small businesses use SimpLeads?",
                    a: "Yes. Founders and small teams can use the platform to build targeted prospect lists without having to assemble multiple separate prospecting workflows."
                }
            ]
        }
    ];

    // ScrollSpy effect for sticky sidebar
    useEffect(() => {
        const handleScroll = () => {
            const sections = faqSections.map(s => document.getElementById(s.id));
            let current = 0;
            
            for (let i = 0; i < sections.length; i++) {
                if (sections[i] && window.scrollY >= (sections[i].offsetTop - 150)) {
                    current = i;
                }
            }
            setActiveSection(current);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (e, id) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            window.scrollTo({
                top: element.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-[#023dbb]/20">
            <Head>
                <title>SimpLeads FAQ | Lead Generation, Qualification & Scoring</title>
                <meta name="description" content="Answers to common questions about SimpLeads, including People Search, Company Intelligence, Active Job Signals, AI lead qualification, scoring, discovery tools, and exports." />
            </Head>
            
            <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
            
            <div className="relative z-50">
                <HeroHeader onLoginClick={() => setAuthModalOpen(true)} />
            </div>

            <main className="pt-32 pb-24">
                {/* HERO SECTION */}
                <section className="px-6 max-w-4xl mx-auto text-center mb-16">
                    <h1 className="text-5xl md:text-7xl font-display font-extrabold tracking-tight mb-8 text-slate-900">
                        SimpLeads FAQ
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto mb-8 leading-relaxed font-medium">
                        The answers to the questions that come up most before using SimpLeads — how the prospecting workflow works, what the platform can discover, how qualification and scoring work, and what you can export.
                    </p>
                    <p className="text-lg font-bold text-slate-900">
                        Find the answers before you build your first prospect list.
                    </p>
                </section>

                {/* FAQ SPLIT LAYOUT (Sidebar + Accordions) */}
                <section className="px-6 max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 relative items-start">
                        
                        {/* STICKY SIDEBAR NAVIGATION */}
                        <div className="hidden lg:block w-72 shrink-0 sticky top-32 border-l-2 border-slate-100 py-2">
                            <ul className="space-y-1 -ml-[2px]">
                                {faqSections.map((section, idx) => (
                                    <li key={idx}>
                                        <a 
                                            href={`#${section.id}`}
                                            onClick={(e) => scrollToSection(e, section.id)}
                                            className={`block px-6 py-2.5 text-sm font-semibold transition-all border-l-2 ${
                                                activeSection === idx 
                                                ? 'border-[#023dbb] text-[#023dbb]' 
                                                : 'border-transparent text-slate-500 hover:text-slate-900'
                                            }`}
                                        >
                                            {section.title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* ACCORDION CONTENT */}
                        <div className="flex-1 w-full max-w-3xl">
                            {faqSections.map((section, sIdx) => (
                                <div key={sIdx} id={section.id} className="mb-16 scroll-mt-32">
                                    <h2 className="text-3xl font-display font-bold text-slate-900 mb-8 border-b border-slate-100 pb-4">
                                        {section.title}
                                    </h2>
                                    <div className="space-y-0">
                                        {section.items.map((item, iIdx) => {
                                            const isOpen = openFaq[sIdx]?.[iIdx];
                                            return (
                                                <div key={iIdx} className="border-b border-slate-100 last:border-0 group">
                                                    <button 
                                                        onClick={() => toggleFaq(sIdx, iIdx)}
                                                        className="w-full text-left py-6 pr-6 flex items-start justify-between hover:bg-slate-50/50 transition-colors"
                                                    >
                                                        <span className={`font-semibold text-base transition-colors ${isOpen ? 'text-[#023dbb]' : 'text-slate-700 group-hover:text-slate-900'}`}>
                                                            {item.q}
                                                        </span>
                                                        <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 ml-4 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#023dbb]' : ''}`} />
                                                    </button>
                                                    
                                                    {/* Animated Content Wrapper */}
                                                    <div 
                                                        className={`overflow-hidden transition-all duration-300 ease-in-out`}
                                                        style={{ 
                                                            maxHeight: isOpen ? '1000px' : '0',
                                                            opacity: isOpen ? 1 : 0
                                                        }}
                                                    >
                                                        <div className="pb-6 pr-12 text-slate-600 leading-relaxed text-[15px]">
                                                            {item.a}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                
                {/* BOTTOM CTA LINK */}
                <section className="px-6 max-w-4xl mx-auto text-center mt-24 mb-16 border-t border-slate-100 pt-16">
                    <h2 className="text-3xl font-display font-bold mb-6">Ready to see it in action?</h2>
                    <button onClick={() => setAuthModalOpen(true)} className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#023dbb] text-white font-bold text-lg hover:-translate-y-0.5 hover:shadow-lg transition-all">
                        Start Using SimpLeads <ArrowRight className="w-5 h-5" />
                    </button>
                </section>
            </main>

            <Footer />
        </div>
    );
}
