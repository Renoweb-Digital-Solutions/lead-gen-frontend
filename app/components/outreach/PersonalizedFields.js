"use client";

// # Editors show actual lead details while their stored value remains a shared
// # template. Protected chips serialize back to tokens; otherwise viewing Bad's
// # draft would accidentally bake "Bad" into every selected recipient's email.
import { useEffect, useRef } from "react";
import { escapeHTML, sanitizeMarkup } from "./composer";
import styles from "./Outreach.module.css";

const labels = { first_name: "First name unavailable", company: "Company unavailable", email: "Email unavailable" };

export function createPersonalizedMarkup(value, recipient, plain = false) {
  const container = document.createElement("div");
  container.innerHTML = plain ? escapeHTML(value) : sanitizeMarkup(value);
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  for (const node of nodes) {
    const fragment = document.createDocumentFragment();
    let offset = 0;
    for (const match of node.textContent.matchAll(/\{\{\s*(first_name|company|email)\s*\}\}/g)) {
      fragment.append(node.textContent.slice(offset, match.index));
      const chip = document.createElement("span");
      const field = match[1];
      chip.dataset.outreachField = field;
      chip.contentEditable = "false";
      chip.className = styles.personalizedDetail;
      chip.textContent = recipient?.[field] || labels[field];
      chip.dataset.missing = recipient?.[field] ? "false" : "true";
      chip.title = `Automatically uses each lead's ${field.replace("_", " ")}`;
      fragment.append(chip);
      offset = match.index + match[0].length;
    }
    if (offset) { fragment.append(node.textContent.slice(offset)); node.replaceWith(fragment); }
  }
  return container.innerHTML;
}

export function readPersonalizedValue(element, plain = false) {
  const clone = element.cloneNode(true);
  clone.querySelectorAll("[data-outreach-field]").forEach((chip) => {
    const field = chip.dataset.outreachField;
    if (Object.hasOwn(labels, field)) chip.replaceWith(document.createTextNode(`{{${field}}}`));
  });
  return plain ? clone.textContent.replace(/[\r\n]+/g, " ") : clone.innerHTML;
}

export function PersonalizedSubject({ value, recipient, onChange, disabled }) {
  const editor = useRef(null);
  const lastEmitted = useRef(null);
  const renderedFor = useRef(null);
  const recipientKey = JSON.stringify(recipient || null);
  useEffect(() => {
    // # Ordinary keystrokes retain the caret; switching leads re-renders only
    // # the visual details, without modifying the template's stored subject.
    if (lastEmitted.current === value && renderedFor.current === recipientKey) return;
    editor.current.innerHTML = createPersonalizedMarkup(value, recipient, true);
    renderedFor.current = recipientKey;
  }, [value, recipientKey, recipient]);

  function emit() {
    const text = readPersonalizedValue(editor.current, true);
    const bounded = text.slice(0, 200);
    if (bounded !== text) editor.current.innerHTML = createPersonalizedMarkup(bounded, recipient, true);
    lastEmitted.current = bounded;
    onChange(bounded);
  }
  return <div ref={editor} role="textbox" aria-label="Subject" aria-multiline="false" aria-disabled={disabled}
    className={styles.personalizedSubject} contentEditable={!disabled} suppressContentEditableWarning
    data-placeholder="Give your conversation a subject" onInput={emit}
    onKeyDown={(event) => { if (event.key === "Enter") event.preventDefault(); }}
    onPaste={(event) => {
      event.preventDefault();
      document.execCommand("insertText", false, event.clipboardData.getData("text/plain").replace(/[\r\n]+/g, " "));
      emit();
    }} onDrop={(event) => event.preventDefault()} />;
}
