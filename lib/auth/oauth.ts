// Libs
import {
  GOOGLE_AUTH_URL,
  GOOGLE_CALENDAR_MESSAGE_TYPE,
  GOOGLE_CALENDAR_PROVIDER,
  GOOGLE_CALENDAR_SCOPE,
  MICROSOFT_AUTH_URL,
  OAUTH_STATE_KEY,
  VALID_PROVIDERS,
} from "@/constants/auth";
import { OAuthProvider } from "@/types/auth";

type ProviderConfig = {
  clientId: string | undefined;
  authUrl: string;
  scope: string;
  extraParams?: Record<string, string>;
};

const providers: Record<OAuthProvider, ProviderConfig> = {
  google: {
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    authUrl: GOOGLE_AUTH_URL,
    scope: "openid email profile",
    extraParams: { access_type: "offline", prompt: "select_account" },
  },
  microsoft: {
    clientId: process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID,
    authUrl: MICROSOFT_AUTH_URL,
    scope: "openid email profile User.Read",
    extraParams: { response_mode: "query", prompt: "select_account" },
  },
};

export function isOAuthProvider(value: string): value is OAuthProvider {
  return (VALID_PROVIDERS as string[]).includes(value);
}

export function getRedirectUri(provider: OAuthProvider): string {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}/auth/oauth/callback/${provider}`;
}

export function startOAuthFlow(provider: OAuthProvider): boolean {
  const cfg = providers[provider];
  if (!cfg.clientId) {
    console.warn(
      `[oauth] ${provider} not configured — set NEXT_PUBLIC_${provider.toUpperCase()}_CLIENT_ID.`,
    );
    return false;
  }

  const state = generateState();
  window.sessionStorage.setItem(OAUTH_STATE_KEY, state);

  const params = new URLSearchParams({
    client_id: cfg.clientId,
    redirect_uri: getRedirectUri(provider),
    response_type: "code",
    scope: cfg.scope,
    state,
    ...cfg.extraParams,
  });

  window.location.assign(`${cfg.authUrl}?${params.toString()}`);
  return true;
}

export function consumeOAuthState(): string | null {
  if (typeof window === "undefined") return null;
  const state = window.sessionStorage.getItem(OAUTH_STATE_KEY);
  window.sessionStorage.removeItem(OAUTH_STATE_KEY);
  return state;
}

export function isProviderConfigured(provider: OAuthProvider): boolean {
  return !!providers[provider].clientId;
}

export function getGoogleCalendarRedirectUri(): string {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}/auth/oauth/callback/${GOOGLE_CALENDAR_PROVIDER}`;
}

export function startGoogleCalendarFlow(): boolean {
  const url = buildGoogleCalendarAuthUrl();
  if (!url) return false;

  window.location.assign(url);
  return true;
}

export function openGoogleCalendarPopup(): Window | null {
  const url = buildGoogleCalendarAuthUrl();
  if (!url) return null;

  const width = 500;
  const height = 640;
  const left = window.screenX + Math.max(0, (window.outerWidth - width) / 2);
  const top = window.screenY + Math.max(0, (window.outerHeight - height) / 2);

  return window.open(
    url,
    "inkspace-google-calendar",
    `popup,width=${width},height=${height},left=${left},top=${top}`,
  );
}

export function isGoogleCalendarConfigured(): boolean {
  return !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
}

export function reportToOpener(
  result: { ok: true; email: string } | { ok: false; error: string },
): boolean {
  if (typeof window === "undefined") return false;
  const opener = window.opener;
  if (!opener || opener === window) return false;

  opener.postMessage(
    { type: GOOGLE_CALENDAR_MESSAGE_TYPE, ...result },
    window.location.origin,
  );
  window.close();
  return true;
}

export function consumeExpectedState(): string | null {
  const opener = typeof window !== "undefined" ? window.opener : null;
  if (opener && opener !== window) {
    try {
      const state = opener.sessionStorage.getItem(OAUTH_STATE_KEY);
      opener.sessionStorage.removeItem(OAUTH_STATE_KEY);
      if (state) return state;
    } catch {
    }
  }
  return consumeOAuthState();
}

function buildGoogleCalendarAuthUrl(): string | null {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId) {
    console.warn(
      "[oauth] google calendar not configured — set NEXT_PUBLIC_GOOGLE_CLIENT_ID.",
    );
    return null;
  }

  const state = generateState();
  window.sessionStorage.setItem(OAUTH_STATE_KEY, state);

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: getGoogleCalendarRedirectUri(),
    response_type: "code",
    scope: GOOGLE_CALENDAR_SCOPE,
    state,
    access_type: "offline",
    prompt: "consent",
    include_granted_scopes: "true",
  });

  return `${GOOGLE_AUTH_URL}?${params.toString()}`;
}

function generateState(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}