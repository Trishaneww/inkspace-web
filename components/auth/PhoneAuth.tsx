"use client";

// Next.js
import { useEffect, useState } from "react";
import { type UseFormReturn } from "react-hook-form";

// CSS
import styles from "@/styles/auth/Auth.module.css";

// HTML Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

// Components
import { ApiErrorDisplay } from "./ApiErrorDisplay";

// Libs
import { ApiError } from "@/lib/api/client";
import { type VerifyPhoneFormValues } from "@/lib/validation/auth";
import { RESEND_COOLDOWN_SECONDS } from "@/constants/auth";
import type { PhoneVerification } from "@/types/auth";

export const PhoneAuth = ({
  form,
  onSubmit,
  onChangePhone,
  onResend,
  verification,
  formError,
  changeLabel,
}: {
  form: UseFormReturn<VerifyPhoneFormValues>;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  onChangePhone: () => void;
  onResend: (verificationId: string) => Promise<void>;
  verification: PhoneVerification;
  formError: string | null;
  changeLabel: string;
}) => {
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);
  const [resendError, setResendError] = useState<string | null>(null);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (cooldown === 0) return;
    const id = window.setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => window.clearTimeout(id);
  }, [cooldown]);

  const handleResend = async () => {
    setResendError(null);
    setResending(true);
    try {
      await onResend(verification.verificationId);
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      setResendError(
        err instanceof ApiError ? err.message : "Could not resend the code.",
      );
    } finally {
      setResending(false);
    }
  };

  const {
    register,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <p className={styles.footerText}>
        We sent a 6-digit code to {verification.maskedPhone}.
      </p>

      {(formError || resendError) && (
        <ApiErrorDisplay error={formError ?? resendError ?? ""} />
      )}

      <div className={styles.field}>
        <Label htmlFor="verify-code">Verification code</Label>
        <Input
          id="verify-code"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          disabled={isSubmitting}
          aria-invalid={!!errors.code}
          className={styles.codeInput}
          {...register("code")}
        />
        {errors.code && (
          <span className={styles.error}>{errors.code.message}</span>
        )}
      </div>

      <Button
        type="submit"
        className={styles.submitBtn}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Verifying" : "Verify and continue"}
        {isSubmitting && <Loader2 size={16} className="animate-spin" />}
      </Button>

      <div className={styles.resendCodeRow}>
        <Button
          type="button"
          className={styles.linkButton}
          onClick={onChangePhone}
          disabled={isSubmitting}
        >
          {changeLabel}
        </Button>
        <Button
          type="button"
          className={styles.linkButton}
          onClick={handleResend}
          disabled={resending || cooldown > 0 || isSubmitting}
        >
          {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
        </Button>
      </div>
    </form>
  );
};
