"use client";

import { Loader2 } from "lucide-react";
import AudiencePanel from "./email-studio/components/AudiencePanel";
import ComposerPanel from "./email-studio/components/ComposerPanel";
import DeliveryReport from "./email-studio/components/DeliveryReport";
import LibraryPanel from "./email-studio/components/LibraryPanel";
import ReviewPanel from "./email-studio/components/ReviewPanel";
import {
  StepIndicator,
  StudioFooter,
  StudioHeader,
  StudioMessages,
} from "./email-studio/components/StudioChrome";
import useEmailStudio from "./email-studio/hooks/useEmailStudio";
import useStudioDialog from "./email-studio/hooks/useStudioDialog";
import styles from "./email-studio/EmailStudio.module.css";

// This entry point only assembles the modal and routes state to its sections.
export default function EmailStudio({
  users,
  initialUser,
  initialType = "feedback",
  onClose,
  onDelivered,
}) {
  const dialog = useStudioDialog();
  const studio = useEmailStudio({
    users,
    initialUser,
    initialType,
    onDelivered,
  });

  function handleCancel(event) {
    event.preventDefault();
    if (!studio.frozen) onClose();
  }

  return (
    <dialog
      ref={dialog}
      className={styles.dialog}
      aria-labelledby="email-studio-title"
      onCancel={handleCancel}
    >
      <div className={styles.shell}>
        <StudioHeader disabled={studio.frozen} onClose={onClose} />
        <StepIndicator step={studio.step} />
        <StudioMessages
          error={studio.error}
          notice={studio.notice}
          canRetry={!studio.library && !studio.loading}
          onClose={onClose}
        />
        {studio.loading && (
          <div className={styles.loading}>
            <Loader2 className={styles.spin} />
            Opening your template library&hellip;
          </div>
        )}
        {!studio.loading && studio.library && (
          <>
            {studio.step === "compose" && (
              <div className={styles.workspace}>
                <LibraryPanel
                  types={studio.library.types}
                  totalTemplates={studio.library.templates.length}
                  templates={studio.templates}
                  emailType={studio.emailType}
                  selectedTemplateId={studio.draft.templateId}
                  previewUser={studio.previewUser}
                  disabled={studio.frozen}
                  onSelectType={studio.selectType}
                  onSelectTemplate={studio.selectTemplate}
                  onStartBlank={studio.startBlank}
                  onSaveType={studio.saveType}
                />
                <ComposerPanel
                  draft={studio.draft}
                  previewUser={studio.previewUser}
                  recipients={studio.recipients}
                  onSelectRecipient={studio.setPreviewId}
                  marketing={studio.marketing}
                  busy={studio.busy}
                  disabled={studio.frozen}
                  onUpdateDraft={studio.updateDraft}
                  onSaveTemplate={studio.saveTemplate}
                />
                <AudiencePanel
                  users={users}
                  selectedIds={studio.selectedIds}
                  marketing={studio.marketing}
                  isRecipientDisabled={studio.isRecipientDisabled}
                  onToggleRecipient={studio.toggleRecipient}
                />
              </div>
            )}
            {studio.step === "review" && (
              <ReviewPanel
                draft={studio.draft}
                recipients={studio.recipients}
                previewUser={studio.previewUser}
                marketing={studio.marketing}
                consent={studio.consent}
                disabled={studio.frozen}
                uncertain={studio.uncertain}
                onSelectPreview={studio.setPreviewId}
                onChangeConsent={studio.setConsent}
              />
            )}
            {studio.step === "result" && studio.result && (
              <DeliveryReport batch={studio.result} />
            )}
            <StudioFooter
              step={studio.step}
              frozen={studio.frozen}
              valid={studio.valid}
              busy={studio.busy}
              uncertain={studio.uncertain}
              marketing={studio.marketing}
              consent={studio.consent}
              recipientCount={studio.selectedIds.length}
              onEdit={studio.edit}
              onReview={studio.review}
              onSend={studio.send}
              onComposeAnother={studio.composeAnother}
              onClose={onClose}
            />
          </>
        )}
      </div>
    </dialog>
  );
}
