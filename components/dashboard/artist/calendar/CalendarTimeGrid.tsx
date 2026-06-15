"use client";

// Next.js
import { Fragment, useEffect, useRef, useState } from "react";

// CSS
import clsx from "clsx";
import styles from "@/styles/dashboard/artist/Calendar.module.css";

// Components
import { CalendarEventBlock } from "./CalendarEventBlock";

// Libs
import { format, isToday } from "date-fns";
import {
  HOURS,
  LANE_HEIGHT_PX,
  MINUTE_WIDTH_PX,
  eventsForDay,
  formatHourLabel,
  layoutDay,
  minutesSinceMidnight,
} from "@/lib/calendar";
import type { CalendarEvent } from "@/types/calendar";

interface CalendarTimeGridProps {
  days: Date[];
  events: CalendarEvent[];
  onSelectEvent: (bookingRequestId: string) => void;
}

export const CalendarTimeGrid = ({
  days,
  events,
  onSelectEvent,
}: CalendarTimeGridProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentTime = useCurrentTime();
  const nowMinute = minutesSinceMidnight(currentTime);

  // Bring the working hours into view on mount rather than starting at midnight.
  useEffect(() => {
    const area = scrollRef.current;
    if (!area) return;
    area.scrollLeft = Math.max(0, (nowMinute - 90) * MINUTE_WIDTH_PX);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const layouts = days.map((day) => {
    const positioned = layoutDay(eventsForDay(events, day));
    const lanes = positioned.reduce((max, p) => Math.max(max, p.laneCount), 1);
    return { day, positioned, lanes };
  });

  const gridTemplateRows = `var(--header-height) ${layouts
    .map(({ lanes }) => `minmax(${lanes * LANE_HEIGHT_PX}px, 1fr)`)
    .join(" ")}`;

  return (
    <div className={styles.timeGrid}>
      <div className={styles.scrollArea} ref={scrollRef}>
        <div className={styles.grid} style={{ gridTemplateRows }}>
          <div className={styles.cornerHead} />
          {HOURS.map((hour) => (
            <div key={hour} className={styles.hourHead}>
              <span>{formatHourLabel(hour)}</span>
            </div>
          ))}

          {/* One row per day: sticky label + event track */}
          {layouts.map(({ day, positioned, lanes }) => {
            const today = isToday(day);
            return (
              <Fragment key={day.toISOString()}>
                <div
                  className={clsx(styles.dayLabel, {
                    [styles.dayLabelToday]: today,
                  })}
                >
                  <span className={styles.dayLabelName}>
                    {format(day, "EEE").toUpperCase()}
                  </span>
                  <span
                    className={clsx(styles.dayLabelNum, {
                      [styles.dayLabelNumToday]: today,
                    })}
                  >
                    {format(day, "d")}
                  </span>
                </div>

                <div
                  className={clsx(styles.dayTrack, {
                    [styles.dayTrackToday]: today,
                  })}
                >
                  <div
                    className={styles.dayLanes}
                    style={{ height: `${lanes * LANE_HEIGHT_PX}px` }}
                  >
                    {positioned.map((p) => (
                      <CalendarEventBlock
                        key={p.event.id}
                        positioned={p}
                        currentTime={currentTime}
                        onSelect={onSelectEvent}
                      />
                    ))}
                  </div>
                </div>
              </Fragment>
            );
          })}

          <div
            className={styles.currentTimeLine}
            style={{
              left: `calc(var(--gutter-width) + ${nowMinute * MINUTE_WIDTH_PX}px)`,
            }}
          >
            <span className={styles.nowDot} />
          </div>
        </div>
      </div>
    </div>
  );
};

function useCurrentTime(): Date {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setTime(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);
  return time;
}
