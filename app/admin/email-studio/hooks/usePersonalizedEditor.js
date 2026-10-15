import { useEffect, useRef } from "react";
import { createEditorMarkup, readEditorValue } from "../utils/personalization";
import styles from "../EmailStudio.module.css";

export default function usePersonalizedEditor(value, user, plain = false) {
  const editor = useRef(null);
  const renderedFor = useRef(null);

  useEffect(() => {
    const context = JSON.stringify([user?._id, user?.username, user?.email]);
    const node = editor.current;
    if (!node) return;

    const recipientChanged = renderedFor.current !== context;
    const valueChanged = readEditorValue(node, { plain }) !== value;

    // Keep the DOM intact on ordinary keystrokes so the caret stays in place.
    if (recipientChanged || valueChanged) {
      node.innerHTML = createEditorMarkup(value, user, {
        plain,
        fieldClassName: styles.personalizationVariable,
      });
      renderedFor.current = context;
    }
  }, [value, user, plain]);

  return editor;
}
