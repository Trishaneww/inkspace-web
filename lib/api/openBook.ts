// Libs
import { api } from "@/lib/api/client";
import type {
  CreateBookingRequestPayload,
  CreateBookingRequestResult,
  OpenBook,
  OpenBookProfile,
  PresignReferenceResult,
  UpdateOpenBookPayload,
} from "@/types/bookings";

export const openBookApi = {
  get(token: string) {
    return api.get<OpenBook>("/v1/current-user/open-book", token);
  },
  update(token: string, payload: UpdateOpenBookPayload) {
    return api.patch<OpenBook>("/v1/current-user/open-book", payload, token);
  },
  getProfile(slug: string) {
    return api.get<OpenBookProfile>(`/v1/book/${encodeURIComponent(slug)}`);
  },
  presignReference(slug: string, contentType: string) {
    return api.post<PresignReferenceResult>(
      `/v1/book/${encodeURIComponent(slug)}/uploads/presign`,
      { contentType },
    );
  },
  submitRequest(slug: string, payload: CreateBookingRequestPayload) {
    return api.post<CreateBookingRequestResult>(
      `/v1/book/${encodeURIComponent(slug)}/requests`,
      payload,
    );
  },
};
