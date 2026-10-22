"use client";

// # Formatting stays inside the editor. Paste/drop is plain text, links require
// # an allowed scheme, and selection is preserved while toolbar controls run.
import { useEffect, useRef, useState } from "react";
import { Bold, Italic, Underline, List, ListOrdered, Link2, Undo2, Redo2, Braces } from "lucide-react";
import { sanitizeMarkup } from "./composer";
import { createPersonalizedMarkup, readPersonalizedValue } from "./PersonalizedFields";
import styles from "./Outreach.module.css";

const tools = [["bold", "Bold", Bold], ["italic", "Italic", Italic], ["underline", "Underline", Underline],
  ["insertUnorderedList", "Bullet list", List], ["insertOrderedList", "Numbered list", ListOrdered], ["undo", "Undo", Undo2], ["redo", "Redo", Redo2]];

export default function RichComposer({ value, onChange, disabled, recipient }) {
  const editor = useRef(null);
  const lastEmitted = useRef(null);
  const renderedRecipient = useRef(null);
  const selection = useRef(null);
  const [linkOpen, setLinkOpen] = useState(false);
  const [url, setUrl] = useState("");
  useEffect(() => {
    // # Do not rewrite self-authored DOM on each keystroke: browser-normalized
    // # spaces/markup can differ from serialized HTML and would reset the caret
    // # and undo stack. External template changes still synchronize the editor.
    const context = JSON.stringify(recipient || null);
    if (lastEmitted.current === value && renderedRecipient.current === context) return;
    if (editor.current) editor.current.innerHTML = createPersonalizedMarkup(value, recipient);
    renderedRecipient.current = context;
  }, [value, recipient]);
  function emit() {
    const clean = sanitizeMarkup(readPersonalizedValue(editor.current));
    lastEmitted.current = clean;
    onChange(clean);
  }
  function execute(command, argument) {
    editor.current.focus();
    document.execCommand("styleWithCSS", false, false);
    document.execCommand(command, false, argument);
    emit();
  }
  function rememberSelection() {
    const active = window.getSelection();
    selection.current = active?.rangeCount && editor.current.contains(active.anchorNode) ? active.getRangeAt(0).cloneRange() : null;
  }
  function insertLink() {
    editor.current.focus();
    if (selection.current && editor.current.contains(selection.current.startContainer)) {
      const active = window.getSelection(); active.removeAllRanges(); active.addRange(selection.current);
    }
    execute("createLink", url); setLinkOpen(false); setUrl("");
  }
  return <div className={styles.richWrap}>
    <div className={styles.formatBar} role="toolbar" aria-label="Message formatting">
      {tools.map(([command, label, Icon]) => <button key={command} type="button" title={label} aria-label={label}
        disabled={disabled} onMouseDown={(event) => event.preventDefault()} onClick={() => execute(command)}><Icon size={15} /></button>)}
      <button type="button" title="Insert link" aria-label="Insert link" disabled={disabled}
        onMouseDown={(event) => { event.preventDefault(); rememberSelection(); }} onClick={() => setLinkOpen(!linkOpen)}><Link2 size={15} /></button>
      <span className={styles.formatDivider} />
      {["first_name", "company", "email"].map((field) => <button type="button" key={field} className={styles.variableButton} disabled={disabled}
        title={`Insert this lead's ${field.replace("_", " ")}`} onMouseDown={(event) => event.preventDefault()}
        onClick={() => {
          execute("insertHTML", createPersonalizedMarkup(`{{${field}}}`, recipient, true));
        }}><Braces size={12} /> {field === "first_name" ? "First name" : field === "company" ? "Company" : "Email"}</button>)}
    </div>
    {linkOpen && <div className={styles.linkControls}><input aria-label="Link address" placeholder="https://example.com" value={url} onChange={(event) => setUrl(event.target.value)} />
      <button type="button" disabled={disabled || !/^(https?:\/\/|mailto:)/i.test(url)} onClick={insertLink}>Insert link</button></div>}
    <div ref={editor} className={styles.richEditor} role="textbox" aria-label="Message" aria-multiline="true"
      data-placeholder="Write something worth replying to…" contentEditable={!disabled} suppressContentEditableWarning
      onInput={emit} onPaste={(event) => { event.preventDefault(); execute("insertText", event.clipboardData.getData("text/plain")); }}
      onDrop={(event) => { event.preventDefault(); execute("insertText", event.dataTransfer.getData("text/plain")); }} />
  </div>;
}
