"use client";

// Next.js
import { useState } from "react";

// Components
import { PhoneAuth } from "@/components/auth/PhoneAuth";
import { SignupForm } from "@/components/auth/SignupForm";

// Hooks
import { getApiErrorMessage, useAuthForm } from "@/hooks/use-auth-form";

// Libs
import { consumeOAuthPrefill, useAuth, type OAuthPrefill } from "@/lib/auth";
import type { SignupFormValues } from "@/lib/validation/auth";

export const SignupFlow = () => {
  const { signup, completeOAuthSignup } = useAuth();
  const {
    isVerifyingPhone,
    verification,
    formError,
    setFormError,
    phoneCodeForm,
    submitPhoneCode,
    goToPhoneVerification,
    goBackToCredentials,
    resendPhoneCode,
  } = useAuthForm();

  const [oauth] = useState<OAuthPrefill | null>(() => consumeOAuthPrefill());

  const handleSignupSubmit = async (values: SignupFormValues) => {
    setFormError(null);
    try {
      const res = oauth
        ? await completeOAuthSignup({
            oauthSession: oauth.oauthSession,
            firstName: values.firstName,
            lastName: values.lastName,
            password: values.password,
            phone: values.phone,
            role: values.role,
          })
        : await signup(values);
      goToPhoneVerification({
        verificationId: res.verificationId,
        maskedPhone: res.maskedPhone,
      });
    } catch (err) {
      setFormError(
        getApiErrorMessage(err, "Something went wrong. Please try again."),
      );
    }
  };

  if (isVerifyingPhone && verification) {
    return (
      <PhoneAuth
        form={phoneCodeForm}
        onSubmit={submitPhoneCode}
        onChangePhone={goBackToCredentials}
        onResend={resendPhoneCode}
        verification={verification}
        formError={formError}
        changeLabel="Wrong phone number?"
      />
    );
  }

  return (
    <SignupForm
      onSubmit={handleSignupSubmit}
      formError={formError}
      defaultValues={
        oauth
          ? {
              firstName: oauth.firstName,
              lastName: oauth.lastName,
              email: oauth.email,
            }
          : undefined
      }
      lockEmail={!!oauth}
      showOAuthButtons={!oauth}
    />
  );
};
