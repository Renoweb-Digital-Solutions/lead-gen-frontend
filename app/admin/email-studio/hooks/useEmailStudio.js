import { useState } from "react";
import {
  createBlankDraft,
  draftFromTemplate,
  MAX_RECIPIENTS,
} from "../constants";
import useTemplateLibrary from "./useTemplateLibrary";
import {
  hasDuplicateAddress,
  hasMessageText,
  isEligibleRecipient,
} from "../utils/recipients";
import useEmailDelivery from "./useEmailDelivery";
import useRecipientDrafts from "./useRecipientDrafts";

// Coordinate the compose/review flow; section components only receive their own data.
export default function useEmailStudio({
  users,
  initialUser,
  initialType,
  onDelivered,
}) {
  const [selectedIds, setSelectedIds] = useState(
    initialUser ? [initialUser._id] : [],
  );
  const [previewId, setPreviewId] = useState("");
  const [consent, setConsent] = useState(false);
  const [step, setStep] = useState("compose");
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const delivery = useEmailDelivery();

  const catalog = useTemplateLibrary(initialType, setError);
  const { library, typeId, loading } = catalog;

  const emailType = library?.types.find((type) => type.id === typeId);
  const marketing = emailType?.purpose === "marketing";
  const templates =
    library?.templates.filter((template) => template.type_id === typeId) || [];
  const recipients = users.filter((user) => selectedIds.includes(user._id));
  const previewUser =
    recipients.find((user) => user._id === previewId) || recipients[0];
  const recipientDrafts = useRecipientDrafts({
    typeId,
    activeUserId: previewUser?._id,
    defaultDraft: catalog.draft,
    onUpdateDefault: catalog.updateDraft,
    onReplaceDefault: catalog.replaceDraft,
  });
  const { draft } = recipientDrafts;
  const frozen = !!busy || delivery.uncertain;
  const valid =
    !!emailType &&
    selectedIds.length > 0 &&
    selectedIds.length <= MAX_RECIPIENTS &&
    recipients.length === selectedIds.length &&
    recipients.every((user) => {
      const message = recipientDrafts.draftFor(user._id);
      return (
        isEligibleRecipient(user, marketing) &&
        !!message.subject.trim() &&
        hasMessageText(message.body)
      );
    });

  function clearMessages() {
    setError("");
    setNotice("");
  }

  // Every asynchronous editor action shares one busy/error lifecycle.
  async function runAction(action, callback) {
    setBusy(action);
    clearMessages();
    try {
      await callback();
      return true;
    } catch (failure) {
      setError(failure.message || "Something went wrong. Please try again.");
      return false;
    } finally {
      setBusy("");
    }
  }

  function selectTemplate(template) {
    recipientDrafts.replaceDraft(draftFromTemplate(template));
    setNotice("");
  }

  function selectType(id) {
    catalog.selectType(id);
    setConsent(false);
    delivery.clearResult();
    setNotice("");
  }

  function isRecipientDisabled(user) {
    if (frozen || !isEligibleRecipient(user, marketing)) return true;
    if (selectedIds.includes(user._id)) return false;
    return (
      selectedIds.length >= MAX_RECIPIENTS ||
      hasDuplicateAddress(user, recipients)
    );
  }

  function toggleRecipient(userId) {
    setSelectedIds((current) =>
      current.includes(userId)
        ? current.filter((id) => id !== userId)
        : [...current, userId],
    );
    setConsent(false);
  }

  function saveTemplate(asNew = false) {
    return runAction("save", async () => {
      const saved = await catalog.saveTemplate(asNew, draft);
      recipientDrafts.replaceDraft(saved);
      setNotice("Template saved to your shared library.");
    });
  }

  function saveType(form) {
    return runAction("type", async () => {
      await catalog.saveType(form);
      setNotice("Email type saved.");
    });
  }

  function send() {
    return runAction("send", async () => {
      const response = await delivery.sendBatch({
        type_id: typeId,
        name: draft.name.trim().length >= 2 ? draft.name : "Email",
        subject: draft.subject,
        body: draft.body,
        user_ids: selectedIds,
        messages: recipients.map((user) => {
          const message = recipientDrafts.draftFor(user._id);
          return {
            user_id: user._id,
            subject: message.subject,
            body: message.body,
          };
        }),
        marketing_confirmed: consent,
      });
      if (!response) {
        setNotice(
          "This batch is still processing. Check delivery status in a moment.",
        );
        return;
      }
      setStep("result");
      onDelivered?.();
    });
  }

  function review() {
    clearMessages();
    setStep("review");
  }

  function composeAnother() {
    const failedIds = delivery.result.results
      .filter((result) => result.status === "failed")
      .map((result) => result.user_id);
    setSelectedIds(failedIds);
    setConsent(false);
    setStep("compose");
    setNotice("");
  }

  return {
    library,
    draft,
    emailType,
    templates,
    typeId,
    marketing,
    recipients,
    selectedIds,
    previewUser,
    consent,
    step,
    loading,
    busy,
    error,
    notice,
    frozen,
    valid,
    result: delivery.result,
    uncertain: delivery.uncertain,
    updateDraft: recipientDrafts.updateDraft,
    selectTemplate,
    selectType,
    isRecipientDisabled,
    toggleRecipient,
    saveTemplate,
    saveType,
    send,
    review,
    composeAnother,
    setPreviewId,
    setConsent,
    edit: () => setStep("compose"),
    startBlank: () => recipientDrafts.replaceDraft(createBlankDraft()),
  };
}
