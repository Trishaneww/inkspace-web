// Libs
import { SETTINGS_TABS } from "@/constants/settings";
import type { SelectOption } from "@/lib/formatters";
import type { AvailabilityWindowInput, SettingsTabId } from "@/types/settings";

export function getChangedFields<D extends Record<string, unknown>>(
  original: Partial<D>,
  draft: D,
  keys: (keyof D)[],
): Partial<D> {
  const changes: Partial<D> = {};
  for (const key of keys) {
    if (draft[key] !== original[key]) {
      changes[key] = draft[key];
    }
  }
  return changes;
}

export function hasUnsavedChanges<D extends Record<string, unknown>>(
  original: Partial<D>,
  draft: D,
  keys: (keyof D)[],
): boolean {
  return keys.some((key) => draft[key] !== original[key]);
}

export function formatSelectOptions(
  options: { value: number; label: string }[],
): SelectOption[] {
  return options.map((o) => ({ value: String(o.value), label: o.label }));
}

export function availabilityKey(windows: AvailabilityWindowInput[]): string {
  return windows
    .map((w) => `${w.weekday}:${w.startMinute}-${w.endMinute}`)
    .sort()
    .join("|");
}

export function getInitialTab(tab: string | null): SettingsTabId {
  const match = SETTINGS_TABS.find((t) => t.id === tab);
  return match ? match.id : "personal";
}

export function parseHourCount(value: string): number | null {
  const trimmed = value.trim();
  if (trimmed === "") return null;
  const n = Number(trimmed);
  return Number.isInteger(n) && n > 0 ? n : null;
}

export function areStyleArraysEqual(a: string[], b: string[]): boolean {
  return (
    a.length === b.length && [...a].sort().join("|") === [...b].sort().join("|")
  );
}
