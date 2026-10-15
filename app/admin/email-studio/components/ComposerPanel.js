import { Plus, Save, Type } from "lucide-react";
import { PersonalizedSubject, RichEditor } from "./PersonalizedEditors";
import RecipientSwitcher from "./RecipientSwitcher";
import { hasMessageText } from "../utils/recipients";
import styles from "../EmailStudio.module.css";

// Render draft fields independently of library persistence and delivery state.
export default function ComposerPanel({
  draft,
  previewUser,
  recipients,
  marketing,
  busy,
  disabled,
  onUpdateDraft,
  onSaveTemplate,
  onSelectRecipient,
}) {
  const validTemplate = draft.name.trim().length >= 2 && !!draft.subject.trim();

  return (
    <section className={styles.composer}>
      <div className={styles.composerHeading}>
        <div>
          <span className={styles.sectionLabel}>MAKE IT YOURS</span>
          <h3>
            {marketing
              ? "Good conversations start here."
              : "Their opinion shapes what comes next."}
          </h3>
        </div>
        <span className={styles.draftBadge}>DRAFT</span>
      </div>

      <RecipientSwitcher
        recipients={recipients}
        activeUserId={previewUser?._id}
        disabled={disabled}
        onSelect={onSelectRecipient}
      />

      <label className={styles.fieldLabel}>
        Template name
        <input
          maxLength={100}
          value={draft.name}
          disabled={disabled}
          onChange={(event) => onUpdateDraft("name", event.target.value)}
          placeholder="Give this template a name"
        />
      </label>

      <div className={styles.fieldLabel}>
        Subject line
        <span className={styles.subjectInput}>
          <Type size={16} />
          <PersonalizedSubject
            value={draft.subject}
            onChange={(value) => onUpdateDraft("subject", value)}
            user={previewUser}
            disabled={disabled}
          />
        </span>
      </div>

      <div className={styles.fieldLabel}>
        Your message
        <small>
          {previewUser
            ? `Editing only ${previewUser.username}'s email. Other recipients keep their own drafts.`
            : "Select a recipient to see their username here."}
        </small>
      </div>
      <RichEditor
        key={previewUser?._id || "default"}
        body={draft.body}
        onChange={(value) => onUpdateDraft("body", value)}
        disabled={disabled}
        user={previewUser}
      />

      <div className={styles.saveRow}>
        <button
          type="button"
          disabled={disabled || !validTemplate || !hasMessageText(draft.body)}
          onClick={() => onSaveTemplate(false)}
        >
          <Save size={15} />
          {busy === "save" ? "Saving…" : "Save template"}
        </button>
        {draft.templateId && (
          <button
            type="button"
            disabled={disabled || !validTemplate}
            onClick={() => onSaveTemplate(true)}
          >
            <Plus size={14} />
            Save as new
          </button>
        )}
        <small>Templates are shared with your admin team.</small>
      </div>
    </section>
  );
}
