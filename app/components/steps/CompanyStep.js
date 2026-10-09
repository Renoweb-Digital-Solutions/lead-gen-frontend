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
} from "../../lib/constants";
import { Country, State, City } from "country-state-city";
import SearchableDropdown from "../inputs/SearchableDropdown";

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const Card = ({ title, children, zIndex }) => (
  <motion.div 
    variants={sectionVariants}
    style={{ zIndex }}
    className={`rw-card-wrapper relative bg-surface rounded-2xl p-6 lg:p-7 border border-border shadow-sm hover:shadow-lg hover:-translate-y-[2px] transition-all duration-200 mb-6`}
  >
    <div className="flex items-center gap-2.5 mb-6 pb-3 border-b border-brand-blue/5">
      <div className="w-1 h-3.5 bg-gradient-to-b from-brand-blue to-brand-cyan rounded-full" />
      <h2 className="text-[12px] font-bold uppercase tracking-[0.05em] text-brand-blue m-0 leading-none">{title}</h2>
    </div>
    {children}
  </motion.div>
);

export default function CompanyStep({ formState, updateField }) {
  // Cascading Location Logic
  const countryOptions = Country.getAllCountries().map(c => ({
    label: c.name,
    value: c.name,
    isoCode: c.isoCode
  }));

  const selectedCountryName = formState.companyLocationCountryIncludes?.[0];
  const selectedCountry = countryOptions.find(c => c.value === selectedCountryName);
  const selectedCountryIso = selectedCountry?.isoCode;

  const stateOptions = selectedCountryIso 
    ? State.getStatesOfCountry(selectedCountryIso).map(s => ({
        label: s.name,
        value: s.name,
        isoCode: s.isoCode
      }))
    : [];

  const selectedStateName = formState.companyLocationStateIncludes?.[0];
  const selectedState = stateOptions.find(s => s.value === selectedStateName);
  const selectedStateIso = selectedState?.isoCode;

  const cityOptions = (selectedCountryIso && selectedStateIso)
    ? City.getCitiesOfState(selectedCountryIso, selectedStateIso).map(c => c.name)
    : [];

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
          <SearchableDropdown
            label="Country"
            options={countryOptions}
            value={selectedCountryName || null}
            onChange={(val) => {
              updateField("companyLocationCountryIncludes", val ? [val] : []);
              updateField("companyLocationStateIncludes", []);
              updateField("companyLocationCityIncludes", []);
            }}
            placeholder="Select a country..."
            dropUp={true}
          />
          <SearchableDropdown
            label="State / Region"
            options={stateOptions}
            value={selectedStateName || null}
            onChange={(val) => {
              updateField("companyLocationStateIncludes", val ? [val] : []);
              updateField("companyLocationCityIncludes", []);
            }}
            placeholder={selectedCountryIso ? "Select a state..." : "Select a country first"}
            dropUp={true}
          />
          <MultiSelect
            label="City"
            options={cityOptions}
            selected={formState.companyLocationCityIncludes}
            onChange={(val) => updateField("companyLocationCityIncludes", val)}
            placeholder={selectedStateIso ? "Select cities..." : "Select a state first"}
            dropUp={true}
          />
        </div>
      </Card>
    </motion.div>
  );
}
