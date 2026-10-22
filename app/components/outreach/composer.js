// # Starter copy is editable, never sent automatically, and makes no invented
// # claims about a lead. Saved custom templates live only in this studio session.
export const STARTER_TEMPLATES = [
  // # The fixed Blue note presentation is rendered by the server after body
  // # sanitation. Copy stays editable and never invents results or lead history.
  { id: "blue-note", name: "The blue note", presentation: "studio", subject: "An idea worth exploring, {{first_name}}", html: "<p>Hi {{first_name}},</p><h2>Good things start with a conversation.</h2><p>I wanted to connect with you about <strong>{{company}}</strong> and see whether there is a useful way for us to work together.</p><p>I would love to learn what your team is focused on and share a little about what I do.</p><blockquote>Would you be open to a brief conversation? A quick reply is all it takes to get started.</blockquote><p>If someone else on your team would be a better person to speak with, I would appreciate an introduction.</p><p>Thanks for your time,</p>" },
  { id: "intro", name: "A thoughtful introduction", subject: "A quick introduction, {{first_name}}", html: "<p>Hi {{first_name}},</p><p>I wanted to introduce myself and learn more about your work at {{company}}.</p><p>Would you be open to a brief conversation?</p><p>Best,</p>" },
  { id: "conversation", name: "Start a conversation", subject: "Connecting with {{company}}", html: "<p>Hi {{first_name}},</p><p>I would love to understand what your team is focused on right now.</p><p>Is there a good time for us to connect this week?</p>" },
  { id: "followup", name: "A gentle follow-up", subject: "Following up, {{first_name}}", html: "<p>Hi {{first_name}},</p><p>I wanted to follow up on my earlier note. If the timing is not right, no problem at all.</p><p>Would a short conversation be useful?</p>" },
];

export function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
}

// # Browser sanitation protects editing/preview surfaces; server sanitation is
// # still authoritative before persistence or sending. Drop all active content.
export function sanitizeMarkup(markup) {
  const doc = new DOMParser().parseFromString(markup, "text/html");
  const allowed = new Set(["p", "div", "br", "strong", "b", "em", "i", "u", "ul", "ol", "li", "a", "blockquote", "h2", "h3"]);
  function clean(node) {
    if (node.nodeType === 3) return escapeHTML(node.textContent);
    if (node.nodeType !== 1 || ["SCRIPT", "STYLE", "IFRAME", "OBJECT", "SVG", "MATH", "TEMPLATE"].includes(node.tagName)) return "";
    const inside = Array.from(node.childNodes).map(clean).join("");
    const tag = node.tagName.toLowerCase();
    if (!allowed.has(tag)) return inside;
    const href = node.getAttribute("href") || "";
    const attrs = tag === "a" && /^(https?:\/\/|mailto:)/i.test(href) ? ` href="${escapeHTML(href)}" rel="noopener noreferrer"` : "";
    return tag === "br" ? "<br>" : `<${tag}${attrs}>${inside}</${tag}>`;
  }
  return Array.from(doc.body.childNodes).map(clean).join("");
}

export function plainText(markup) {
  if (!markup) return "";
  const doc = new DOMParser().parseFromString(markup.replace(/<br\s*\/?\s*>/gi, "\n").replace(/<\/(p|div|li|blockquote)>/gi, "\n"), "text/html");
  return doc.body.textContent.trim();
}

export function composePayload(markup, signature) {
  const html = sanitizeMarkup(markup) + (signature.trim() ? `<p>—<br>${escapeHTML(signature.trim()).replace(/\n/g, "<br>")}</p>` : "");
  return { body: plainText(html), body_html: html };
}

export function personalizeHTML(markup, recipient) {
  return markup.replace(/\{\{([^{}]+)\}\}/g, (original, key) => recipient[key.trim()] ? escapeHTML(recipient[key.trim()]) : original);
}
