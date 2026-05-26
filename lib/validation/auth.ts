import { z } from "zod";
import { UserRole } from "@/types/index";

const password = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password is too long");

const phone = z
  .string()
  .trim()
  .regex(/^\+?[0-9\s\-().]{7,20}$/, "Enter a valid phone number");

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(50),
  lastName: z.string().trim().min(1, "Last name is required").max(50),
  email: z.string().trim().email("Enter a valid email"),
  phone,
  password,
  role: z.nativeEnum(UserRole, { message: "Select a role" }),
});

export type SignupFormValues = z.infer<typeof signupSchema>;

export const verifyPhoneSchema = z.object({
  code: z
    .string()
    .trim()
    .regex(/^[0-9]{6}$/, "Enter the 6-digit code"),
});

export type VerifyPhoneFormValues = z.infer<typeof verifyPhoneSchema>;
