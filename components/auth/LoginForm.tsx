"use client";

// Next.js
import Link from "next/link";
import { useForm } from "react-hook-form";

// CSS
import styles from "@/styles/auth/Auth.module.css";

// HTML Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Components
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { ApiErrorDisplay } from "./ApiErrorDisplay";

// Libs
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "@/lib/validation/auth";

interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => Promise<void>;
  formError: string | null;
}

export const LoginForm = ({ onSubmit, formError }: LoginFormProps) => {
  const credentialsForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = credentialsForm;

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      {formError && <ApiErrorDisplay error={formError} />}

      <div className={styles.field}>
        <Label htmlFor="login-email">Email</Label>
        <Input
          id="login-email"
          type="email"
          autoComplete="email"
          disabled={isSubmitting}
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        {errors.email && (
          <span className={styles.error}>{errors.email.message}</span>
        )}
      </div>

      <div className={styles.field}>
        <Label htmlFor="login-password">Password</Label>
        <Input
          id="login-password"
          type="password"
          autoComplete="current-password"
          disabled={isSubmitting}
          aria-invalid={!!errors.password}
          {...register("password")}
        />
        {errors.password && (
          <span className={styles.error}>{errors.password.message}</span>
        )}
      </div>

      <Button
        type="submit"
        className={styles.submitBtn}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Signing in…" : "Sign in"}
      </Button>

      <div className={styles.divider}>or continue with</div>
      <OAuthButtons />

      <p className={styles.footerText}>
        Don&apos;t have an account?{" "}
        <Link href="/signup" className={styles.footerLink}>
          Create one
        </Link>
      </p>
    </form>
  );
};
