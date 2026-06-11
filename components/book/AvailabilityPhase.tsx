"use client";

// CSS
import clsx from "clsx";
import styles from "@/styles/onboarding/Onboarding.module.css";

// HTML Components
import { Button } from "../ui/button";
import { Label } from "@/components/ui/label";

// Components
import { OptionsSelect } from "@/components/common/OptionsSelect";

// Libs
import {
  collapseAvailabilityBounds,
  availableWeekdays,
} from "@/lib/bookingFlow";
import {
  AVAILABILITY_END_TIME_OPTIONS,
  AVAILABILITY_START_TIME_OPTIONS,
} from "@/constants/settings";
import type {
  BookingFlowFormState,
  UpdateBookingForm,
} from "@/types/bookingFlow";
import type { OpenBookAvailabilityWindow } from "@/types/bookings";

interface AvailabilityPhaseProps {
  form: BookingFlowFormState;
  update: UpdateBookingForm;
  availability: OpenBookAvailabilityWindow[];
}

export const AvailabilityPhase = ({
  form,
  update,
  availability,
}: AvailabilityPhaseProps) => {
  const dayBounds = collapseAvailabilityBounds(availability);
  const availableDays = availableWeekdays(availability);

  const getWindow = (weekday: number) =>
    form.windows.find((window) => window.weekday === weekday);

  const toggleDay = (weekday: number) => {
    if (getWindow(weekday)) {
      update({
        windows: form.windows.filter((window) => window.weekday !== weekday),
      });
      return;
    }
    const bound = dayBounds.get(weekday);
    if (!bound) return;
    update({
      windows: [
        ...form.windows,
        { weekday, startMinute: bound.start, endMinute: bound.end },
      ],
    });
  };

  const setDayTime = (
    weekday: number,
    patch: Partial<OpenBookAvailabilityWindow>,
  ) =>
    update({
      windows: form.windows.map((window) =>
        window.weekday === weekday ? { ...window, ...patch } : window,
      ),
    });

  return (
    <>
      <div className={styles.field}>
        <Label>Days that work</Label>
        <div className={styles.dayToggles}>
          {availableDays.map((day) => (
            <Button
              key={day.value}
              type="button"
              className={clsx(
                styles.dayToggle,
                getWindow(day.value) && styles.dayToggleActive,
              )}
              onClick={() => toggleDay(day.value)}
            >
              {day.short}
            </Button>
          ))}
        </div>
      </div>

      {form.windows.length > 0 && (
        <div className={styles.dayHours}>
          {availableDays
            .filter((day) => getWindow(day.value))
            .map((day) => {
              const window = getWindow(day.value)!;
              const bound = dayBounds.get(day.value)!;
              return (
                <div key={day.value} className={styles.dayHoursRow}>
                  <span className={styles.dayHoursLabel}>{day.short}</span>
                  <OptionsSelect
                    ariaLabel={`${day.label} from`}
                    className={styles.selectTrigger}
                    value={String(window.startMinute)}
                    options={AVAILABILITY_START_TIME_OPTIONS.filter(
                      (o) =>
                        Number(o.value) >= bound.start &&
                        Number(o.value) < bound.end &&
                        Number(o.value) < window.endMinute,
                    )}
                    onValueChange={(v) =>
                      setDayTime(day.value, { startMinute: Number(v) })
                    }
                  />
                  <OptionsSelect
                    ariaLabel={`${day.label} to`}
                    className={styles.selectTrigger}
                    value={String(window.endMinute)}
                    options={AVAILABILITY_END_TIME_OPTIONS.filter(
                      (o) =>
                        Number(o.value) <= bound.end &&
                        Number(o.value) > bound.start &&
                        Number(o.value) > window.startMinute,
                    )}
                    onValueChange={(v) =>
                      setDayTime(day.value, { endMinute: Number(v) })
                    }
                  />
                </div>
              );
            })}
        </div>
      )}
    </>
  );
};
