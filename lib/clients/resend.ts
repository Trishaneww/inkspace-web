// Libs
import { Resend } from "resend";

interface ResendClient {
  resend: Resend;
  from: string;
}

export const createResendClient = (): ResendClient | null => {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) return null;

  return { resend: new Resend(apiKey), from };
};
