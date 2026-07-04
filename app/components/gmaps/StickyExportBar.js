"use client";

import { motion, animate } from "framer-motion";
import { Download, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";

const AnimatedCounter = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(displayValue, value, {
      duration: 1.5,
      ease: "easeOut",
      onUpdate(val) {
        setDisplayValue(Math.floor(val));
      }
    });
    return () => controls.stop();
  }, [value]);

  return <span>{displayValue.toLocaleString()}</span>;
};

export default function StickyExportBar({
  resultCount,
  isExporting,
  onExport,
  onRefine
}) {
  if (resultCount === 0) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-4xl z-50 lg:left-[calc(50%+140px)]"
    >
      <div className="bg-white/90 backdrop-blur-xl border border-brand-blue/10 rounded-2xl p-4 shadow-[0_8px_40px_rgba(2,61,187,0.15)] flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-brand-sky/10 flex items-center justify-center shrink-0">
            <div className="w-2.5 h-2.5 bg-brand-cyan rounded-full animate-pulse" />
          </div>
          <div>
            <div className="text-[18px] font-bold text-brand-dark leading-tight">
              <AnimatedCounter value={resultCount} /> <span className="font-medium text-gray-500 text-[15px]">businesses found</span>
            </div>
            <div className="text-[12px] text-gray-400">Ready to export to your pipeline</div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={onRefine}
            className="flex-1 sm:flex-none px-5 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 rounded-xl font-semibold text-[14px] transition-colors flex items-center justify-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Refine Search
          </button>
          
          <button
            type="button"
            onClick={onExport}
            disabled={isExporting}
            className={`
              flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-white font-bold text-[14px] flex items-center justify-center gap-2 transition-all duration-300 relative overflow-hidden
              ${isExporting 
                ? "bg-brand-sky shadow-inner pointer-events-none" 
                : "bg-gradient-to-r from-brand-blue to-brand-sky shadow-[0_4px_15px_rgba(48,143,239,0.3)] hover:shadow-[0_6px_20px_rgba(48,143,239,0.4)] hover:-translate-y-0.5"
              }
            `}
          >
            {isExporting ? (
              <>
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Export to CSV
              </>
            )}
          </button>
        </div>
        
      </div>
    </motion.div>
  );
}
