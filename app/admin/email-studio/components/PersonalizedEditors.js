import { useRef, useState } from "react";
import {
  Bold,
  Italic,
  Link2,
  List,
  ListOrdered,
  Underline,
} from "lucide-react";
import { MAX_SUBJECT_LENGTH } from "../constants";
import { createEditorMarkup, readEditorValue } from "../utils/personalization";
import usePersonalizedEditor from "../hooks/usePersonalizedEditor";
import styles from "../EmailStudio.module.css";

const FORMATTING_TOOLS = [
  { icon: Bold, label: "Bold", command: "bold" },
  { icon: Italic, label: "Italic", command: "italic" },
  { icon: Underline, label: "Underline", command: "underline" },
  { icon: List, label: "Bullet list", command: "insertUnorderedList" },
  { icon: ListOrdered, label: "Numbered list", command: "insertOrderedList" },
];

const preserveSelection = (event) => event.preventDefault();

export function PersonalizedSubject({ value, onChange, user, disabled }) {
  const editor = usePersonalizedEditor(value, user, true);

  function updateValue(element) {
    onChange(
      readEditorValue(element, { plain: true }).slice(0, MAX_SUBJECT_LENGTH),
    );
  }

  function pastePlainText(event) {
    event.preventDefault();
    const text = event.clipboardData
      .getData("text/plain")
      .replace(/[\r\n]+/g, " ");
    document.execCommand("insertText", false, text);
    updateValue(editor.current);
  }

  return (
    <div
      ref={editor}
      className={styles.subjectEditor}
      role="textbox"
      aria-label="Subject line"
      aria-multiline="false"
      aria-disabled={disabled}
      contentEditable={!disabled}
      suppressContentEditableWarning
      onInput={(event) => updateValue(event.currentTarget)}
      onKeyDown={(event) => {
        if (event.key === "Enter") event.preventDefault();
      }}
      onPaste={pastePlainText}
    />
  );
}

// Keep DOM selection and formatting details inside the rich text editor.
export function RichEditor({ body, onChange, disabled, user }) {
  const editor = usePersonalizedEditor(body, user);
  const selection = useRef(null);
  const [linkOpen, setLinkOpen] = useState(false);
  const [url, setUrl] = useState("");
  const validLink = /^(https?:\/\/|mailto:)/i.test(url);

  function executeCommand(command, value) {
    editor.current.focus();
    document.execCommand(command, false, value);
    onChange(readEditorValue(editor.current));
  }

  function toggleLinkEditor() {
    const current = window.getSelection();
    selection.current = current?.rangeCount
      ? current.getRangeAt(0).cloneRange()
      : null;
    setLinkOpen((open) => !open);
  }

  function insertLink() {
    editor.current.focus();
    if (selection.current) {
      const current = window.getSelection();
      current.removeAllRanges();
      current.addRange(selection.current);
    }
    executeCommand("createLink", url);
    setLinkOpen(false);
    setUrl("");
  }

  function insertUsername() {
    const markup = createEditorMarkup("{{name}}", user, {
      fieldClassName: styles.personalizationVariable,
    });
    executeCommand("insertHTML", markup);
  }

  function pastePlainText(event) {
    event.preventDefault();
    executeCommand("insertText", event.clipboardData.getData("text/plain"));
  }

  return (
    <div className={styles.editorWrap}>
      <div className={styles.toolbar} aria-label="Text formatting">
        {FORMATTING_TOOLS.map(({ icon: Icon, label, command }) => (
          <button
            key={command}
            type="button"
            title={label}
            aria-label={label}
            disabled={disabled}
            onMouseDown={preserveSelection}
            onClick={() => executeCommand(command)}
          >
            <Icon size={16} />
          </button>
        ))}
        <span />
        <button
          type="button"
          title="Insert link"
          aria-label="Insert link"
          disabled={disabled}
          onMouseDown={preserveSelection}
          onClick={toggleLinkEditor}
        >
          <Link2 size={16} />
        </button>
        <button
          type="button"
          title="Insert recipient username"
          disabled={disabled}
          onMouseDown={preserveSelection}
          onClick={insertUsername}
        >
          + Username
        </button>
      </div>

      {linkOpen && (
        <div className={styles.linkRow}>
          <input
            aria-label="Link URL"
            placeholder="https://example.com"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
          />
          <button
            type="button"
            disabled={disabled || !validLink}
            onClick={insertLink}
          >
            Insert link
          </button>
        </div>
      )}

      <div
        ref={editor}
        className={styles.editor}
        role="textbox"
        aria-label="Email body"
        aria-multiline="true"
        contentEditable={!disabled}
        suppressContentEditableWarning
        onInput={(event) => onChange(readEditorValue(event.currentTarget))}
        onPaste={pastePlainText}
      />
    </div>
  );
}
