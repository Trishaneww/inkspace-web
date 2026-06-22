// CSS
import styles from "@/styles/landing/AutomationPanel.module.css";

// Logos
import InkspaceLogo from "@/public/logos/inkspace-logo.svg";

export const AutomationPanel = () => {
  return (
    <div className={styles.automation}>
      <div className={styles.email}>
        <div className={styles.emailHeader}>
          <span className={styles.emailLogo}>
            <InkspaceLogo className={styles.emailLogoMark} aria-hidden />
          </span>
        </div>

        <div className={styles.emailBody}>
          <p className={styles.emailGreeting}>Hi, Justin Suede</p>
          <p className={styles.emailText}>
            Just a friendly reminder that your payment to Joshua Moore is still
            waiting.
          </p>
          <p className={styles.emailText}>
            You can take care of it in a few seconds with the secure button
            below. Your payment is processed end-to-end by Stripe, so your card
            details are never shared with Inkspace or your artist.
          </p>

          <div className={styles.amountRow}>
            <span className={styles.amountLabel}>Amount due</span>
            <span className={styles.amountValue}>CA$220</span>
          </div>

          <div className={styles.payRow}>
            <span className={styles.payButton}>Pay now</span>
          </div>

          <p className={styles.emailFine}>
            If you have already paid, you can ignore this email. Your payment
            link will expire soon.
          </p>

          <div className={styles.emailDivider} />

          <p className={styles.emailFooter}>
            Sent by Inkspace on behalf of Joshua Moore.
            <br />© 2026 Inkspace Inc.
          </p>
        </div>
      </div>

      <div className={styles.sms}>
        <span className={styles.smsIcon}>
          <InkspaceLogo className={styles.smsIconMark} aria-hidden />
        </span>
        <div className={styles.smsBody}>
          <div className={styles.smsTop}>
            <span className={styles.smsName}>Inkspace</span>
            <span className={styles.smsTime}>3:30 PM</span>
          </div>
          <p className={styles.smsText}>
            Hi Amanda 👋 Just a reminder you have an appointment tomorrow at 4 PM
            with Stacy. See you then!
          </p>
        </div>
      </div>
    </div>
  );
};
