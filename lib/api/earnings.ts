// Libs
import { api } from "@/lib/api/client";
import type { Earnings } from "@/types/earnings";

export const earningsApi = {
  get(token: string) {
    return api.get<Earnings>("/v1/current-user/earnings", token);
  },
};
