// # This design asset is generated from the backend's fixed email frame. Keep
// # both copies synchronized when changing presentation; no user CSS is accepted.
// # The caller supplies sanitized, personalized HTML and real sender metadata.
import design from "./emailDesign.json";
import { escapeHTML } from "./composer";

export function renderStudioEmail(content, senderName, senderEmail, unsubscribeURL) {
  const styled = content.replace(/<(p|h2|h3|blockquote|ul|ol|li|a)(\s[^>]*)?>/g,
    (_, tag, attributes = "") => `<${tag}${attributes} style="${design.tagStyles[tag]}">`);
  const values = { content: styled, sender_name: escapeHTML(senderName || senderEmail),
    sender_email: escapeHTML(senderEmail), unsubscribe_url: escapeHTML(unsubscribeURL) };
  return design.html.replace(/\{\{(content|sender_name|sender_email|unsubscribe_url)\}\}/g, (_, field) => values[field]);
}
