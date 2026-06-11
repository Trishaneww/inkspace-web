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
  useIsEditing,
} from "./SettingsPrimitives";
import { StudioTravelManager } from "./StudioTravelManager";
import { TattooStylesPicker } from "@/components/common/TattooStylesPicker";

// Hooks
import { useAuth } from "@/lib/auth";
import { useDraftState } from "@/hooks/useDraftState";

// Libs
import { formatPhone } from "@/lib/formatters";
import {
  areStyleArraysEqual,
  getChangedFields,
  hasUnsavedChanges,
} from "@/lib/settings";
import { TATTOO_STYLE_LABELS } from "@/constants/tattooStyles";
import { displayToast } from "@/lib/toast";
import type { ArtistSettingsController } from "@/hooks/useArtistSettings";
import type { Location, SettingsAccount } from "@/types/settings";

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
  Location,
  "label" | "address" | "city" | "province" | "postalCode" | "country"
>;

const STUDIO_KEYS: (keyof StudioDraft)[] = [
  "label",
  "address",
  "city",
  "province",
  "postalCode",
  "country",
];

export const PersonalInfoTab = ({
  controller,
}: {
  controller: ArtistSettingsController;
}) => {
  const { data, saveProfile, saveSettings, saveLocation } = controller;
  const account = data?.account;
  const settings = data?.settings;
  const primary = data?.locations.find((location) => location.isPrimary);

  const profile = useDraftState<ProfileDraft>({
    firstName: account?.firstName ?? "",
    lastName: account?.lastName ?? "",
    username: account?.username ?? "",
    phone: account?.phone ?? "",
    instagramUrl: account?.instagramUrl ?? "",
  });
  const studio = useDraftState<StudioDraft>({
    label: primary?.label ?? "",
    address: primary?.address ?? "",
    city: primary?.city ?? "",
    province: primary?.province ?? "",
    postalCode: primary?.postalCode ?? "",
    country: primary?.country ?? "",
  });
  const stylesDraft = useDraftState<{ styles: string[] }>({
    styles: settings?.styles ?? [],
  });

  if (!account || !settings || !primary) return null;

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
        title="Home studio"
        description="Your permanent base. Shown to clients on your booking page so they can find you."
        onSubmit={() =>
          saveLocation(
            primary.id,
            getChangedFields(primary, studio.draft, STUDIO_KEYS),
          )
        }
        successToast="Studio updated"
        errorToast="Couldn't save studio details"
        onCancel={studio.reset}
        disableSubmit={!hasUnsavedChanges(primary, studio.draft, STUDIO_KEYS)}
      >
        <CardGrid>
          <CardField label="Studio name" value={primary.label} full>
            <Input
              value={studio.draft.label}
              placeholder="e.g. Ink & Co."
              onChange={(e) => studio.update({ label: e.target.value })}
            />
          </CardField>
          <CardField label="Street address" value={primary.address} full>
            <Input
              value={studio.draft.address}
              placeholder="123 Main St, Unit 4"
              onChange={(e) => studio.update({ address: e.target.value })}
            />
          </CardField>
          <CardField label="City" value={primary.city}>
            <Input
              value={studio.draft.city}
              placeholder="City"
              onChange={(e) => studio.update({ city: e.target.value })}
            />
          </CardField>
          <CardField label="Province / State" value={primary.province}>
            <Input
              value={studio.draft.province}
              placeholder="Province or state"
              onChange={(e) => studio.update({ province: e.target.value })}
            />
          </CardField>
          <CardField label="Postal / ZIP code" value={primary.postalCode}>
            <Input
              value={studio.draft.postalCode}
              placeholder="A1A 1A1"
              onChange={(e) => studio.update({ postalCode: e.target.value })}
            />
          </CardField>
          <CardField label="Country" value={primary.country}>
            <Input
              value={studio.draft.country}
              placeholder="Country"
              onChange={(e) => studio.update({ country: e.target.value })}
            />
          </CardField>
        </CardGrid>
      </EditableCard>

      <StudioTravelManager controller={controller} />

      <EditableCard
        title="Styles"
        description="The styles you specialize in. Clients booking a custom piece can only choose from these."
        onSubmit={() => saveSettings({ styles: stylesDraft.draft.styles })}
        successToast="Styles updated"
        errorToast="Couldn't save styles"
        onCancel={stylesDraft.reset}
        disableSubmit={
          stylesDraft.draft.styles.length === 0 ||
          areStyleArraysEqual(settings.styles ?? [], stylesDraft.draft.styles)
        }
      >
        <StylesField
          selected={stylesDraft.draft.styles}
          onChange={(next) => stylesDraft.update({ styles: next })}
        />
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

const StylesField = ({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (next: string[]) => void;
}) => {
  const isEditing = useIsEditing();

  if (isEditing) {
    return (
      <>
        <TattooStylesPicker value={selected} onChange={onChange} />
        {selected.length === 0 && (
          <span className={styles.fieldError}>
            Select at least one style so clients can book with you.
          </span>
        )}
      </>
    );
  }

  return (
    <span className={styles.fieldValue}>
      {selected.length
        ? selected.map((slug) => TATTOO_STYLE_LABELS[slug] ?? slug).join(", ")
        : "—"}
    </span>
  );
};
