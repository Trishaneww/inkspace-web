// Libs
import { api } from "@/lib/api/client";
import type {
  CreatePortfolioPayload,
  PortfolioItem,
  PortfolioListResponse,
  PortfolioPresignResponse,
  UpdatePortfolioPayload,
} from "@/types/portfolio";

interface ListQuery {
  status?: string;
  limit?: number;
  offset?: number;
}

export const portfolioApi = {
  listForCurrentUser(token: string, query?: ListQuery) {
    return api.get<PortfolioListResponse>(
      `/v1/current-user/portfolio${buildListQuery(query)}`,
      token,
    );
  },

  listByArtist(artistId: string, query?: ListQuery) {
    return api.get<PortfolioListResponse>(
      `/v1/artists/${artistId}/portfolio${buildListQuery(query)}`,
    );
  },

  create(token: string, payload: CreatePortfolioPayload) {
    return api.post<PortfolioItem>("/v1/portfolio", payload, token);
  },

  update(token: string, id: string, payload: UpdatePortfolioPayload) {
    return api.patch<PortfolioItem>(`/v1/portfolio/${id}`, payload, token);
  },

  publish(token: string, id: string) {
    return api.post<PortfolioItem>(`/v1/portfolio/${id}/publish`, {}, token);
  },

  archive(token: string, id: string) {
    return api.post<PortfolioItem>(`/v1/portfolio/${id}/archive`, {}, token);
  },

  unarchive(token: string, id: string) {
    return api.post<PortfolioItem>(`/v1/portfolio/${id}/unarchive`, {}, token);
  },

  delete(token: string, id: string) {
    return api.delete<void>(`/v1/portfolio/${id}`, token);
  },

  presignUpload(token: string, contentType: string) {
    return api.post<PortfolioPresignResponse>(
      "/v1/portfolio/uploads/presign",
      { contentType },
      token,
    );
  },
};

function buildListQuery(query: ListQuery = {}): string {
  const params = new URLSearchParams();
  if (query.status) params.set("status", query.status);
  if (query.limit !== undefined) params.set("limit", String(query.limit));
  if (query.offset !== undefined) params.set("offset", String(query.offset));
  const q = params.toString();
  return q ? `?${q}` : "";
}

export async function uploadPortfolioImage(
  token: string,
  file: File,
): Promise<string> {
  const presign = await portfolioApi.presignUpload(token, file.type);

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

  return presign.s3Key;
}
