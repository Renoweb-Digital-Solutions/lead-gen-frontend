export const MAX_RECIPIENTS = 5;
export const MAX_SUBJECT_LENGTH = 180;

export const STUDIO_STEPS = [
  { id: "compose", number: "01", label: "Compose" },
  { id: "review", number: "02", label: "Review & send" },
  { id: "result", number: "03", label: "Delivery" },
];

export function createBlankDraft() {
  return {
    templateId: "",
    name: "Untitled template",
    subject: "",
    body: "<p>Hi {{name}},</p><p>Warmly,<br>The Simpleads team</p>",
  };
}

export function draftFromTemplate(template) {
  return {
    templateId: template.id,
    name: template.name,
    subject: template.subject,
    body: template.body,
  };
}
