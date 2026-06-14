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
import type { ArtistSettingsController } from "@/hooks/useArtistSettings";
import type { SessionPreset } from "@/types/settings";
import { formatDurationMinutes } from "@/lib/formatters";

interface SessionTypePresetsProps {
  presets: SessionPreset[];
  controller: ArtistSettingsController;
}

export const SessionTypePresets = ({
  presets,
  controller,
}: SessionTypePresetsProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");

  const canAddPreset = name.trim() !== "" && Number(duration) > 0;

  const handleAdd = async () => {
    if (!canAddPreset) return;
    await controller.addPreset({
      name: name.trim(),
      description: description.trim(),
      approxDurationMinutes: Number(duration),
      position: presets.length,
    });
    setName("");
    setDescription("");
    setDuration("");
  };

  return (
    <div className={styles.manager}>
      {presets.length > 0 && (
        <div className={styles.list}>
          {presets.map((preset) => (
            <div key={preset.id} className={styles.listItem}>
              <div className={styles.listItemText}>
                <span className={styles.listItemTitle}>{preset.name}</span>
                <span className={styles.listItemSubtitle}>
                  {formatDurationMinutes(preset.approxDurationMinutes)}
                  {preset.description ? ` · ${preset.description}` : ""}
                </span>
              </div>
              <Button
                variant="ghost"
                className={styles.iconButton}
                onClick={() => controller.deletePreset(preset.id)}
                aria-label={`Delete ${preset.name}`}
              >
                <Trash2 size={15} />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className={styles.inlineForm}>
        <div className={styles.inlineFormRow}>
          <div className={clsx(styles.field, styles.fieldGrowDouble)}>
            <Label htmlFor="preset-name">Name</Label>
            <Input
              id="preset-name"
              value={name}
              placeholder="e.g. Full day session"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className={clsx(styles.field, styles.fieldDuration)}>
            <Label htmlFor="preset-duration">Duration (min)</Label>
            <Input
              id="preset-duration"
              type="number"
              min={1}
              value={duration}
              placeholder="480"
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>
        </div>
        <div className={styles.field}>
          <Label htmlFor="preset-description">Description</Label>
          <Input
            id="preset-description"
            value={description}
            placeholder="e.g. Full day session, ~8 hours"
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className={styles.footerActions}>
          <Button
            variant="outline"
            onClick={handleAdd}
            disabled={!canAddPreset}
          >
            <Plus size={15} />
            Add preset
          </Button>
        </div>
      </div>
    </div>
  );
};
