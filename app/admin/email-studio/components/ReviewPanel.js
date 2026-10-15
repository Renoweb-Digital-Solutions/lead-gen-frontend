import { Check, Eye, Mail } from "lucide-react";
import { personalize } from "../utils/personalization";
import { buildEmailPreview } from "../utils/preview";
import RecipientSwitcher from "./RecipientSwitcher";
import styles from "../EmailStudio.module.css";

function MarketingConsent({ checked, disabled, onChange }) {
  return (
    <label className={styles.consent}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span>
        I confirm these recipients agreed to receive marketing emails from us.
        <small>
          An unsubscribe link is automatically included. Opted-out users are
          excluded by the server.
        </small>
      </span>
    </label>
  );
}

// The iframe receives a standalone document and never executes email content.
export default function ReviewPanel({
  draft,
  recipients,
  previewUser,
  marketing,
  consent,
  disabled,
  uncertain,
  onSelectPreview,
  onChangeConsent,
}) {
  const preview = buildEmailPreview({
    body: draft.body,
    user: previewUser,
    marketing,
  });

  return (
    <div className={styles.review}>
      <section className={styles.reviewDetails}>
        <span className={styles.sectionLabel}>ONE LAST LOOK</span>
        <h3>Ready for their inbox?</h3>
        <p>Review the personalized message before sending.</p>
        <RecipientSwitcher
          recipients={recipients}
          activeUserId={previewUser?._id}
          disabled={disabled}
          onSelect={onSelectPreview}
          reviewing
        />
        <div className={styles.envelope}>
          <small>SUBJECT</small>
          <b>{personalize(draft.subject, previewUser)}</b>
          <small>SHOWING EMAIL FOR</small>
          <span>{previewUser?.email}</span>
          <small>
            TO · {recipients.length}{" "}
            {recipients.length === 1 ? "PERSON" : "PEOPLE"}
          </small>
          {recipients.map((user) => (
            <span key={user._id}>
              <Check size={13} />
              {user.email}
            </span>
          ))}
        </div>
        {marketing && (
          <MarketingConsent
            checked={consent}
            disabled={disabled}
            onChange={onChangeConsent}
          />
        )}
        <div className={styles.deliveryNote}>
          <Mail size={20} />
          <p>
            Each recipient gets their own email. Other recipients’ addresses are
            never included.
          </p>
        </div>
        {uncertain && (
          <p className={styles.helper}>
            Delivery is being verified. Keep this window open and use “Check
            delivery status” to safely check the same batch.
          </p>
        )}
      </section>
      <section className={styles.previewPanel}>
        <div className={styles.previewLabel}>
          <Eye size={15} /> INBOX PREVIEW
          <span>
            {marketing
              ? "Unsubscribe link added at send"
              : "Personalized for this user"}
          </span>
        </div>
        <iframe
          title="Personalized email preview"
          sandbox=""
          srcDoc={preview}
        />
      </section>
    </div>
  );
}
