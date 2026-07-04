"use client";

import { motion } from "framer-motion";
import MultiSelect from "../inputs/MultiSelect";
import TagInput from "../inputs/TagInput";
import ToggleGroup from "../inputs/ToggleGroup";
import ChipSelect from "../inputs/ChipSelect";
import {
  COMPANY_NAME_MATCH_MODES,
  COMPANY_MATCH_MODES,
  COMPANY_DOMAIN_MATCH_MODES,
  COMPANY_KEYWORD_MODES,
  COMPANY_SIZES,
  COMPANY_INDUSTRIES,
  COUNTRIES,
} from "../../lib/constants";

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

export default function CompanyStep({ formState, updateField }) {
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
      {/* ── Company Identity ────────────────────────────────── */}
      <Card title="Company Identity" zIndex={60}>
        <div className="flex flex-col gap-5">
          <TagInput
            label="Company Names"
            hint="Target specific companies"
            tags={formState.companyNameIncludes}
            onChange={(val) => updateField("companyNameIncludes", val)}
            placeholder="e.g. Google, Microsoft..."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <ToggleGroup
              label="Name Match Mode"
              options={COMPANY_NAME_MATCH_MODES}
              value={formState.companyNameMatchMode}
              onChange={(val) => updateField("companyNameMatchMode", val)}
            />
            <ToggleGroup
              label="Company Match Mode"
              options={COMPANY_MATCH_MODES}
              value={formState.companyMatchMode}
              onChange={(val) => updateField("companyMatchMode", val)}
            />
          </div>
        </div>
      </Card>

      {/* ── Company Domain ──────────────────────────────────── */}
      <Card title="Domain" zIndex={50}>
        <div className="flex flex-col gap-5">
          <TagInput
            label="Company Domains"
            hint="Filter by website domain"
            tags={formState.companyDomainIncludes}
            onChange={(val) => updateField("companyDomainIncludes", val)}
            placeholder="e.g. google.com..."
          />
          <ToggleGroup
            label="Domain Match Mode"
            options={COMPANY_DOMAIN_MATCH_MODES}
            value={formState.companyDomainMatchMode}
            onChange={(val) => updateField("companyDomainMatchMode", val)}
          />
        </div>
      </Card>

      {/* ── Company Size ────────────────────────────────────── */}
      <Card title="Company Size" zIndex={40}>
        <ChipSelect
          label="Employee Count"
          hint="Select one or more ranges"
          options={COMPANY_SIZES}
          selected={formState.companyEmployeeSizeIncludes}
          onChange={(val) => updateField("companyEmployeeSizeIncludes", val)}
        />
      </Card>

      {/* ── Industry ────────────────────────────────────────── */}
      <Card title="Industry" zIndex={30}>
        <MultiSelect
          label="Company Industry"
          options={COMPANY_INDUSTRIES}
          selected={formState.companyIndustryIncludes}
          onChange={(val) => updateField("companyIndustryIncludes", val)}
          placeholder="Select industries..."
        />
      </Card>

      {/* ── Keywords ────────────────────────────────────────── */}
      <Card title="Keywords" zIndex={20}>
        <div className="flex flex-col gap-5">
          <TagInput
            label="Company Keywords"
            hint="Industry or tech keywords"
            tags={formState.companyKeywordIncludes}
            onChange={(val) => updateField("companyKeywordIncludes", val)}
            placeholder="e.g. SaaS, AI, B2B..."
          />
          <ToggleGroup
            label="Keyword Match Mode"
            options={COMPANY_KEYWORD_MODES}
            value={formState.companyKeywordMode}
            onChange={(val) => updateField("companyKeywordMode", val)}
          />
        </div>
      </Card>

      {/* ── Location ────────────────────────────────────────── */}
      <Card title="Company Location" zIndex={10}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <MultiSelect
            label="Country"
            options={COUNTRIES}
            selected={formState.companyLocationCountryIncludes}
            onChange={(val) => updateField("companyLocationCountryIncludes", val)}
            placeholder="Select countries..."
          />
          <TagInput
            label="State / Region"
            tags={formState.companyLocationStateIncludes}
            onChange={(val) => updateField("companyLocationStateIncludes", val)}
            placeholder="e.g. California"
          />
          <TagInput
            label="City"
            tags={formState.companyLocationCityIncludes}
            onChange={(val) => updateField("companyLocationCityIncludes", val)}
            placeholder="e.g. San Francisco"
          />
        </div>
      </Card>
    </motion.div>
  );
}
