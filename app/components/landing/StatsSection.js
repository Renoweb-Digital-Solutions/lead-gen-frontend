"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";



export default function StatsSection() {
  const sectionRef = useRef(null);
  const numbersRef = useRef([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      numbersRef.current.forEach((el) => {
        if (!el) return;
        const target = parseFloat(el.getAttribute("data-target"));
        
        gsap.fromTo(el,
          { innerHTML: 0 },
          {
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
            },
            innerHTML: target,
            duration: 2.5,
            snap: { innerHTML: 1 },
            ease: "power2.out",
            onUpdate: function() {
              const suffix = el.getAttribute("data-suffix") || "";
              el.innerHTML = Math.round(this.targets()[0].innerHTML) + suffix;
            }
          }
        );
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
    <section ref={sectionRef} className="py-24 relative overflow-hidden bg-white border-y border-slate-100">
      {/* Background Texture */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#023dbb_1px,transparent_1px),linear-gradient(to_bottom,#023dbb_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
          
          <div className="flex flex-col items-center">
            <div className="text-5xl md:text-6xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-cyan mb-2">
              <span ref={addToRefs} data-target="50" data-suffix="M+">0</span>
            </div>
            <p className="text-slate-500 font-medium">Contacts Indexed</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="text-5xl md:text-6xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-cyan mb-2">
              <span ref={addToRefs} data-target="98" data-suffix="%">0</span>
            </div>
            <p className="text-slate-500 font-medium">Data Accuracy</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="text-5xl md:text-6xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-cyan mb-2">
              <span ref={addToRefs} data-target="150" data-suffix="+">0</span>
            </div>
            <p className="text-slate-500 font-medium">Countries Covered</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="text-5xl md:text-6xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-cyan mb-2">
              <span ref={addToRefs} data-target="0.5" data-suffix="s">0</span>
            </div>
            <p className="text-slate-500 font-medium">Avg. Search Time</p>
          </div>

        </div>
      </div>
    </section>
  );
}
