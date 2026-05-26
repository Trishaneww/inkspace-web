export enum AuthPhase {
    Credentials,
    VerifyPhone,
  }
  
  export interface PhoneVerification {
    verificationId: string;
    maskedPhone: string;
  }
  