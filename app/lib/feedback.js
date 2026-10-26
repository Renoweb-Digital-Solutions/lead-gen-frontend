// # Shared emoji meanings keep the widget and admin inbox consistent.
export const FEEDBACK_RATINGS = [
  { value: 1, emoji: "\uD83D\uDE1E", label: "Disappointed" },
  { value: 2, emoji: "\uD83D\uDE15", label: "Not great" },
  { value: 3, emoji: "\uD83D\uDE10", label: "Okay" },
  { value: 4, emoji: "\uD83D\uDE0A", label: "Good" },
  { value: 5, emoji: "\uD83E\uDD29", label: "Loved it" },
];
export const FEEDBACK_PIPELINES = { leadgen: "Lead generation", gmaps: "Google Maps", youtube: "YouTube", instagram: "Instagram", b2b: "B2B directories", investors: "Investors" };
export const FEEDBACK_PIPELINE_EVENT = "simpleads:feedback-pipeline";

export function randomFeedbackDelay(retry = false) {
  // # First ask 20-60 seconds after a run; unanswered prompts retry every 2-5 minutes.
  return retry ? 120000 + Math.floor(Math.random() * 180000) : 20000 + Math.floor(Math.random() * 40000);
}

export function feedbackAccountKey(token) {
  // # Storage is account-scoped, with no comment drafts or credentials persisted here.
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(base64), (value) => value.charCodeAt(0))));
    return payload.sub ? `simpleads:feedback:${encodeURIComponent(payload.sub)}` : null;
  } catch { return null; }
}
