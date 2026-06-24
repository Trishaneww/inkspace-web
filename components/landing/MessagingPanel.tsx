// CSS
import clsx from "clsx";
import styles from "@/styles/landing/MessagingPanel.module.css";

// HTML Components
import { Phone, Mail } from "lucide-react";

export const MessagingPanel = () => {
  return (
    <div className={styles.messaging}>
      <article className={styles.window}>
        <header className={styles.head}>
          <span className={styles.headAvatar}>J</span>
          <div className={styles.headIdentity}>
            <span className={styles.headName}>Jameson</span>
            <span className={styles.headDetail}>+1 (647) 472-4120</span>
          </div>
          <span className={styles.headIcon}>
            <Phone aria-hidden />
          </span>
          <span className={styles.headIcon}>
            <Mail aria-hidden />
          </span>
        </header>

        <div className={styles.thread}>
          <div className={styles.row}>
            <div className={styles.meta}>
              <span className={styles.avatar}>J</span>
              <span className={styles.metaName}>Jameson</span>
              <span className={styles.metaTime}>2:04 PM</span>
            </div>
            <p className={styles.bubble}>
              Hey! Looking to book a black and grey piece for my forearm. Are
              you taking bookings?
            </p>
          </div>

          <div className={clsx(styles.row, styles.rowMine)}>
            <div className={styles.meta}>
              <span className={styles.metaTime}>2:06 PM</span>
              <span className={styles.metaName}>You</span>
              <span className={clsx(styles.avatar, styles.avatarMine)}>JD</span>
            </div>
            <p className={clsx(styles.bubble, styles.bubbleMine)}>
              Hey Jameson, thanks for reaching out. Can you share a rough size
              and a reference for the forearm piece? Once I have those I can give
              you timing and cost.
            </p>
          </div>

          <div className={styles.row}>
            <div className={styles.meta}>
              <span className={styles.avatar}>J</span>
              <span className={styles.metaName}>Jameson</span>
              <span className={styles.metaTime}>2:09 PM</span>
            </div>
            <p className={styles.bubble}>
              Sure thing, it is a koi, about 5 inches. Reference attached.
            </p>
          </div>

          <div className={clsx(styles.row, styles.rowMine)}>
            <p className={clsx(styles.bubble, styles.bubbleMine)}>
              Perfect, that will book up beautifully. I have an opening next
              week, want me to send a booking over?
            </p>
          </div>
        </div>
      </article>
    </div>
  );
};
