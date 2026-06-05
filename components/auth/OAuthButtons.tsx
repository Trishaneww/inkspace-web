"use client";

// CSS
import styles from "@/styles/auth/Auth.module.css";

// HTML Components
import { Button } from "@/components/ui/button";
import GoogleLogo from "@/public/logos/google-logo.svg";
import MicrosoftLogo from "@/public/logos/microsoft-logo.svg";

// Libs
import { isProviderConfigured, startOAuthFlow } from "@/lib/auth";
import { OAuthProvider } from "@/types/auth";

interface OAuthButtonsProps {
  onUnconfigured?: (provider: OAuthProvider) => void;
}

export const OAuthButtons = ({ onUnconfigured }: OAuthButtonsProps) => {
  const handleClick = (provider: OAuthProvider) => () => {
    const ok = startOAuthFlow(provider);
    if (!ok) onUnconfigured?.(provider);
  };

  return (
    <div className={styles.oauthContainer}>
      <Button
        type="button"
        variant="outline"
        className={styles.oauthButton}
        onClick={handleClick("google")}
        title={
          isProviderConfigured("google")
            ? undefined
            : "Google OAuth not configured"
        }
      >
        <GoogleLogo className={styles.oauthIcon} />
        Google
      </Button>

      <Button
        type="button"
        variant="outline"
        className={styles.oauthButton}
        onClick={handleClick("microsoft")}
        title={
          isProviderConfigured("microsoft")
            ? undefined
            : "Microsoft OAuth not configured"
        }
      >
        <MicrosoftLogo className={styles.oauthIcon} />
        Microsoft
      </Button>
    </div>
  );
};
