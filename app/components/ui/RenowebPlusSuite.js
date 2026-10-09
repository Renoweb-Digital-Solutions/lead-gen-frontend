"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, BarChart3, Search, Play, Plus, Target, CheckCircle2 } from 'lucide-react';

const PRODUCTS = [
    {
        id: 'simpleads',
        tag: 'LEAD PIPELINE',
        title: 'Find prospects and qualify instantly',
        description: 'SimpLeads combines discovery, company intelligence, and AI scoring into a single unified workflow. Stop manually copying data between tools.',
        btnText: 'Explore SimpLeads',
        Icon: Target,
        theme: 'blue',
        mockup: (
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent pointer-events-none"></div>
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">JD</div>
                        <div>
                            <div className="text-sm font-bold text-slate-900">John Doe</div>
                            <div className="text-[10px] text-slate-500">VP Marketing • TechCorp</div>
                        </div>
                    </div>
                    <div className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full border border-emerald-100">Score: 92</div>
                </div>
                <div className="p-4 space-y-3 relative z-10 bg-white/50 backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span className="text-slate-600">Company size matches criteria</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span className="text-slate-600">Active hiring for marketing</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span className="text-slate-600">Recent funding round</span>
                    </div>
                    <button className="w-full mt-2 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg">Add to Campaign</button>
                </div>
            </div>
        )
    },
    {
        id: 'flawdits',
        tag: 'DIGITAL PRESENCE',
        title: 'Audit your brand across the web',
        description: 'Flawdits runs multi-platform digital presence analysis to ensure your brand stands out, catching broken links, SEO gaps, and inconsistent messaging.',
        btnText: 'Explore Flawdits',
        Icon: BarChart3,
        theme: 'purple',
        mockup: (
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-bl-full opacity-50 pointer-events-none"></div>
                <div className="p-5 relative z-10">
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-sm font-bold text-slate-900">Health Score</div>
                        <div className="text-2xl font-black text-purple-600">84<span className="text-sm text-purple-300">/100</span></div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">
                                <span>SEO Technicals</span>
                                <span>95%</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className="w-[95%] h-full bg-emerald-400 rounded-full"></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">
                                <span>Social Consistency</span>
                                <span>60%</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className="w-[60%] h-full bg-amber-400 rounded-full"></div>
                            </div>
                        </div>
                        <div className="mt-4 p-3 bg-purple-50 rounded-xl border border-purple-100">
                            <div className="text-xs font-semibold text-purple-900 mb-1">Critical Fixes (2)</div>
                            <ul className="text-[10px] text-purple-700 list-disc pl-4 space-y-1">
                                <li>Missing meta tags on Pricing page</li>
                                <li>Broken Instagram link in footer</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'snooptel',
        tag: 'CONTENT RESEARCH',
        title: 'Uncover trends and content gaps',
        description: 'Snooptel provides deep content research to help you uncover rising trends, competitor content gaps, and high-ROI keyword opportunities before anyone else.',
        btnText: 'Explore Snooptel',
        Icon: Search,
        theme: 'teal',
        mockup: (
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden relative">
                <div className="p-4 border-b border-slate-100 bg-slate-50">
                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
                        <Search className="w-4 h-4 text-slate-400" />
                        <span className="text-xs text-slate-600 font-medium">B2B SaaS Marketing Strategies</span>
                    </div>
                </div>
                <div className="p-4 bg-white relative z-10">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Trending Opportunities</div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg cursor-pointer border border-transparent hover:border-slate-100 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded bg-teal-100 flex items-center justify-center text-teal-600"><Play className="w-3 h-3" /></div>
                                <span className="text-xs font-semibold text-slate-800">"AI in Lead Gen 2024"</span>
                            </div>
                            <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded-full">+145%</span>
                        </div>
                        <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg cursor-pointer border border-transparent hover:border-slate-100 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center text-blue-600"><Target className="w-3 h-3" /></div>
                                <span className="text-xs font-semibold text-slate-800">"Cold Email Deliverability"</span>
                            </div>
                            <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded-full">+82%</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
];

export default function RenowebPlusSuite() {
    return (
        <section className="relative w-full max-w-[1200px] mx-auto px-6 mb-32 overflow-hidden">
            {/* Header */}
            <div className="text-center mb-20 relative z-10">
                <span className="text-[#023dbb] font-bold tracking-[0.2em] uppercase text-xs mb-4 block">THE SUITE</span>
                <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 text-slate-900 tracking-tight">The Renoweb Plus</h2>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
                    SimpLeads is part of Renoweb Plus, a suite of easy-to-use marketing tools for solo founders and small, bootstrapped teams who need multiple functions without the cost of separate specialist tools.
                </p>
            </div>

            {/* Central Divider Line (Desktop only) */}
            <div className="hidden md:block absolute top-48 bottom-0 left-1/2 w-[1px] bg-slate-200/60 -translate-x-1/2 z-0"></div>

            <div className="relative z-10 space-y-16 md:space-y-0">
                {PRODUCTS.map((product, index) => {
                    const isEven = index % 2 === 0;
                    
                    return (
                        <div key={product.id} className="relative grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-0 items-center md:min-h-[400px]">
                            
                            {/* Connector dot (Desktop only) */}
                            <div className="hidden md:block absolute left-1/2 top-1/2 w-2 h-2 rounded-full bg-slate-300 border-[3px] border-white -translate-x-1/2 -translate-y-1/2 z-20"></div>

                            {/* Text Content */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.5 }}
                                className={`flex flex-col justify-center ${isEven ? 'md:pr-20 md:text-left' : 'md:pl-20 md:order-2 md:text-left'}`}
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    <span className={`text-[10px] font-bold tracking-widest uppercase ${
                                        product.theme === 'blue' ? 'text-blue-600' : 
                                        product.theme === 'purple' ? 'text-purple-600' : 'text-teal-600'
                                    }`}>
                                        {product.tag}
                                    </span>
                                </div>
                                <h3 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4 tracking-tight leading-tight">
                                    {product.title}
                                </h3>
                                <p className="text-slate-500 leading-relaxed mb-8">
                                    {product.description}
                                </p>
                                <div className="flex items-center gap-4">
                                    <button className="px-5 py-2.5 rounded-full bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition-colors">
                                        Get started
                                    </button>
                                    <button className="px-5 py-2.5 rounded-full bg-white border border-slate-200 text-slate-900 font-semibold text-sm hover:bg-slate-50 hover:shadow-sm transition-all">
                                        {product.btnText}
                                    </button>
                                </div>
                            </motion.div>

                            {/* Mockup Display */}
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className={`flex justify-center items-center relative ${isEven ? 'md:pl-20' : 'md:pr-20 md:order-1'}`}
                            >
                                {/* Soft glow behind mockup */}
                                <div className={`absolute w-[120%] h-[120%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px] opacity-20 -z-10 ${
                                    product.theme === 'blue' ? 'bg-blue-400' : 
                                    product.theme === 'purple' ? 'bg-purple-400' : 'bg-teal-400'
                                }`}></div>
                                
                                {product.mockup}
                            </motion.div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
