// Libs
import { api } from "@/lib/api/client";
import type {
  CreateFlashPayload,
  Flash,
  FlashListResponse,
  FlashStatus,
  PresignUploadResponse,
  UpdateFlashPayload,
} from "@/types/flash";

interface FlashListQuery {
  status?: FlashStatus;
  limit?: number;
  offset?: number;
}

function buildListQuery(query: FlashListQuery = {}): string {
  const params = new URLSearchParams();
  if (query.status) params.set("status", query.status);
  if (query.limit !== undefined) params.set("limit", String(query.limit));
  if (query.offset !== undefined) params.set("offset", String(query.offset));
  const q = params.toString();
  return q ? `?${q}` : "";
}

export const flashesApi = {
  listForCurrentUser(token: string, query?: FlashListQuery) {
    return api.get<FlashListResponse>(
      `/v1/current-user/flashes${buildListQuery(query)}`,
      token,
    );
  },

  listByArtist(artistId: string, query?: FlashListQuery) {
    return api.get<FlashListResponse>(
      `/v1/artists/${artistId}/flashes${buildListQuery(query)}`,
    );
  },

  get(flashId: string) {
    return api.get<Flash>(`/v1/flashes/${flashId}`);
  },

  create(token: string, payload: CreateFlashPayload) {
    return api.post<Flash>("/v1/flashes", payload, token);
  },

  update(token: string, flashId: string, payload: UpdateFlashPayload) {
    return api.patch<Flash>(`/v1/flashes/${flashId}`, payload, token);
  },

  publish(token: string, flashId: string) {
    return api.post<Flash>(`/v1/flashes/${flashId}/publish`, {}, token);
  },

  archive(token: string, flashId: string) {
    return api.post<Flash>(`/v1/flashes/${flashId}/archive`, {}, token);
  },

  delete(token: string, flashId: string) {
    return api.delete<void>(`/v1/flashes/${flashId}`, token);
  },

  presignUpload(token: string, contentType: string) {
    return api.post<PresignUploadResponse>(
      "/v1/flashes/uploads/presign",
      { content_type: contentType },
      token,
    );
  },
};

export async function uploadFlashImage(
  token: string,
  file: File,
): Promise<string> {
  const presign = await flashesApi.presignUpload(token, file.type);

  const putResponse = await fetch(presign.url, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  if (!putResponse.ok) {
    throw new Error(
      `Failed to upload image to S3 (status ${putResponse.status})`,
    );
  }

  return presign.s3_key;
}
