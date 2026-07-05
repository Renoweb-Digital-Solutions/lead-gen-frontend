"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HeroSection } from "@/components/ui/hero-section-1";
import ProblemSection from "./ProblemSection";
import HowItWorks from "./HowItWorks";
import FeatureBento from "./FeatureBento";
import StatsSection from "./StatsSection";
import Testimonials from "./Testimonials";
import Pricing from "./Pricing";
import FAQ from "./FAQ";
import FinalCTA from "./FinalCTA";
import Footer from "./Footer";

export default function LandingPage() {
  useEffect(() => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);
    
    // Global GSAP ScrollTrigger defaults for a smooth, premium feel
    ScrollTrigger.defaults({
      start: "top 85%",
      toggleActions: "play none none reverse",
    });

    // We can run an initial fade-in or just rely on ScrollTrigger for sections
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <main className="min-h-screen bg-white text-brand-dark overflow-x-hidden font-sans selection:bg-brand-cyan/30 selection:text-brand-dark">
      <HeroSection />
      <ProblemSection />
      <HowItWorks />
      <FeatureBento />
      <StatsSection />
      <Testimonials />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
