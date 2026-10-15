export function isEligibleRecipient(user, marketing) {
  const hasEmail =
    !!user.email && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(user.email);
  const marketingBlocked =
    marketing && (user.marketing_unsubscribed || user.is_suspended);
  return hasEmail && !marketingBlocked;
}

export function hasDuplicateAddress(user, recipients) {
  return recipients.some(
    (recipient) => recipient.email?.toLowerCase() === user.email?.toLowerCase(),
  );
}

export function hasMessageText(body) {
  return !!body.replace(/<[^>]*>/g, "").trim();
}

export function deliverySummary(results = []) {
  const sent = results.filter((result) => result.status === "sent").length;
  const failed = results.filter((result) => result.status === "failed").length;
  return { sent, failed };
}
