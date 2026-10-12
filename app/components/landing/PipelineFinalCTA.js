"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import AuthModal from "@/app/components/AuthModal";
import { useAuth } from "@/app/lib/AuthContext";
import { useRouter } from "next/navigation";

export default function PipelineFinalCTA() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { token } = useAuth();
  const router = useRouter();

  const handleStartBuilding = (e) => {
    e.preventDefault();
    if (token) {
      router.push("/dashboard");
    } else {
      setAuthModalOpen(true);
    }
  };

  return (
    <>
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      
      <section className="py-24 bg-gradient-to-b from-slate-900 to-black text-white relative overflow-hidden">
        {/* Glow behind */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-bold tracking-tight text-white mb-8">
            Stop Treating Every Lead the Same.
          </h2>

          {/* Five progression lines */}
          <div className="space-y-2 mb-10 max-w-xl mx-auto text-lg sm:text-xl text-slate-300 font-medium">
            <p>Find the people.</p>
            <p>Understand the company.</p>
            <p>See the signals.</p>
            <p className="text-cyan-400 font-semibold">Qualify the opportunity.</p>
            <p className="text-white font-bold text-xl sm:text-2xl pt-2">
              Then decide who deserves your attention.
            </p>
          </div>

          {/* Pipeline flow pill */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-slate-800/90 border border-slate-700 font-mono text-xs sm:text-sm text-cyan-300 mb-10 shadow-inner">
            <span>People</span>
            <span className="text-slate-500">→</span>
            <span>Company</span>
            <span className="text-slate-500">→</span>
            <span>Jobs</span>
            <span className="text-slate-500">→</span>
            <span className="text-white font-bold">Scoring</span>
            <span className="text-slate-500">→</span>
            <span>Export</span>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleStartBuilding}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#023dbb] text-white hover:bg-blue-600 font-semibold text-base shadow-lg shadow-blue-900/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Start Finding Better Leads</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <Link
              href="/features"
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 hover:text-white font-semibold text-base border border-slate-700 transition-all flex items-center justify-center"
            >
              Explore All Features
            </Link>
          </div>

        </div>
      </section>
    </>
  );
}
