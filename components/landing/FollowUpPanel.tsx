// CSS
import clsx from "clsx";
import styles from "@/styles/landing/FollowUpPanel.module.css";

// HTML Components
import { ChevronRight, Sparkles } from "lucide-react";

const FOLLOW_UPS = [
  {
    initials: "MS",
    name: "Mark Sandman",
    reason: "No reply · 4d",
    note: "Nudge about his back piece",
    tone: "warn",
  },
  {
    initials: "PP",
    name: "Priya Patel",
    reason: "Deposit unpaid · 2d",
    note: "Remind her to lock in the slot",
    tone: "alert",
  },
  {
    initials: "LW",
    name: "Liam Wood",
    reason: "Not scheduled · 3d",
    note: "Resend the booking link",
    tone: "muted",
  },
] as const;

const TONE_CLASS: Record<string, string> = {
  warn: styles.reasonWarn,
  alert: styles.reasonAlert,
  muted: styles.reasonMuted,
};

export const FollowUpPanel = () => {
  return (
    <div className={styles.followup}>
      <article className={styles.board}>
        <header className={styles.boardHead}>
          <span className={styles.boardTitle}>Follow-ups</span>
          <span className={styles.boardLink}>See all</span>
        </header>

        <ul className={styles.list}>
          {FOLLOW_UPS.map((item) => (
            <li key={item.name} className={styles.item}>
              <span className={styles.itemAvatar}>{item.initials}</span>
              <div className={styles.itemBody}>
                <div className={styles.itemTop}>
                  <span className={styles.itemName}>{item.name}</span>
                  <span className={clsx(styles.reason, TONE_CLASS[item.tone])}>
                    {item.reason}
                  </span>
                </div>
                <span className={styles.itemNote}>{item.note}</span>
              </div>
              <ChevronRight className={styles.itemChevron} aria-hidden />
            </li>
          ))}
        </ul>
      </article>

      <aside className={styles.nudge}>
        <span className={styles.nudgeLabel}>
          <Sparkles className={styles.nudgeIcon} aria-hidden />
          Suggested follow-up
        </span>
        <p className={styles.nudgeText}>
          Hey Mark, just checking in on your back piece. Still keen to lock in a
          date?
        </p>
        <div className={styles.nudgeActions}>
          <span className={styles.nudgeSend}>Send</span>
          <span className={styles.nudgeDismiss}>Dismiss</span>
        </div>
      </aside>
    </div>
  );
};
