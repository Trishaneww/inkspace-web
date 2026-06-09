// Libs
import { api } from "@/lib/api/client";
import type { OpenBook, UpdateOpenBookPayload } from "@/types/booking";

export const openBookApi = {
  get(token: string) {
    return api.get<OpenBook>("/v1/current-user/open-book", token);
  },
  update(token: string, payload: UpdateOpenBookPayload) {
    return api.patch<OpenBook>("/v1/current-user/open-book", payload, token);
  },
};
