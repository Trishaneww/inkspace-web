// Libs
import { api } from "@/lib/api/client";
import type {
  ArtistSettings,
  AvailabilityWindow,
  AvailabilityWindowInput,
  BlocklistEntry,
  ChangeEmailPayload,
  ChangePasswordPayload,
  ConnectGoogleCalendarPayload,
  CreateBlocklistPayload,
  CreateLocationPayload,
  CreatePresetPayload,
  Location,
  PresignUploadResponse,
  SessionPreset,
  SettingsAccount,
  SettingsResponse,
  StripeConnectResponse,
  UpdateLocationPayload,
  UpdatePresetPayload,
  UpdateProfilePayload,
  UpdateSettingsPayload,
} from "@/types/settings";

const BASE = "/v1/current-user";

export const settingsApi = {
  get(token: string) {
    return api.get<SettingsResponse>(`${BASE}/settings`, token);
  },

  updateProfile(token: string, payload: UpdateProfilePayload) {
    return api.patch<SettingsAccount>(`${BASE}/profile`, payload, token);
  },

  changeEmail(token: string, payload: ChangeEmailPayload) {
    return api.post<SettingsAccount>(`${BASE}/email`, payload, token);
  },

  changePassword(token: string, payload: ChangePasswordPayload) {
    return api.post<void>(`${BASE}/password`, payload, token);
  },

  // Artist business config
  updateSettings(token: string, payload: UpdateSettingsPayload) {
    return api.patch<ArtistSettings>(`${BASE}/settings`, payload, token);
  },

  setAvailability(token: string, windows: AvailabilityWindowInput[]) {
    return api.put<{ windows: AvailabilityWindow[] }>(
      `${BASE}/settings/availability`,
      { windows },
      token,
    );
  },

  createLocation(token: string, payload: CreateLocationPayload) {
    return api.post<Location>(`${BASE}/settings/locations`, payload, token);
  },
  updateLocation(token: string, id: string, payload: UpdateLocationPayload) {
    return api.patch<Location>(
      `${BASE}/settings/locations/${id}`,
      payload,
      token,
    );
  },
  deleteLocation(token: string, id: string) {
    return api.delete<void>(`${BASE}/settings/locations/${id}`, token);
  },
  setCurrentLocation(token: string, locationId: string) {
    return api.post<void>(
      `${BASE}/settings/locations/current`,
      { locationId },
      token,
    );
  },

  createPreset(token: string, payload: CreatePresetPayload) {
    return api.post<SessionPreset>(
      `${BASE}/settings/session-presets`,
      payload,
      token,
    );
  },

  updatePreset(token: string, presetId: string, payload: UpdatePresetPayload) {
    return api.patch<SessionPreset>(
      `${BASE}/settings/session-presets/${presetId}`,
      payload,
      token,
    );
  },

  deletePreset(token: string, presetId: string) {
    return api.delete<void>(
      `${BASE}/settings/session-presets/${presetId}`,
      token,
    );
  },

  addDayOff(token: string, day: string) {
    return api.post<void>(`${BASE}/settings/days-off`, { day }, token);
  },

  removeDayOff(token: string, day: string) {
    return api.delete<void>(`${BASE}/settings/days-off/${day}`, token);
  },

  addBlocklistEntry(token: string, payload: CreateBlocklistPayload) {
    return api.post<BlocklistEntry>(
      `${BASE}/settings/blocklist`,
      payload,
      token,
    );
  },

  removeBlocklistEntry(token: string, entryId: string) {
    return api.delete<void>(`${BASE}/settings/blocklist/${entryId}`, token);
  },

  presignAvatar(token: string, contentType: string) {
    return api.post<PresignUploadResponse>(
      `${BASE}/avatar/presign`,
      { contentType },
      token,
    );
  },

  presignWaiver(token: string, contentType: string) {
    return api.post<PresignUploadResponse>(
      `${BASE}/settings/waiver/presign`,
      { contentType },
      token,
    );
  },

  presignOpenBookBackground(token: string, contentType: string) {
    return api.post<PresignUploadResponse>(
      `${BASE}/open-book/background/presign`,
      { contentType },
      token,
    );
  },

  connectStripe(token: string) {
    return api.post<StripeConnectResponse>(
      `${BASE}/settings/stripe/connect`,
      {},
      token,
    );
  },

  refreshStripe(token: string) {
    return api.post<ArtistSettings>(
      `${BASE}/settings/stripe/refresh`,
      {},
      token,
    );
  },

  disconnectStripe(token: string) {
    return api.delete<ArtistSettings>(`${BASE}/settings/stripe`, token);
  },

  connectGoogleCalendar(token: string, payload: ConnectGoogleCalendarPayload) {
    return api.post<ArtistSettings>(
      `${BASE}/settings/google-calendar/connect`,
      payload,
      token,
    );
  },

  disconnectGoogleCalendar(token: string) {
    return api.delete<ArtistSettings>(
      `${BASE}/settings/google-calendar`,
      token,
    );
  },

  deleteAccount(token: string) {
    return api.delete<void>(`${BASE}/account`, token);
  },
};

async function uploadToS3(
  presign: PresignUploadResponse,
  file: File,
): Promise<string> {
  const putResponse = await fetch(presign.url, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });
  if (!putResponse.ok) {
    throw new Error(`Failed to upload file (status ${putResponse.status})`);
  }
  return presign.s3Key;
}

export async function uploadAvatar(token: string, file: File): Promise<string> {
  const presign = await settingsApi.presignAvatar(token, file.type);
  return uploadToS3(presign, file);
}

export async function uploadOpenBookBackground(
  token: string,
  file: File,
): Promise<string> {
  const presign = await settingsApi.presignOpenBookBackground(token, file.type);
  return uploadToS3(presign, file);
}

export async function uploadWaiver(token: string, file: File): Promise<string> {
  const presign = await settingsApi.presignWaiver(token, file.type);
  return uploadToS3(presign, file);
}
