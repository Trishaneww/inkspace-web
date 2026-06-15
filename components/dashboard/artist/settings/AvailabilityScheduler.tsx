"use client";

// CSS
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

  return (
    <div>
      {WEEKDAYS.map((day) => {
        const range = byDay.get(day.value);
        const enabled = range !== undefined;

        return (
          <div key={day.value} className={styles.dayRow}>
            <div className={styles.dayToggle}>
              <Switch
                checked={enabled}
                onCheckedChange={(on) => toggleDay(day.value, on)}
                aria-label={day.label}
              />
              <span className={styles.dayLabel}>{day.label}</span>
            </div>

            <div className={styles.timeRanges}>
              {!enabled ? (
                <span className={styles.dayClosed}>Closed</span>
              ) : (
                <div className={styles.timeRangeRow}>
                  <OptionsSelect
                    ariaLabel={`${day.label} start time`}
                    value={String(range.startMinute)}
                    options={AVAILABILITY_START_TIME_OPTIONS.filter(
                      (o) => Number(o.value) < range.endMinute,
                    )}
                    onValueChange={(v) =>
                      updateDay(day.value, { startMinute: Number(v) })
                    }
                  />
                  <span className={styles.timeSeparator}>to</span>
                  <OptionsSelect
                    ariaLabel={`${day.label} end time`}
                    value={String(range.endMinute)}
                    options={AVAILABILITY_END_TIME_OPTIONS.filter(
                      (o) => Number(o.value) > range.startMinute,
                    )}
                    onValueChange={(v) =>
                      updateDay(day.value, { endMinute: Number(v) })
                    }
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}
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
