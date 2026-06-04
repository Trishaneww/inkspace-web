"use client";

// Next.js
import { useRef, type ChangeEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// CSS
import styles from "@/styles/dashboard/artist/settings/Settings.module.css";

// HTML Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogOut, Upload } from "lucide-react";

// Components
import {
  EditableCard,
  StaticCard,
  CardGrid,
  CardField,
} from "./SettingsPrimitives";

// Hooks
import { useAuth } from "@/lib/auth";
import { useDraftState } from "@/hooks/useDraftState";

// Libs
import { formatPhone } from "@/lib/formatters";
import { getChangedFields, hasUnsavedChanges } from "@/lib/settings";
import { displayToast } from "@/lib/toast";
import type { ArtistSettingsController } from "@/hooks/useArtistSettings";
import type { ArtistSettings, SettingsAccount } from "@/types/settings";

type ProfileDraft = Pick<
  SettingsAccount,
  "firstName" | "lastName" | "username" | "phone" | "instagramUrl"
>;

const PROFILE_KEYS: (keyof ProfileDraft)[] = [
  "firstName",
  "lastName",
  "username",
  "phone",
  "instagramUrl",
];

type StudioDraft = Pick<
  ArtistSettings,
  | "studioName"
  | "studioAddress"
  | "studioCity"
  | "studioProvince"
  | "studioPostalCode"
  | "studioCountry"
>;

const STUDIO_KEYS: (keyof StudioDraft)[] = [
  "studioName",
  "studioAddress",
  "studioCity",
  "studioProvince",
  "studioPostalCode",
  "studioCountry",
];

export const PersonalInfoTab = ({
  controller,
}: {
  controller: ArtistSettingsController;
}) => {
  const { data, saveProfile, saveSettings } = controller;
  const account = data?.account;
  const settings = data?.settings;

  const profile = useDraftState<ProfileDraft>({
    firstName: account?.firstName ?? "",
    lastName: account?.lastName ?? "",
    username: account?.username ?? "",
    phone: account?.phone ?? "",
    instagramUrl: account?.instagramUrl ?? "",
  });
  const studio = useDraftState<StudioDraft>({
    studioName: settings?.studioName ?? "",
    studioAddress: settings?.studioAddress ?? "",
    studioCity: settings?.studioCity ?? "",
    studioProvince: settings?.studioProvince ?? "",
    studioPostalCode: settings?.studioPostalCode ?? "",
    studioCountry: settings?.studioCountry ?? "",
  });

  if (!account || !settings) return null;

  return (
    <>
      <StaticCard
        title="Profile photo"
        description="This appears on your booking page and in messages with clients. Uploads save immediately."
      >
        <AvatarUpload account={account} controller={controller} />
      </StaticCard>

      <EditableCard
        title="Profile"
        onSubmit={() =>
          saveProfile(getChangedFields(account, profile.draft, PROFILE_KEYS))
        }
        successToast="Profile updated"
        errorToast="Couldn't save profile"
        onCancel={profile.reset}
        disableSubmit={!hasUnsavedChanges(account, profile.draft, PROFILE_KEYS)}
      >
        <CardGrid>
          <CardField label="First name" value={account.firstName}>
            <Input
              value={profile.draft.firstName}
              placeholder="First name"
              onChange={(e) => profile.update({ firstName: e.target.value })}
            />
          </CardField>
          <CardField label="Last name" value={account.lastName}>
            <Input
              value={profile.draft.lastName}
              placeholder="Last name"
              onChange={(e) => profile.update({ lastName: e.target.value })}
            />
          </CardField>
          <CardField label="Username" value={account.username}>
            <Input
              value={profile.draft.username}
              placeholder="username"
              onChange={(e) => profile.update({ username: e.target.value })}
            />
          </CardField>
          <CardField label="Phone number" value={account.phone}>
            <Input
              type="tel"
              value={profile.draft.phone}
              placeholder="+1 (416) 123-4567"
              onChange={(e) =>
                profile.update({ phone: formatPhone(e.target.value) })
              }
            />
          </CardField>
          <CardField label="Instagram" value={account.instagramUrl} full>
            <Input
              value={profile.draft.instagramUrl}
              placeholder="https://instagram.com/yourhandle"
              onChange={(e) => profile.update({ instagramUrl: e.target.value })}
            />
          </CardField>
        </CardGrid>
      </EditableCard>

      <EditableCard
        title="Studio"
        description="Where you currently work out of. Shown to clients on your booking page so they can find you."
        onSubmit={() =>
          saveSettings(getChangedFields(settings, studio.draft, STUDIO_KEYS))
        }
        successToast="Studio updated"
        errorToast="Couldn't save studio details"
        onCancel={studio.reset}
        disableSubmit={!hasUnsavedChanges(settings, studio.draft, STUDIO_KEYS)}
      >
        <CardGrid>
          <CardField label="Studio name" value={settings.studioName} full>
            <Input
              value={studio.draft.studioName}
              placeholder="e.g. Ink & Co."
              onChange={(e) => studio.update({ studioName: e.target.value })}
            />
          </CardField>
          <CardField label="Street address" value={settings.studioAddress} full>
            <Input
              value={studio.draft.studioAddress}
              placeholder="123 Main St, Unit 4"
              onChange={(e) => studio.update({ studioAddress: e.target.value })}
            />
          </CardField>
          <CardField label="City" value={settings.studioCity}>
            <Input
              value={studio.draft.studioCity}
              placeholder="City"
              onChange={(e) => studio.update({ studioCity: e.target.value })}
            />
          </CardField>
          <CardField label="Province / State" value={settings.studioProvince}>
            <Input
              value={studio.draft.studioProvince}
              placeholder="Province or state"
              onChange={(e) =>
                studio.update({ studioProvince: e.target.value })
              }
            />
          </CardField>
          <CardField
            label="Postal / ZIP code"
            value={settings.studioPostalCode}
          >
            <Input
              value={studio.draft.studioPostalCode}
              placeholder="A1A 1A1"
              onChange={(e) =>
                studio.update({ studioPostalCode: e.target.value })
              }
            />
          </CardField>
          <CardField label="Country" value={settings.studioCountry}>
            <Input
              value={studio.draft.studioCountry}
              placeholder="Country"
              onChange={(e) => studio.update({ studioCountry: e.target.value })}
            />
          </CardField>
        </CardGrid>
      </EditableCard>

      <AccountCard />
    </>
  );
};

const AvatarUpload = ({
  account,
  controller,
}: {
  account: SettingsAccount;
  controller: ArtistSettingsController;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const initial =
    account.firstName.charAt(0).toUpperCase() ||
    account.email.charAt(0).toUpperCase();

  const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      await controller.uploadAvatar(file);
      displayToast("Profile photo updated", "success");
    } catch (err) {
      displayToast(
        err instanceof Error ? err.message : "Couldn't upload photo",
        "error",
      );
    }
  };

  return (
    <div className={styles.avatarRow}>
      <div className={styles.avatarPreview}>
        {account.avatarUrl ? (
          <Image
            src={account.avatarUrl}
            alt="Profile"
            fill
            unoptimized
            className={styles.avatarImage}
          />
        ) : (
          <span aria-hidden>{initial}</span>
        )}
      </div>
      <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
        <Upload size={15} />
        Upload
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className={styles.hiddenFileInput}
        onChange={handleAvatarChange}
      />
    </div>
  );
};

const AccountCard = () => {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  return (
    <StaticCard title="Account">
      <div className={styles.cardRow}>
        <div className={styles.rowText}>
          <span className={styles.rowLabel}>Log out</span>
          <span className={styles.rowDescription}>
            Sign out of Inkspace on this device.
          </span>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut size={15} />
          Log out
        </Button>
      </div>

      <div className={styles.deleteAccountContainer}>
        <div className={styles.deleteAccountText}>
          <span className={styles.deleteAccountTitle}>Delete account</span>
          <span className={styles.deleteAccountDescription}>
            Permanently delete your account and all associated data.
          </span>
        </div>
        <Button
          variant="destructive"
          onClick={() =>
            displayToast(
              "Account deletion is coming soon.",
              "info",
              "This will be available in a future update.",
            )
          }
        >
          Delete account
        </Button>
      </div>
    </StaticCard>
  );
};
