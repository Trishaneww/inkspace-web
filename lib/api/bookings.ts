// Libs
import { api } from "@/lib/api/client";
import type {
  AcceptInquiryPayload,
  Inquiry,
  InquiryListResponse,
  RequestConsultationPayload,
  RescheduleAppointmentPayload,
} from "@/types/bookings";

export const bookingsApi = {
  list(token: string) {
    return api.get<InquiryListResponse>("/v1/current-user/bookings", token);
  },

  get(token: string, id: string) {
    return api.get<Inquiry>(`/v1/current-user/bookings/${id}`, token);
  },

  accept(token: string, id: string, payload: AcceptInquiryPayload) {
    return api.post<Inquiry>(
      `/v1/current-user/bookings/${id}/accept`,
      payload,
      token,
    );
  },

  requestConsultation(
    token: string,
    id: string,
    payload: RequestConsultationPayload,
  ) {
    return api.post<Inquiry>(
      `/v1/current-user/bookings/${id}/request-consultation`,
      payload,
      token,
    );
  },

  reschedule(token: string, id: string, payload: RescheduleAppointmentPayload) {
    return api.post<Inquiry>(
      `/v1/current-user/bookings/${id}/reschedule`,
      payload,
      token,
    );
  },

  resendScheduleLink(token: string, id: string) {
    return api.post<Inquiry>(
      `/v1/current-user/bookings/${id}/resend-schedule-link`,
      {},
      token,
    );
  },

  cancel(token: string, id: string, appointmentId?: string) {
    return api.post<Inquiry>(
      `/v1/current-user/bookings/${id}/cancel`,
      { appointmentId },
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
