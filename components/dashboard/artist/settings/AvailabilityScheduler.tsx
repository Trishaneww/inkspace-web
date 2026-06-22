"use client";

// Next.js
import { useState } from "react";

// CSS
import clsx from "clsx";
import styles from "@/styles/dashboard/artist/settings/Settings.module.css";

// HTML Components
import { Switch } from "@/components/ui/switch";

// Components
import { OptionsSelect } from "@/components/common/OptionsSelect";

// Libs
import {
  WEEKDAYS,
  AVAILABILITY_DEFAULT_START_MINUTE,
  AVAILABILITY_DEFAULT_END_MINUTE,
  AVAILABILITY_START_TIME_OPTIONS,
  AVAILABILITY_END_TIME_OPTIONS,
} from "@/constants/settings";
import { formatTime } from "@/lib/formatters";
import type { AvailabilityWindowInput } from "@/types/settings";

interface AvailabilitySchedulerProps {
  windows: AvailabilityWindowInput[];
  onChange: (windows: AvailabilityWindowInput[]) => void;
}

export const AvailabilityScheduler = ({
  windows,
  onChange,
}: AvailabilitySchedulerProps) => {
  const [selectedDay, setSelectedDay] = useState<number>(WEEKDAYS[0].value);

  // One range per weekday. Index the latest window per day so edits replace it.
  const byDay = new Map<number, AvailabilityWindowInput>();
  windows.forEach((w) => {
    byDay.set(w.weekday, {
      weekday: w.weekday,
      startMinute: w.startMinute,
      endMinute: w.endMinute,
    });
  });

  const commit = (next: Map<number, AvailabilityWindowInput>) => {
    onChange(
      WEEKDAYS.map((d) => next.get(d.value)).filter(
        (w): w is AvailabilityWindowInput => w !== undefined,
      ),
    );
  };

  const toggleDay = (weekday: number, enabled: boolean) => {
    const next = new Map(byDay);
    if (enabled) {
      next.set(weekday, {
        weekday,
        startMinute: AVAILABILITY_DEFAULT_START_MINUTE,
        endMinute: AVAILABILITY_DEFAULT_END_MINUTE,
      });
    } else {
      next.delete(weekday);
    }
    commit(next);
  };

  const updateDay = (
    weekday: number,
    patch: Partial<AvailabilityWindowInput>,
  ) => {
    const current = byDay.get(weekday);
    if (!current) return;
    const next = new Map(byDay);
    next.set(weekday, { ...current, ...patch });
    commit(next);
  };

  const activeDay =
    WEEKDAYS.find((d) => d.value === selectedDay) ?? WEEKDAYS[0];
  const activeRange = byDay.get(activeDay.value);
  const activeEnabled = activeRange !== undefined;

  return (
    <div className={styles.weeklyHours}>
      <div className={styles.dayChips}>
        {WEEKDAYS.map((day) => (
          <button
            key={day.value}
            type="button"
            className={clsx(styles.dayChip, {
              [styles.dayChipOpen]: byDay.has(day.value),
              [styles.dayChipSelected]: day.value === selectedDay,
            })}
            onClick={() => setSelectedDay(day.value)}
            aria-pressed={day.value === selectedDay}
          >
            {day.short}
          </button>
        ))}
      </div>

      <div className={styles.dayEditor}>
        <div className={styles.dayToggle}>
          <Switch
            checked={activeEnabled}
            onCheckedChange={(on) => toggleDay(activeDay.value, on)}
            aria-label={`Open on ${activeDay.label}`}
          />
          <span className={styles.dayLabel}>
            {activeEnabled
              ? `Open on ${activeDay.label}`
              : `${activeDay.label} — closed`}
          </span>
        </div>

        {activeEnabled && activeRange && (
          <div className={styles.timeRangeRow}>
            <OptionsSelect
              ariaLabel={`${activeDay.label} start time`}
              value={String(activeRange.startMinute)}
              options={AVAILABILITY_START_TIME_OPTIONS.filter(
                (o) => Number(o.value) < activeRange.endMinute,
              )}
              onValueChange={(v) =>
                updateDay(activeDay.value, { startMinute: Number(v) })
              }
            />
            <span className={styles.timeSeparator}>to</span>
            <OptionsSelect
              ariaLabel={`${activeDay.label} end time`}
              value={String(activeRange.endMinute)}
              options={AVAILABILITY_END_TIME_OPTIONS.filter(
                (o) => Number(o.value) > activeRange.startMinute,
              )}
              onValueChange={(v) =>
                updateDay(activeDay.value, { endMinute: Number(v) })
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export const WeeklyHoursSummary = ({
  windows,
}: {
  windows: AvailabilityWindowInput[];
}) => {
  const byDay = new Map<number, AvailabilityWindowInput>();
  windows.forEach((w) => byDay.set(w.weekday, w));

  return (
    <div>
      {WEEKDAYS.map((day) => {
        const range = byDay.get(day.value);
        return (
          <div key={day.value} className={styles.dayRow}>
            <span className={styles.dayLabel}>{day.label}</span>
            {range ? (
              <span className={styles.fieldValue}>
                {formatTime(range.startMinute)} –{" "}
                {formatTime(range.endMinute)}
              </span>
            ) : (
              <span className={styles.dayClosed}>Closed</span>
            )}
          </div>
        );
      })}
    </div>
  );
};
