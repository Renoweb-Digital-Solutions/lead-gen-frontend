"use client";

import { motion } from "framer-motion";
import SliderInput from "../inputs/SliderInput";
import MultiSelect from "../inputs/MultiSelect";
import { SCORING_ROLES } from "../../lib/constants";
import { Lightbulb } from "lucide-react";

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const Card = ({ title, children, zIndex }) => (
  <motion.div 
    variants={sectionVariants}
    style={{ zIndex }}
    className={`relative bg-white rounded-2xl p-6 lg:p-7 border border-brand-blue/10 shadow-[0_2px_8px_rgba(2,61,187,0.08)] hover:shadow-[0_8px_24px_rgba(2,61,187,0.12)] hover:-translate-y-[2px] transition-all duration-200 mb-6`}
  >
    <div className="flex items-center gap-2.5 mb-6 pb-3 border-b border-brand-blue/5">
      <div className="w-1 h-3.5 bg-gradient-to-b from-brand-blue to-brand-cyan rounded-full" />
      <h2 className="text-[12px] font-bold uppercase tracking-[0.05em] text-brand-blue m-0 leading-none">{title}</h2>
    </div>
    {children}
  </motion.div>
);

export default function ScoringStep({ formState, updateField }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.08 }
        }
      }}
    >
      {/* ── Company Context ─────────────────────────────────── */}
      <Card title="Company Context" zIndex={30}>
        <div className="rw-field">
          <label className="text-[13px] font-semibold text-brand-dark block mb-1.5 uppercase tracking-wide">
            Company Description
            <span className="text-[12px] font-normal text-gray-400 ml-2 normal-case">
              Describe your company to improve scoring relevance
            </span>
          </label>
          <textarea
            className="w-full px-3.5 py-3 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-brand-sky focus:ring-2 focus:ring-brand-sky/20 transition-all resize-y min-h-[100px]"
            value={formState.companyDescription}
            onChange={(e) => updateField("companyDescription", e.target.value)}
            placeholder="e.g. We are a SaaS company providing digital marketing solutions for small businesses..."
            rows={4}
          />
        </div>
      </Card>

      {/* ── Designations ────────────────────────────────────── */}
      <Card title="Relevant Designations" zIndex={20}>
        <MultiSelect
          label="Target Roles"
          hint="Roles you're looking to sell to or recruit"
          options={SCORING_ROLES}
          selected={formState.relevantDesignations}
          onChange={(val) => updateField("relevantDesignations", val)}
          placeholder="Select target roles..."
        />

        {/* Info card */}
        <div className="mt-6 p-4 rounded-xl border border-brand-blue/10 bg-gradient-to-br from-brand-blue/5 to-brand-cyan/5 flex items-start gap-3">
          <div className="p-2 bg-white rounded-lg shadow-sm text-brand-amber">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div className="text-[13px] text-gray-600 leading-relaxed">
            <strong className="text-brand-dark">How scoring works:</strong> Each lead's job title is compared
            against your selected designations for relevance. Job postings are
            scored for urgency based on their language and recency. Higher scores
            indicate stronger matches.
          </div>
        </div>
      </Card>

      {/* ── Concurrency ─────────────────────────────────────── */}
      <Card title="Performance" zIndex={10}>
        <SliderInput
          label="Score Concurrency"
          hint="Parallel scoring threads"
          value={formState.scoreConcurrency}
          onChange={(val) => updateField("scoreConcurrency", val)}
          min={1}
          max={16}
          step={1}
        />
      </Card>
    </motion.div>
  );
}
