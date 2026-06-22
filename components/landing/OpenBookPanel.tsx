// CSS
import styles from "@/styles/landing/OpenBookPanel.module.css";

// HTML Components
import { Camera, Mail, MessageSquare, MapPin } from "lucide-react";
import InkspaceLogo from "@/public/logos/inkspace-logo.svg";

const REQUEST_FIELDS = [
  { label: "Placement", value: "Inner forearm" },
  { label: "Size", value: "~5 in" },
  { label: "Style", value: "Fine line" },
  { label: "Colour", value: "Black & grey" },
  { label: "Budget", value: "$400–$600" },
];

export const OpenBookPanel = () => {
  return (
    <div className={styles.openbook}>
      <div className={styles.sources} aria-hidden>
        <span className={styles.source}>
          <Camera className={styles.sourceIcon} />
          Instagram DM
        </span>
        <span className={styles.source}>
          <Mail className={styles.sourceIcon} />
          Cold email
        </span>
        <span className={styles.source}>
          <MessageSquare className={styles.sourceIcon} />
          Text
        </span>
      </div>

      <div className={styles.profile}>
        <span className={styles.profileAvatar}>D</span>
        <p className={styles.profileHandle}>@diegoviera</p>
        <p className={styles.profileLocation}>
          <MapPin className={styles.profilePin} aria-hidden />
          Toronto, Canada
        </p>
        <span className={styles.profileStatus}>
          <span className={styles.profileDot} aria-hidden />
          Accepting bookings
        </span>
        <span className={styles.profileBook}>Book a tattoo</span>
        <span className={styles.profileGhost}>Browse flashbook</span>
        <span className={styles.profileGhost}>Browse portfolio</span>
      </div>

      <div className={styles.request}>
        <div className={styles.requestHead}>
          <span className={styles.requestTitle}>New booking request</span>
          <span className={styles.requestBadge}>
            <InkspaceLogo className={styles.requestBadgeMark} aria-hidden />
            Open Book
          </span>
        </div>

        <div className={styles.requestClient}>
          <span className={styles.requestAvatar}>P</span>
          <span className={styles.requestName}>Priya Patel</span>
          <span className={styles.requestNew}>New</span>
        </div>

        <div className={styles.requestFields}>
          {REQUEST_FIELDS.map((field) => (
            <div key={field.label} className={styles.field}>
              <span className={styles.fieldLabel}>{field.label}</span>
              <span className={styles.fieldValue}>{field.value}</span>
            </div>
          ))}
        </div>

        <div className={styles.requestRefs}>
          <span className={styles.refThumb} />
          <span className={styles.refThumb} />
          <span className={styles.refNote}>2 references attached</span>
        </div>
      </div>
    </div>
  );
};
