import React from 'react';
import Link from 'next/link';
import { getAllComparisons } from '@/lib/compareData';
import { HeroHeader } from '@/components/ui/hero-section-1';
import Footer from '@/app/components/landing/Footer';
import { ArrowRight } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compare Simpleads Alternatives | Real-Time B2B Lead Generation',
  description: 'See how Simpleads stacks up against traditional B2B contact databases and lead generation tools on data freshness, hiring signals, pricing, and more.',
};

export default async function CompareHubPage() {
  const comparisons = await getAllComparisons();

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 flex flex-col">
      <HeroHeader />
      
      <main className="flex-1 w-full pt-32 pb-24 md:pt-40 md:pb-32 px-6">
        <div className="max-w-4xl mx-auto mb-16 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight text-slate-900 mb-6">
            Compare Alternatives
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            See how Simpleads stacks up against traditional B2B contact databases on data freshness, hiring signals, and pricing.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {comparisons.map((comp, idx) => (
            <Link 
              key={idx} 
              href={`/compare/${comp.slug}`}
              className="group flex flex-col p-8 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl transition-all duration-300"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-3 flex items-center justify-between">
                <span>Simpleads vs {comp.hub.competitor}</span>
                <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transform group-hover:translate-x-1 transition-all" />
              </h2>
              <p className="text-slate-600 leading-relaxed text-base">
                {comp.hub.description}
              </p>
            </Link>
          ))}
        </div>
      </main>

      <Footer theme="light" />
    </div>
  );
}