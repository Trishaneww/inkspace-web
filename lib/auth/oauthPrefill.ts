const KEY = "inkspace_oauth_prefill";

export type OAuthPrefill = {
  oauthSession: string;
  email: string;
  firstName: string;
  lastName: string;
};

export function storeOAuthPrefill(p: OAuthPrefill) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(KEY, JSON.stringify(p));
}

export function consumeOAuthPrefill(): OAuthPrefill | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(KEY);
  if (!raw) return null;
  window.sessionStorage.removeItem(KEY);
  try {
    return JSON.parse(raw) as OAuthPrefill;
  } catch {
    return null;
  }
}
