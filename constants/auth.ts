// Libs
import { UserRole } from "@/types";

export const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
export const MICROSOFT_AUTH_URL =
  "https://login.microsoftonline.com/common/oauth2/v2.0/authorize";
export const OAUTH_STATE_KEY = "inkspace_oauth_state";

export const RESEND_COOLDOWN_SECONDS = 30;

export const ACCESS_TOKEN_KEY = "inkspace_token";
export const REFRESH_TOKEN_KEY = "inkspace_refresh_token";

export const USER_ROLE_OPTIONS = [
  { value: UserRole.Artist, label: "Tattoo artist" },
  { value: UserRole.StudioAdmin, label: "Studio admin" },
  { value: UserRole.User, label: "User" },
];
