"use client";

// Components
import { OnboardingDialog } from "@/components/onboarding/OnboardingDialog";

// Libs
import { useAuth } from "@/lib/auth";
import { UserRole } from "@/types/index";

export const OnboardingGate = () => {
  const { user, isLoading } = useAuth();

  if (isLoading || !user) return null;
  if (user.role !== UserRole.Artist || user.onboardedAt) return null;

  return <OnboardingDialog />;
};
