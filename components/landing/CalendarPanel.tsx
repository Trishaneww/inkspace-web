// CSS
import clsx from "clsx";
import styles from "@/styles/landing/CalendarPanel.module.css";

// HTML Components
import { Menu, Bell, Search, CalendarDays, Clock, MapPin } from "lucide-react";
import GoogleCalendarLogo from "@/public/logos/google-calendar-logo.svg";
import InkspaceLogo from "@/public/logos/inkspace-logo.svg";

const DOTS: Record<number, number> = {
  2: 1,
  4: 1,
  6: 1,
  8: 1,
  9: 1,
  11: 1,
  12: 1,
  14: 2,
  16: 1,
  18: 1,
  20: 1,
  21: 3,
  22: 2,
  23: 2,
  24: 3,
  25: 2,
  26: 1,
  27: 1,
  28: 2,
  29: 2,
  30: 2,
};

const MONTH_CELLS = [
  { label: 31, muted: true, dots: 0 },
  ...Array.from({ length: 30 }, (_, i) => ({
    label: i + 1,
    muted: false,
    dots: DOTS[i + 1] ?? 0,
  })),
  ...Array.from({ length: 4 }, (_, i) => ({
    label: i + 1,
    muted: true,
    dots: 0,
  })),
];

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

export const CalendarPanel = () => {
  return (
    <div className={styles.calendar}>
      <div className={styles.phone}>
        <div className={styles.phoneBar}>
          <Menu className={styles.phoneBarIcon} aria-hidden />
          <span className={styles.phoneBrand}>
            <InkspaceLogo className={styles.phoneBrandMark} aria-hidden />
            Inkspace
          </span>
          <span className={styles.phoneBarRight}>
            <Bell className={styles.phoneBarIcon} aria-hidden />
            <Search className={styles.phoneBarIcon} aria-hidden />
          </span>
        </div>

        <div className={styles.phoneContent}>
          <div className={styles.phoneMonthRow}>
            <span className={styles.phoneTitle}>Calendar</span>
            <span className={styles.phoneMonth}>June 2026</span>
          </div>

          <div className={styles.grid}>
            <div className={styles.weekHeader}>
              {WEEKDAYS.map((day, index) => (
                <span key={index} className={styles.weekday}>
                  {day}
                </span>
              ))}
            </div>
            <div className={styles.cells}>
              {MONTH_CELLS.map((cell, index) => {
                const selected = !cell.muted && cell.label === 22;
                return (
                  <div key={index} className={styles.cell}>
                    <span
                      className={clsx(styles.cellNum, {
                        [styles.cellMuted]: cell.muted,
                        [styles.cellSelected]: selected,
                      })}
                    >
                      {cell.label}
                    </span>
                    <span className={styles.cellDots}>
                      {Array.from({ length: cell.dots }).map((_, dot) => (
                        <span
                          key={dot}
                          className={clsx(styles.dot, {
                            [styles.dotGreen]: cell.label % 5 === 0,
                          })}
                        />
                      ))}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <p className={styles.dayLabel}>Monday, June 22</p>

          <div className={styles.dayEvent}>
            <span
              className={clsx(styles.eventStripe, styles.eventStripeGreen)}
            />
            <div className={styles.eventInfo}>
              <span className={styles.eventName}>Sun-Woo Park</span>
              <span className={styles.eventDetail}>Consultation · Online</span>
              <span className={styles.eventTime}>4:30pm – 5pm</span>
            </div>
          </div>

          <div className={styles.dayEvent}>
            <span className={styles.eventStripe} />
            <div className={styles.eventInfo}>
              <span className={styles.eventName}>Tomas Mbeki</span>
              <span className={styles.eventDetail}>
                Tattoo session · 212 Ossington Ave
              </span>
              <span className={styles.eventTime}>6pm – 9pm</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.gcalTopCard}>
        <div className={styles.cardHead}>
          <GoogleCalendarLogo className={styles.gcalIcon} aria-hidden />
          <span className={styles.cardHeadText}>Added to Google Calendar</span>
        </div>
        <div className={styles.miniEvent}>
          <span className={styles.miniBar} />
          <div className={styles.miniBody}>
            <span className={styles.miniTitle}>Consultation · Hassan Ali</span>
            <span className={styles.miniMeta}>Wed, Jun 24 · 3:00 PM</span>
          </div>
        </div>
      </div>

      <div className={styles.gcalCard}>
        <div className={styles.cardHead}>
          <GoogleCalendarLogo className={styles.gcalIcon} aria-hidden />
          <span className={styles.cardHeadText}>Google Calendar</span>
          <span className={styles.syncedChip}>Synced</span>
        </div>
        <div className={styles.event}>
          <span className={styles.eventBar} />
          <div className={styles.eventBody}>
            <p className={styles.gcalTitle}>Tattoo session</p>
            <p className={styles.gcalClient}>
              Sofia Moreno · Neo-traditional koi
            </p>
            <p className={styles.gcalMeta}>
              <CalendarDays className={styles.metaIcon} aria-hidden />
              Monday, June 29
            </p>
            <p className={styles.gcalMeta}>
              <Clock className={styles.metaIcon} aria-hidden />
              12:00 – 4:00 PM
            </p>
            <p className={styles.gcalMeta}>
              <MapPin className={styles.metaIcon} aria-hidden />
              Ink &amp; Oak Studio
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
