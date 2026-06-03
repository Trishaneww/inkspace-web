"use client";

// Next.js
import Link from "next/link";
import { Controller, useForm, useWatch } from "react-hook-form";

// CSS
import styles from "@/styles/auth/Auth.module.css";

// HTML Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

// Components
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { ApiErrorDisplay } from "./ApiErrorDisplay";

// Libs
import { zodResolver } from "@hookform/resolvers/zod";
import { formatPhone, formatSelectValue } from "@/lib/formatters";
import { signupSchema, type SignupFormValues } from "@/lib/validation/auth";
import { USER_ROLE_OPTIONS } from "@/constants/auth";
import { UserRole } from "@/types/index";

interface SignupFormProps {
  onSubmit: (values: SignupFormValues) => Promise<void>;
  formError: string | null;
  defaultValues?: Partial<
    Pick<SignupFormValues, "firstName" | "lastName" | "email">
  >;
  lockEmail?: boolean;
  showOAuthButtons?: boolean;
}

export const SignupForm = ({
  onSubmit,
  formError,
  defaultValues,
  lockEmail = false,
  showOAuthButtons = true,
}: SignupFormProps) => {
  const detailsForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: defaultValues?.firstName ?? "",
      lastName: defaultValues?.lastName ?? "",
      email: defaultValues?.email ?? "",
      phone: "",
      password: "",
      role: undefined as unknown as UserRole,
      username: "",
      instagramUrl: "",
    },
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = detailsForm;

  const isArtist = useWatch({ control, name: "role" }) === UserRole.Artist;

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
      {formError && <ApiErrorDisplay error={formError} />}

      <div className={styles.nameRow}>
        <div className={styles.field}>
          <Label htmlFor="signup-first-name">First name</Label>
          <Input
            id="signup-first-name"
            autoComplete="given-name"
            placeholder="Enter your first name"
            disabled={isSubmitting}
            aria-invalid={!!errors.firstName}
            {...register("firstName")}
          />
          {errors.firstName && (
            <span className={styles.error}>{errors.firstName.message}</span>
          )}
        </div>
        <div className={styles.field}>
          <Label htmlFor="signup-last-name">Last name</Label>
          <Input
            id="signup-last-name"
            autoComplete="family-name"
            placeholder="Enter your last name"
            disabled={isSubmitting}
            aria-invalid={!!errors.lastName}
            {...register("lastName")}
          />
          {errors.lastName && (
            <span className={styles.error}>{errors.lastName.message}</span>
          )}
        </div>
      </div>

      <div className={styles.field}>
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          type="email"
          placeholder="Enter your email"
          autoComplete="email"
          disabled={isSubmitting}
          readOnly={lockEmail}
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        {errors.email && (
          <span className={styles.error}>{errors.email.message}</span>
        )}
      </div>

      <div className={styles.field}>
        <Label htmlFor="signup-phone">Phone number</Label>
        <Input
          id="signup-phone"
          type="tel"
          autoComplete="tel"
          placeholder="+1 (416) 123-4567"
          disabled={isSubmitting}
          aria-invalid={!!errors.phone}
          {...register("phone")}
          onChange={(e) => {
            e.target.value = formatPhone(e.target.value);
            void register("phone").onChange(e);
          }}
        />
        {errors.phone && (
          <span className={styles.error}>{errors.phone.message}</span>
        )}
      </div>

      <div className={styles.field}>
        <Label htmlFor="signup-password">Password</Label>
        <Input
          id="signup-password"
          type="password"
          autoComplete="new-password"
          placeholder="Enter your password"
          disabled={isSubmitting}
          aria-invalid={!!errors.password}
          {...register("password")}
        />
        {errors.password && (
          <span className={styles.error}>{errors.password.message}</span>
        )}
      </div>

      <div className={styles.field}>
        <Label htmlFor="signup-role">Role</Label>
        <Controller
          control={control}
          name="role"
          render={({ field }) => (
            <Select
              value={field.value ?? ""}
              onValueChange={field.onChange}
              disabled={isSubmitting}
            >
              <SelectTrigger
                id="signup-role"
                aria-invalid={!!errors.role}
                className={styles.selectTrigger}
              >
                <SelectValue placeholder="Select a role">
                  {(value) => formatSelectValue(value, USER_ROLE_OPTIONS)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {USER_ROLE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.role && (
          <span className={styles.error}>{errors.role.message}</span>
        )}
      </div>

      {isArtist && (
        <>
          <div className={styles.field}>
            <Label htmlFor="signup-username">Username</Label>
            <Input
              id="signup-username"
              autoComplete="username"
              placeholder="your-handle"
              disabled={isSubmitting}
              aria-invalid={!!errors.username}
              {...register("username")}
            />
            {errors.username && (
              <span className={styles.error}>{errors.username.message}</span>
            )}
          </div>

          <div className={styles.field}>
            <Label htmlFor="signup-instagram">Instagram (optional)</Label>
            <Input
              id="signup-instagram"
              type="url"
              autoComplete="off"
              placeholder="https://instagram.com/yourhandle"
              disabled={isSubmitting}
              aria-invalid={!!errors.instagramUrl}
              {...register("instagramUrl")}
            />
            {errors.instagramUrl && (
              <span className={styles.error}>
                {errors.instagramUrl.message}
              </span>
            )}
          </div>
        </>
      )}

      <Button
        type="submit"
        className={styles.submitBtn}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creating account" : "Continue"}
        {isSubmitting && <Loader2 size={16} className="animate-spin" />}
      </Button>

      {showOAuthButtons && (
        <>
          <div className={styles.divider}>or continue with</div>
          <OAuthButtons />
        </>
      )}

      <p className={styles.footerText}>
        Already have an account?{" "}
        <Link href="/login" className={styles.footerLink}>
          Sign in
        </Link>
      </p>
    </form>
  );
};
