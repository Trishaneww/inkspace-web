"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import { ApiError } from "@/lib/api/client";
import {
  consumeOAuthState,
  getRedirectUri,
  postAuthRedirect,
  storeOAuthPrefill,
  useAuth,
  type OAuthProvider,
} from "@/lib/auth";

const VALID_PROVIDERS: OAuthProvider[] = ["google", "microsoft"];

function isOAuthProvider(value: string): value is OAuthProvider {
  return (VALID_PROVIDERS as string[]).includes(value);
}

/**
 * OAuth landing page. The provider redirects here with ?code=... &state=...
 * We hand the code off to the Go backend (which does the token exchange and
 * verifies with the provider) and then complete the session.
 */
export default function OAuthCallbackPage() {
  const router = useRouter();
  const params = useParams<{ provider: string }>();
  const searchParams = useSearchParams();
  const { completeOAuth } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    // Wrap in a microtask so every setError fires asynchronously from the
    // effect's perspective — a synchronous setState in the effect body
    // would trip react-hooks/set-state-in-effect under React 19.
    void Promise.resolve().then(async () => {
      const provider = params.provider;
      if (!isOAuthProvider(provider)) {
        setError("Unknown OAuth provider.");
        return;
      }

      const providerError = searchParams.get("error");
      if (providerError) {
        setError(`Sign-in cancelled or denied (${providerError}).`);
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

      try {
        const res = await completeOAuth({
          provider,
          code,
          redirectUri: getRedirectUri(provider),
        });
        if (res.status === "authenticated") {
          router.replace(postAuthRedirect(res.user));
        } else {
          // First-time OAuth user — hand off to the signup form to
          // collect password / phone / role.
          storeOAuthPrefill({
            oauthSession: res.oauthSession,
            email: res.email,
            firstName: res.firstName,
            lastName: res.lastName,
          });
          router.replace("/signup");
        }
      } catch (err) {
        setError(
          err instanceof ApiError
            ? err.message
            : "Could not complete sign-in.",
        );
      }
    });
  }, [completeOAuth, params.provider, router, searchParams]);

  if (error) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1>Sign-in failed</h1>
        <p>{error}</p>
        <a href="/login">Back to sign in</a>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <p>Completing sign-in…</p>
    </div>
  );
}
