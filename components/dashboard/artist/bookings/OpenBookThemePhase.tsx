"use client";

// Next.js
import type { ChangeEvent } from "react";
import Image from "next/image";

// CSS
import styles from "@/styles/dashboard/artist/Bookings.module.css";

// HTML Components
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ImagePlus, Loader2, X } from "lucide-react";

// Components
import { OpenBookThemePicker } from "./OpenBookThemePicker";

// Types
import type { CustomTheme, OpenBookTheme } from "@/types/bookings";

const CUSTOM_COLOR_FIELDS: { key: keyof CustomTheme; label: string }[] = [
  { key: "background", label: "Background" },
  { key: "card", label: "Card" },
  { key: "button", label: "Button" },
  { key: "text", label: "Text" },
];

interface OpenBookThemePhaseProps {
  theme: OpenBookTheme;
  onThemeChange: (theme: OpenBookTheme) => void;
  customTheme: CustomTheme;
  onCustomColorChange: (key: keyof CustomTheme, value: string) => void;
  backgroundPreview: string | null;
  uploadingBackground: boolean;
  onBackgroundFile: (event: ChangeEvent<HTMLInputElement>) => void;
  onClearBackground: () => void;
  onBack: () => void;
}

export const OpenBookThemePhase = ({
  theme,
  onThemeChange,
  customTheme,
  onCustomColorChange,
  backgroundPreview,
  uploadingBackground,
  onBackgroundFile,
  onClearBackground,
  onBack,
}: OpenBookThemePhaseProps) => (
  <div className={styles.editFields}>
    <button type="button" className={styles.phaseBack} onClick={onBack}>
      <ArrowLeft size={16} />
      Back
    </button>

    <div className={styles.editField}>
      <Label>Theme</Label>
      <span className={styles.editHint}>
        Pick a preset, or choose Custom to set your own colors and background.
      </span>
      <OpenBookThemePicker value={theme} onChange={onThemeChange} />
    </div>

    {theme === "custom" && (
      <>
        <div className={styles.editField}>
          <Label>Colors</Label>
          <div className={styles.colorFieldGrid}>
            {CUSTOM_COLOR_FIELDS.map((field) => (
              <div key={field.key} className={styles.colorField}>
                <span className={styles.colorFieldLabel}>{field.label}</span>
                <div className={styles.colorControl}>
                  <input
                    type="color"
                    aria-label={field.label}
                    className={styles.colorSwatchInput}
                    value={customTheme[field.key]}
                    onChange={(event) =>
                      onCustomColorChange(field.key, event.target.value)
                    }
                  />
                  <Input
                    value={customTheme[field.key]}
                    className={styles.colorHexInput}
                    onChange={(event) =>
                      onCustomColorChange(field.key, event.target.value)
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.editField}>
          <Label>Background image</Label>
          <span className={styles.editHint}>
            Optional. An image replaces the background color on your profile.
          </span>
          {backgroundPreview ? (
            <div className={styles.bgPreviewWrap}>
              <div className={styles.bgPreview}>
                <Image
                  src={backgroundPreview}
                  alt="Background preview"
                  fill
                  unoptimized
                  className={styles.bgPreviewImg}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onClearBackground}
              >
                <X size={15} />
                Remove image
              </Button>
            </div>
          ) : (
            <label className={styles.bgUpload}>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                hidden
                onChange={onBackgroundFile}
              />
              {uploadingBackground ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <ImagePlus size={16} />
              )}
              Upload background image
            </label>
          )}
        </div>
      </>
    )}
  </div>
);
