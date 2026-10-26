import { ACTION_LABELS, CONTROL_LABELS, MODULE_LABELS } from "../lib/interactionAnalytics";

// # PDF generation uses the loaded report snapshot; it never reads the DOM or calls a pipeline.
const text = value => String(value ?? "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[\u2013\u2014]/g, "-").replace(/[\u2018\u2019]/g, "'").replace(/[^\x20-\x7E\n]/g, " ");
const count = value => Number(value || 0).toLocaleString("en-US");
const label = value => text(CONTROL_LABELS[value] || ACTION_LABELS[value] || String(value).replaceAll("_", " ").replace(/^./, character => character.toUpperCase()));
const date = value => value ? new Date(value).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" }) + " IST" : "Not recorded";

export async function createAnalyticsPdf(report) {
  // # Load PDF dependencies only on demand so normal analytics and pipeline screens stay light.
  const [{ jsPDF }, { autoTable }] = await Promise.all([import("jspdf"), import("jspdf-autotable")]);
  if (!report?.metrics || !Array.isArray(report.modules) || !Array.isArray(report.funnel)) throw new Error("Load an analytics report before downloading it.");
  const doc = new jsPDF({ unit: "mm", format: "a4", compress: true });
  doc.setProperties({ title: "Simpleads - Customer behaviour report", subject: "Admin analytics", author: "Simpleads", creator: "Simpleads Admin Portal" });
  const width = 178, left = 16, bottom = 277;
  let y = 33;
  const room = height => {
    // # Every drawn section reserves space; long tables paginate with repeated column headings.
    if (y + height > bottom) { doc.addPage(); y = 33; }
  };
  const paragraph = (value, muted = true) => {
    doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(...(muted ? [91, 107, 128] : [20, 36, 58]));
    for (const line of doc.splitTextToSize(text(value), width)) { room(5); doc.text(line, left, y); y += 4.6; }
    y += 2;
  };
  const heading = title => {
    room(24); y += 5; doc.setFont("helvetica", "bold"); doc.setFontSize(13); doc.setTextColor(20, 36, 58); doc.text(title, left, y); y += 8;
  };
  const table = (headers, body, emptyMessage) => {
    if (!body.length) { paragraph(emptyMessage || "No activity recorded for this period."); return; }
    autoTable(doc, { startY: y, margin: { top: 33, bottom: 20, left, right: 16 }, head: [headers], body: body.map(row => row.map(text)),
      theme: "striped", styles: { font: "helvetica", fontSize: 8, cellPadding: 2.7, overflow: "linebreak", textColor: [36, 52, 72], lineColor: [225, 232, 240] },
      headStyles: { fillColor: [2, 61, 187], textColor: [255, 255, 255], fontStyle: "bold" }, alternateRowStyles: { fillColor: [244, 248, 253] },
      rowPageBreak: "avoid", showHead: "everyPage" });
    y = doc.lastAutoTable.finalY + 8;
  };
  const inModule = row => report.selected_module === "all" || row.module === report.selected_module;
  const moduleRows = report.modules.filter(inModule);
  paragraph(`${report.selected_module === "all" ? "All modules" : MODULE_LABELS[report.selected_module]} | Last ${report.days} days`, false);
  paragraph(`Period: ${date(report.start)} to ${date(report.end)}\nReport snapshot: ${date(report.generated_at)}`);
  paragraph("Signed-in customer activity. Internal/admin accounts are excluded.");
  if (report.truncated) paragraph("PARTIAL DATA: The report processing limit was reached. Counts are incomplete; use a shorter period or one module.", false);

  heading("Customer overview");
  room(30);
  const metrics = [["Active customers", "active_users"], ["Submitted a search", "submitted_users"], ["Viewed results", "result_users"], ["Requested export", "export_users"]];
  metrics.forEach(([title, key], index) => {
    const x = left + index * 45;
    doc.setFillColor(240, 246, 255); doc.roundedRect(x, y, 43, 24, 2, 2, "F");
    doc.setTextColor(2, 61, 187); doc.setFontSize(19); doc.setFont("helvetica", "bold"); doc.text(count(report.metrics[key]), x + 3, y + 10);
    doc.setTextColor(61, 78, 100); doc.setFontSize(8); doc.setFont("helvetica", "normal"); doc.text(title, x + 3, y + 18);
  });
  y += 32;
  paragraph("Cards count distinct customers independently. Export requests indicate clicks, not confirmed file saves.");

  heading("Module adoption");
  table(["Module", "Active customers", "Search submissions", "Export customers"], moduleRows.map(row => [row.label, count(row.people), count(row.submissions), count(row.exports)]));
  heading("Customer journey");
  paragraph("Sequential steps within the same customer session and module. Counts represent sessions, not individual searches.");
  const base = report.funnel[0]?.count || 0;
  for (const stage of report.funnel) {
    room(17);
    const percentage = base ? Math.round(stage.count / base * 100) : 0;
    doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(36, 52, 72);
    doc.text(text(stage.label), left, y); doc.text(`${count(stage.count)} sessions (${percentage}%)`, left + width, y, { align: "right" });
    doc.setFillColor(235, 240, 247); doc.roundedRect(left, y + 3, width, 3, 1, 1, "F");
    if (percentage) { doc.setFillColor(48, 143, 239); doc.rect(left, y + 3, width * Math.min(100, percentage) / 100, 3, "F"); }
    y += 15;
  }

  heading("Confirmed search outcomes");
  paragraph("Existing server records, grouped by when the search started. Running is the saved status; interrupted older jobs may lack a final outcome.");
  table(["Module", "Accepted", "With results", "No results", "Failed", "Cancelled", "Running"], moduleRows.map(row => [row.label, count(row.runs), count(row.completed), count(row.empty), count(row.failed), count(row.cancelled), count(row.running)]));

  const settingsTable = (title, options, description) => {
    // # Include both settings modes and every returned value, regardless of the UI's selected tab.
    heading(title); paragraph(description);
    const rows = options.filter(inModule).flatMap(option => (option.values.length ? option.values : [{ label: "No selections", count: 0 }]).map(value => [MODULE_LABELS[option.module], label(option.control), label(value.label), count(value.count), `${option.total ? Math.round(value.count / option.total * 100) : 0}%`, count(option.total), count(option.people)]));
    table(["Module", "Setting", "Choice", "Count", "Share", "Recorded total", "Customers"], rows, "No settings were recorded for this period.");
  };
  settingsTable("Settings used in submitted searches", report.submitted_options || [], "Final submitted settings, including defaults. Share uses searches recording each setting as the denominator. Multiple selections can total over 100%.");
  settingsTable("Settings changed by customers", report.options || [], "Deliberate control changes. Share uses recorded changes to each setting as the denominator. Top 12 values per setting are available in this report.");

  heading("Button and link activity");
  paragraph("All actions returned for this date range and module, across every dashboard page. The action-search box does not restrict this export. Up to 60 ranked actions are available.");
  table(["Action", "Module", "Customers", "Total clicks"], (report.actions || []).filter(inModule).map(row => [label(row.action), MODULE_LABELS[row.module], count(row.people), count(row.clicks)]));
  heading("Daily active customers");
  paragraph("Daily counts use UTC dates. This measures activity rather than retention cohorts.");
  // # Insert zero-activity dates so chart spacing represents real elapsed calendar days.
  const daily = [];
  if (report.daily?.length) {
    const recorded = new Map(report.daily.map(row => [row.date, row.users]));
    const cursor = new Date(report.start); cursor.setUTCHours(0, 0, 0, 0);
    const end = new Date(report.end);
    for (let index = 0; cursor <= end && index < 92; index++, cursor.setUTCDate(cursor.getUTCDate() + 1)) {
      const day = cursor.toISOString().slice(0, 10);
      daily.push({ date: day, users: recorded.get(day) || 0 });
    }
  }
  if (daily.length) {
    // # Draw vector bars from report data, keeping the chart sharp without screen captures.
    room(48);
    const maximum = Math.max(1, ...daily.map(row => row.users));
    const barWidth = width / daily.length;
    doc.setDrawColor(220, 228, 238); doc.line(left, y + 30, left + width, y + 30);
    daily.forEach((row, index) => {
      const height = row.users / maximum * 27;
      doc.setFillColor(48, 143, 239); if (height) doc.rect(left + index * barWidth, y + 30 - height, Math.max(0.4, barWidth - 1), height, "F");
    });
    doc.setFontSize(8); doc.setTextColor(91, 107, 128); doc.text(text(daily[0].date), left, y + 36); doc.text(text(daily.at(-1).date), left + width, y + 36, { align: "right" }); y += 43;
  }
  table(["Date (UTC)", "Active customers"], daily.map(row => [row.date, count(row.users)]));
  heading("Coverage and definitions");
  paragraph(report.coverage || "Signed-in customers only. Admin activity excluded.");
  paragraph(`First recorded interaction: ${date(report.tracking_started_at)}. Browser blocking, network failures and closed tabs can leave gaps. Historical page views cannot reconstruct unrecorded interactions.`);
  paragraph("Results viewed means the instrumented results heading was visible for at least one second. This does not establish that every result was read. This file contains aggregate report data, not lead records.");

  // # Headers and numbered footers are applied after pagination, including automatic table pages.
  const pages = doc.getNumberOfPages();
  for (let page = 1; page <= pages; page++) {
    doc.setPage(page); doc.setFont("helvetica", "bold"); doc.setTextColor(2, 61, 187); doc.setFontSize(12); doc.text("SIMPLEADS", left, 15);
    doc.setTextColor(36, 52, 72); doc.setFontSize(9); doc.text("Customer behaviour report", left + width, 15, { align: "right" });
    doc.setDrawColor(225, 232, 240); doc.line(left, 22, left + width, 22); doc.line(left, 282, left + width, 282);
    doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(91, 107, 128); doc.text("Simpleads Admin | Customer insights", left, 288); doc.text(`${page} / ${pages}`, left + width, 288, { align: "right" });
  }
  return doc;
}

export async function downloadAnalyticsPdf(report) {
  // # The snapshot determines the filename, even if filters change while dependencies load.
  const doc = await createAnalyticsPdf(report);
  const moduleId = MODULE_LABELS[report.selected_module] ? report.selected_module : "all";
  await doc.save(`simpleads-analytics-${moduleId}-${report.days}days-${report.generated_at.slice(0, 10)}.pdf`, { returnPromise: true });
}
