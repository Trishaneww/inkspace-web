"use client";

// Next.js
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Libs
import { ApiError } from "@/lib/api/client";
import { postAuthRedirect, useAuth } from "@/lib/auth";
import {
  verifyPhoneSchema,
  type VerifyPhoneFormValues,
} from "@/lib/validation/auth";
import { AuthPhase, type PhoneVerification } from "@/types/auth";
import type { User } from "@/types/index";

export function useAuthForm() {
  const router = useRouter();
  const { verifyPhone, resendPhoneCode } = useAuth();

  const [phase, setPhase] = useState<AuthPhase>(AuthPhase.Credentials);
  const [verification, setVerification] = useState<PhoneVerification | null>(
    null,
  );
  const [formError, setFormError] = useState<string | null>(null);

  const phoneCodeForm = useForm<VerifyPhoneFormValues>({
    resolver: zodResolver(verifyPhoneSchema),
    defaultValues: { code: "" },
  });

  const goToPhoneVerification = (next: PhoneVerification) => {
    setVerification(next);
    phoneCodeForm.reset({ code: "" });
    setPhase(AuthPhase.VerifyPhone);
  };

  const goBackToCredentials = () => {
    setFormError(null);
    setVerification(null);
    setPhase(AuthPhase.Credentials);
  };

  const redirectAfterAuth = (user: User) => {
    router.replace(postAuthRedirect(user));
  };

  const submitPhoneCode = phoneCodeForm.handleSubmit(async ({ code }) => {
    if (!verification) return;
    setFormError(null);
    try {
      const res = await verifyPhone(verification.verificationId, code);
      redirectAfterAuth(res.user);
    } catch (err) {
      setFormError(
        getApiErrorMessage(err, "Could not verify the code. Try again."),
      );
    }
  });

  const isVerifyingPhone =
    phase === AuthPhase.VerifyPhone && verification !== null;

  return {
    phase,
    verification,
    isVerifyingPhone,
    formError,
    setFormError,
    phoneCodeForm,
    submitPhoneCode,
    goToPhoneVerification,
    goBackToCredentials,
    redirectAfterAuth,
    resendPhoneCode,
  };
}

export function getApiErrorMessage(err: unknown, fallback: string) {
  return err instanceof ApiError ? err.message : fallback;
}
