"use client";

// CSS
import styles from "@/styles/onboarding/Onboarding.module.css";

// HTML Components
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";
import GoogleCalendarLogo from "@/public/logos/google-calendar-logo.svg";

// Libs
import type { GoogleCalendarConnect } from "@/hooks/useGoogleCalendarConnect";

interface CalendarPhaseProps {
  googleCalendar: GoogleCalendarConnect;
}

export const CalendarPhase = ({ googleCalendar }: CalendarPhaseProps) => {
  const { connected, email, connecting, connect } = googleCalendar;

  return (
    <div className={styles.field}>
      <div className={styles.calendarCard}>
        <div className={styles.calendarCardMain}>
          <GoogleCalendarLogo className={styles.calendarLogo} />
          <div className={styles.calendarCardText}>
            <span className={styles.calendarCardTitle}>Google Calendar</span>
            <span className={styles.calendarCardSubtitle}>
              {connected
                ? email
                  ? `Synced with ${email}`
                  : "Calendar synced."
                : "Sync bookings to block out busy times automatically."}
            </span>
          </div>
        </div>

        {connected ? (
          <span className={styles.calendarConnected}>
            <CheckCircle2 size={15} />
            Connected
          </span>
        ) : (
          <Button
            type="button"
            variant="outline"
            disabled={connecting}
            onClick={connect}
          >
            {connecting ? "Connecting…" : "Connect Google"}
            {connecting && <Loader2 size={15} className="animate-spin" />}
          </Button>
        )}
      </div>
    </div>
  );
};
