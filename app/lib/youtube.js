// # Keep the visible rows and exports on the same field contract.
export const YOUTUBE_FIELDS = [
  "channelName", "channelUrl", "subscribers", "viewCount", "videoCount",
  "averageViewsPerVideo", "country", "joinedDate", "channelAgeYears",
  "email", "otherEmails", "website", "keywordMatched", "scrapedAt",
];

export function selectYoutubeChannels(channels, { minSubscribers, country, onlyEmail, sort }) {
  // # Missing or invalid dates follow valid dates, including in partial results.
  const dateValue = (value) => {
    const date = value ? Date.parse(value) : NaN;
    return Number.isFinite(date) ? date : Infinity;
  };
  return channels.filter((row) => (
    row.subscribers >= (Number(minSubscribers) || 0)
    && (!country || row.country === country)
    && (!onlyEmail || Boolean(row.email))
  )).sort((a, b) => sort === "age"
    ? (dateValue(a.joinedDate) - dateValue(b.joinedDate)) || b.subscribers - a.subscribers
    : b.subscribers - a.subscribers);
}

export function youtubeCsv(channels) {
  // # BOM, CRLF, quoted fields, and formula escaping support safe Excel imports.
  const cell = (value) => {
    let text = value == null ? "" : typeof value === "object" ? JSON.stringify(value) : String(value);
    if (/^[\s]*[=+@-]/.test(text)) text = "'" + text;
    return `"${text.replace(/"/g, '""')}"`;
  };
  return "\uFEFF" + [YOUTUBE_FIELDS.join(","), ...channels.map((row) => YOUTUBE_FIELDS.map((key) => cell(row[key])).join(","))].join("\r\n");
}

export function safeWebsite(value) {
  // # Only HTTP links can be opened from actor output.
  if (!value || /^[a-z]+:/i.test(value) && !/^https?:\/\//i.test(value)) return null;
  try {
    const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
    return ["http:", "https:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}
