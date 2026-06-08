"use client";

// CSS
import clsx from "clsx";
import styles from "@/styles/onboarding/Onboarding.module.css";

// HTML Components
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// Components
import { OptionsSelect } from "@/components/common/OptionsSelect";

// Libs
import {
  DEFAULT_END_MINUTE,
  DEFAULT_START_MINUTE,
  WEEKDAYS,
} from "@/constants/onboarding";
import {
  AVAILABILITY_END_TIME_OPTIONS,
  AVAILABILITY_START_TIME_OPTIONS,
} from "@/constants/settings";
import type {
  OnboardingAvailabilityWindow,
  OnboardingFormState,
} from "@/types/onboarding";

interface AvailabilityPhaseProps {
  form: OnboardingFormState;
  update: (patch: Partial<OnboardingFormState>) => void;
}

export const AvailabilityPhase = ({ form, update }: AvailabilityPhaseProps) => {
  const getAvailabilityWindow = (weekday: number) =>
    form.availability.find((w) => w.weekday === weekday);

  const toggleDay = (weekday: number) => {
    if (getAvailabilityWindow(weekday)) {
      update({
        availability: form.availability.filter((w) => w.weekday !== weekday),
      });
    } else {
      update({
        availability: [
          ...form.availability,
          {
            weekday,
            startMinute: DEFAULT_START_MINUTE,
            endMinute: DEFAULT_END_MINUTE,
          },
        ],
      });
    }
  };

  const setDayTime = (
    weekday: number,
    patch: Partial<OnboardingAvailabilityWindow>,
  ) =>
    update({
      availability: form.availability.map((w) =>
        w.weekday === weekday ? { ...w, ...patch } : w,
      ),
    });

  const enabledDays = WEEKDAYS.filter((d) => getAvailabilityWindow(d.value));

  return (
    <>
      <div className={styles.field}>
        <Label>Days you work</Label>
        <div className={styles.dayToggles}>
          {WEEKDAYS.map((d) => (
            <Button
              key={d.value}
              type="button"
              variant="outline"
              size="sm"
              className={
                getAvailabilityWindow(d.value)
                  ? clsx(styles.dayToggle, styles.dayToggleActive)
                  : styles.dayToggle
              }
              onClick={() => toggleDay(d.value)}
            >
              {d.label}
            </Button>
          ))}
        </div>
      </div>

      {enabledDays.length > 0 && (
        <div className={styles.dayHours}>
          {enabledDays.map((d) => {
            const w = getAvailabilityWindow(d.value)!;
            return (
              <div key={d.value} className={styles.dayHoursRow}>
                <span className={styles.dayHoursLabel}>{d.label}</span>
                <OptionsSelect
                  ariaLabel={`${d.label} opens`}
                  className={styles.selectTrigger}
                  value={String(w.startMinute)}
                  options={AVAILABILITY_START_TIME_OPTIONS.filter(
                    (o) => Number(o.value) < w.endMinute,
                  )}
                  onValueChange={(v) =>
                    setDayTime(d.value, { startMinute: Number(v) })
                  }
                />
                <OptionsSelect
                  ariaLabel={`${d.label} closes`}
                  className={styles.selectTrigger}
                  value={String(w.endMinute)}
                  options={AVAILABILITY_END_TIME_OPTIONS.filter(
                    (o) => Number(o.value) > w.startMinute,
                  )}
                  onValueChange={(v) =>
                    setDayTime(d.value, { endMinute: Number(v) })
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
