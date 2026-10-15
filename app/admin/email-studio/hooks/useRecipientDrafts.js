import { useState } from "react";

// Keep a separate subject, message, and template choice per account and email type.
export default function useRecipientDrafts({
  typeId,
  activeUserId,
  defaultDraft,
  onUpdateDefault,
  onReplaceDefault,
}) {
  const [drafts, setDrafts] = useState({});
  const keyFor = (userId) => `${typeId}:${userId}`;

  function draftFor(userId) {
    return drafts[keyFor(userId)] || defaultDraft;
  }

  function updateDraft(field, value) {
    if (!activeUserId) {
      onUpdateDefault(field, value);
      return;
    }
    const key = keyFor(activeUserId);
    setDrafts((current) => ({
      ...current,
      [key]: { ...(current[key] || defaultDraft), [field]: value },
    }));
  }

  function replaceDraft(draft) {
    if (!activeUserId) {
      onReplaceDefault(draft);
      return;
    }
    setDrafts((current) => ({ ...current, [keyFor(activeUserId)]: draft }));
  }

  return {
    draft: activeUserId ? draftFor(activeUserId) : defaultDraft,
    draftFor,
    updateDraft,
    replaceDraft,
  };
}
