"use client";

// Next.js
import { useState } from "react";

// CSS
import clsx from "clsx";
import styles from "@/styles/dashboard/artist/settings/Settings.module.css";

// HTML Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";

// Libs
import { displayToast } from "@/lib/toast";
import type { ArtistSettingsController } from "@/hooks/useArtistSettings";
import type { BlocklistEntry } from "@/types/settings";

interface BlocklistManagerProps {
  entries: BlocklistEntry[];
  controller: ArtistSettingsController;
}

export const BlocklistManager = ({
  entries,
  controller,
}: BlocklistManagerProps) => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleAdd = async () => {
    if (!email.trim() && !phone.trim()) {
      displayToast("Add an email or phone number to block.", "warning");
      return;
    }
    await controller.addBlocklistEntry({
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      note: "",
    });
    setEmail("");
    setPhone("");
  };

  return (
    <div className={styles.manager}>
      {entries.length > 0 && (
        <div className={styles.list}>
          {entries.map((entry) => (
            <div key={entry.id} className={styles.listItem}>
              <div className={styles.listItemText}>
                <span className={styles.listItemTitle}>
                  {entry.email || entry.phone}
                </span>
                {entry.email && entry.phone && (
                  <span className={styles.listItemSubtitle}>{entry.phone}</span>
                )}
              </div>
              <Button
                variant="ghost"
                type="button"
                className={styles.iconButton}
                onClick={() => controller.removeBlocklistEntry(entry.id)}
                aria-label="Remove from blocklist"
              >
                <Trash2 size={15} />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className={styles.inlineForm}>
        <div className={styles.inlineFormRow}>
          <div className={clsx(styles.field, styles.fieldGrow)}>
            <Label htmlFor="block-email">Email</Label>
            <Input
              id="block-email"
              type="email"
              value={email}
              placeholder="client@example.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={clsx(styles.field, styles.fieldGrow)}>
            <Label htmlFor="block-phone">Phone</Label>
            <Input
              id="block-phone"
              type="tel"
              value={phone}
              placeholder="+1 (555) 000-0000"
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>
        <div className={styles.footerActions}>
          <Button variant="outline" onClick={handleAdd}>
            <Plus size={15} />
            Add to blocklist
          </Button>
        </div>
      </div>
    </div>
  );
};
