// CSS
import clsx from "clsx";
import styles from "@/styles/dashboard/artist/settings/Settings.module.css";

// HTML Components
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface ConnectionCardProps {
  logo: React.ReactNode;
  title: string;
  /** Shown when not connected. */
  subtitle: string;
  connected: boolean;
  /** Shown next to the connected badge (e.g. the linked account/email). */
  connectedDetail?: string;
  connectLabel: string;
  onConnect: () => void;
  onDisconnect?: () => void;
}

export const ConnectionCard = ({
  logo,
  title,
  subtitle,
  connected,
  connectedDetail,
  connectLabel,
  onConnect,
  onDisconnect,
}: ConnectionCardProps) => {
  return (
    <div>
      <div className={styles.connectionCard}>
        <div className={styles.connectionLeft}>
          <div className={styles.connectionLogo}>{logo}</div>
          <div className={styles.connectionText}>
            <span className={styles.connectionTitle}>{title}</span>
            <span className={styles.connectionSubtitle}>
              {connected ? (connectedDetail ?? "Connected") : subtitle}
            </span>
          </div>
        </div>

        {connected ? (
          <div className={styles.connectionLeft}>
            <span className={clsx(styles.statusBadge, styles.statusConnected)}>
              <CheckCircle2 size={13} />
              Connected
            </span>
            {onDisconnect && (
              <Button
                variant="outline"
                className={styles.disconnectButton}
                onClick={onDisconnect}
              >
                Disconnect
              </Button>
            )}
          </div>
        ) : (
          <Button
            variant="outline"
            className={styles.connectButton}
            onClick={onConnect}
          >
            {connectLabel}
          </Button>
        )}
      </div>
    </div>
  );
};
