// # Derive every displayed date, activity cell, and collection count from fetched records.
export function recordDate(value) {
  if (typeof value !== "string" || !value.trim()) return null;
  const text = value.trim();
  // # Earlier records stored UTC timestamps without an explicit timezone suffix.
  const date = new Date(/^\d{4}-\d{2}-\d{2}T/.test(text) && !/(?:Z|[+-]\d{2}:?\d{2})$/i.test(text) ? `${text}Z` : text);
  return Number.isFinite(date.getTime()) ? date : null;
}

export function dayKey(value, timeZone) {
  const date = recordDate(value);
  if (!date) return "undated";
  const parts = new Intl.DateTimeFormat("en", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(date);
  const part = (type) => parts.find((entry) => entry.type === type).value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}

export function dayLabel(key, options = {}) {
  if (!key || key === "undated") return "Date unavailable";
  // # Local day keys are calendar dates, so UTC formatting prevents shifting them a second time.
  return new Date(`${key}T12:00:00Z`).toLocaleDateString("en", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC", ...options });
}

export const statusKey = (status) => String(status || "unknown").trim().toLowerCase();
export const statusLabel = (status) => statusKey(status).replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

export function sortReports(reports) {
  return [...reports].sort((a, b) => (recordDate(b.created_at)?.getTime() ?? -Infinity) - (recordDate(a.created_at)?.getTime() ?? -Infinity));
}

export function groupReportDays(reports, timeZone) {
  const days = new Map();
  for (const report of sortReports(reports)) {
    const key = dayKey(report.created_at, timeZone);
    if (!days.has(key)) days.set(key, []);
    days.get(key).push(report);
  }
  return [...days].map(([key, entries]) => ({ key, entries }));
}

export function pipelineCollection(reports) {
  const counts = new Map();
  for (const report of reports) {
    const type = report.report_type || "Unspecified pipeline";
    counts.set(type, (counts.get(type) || 0) + 1);
  }
  return [...counts].map(([type, count]) => ({ type, count })).sort((a, b) => b.count - a.count || a.type.localeCompare(b.type));
}

export function filterReports(reports, filters, timeZone) {
  return reports.filter((report) => (!filters.pipeline || (report.report_type || "Unspecified pipeline") === filters.pipeline)
    && (!filters.status || statusKey(report.status) === filters.status)
    && (!filters.day || dayKey(report.created_at, timeZone) === filters.day));
}

export function calendarMonth(month, reports, timeZone) {
  // # Empty calendar dates mean zero recorded runs only when the complete history was fetched.
  const [year, number] = month.split("-").map(Number);
  const first = new Date(Date.UTC(year, number - 1, 1));
  const length = new Date(Date.UTC(year, number, 0)).getUTCDate();
  const days = new Map(groupReportDays(reports, timeZone).map(({ key, entries }) => [key, entries]));
  return {
    offset: (first.getUTCDay() + 6) % 7,
    cells: Array.from({ length }, (_, index) => {
      const key = `${month}-${String(index + 1).padStart(2, "0")}`;
      return { key, day: index + 1, reports: days.get(key) || [] };
    }),
  };
}

export function shiftMonth(month, offset) {
  const [year, number] = month.split("-").map(Number);
  const date = new Date(Date.UTC(year, number - 1 + offset, 1));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function emailPattern(email) {
  // # This decorative signature is generated from the actual email, not a supplied avatar.
  let hash = 2166136261;
  for (const character of email.toLowerCase()) hash = Math.imul(hash ^ character.charCodeAt(0), 16777619) >>> 0;
  const cells = [];
  for (let row = 0; row < 7; row++) {
    for (let column = 0; column < 4; column++) {
      hash = (Math.imul(hash, 1664525) + 1013904223) >>> 0;
      if (hash & 0x80000000) {
        cells.push({ row, column });
        if (column !== 3) cells.push({ row, column: 6 - column });
      }
    }
  }
  return cells;
}
