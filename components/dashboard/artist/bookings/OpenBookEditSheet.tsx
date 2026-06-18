"use client";

// React
import { useState } from "react";

// CSS
import clsx from "clsx";
import styles from "@/styles/dashboard/artist/Bookings.module.css";

// HTML Components
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, X } from "lucide-react";

// Components
import { AvailabilityScheduler } from "@/components/dashboard/artist/settings/AvailabilityScheduler";
import { DaysOffPicker } from "@/components/dashboard/artist/settings/DaysOffPicker";
import { OpenBookThemePicker } from "./OpenBookThemePicker";

// Libs
import { getApiErrorMessage } from "@/hooks/useAuthForm";
import { useAuth } from "@/lib/auth";
import { openBookApi } from "@/lib/api/openBook";
import { displayToast } from "@/lib/toast";
import { SCHEDULING_OPTIONS } from "@/constants/onboarding";

// Types
import type { ArtistSettingsController } from "@/hooks/useArtistSettings";
import type { AvailabilityWindowInput } from "@/types/settings";
import type { OpenBook, OpenBookTheme, SchedulingMode } from "@/types/bookings";

const MAX_QUESTIONS = 3;

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

  const handleSave = async () => {
    if (!token) return;
    setSaving(true);
    setError(null);
    try {
      await controller.saveSettings({ acceptingBookings });
      await controller.saveAvailability(windows);

      const updated = await openBookApi.update(token, {
        schedulingMode,
        theme,
        customQuestions: questions.map((q) => q.trim()).filter(Boolean),
      });
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
          <div className={styles.timeFilterRow}>
            {SCHEDULING_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                className={clsx(styles.timeFilterBtn, {
                  [styles.timeFilterBtnActive]: schedulingMode === option.value,
                })}
                onClick={() => setSchedulingMode(option.value)}
              >
                <span className={styles.timeFilterLabel}>{option.label}</span>
                <span className={styles.timeFilterHint}>
                  {option.description}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.editField}>
          <Label>Theme</Label>
          <span className={styles.editHint}>
            The color palette clients see on your public booking profile.
          </span>
          <OpenBookThemePicker value={theme} onChange={setTheme} />
        </div>

        <div className={styles.editField}>
          <Label>Custom booking questions</Label>
          <span className={styles.editHint}>
            Add up to {MAX_QUESTIONS} questions clients answer when booking.
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

        {error && <p className={styles.editError}>{error}</p>}
      </div>

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
