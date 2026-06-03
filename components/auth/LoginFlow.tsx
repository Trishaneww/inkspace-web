"use client";

// Components
import { LoginForm } from "@/components/auth/LoginForm";
import { PhoneAuth } from "@/components/auth/PhoneAuth";

// Hooks
import { getApiErrorMessage, useAuthForm } from "@/hooks/useAuthForm";

// Libs
import { useAuth } from "@/lib/auth";
import type { LoginFormValues } from "@/lib/validation/auth";

export const LoginFlow = () => {
  const { login } = useAuth();
  const {
    isVerifyingPhone,
    verification,
    formError,
    setFormError,
    phoneCodeForm,
    submitPhoneCode,
    goToPhoneVerification,
    goBackToCredentials,
    redirectAfterAuth,
    resendPhoneCode,
  } = useAuthForm();

  const handleLoginSubmit = async (values: LoginFormValues) => {
    setFormError(null);
    try {
      const res = await login(values.email, values.password);
      if (res.status === "authenticated") {
        redirectAfterAuth(res.user);
        return;
      }
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
        changeLabel="Back to sign in"
      />
    );
  }

  return <LoginForm onSubmit={handleLoginSubmit} formError={formError} />;
};
