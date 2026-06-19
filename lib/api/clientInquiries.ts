// Libs
import { api } from "@/lib/api/client";
import type {
  ClientInquiryListResponse,
  Inquiry,
  SlotList,
} from "@/types/bookings";

export const clientInquiriesApi = {
  list(token: string) {
    return api.get<ClientInquiryListResponse>(
      "/v1/current-user/inquiries",
      token,
    );
  },

  listSlots(token: string, inquiryId: string, date: string) {
    return api.get<SlotList>(
      `/v1/current-user/inquiries/${inquiryId}/slots?date=${date}`,
      token,
    );
  },

  schedule(token: string, inquiryId: string, scheduledStart: string) {
    return api.post<Inquiry>(
      `/v1/current-user/inquiries/${inquiryId}/schedule`,
      { scheduledStart },
      token,
    );
  },
};