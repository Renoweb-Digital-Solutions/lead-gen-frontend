"use client";

import { motion } from "framer-motion";

export default function Toggle({ checked, onChange, label, hint }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex flex-col">
        {label && <span className="text-[14px] font-semibold text-brand-dark">{label}</span>}
        {hint && <span className="text-[12px] text-gray-400 mt-0.5">{hint}</span>}
      </div>
      
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`
          relative w-11 h-6 rounded-full transition-colors duration-300 ease-in-out shrink-0 focus:outline-none
          ${checked ? "bg-brand-cyan" : "bg-gray-200 hover:bg-gray-300"}
        `}
      >
        <motion.div
          animate={{ x: checked ? 20 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-0.5 left-0 w-5 h-5 bg-white rounded-full shadow-sm"
        />
      </button>
    </div>
  );
}
