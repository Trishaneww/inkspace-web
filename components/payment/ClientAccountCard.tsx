"use client";

// Next.js
import Image from "next/image";
import { useState } from "react";

// CSS
import styles from "@/styles/pay/PayPage.module.css";

// HTML Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, Loader2 } from "lucide-react";

// Components
import { PayStatus } from "./PayStatus";

// Libs
import { paymentsApi } from "@/lib/api/payments";
import { ApiError } from "@/lib/api/client";
import { splitFullName } from "@/lib/payments";

export const ClientAccountCard = ({
  token,
  email,
  name,
  artist,
}: {
  token: string;
  email: string;
  name: string;
  artist: string;
}) => {
  const [firstName, setFirstName] = useState(() => splitFullName(name).first);
  const [lastName, setLastName] = useState(() => splitFullName(name).last);
  const [password, setPassword] = useState("");
  const [optIn, setOptIn] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (firstName.trim() === "") {
      setError("Please enter your first name.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await paymentsApi.createClientAccount(token, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        password,
        marketingOptIn: optIn,
      });
      setCreated(true);
    } catch (err) {
      setError(
        err instanceof ApiError && err.status === 409
          ? "You already have an account with this email — just log in."
          : "Couldn't create your account. Please try again.",
      );
      setSubmitting(false);
    }
  };

  if (created) {
    return (
      <PayStatus
        icon={<CheckCircle2 size={36} className={styles.iconSuccess} />}
        title="You're all set"
        description={`Your account is ready. Log in anytime with ${email} to manage your bookings.`}
      />
    );
  }

  return (
    <div className={styles.content}>
      <Image
        src="/logos/inkspace-logo.svg"
        alt="Inkspace"
        width={100}
        height={100}
        priority
      />
      <div className={styles.accountHeader}>
        <h1 className={styles.title}>Create your account</h1>
        <p className={styles.description}>
          Your booking is confirmed. Create an account to manage your bookings
          and message {artist} — it only takes a few seconds.
        </p>
      </div>

      <form
        className={styles.accountForm}
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
      >
        <div className={styles.nameRow}>
          <div className={styles.accountField}>
            <Label htmlFor="account-first-name">First name</Label>
            <Input
              id="account-first-name"
              autoComplete="given-name"
              placeholder="First name"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
            />
          </div>
          <div className={styles.accountField}>
            <Label htmlFor="account-last-name">Last name</Label>
            <Input
              id="account-last-name"
              autoComplete="family-name"
              placeholder="Last name"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
            />
          </div>
        </div>

        <div className={styles.accountField}>
          <Label htmlFor="account-email">Email</Label>
          <Input id="account-email" value={email} readOnly />
        </div>

        <div className={styles.accountField}>
          <Label htmlFor="account-password">Password</Label>
          <Input
            id="account-password"
            type="password"
            autoComplete="new-password"
            placeholder="Create a password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <label className={styles.consentRow}>
          <Checkbox
            checked={optIn}
            onCheckedChange={(checked) => setOptIn(checked === true)}
            className="data-checked:border-(--color-primary) data-checked:bg-(--color-primary)"
          />
          <span>Email me about openings, new flash, and offers</span>
        </label>

        {error && <p className={styles.error}>{error}</p>}

        <Button type="submit" disabled={submitting} className={styles.cta}>
          {submitting && <Loader2 size={16} className="animate-spin" />}
          Create account
        </Button>
      </form>
    </div>
  );
};
