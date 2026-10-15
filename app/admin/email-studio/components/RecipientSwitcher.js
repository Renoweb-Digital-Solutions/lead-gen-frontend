import styles from "../EmailStudio.module.css";

// Both compose and review use the same recipient selection and active identity.
export default function RecipientSwitcher({
  recipients,
  activeUserId,
  disabled,
  onSelect,
  reviewing = false,
}) {
  if (recipients.length === 0) return null;
  const activeIndex = recipients.findIndex((user) => user._id === activeUserId);

  return (
    <div className={styles.recipientSwitcher}>
      <div className={styles.sectionLabel}>
        {reviewing ? "REVIEW EACH EMAIL" : "EDIT EACH EMAIL"}
        <span>
          {activeIndex + 1} of {recipients.length}
        </span>
      </div>
      <div className={styles.recipientTabs} aria-label="Select recipient email">
        {recipients.map((user) => (
          <button
            key={user._id}
            type="button"
            className={`${styles.recipientTab} ${user._id === activeUserId ? styles.activeRecipientTab : ""}`}
            aria-pressed={user._id === activeUserId}
            title={`${user.username} · ${user.email}`}
            disabled={disabled}
            onClick={() => onSelect(user._id)}
          >
            <strong>{user.username}</strong>
            <span>{user.email}</span>
          </button>
        ))}
      </div>
      <p>
        {reviewing
          ? "Switch recipients to check the exact message each person will receive."
          : "Switch recipients to write a different subject and message for each person. Changes are kept when you switch."}
      </p>
    </div>
  );
}
