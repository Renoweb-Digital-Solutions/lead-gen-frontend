"use client";

import { motion } from "framer-motion";
import { Package, BarChart, Users, Briefcase, Check } from "lucide-react";

const ICON_MAP = {
  Package,
  BarChart,
  Users,
  Briefcase,
};

export default function RadioCards({
  label,
  hint,
  options = [],
  value,
  onChange,
}) {
  return (
    <div className="rw-field mb-6">
      {label && (
        <label className="text-[13px] font-semibold text-brand-dark block mb-3 uppercase tracking-wide">
          {label}
          {hint && <span className="text-[12px] font-normal text-gray-400 ml-2 normal-case">{hint}</span>}
        </label>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {options.map((opt) => {
          const isSelected = value === opt.id;
          const Icon = ICON_MAP[opt.iconName] || Package;

          return (
            <motion.button
              key={opt.id}
              type="button"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onChange(opt.id)}
              className={`
                relative flex items-start gap-4 p-4 text-left border rounded-2xl transition-all duration-300
                ${isSelected 
                  ? "border-brand-sky bg-brand-sky/5 shadow-[0_4px_20px_rgba(48,143,239,0.15)] ring-1 ring-brand-sky/30" 
                  : "border-gray-200 bg-white hover:border-brand-sky/40 hover:bg-gray-50/50"
                }
              `}
            >
              {/* Selected Checkmark Badge */}
              {isSelected && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-brand-cyan text-white rounded-full flex items-center justify-center shadow-md">
                  <Check className="w-3.5 h-3.5" strokeWidth={3} />
                </div>
              )}

              {/* Icon Container with Gradient Background */}
              <div 
                className={`
                  w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300
                  ${isSelected
                    ? "bg-gradient-to-br from-brand-blue to-brand-cyan text-white shadow-[0_2px_10px_rgba(48,143,239,0.3)]"
                    : "bg-gray-100 text-gray-400"
                  }
                `}
              >
                <Icon className="w-6 h-6" strokeWidth={isSelected ? 2 : 1.5} />
              </div>

              {/* Text Content */}
              <div className="flex flex-col pt-1">
                <span className={`text-[15px] font-bold ${isSelected ? "text-brand-dark" : "text-gray-600"}`}>
                  {opt.label}
                </span>
                <span className={`text-[12px] leading-snug mt-1 ${isSelected ? "text-brand-blue/80" : "text-gray-400"}`}>
                  {opt.description}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
