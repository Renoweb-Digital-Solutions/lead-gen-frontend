"use client";

import { motion } from "framer-motion";
import SliderInput from "../inputs/SliderInput";
import SearchableDropdown from "../inputs/SearchableDropdown";
import Toggle from "../inputs/Toggle";
import { JOB_RECENCY_OPTIONS } from "../../lib/constants";

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const Card = ({ title, children }) => (
  <motion.div 
    variants={sectionVariants}
    className="bg-surface rounded-2xl p-6 lg:p-7 border border-border shadow-md hover:shadow-lg hover:-translate-y-[2px] transition-all duration-200 mb-6"
  >
    <div className="flex items-center gap-2.5 mb-6 pb-3 border-b border-brand-blue/5">
      <div className="w-[3px] h-3.5 bg-gradient-to-b from-brand-blue to-brand-sky rounded-full" />
      <h2 className="text-[12px] font-bold uppercase tracking-[0.05em] text-brand-blue m-0 leading-none">{title}</h2>
    </div>
    {children}
  </motion.div>
);

export default function JobsStep({ formState, updateField }) {
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
      {/* ── Include Jobs Toggle ─────────────────────────────── */}
      <Card title="Job Search">
        <div className="p-4 bg-[var(--rw-surface-hover)]/50 rounded-xl border border-border">
          <Toggle
            label="Include Jobs Data"
            hint="Fetch and cross-reference job postings with leads"
            checked={formState.includeJobs}
            onChange={(val) => updateField("includeJobs", val)}
          />
        </div>
      </Card>

      {formState.includeJobs && (
        <>
          {/* ── Volume ──────────────────────────────────────── */}
          <Card title="Volume">
            <SliderInput
              label="Jobs Rows"
              hint="Maximum jobs to fetch"
              value={formState.jobsRows}
              onChange={(val) => updateField("jobsRows", val)}
              min={10}
              max={1000}
              step={10}
            />
          </Card>

          {/* ── Filters ─────────────────────────────────────── */}
          <Card title="Job Filters">
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="rw-field">
                  <label className="text-[13px] font-semibold text-brand-dark block mb-1.5 uppercase tracking-wide">Job Title</label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2.5 text-sm bg-surface border border-border rounded-lg focus:outline-none focus:border-brand-sky focus:ring-2 focus:ring-brand-sky/20 transition-all"
                    value={formState.jobsTitle}
                    onChange={(e) => updateField("jobsTitle", e.target.value)}
                    placeholder="e.g. Marketing Manager"
                  />
                </div>
                <div className="rw-field">
                  <label className="text-[13px] font-semibold text-brand-dark block mb-1.5 uppercase tracking-wide">Job Location</label>
                  <input
                    type="text"
                    className="w-full px-3.5 py-2.5 text-sm bg-surface border border-border rounded-lg focus:outline-none focus:border-brand-sky focus:ring-2 focus:ring-brand-sky/20 transition-all"
                    value={formState.jobsLocation}
                    onChange={(e) => updateField("jobsLocation", e.target.value)}
                    placeholder="e.g. United States"
                  />
                </div>
              </div>

              <SearchableDropdown
                label="Job Recency"
                hint="How recent should the job posting be?"
                options={JOB_RECENCY_OPTIONS}
                value={formState.jobsPublishedAt}
                onChange={(val) => updateField("jobsPublishedAt", val)}
                placeholder="Select recency..."
              />
            </div>
          </Card>

          {/* ── Advanced ────────────────────────────────────── */}
          <Card title="Advanced">
            <Toggle
              label="Fail Open Jobs"
              hint="If a job query fails, continue with other results"
              checked={formState.failOpenJobs}
              onChange={(val) => updateField("failOpenJobs", val)}
            />
          </Card>
        </>
      )}
    </motion.div>
  );
}
