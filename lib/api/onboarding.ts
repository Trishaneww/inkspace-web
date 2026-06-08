// Libs
import { api } from "@/lib/api/client";
import type {
  OnboardingPayload,
  OnboardingResponse,
  UsernameAvailability,
} from "@/types/onboarding";

export const onboardingApi = {
  checkUsername(username: string, token: string) {
    return api.get<UsernameAvailability>(
      `/v1/onboarding/username-available?username=${encodeURIComponent(username)}`,
      token,
    );
  },

  complete(payload: OnboardingPayload, token: string) {
    return api.post<OnboardingResponse>("/v1/onboarding", payload, token);
  },
};
