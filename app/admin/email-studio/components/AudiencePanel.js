import { useState } from "react";
import { Search, Users } from "lucide-react";
import { MAX_RECIPIENTS } from "../constants";
import styles from "../EmailStudio.module.css";

function RecipientRow({ user, selected, marketing, disabled, onToggle }) {
  return (
    <label
      className={`${styles.recipient} ${selected ? styles.checkedRecipient : ""}`}
    >
      <input
        type="checkbox"
        checked={selected}
        disabled={disabled}
        onChange={() => onToggle(user._id)}
      />
      <span className={styles.avatar}>
        {user.username?.[0]?.toUpperCase() || "U"}
      </span>
      <span>
        <b>{user.username}</b>
        <small>{user.email || "No email address"}</small>
        {marketing && user.marketing_unsubscribed && (
          <small>Opted out of marketing</small>
        )}
        {marketing && user.is_suspended && <small>Account suspended</small>}
      </span>
    </label>
  );
}

// Search is local UI state; selection rules come from the shared flow hook.
export default function AudiencePanel({
  users,
  selectedIds,
  marketing,
  isRecipientDisabled,
  onToggleRecipient,
}) {
  const [query, setQuery] = useState("");
  const visibleUsers = users.filter((user) =>
    `${user.username} ${user.email || ""}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  return (
    <aside className={styles.audience}>
      <div className={styles.audienceTitle}>
        <div className={styles.audienceIcon}>
          <Users size={20} />
        </div>
        <h3>The right people.</h3>
        <p>
          {marketing
            ? "Choose up to five recipients for this batch."
            : "Invite up to five users to share their opinion."}
        </p>
      </div>

      <div className={styles.recipientCount}>
        <b>
          {selectedIds.length}
          <span> / {MAX_RECIPIENTS} selected</span>
        </b>
        <div>
          {Array.from({ length: MAX_RECIPIENTS }, (_, index) => (
            <span
              key={index}
              className={index < selectedIds.length ? styles.filledSlot : ""}
            />
          ))}
        </div>
      </div>

      <label className={styles.search}>
        <Search size={15} />
        <input
          aria-label="Search recipients"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Find a person…"
        />
      </label>

      <div className={styles.recipientList}>
        {visibleUsers.map((user) => (
          <RecipientRow
            key={user._id}
            user={user}
            selected={selectedIds.includes(user._id)}
            marketing={marketing}
            disabled={isRecipientDisabled(user)}
            onToggle={onToggleRecipient}
          />
        ))}
      </div>

      <div className={styles.deliveryNote}>
        <span className={styles.noteDot} />
        <div>
          <b>Small, considered batches</b>
          <p>
            Sent individually, one at a time. A 60-second cooldown follows each
            batch. Small batches don’t guarantee inbox placement.
          </p>
        </div>
      </div>
    </aside>
  );
}
