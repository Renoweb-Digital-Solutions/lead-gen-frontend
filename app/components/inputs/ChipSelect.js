"use client";

import { motion } from "framer-motion";

export default function ChipSelect({
  label,
  hint,
  options = [],
  selected = [],
  onChange,
}) {
  const toggleChip = (chipValue) => {
    if (selected.includes(chipValue)) {
      onChange(selected.filter((s) => s !== chipValue));
    } else {
      onChange([...selected, chipValue]);
    }
  };

  return (
    <div className="rw-field mb-5">
      {label && (
        <label className="text-[13px] font-semibold text-brand-dark block mb-1.5 uppercase tracking-wide">
          {label}
          {hint && <span className="text-[12px] font-normal text-gray-400 ml-2 normal-case">{hint}</span>}
        </label>
      )}
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const chipLabel = typeof opt === "string" ? opt : opt.label;
          const chipValue = typeof opt === "string" ? opt : opt.value;
          const isSelected = selected.includes(chipValue);

          return (
            <motion.button
              key={chipValue}
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={`
                relative inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium rounded-full border transition-colors duration-200
                ${isSelected 
                  ? "border-transparent text-white shadow-md shadow-brand-blue/20 bg-gradient-to-r from-brand-blue to-brand-cyan" 
                  : "border-gray-200 bg-white text-gray-500 hover:border-brand-sky/50 hover:bg-brand-sky/5 hover:text-brand-sky"
                }
              `}
              onClick={() => toggleChip(chipValue)}
            >
              {isSelected && (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
                  <path
                    d="M3 7L6 10L11 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
              {chipLabel}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
