// # Formatting never invents a zero, currency, or billing date for missing data.
export function money(amount, currency) {
  if (typeof amount !== "number" || !currency) return "—";
  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency,
      maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString("en")}`;
  }
}

export function day(value, options = {}) {
  if (!value || Number.isNaN(new Date(value).getTime())) return "Not scheduled";
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...options,
  }).format(new Date(value));
}

export function count(value) {
  return typeof value === "number" ? value.toLocaleString("en") : "—";
}

export function cadence(plan) {
  if (plan.isFree) return "free starter access";
  if (plan.billingType === "ONE_TIME") return "one-time payment";
  if (plan.intervalType === "YEAR") return "per year";
  if (plan.intervalType === "WEEK") return "per week";
  return "per month";
}

export function statusTone(status) {
  if (
    ["SUCCESS", "PAID", "ACTIVE", "COMPLETED", "AUTHENTICATED"].includes(status)
  )
    return "success";
  if (["PENDING", "INITIALIZED", "PROCESSING", "ON_HOLD"].includes(status))
    return "pending";
  if (["FAILED", "CANCELLED", "EXPIRED", "DECLINED"].includes(status))
    return "failed";
  return "neutral";
}

export function statusLabel(status) {
  return (status || "Unknown")
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/^\w/, (letter) => letter.toUpperCase());
}
