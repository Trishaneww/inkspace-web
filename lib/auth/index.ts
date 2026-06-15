export { AuthProvider, useAuth } from "@/lib/auth/context";
export { postAuthRedirect } from "@/lib/auth/redirect";
export {
  startOAuthFlow,
  consumeOAuthState,
  getRedirectUri,
  isProviderConfigured,
  startGoogleCalendarFlow,
  openGoogleCalendarPopup,
  getGoogleCalendarRedirectUri,
  isGoogleCalendarConfigured,
} from "@/lib/auth/oauth";
export {
  storeOAuthPrefill,
  consumeOAuthPrefill,
  type OAuthPrefill,
} from "@/lib/auth/oauthPrefill";
