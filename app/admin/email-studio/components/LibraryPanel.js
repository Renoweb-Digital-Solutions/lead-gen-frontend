import { useState } from "react";
import {
  Check,
  ChevronRight,
  Mail,
  MessageSquare,
  Plus,
  Sparkles,
} from "lucide-react";
import { personalize } from "../utils/personalization";
import styles from "../EmailStudio.module.css";

function EmailTypeForm({ initialValue, disabled, onSave, onCancel }) {
  const [form, setForm] = useState(initialValue);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function save() {
    const saved = await onSave(form);
    if (saved) onCancel();
  }

  return (
    <div className={styles.typeForm}>
      <label>
        Type name
        <input
          maxLength={60}
          value={form.name}
          onChange={(event) => updateField("name", event.target.value)}
        />
      </label>
      <label>
        Purpose
        <select
          value={form.purpose}
          disabled={!!form.id}
          onChange={(event) => updateField("purpose", event.target.value)}
        >
          <option value="feedback">Feedback</option>
          <option value="marketing">Marketing</option>
        </select>
      </label>
      <div>
        <button
          type="button"
          disabled={disabled || form.name.trim().length < 2}
          onClick={save}
        >
          Save type
        </button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

function TemplateCard({ template, index, selected, user, disabled, onSelect }) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`${styles.templateCard} ${selected ? styles.selectedTemplate : ""}`}
      onClick={() => onSelect(template)}
    >
      <span className={styles.templateNumber}>
        {String(index + 1).padStart(2, "0")}
      </span>
      <span>
        <b>{template.name}</b>
        <small>{personalize(template.subject, user)}</small>
      </span>
      {selected && <Check size={15} />}
    </button>
  );
}

// The library owns only its local type form; persistence stays in the studio hook.
export default function LibraryPanel({
  types,
  totalTemplates,
  templates,
  emailType,
  selectedTemplateId,
  previewUser,
  disabled,
  onSelectType,
  onSelectTemplate,
  onStartBlank,
  onSaveType,
}) {
  const [typeForm, setTypeForm] = useState(null);

  return (
    <aside className={styles.library}>
      <div className={styles.sectionLabel}>
        YOUR LIBRARY <span>{totalTemplates} templates</span>
      </div>

      <div className={styles.types}>
        {types.map((type) => (
          <button
            type="button"
            key={type.id}
            disabled={disabled}
            className={emailType?.id === type.id ? styles.activeType : ""}
            onClick={() => onSelectType(type.id)}
          >
            {type.purpose === "feedback" ? (
              <MessageSquare size={15} />
            ) : (
              <Mail size={15} />
            )}
            {type.name}
            <ChevronRight size={14} />
          </button>
        ))}
      </div>

      <div className={styles.libraryActions}>
        <button
          type="button"
          disabled={disabled}
          onClick={() => setTypeForm({ name: "", purpose: "feedback" })}
        >
          <Plus size={13} />
          New type
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => setTypeForm({ ...emailType })}
        >
          Edit type
        </button>
      </div>

      {typeForm && (
        <EmailTypeForm
          key={typeForm.id || "new"}
          initialValue={typeForm}
          disabled={disabled}
          onSave={onSaveType}
          onCancel={() => setTypeForm(null)}
        />
      )}

      <div className={styles.sectionLabel}>CHOOSE A STARTING POINT</div>
      <div className={styles.templateList}>
        {templates.map((template, index) => (
          <TemplateCard
            key={template.id}
            template={template}
            index={index}
            selected={selectedTemplateId === template.id}
            user={previewUser}
            disabled={disabled}
            onSelect={onSelectTemplate}
          />
        ))}
      </div>

      <button
        type="button"
        className={styles.blankTemplate}
        disabled={disabled}
        onClick={onStartBlank}
      >
        <Plus size={15} /> Start from a blank canvas
      </button>
      <div className={styles.libraryNote}>
        <Sparkles size={18} />
        <p>
          A little personal goes a long way.
          <br />
          Every email greets your recipient by username.
        </p>
      </div>
    </aside>
  );
}
