export enum AuthPhase {
  Credentials,
  VerifyPhone,
}

export interface PhoneVerification {
  verificationId: string;
  maskedPhone: string;
}

export type OAuthProvider = "google" | "microsoft";
