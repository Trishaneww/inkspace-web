// Libs
import { api } from "./client";
import type { CalendarEvent, CreateAppointmentPayload } from "@/types/calendar";
import type { Inquiry } from "@/types/bookings";

export const calendarApi = {
  list(token: string, from: string, to: string) {
    const params = new URLSearchParams({ from, to });
    return api.get<{ events: CalendarEvent[] }>(
      `/v1/current-user/calendar?${params.toString()}`,
      token,
    );
  },

  // Manually book an appointment (creates the backing booking request too).
  create(token: string, payload: CreateAppointmentPayload) {
    return api.post<Inquiry>("/v1/current-user/calendar", payload, token);
  },
};
