"use client";

import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function FinalCTA() {
  const sectionRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      gsap.fromTo(".cta-content > *",
        { y: 40, opacity: 0 },
        {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 90%",
          },
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out"
        }
      );
    }, sectionRef);
    
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 bg-white overflow-hidden border-t border-slate-100">
      {/* Echo of Hero Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-blue/10 rounded-full blur-[120px] mix-blend-multiply" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />
      </div>

      <div className="cta-content relative z-10 max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-6xl font-display font-extrabold text-brand-dark tracking-tight mb-6">
          Ready to supercharge <br className="hidden md:block" /> your pipeline?
        </h2>
        <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto">
          Join hundreds of forward-thinking revenue teams who have already switched to real-time intelligence.
        </p>
        
        <button className="group relative inline-flex items-center justify-center gap-2 px-10 py-5 text-lg text-white font-semibold rounded-2xl bg-gradient-to-r from-brand-blue to-brand-sky overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(2,61,187,0.3)]">
          <span className="relative z-10">Start Your Free Trial</span>
          <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
          
          {/* Shine effect */}
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[rw-shimmer_1.5s_infinite]" />
        </button>
      </div>
    </section>
  );
}
