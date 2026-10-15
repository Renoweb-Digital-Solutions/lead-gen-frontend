import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Loader2,
  Send,
  X,
} from "lucide-react";
// Import one icon directly so the header does not traverse the full icon catalog.
import { PaperPlaneTiltIcon } from "@phosphor-icons/react/dist/csr/PaperPlaneTilt";
import { MAX_RECIPIENTS, STUDIO_STEPS } from "../constants";
import styles from "../EmailStudio.module.css";

export function StudioHeader({ disabled, onClose }) {
  return (
    <header className={styles.header}>
      <div className={styles.brandMark} aria-hidden="true">
        <PaperPlaneTiltIcon size={31} weight="duotone" />
      </div>
      <div>
        <div className={styles.eyebrow}>SIMPLEADS / RELATIONSHIPS</div>
        <h2 id="email-studio-title">
          The email studio<span>Send something meaningful.</span>
        </h2>
      </div>
      <span className={styles.limit}>
        <span /> Small batches. Up to {MAX_RECIPIENTS} people.
      </span>
      <button
        type="button"
        className={styles.iconButton}
        aria-label="Close email studio"
        disabled={disabled}
        onClick={onClose}
      >
        <X size={21} />
      </button>
    </header>
  );
}

export function StepIndicator({ step }) {
  return (
    <div className={styles.stepBar}>
      {STUDIO_STEPS.map((item, index) => (
        <StepIndicatorItem
          key={item.id}
          item={item}
          active={step === item.id}
          first={index === 0}
        />
      ))}
    </div>
  );
}

function StepIndicatorItem({ item, active, first }) {
  return (
    <>
      {!first && <ChevronRight size={14} />}
      <span className={active ? styles.currentStep : ""}>
        {item.number} <b>{item.label}</b>
      </span>
    </>
  );
}

export function StudioMessages({ error, notice, canRetry, onClose }) {
  return (
    <>
      {error && (
        <div role="alert" className={styles.error}>
          {error}
          {canRetry && (
            <button type="button" onClick={onClose}>
              Close and try again
            </button>
          )}
        </div>
      )}
      {notice && (
        <div role="status" className={styles.notice}>
          <CheckCircle2 size={16} />
          {notice}
        </div>
      )}
    </>
  );
}

const FOOTER_MESSAGES = {
  compose: "Crafted by you. Personalized for them.",
  review: "Your message, their own copy.",
  result: "Your batch delivery report is ready.",
};

export function StudioFooter({
  step,
  frozen,
  valid,
  busy,
  uncertain,
  marketing,
  consent,
  recipientCount,
  onEdit,
  onReview,
  onSend,
  onComposeAnother,
  onClose,
}) {
  const sending = busy === "send";
  const sendDisabled =
    !!busy || (!uncertain && (!valid || (marketing && !consent)));
  let sendLabel = `Send to ${recipientCount} ${recipientCount === 1 ? "person" : "people"}`;
  if (uncertain) sendLabel = "Check delivery status";
  if (sending) sendLabel = "Sending your batch…";

  return (
    <footer className={styles.footer}>
      <span>
        <span className={styles.noteDot} />
        {FOOTER_MESSAGES[step]}
      </span>
      <div>
        {step === "compose" && (
          <button
            type="button"
            className={styles.primary}
            disabled={frozen || !valid}
            onClick={onReview}
          >
            Review email <ArrowRight size={16} />
          </button>
        )}
        {step === "review" && (
          <>
            <button
              type="button"
              className={styles.secondary}
              disabled={frozen}
              onClick={onEdit}
            >
              <ArrowLeft size={16} />
              Back to edit
            </button>
            <button
              type="button"
              className={styles.primary}
              disabled={sendDisabled}
              onClick={onSend}
            >
              {sending ? (
                <Loader2 size={16} className={styles.spin} />
              ) : (
                <Send size={16} />
              )}
              {sendLabel}
            </button>
          </>
        )}
        {step === "result" && (
          <>
            <button
              type="button"
              className={styles.secondary}
              onClick={onComposeAnother}
            >
              Compose another
            </button>
            <button type="button" className={styles.primary} onClick={onClose}>
              Done <Check size={16} />
            </button>
          </>
        )}
      </div>
    </footer>
  );
}
