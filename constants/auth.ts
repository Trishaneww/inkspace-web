// Libs
import { OAuthProvider } from "@/types/auth";
import { UserRole } from "@/types";

export const VALID_PROVIDERS: OAuthProvider[] = ["google", "microsoft"];
export const GOOGLE_CALENDAR_PROVIDER = "google-calendar";
export const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
export const MICROSOFT_AUTH_URL =
  "https://login.microsoftonline.com/common/oauth2/v2.0/authorize";
export const OAUTH_STATE_KEY = "inkspace_oauth_state";

export const GOOGLE_CALENDAR_SCOPE =
  "openid email https://www.googleapis.com/auth/calendar.events";

export const RESEND_COOLDOWN_SECONDS = 30;

export const ACCESS_TOKEN_KEY = "inkspace_token";
export const REFRESH_TOKEN_KEY = "inkspace_refresh_token";

export const USER_ROLE_OPTIONS = [
  { value: UserRole.Artist, label: "Tattoo Artist" },
  { value: UserRole.StudioAdmin, label: "Studio Admin" },
  { value: UserRole.User, label: "User" },
];
