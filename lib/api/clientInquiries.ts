// Libs
import { api } from "@/lib/api/client";
import type { ClientInquiryListResponse } from "@/types/bookings";

export const clientInquiriesApi = {
  list(token: string) {
    return api.get<ClientInquiryListResponse>(
      "/v1/current-user/inquiries",
      token,
    );
  },
};