"use client";

// Next.js
import { useState } from "react";

// Hooks
import { useDraftState } from "@/hooks/useDraftState";

// Libs
import {
  availabilityKey,
  getChangedFields,
  hasUnsavedChanges,
} from "@/lib/settings";
import type { ArtistSettingsController } from "@/hooks/useArtistSettings";
import type {
  ArtistSettings,
  AvailabilityWindowInput,
  UpdateSettingsPayload,
} from "@/types/settings";

type AvailabilityDraft = Pick<ArtistSettings, "acceptingBookings" | "timezone">;
const AVAILABILITY_KEYS: (keyof AvailabilityDraft)[] = [
  "acceptingBookings",
  "timezone",
];

type GoalDraft = Pick<ArtistSettings, "monthlyBookingGoal">;
const GOAL_KEYS: (keyof GoalDraft)[] = ["monthlyBookingGoal"];

type SchedulingRulesDraft = Pick<
  ArtistSettings,
  | "slotIntervalMinutes"
  | "bufferMinutes"
  | "minNoticeMinutes"
  | "maxAdvanceDays"
>;
const SCHEDULING_RULES_AUTO_KEYS: (keyof SchedulingRulesDraft)[] = [
  "slotIntervalMinutes",
  "bufferMinutes",
  "minNoticeMinutes",
];

export function useBookingPreferencesForm(
  controller: ArtistSettingsController,
) {
  const { data, saveSettings, saveAvailability } = controller;
  const settings = data?.settings;

  const availability = useDraftState<AvailabilityDraft>({
    acceptingBookings: settings?.acceptingBookings ?? true,
    timezone: settings?.timezone ?? "America/Toronto",
  });
  const goal = useDraftState<GoalDraft>({
    monthlyBookingGoal: settings?.monthlyBookingGoal ?? 20,
  });
  const schedulingRules = useDraftState<SchedulingRulesDraft>({
    slotIntervalMinutes: settings?.slotIntervalMinutes ?? 60,
    bufferMinutes: settings?.bufferMinutes ?? 0,
    minNoticeMinutes: settings?.minNoticeMinutes ?? 0,
    maxAdvanceDays: settings?.maxAdvanceDays ?? null,
  });

  const savedWeeklySchedule: AvailabilityWindowInput[] =
    data?.availability.map((w) => ({
      weekday: w.weekday,
      startMinute: w.startMinute,
      endMinute: w.endMinute,
    })) ?? [];
  const [weeklySchedule, setWeeklySchedule] = useState<
    AvailabilityWindowInput[]
  >(() => savedWeeklySchedule);

  const submitAvailability = () => {
    if (!settings) return Promise.resolve();
    return saveSettings(
      getChangedFields(settings, availability.draft, AVAILABILITY_KEYS),
    );
  };

  const submitSchedulingRules = () => {
    if (!settings) return Promise.resolve();
    const patch: UpdateSettingsPayload = getChangedFields(
      settings,
      schedulingRules.draft,
      SCHEDULING_RULES_AUTO_KEYS,
    );
    if (schedulingRules.draft.maxAdvanceDays !== settings.maxAdvanceDays) {
      if (schedulingRules.draft.maxAdvanceDays === null)
        patch.clearMaxAdvance = true;
      else patch.maxAdvanceDays = schedulingRules.draft.maxAdvanceDays;
    }
    return saveSettings(patch);
  };

  const submitGoal = () => {
    if (!settings) return Promise.resolve();
    return saveSettings(getChangedFields(settings, goal.draft, GOAL_KEYS));
  };

  const availabilityChanged = settings
    ? hasUnsavedChanges(settings, availability.draft, AVAILABILITY_KEYS)
    : false;

  const goalChanged = settings
    ? hasUnsavedChanges(settings, goal.draft, GOAL_KEYS)
    : false;

  const schedulingRulesChanged = settings
    ? hasUnsavedChanges(
        settings,
        schedulingRules.draft,
        SCHEDULING_RULES_AUTO_KEYS,
      ) || schedulingRules.draft.maxAdvanceDays !== settings.maxAdvanceDays
    : false;

  const weeklyScheduleChanged =
    availabilityKey(weeklySchedule) !== availabilityKey(savedWeeklySchedule);

  return {
    availability,
    availabilityChanged,
    submitAvailability,
    goal,
    goalChanged,
    submitGoal,
    schedulingRules,
    schedulingRulesChanged,
    submitSchedulingRules,
    weeklySchedule,
    weeklyScheduleChanged,
    setWeeklySchedule,
    resetWeeklySchedule: () => setWeeklySchedule(savedWeeklySchedule),
    saveWeeklySchedule: () => saveAvailability(weeklySchedule),
  };
}
