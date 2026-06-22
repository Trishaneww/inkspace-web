// Libs
import { api } from "@/lib/api/client";

// Types
import type { ClientSession } from "@/lib/auth/context";
import type { PublicBookingRequest } from "@/types/bookings";
import type { CreateClientAccountPayload } from "@/types/payments";

export const publicBookingApi = {
  get(token: string) {
    return api.get<PublicBookingRequest>(`/v1/booking/${token}`);
  },

  createClientAccount(token: string, payload: CreateClientAccountPayload) {
    return api.post<ClientSession>(`/v1/booking/${token}/account`, payload);
  },
};
