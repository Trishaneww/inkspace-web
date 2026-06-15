"use client";

// Next.js
import { useRef, type ChangeEvent } from "react";

// CSS
import styles from "@/styles/dashboard/artist/settings/Settings.module.css";

// HTML Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Plus, Trash2, Upload, X } from "lucide-react";

// Components
import { EditableCard, CardRow, useIsEditing } from "./SettingsPrimitives";

// Hooks
import { useDraftState } from "@/hooks/useDraftState";

// Libs
import { displayToast } from "@/lib/toast";
import { formatOnOffLabel } from "@/lib/formatters";
import {
  areFaqArraysEqual,
  getChangedFields,
  hasUnsavedChanges,
  sanitizeFaqs,
} from "@/lib/settings";
import type { ArtistSettingsController } from "@/hooks/useArtistSettings";
import type { ArtistSettings, FaqItem } from "@/types/settings";

const FAQ_MAX = 5;

type TermsDraft = Pick<
  ArtistSettings,
  "termsText" | "termsShowOnBooking" | "termsShowAtDeposit"
>;
const TERMS_KEYS: (keyof TermsDraft)[] = [
  "termsText",
  "termsShowOnBooking",
  "termsShowAtDeposit",
];

type AftercareDraft = Pick<ArtistSettings, "aftercare">;
const AFTERCARE_KEYS: (keyof AftercareDraft)[] = ["aftercare"];

export const PoliciesTab = ({
  controller,
}: {
  controller: ArtistSettingsController;
}) => {
  const { data, saveSettings } = controller;
  const settings = data?.settings;

  const terms = useDraftState<TermsDraft>({
    termsText: settings?.termsText ?? "",
    termsShowOnBooking: settings?.termsShowOnBooking ?? false,
    termsShowAtDeposit: settings?.termsShowAtDeposit ?? false,
  });
  const waiver = useDraftState({
    waiverRequired: settings?.waiverRequired ?? false,
  });
  const aftercare = useDraftState<AftercareDraft>({
    aftercare: settings?.aftercare ?? "",
  });

  if (!settings) return null;

  return (
    <>
      <EditableCard
        title="Terms & conditions"
        description="Shown to clients during booking and/or at deposit payment."
        onSubmit={() =>
          saveSettings(getChangedFields(settings, terms.draft, TERMS_KEYS))
        }
        successToast="Terms updated"
        errorToast="Couldn't save terms"
        onCancel={terms.reset}
        disableSubmit={!hasUnsavedChanges(settings, terms.draft, TERMS_KEYS)}
      >
        <CardRow label="Terms text" value={settings.termsText} stacked>
          <Textarea
            value={terms.draft.termsText}
            rows={5}
            placeholder="Your booking terms and conditions…"
            onChange={(e) => terms.update({ termsText: e.target.value })}
          />
        </CardRow>
        <CardRow
          label="Show during booking"
          value={formatOnOffLabel(settings.termsShowOnBooking)}
        >
          <Switch
            checked={terms.draft.termsShowOnBooking}
            onCheckedChange={(termsShowOnBooking) =>
              terms.update({ termsShowOnBooking })
            }
          />
        </CardRow>
        <CardRow
          label="Show at deposit payment"
          value={formatOnOffLabel(settings.termsShowAtDeposit)}
        >
          <Switch
            checked={terms.draft.termsShowAtDeposit}
            onCheckedChange={(termsShowAtDeposit) =>
              terms.update({ termsShowAtDeposit })
            }
          />
        </CardRow>
      </EditableCard>

      <EditableCard
        title="Aftercare"
        description="Care instructions shown to clients on your public booking page."
        onSubmit={() =>
          saveSettings(
            getChangedFields(settings, aftercare.draft, AFTERCARE_KEYS),
          )
        }
        successToast="Aftercare updated"
        errorToast="Couldn't save aftercare"
        onCancel={aftercare.reset}
        disableSubmit={
          !hasUnsavedChanges(settings, aftercare.draft, AFTERCARE_KEYS)
        }
      >
        <CardRow
          label="Aftercare instructions"
          value={settings.aftercare}
          stacked
        >
          <Textarea
            value={aftercare.draft.aftercare}
            rows={6}
            placeholder="How clients should care for their new tattoo…"
            onChange={(e) => aftercare.update({ aftercare: e.target.value })}
          />
        </CardRow>
      </EditableCard>

      <FaqPolicies settings={settings} saveSettings={saveSettings} />

      <EditableCard
        title="Consent / waiver"
        description="Upload a waiver clients must sign before their booking."
        onSubmit={() =>
          saveSettings({ waiverRequired: waiver.draft.waiverRequired })
        }
        successToast="Waiver settings updated"
        errorToast="Couldn't save waiver settings"
        onCancel={waiver.reset}
        disableSubmit={waiver.draft.waiverRequired === settings.waiverRequired}
      >
        <CardRow
          label="Waiver document"
          description="PDF or image. Uploads and removals save immediately."
          alwaysOn
        >
          <WaiverUpload controller={controller} />
        </CardRow>
        <CardRow
          label="Require client signature"
          description="Clients must sign the waiver before booking is confirmed."
          value={formatOnOffLabel(settings.waiverRequired)}
        >
          <Switch
            checked={waiver.draft.waiverRequired}
            onCheckedChange={(waiverRequired) =>
              waiver.update({ waiverRequired })
            }
          />
        </CardRow>
      </EditableCard>
    </>
  );
};

const FaqPolicies = ({
  settings,
  saveSettings,
}: {
  settings: ArtistSettings;
  saveSettings: ArtistSettingsController["saveSettings"];
}) => {
  const faq = useDraftState<{ faqs: FaqItem[] }>({ faqs: settings.faqs });
  const items = faq.draft.faqs;

  const changeItem = (index: number, patch: Partial<FaqItem>) =>
    faq.update({
      faqs: items.map((item, i) => (i === index ? { ...item, ...patch } : item)),
    });
  const addItem = () =>
    faq.update({ faqs: [...items, { question: "", answer: "" }] });
  const removeItem = (index: number) =>
    faq.update({ faqs: items.filter((_, i) => i !== index) });

  const hasChanges = !areFaqArraysEqual(sanitizeFaqs(items), settings.faqs);

  return (
    <EditableCard
      title="FAQ & policies"
      description="Answer common client questions. Shown on your public booking page."
      onSubmit={() => saveSettings({ faqs: sanitizeFaqs(items) })}
      successToast="FAQ updated"
      errorToast="Couldn't save FAQ"
      onCancel={faq.reset}
      disableSubmit={!hasChanges}
    >
      <FaqEditor
        saved={settings.faqs}
        items={items}
        onChangeItem={changeItem}
        onAddItem={addItem}
        onRemoveItem={removeItem}
      />
    </EditableCard>
  );
};

const FaqEditor = ({
  saved,
  items,
  onChangeItem,
  onAddItem,
  onRemoveItem,
}: {
  saved: FaqItem[];
  items: FaqItem[];
  onChangeItem: (index: number, patch: Partial<FaqItem>) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
}) => {
  const isEditing = useIsEditing();

  if (!isEditing) {
    if (saved.length === 0) {
      return <p className={styles.faqEmpty}>No FAQs added yet.</p>;
    }
    return (
      <div className={styles.faqReadList}>
        {saved.map((item, i) => (
          <div key={i} className={styles.faqReadItem}>
            <span className={styles.faqReadQuestion}>{item.question}</span>
            <span className={styles.faqReadAnswer}>{item.answer}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.manager}>
      {items.length > 0 && (
        <div className={styles.list}>
          {items.map((item, i) => (
            <div key={i} className={styles.faqEditItem}>
              <div className={styles.faqEditFields}>
                <div className={styles.field}>
                  <Label htmlFor={`faq-question-${i}`}>Question</Label>
                  <Input
                    id={`faq-question-${i}`}
                    value={item.question}
                    placeholder="e.g. Do you require a deposit?"
                    onChange={(e) => onChangeItem(i, { question: e.target.value })}
                  />
                </div>
                <div className={styles.field}>
                  <Label htmlFor={`faq-answer-${i}`}>Answer</Label>
                  <Textarea
                    id={`faq-answer-${i}`}
                    value={item.answer}
                    rows={3}
                    placeholder="Your answer…"
                    onChange={(e) => onChangeItem(i, { answer: e.target.value })}
                  />
                </div>
              </div>
              <Button
                variant="ghost"
                className={styles.iconButton}
                onClick={() => onRemoveItem(i)}
                aria-label="Remove FAQ"
              >
                <Trash2 size={15} />
              </Button>
            </div>
          ))}
        </div>
      )}
      <div className={styles.footerActions}>
        {items.length >= FAQ_MAX && (
          <span className={styles.faqLimitNote}>Maximum of {FAQ_MAX} FAQs.</span>
        )}
        <Button
          variant="outline"
          onClick={onAddItem}
          disabled={items.length >= FAQ_MAX}
        >
          <Plus size={15} />
          Add question
        </Button>
      </div>
    </div>
  );
};

const WaiverUpload = ({
  controller,
}: {
  controller: ArtistSettingsController;
}) => {
  const { data, uploadWaiver, saveSettings } = controller;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasWaiver = !!data?.settings.waiverFileUrl;

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      await uploadWaiver(file);
      displayToast("Waiver uploaded", "success");
    } catch (err) {
      displayToast(
        err instanceof Error ? err.message : "Couldn't upload waiver",
        "error",
      );
    }
  };

  const handleRemove = async () => {
    try {
      await saveSettings({ clearWaiverFile: true });
      displayToast("Waiver removed", "success");
    } catch (err) {
      displayToast(
        err instanceof Error ? err.message : "Couldn't remove waiver",
        "error",
      );
    }
  };

  return (
    <div className={styles.avatarRow}>
      {hasWaiver && (
        <a
          href={data!.settings.waiverFileUrl}
          target="_blank"
          rel="noreferrer"
          className={styles.chip}
        >
          <FileText size={14} />
          View waiver
        </a>
      )}
      <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
        <Upload size={15} />
        {hasWaiver ? "Replace" : "Upload"}
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf,image/jpeg,image/png,image/webp"
        className={styles.hiddenFileInput}
        onChange={handleChange}
      />
      {hasWaiver && (
        <Button
          variant="ghost"
          className={styles.iconButton}
          onClick={handleRemove}
          aria-label="Remove waiver"
        >
          <X size={15} />
        </Button>
      )}
    </div>
  );
};
