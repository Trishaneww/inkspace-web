// Libs
import { api } from "@/lib/api/client";
import type { Payout, Transactions } from "@/types/transactions";

export const transactionsApi = {
  get(token: string) {
    return api.get<Transactions>("/v1/current-user/earnings", token);
  },
  getPayouts(token: string) {
    return api.get<Payout[]>("/v1/current-user/payouts", token);
  },
};
