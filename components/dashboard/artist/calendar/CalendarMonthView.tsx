"use client";

// CSS
import clsx from "clsx";
import styles from "@/styles/dashboard/artist/Calendar.module.css";

// HTML Components
import { Button } from "@/components/ui/button";

// Libs
import { format, isSameMonth, isToday } from "date-fns";
import {
  WEEKDAY_LABELS,
  eventsForDay,
  getMonthWeeks,
  minutesSinceMidnight,
} from "@/lib/calendar";
import { formatTime } from "@/lib/formatters";
import type { CalendarEvent } from "@/types/calendar";

const MAX_CHIPS_PER_DAY = 3;

interface CalendarMonthViewProps {
  anchor: Date;
  events: CalendarEvent[];
  onSelectDay: (day: Date) => void;
  onSelectEvent: (bookingRequestId: string) => void;
}

export const CalendarMonthView = ({
  anchor,
  events,
  onSelectDay,
  onSelectEvent,
}: CalendarMonthViewProps) => {
  const weeks = getMonthWeeks(anchor);

  return (
    <div className={styles.month}>
      <div className={styles.monthWeekdays}>
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className={styles.monthWeekday}>
            {label}
          </div>
        ))}
      </div>

      <div className={styles.monthGrid}>
        {weeks.map((week) => (
          <div key={week[0].toISOString()} className={styles.monthRow}>
            {week.map((day) => {
              const dayEvents = eventsForDay(events, day);
              const overflow = dayEvents.length - MAX_CHIPS_PER_DAY;

              return (
                <div
                  key={day.toISOString()}
                  className={clsx(styles.monthCell, {
                    [styles.monthCellMuted]: !isSameMonth(day, anchor),
                  })}
                  onClick={() => onSelectDay(day)}
                >
                  <span
                    className={clsx(styles.monthDayNum, {
                      [styles.monthDayNumToday]: isToday(day),
                    })}
                  >
                    {format(day, "d")}
                  </span>

                  <div className={styles.monthEvents}>
                    {dayEvents.slice(0, MAX_CHIPS_PER_DAY).map((event) => (
                      <Button
                        key={event.id}
                        variant="bare"
                        size="bare"
                        type="button"
                        className={clsx(styles.monthChip, {
                          [styles.eventConsultation]:
                            event.type === "consultation",
                          [styles.eventSession]: event.type === "session",
                        })}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectEvent(event.bookingRequestId);
                        }}
                      >
                        <span className={styles.monthChipDot} />
                        <span className={styles.monthChipTime}>
                          {formatTime(minutesSinceMidnight(new Date(event.scheduledStart)), true)}
                        </span>
                        <span className={styles.monthChipName}>
                          {event.clientName}
                        </span>
                      </Button>
                    ))}
                    {overflow > 0 && (
                      <span className={styles.monthMore}>+{overflow} more</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
