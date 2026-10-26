import { SENIORITY_OPTIONS, PERSON_FUNCTIONS, COMPANY_SIZES, COMPANY_INDUSTRIES, PERSON_TITLES, SCORING_ROLES } from "./constants";

// # This module contains only allowlisted metadata and a fail-safe event bridge.
// # Product handlers never await analytics and never send free-text input values.
export const MODULE_LABELS = { leadgen: "Lead generation", gmaps: "Google Maps", youtube: "YouTube", instagram: "Instagram", b2b: "B2B directories", investors: "Investors" };
export const CONTROL_LABELS = {
  enrich_emails: "Email enrichment", countries: "Countries", country: "Country", directory: "Data source",
  source_type: "Instagram source", industry: "Industry", investment_stage: "Investment stage",
  result_limit: "Requested results", only_email: "Only results with email", sort: "Sort order",
  min_subscribers: "Minimum subscribers", export_format: "Export format", step: "Configuration step",
  seniority: "Seniority levels", departments: "Departments", industries: "Company industries", company_sizes: "Company sizes",
  job_titles: "Job titles", scoring_roles: "Scoring roles", people_countries: "People countries", company_countries: "Company countries",
};
export const ACTION_LABELS = {
  start_search: "Start search", cancel_search: "Cancel search", suggest_keywords: "Suggest keywords",
  export_csv: "Download CSV", export_json: "Download JSON", export_xlsx: "Download spreadsheet",
  export_results: "Download results", load_run: "Open past search", next_step: "Next step", previous_step: "Previous step",
  clear_filters: "Clear filters", apply_filters: "Apply filters", clear_all: "Clear configuration",
  open_result_link: "Open result website", open_result_email: "Open result email", open_result_phone: "Open result phone",
};

export function trackInteraction(eventName, module, properties = {}) {
  // # Calling from a pipeline callback remains safe even in SSR or restricted browsers.
  try {
    if (typeof window !== "undefined" && MODULE_LABELS[module]) {
      window.dispatchEvent(new CustomEvent("simpleads:interaction", { detail: { eventName, module, properties } }));
    }
  } catch { /* # Analytics must never interrupt the caller. */ }
}

export function safeControlValue(element) {
  // # Only explicitly tagged checkboxes, finite numeric controls and select options are read.
  if (element.type === "checkbox") return element.checked;
  if (element.type === "number" || element.type === "range") {
    const value = Number(element.value);
    return Number.isFinite(value) && Math.abs(value) <= 1000000 ? value : null;
  }
  if (element.tagName === "SELECT") return element.multiple ? Array.from(element.selectedOptions, option => option.value).slice(0, 30) : element.value;
  return element.dataset.analyticsValue ?? null;
}

const LEADGEN_FIELDS = {
  totalResults: "result_limit", emailStatus: "email_status", hasEmail: "has_email", hasPhone: "has_phone",
  includeSimilarTitles: "similar_titles", includeTitleVariants: "title_variants", roleMatchMode: "role_match",
  companyNameMatchMode: "company_name_match", companyMatchMode: "company_match", companyDomainMatchMode: "domain_match",
  companyKeywordMode: "keyword_match", includeJobs: "include_jobs", jobsRows: "job_limit", jobsPublishedAt: "job_recency",
  failOpenJobs: "continue_without_jobs", scoreConcurrency: "scoring_concurrency", exportFormat: "export_format",
  strictOutputSchema: "strict_output", countOnly: "count_only", limitItems: "export_limit",
};
const LEADGEN_ARRAYS = { seniorityIncludes: "seniority_selections", personFunctionIncludes: "function_selections",
  personLocationCountryIncludes: "people_country_count", companyLocationCountryIncludes: "company_country_count",
  companyIndustryIncludes: "industry_count", companyEmployeeSizeIncludes: "company_size_count",
  personTitleIncludes: "job_title_count", companyKeywordIncludes: "keyword_count", relevantDesignations: "designation_count" };
const LEADGEN_CHOICES = {
  seniorityIncludes: ["seniority", SENIORITY_OPTIONS.map(option => option.value)],
  personFunctionIncludes: ["departments", PERSON_FUNCTIONS], companyEmployeeSizeIncludes: ["company_sizes", COMPANY_SIZES],
  companyIndustryIncludes: ["industries", COMPANY_INDUSTRIES], personTitleIncludes: ["job_titles", PERSON_TITLES],
  relevantDesignations: ["scoring_roles", SCORING_ROLES],
};

export function leadgenSettings(state) {
  // # Field allowlists exclude names, domains, locations, descriptions and filenames.
  const result = {};
  for (const [field, label] of Object.entries(LEADGEN_FIELDS)) {
    const value = state[field];
    if (value === null) result[label] = "any";
    else if (typeof value === "boolean" || (typeof value === "number" && Number.isFinite(value))) result[label] = value;
    else if (typeof value === "string" && /^[a-z0-9_]{1,35}$/i.test(value)) result[label] = value;
  }
  for (const [field, label] of Object.entries(LEADGEN_ARRAYS)) {
    if (Array.isArray(state[field])) result[label] = state[field].length;
  }
  for (const [field, [label, choices]] of Object.entries(LEADGEN_CHOICES)) {
    if (Array.isArray(state[field])) result[label] = state[field].filter(value => choices.includes(value)).slice(0, 60);
  }
  return result;
}

export function trackLeadgenChange(field, value) {
  // # Record approved values/counts after a user update; never run inside a state updater.
  const entry = Object.entries(leadgenSettings({ [field]: value })).at(-1);
  if (entry) trackInteraction("option_changed", "leadgen", { control: entry[0], value: entry[1] });
}
