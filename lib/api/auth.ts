// Libs
import { api } from "@/lib/api/client";
import type { User, UserRole } from "@/types/index";

export type LoginPayload = {
  email: string;
  password: string;
};

export type SignupPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  username?: string;
  instagramUrl?: string;
};

export type VerifyPhonePayload = {
  verificationId: string;
  code: string;
};

export type OAuthCallbackPayload = {
  provider: "google" | "microsoft";
  idToken?: string;
  code?: string;
  redirectUri?: string;
};

export type AuthenticatedResponse = {
  status: "authenticated";
  token: string;
  refreshToken: string;
  user: User;
};

export type PhoneVerificationRequiredResponse = {
  status: "phone_verification_required";
  verificationId: string;
  maskedPhone: string;
};

export type LoginResponse =
  | AuthenticatedResponse
  | PhoneVerificationRequiredResponse;

export type SignupResponse = PhoneVerificationRequiredResponse;

export type OAuthCompleteProfileRequiredResponse = {
  status: "oauth_complete_profile_required";
  oauthSession: string;
  email: string;
  firstName: string;
  lastName: string;
};

export type OAuthCallbackResponse =
  | AuthenticatedResponse
  | OAuthCompleteProfileRequiredResponse;

export type OAuthCompletePayload = {
  oauthSession: string;
  firstName: string;
  lastName: string;
  password: string;
  phone: string;
  role: UserRole;
  username?: string;
  instagramUrl?: string;
};

export const authApi = {
  login(payload: LoginPayload) {
    return api.post<LoginResponse>("/v1/auth/login", payload);
  },

  signup(payload: SignupPayload) {
    return api.post<SignupResponse>("/v1/auth/signup", payload);
  },

  verifyPhone(payload: VerifyPhonePayload) {
    return api.post<AuthenticatedResponse>(
      "/v1/auth/verify-phone",
      payload,
    );
  },

  resendPhoneCode(verificationId: string) {
    return api.post<{ ok: true }>("/v1/auth/verify-phone/resend", {
      verificationId,
    });
  },

  oauthCallback(payload: OAuthCallbackPayload) {
    return api.post<OAuthCallbackResponse>(
      `/v1/auth/oauth/${payload.provider}`,
      payload,
    );
  },

  completeOAuthSignup(payload: OAuthCompletePayload) {
    return api.post<PhoneVerificationRequiredResponse>(
      "/v1/auth/oauth/complete",
      payload,
    );
  },

  getSession(token: string) {
    return api.get<User>("/v1/auth/current-user", token);
  },

  logout(token: string) {
    return api.post<void>("/v1/auth/logout", {}, token);
  },
};
