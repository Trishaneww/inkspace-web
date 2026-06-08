"use client";

// Next.js
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Libs
import { ApiError } from "@/lib/api/client";
import { settingsApi } from "@/lib/api/settings";
import {
  consumeOAuthState,
  getGoogleCalendarRedirectUri,
  useAuth,
} from "@/lib/auth";
import { displayToast } from "@/lib/toast";

const RETURN_TO = "/dashboard/artist/settings?tab=booking";

export default function GoogleCalendarCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const ranRef = useRef(false);

  useEffect(() => {
    if (isLoading) return;
    if (ranRef.current) return;
    ranRef.current = true;

    async function handleCallback() {
      const providerError = searchParams.get("error");
      if (providerError) {
        setError(`Connection cancelled or denied (${providerError}).`);
        return;
      }

      const code = searchParams.get("code");
      if (!code) {
        setError("Missing authorization code.");
        return;
      }

      const state = searchParams.get("state");
      const expectedState = consumeOAuthState();
      if (!expectedState || expectedState !== state) {
        setError("Invalid OAuth state. Please try again.");
        return;
      }

      if (!token) {
        setError("Your session expired. Please sign in and try again.");
        return;
      }

      try {
        await settingsApi.connectGoogleCalendar(token, {
          code,
          redirectUri: getGoogleCalendarRedirectUri(),
        });
        displayToast(
          "Google Calendar connected",
          "success",
          "Your bookings will sync automatically.",
        );
        router.replace(RETURN_TO);
      } catch (err) {
        setError(
          err instanceof ApiError
            ? err.message
            : "Could not connect Google Calendar.",
        );
      }
    }

    void handleCallback();
  }, [isLoading, token, router, searchParams]);

  if (error) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1>Couldn&apos;t connect Google Calendar</h1>
        <p>{error}</p>
        <a href={RETURN_TO}>Back to settings</a>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <p>Connecting your Google Calendar…</p>
    </div>
  );
}
