"use client";

// Next.js
import { useState, type ChangeEvent } from "react";

// CSS
import clsx from "clsx";
import styles from "@/styles/dashboard/artist/Bookings.module.css";

// HTML Components
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ChevronRight, Loader2, Plus, X } from "lucide-react";

// Components
import { AvailabilityScheduler } from "@/components/dashboard/artist/settings/AvailabilityScheduler";
import { DaysOffPicker } from "@/components/dashboard/artist/settings/DaysOffPicker";
import { OpenBookThemePhase } from "./OpenBookThemePhase";

// Hooks
import { useSlideTransition } from "@/hooks/useSlideTransition";

// Libs
import { getApiErrorMessage } from "@/hooks/useAuthForm";
import { useAuth } from "@/lib/auth";
import { openBookApi } from "@/lib/api/openBook";
import { uploadOpenBookBackground } from "@/lib/api/settings";
import { displayToast } from "@/lib/toast";
import { SCHEDULING_OPTIONS } from "@/constants/onboarding";
import {
  DEFAULT_CUSTOM_THEME,
  OPEN_BOOK_THEMES,
} from "@/constants/openBookThemes";

// Types
import type { ArtistSettingsController } from "@/hooks/useArtistSettings";
import type { AvailabilityWindowInput } from "@/types/settings";
import type {
  CustomTheme,
  OpenBook,
  OpenBookTheme,
  SchedulingMode,
  UpdateOpenBookPayload,
} from "@/types/bookings";

const MAX_QUESTIONS = 3;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const themeLabel = (theme: OpenBookTheme): string =>
  theme === "custom"
    ? "Custom"
    : (OPEN_BOOK_THEMES.find((t) => t.slug === theme)?.label ?? "Inkspace");

interface OpenBookEditSheetProps {
  open: boolean;
  openBook: OpenBook | null;
  controller: ArtistSettingsController;
  onOpenChange: (open: boolean) => void;
  onOpenBookSaved: (updated: OpenBook) => void;
}

export const OpenBookEditSheet = (props: OpenBookEditSheetProps) => {
  const ready = props.openBook && props.controller.data;
  return (
    <Sheet open={props.open} onOpenChange={props.onOpenChange}>
      <SheetContent side="right" className={styles.editSheet} showCloseButton>
        {ready && (
          <OpenBookEditForm
            key={props.openBook!.slug}
            openBook={props.openBook!}
            controller={props.controller}
            onClose={() => props.onOpenChange(false)}
            onOpenBookSaved={props.onOpenBookSaved}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};

interface OpenBookEditFormProps {
  openBook: OpenBook;
  controller: ArtistSettingsController;
  onClose: () => void;
  onOpenBookSaved: (updated: OpenBook) => void;
}

const OpenBookEditForm = ({
  openBook,
  controller,
  onClose,
  onOpenBookSaved,
}: OpenBookEditFormProps) => {
  const { token } = useAuth();
  const settings = controller.data!.settings;

  const [acceptingBookings, setAcceptingBookings] = useState(
    settings.acceptingBookings,
  );
  const [schedulingMode, setSchedulingMode] = useState<SchedulingMode>(
    openBook.schedulingMode,
  );
  const [theme, setTheme] = useState<OpenBookTheme>(openBook.theme);
  const [phase, setPhase] = useState<"main" | "theme">("main");
  const [customTheme, setCustomTheme] = useState<CustomTheme>(
    openBook.customTheme ?? DEFAULT_CUSTOM_THEME,
  );
  const [backgroundKey, setBackgroundKey] = useState<string | null>(null);
  const [backgroundPreview, setBackgroundPreview] = useState<string | null>(
    openBook.backgroundImageUrl ?? null,
  );
  const [clearBackground, setClearBackground] = useState(false);
  const [uploadingBackground, setUploadingBackground] = useState(false);
  const slideRef = useSlideTransition<HTMLDivElement>(
    phase === "theme" ? 1 : 0,
  );
  const [windows, setWindows] = useState<AvailabilityWindowInput[]>(
    controller.data!.availability.map((w) => ({
      weekday: w.weekday,
      startMinute: w.startMinute,
      endMinute: w.endMinute,
    })),
  );
  const [questions, setQuestions] = useState<string[]>(
    openBook.customQuestions,
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateQuestion = (index: number, value: string) =>
    setQuestions((qs) => qs.map((q, i) => (i === index ? value : q)));
  const removeQuestion = (index: number) =>
    setQuestions((qs) => qs.filter((_, i) => i !== index));
  const addQuestion = () => setQuestions((qs) => [...qs, ""]);

  const updateCustomColor = (key: keyof CustomTheme, value: string) =>
    setCustomTheme((c) => ({ ...c, [key]: value }));

  const handleBackgroundFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !token) return;
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError("Background image must be JPEG, PNG, or WebP.");
      return;
    }
    setUploadingBackground(true);
    setError(null);
    try {
      const key = await uploadOpenBookBackground(token, file);
      setBackgroundKey(key);
      setBackgroundPreview(URL.createObjectURL(file));
      setClearBackground(false);
    } catch {
      setError("Couldn't upload that image. Please try again.");
    } finally {
      setUploadingBackground(false);
    }
  };

  const handleClearBackground = () => {
    setBackgroundKey(null);
    setBackgroundPreview(null);
    setClearBackground(true);
  };

  const handleSave = async () => {
    if (!token) return;
    setSaving(true);
    setError(null);
    try {
      await controller.saveSettings({ acceptingBookings });
      await controller.saveAvailability(windows);

      const payload: UpdateOpenBookPayload = {
        schedulingMode,
        theme,
        customQuestions: questions.map((q) => q.trim()).filter(Boolean),
      };
      if (theme === "custom") payload.customTheme = customTheme;
      if (backgroundKey) payload.backgroundImageKey = backgroundKey;
      else if (clearBackground) payload.clearBackgroundImage = true;

      const updated = await openBookApi.update(token, payload);
      onOpenBookSaved(updated);
      displayToast("Your Open Book has been updated", "success");
      onClose();
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not save. Please try again."));
      setSaving(false);
    }
  };

  return (
    <div className={styles.editForm}>
      <SheetTitle className={styles.editTitle}>Edit your Open Book</SheetTitle>

      <div ref={slideRef} className={styles.editSlide}>
        {phase === "theme" ? (
          <OpenBookThemePhase
            theme={theme}
            onThemeChange={setTheme}
            customTheme={customTheme}
            onCustomColorChange={updateCustomColor}
            backgroundPreview={backgroundPreview}
            uploadingBackground={uploadingBackground}
            onBackgroundFile={handleBackgroundFile}
            onClearBackground={handleClearBackground}
            onBack={() => setPhase("main")}
          />
        ) : (
          <div className={styles.editFields}>
            <div className={styles.toggleRow}>
              <div className={styles.toggleText}>
                <span className={styles.toggleLabel}>Accepting bookings</span>
                <span className={styles.editHint}>
                  Turn off to close your books (vacation mode).
                </span>
              </div>
              <Switch
                checked={acceptingBookings}
                onCheckedChange={setAcceptingBookings}
              />
            </div>

            <div className={styles.editField}>
              <Label>Scheduling</Label>
              <div className={styles.schedulingRow}>
                {SCHEDULING_OPTIONS.map((option) => {
                  const Icon = option.icon;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      className={clsx(styles.schedulingOption, {
                        [styles.schedulingOptionActive]:
                          schedulingMode === option.value,
                      })}
                      onClick={() => setSchedulingMode(option.value)}
                    >
                      <span className={styles.schedulingIcon}>
                        <Icon size={18} />
                      </span>
                      <span className={styles.schedulingText}>
                        <span className={styles.schedulingLabel}>
                          {option.label}
                        </span>
                        <span className={styles.schedulingHint}>
                          {option.description}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <section className={styles.editCategory}>
              <h3 className={styles.editCategoryTitle}>Customizations</h3>

              <div className={styles.editField}>
                <Label>Theme</Label>
                <span className={styles.editHint}>
                  The color palette clients see on your public booking profile.
                </span>
                <button
                  type="button"
                  className={styles.customizeThemeBtn}
                  onClick={() => setPhase("theme")}
                >
                  <span className={styles.customizeThemeLabel}>
                    {themeLabel(theme)}
                  </span>
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className={styles.editField}>
                <Label>Custom booking questions</Label>
                <span className={styles.editHint}>
                  Add up to {MAX_QUESTIONS} questions clients answer when
                  booking.
                </span>
                <div className={styles.questionList}>
                  {questions.map((question, index) => (
                    <div key={index} className={styles.questionRow}>
                      <Input
                        value={question}
                        placeholder={`Question ${index + 1}`}
                        onChange={(e) => updateQuestion(index, e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className={styles.removeQuestionBtn}
                        onClick={() => removeQuestion(index)}
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
                {questions.length < MAX_QUESTIONS && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={styles.addQuestionBtn}
                    onClick={addQuestion}
                  >
                    <Plus size={16} />
                    Add question
                  </Button>
                )}
              </div>
            </section>

            <section className={styles.editCategory}>
              <h3 className={styles.editCategoryTitle}>Availability</h3>

              <div className={styles.editField}>
                <Label>Weekly hours</Label>
                <AvailabilityScheduler windows={windows} onChange={setWindows} />
              </div>

              <div className={styles.editField}>
                <Label>Days off</Label>
                <span className={styles.editHint}>
                  Block specific dates. Changes here save immediately.
                </span>
                <DaysOffPicker
                  daysOff={controller.data!.daysOff}
                  controller={controller}
                />
              </div>
            </section>
          </div>
        )}
      </div>

      {error && <p className={styles.editError}>{error}</p>}

      <div className={styles.editFooter}>
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          disabled={saving}
        >
          Cancel
        </Button>
        <Button
          type="button"
          className={styles.saveBtn}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving" : "Save"}
          {saving && <Loader2 size={16} className="animate-spin" />}
        </Button>
      </div>
    </div>
  );
};
