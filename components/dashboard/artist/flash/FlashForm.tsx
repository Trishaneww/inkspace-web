"use client";

// Next.js
import { useState, type ChangeEvent } from "react";
import Image from "next/image";

// CSS
import clsx from "clsx";
import styles from "@/styles/dashboard/artist/FlashFormSheet.module.css";

// HTML Components
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Archive,
  ArchiveRestore,
  ImageUp,
  Info,
  Loader2,
  Plus,
  X,
} from "lucide-react";

// Components
import { FlashPricingTable } from "./FlashPricingTable";
import { DurationSelect } from "./DurationSelect";
import { PriceInput } from "./PricingInput";
import { FlashMoreDetails } from "./FlashMoreDetails";
import { CurrencySelect } from "@/components/common/CurrencySelect";

// Hooks
import { useFlashImages } from "@/hooks/use-flash-images";
import { useFlashForm } from "@/hooks/use-flash-form";

// Types
import {
  PricingMode,
  type Flash,
  type FlashSizeCode,
  type TierFormRow,
  type FlashImagesController,
} from "@/types/flash";

interface FlashFormProps {
  initialFlash: Flash | null;
  onClose: () => void;
  onSaved: () => void;
}

export const FlashForm = ({
  initialFlash,
  onClose,
  onSaved,
}: FlashFormProps) => {
  const images = useFlashImages(initialFlash);
  const {
    isEditMode,
    title,
    setTitle,
    description,
    setDescription,
    repeatable,
    setRepeatable,
    pricingMode,
    setPricingMode,
    flatPriceDollars,
    setFlatPriceDollars,
    flatDurationMinutes,
    setFlatDurationMinutes,
    tierRows,
    updateTierRow,
    currency,
    setCurrency,
    colorType,
    setColorType,
    stylesText,
    setStylesText,
    placementsText,
    setPlacementsText,
    isSaving,
    isTogglingArchive,
    isArchived,
    formError,
    handleSave,
    handleArchive,
    handleUnarchive,
  } = useFlashForm({ initialFlash, images, onSaved });

  const [isMoreDetailsOpen, setIsMoreDetailsOpen] = useState(false);

  return (
    <>
      <SheetHeader>
        <SheetTitle className={styles.sheetTitle}>
          {isEditMode ? "Edit flash" : "Add new flash"}
        </SheetTitle>
      </SheetHeader>

      <div className={styles.sheetContent}>
        <FlashImageSection images={images} />
        <FlashBasicInfo
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
        />
        <RepeatableSwitch
          repeatable={repeatable}
          setRepeatable={setRepeatable}
        />
        <FlashPricing
          pricingMode={pricingMode}
          setPricingMode={setPricingMode}
          tierRows={tierRows}
          updateTierRow={updateTierRow}
          flatDurationMinutes={flatDurationMinutes}
          setFlatDurationMinutes={setFlatDurationMinutes}
          flatPriceDollars={flatPriceDollars}
          setFlatPriceDollars={setFlatPriceDollars}
          currency={currency}
          setCurrency={setCurrency}
        />
        <FlashMoreDetails
          isOpen={isMoreDetailsOpen}
          onOpenChange={setIsMoreDetailsOpen}
          colorType={colorType}
          setColorType={setColorType}
          placementsText={placementsText}
          setPlacementsText={setPlacementsText}
          stylesText={stylesText}
          setStylesText={setStylesText}
        />
        <FlashDisclaimer />
        {formError && <div className={styles.formError}>{formError}</div>}
      </div>

      <FlashFormFooter
        onClose={onClose}
        isSaving={isSaving}
        isTogglingArchive={isTogglingArchive}
        isEditMode={isEditMode}
        isArchived={isArchived}
        handleSave={handleSave}
        handleArchive={handleArchive}
        handleUnarchive={handleUnarchive}
      />
    </>
  );
};

interface FlashImageSectionProps {
  images: FlashImagesController;
}

const FlashImageSection = ({ images }: FlashImageSectionProps) => {
  return (
    <div className={styles.section}>
      <span className={styles.sectionHeading}>
        Image <span className={styles.required}>*</span>
      </span>
      <span className={styles.sectionHelper}>
        Primary display image. JPEG, PNG, or WEBP under 5MB.
      </span>

      <div className={styles.imageRow}>
        <PrimaryImagePicker
          previewUrl={images.primaryPreviewUrl}
          onFileChange={images.handlePrimaryFileChange}
        />
        <ReferenceImagePicker
          previewUrl={images.referencePreviewUrl}
          onFileChange={images.handleReferenceFileChange}
          onRemove={images.handleRemoveReference}
        />
      </div>
    </div>
  );
};

interface PrimaryImagePickerProps {
  previewUrl: string | null;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const PrimaryImagePicker = ({
  previewUrl,
  onFileChange,
}: PrimaryImagePickerProps) => {
  return (
    <label className={styles.imagePicker}>
      {previewUrl ? (
        <Image
          src={previewUrl}
          alt="Flash preview"
          fill
          unoptimized
          className={styles.imagePreview}
        />
      ) : (
        <>
          <ImageUp size={20} />
          <span>Upload</span>
        </>
      )}
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={onFileChange}
      />
    </label>
  );
};

interface ReferenceImagePickerProps {
  previewUrl: string | null;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}

const ReferenceImagePicker = ({
  previewUrl,
  onFileChange,
  onRemove,
}: ReferenceImagePickerProps) => {
  return (
    <div className={styles.referenceColumn}>
      {previewUrl ? (
        <div className={styles.referencePreview}>
          <div className={styles.referenceImageBox}>
            <Image
              src={previewUrl}
              alt="Reference preview"
              fill
              unoptimized
              className={styles.referenceImage}
            />
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className={styles.removeReferenceButton}
            onClick={onRemove}
            aria-label="Remove reference photo"
          >
            <X size={14} />
          </Button>
        </div>
      ) : (
        <>
          <label className={styles.addReferenceButton}>
            <Plus size={14} />
            Add reference photo
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={onFileChange}
            />
          </label>
          <span className={styles.sectionHelper}>
            Optional. Additional angle or rendered-on-skin mockup.
          </span>
        </>
      )}
    </div>
  );
};

interface FlashBasicInfoProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
}

const FlashBasicInfo = ({
  title,
  setTitle,
  description,
  setDescription,
}: FlashBasicInfoProps) => {
  return (
    <>
      <div className={styles.section}>
        <Label htmlFor="flash-title">
          Title <span className={styles.required}>*</span>
        </Label>
        <Input
          id="flash-title"
          placeholder="e.g. Hockey, Dragoon"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />
      </div>

      <div className={styles.section}>
        <Label htmlFor="flash-description">
          Description
          <span className={styles.labelOptional}>(optional)</span>
        </Label>
        <Textarea
          id="flash-description"
          placeholder="Internal notes or client-facing description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </div>
    </>
  );
};

interface RepeatableSwitchProps {
  repeatable: boolean;
  setRepeatable: (repeatable: boolean) => void;
}

const RepeatableSwitch = ({
  repeatable,
  setRepeatable,
}: RepeatableSwitchProps) => {
  return (
    <div className={styles.repeatableCard}>
      <div className={styles.repeatableText}>
        <span className={styles.repeatableLabel}>Repeatable</span>
        <span className={styles.repeatableHelper}>
          Multiple clients can book this design. Off = one client only.
        </span>
      </div>
      <Switch checked={repeatable} onCheckedChange={setRepeatable} />
    </div>
  );
};

interface FlashPricingProps {
  pricingMode: PricingMode;
  setPricingMode: (pricingMode: PricingMode) => void;
  tierRows: Record<FlashSizeCode, TierFormRow>;
  updateTierRow: (code: FlashSizeCode, patch: Partial<TierFormRow>) => void;
  flatDurationMinutes: string;
  setFlatDurationMinutes: (flatDurationMinutes: string) => void;
  flatPriceDollars: string;
  setFlatPriceDollars: (flatPriceDollars: string) => void;
  currency: string;
  setCurrency: (currency: string) => void;
}

const FlashPricing = ({
  pricingMode,
  setPricingMode,
  tierRows,
  updateTierRow,
  flatDurationMinutes,
  setFlatDurationMinutes,
  flatPriceDollars,
  setFlatPriceDollars,
  currency,
  setCurrency,
}: FlashPricingProps) => {
  return (
    <div className={styles.section}>
      <FlashPricingToggle
        pricingMode={pricingMode}
        setPricingMode={setPricingMode}
      />

      <span className={styles.sectionHelper}>
        {pricingMode === "per_size"
          ? "Select offered sizes and set price + duration for each."
          : "Single price and duration regardless of size."}
      </span>

      {pricingMode === "per_size" ? (
        <FlashPricingTable tierRows={tierRows} onChange={updateTierRow} />
      ) : (
        <div className={styles.flatRow}>
          <DurationSelect
            ariaLabel="Flat-rate duration"
            value={flatDurationMinutes}
            onChange={setFlatDurationMinutes}
          />
          <PriceInput
            ariaLabel="Flat-rate price"
            value={flatPriceDollars}
            onChange={setFlatPriceDollars}
            placeholder="$0.00"
          />
        </div>
      )}

      <CurrencySelect currency={currency} setCurrency={setCurrency} />
    </div>
  );
};

interface FlashPricingToggleProps {
  pricingMode: PricingMode;
  setPricingMode: (pricingMode: PricingMode) => void;
}

const FlashPricingToggle = ({
  pricingMode,
  setPricingMode,
}: FlashPricingToggleProps) => {
  return (
    <div className={styles.pricingHeader}>
      <span className={styles.sectionHeading}>
        Sizes &amp; pricing <span className={styles.required}>*</span>
      </span>
      <div className={styles.modeToggle} role="tablist">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={clsx(styles.modeToggleButton, {
            [styles.modeToggleButtonActive]: pricingMode === "per_size",
          })}
          onClick={() => setPricingMode("per_size")}
        >
          Per size
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className={clsx(styles.modeToggleButton, {
            [styles.modeToggleButtonActive]: pricingMode === "flat",
          })}
          onClick={() => setPricingMode("flat")}
        >
          Flat rate
        </Button>
      </div>
    </div>
  );
};

const FlashDisclaimer = () => {
  return (
    <div className={styles.depositNote}>
      <Info size={16} />
      <span>
        Prices shown to clients are estimates. You only charge the deposit at
        booking. Final amount is settled after the session.
      </span>
    </div>
  );
};

interface FlashFormFooterProps {
  onClose: () => void;
  isSaving: boolean;
  isTogglingArchive: boolean;
  isEditMode: boolean;
  isArchived: boolean;
  handleSave: (publish: boolean) => void;
  handleArchive: () => void;
  handleUnarchive: () => void;
}

const FlashFormFooter = ({
  onClose,
  isSaving,
  isTogglingArchive,
  isEditMode,
  isArchived,
  handleSave,
  handleArchive,
  handleUnarchive,
}: FlashFormFooterProps) => {
  const disabled = isSaving || isTogglingArchive;

  return (
    <div className={styles.footer}>
      <div className={styles.footerLeft}>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={disabled}
        >
          Cancel
        </Button>
        {isEditMode && (
          <Button
            type="button"
            variant="outline"
            onClick={isArchived ? handleUnarchive : handleArchive}
            disabled={disabled}
          >
            {isTogglingArchive ? (
              <Loader2 size={16} className="animate-spin" />
            ) : isArchived ? (
              <ArchiveRestore size={16} />
            ) : (
              <Archive size={16} />
            )}
            {isTogglingArchive
              ? isArchived
                ? "Unarchiving"
                : "Archiving"
              : isArchived
                ? "Unarchive"
                : "Archive"}
          </Button>
        )}
      </div>
      <div className={styles.footerRight}>
        {!isEditMode && (
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSave(false)}
            disabled={disabled}
          >
            Save as draft
          </Button>
        )}
        <Button
          type="button"
          onClick={() => handleSave(true)}
          disabled={disabled}
          className={styles.saveBtn}
        >
          {isSaving ? "Saving" : isEditMode ? "Update flash" : "Add flash"}
          {isSaving && <Loader2 size={16} className="animate-spin" />}
        </Button>
      </div>
    </div>
  );
};
