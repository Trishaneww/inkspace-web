// Libs
import { addWeeks, differenceInWeeks, format } from "date-fns";

// Types
import type { BadgeMeta } from "@/types/bookings";
import type { Client } from "@/types/clients";

// Too soon for a touch-up, the tattoo is usually still healing.
const HEALING_WEEKS = 6;
// The common free-touch-up window runs out to roughly six months.
const TOUCH_UP_WINDOW_WEEKS = 26;
// Midpoint of the usual 6–8 week touch-up window, used for the rough date.
const TOUCH_UP_TARGET_WEEKS = 7;

export interface TouchUpStatus {
  meta: BadgeMeta;
  dateLabel?: string;
}

export function buildClientRelationship(client: Client): BadgeMeta {
  if (client.completedSessions >= 2) return { label: "Repeat", variant: "success" };
  if (client.completedSessions === 1) return { label: "Client", variant: "success" };
  if (client.hasUpcoming) return { label: "Booked", variant: "pending" };
  return { label: "Lead", variant: "neutral" };
}

export function buildClientTouchUp(client: Client): TouchUpStatus | null {
  if (client.completedSessions === 0 || !client.lastSessionAt) return null;
  if (client.hasUpcoming) return null;

  const lastSession = new Date(client.lastSessionAt);
  const weeksSince = differenceInWeeks(new Date(), lastSession);
  const targetLabel = `~${format(addWeeks(lastSession, TOUCH_UP_TARGET_WEEKS), "MMM d")}`;

  if (weeksSince < HEALING_WEEKS) {
    return { meta: { label: "Healing", variant: "indigo" }, dateLabel: targetLabel };
  }
  if (weeksSince <= TOUCH_UP_WINDOW_WEEKS) {
    return {
      meta: { label: "Touch-up due", variant: "warning" },
      dateLabel: targetLabel,
    };
  }
  return { meta: { label: "Settled", variant: "inactive" } };
}
