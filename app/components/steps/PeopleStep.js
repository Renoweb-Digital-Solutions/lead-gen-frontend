"use client";

import { motion } from "framer-motion";
import SliderInput from "../inputs/SliderInput";
import MultiSelect from "../inputs/MultiSelect";
import TagInput from "../inputs/TagInput";
import ToggleGroup from "../inputs/ToggleGroup";
import ChipSelect from "../inputs/ChipSelect";
import SearchableDropdown from "../inputs/SearchableDropdown";
import Toggle from "../inputs/Toggle";
import {
  EMAIL_STATUS_OPTIONS,
  BOOLEAN_OPTIONS,
  ROLE_MATCH_MODES,
  SENIORITY_OPTIONS,
  PERSON_FUNCTIONS,
  PERSON_TITLES,
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

export default function PeopleStep({ formState, updateField }) {
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
      {/* ── Results ─────────────────────────────────────────── */}
      <Card title="Search Volume" zIndex={60}>
        <SliderInput
          label="Total Results"
          hint="Maximum leads to fetch"
          value={formState.totalResults}
          onChange={(val) => updateField("totalResults", val)}
          min={10}
          max={1000}
          step={10}
        />
      </Card>

      {/* ── Email & LinkedIn ────────────────────────────────── */}
      <Card title="Contact Data Requirements" zIndex={55}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <SearchableDropdown
            label="Email Status"
            options={EMAIL_STATUS_OPTIONS}
            value={formState.emailStatus}
            onChange={(val) => updateField("emailStatus", val)}
            placeholder="Any"
          />
          <ToggleGroup
            label="Has Email"
            options={BOOLEAN_OPTIONS}
            value={formState.hasEmail}
            onChange={(val) => updateField("hasEmail", val)}
          />
          <ToggleGroup
            label="Has Phone"
            options={BOOLEAN_OPTIONS}
            value={formState.hasPhone}
            onChange={(val) => updateField("hasPhone", val)}
          />
        </div>
      </Card>

      {/* ── Titles ────────────────────────────────────────── */}
      <Card title="Job Titles & Roles" zIndex={50}>
        <div className="flex flex-col gap-5">
          <MultiSelect
            label="Person Titles"
            hint="Primary titles to target"
            options={PERSON_TITLES}
            selected={formState.personTitleIncludes}
            onChange={(val) => updateField("personTitleIncludes", val)}
            placeholder="Search and select titles..."
          />

          <TagInput
            label="Extra Titles"
            hint="Custom titles not in the list"
            tags={formState.personTitleExtraIncludes}
            onChange={(val) => updateField("personTitleExtraIncludes", val)}
            placeholder="Type a title and press Enter..."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2 p-5 bg-gray-50/50 rounded-xl border border-gray-100">
            <Toggle
              label="Include Similar Titles"
              hint="Broaden search with related titles"
              checked={formState.includeSimilarTitles}
              onChange={(val) => updateField("includeSimilarTitles", val)}
            />
            <Toggle
              label="Include Title Variants"
              hint="Match different spellings"
              checked={formState.includeTitleVariants}
              onChange={(val) => updateField("includeTitleVariants", val)}
            />
          </div>

          <ToggleGroup
            label="Role Match Mode"
            hint="Match any or all roles"
            options={ROLE_MATCH_MODES}
            value={formState.roleMatchMode}
            onChange={(val) => updateField("roleMatchMode", val)}
          />
        </div>
      </Card>

      {/* ── Seniority ───────────────────────────────────────── */}
      <Card title="Seniority Level" zIndex={40}>
        <ChipSelect
          options={SENIORITY_OPTIONS}
          selected={formState.seniorityIncludes}
          onChange={(val) => updateField("seniorityIncludes", val)}
        />
      </Card>

      {/* ── Functions ───────────────────────────────────────── */}
      <Card title="Functions" zIndex={30}>
        <MultiSelect
          label="Person Functions"
          hint="Department / functional area"
          options={PERSON_FUNCTIONS}
          selected={formState.personFunctionIncludes}
          onChange={(val) => updateField("personFunctionIncludes", val)}
          placeholder="Select departments..."
        />
      </Card>

      {/* ── Location ────────────────────────────────────────── */}
      <Card title="Person Location" zIndex={20}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <MultiSelect
            label="Country"
            options={COUNTRIES}
            selected={formState.personLocationCountryIncludes}
            onChange={(val) => updateField("personLocationCountryIncludes", val)}
            placeholder="Select countries..."
          />
          <TagInput
            label="State / Region"
            tags={formState.personLocationStateIncludes}
            onChange={(val) => updateField("personLocationStateIncludes", val)}
            placeholder="e.g. California"
          />
          <TagInput
            label="City"
            tags={formState.personLocationCityIncludes}
            onChange={(val) => updateField("personLocationCityIncludes", val)}
            placeholder="e.g. Los Angeles"
          />
        </div>
      </Card>
    </motion.div>
  );
}
