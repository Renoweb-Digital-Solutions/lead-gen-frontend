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
} from "../../lib/constants";
import { Country, State, City } from "country-state-city";

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

export default function PeopleStep({ formState, updateField }) {
  // Cascading Location Logic
  const countryOptions = Country.getAllCountries().map(c => ({
    label: c.name,
    value: c.name,
    isoCode: c.isoCode
  }));

  const selectedCountryName = formState.personLocationCountryIncludes?.[0];
  const selectedCountry = countryOptions.find(c => c.value === selectedCountryName);
  const selectedCountryIso = selectedCountry?.isoCode;

  const stateOptions = selectedCountryIso 
    ? State.getStatesOfCountry(selectedCountryIso).map(s => ({
        label: s.name,
        value: s.name,
        isoCode: s.isoCode
      }))
    : [];

  const selectedStateName = formState.personLocationStateIncludes?.[0];
  const selectedState = stateOptions.find(s => s.value === selectedStateName);
  const selectedStateIso = selectedState?.isoCode;

  // MultiSelect expects an array of strings
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2 p-5 bg-[var(--rw-surface-hover)]/50 rounded-xl border border-border">
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
          <SearchableDropdown
            label="Country"
            options={countryOptions}
            value={selectedCountryName || null}
            onChange={(val) => {
              updateField("personLocationCountryIncludes", val ? [val] : []);
              updateField("personLocationStateIncludes", []);
              updateField("personLocationCityIncludes", []);
            }}
            placeholder="Select a country..."
            dropUp={true}
          />
          <SearchableDropdown
            label="State / Region"
            options={stateOptions}
            value={selectedStateName || null}
            onChange={(val) => {
              updateField("personLocationStateIncludes", val ? [val] : []);
              updateField("personLocationCityIncludes", []);
            }}
            placeholder={selectedCountryIso ? "Select a state..." : "Select a country first"}
            dropUp={true}
          />
          <MultiSelect
            label="City"
            options={cityOptions}
            selected={formState.personLocationCityIncludes}
            onChange={(val) => updateField("personLocationCityIncludes", val)}
            placeholder={selectedStateIso ? "Select cities..." : "Select a state first"}
            dropUp={true}
          />
        </div>
      </Card>
    </motion.div>
  );
}
