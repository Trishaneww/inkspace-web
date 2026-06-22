"use client";

// Next.js
import { useState } from "react";

// Libs
import { paymentsApi } from "@/lib/api/payments";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/lib/auth";
import { displayToast } from "@/lib/toast";
import {
  canSubmitFinalPayment,
  createPaymentForm,
  getPaidDepositCents,
  getPaymentAmountCents,
} from "@/lib/payments";

// Types
import type { Inquiry } from "@/types/bookings";
import type { RequestPaymentForm } from "@/types/payments";

export type RequestPaymentPhase = "type" | "review";

export function useRequestPayment(inquiry: Inquiry, onCreated: () => void) {
  const { token } = useAuth();
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<RequestPaymentPhase>("type");
  const [form, setForm] = useState<RequestPaymentForm>(() =>
    createPaymentForm(),
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const depositPaidCents = getPaidDepositCents(inquiry);

  const update = (patch: Partial<RequestPaymentForm>) =>
    setForm((prev) => ({ ...prev, ...patch }));

  const open = () => {
    setForm(createPaymentForm());
    setPhase("type");
    setError(null);
    setIsActive(true);
  };

  const close = () => {
    setIsActive(false);
    setPhase("type");
    setError(null);
  };

  const canSubmit = canSubmitFinalPayment(form, depositPaidCents);

  const goToReview = () => {
    if (canSubmit) setPhase("review");
  };

  const back = () => {
    setError(null);
    if (phase === "review") setPhase("type");
    else close();
  };

  const submit = async () => {
    if (!token || !canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      await paymentsApi.createPaymentRequest(token, inquiry.id, {
        type: form.type,
        amountCents: getPaymentAmountCents(form),
      });
      displayToast("Payment request sent", "success");
      onCreated();
      close();
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setError(
          "Connect your Stripe account in Settings before requesting payments.",
        );
      } else {
        setError(
          err instanceof Error ? err.message : "Couldn't send the request",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return {
    isActive,
    phase,
    form,
    update,
    depositPaidCents,
    open,
    close,
    back,
    goToReview,
    submit,
    submitting,
    canSubmit,
    error,
  };
}
