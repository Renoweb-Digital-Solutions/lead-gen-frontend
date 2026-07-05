"use client";

import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "Renoweb completely transformed our outbound strategy. We cut research time by 80% and doubled our meeting booked rate in the first month.",
    name: "Sarah Jenkins",
    title: "VP of Sales, TechFlow",
    initial: "S"
  },
  {
    quote: "The AI scoring is uncannily accurate. It consistently highlights prospects we would have otherwise missed. A game changer for lean teams.",
    name: "Marcus Chen",
    title: "Growth Lead, Horizon AI",
    initial: "M"
  },
  {
    quote: "We were drowning in stale data from other providers. Renoweb's real-time enrichment ensures our campaigns actually hit the inbox.",
    name: "Emily Rodriguez",
    title: "Demand Gen Manager, CloudScale",
    initial: "E"
  },
  {
    quote: "The local search feature is pure magic for our local SMB outreach. No other tool makes it this easy to build hyper-targeted lists.",
    name: "David Kim",
    title: "Founder, LocalBoost",
    initial: "D"
  },
  {
    quote: "Exporting clean, verified CSVs directly into our campaigns has saved us countless hours of manual formatting. Incredible product.",
    name: "Jessica Alba",
    title: "Head of Growth, StartupInc",
    initial: "J"
  },
  {
    quote: "The speed at which we can build highly specific audiences is unmatched. It feels like having a dedicated data team on standby.",
    name: "Michael Chang",
    title: "Director of Marketing, Nexus",
    initial: "M"
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-[#f7f9ff] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <h2 className="text-3xl md:text-5xl font-display font-bold text-brand-dark mb-4">
          Trusted by top revenue teams.
        </h2>
        <p className="text-slate-500 max-w-2xl text-lg">
          Don't just take our word for it. Here's what our users are saying.
        </p>
      </div>

      <div className="relative flex w-full overflow-hidden">
        <style jsx>{`
          @keyframes marquee-horizontal {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee-horizontal {
            animation: marquee-horizontal 40s linear infinite;
          }
          .group:hover .animate-marquee-horizontal {
            animation-play-state: paused;
          }
        `}</style>
        
        <div className="flex w-max animate-marquee-horizontal group pb-8">
          {/* First set */}
          <div className="flex gap-6 px-3">
            {testimonials.map((t, i) => (
              <div 
                key={`t1-${i}`} 
                className="w-[350px] md:w-[450px] bg-white p-8 rounded-2xl shadow-[0_4px_20px_rgba(2,61,187,0.06)] border border-slate-200 flex flex-col shrink-0 transition-transform hover:-translate-y-1 cursor-default"
              >
                <Quote className="w-8 h-8 text-brand-blue/20 mb-6 shrink-0" />
                <p className="text-brand-dark text-lg md:text-xl font-medium leading-relaxed mb-8 flex-1">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center font-bold text-lg shrink-0">
                    {t.initial}
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-dark">{t.name}</h4>
                    <p className="text-sm text-brand-blue">{t.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Second set for seamless loop */}
          <div className="flex gap-6 px-3">
            {testimonials.map((t, i) => (
              <div 
                key={`t2-${i}`} 
                className="w-[350px] md:w-[450px] bg-white p-8 rounded-2xl shadow-[0_4px_20px_rgba(2,61,187,0.06)] border border-slate-200 flex flex-col shrink-0 transition-transform hover:-translate-y-1 cursor-default"
              >
                <Quote className="w-8 h-8 text-brand-blue/20 mb-6 shrink-0" />
                <p className="text-brand-dark text-lg md:text-xl font-medium leading-relaxed mb-8 flex-1">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center font-bold text-lg shrink-0">
                    {t.initial}
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-dark">{t.name}</h4>
                    <p className="text-sm text-brand-blue">{t.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Gradient fades on the edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 md:w-48 bg-gradient-to-r from-[#f7f9ff] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 md:w-48 bg-gradient-to-l from-[#f7f9ff] to-transparent z-10" />
      </div>
    </section>
  );
}
