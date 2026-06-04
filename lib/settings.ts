// Libs
import type { SelectOption } from "@/lib/formatters";
import type { AvailabilityWindowInput } from "@/types/settings";

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

export function toSelectOptions(
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
