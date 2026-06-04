"use client";

// Next.js
import { useState } from "react";

// CSS
import clsx from "clsx";
import styles from "@/styles/dashboard/artist/settings/Settings.module.css";

// HTML Components
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Components
import { EditableCard, CardGrid, useIsEditing } from "./SettingsPrimitives";

// Libs
import type { ArtistSettingsController } from "@/hooks/useArtistSettings";

export const EmailPasswordTab = ({
  controller,
}: {
  controller: ArtistSettingsController;
}) => {
  const { data, changeEmail, changePassword } = controller;
  if (!data) return null;

  return (
    <>
      <ChangeEmailCard
        currentEmail={data.account.email}
        onSubmit={changeEmail}
      />
      <ChangePasswordCard onSubmit={changePassword} />
    </>
  );
};

const ChangeEmailCard = ({
  currentEmail,
  onSubmit,
}: {
  currentEmail: string;
  onSubmit: ArtistSettingsController["changeEmail"];
}) => {
  const [newEmail, setNewEmail] = useState("");

  const reset = () => setNewEmail("");

  const handleSubmit = async () => {
    if (!newEmail.trim()) {
      throw new Error("Enter your new email.");
    }
    await onSubmit({ newEmail: newEmail.trim() });
    reset();
  };

  return (
    <EditableCard
      title="Email address"
      onSubmit={handleSubmit}
      successToast="Email updated"
      errorToast="Couldn't update email"
      onCancel={reset}
      disableSubmit={!newEmail.trim()}
    >
      <EmailFields
        currentEmail={currentEmail}
        newEmail={newEmail}
        onNewEmail={setNewEmail}
      />
    </EditableCard>
  );
};

const EmailFields = ({
  currentEmail,
  newEmail,
  onNewEmail,
}: {
  currentEmail: string;
  newEmail: string;
  onNewEmail: (value: string) => void;
}) => {
  const isEditing = useIsEditing();

  if (!isEditing) {
    return (
      <CardGrid>
        <ReadField label="Email address" value={currentEmail} />
      </CardGrid>
    );
  }

  return (
    <CardGrid>
      <EditField id="new-email" label="New email">
        <Input
          id="new-email"
          type="email"
          value={newEmail}
          placeholder="you@example.com"
          onChange={(e) => onNewEmail(e.target.value)}
        />
      </EditField>
    </CardGrid>
  );
};

const ChangePasswordCard = ({
  onSubmit,
}: {
  onSubmit: ArtistSettingsController["changePassword"];
}) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const reset = () => {
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = async () => {
    if (newPassword.length < 8) {
      throw new Error("New password must be at least 8 characters.");
    }
    if (newPassword !== confirmPassword) {
      throw new Error("New passwords do not match.");
    }
    await onSubmit({ newPassword });
    reset();
  };

  return (
    <EditableCard
      title="Password"
      onSubmit={handleSubmit}
      successToast="Password updated"
      errorToast="Couldn't update password"
      onCancel={reset}
      disableSubmit={!newPassword || !confirmPassword}
    >
      <PasswordFields
        newPassword={newPassword}
        confirmPassword={confirmPassword}
        onNewPassword={setNewPassword}
        onConfirmPassword={setConfirmPassword}
      />
    </EditableCard>
  );
};

const PasswordFields = ({
  newPassword,
  confirmPassword,
  onNewPassword,
  onConfirmPassword,
}: {
  newPassword: string;
  confirmPassword: string;
  onNewPassword: (value: string) => void;
  onConfirmPassword: (value: string) => void;
}) => {
  const isEditing = useIsEditing();

  if (!isEditing) {
    return (
      <CardGrid>
        <ReadField label="Password" value="••••••••" />
      </CardGrid>
    );
  }

  return (
    <CardGrid>
      <EditField id="new-password" label="New password">
        <Input
          id="new-password"
          type="password"
          value={newPassword}
          placeholder="At least 8 characters"
          onChange={(e) => onNewPassword(e.target.value)}
        />
      </EditField>
      <EditField id="confirm-password" label="Confirm new password">
        <Input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          placeholder="Re-enter new password"
          onChange={(e) => onConfirmPassword(e.target.value)}
        />
      </EditField>
    </CardGrid>
  );
};

const ReadField = ({ label, value }: { label: string; value: string }) => (
  <div className={styles.gridField}>
    <span className={styles.fieldLabel}>{label}</span>
    <span className={styles.fieldValue}>{value}</span>
  </div>
);

const EditField = ({
  id,
  label,
  children,
  full,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) => (
  <div
    className={
      full ? clsx(styles.gridField, styles.gridFieldFull) : styles.gridField
    }
  >
    <Label htmlFor={id}>{label}</Label>
    {children}
  </div>
);
