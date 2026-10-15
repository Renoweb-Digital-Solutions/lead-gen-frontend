const HTML_ENTITIES = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escapeHtml(value) {
  return String(value).replace(
    /[&<>"']/g,
    (character) => HTML_ENTITIES[character],
  );
}

// Text callers use React's escaping; HTML previews must escape account values here.
export function personalize(value, user, { html = false } = {}) {
  const variables = {
    name: user?.username || "there",
    username: user?.username || "there",
    email: user?.email || "",
    feedback_title: "your experience",
    feedback: "your experience with Simpleads",
  };

  return value.replace(
    /\{\{\s*(name|username|email|feedback_title|feedback)\s*\}\}/g,
    (_, key) => (html ? escapeHtml(variables[key]) : variables[key]),
  );
}

// Protected fields display a username without baking it into a shared template.
export function createEditorMarkup(
  value,
  user,
  { plain = false, fieldClassName } = {},
) {
  const container = document.createElement("div");
  container.innerHTML = plain ? escapeHtml(value) : value;
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  const nodes = [];

  while (walker.nextNode()) nodes.push(walker.currentNode);

  nodes.forEach((node) => {
    const matcher = /\{\{\s*(name|username|email)\s*\}\}/g;
    const fragment = document.createDocumentFragment();
    let start = 0;

    for (const match of node.textContent.matchAll(matcher)) {
      fragment.append(node.textContent.slice(start, match.index));

      const field = document.createElement("span");
      const isEmail = match[1] === "email";
      field.contentEditable = "false";
      field.dataset.emailVariable = match[1];
      field.className = fieldClassName || "";
      field.textContent = isEmail
        ? user?.email || "recipient email"
        : user?.username || "recipient username";
      field.title = isEmail
        ? "Each recipient's email address"
        : "Each recipient's username";

      fragment.append(field);
      start = match.index + match[0].length;
    }

    if (start) {
      fragment.append(node.textContent.slice(start));
      node.replaceWith(fragment);
    }
  });

  return container.innerHTML;
}

export function readEditorValue(element, { plain = false } = {}) {
  const clone = element.cloneNode(true);

  clone.querySelectorAll("[data-email-variable]").forEach((field) => {
    field.replaceWith(
      document.createTextNode(`{{${field.dataset.emailVariable}}}`),
    );
  });

  return plain ? clone.textContent.replace(/[\r\n]+/g, " ") : clone.innerHTML;
}
