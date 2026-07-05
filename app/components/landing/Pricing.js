"use client";

import { useState, useEffect, useRef } from "react";
import { Check } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(true);
  const sectionRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      gsap.fromTo(".pricing-card", 
        { y: 40, opacity: 0 },
        {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
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

  const plans = [
    {
      name: "Starter",
      desc: "For solo founders and small teams.",
      monthly: 49,
      annual: 39,
      features: [
        "1,000 leads / month",
        "Basic email verification",
        "Chrome Extension",
        "Standard support"
      ]
    },
    {
      name: "Pro",
      desc: "For growing sales and marketing teams.",
      monthly: 99,
      annual: 79,
      popular: true,
      features: [
        "5,000 leads / month",
        "Real-time email verification",
        "AI Lead Scoring",
        "Advanced CSV Exports",
        "Priority support"
      ]
    },
    {
      name: "Enterprise",
      desc: "For data-driven revenue organizations.",
      monthly: 249,
      annual: 199,
      features: [
        "Unlimited leads",
        "Custom AI Scoring models",
        "API Access",
        "Dedicated Success Manager",
        "Custom SSO & SAML"
      ]
    }
  ];

  return (
    <section ref={sectionRef} className="py-24 bg-white relative">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-cyan/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-brand-dark mb-6">
            Simple, transparent pricing.
          </h2>
          
          {/* Toggle */}
          <div className="flex items-center justify-center gap-4 text-sm font-semibold">
            <span className={`transition-colors ${!isAnnual ? "text-brand-dark" : "text-slate-400"}`}>Monthly</span>
            <button 
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-14 h-7 rounded-full bg-slate-200 border border-slate-300 transition-colors duration-300 focus:outline-none"
              style={{ backgroundColor: isAnnual ? '#023dbb' : '#e2e8f0', borderColor: isAnnual ? '#023dbb' : '#cbd5e1' }}
            >
              <span 
                className="absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300"
                style={{ transform: isAnnual ? 'translateX(26px)' : 'translateX(0)' }}
              />
            </button>
            <span className={`transition-colors flex items-center gap-2 ${isAnnual ? "text-brand-dark" : "text-slate-400"}`}>
              Annually <span className="text-[10px] bg-brand-cyan/20 text-brand-blue px-2 py-0.5 rounded-full uppercase tracking-wider">Save 20%</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <div 
              key={i} 
              className={`pricing-card relative bg-white rounded-2xl p-8 flex flex-col transition-all duration-300 ${plan.popular ? 'border-none shadow-[0_8px_30px_rgba(2,61,187,0.15)] scale-105 z-10' : 'border border-slate-200 shadow-sm hover:shadow-md mt-4 mb-4'}`}
            >
              {plan.popular && (
                <>
                  {/* Glowing gradient border effect for popular plan */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-brand-blue to-brand-cyan -z-10 p-[2px]" style={{ margin: '-2px' }}>
                    <div className="w-full h-full bg-white rounded-2xl" />
                  </div>
                  
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-blue to-brand-cyan text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md">
                    Most Popular
                  </div>
                </>
              )}

              <h3 className="text-xl font-bold text-brand-dark mb-2">{plan.name}</h3>
              <p className="text-sm text-slate-500 mb-6">{plan.desc}</p>
              
              <div className="mb-8">
                <span className="text-4xl font-display font-bold text-brand-dark">
                  ${isAnnual ? plan.annual : plan.monthly}
                </span>
                <span className="text-slate-500 font-medium">/mo</span>
              </div>

              <button className={`w-full py-3 px-4 rounded-xl font-semibold mb-8 transition-all ${plan.popular ? 'bg-brand-blue text-white hover:bg-brand-indigo hover:shadow-[0_4px_15px_rgba(2,61,187,0.3)]' : 'bg-slate-50 border border-slate-200 text-brand-dark hover:bg-slate-100 hover:border-slate-300'}`}>
                Get Started
              </button>

              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">What's included</p>
                <ul className="space-y-4 text-sm text-slate-600">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-brand-cyan shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
