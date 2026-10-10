import React from 'react';
import Link from 'next/link';
import { ArrowRight, Check, X, Minus } from 'lucide-react';
import { ComparisonSection } from '@/lib/compareData';
import { cn } from '@/lib/utils';

export function SectionRenderer({ section, index }: { section: ComparisonSection; index: number }) {
  const { type, data } = section;

  switch (type) {
    case 'hero':
      return <HeroSection data={data} />;
    case 'comparisonTable':
      return <ComparisonTable data={data} />;
    case 'prosCons':
      return <ProsCons data={data} />;
    case 'textBlock':
      return <TextBlock data={data} />;
    case 'list':
      return <ListSection data={data} />;
    case 'faq':
      return <FaqSection data={data} />;
    case 'cta':
      return <CtaSection data={data} />;
    default:
      // textBlock fallback for unknown types
      return <TextBlock data={data} />;
  }
}

function HeroSection({ data }: { data: any }) {
  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-20 border-b border-slate-200">
      <div className="max-w-3xl mx-auto px-6">
        <nav className="flex items-center text-sm font-medium text-slate-500 mb-8" aria-label="Breadcrumb">
          <Link href="/compare" className="hover:text-slate-900 transition-colors">Compare</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-900" aria-current="page">{data.title}</span>
        </nav>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight text-slate-900 mb-8">
          {data.title}
        </h1>
        <p className="text-lg text-slate-600 mb-10 leading-relaxed whitespace-pre-wrap">
          {data.intro}
        </p>
        
        {data.prosCons && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {data.prosCons.map((pc: any, i: number) => (
              <div key={i} className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-4">{pc.title}</h3>
                <ul className="space-y-3">
                  {pc.items.map((item: string, j: number) => (
                    <li key={j} className="flex gap-3 text-sm text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0 mt-2" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {data.cta && (
          <Link href="/dashboard" className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
            {data.cta}
          </Link>
        )}
      </div>
    </section>
  );
}

function ComparisonTable({ data }: { data: any }) {
  return (
    <section className="py-16 md:py-24 border-b border-slate-200 scroll-mt-24" id={slugify(data.title)}>
      <div className="max-w-[1100px] mx-auto px-6">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-6">{data.title}</h2>
        {data.intro && (
          <p className="text-lg text-slate-600 mb-12 max-w-3xl leading-relaxed">
            {data.intro}
          </p>
        )}
        
        <div className="relative rounded-xl border border-slate-200 overflow-hidden shadow-sm bg-white">
          {/* Subtle scroll hint shadow on the right edge */}
          <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none md:hidden z-30" />
          <div className="overflow-x-auto relative">
            <table className="w-full text-left border-collapse min-w-[700px]">
              {data.caption && <caption className="sr-only">{data.caption}</caption>}
              <thead>
                <tr>
                  {data.headers.map((header: string, i: number) => (
                    <th 
                      key={i} 
                      scope="col" 
                      className={cn(
                        "p-4 md:p-6 text-sm font-bold border-b border-slate-200 bg-slate-50 sticky top-0 z-10",
                        i === 0 && "sticky left-0 z-20 bg-slate-50 shadow-[1px_0_0_0_rgba(226,232,240,1)]",
                        i === 1 && "bg-blue-50/50 text-blue-900"
                      )}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.rows.map((row: string[], i: number) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    {row.map((cell: string, j: number) => {
                      if (j === 0) {
                        return (
                          <th 
                            key={j} 
                            scope="row" 
                            className="p-4 md:p-6 text-sm font-medium text-slate-900 bg-white sticky left-0 z-10 shadow-[1px_0_0_0_rgba(226,232,240,1)]"
                          >
                            {cell}
                          </th>
                        );
                      }
                      return (
                        <td 
                          key={j} 
                          className={cn(
                            "p-4 md:p-6 text-[15px] text-slate-700 leading-relaxed",
                            j === 1 && "bg-blue-50/30 font-medium text-slate-900"
                          )}
                        >
                          {cell}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProsCons({ data }: { data: any }) {
  return (
    <section className="py-16 md:py-24 border-b border-slate-200 scroll-mt-24" id={slugify(data.title)}>
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-6">{data.title}</h2>
        {data.content && (
          <p className="text-lg text-slate-600 mb-10 leading-relaxed whitespace-pre-wrap">
            {data.content}
          </p>
        )}
        
        {data.columns && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-200 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
            {data.columns.map((col: any, i: number) => (
              <div key={i} className="bg-white p-6 md:p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-6">{col.title}</h3>
                <ul className="space-y-4">
                  {col.items.map((item: string, j: number) => (
                    <li key={j} className="flex gap-3 text-[15px] text-slate-700 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0 mt-2.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function TextBlock({ data }: { data: any }) {
  return (
    <section className="py-16 md:py-24 border-b border-slate-200 scroll-mt-24" id={slugify(data.title)}>
      <div className="max-w-3xl mx-auto px-6">
        {data.title && <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-6">{data.title}</h2>}
        {data.content && (
          <div className="prose prose-slate max-w-none prose-p:leading-relaxed prose-p:text-[16px] text-slate-600 whitespace-pre-wrap">
            {data.content}
          </div>
        )}
      </div>
    </section>
  );
}

function ListSection({ data }: { data: any }) {
  return (
    <section className="py-16 md:py-24 border-b border-slate-200 scroll-mt-24" id={slugify(data.title)}>
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-8">{data.title}</h2>
        <ul className="space-y-4">
          {data.items.map((item: string, i: number) => (
            <li key={i} className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span className="text-[16px] text-slate-700 leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function CtaSection({ data }: { data: any }) {
  return (
    <section className="py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-6">{data.title}</h2>
        {data.content && <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">{data.content}</p>}
        {data.cta && (
          <Link href="/dashboard" className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
            {data.cta}
          </Link>
        )}
      </div>
    </section>
  );
}

function FaqSection({ data }: { data: any }) {
  return (
    <section className="py-16 md:py-24 border-b border-slate-200 scroll-mt-24" id={slugify(data.title)}>
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-8">{data.title}</h2>
        <div className="space-y-4">
          {data.items.map((item: { q: string; a: string }, i: number) => (
            <details key={i} className="group bg-white border border-slate-200 rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between cursor-pointer p-6 font-medium text-slate-900">
                <span className="text-lg pr-8">{item.q}</span>
                <span className="relative flex-shrink-0 ml-1.5 w-5 h-5">
                  <svg className="absolute inset-0 w-5 h-5 opacity-100 group-open:opacity-0 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
                  <svg className="absolute inset-0 w-5 h-5 opacity-0 group-open:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4"/></svg>
                </span>
              </summary>
              <div className="p-6 pt-0 text-[16px] text-slate-600 leading-relaxed">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function slugify(text: string = '') {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}