"use client";

// CSS
import clsx from "clsx";
import styles from "@/styles/dashboard/artist/Calendar.module.css";

// HTML Components
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

// Libs
import { format, isSameDay, isSameMonth, isToday } from "date-fns";
import {
  WEEKDAY_INITIALS,
  describeCalendarEvent,
  eventsForDay,
  formatEventTimeRange,
  getMonthWeeks,
} from "@/lib/calendar";
import type { CalendarEvent } from "@/types/calendar";

const MAX_DOTS_PER_DAY = 3;

interface CalendarMobileViewProps {
  anchor: Date;
  events: CalendarEvent[];
  selectedDay: Date;
  onSelectDay: (day: Date) => void;
  onSelectEvent: (bookingRequestId: string) => void;
  onNewAppointment: () => void;
}

export const CalendarMobileView = ({
  anchor,
  events,
  selectedDay,
  onSelectDay,
  onSelectEvent,
  onNewAppointment,
}: CalendarMobileViewProps) => {
  const days = getMonthWeeks(anchor).flat();
  const selectedEvents = eventsForDay(events, selectedDay);

  return (
    <div className={styles.mobile}>
      <div className={styles.miniMonth}>
        <div className={styles.miniWeekdays}>
          {WEEKDAY_INITIALS.map((label, index) => (
            <span key={index} className={styles.miniWeekday}>
              {label}
            </span>
          ))}
        </div>

        <div className={styles.miniGrid}>
          {days.map((day) => {
            const dayEvents = eventsForDay(events, day);
            return (
              <Button
                key={day.toISOString()}
                variant="bare"
                size="bare"
                type="button"
                className={clsx(styles.miniDay, {
                  [styles.miniDayMuted]: !isSameMonth(day, anchor),
                })}
                onClick={() => onSelectDay(day)}
              >
                <span
                  className={clsx(styles.miniDayNum, {
                    [styles.miniDayNumSelected]: isSameDay(day, selectedDay),
                    [styles.miniDayNumToday]:
                      isToday(day) && !isSameDay(day, selectedDay),
                  })}
                >
                  {format(day, "d")}
                </span>
                <span className={styles.miniDots}>
                  {dayEvents.slice(0, MAX_DOTS_PER_DAY).map((event) => (
                    <span
                      key={event.id}
                      className={clsx(styles.miniDot, {
                        [styles.miniDotConsultation]:
                          event.type === "consultation",
                        [styles.miniDotSession]: event.type === "session",
                      })}
                    />
                  ))}
                </span>
              </Button>
            );
          })}
        </div>
      </div>

      <div className={styles.dayList}>
        <h2 className={styles.dayListTitle}>
          {format(selectedDay, "EEEE, MMMM d")}
        </h2>

        {selectedEvents.length === 0 ? (
          <p className={styles.dayListEmpty}>Nothing scheduled.</p>
        ) : (
          selectedEvents.map((event) => {
            const { typeLabel, detail } = describeCalendarEvent(event);
            return (
              <Button
                key={event.id}
                variant="bare"
                size="bare"
                type="button"
                className={styles.listCard}
                onClick={() => onSelectEvent(event.bookingRequestId)}
              >
                <span
                  className={clsx(styles.listAccent, {
                    [styles.eventConsultation]: event.type === "consultation",
                    [styles.eventSession]: event.type === "session",
                  })}
                />
                <div className={styles.listBody}>
                  <span className={styles.listTitle}>{event.clientName}</span>
                  <span className={styles.listSub}>
                    {detail ? `${typeLabel} · ${detail}` : typeLabel}
                  </span>
                  <span className={styles.listTime}>
                    {formatEventTimeRange(event)}
                  </span>
                </div>
              </Button>
            );
          })
        )}
      </div>

      <Button
        variant="bare"
        size="bare"
        type="button"
        className={styles.newBookingButton}
        aria-label="New booking"
        onClick={onNewAppointment}
      >
        <Plus size={18} />
      </Button>
    </div>
  );
};
