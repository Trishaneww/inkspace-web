// Libs
import { api } from "@/lib/api/client";
import type { SubscriptionStatus } from "@/types/subscription";

type StripeRedirectResponse = { url: string };

export const subscriptionApi = {
  getStatus(token: string) {
    return api.get<SubscriptionStatus>("/v1/current-user/subscription", token);
  },

  createCheckout(token: string) {
    return api.post<StripeRedirectResponse>(
      "/v1/current-user/subscription/checkout",
      {},
      token,
    );
  },

  createPortal(token: string) {
    return api.post<StripeRedirectResponse>(
      "/v1/current-user/subscription/portal",
      {},
      token,
    );
  },
};
