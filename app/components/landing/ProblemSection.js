"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";


import { Search, Database, Zap } from "lucide-react";

export default function ProblemSection() {
  const sectionRef = useRef(null);
  const numbersRef = useRef([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      // Reveal columns
      gsap.from(".prob-col", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out"
      });

      // Count up numbers
      numbersRef.current.forEach((el) => {
        if (!el) return;
        const target = parseFloat(el.getAttribute("data-target"));
        
        gsap.to(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
          },
          innerHTML: target,
          duration: 2,
          snap: { innerHTML: 1 },
          ease: "power2.out",
          onUpdate: function() {
            // Re-append the suffix (e.g. '+', 'M', '%') if it existed
            const suffix = el.getAttribute("data-suffix") || "";
            el.innerHTML = Math.round(this.targets()[0].innerHTML) + suffix;
          }
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const addToRefs = (el) => {
    if (el && !numbersRef.current.includes(el)) {
      numbersRef.current.push(el);
    }
  };

  return (
    <section ref={sectionRef} className="py-24 bg-white relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-brand-dark mb-6 tracking-tight">
            The data you need, <span className="text-brand-blue">without the noise.</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Traditional tools give you lists of outdated contacts. We cross-reference live global sources to give you actionable intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          {/* Col 1 */}
          <div className="prob-col p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-brand-blue/5 border border-brand-blue/10 flex items-center justify-center mb-6">
              <Database className="w-8 h-8 text-brand-blue stroke-[1.5]" />
            </div>
            <div className="text-5xl font-display font-bold text-brand-dark mb-2">
              <span ref={addToRefs} data-target="250" data-suffix="M+">0</span>
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">Profiles Indexed</h3>
            <p className="text-slate-500 text-sm">
              Continuously updated from global public sources and proprietary cross-referencing.
            </p>
          </div>

          {/* Col 2 */}
          <div className="prob-col p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-brand-cyan/5 border border-brand-cyan/10 flex items-center justify-center mb-6">
              <Zap className="w-8 h-8 text-brand-cyan stroke-[1.5]" />
            </div>
            <div className="text-5xl font-display font-bold text-brand-dark mb-2">
              <span ref={addToRefs} data-target="95" data-suffix="%">0</span>
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">Data Accuracy</h3>
            <p className="text-slate-500 text-sm">
              Live pinging and real-time validation ensures high deliverability and low bounce rates.
            </p>
          </div>

          {/* Col 3 */}
          <div className="prob-col p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-brand-sky/5 border border-brand-sky/10 flex items-center justify-center mb-6">
              <Search className="w-8 h-8 text-brand-sky stroke-[1.5]" />
            </div>
            <div className="text-5xl font-display font-bold text-brand-dark mb-2">
              <span ref={addToRefs} data-target="10" data-suffix="x">0</span>
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">Faster Sourcing</h3>
            <p className="text-slate-500 text-sm">
              Slash research time. Build hyper-targeted lists in minutes, not days.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
