// # Normalize only known email fields. Never scan arbitrary row descriptions for
// # addresses: a description may contain unrelated third-party contact details.
export function recipientsFromRows(rows) {
  const recipients = [];
  const seen = new Set();
  let missing = 0;
  let duplicates = 0;
  for (const row of rows) {
    const candidates = [
      row.email,
      row.emails,
      row.emailAddress,
      row.email_address,
      row.work_email,
      row.workEmail,
    ];
    const values = candidates.flatMap((value) =>
      Array.isArray(value) ? value : [value],
    );
    const email = values
      .flatMap((value) => {
        const text =
          typeof value === "object" && value
            ? value.email || value.address
            : value;
        return typeof text === "string" ? text.split(/[,;\s]+/) : [];
      })
      .map((value) => value.trim().toLowerCase())
      .find((value) => /^[^\s<>@,;]+@[^\s<>@,;]+\.[^\s<>@,;]+$/.test(value));
    if (!email) {
      missing += 1;
      continue;
    }
    if (seen.has(email)) {
      duplicates += 1;
      continue;
    }
    seen.add(email);
    const name =
      row.first_name ||
      row.firstName ||
      String(row.name || row.fullName || "").split(" ")[0];
    const company = row.companyName || row.company_name || row.company || "";
    recipients.push({
      email,
      first_name: String(name || "")
        .replace(/[\r\n]/g, " ")
        .slice(0, 120),
      company: String(
        typeof company === "object" ? company.name || "" : company,
      )
        .replace(/[\r\n]/g, " ")
        .slice(0, 200),
    });
  }
  return { recipients, missing, duplicates };
}

// # Keep preview substitution aligned with the server allowlist. Missing values
// # remain visible here; the backend rejects them before queueing a batch.
export function personalize(text, recipient) {
  return text.replace(
    /\{\{([^{}]+)\}\}/g,
    (original, key) => recipient[key.trim()] || original,
  );
}
