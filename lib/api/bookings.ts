// Libs
import { api } from "@/lib/api/client";
import type { Inquiry, InquiryListResponse } from "@/types/booking";

export const bookingsApi = {
  list(token: string) {
    return api.get<InquiryListResponse>("/v1/current-user/bookings", token);
  },

  get(token: string, id: string) {
    return api.get<Inquiry>(`/v1/current-user/bookings/${id}`, token);
  },

  accept(token: string, id: string, sessionDurationMinutes?: number) {
    return api.post<Inquiry>(
      `/v1/current-user/bookings/${id}/accept`,
      { sessionDurationMinutes },
      token,
    );
  },

  decline(token: string, id: string) {
    return api.post<Inquiry>(
      `/v1/current-user/bookings/${id}/decline`,
      {},
      token,
    );
  },

  reopen(token: string, id: string) {
    return api.post<Inquiry>(
      `/v1/current-user/bookings/${id}/reopen`,
      {},
      token,
    );
  },

  devSeed(token: string) {
    return api.post<{ created: number }>(
      "/v1/current-user/bookings/dev-seed",
      {},
      token,
    );
  },
};
