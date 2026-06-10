const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Function: checkHealth
 * 
 * WHAT IT DOES: 
 * Pings the backend health endpoint to ensure the API is running and reachable.
 * 
 * WHERE IT IS USED:
 * - e:\WORK\Renoweb\lead-gen\app\components\Header.js (polled every 30s to update connection status)
 * 
 * RETURNS: Object containing health status and version info.
 */
export async function checkHealth() {
  const res = await fetch(`${BASE_URL}/health`);
  if (!res.ok) throw new Error("Health check failed");
  return res.json();
}

/**
 * Function: buildRequestBody
 * 
 * WHAT IT DOES: 
 * Transforms the local frontend `formState` object into the exact JSON schema expected by the backend API.
 * This is a crucial mapping function that bridges the frontend state and the backend API requirements.
 * 
 * ARGUMENTS:
 * - `formState` (Object): The complete state tree managed by `useFormState`.
 * 
 * RETURNS: 
 * - Object: A nested JSON structure with `input`, `filename`, `limit_items`, etc., ready to be sent as the POST request body.
 */
function buildRequestBody(formState) {
  return {
    input: {
      totalResults: formState.totalResults,
      resetSavedProgress: formState.resetProgress,
      emailStatus: formState.emailStatus === null ? undefined : formState.emailStatus,
      hasEmail: formState.hasEmail,
      hasPhone: formState.hasPhone,
      personTitleIncludes: formState.personTitleIncludes,
      personTitleExtraIncludes: formState.personTitleExtraIncludes,
      includeSimilarTitles: formState.includeSimilarTitles,
      includeTitleVariants: formState.includeTitleVariants,
      roleMatchMode: formState.roleMatchMode,
      seniorityIncludes: formState.seniorityIncludes,
      personFunctionIncludes: formState.personFunctionIncludes,
      personLocationCountryIncludes: formState.personLocationCountryIncludes,
      personLocationStateIncludes: formState.personLocationStateIncludes,
      personLocationCityIncludes: formState.personLocationCityIncludes,
      companyNameIncludes: formState.companyNameIncludes,
      companyNameMatchMode: formState.companyNameMatchMode,
      companyMatchMode: formState.companyMatchMode,
      companyLocationCountryIncludes: formState.companyLocationCountryIncludes,
      companyLocationStateIncludes: formState.companyLocationStateIncludes,
      companyLocationCityIncludes: formState.companyLocationCityIncludes,
      companyDomainMatchMode: formState.companyDomainMatchMode,
      companyDomainIncludes: formState.companyDomainIncludes,
      companyEmployeeSizeIncludes: formState.companyEmployeeSizeIncludes,
      companyIndustryIncludes: formState.companyIndustryIncludes,
      companyKeywordIncludes: formState.companyKeywordIncludes,
      companyKeywordMode: formState.companyKeywordMode,
      resetProgress: formState.resetProgress,
      dontSaveProgress: formState.dontSaveProgress,
      countOnly: formState.countOnly,
    },
    filename: formState.filename || "summary.csv",
    limit_items: formState.limitItems,
    strict_output_schema: formState.strictOutputSchema,
    jobs_rows: formState.jobsRows,
    include_jobs: formState.includeJobs,
    jobs_title: formState.jobsTitle,
    jobs_location: formState.jobsLocation,
    jobs_publishedAt: formState.jobsPublishedAt,
    fail_open_jobs: formState.failOpenJobs,
    company_description: formState.companyDescription,
    relevant_designations: formState.relevantDesignations,
    score_concurrency: formState.scoreConcurrency,
  };
}

/**
 * Function: exportLeads
 * 
 * WHAT IT DOES:
 * Acts as the primary API caller to start the lead generation pipeline on the backend.
 * It looks up the correct endpoint based on the requested format, builds the payload via `buildRequestBody`,
 * and makes a POST request to the API. It handles parsing the response either as a ZIP (blob) or CSV.
 * 
 * WHERE IT IS USED:
 * - e:\WORK\Renoweb\lead-gen\app\components\LeadGenApp.js (called when clicking Generate Leads in the ExportStep)
 * 
 * ARGUMENTS:
 * - `formState` (Object): The complete state tree managed by `useFormState`.
 * 
 * RETURNS:
 * - Promise resolving to an Object: `{ blob: Blob, filename: String, type: String }`
 */
export async function exportLeads(formState) {
  const { EXPORT_FORMATS } = await import("./constants");
  const format = EXPORT_FORMATS.find((f) => f.id === formState.exportFormat);
  if (!format) throw new Error("Unknown export format");

  const body = buildRequestBody(formState);

  const res = await fetch(`${BASE_URL}${format.endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Export failed: ${res.status} — ${text}`);
  }

  // ZIP comes as binary, CSVs as text
  if (formState.exportFormat === "bundle") {
    return { blob: await res.blob(), filename: "bundle.zip", type: "zip" };
  }

  return {
    blob: await res.blob(),
    filename: formState.filename || "export.csv",
    type: "csv",
  };
}

/**
 * Function: downloadBlob
 * 
 * WHAT IT DOES:
 * Takes a Blob (binary data) received from the API and artificially triggers a browser file download.
 * It creates a temporary URL pointing to the Blob, creates a hidden <a> tag, clicks it, and cleans up.
 * 
 * WHERE IT IS USED:
 * - e:\WORK\Renoweb\lead-gen\app\components\LeadGenApp.js (called after `exportLeads` succeeds)
 * 
 * ARGUMENTS:
 * - `blob` (Blob): The binary file data to download.
 * - `filename` (String): The name the file should be saved as (e.g. "leads.csv").
 */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ═══════════════════════════════════════════════════════════
// GOOGLE MAPS API FUNCTIONS
// ═══════════════════════════════════════════════════════════

/**
 * Function: gmapsSearch
 *
 * WHAT IT DOES:
 * Triggers a Google Maps / Google Places search via the Compass actor on the backend.
 * Searches for local businesses matching the given keywords and location.
 *
 * WHERE IT IS USED:
 * - e:\WORK\Renoweb\lead-gen\app\components\gmaps\GmapsView.js
 *
 * ARGUMENTS:
 * - `params` (Object): { keywords: string[], location: string, limit: number }
 *
 * RETURNS: Promise<Object> — The search results from the backend.
 */
export async function gmapsSearch({ keywords, location, limit }) {
  const body = {
    includeWebResults: false,
    language: "en",
    locationQuery: location,
    maxCrawledPlacesPerSearch: limit,
    maximumLeadsEnrichmentRecords: 0,
    scrapeContacts: true,
    scrapeDirectories: false,
    scrapeImageAuthors: false,
    scrapeOrderOnline: false,
    scrapePlaceDetailPage: false,
    scrapeReviewsPersonalData: true,
    scrapeSocialMediaProfiles: {
      facebooks: true,
      instagrams: true,
      tiktoks: false,
      twitters: false,
      youtubes: false
    },
    scrapeTableReservationProvider: false,
    searchStringsArray: keywords,
    skipClosedPlaces: false,
    verifyLeadsEnrichmentEmails: false,
    searchMatching: "all",
    placeMinimumStars: "",
    website: "allPlaces",
    maxQuestions: 0,
    maxReviews: 0,
    reviewsSort: "newest",
    reviewsFilterString: "",
    reviewsOrigin: "all",
    maxImages: 0,
    allPlacesNoSearchAction: ""
  };

  const res = await fetch(`${BASE_URL}/gmaps/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GMaps search failed: ${res.status} — ${text}`);
  }

  return res.json();
}

/**
 * Function: gmapsGetRuns
 *
 * WHAT IT DOES:
 * Fetches the list of all previously saved Google Maps search runs.
 *
 * WHERE IT IS USED:
 * - e:\WORK\Renoweb\lead-gen\app\components\gmaps\GmapsView.js
 *
 * RETURNS: Promise<Array> — List of run objects.
 */
export async function gmapsGetRuns() {
  const res = await fetch(`${BASE_URL}/gmaps/runs`);
  if (!res.ok) throw new Error("Failed to fetch GMaps runs");
  return res.json();
}

/**
 * Function: gmapsGetRun
 *
 * WHAT IT DOES:
 * Fetches the detailed rows/results for a specific Google Maps run by ID.
 *
 * WHERE IT IS USED:
 * - e:\WORK\Renoweb\lead-gen\app\components\gmaps\GmapsView.js
 *
 * ARGUMENTS:
 * - `runId` (String): The ID of the run to fetch.
 *
 * RETURNS: Promise<Object> — Run data including rows.
 */
export async function gmapsGetRun(runId) {
  const res = await fetch(`${BASE_URL}/gmaps/runs/${runId}`);
  if (!res.ok) throw new Error(`Failed to fetch GMaps run ${runId}`);
  return res.json();
}

/**
 * Function: gmapsExportCsv
 *
 * WHAT IT DOES:
 * Downloads the standard CSV export for a specific Google Maps run.
 *
 * WHERE IT IS USED:
 * - e:\WORK\Renoweb\lead-gen\app\components\gmaps\GmapsView.js
 *
 * ARGUMENTS:
 * - `runId` (String): The ID of the run to export.
 *
 * RETURNS: Promise<{ blob: Blob, filename: string }>
 */
export async function gmapsExportCsv(runId) {
  const res = await fetch(`${BASE_URL}/gmaps/runs/${runId}/export.csv`);
  if (!res.ok) throw new Error("Failed to export GMaps CSV");
  return { blob: await res.blob(), filename: `gmaps_${runId}.csv` };
}

/**
 * Function: gmapsExportEnrichedCsv
 *
 * WHAT IT DOES:
 * Downloads the enriched CSV export (with executive contacts) for a specific Google Maps run.
 * Columns include: name, title, company_name, domain, source, work_email,
 * phone_number, linkedin_profile, other_public_profiles.
 *
 * WHERE IT IS USED:
 * - e:\WORK\Renoweb\lead-gen\app\components\gmaps\GmapsView.js
 *
 * ARGUMENTS:
 * - `runId` (String): The ID of the run to export.
 *
 * RETURNS: Promise<{ blob: Blob, filename: string }>
 */
export async function gmapsExportEnrichedCsv(runId) {
  const res = await fetch(`${BASE_URL}/gmaps/runs/${runId}/export_enriched.csv`);
  if (!res.ok) throw new Error("Failed to export enriched GMaps CSV");
  return { blob: await res.blob(), filename: `gmaps_enriched_${runId}.csv` };
}
