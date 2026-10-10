import React from 'react';
import { notFound } from 'next/navigation';
import { getComparisonData, getComparisonSlugs } from '@/lib/compareData';
import { SectionRenderer, slugify } from '@/components/compare/SectionRenderer';
import { Metadata } from 'next';
import { HeroHeader } from '@/components/ui/hero-section-1';
import Footer from '@/app/components/landing/Footer';
import TocSidebar from '@/components/compare/TocSidebar';

export async function generateStaticParams() {
  const slugs = await getComparisonSlugs();
  return slugs.map(slug => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const data = await getComparisonData(resolvedParams.slug);
  if (!data) return {};
  return {
    title: data.meta.title,
    description: data.meta.description,
    openGraph: {
      title: data.meta.title,
      description: data.meta.description,
      type: 'article',
    }
  };
}

export default async function ComparisonPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const data = await getComparisonData(resolvedParams.slug);
  if (!data) {
    notFound();
  }

  const tocItems = data.sections
    .filter(s => s.type !== 'hero' && s.data.title)
    .map(s => ({
      title: s.data.title,
      id: slugify(s.data.title)
    }));

  const faqSection = data.sections.find(s => s.type === 'faq');
  const faqSchema = faqSection ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqSection.data.items.map((item: any) => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.a
      }
    }))
  } : null;

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100">
      <HeroHeader />
      
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <div className="flex flex-col lg:flex-row max-w-[1400px] mx-auto w-full pt-16">
        {/* Main Content Column */}
        <main className="flex-1 w-full min-w-0">
          <article className="pb-16 lg:pb-32 relative">
            {data.sections.map((section, idx) => (
              <SectionRenderer key={idx} section={section} index={idx} />
            ))}
          </article>
        </main>

        {/* TOC Sidebar */}
        {tocItems.length > 0 && (
          <aside className="hidden lg:block w-[300px] shrink-0 xl:w-[350px] sticky top-32 self-start pl-8 pr-6 max-h-[calc(100vh-120px)] overflow-y-auto">
            <TocSidebar items={tocItems} />
          </aside>
        )}
      </div>

      <Footer theme="light" />
    </div>
  );
}