"use client";

// Next.js
import { useCallback, useEffect, useRef, useState } from "react";

// Libs
import {
  settingsApi,
  uploadAvatar as uploadAvatarFile,
  uploadWaiver as uploadWaiverFile,
} from "@/lib/api/settings";
import { useAuth } from "@/lib/auth";
import { displayToast } from "@/lib/toast";
import type {
  ArtistSettings,
  AvailabilityWindowInput,
  ChangeEmailPayload,
  ChangePasswordPayload,
  CreateBlocklistPayload,
  CreateLocationPayload,
  CreatePresetPayload,
  SettingsResponse,
  StripeConnectResponse,
  UpdateLocationPayload,
  UpdatePresetPayload,
  UpdateProfilePayload,
  UpdateSettingsPayload,
} from "@/types/settings";

export interface ArtistSettingsController {
  data: SettingsResponse | null;
  isLoading: boolean;
  loadError: string | null;

  saveProfile: (patch: UpdateProfilePayload) => Promise<void>;
  uploadAvatar: (file: File) => Promise<void>;
  changeEmail: (payload: ChangeEmailPayload) => Promise<void>;
  changePassword: (payload: ChangePasswordPayload) => Promise<void>;
  saveSettings: (patch: UpdateSettingsPayload) => Promise<void>;
  uploadWaiver: (file: File) => Promise<void>;
  saveAvailability: (windows: AvailabilityWindowInput[]) => Promise<void>;

  saveLocation: (id: string, payload: UpdateLocationPayload) => Promise<void>;
  addLocation: (payload: CreateLocationPayload) => Promise<void>;
  removeLocation: (id: string) => Promise<void>;
  setCurrentLocation: (id: string) => Promise<void>;
  connectStripe: () => Promise<StripeConnectResponse>;
  refreshStripeStatus: () => Promise<void>;
  disconnectStripe: () => Promise<void>;
  disconnectGoogleCalendar: () => Promise<void>;

  addPreset: (payload: CreatePresetPayload) => Promise<void>;
  updatePreset: (id: string, payload: UpdatePresetPayload) => Promise<void>;
  deletePreset: (id: string) => Promise<void>;
  addDayOff: (day: string) => Promise<void>;
  removeDayOff: (day: string) => Promise<void>;
  addBlocklistEntry: (payload: CreateBlocklistPayload) => Promise<void>;
  removeBlocklistEntry: (id: string) => Promise<void>;
}

export function useArtistSettings(): ArtistSettingsController {
  const { token } = useAuth();

  const [data, setData] = useState<SettingsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const lastFetchKey = useRef<string | null>(null);

  useEffect(() => {
    if (!token) return;
    if (lastFetchKey.current === token) return;
    lastFetchKey.current = token;

    setIsLoading(true);
    setLoadError(null);
    settingsApi
      .get(token)
      .then((res) => setData(res))
      .catch((err) =>
        setLoadError(buildErrorMessage(err, "Failed to load settings")),
      )
      .finally(() => setIsLoading(false));
  }, [token]);

  const applySettings = useCallback((settings: ArtistSettings) => {
    setData((d) => (d ? { ...d, settings } : d));
  }, []);

  const saveProfile = useCallback<ArtistSettingsController["saveProfile"]>(
    async (patch) => {
      const account = await settingsApi.updateProfile(token!, patch);
      setData((d) => (d ? { ...d, account } : d));
    },
    [token],
  );

  const uploadAvatar = useCallback<ArtistSettingsController["uploadAvatar"]>(
    async (file) => {
      const key = await uploadAvatarFile(token!, file);
      const account = await settingsApi.updateProfile(token!, {
        avatarUrl: key,
      });
      setData((d) => (d ? { ...d, account } : d));
    },
    [token],
  );

  const changeEmail = useCallback<ArtistSettingsController["changeEmail"]>(
    async (payload) => {
      const account = await settingsApi.changeEmail(token!, payload);
      setData((d) => (d ? { ...d, account } : d));
    },
    [token],
  );

  const changePassword = useCallback<
    ArtistSettingsController["changePassword"]
  >(
    async (payload) => {
      await settingsApi.changePassword(token!, payload);
    },
    [token],
  );

  const saveSettings = useCallback<ArtistSettingsController["saveSettings"]>(
    async (patch) => {
      const settings = await settingsApi.updateSettings(token!, patch);
      applySettings(settings);
    },
    [token, applySettings],
  );

  const uploadWaiver = useCallback<ArtistSettingsController["uploadWaiver"]>(
    async (file) => {
      const key = await uploadWaiverFile(token!, file);
      const settings = await settingsApi.updateSettings(token!, {
        waiverFileUrl: key,
      });
      applySettings(settings);
    },
    [token, applySettings],
  );

  const saveAvailability = useCallback<
    ArtistSettingsController["saveAvailability"]
  >(
    async (windows) => {
      const res = await settingsApi.setAvailability(token!, windows);
      setData((d) => (d ? { ...d, availability: res.windows } : d));
    },
    [token],
  );

  const saveLocation = useCallback<ArtistSettingsController["saveLocation"]>(
    async (id, payload) => {
      const location = await settingsApi.updateLocation(token!, id, payload);
      setData((d) =>
        d
          ? {
              ...d,
              locations: d.locations.map((l) => (l.id === id ? location : l)),
            }
          : d,
      );
    },
    [token],
  );

  const connectStripe = useCallback<
    ArtistSettingsController["connectStripe"]
  >(() => settingsApi.connectStripe(token!), [token]);

  const refreshStripeStatus = useCallback<
    ArtistSettingsController["refreshStripeStatus"]
  >(async () => {
    const settings = await settingsApi.refreshStripe(token!);
    applySettings(settings);
  }, [token, applySettings]);

  const disconnectStripe = useCallback<
    ArtistSettingsController["disconnectStripe"]
  >(async () => {
    const settings = await settingsApi.disconnectStripe(token!);
    applySettings(settings);
  }, [token, applySettings]);

  const disconnectGoogleCalendar = useCallback<
    ArtistSettingsController["disconnectGoogleCalendar"]
  >(async () => {
    const settings = await settingsApi.disconnectGoogleCalendar(token!);
    applySettings(settings);
  }, [token, applySettings]);

  const executeWithFeedback = useCallback(
    async (run: () => Promise<void>, successMessage: string) => {
      try {
        await run();
        displayToast(successMessage, "success");
      } catch (err) {
        displayToast(buildErrorMessage(err, "Something went wrong"), "error");
      }
    },
    [],
  );

  const addLocation = useCallback<ArtistSettingsController["addLocation"]>(
    (payload) =>
      executeWithFeedback(async () => {
        const location = await settingsApi.createLocation(token!, payload);
        setData((d) =>
          d ? { ...d, locations: [...d.locations, location] } : d,
        );
      }, "Guest spot added"),
    [executeWithFeedback, token],
  );

  const removeLocation = useCallback<
    ArtistSettingsController["removeLocation"]
  >(
    (id) =>
      executeWithFeedback(async () => {
        await settingsApi.deleteLocation(token!, id);
        setData((d) =>
          d ? { ...d, locations: d.locations.filter((l) => l.id !== id) } : d,
        );
      }, "Guest spot removed"),
    [executeWithFeedback, token],
  );

  const setCurrentLocation = useCallback<
    ArtistSettingsController["setCurrentLocation"]
  >(
    (id) =>
      executeWithFeedback(async () => {
        await settingsApi.setCurrentLocation(token!, id);
        setData((d) =>
          d ? { ...d, settings: { ...d.settings, currentLocationId: id } } : d,
        );
      }, "Working location updated"),
    [executeWithFeedback, token],
  );

  const addPreset = useCallback<ArtistSettingsController["addPreset"]>(
    (payload) =>
      executeWithFeedback(async () => {
        const preset = await settingsApi.createPreset(token!, payload);
        setData((d) =>
          d ? { ...d, sessionPresets: [...d.sessionPresets, preset] } : d,
        );
      }, "Session preset added"),
    [executeWithFeedback, token],
  );

  const updatePreset = useCallback<ArtistSettingsController["updatePreset"]>(
    (id, payload) =>
      executeWithFeedback(async () => {
        const preset = await settingsApi.updatePreset(token!, id, payload);
        setData((d) =>
          d
            ? {
                ...d,
                sessionPresets: d.sessionPresets.map((p) =>
                  p.id === id ? preset : p,
                ),
              }
            : d,
        );
      }, "Session preset updated"),
    [executeWithFeedback, token],
  );

  const deletePreset = useCallback<ArtistSettingsController["deletePreset"]>(
    (id) =>
      executeWithFeedback(async () => {
        await settingsApi.deletePreset(token!, id);
        setData((d) =>
          d
            ? {
                ...d,
                sessionPresets: d.sessionPresets.filter((p) => p.id !== id),
              }
            : d,
        );
      }, "Session preset removed"),
    [executeWithFeedback, token],
  );

  const addDayOff = useCallback<ArtistSettingsController["addDayOff"]>(
    (day) =>
      executeWithFeedback(async () => {
        await settingsApi.addDayOff(token!, day);
        setData((d) =>
          d && !d.daysOff.includes(day)
            ? { ...d, daysOff: [...d.daysOff, day].sort() }
            : d,
        );
      }, "Date blocked"),
    [executeWithFeedback, token],
  );

  const removeDayOff = useCallback<ArtistSettingsController["removeDayOff"]>(
    (day) =>
      executeWithFeedback(async () => {
        await settingsApi.removeDayOff(token!, day);
        setData((d) =>
          d ? { ...d, daysOff: d.daysOff.filter((x) => x !== day) } : d,
        );
      }, "Date unblocked"),
    [executeWithFeedback, token],
  );

  const addBlocklistEntry = useCallback<
    ArtistSettingsController["addBlocklistEntry"]
  >(
    (payload) =>
      executeWithFeedback(async () => {
        const entry = await settingsApi.addBlocklistEntry(token!, payload);
        setData((d) => (d ? { ...d, blocklist: [entry, ...d.blocklist] } : d));
      }, "Added to blocklist"),
    [executeWithFeedback, token],
  );

  const removeBlocklistEntry = useCallback<
    ArtistSettingsController["removeBlocklistEntry"]
  >(
    (id) =>
      executeWithFeedback(async () => {
        await settingsApi.removeBlocklistEntry(token!, id);
        setData((d) =>
          d ? { ...d, blocklist: d.blocklist.filter((b) => b.id !== id) } : d,
        );
      }, "Removed from blocklist"),
    [executeWithFeedback, token],
  );

  return {
    data,
    isLoading,
    loadError,
    saveProfile,
    uploadAvatar,
    changeEmail,
    changePassword,
    saveSettings,
    uploadWaiver,
    saveAvailability,
    saveLocation,
    addLocation,
    removeLocation,
    setCurrentLocation,
    connectStripe,
    refreshStripeStatus,
    disconnectStripe,
    disconnectGoogleCalendar,
    addPreset,
    updatePreset,
    deletePreset,
    addDayOff,
    removeDayOff,
    addBlocklistEntry,
    removeBlocklistEntry,
  };
}

function buildErrorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback;
}
