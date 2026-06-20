export function getGreeting(date: Date = new Date()): string {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export type DeltaResult =
  | { type: "change"; percent: number }
  | { type: "new" }
  | { type: "none" };

export function buildDelta(current: number, previous: number): DeltaResult {
  if (!Number.isFinite(current) || !Number.isFinite(previous)) {
    return { type: "none" };
  }
  if (previous === 0) {
    return current > 0 ? { type: "new" } : { type: "none" };
  }
  return {
    type: "change",
    percent: Math.round(((current - previous) / previous) * 100),
  };
}
