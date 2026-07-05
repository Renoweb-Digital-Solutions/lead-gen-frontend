"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function LogoStrip() {
  const marqueeRef = useRef(null);

  useEffect(() => {
    // Seamless infinite scroll
    if (!marqueeRef.current) return;
    
    const elements = marqueeRef.current.children;
    const totalWidth = Array.from(elements).reduce((acc, el) => acc + el.offsetWidth, 0) / 2;
    
    gsap.to(marqueeRef.current, {
      x: -totalWidth,
      ease: "none",
      duration: 30,
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize(x => parseFloat(x) % totalWidth)
      }
    });
  }, []);

  // Text-based placeholders for logos
  const logos = [
    "ACME CORP", "GLOBEX", "SOYLENT", "INITECH", "UMBRELLA", "STARK IND",
    "WAYNE ENT", "MASSIVE DYNAMIC"
  ];

  return (
    <section className="py-12 border-y border-slate-200 bg-white overflow-hidden">
      <div className="flex w-max" ref={marqueeRef}>
        {/* Double the array for seamless looping */}
        {[...logos, ...logos].map((logo, i) => (
          <div 
            key={i} 
            className="px-12 flex items-center justify-center grayscale opacity-40 hover:grayscale-0 hover:opacity-100 hover:text-brand-blue transition-all duration-300 font-display font-bold text-xl tracking-wider text-slate-500 cursor-default"
          >
            {logo}
          </div>
        ))}
      </div>
    </section>
  );
}
