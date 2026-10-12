"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HeroSection } from "@/components/ui/hero-section-1";
import PipelineSteps from "./PipelineSteps";
import FeatureQuestionsGrid from "./FeatureQuestionsGrid";
import LeadGenVsQual from "./LeadGenVsQual";
import ActiveJobSignalsBlock from "./ActiveJobSignalsBlock";
import AiQualificationBlock from "./AiQualificationBlock";
import MultiSourceDiscovery from "./MultiSourceDiscovery";
import SellingWaysBlock from "./SellingWaysBlock";
import WorkflowTestimonials from "./WorkflowTestimonials";
import TrustTransparencyBand from "./TrustTransparencyBand";
import PipelineFinalCTA from "./PipelineFinalCTA";
import HomepageFAQ from "./HomepageFAQ";
import Footer from "./Footer";
import { useAuth } from "../../lib/AuthContext";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const { token, isInitializing } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isInitializing && token) {
      router.push("/dashboard");
    }
  }, [token, isInitializing, router]);

  useEffect(() => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);
    
    // Global GSAP ScrollTrigger defaults for a smooth, premium feel
    ScrollTrigger.defaults({
      start: "top 85%",
      toggleActions: "play none none reverse",
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <main className="min-h-screen bg-white text-brand-dark font-sans selection:bg-brand-cyan/30 selection:text-brand-dark">
      <HeroSection />
      <div className="overflow-x-hidden">
        <PipelineSteps />
        <FeatureQuestionsGrid />
        <LeadGenVsQual />
        <ActiveJobSignalsBlock />
        <AiQualificationBlock />
        <MultiSourceDiscovery />
        <SellingWaysBlock />
        <WorkflowTestimonials />
        <TrustTransparencyBand />
        <PipelineFinalCTA />
        <HomepageFAQ />
        <Footer />
      </div>
    </main>
  );
}
