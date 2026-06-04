const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Check backend health status
 */
export async function checkHealth() {
  const res = await fetch(`${BASE_URL}/health`);
  if (!res.ok) throw new Error("Health check failed");
  return res.json();
}

/**
 * Build the request body from form state
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
 * Export leads — returns a Blob (for ZIP) or text (for CSV)
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
 * Trigger download of a blob
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
