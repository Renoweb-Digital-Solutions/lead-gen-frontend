// ─── Seniority ────────────────────────────────────────────
export const SENIORITY_OPTIONS = [
  { label: "C-Suite", value: "c_suite" },
  { label: "VP", value: "vp" },
  { label: "Director", value: "director" },
  { label: "Manager", value: "manager" },
  { label: "Senior", value: "senior" },
  { label: "Entry", value: "entry" },
  { label: "Owner", value: "owner" },
  { label: "Partner", value: "partner" },
  { label: "Intern", value: "intern" },
];

// ─── Email Status ─────────────────────────────────────────
export const EMAIL_STATUS_OPTIONS = [
  { label: "Any", value: null },
  { label: "Verified", value: "verified" },
  { label: "Unverified", value: "unverified" },
];

// ─── Has Email / Phone ────────────────────────────────────
export const BOOLEAN_OPTIONS = [
  { label: "Any", value: null },
  { label: "Yes", value: true },
  { label: "No", value: false },
];

// ─── Role Match Mode ──────────────────────────────────────
export const ROLE_MATCH_MODES = [
  { label: "Any", value: "any" },
  { label: "All", value: "all" },
];

// ─── Company Match Mode ───────────────────────────────────
export const COMPANY_MATCH_MODES = [
  { label: "Any", value: "any" },
  { label: "All", value: "all" },
];

// ─── Company Name Match ───────────────────────────────────
export const COMPANY_NAME_MATCH_MODES = [
  { label: "Exact", value: "exact" },
  { label: "Phrase", value: "phrase" },
];

// ─── Company Domain Match ─────────────────────────────────
export const COMPANY_DOMAIN_MATCH_MODES = [
  { label: "Strict", value: "strict" },
  { label: "Contains", value: "contains" },
];

// ─── Company Keyword Mode ─────────────────────────────────
export const COMPANY_KEYWORD_MODES = [
  { label: "Broad", value: "broad" },
  { label: "Exact", value: "exact" },
];

// ─── Company Size ─────────────────────────────────────────
export const COMPANY_SIZES = [
  "Unknown",
  "1-10",
  "11-20",
  "21-50",
  "51-100",
  "101-200",
  "201-500",
  "501-1000",
  "1001-2000",
  "2001-5000",
  "5001-10000",
  "10001+",
];

// ─── Job Recency ──────────────────────────────────────────
export const JOB_RECENCY_OPTIONS = [
  { label: "Any time", value: null },
  { label: "Past 24 hours", value: "r86400" },
  { label: "Past 7 days", value: "r604800" },
  { label: "Past 30 days", value: "r2592000" },
];

// ─── Person Functions ─────────────────────────────────────
export const PERSON_FUNCTIONS = [
  "Accounting",
  "Administrative",
  "Arts & Design",
  "Business Development",
  "Consulting",
  "Data Science",
  "Education",
  "Engineering",
  "Entrepreneurship",
  "Finance",
  "Human Resources",
  "Information Technology",
  "Legal",
  "Marketing",
  "Media & Communications",
  "Operations",
  "Product Management",
  "Research",
  "Sales",
  "Support",
];

// ─── Common Person Titles ─────────────────────────────────
export const PERSON_TITLES = [
  "Director",
  "Manager",
  "Founder",
  "General Manager",
  "Chief Executive Officer",
  "Co-Founder",
  "Chief Financial Officer",
  "Chief Operating Officer",
  "Chief Technology Officer",
  "Chief Marketing Officer",
  "Director Of Marketing",
  "Digital Marketing Manager",
  "Business Development Manager",
  "Head Of Marketing",
  "Head Of Sales",
  "Product Manager",
  "Project Manager",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "SEO Specialist",
  "Graphic Designer",
  "UI/UX Designer",
  "Vice President",
  "Senior Vice President",
  "Managing Director",
  "Operations Manager",
  "Account Manager",
  "Sales Manager",
  "Marketing Manager",
  "HR Manager",
  "Finance Manager",
  "IT Manager",
  "Creative Director",
  "Art Director",
  "Content Manager",
  "Social Media Manager",
  "Brand Manager",
  "Data Analyst",
  "Software Engineer",
];

// ─── Countries ────────────────────────────────────────────
export const COUNTRIES = [
  "United States",
  "United Kingdom",
  "India",
  "France",
  "Canada",
  "Netherlands",
  "Australia",
  "Germany",
  "Spain",
  "Italy",
  "United Arab Emirates",
  "Singapore",
  "Saudi Arabia",
  "Ireland",
  "Brazil",
  "South Africa",
  "Japan",
  "China",
  "South Korea",
  "Mexico",
  "Indonesia",
  "Thailand",
  "Vietnam",
  "Philippines",
  "Malaysia",
  "New Zealand",
  "Sweden",
  "Norway",
  "Denmark",
  "Finland",
  "Switzerland",
  "Belgium",
  "Austria",
  "Poland",
  "Portugal",
  "Czech Republic",
  "Romania",
  "Turkey",
  "Israel",
  "Nigeria",
  "Kenya",
  "Egypt",
  "Argentina",
  "Colombia",
  "Chile",
  "Peru",
  "Pakistan",
  "Bangladesh",
  "Sri Lanka",
  "Qatar",
  "Kuwait",
  "Bahrain",
  "Oman",
  "Hong Kong",
  "Taiwan",
  "Russia",
  "Ukraine",
  "Greece",
  "Hungary",
  "Croatia",
];

// ─── Company Industries ───────────────────────────────────
export const COMPANY_INDUSTRIES = [
  "Accounting",
  "Agriculture",
  "Airlines/Aviation",
  "Animation",
  "Apparel & Fashion",
  "Architecture & Planning",
  "Automotive",
  "Banking",
  "Biotechnology",
  "Chemicals",
  "Computer Software",
  "Construction",
  "Consumer Services",
  "Design",
  "E-Learning",
  "Education Management",
  "Financial Services",
  "Food & Beverages",
  "Health, Wellness & Fitness",
  "Hospital & Health Care",
  "Hospitality",
  "Information Technology & Services",
  "Internet",
  "Legal Services",
  "Management Consulting",
  "Marketing & Advertising",
  "Media Production",
  "Medical Practice",
  "Pharmaceuticals",
  "Real Estate",
  "Restaurants",
  "Retail",
  "Staffing & Recruiting",
  "Telecommunications",
  "Venture Capital & Private Equity",
  "Wholesale",
  "Writing & Editing",
];

// ─── Scoring Role Suggestions ─────────────────────────────
export const SCORING_ROLES = [
  "UI/UX Designer",
  "UX Designer",
  "Product Designer",
  "Graphic Designer",
  "SEO Specialist",
  "SEO Manager",
  "Content Writer",
  "Content Strategist",
  "Copywriter",
  "Social Media Manager",
  "Performance Marketer",
  "Digital Marketing Specialist",
  "Digital Marketing Manager",
  "Growth Marketer",
  "Marketing Automation Specialist",
  "Web Developer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "WordPress Developer",
  "Shopify Developer",
  "Data Analyst",
  "Business Analyst",
  "Project Manager",
  "Product Manager",
];

// ─── Export Formats ───────────────────────────────────────
export const EXPORT_FORMATS = [
  {
    id: "bundle",
    label: "Full Bundle",
    description: "ZIP with summary, leads & jobs CSVs",
    endpoint: "/export/bundle.zip",
    icon: "📦",
  },
  {
    id: "summary",
    label: "Summary CSV",
    description: "Scored leads with all data combined",
    endpoint: "/export/summary.csv",
    icon: "📊",
  },
  {
    id: "leads",
    label: "Leads Only",
    description: "Normalized leads with contact info",
    endpoint: "/export/leads.csv",
    icon: "👥",
  },
  {
    id: "jobs",
    label: "Jobs Only",
    description: "Normalized jobs with scoring data",
    endpoint: "/export/jobs.csv",
    icon: "💼",
  },
];

// ─── Step Definitions ─────────────────────────────────────
export const STEPS = [
  { id: "people", label: "People", icon: "👤", description: "Person filters & targeting" },
  { id: "company", label: "Company", icon: "🏢", description: "Company filters & criteria" },
  { id: "jobs", label: "Jobs", icon: "💼", description: "Job search configuration" },
  { id: "scoring", label: "Scoring", icon: "⚡", description: "Relevance & urgency scoring" },
  { id: "export", label: "Export", icon: "🚀", description: "Export settings & generate" },
];

// ─── Default Form State ───────────────────────────────────
export const DEFAULT_FORM_STATE = {
  // People
  totalResults: 1000,
  emailStatus: null,
  hasEmail: null,
  hasPhone: null,
  personTitleIncludes: [],
  personTitleExtraIncludes: [],
  includeSimilarTitles: false,
  includeTitleVariants: false,
  roleMatchMode: "any",
  seniorityIncludes: [],
  personFunctionIncludes: [],
  personLocationCountryIncludes: [],
  personLocationStateIncludes: [],
  personLocationCityIncludes: [],

  // Company
  companyNameIncludes: [],
  companyNameMatchMode: "phrase",
  companyMatchMode: "any",
  companyLocationCountryIncludes: [],
  companyLocationStateIncludes: [],
  companyLocationCityIncludes: [],
  companyDomainIncludes: [],
  companyDomainMatchMode: "contains",
  companyEmployeeSizeIncludes: [],
  companyIndustryIncludes: [],
  companyKeywordIncludes: [],
  companyKeywordMode: "broad",

  // Jobs
  includeJobs: true,
  jobsRows: 1000,
  jobsTitle: "",
  jobsLocation: "",
  jobsPublishedAt: "r604800",
  failOpenJobs: true,

  // Scoring
  companyDescription: "",
  relevantDesignations: [],
  scoreConcurrency: 8,

  // Export
  exportFormat: "bundle",
  filename: "summary.csv",
  limitItems: null,
  strictOutputSchema: true,
  resetProgress: true,
  dontSaveProgress: false,
  countOnly: false,
};
