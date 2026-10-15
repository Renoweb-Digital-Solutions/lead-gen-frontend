import { CheckCircle2, Mail } from "lucide-react";
import { deliverySummary } from "../utils/recipients";
import styles from "../EmailStudio.module.css";

export default function DeliveryReport({ batch }) {
  const { sent, failed } = deliverySummary(batch.results);
  const allSent = batch.results.every((result) => result.status === "sent");

  return (
    <div className={styles.results}>
      <div className={styles.resultIcon}>
        <CheckCircle2 size={32} />
      </div>
      <span className={styles.sectionLabel}>DELIVERY REPORT</span>
      <h3>
        {allSent ? "A little more connected." : "Here’s how your batch went."}
      </h3>
      <p>
        {sent} sent · {failed} failed. The next batch can send after a 60-second
        cooldown.
      </p>
      <div className={styles.resultList}>
        {batch.results.map((result) => {
          const accepted = result.status === "sent";
          return (
            <div key={result.user_id}>
              <Mail size={17} />
              <span>
                {result.email}
                {result.subject && <small>{result.subject}</small>}
              </span>
              <b className={accepted ? styles.sent : styles.failed}>
                {accepted ? "Sent to mail server" : "Failed to send"}
              </b>
            </div>
          );
        })}
      </div>
      <p className={styles.helper}>
        “Sent” means the mail server accepted the message. Inbox placement is
        not guaranteed.
        {failed > 0 &&
          " Check SMTP configuration before retrying failed recipients."}
      </p>
    </div>
  );
}
