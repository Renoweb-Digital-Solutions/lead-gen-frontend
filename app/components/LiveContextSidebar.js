"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { Filter, Users, Building2, Briefcase, Zap } from "lucide-react";

export default function LiveContextSidebar({ formState, activeStep }) {
  // A simple simulated counter based on form state
  const [targetCount, setTargetCount] = useState(0);

  useEffect(() => {
    // Generate a mock target count based on form values
    let base = 50000;
    if (formState?.personTitleIncludes?.length > 0) base = Math.floor(base * 0.4);
    if (formState?.seniorityIncludes?.length > 0) base = Math.floor(base * 0.7);
    if (formState?.personLocationCountryIncludes?.length > 0) base = Math.floor(base * 0.5);
    
    // Add some random jitter
    setTargetCount(base + Math.floor(Math.random() * 500));
  }, [formState]);

  // Animate the counter
  const springCount = useSpring(0, { bounce: 0, duration: 1500 });
  
  useEffect(() => {
    springCount.set(targetCount);
  }, [targetCount, springCount]);

  const displayCount = useTransform(springCount, (latest) => Math.round(latest).toLocaleString());

  const mockLeads = [
    { name: "Sarah Jenkins", title: "VP of Marketing", company: "TechFlow Inc." },
    { name: "David Chen", title: "Head of Growth", company: "CloudScale" },
    { name: "Elena Rodriguez", title: "CMO", company: "DataSync" },
  ];

  return (
    <div className="w-full h-full flex flex-col gap-6 sticky top-24">
      {/* Animated Counter Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 border border-brand-blue/10 shadow-[0_4px_24px_rgba(2,61,187,0.06)]"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-3 bg-gradient-to-b from-brand-blue to-brand-cyan rounded-full" />
          <h3 className="text-xs uppercase tracking-widest text-brand-blue font-semibold">Live Estimator</h3>
        </div>
        
        <div className="flex items-baseline gap-2 mb-2">
          <motion.span className="text-4xl font-bold text-brand-dark">
            {displayCount}
          </motion.span>
          <span className="text-sm font-medium text-gray-500">Leads</span>
        </div>
        <p className="text-sm text-gray-400">Estimated matches based on current filters</p>

        {/* Mini Funnel Visualization */}
        <div className="mt-6 flex flex-col gap-3">
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-gray-500 font-medium">
              <span>Total Contacts</span>
              <span>50,000+</span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1 }} className="h-full bg-gray-300 rounded-full" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-gray-500 font-medium">
              <span>After Title Filter</span>
              <span>{Math.floor(targetCount * 1.5).toLocaleString()}</span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: "70%" }} transition={{ duration: 1, delay: 0.2 }} className="h-full bg-brand-sky rounded-full" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-gray-500 font-medium">
              <span>After Location Filter</span>
              <span className="text-brand-blue font-bold text-[12px]">{Math.round(targetCount).toLocaleString()}</span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: "40%" }} transition={{ duration: 1, delay: 0.4 }} className="h-full bg-gradient-to-r from-brand-blue to-brand-cyan rounded-full" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Sample Leads Skeleton List */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-6 border border-brand-blue/10 shadow-[0_4px_24px_rgba(2,61,187,0.06)] flex-1"
      >
         <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-3 bg-gradient-to-b from-brand-blue to-brand-cyan rounded-full" />
          <h3 className="text-xs uppercase tracking-widest text-brand-blue font-semibold">Sample Matches</h3>
        </div>

        <div className="flex flex-col gap-3">
          {mockLeads.map((lead, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + (idx * 0.1) }}
              className="p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-brand-blue/5 hover:border-brand-blue/20 transition-colors flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-blue to-brand-sky flex items-center justify-center text-white font-bold text-xs shrink-0">
                {lead.name.charAt(0)}
              </div>
              <div className="overflow-hidden w-full">
                <div className="text-sm font-semibold text-brand-dark truncate">{lead.name}</div>
                <div className="text-xs text-gray-500 truncate">{lead.title}</div>
                <div className="text-xs text-brand-sky font-medium truncate mt-0.5 flex items-center gap-1">
                  <Building2 className="w-3 h-3" />
                  {lead.company}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Filter Breakdown Chart */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-6 border border-brand-blue/10 shadow-[0_4px_24px_rgba(2,61,187,0.06)]"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-3 bg-gradient-to-b from-brand-blue to-brand-cyan rounded-full" />
          <h3 className="text-xs uppercase tracking-widest text-brand-blue font-semibold">Filter Breakdown</h3>
        </div>
        
        <div className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11.5px] font-medium text-brand-dark">
              <span>Information Technology</span>
              <span>45%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: "45%" }} transition={{ duration: 1, delay: 0.5 }} className="h-full bg-gradient-to-r from-brand-blue to-brand-sky rounded-full" />
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11.5px] font-medium text-brand-dark">
              <span>Financial Services</span>
              <span>30%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: "30%" }} transition={{ duration: 1, delay: 0.6 }} className="h-full bg-brand-sky rounded-full" />
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11.5px] font-medium text-brand-dark">
              <span>Healthcare</span>
              <span>25%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: "25%" }} transition={{ duration: 1, delay: 0.7 }} className="h-full bg-brand-cyan rounded-full" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
