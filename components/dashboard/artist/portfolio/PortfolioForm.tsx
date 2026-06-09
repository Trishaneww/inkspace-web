"use client";

// Next.js
import { useState } from "react";
import Image from "next/image";

// CSS
import styles from "@/styles/dashboard/artist/PortfolioFormSheet.module.css";

// HTML Components
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, ImageUp, Loader2, Trash2, X } from "lucide-react";

// Components
import { TattooStylesPicker } from "@/components/common/TattooStylesPicker";

// Hooks
import { usePortfolioImages } from "@/hooks/usePortfolioImages";
import { usePortfolioForm } from "@/hooks/usePortfolioForm";

// Libs
import { format } from "date-fns";
import { formatDate, parseISODate } from "@/lib/formatters";
import { COLOR_TYPE_LABELS } from "@/constants/portfolio";

// Types
import type {
  PortfolioColorType,
  PortfolioImagesController,
  PortfolioItem,
} from "@/types/portfolio";

interface PortfolioFormProps {
  initialItem: PortfolioItem | null;
  onClose: () => void;
  onSaved: () => void;
}

const COLOR_NONE = "none";

export const PortfolioForm = ({
  initialItem,
  onClose,
  onSaved,
}: PortfolioFormProps) => {
  const images = usePortfolioImages(initialItem);
  const form = usePortfolioForm({ initialItem, images, onSaved });

  return (
    <>
      <SheetHeader>
        <SheetTitle className={styles.sheetTitle}>
          {form.isEditMode ? "Edit piece" : "Add piece"}
        </SheetTitle>
      </SheetHeader>

      <div className={styles.sheetContent}>
        <ReferencePhotosSection images={images} />

        <div className={styles.toggleCard}>
          <div className={styles.toggleText}>
            <span className={styles.toggleLabel}>Healed photo</span>
            <span className={styles.toggleHelper}>
              Mark if these show the tattoo fully healed, not fresh.
            </span>
          </div>
          <Switch checked={form.healed} onCheckedChange={form.setHealed} />
        </div>

        <div className={styles.section}>
          <Label htmlFor="portfolio-title">
            Title <span className={styles.required}>*</span>
          </Label>
          <Input
            id="portfolio-title"
            placeholder="e.g. Fine-line botanical sleeve"
            value={form.title}
            onChange={(event) => form.setTitle(event.target.value)}
            required
          />
        </div>

        <div className={styles.section}>
          <Label htmlFor="portfolio-description">
            Description<span className={styles.labelOptional}>(optional)</span>
          </Label>
          <Textarea
            id="portfolio-description"
            placeholder="A short note about the piece"
            value={form.description}
            onChange={(event) => form.setDescription(event.target.value)}
          />
        </div>

        <div className={styles.section}>
          <Label>
            Completion date
            <span className={styles.labelOptional}>(optional)</span>
          </Label>
          <CompletionDateField
            value={form.completionDate}
            onChange={form.setCompletionDate}
          />
        </div>

        <div className={styles.section}>
          <Label>
            Styles<span className={styles.labelOptional}>(optional)</span>
          </Label>
          <TattooStylesPicker value={form.styles} onChange={form.setStyles} />
        </div>

        <div className={styles.section}>
          <Label htmlFor="portfolio-placement">
            Placement<span className={styles.labelOptional}>(optional)</span>
          </Label>
          <Input
            id="portfolio-placement"
            placeholder="e.g. Forearm"
            value={form.placement}
            onChange={(event) => form.setPlacement(event.target.value)}
          />
        </div>

        <div className={styles.twoCol}>
          <div className={styles.section}>
            <Label>
              Color<span className={styles.labelOptional}>(optional)</span>
            </Label>
            <Select
              value={form.colorType || COLOR_NONE}
              onValueChange={(next) =>
                form.setColorType(
                  next === COLOR_NONE ? "" : (next as PortfolioColorType),
                )
              }
            >
              <SelectTrigger className={styles.fullWidth}>
                <span>
                  {form.colorType
                    ? COLOR_TYPE_LABELS[form.colorType]
                    : "Not specified"}
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={COLOR_NONE}>Not specified</SelectItem>
                <SelectItem value="black_and_grey">Black &amp; grey</SelectItem>
                <SelectItem value="color">Color</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className={styles.section}>
            <Label htmlFor="portfolio-size">
              Size (in)<span className={styles.labelOptional}>(optional)</span>
            </Label>
            <Input
              id="portfolio-size"
              type="number"
              min={1}
              placeholder="e.g. 8"
              value={form.approxSizeInches}
              onChange={(event) => form.setApproxSizeInches(event.target.value)}
            />
          </div>
        </div>

        <div className={styles.twoCol}>
          <div className={styles.section}>
            <Label htmlFor="portfolio-sessions">
              Sessions<span className={styles.labelOptional}>(optional)</span>
            </Label>
            <Input
              id="portfolio-sessions"
              type="number"
              min={1}
              placeholder="e.g. 2"
              value={form.sessionCount}
              onChange={(event) => form.setSessionCount(event.target.value)}
            />
          </div>

          <div className={styles.section}>
            <Label htmlFor="portfolio-hours">
              Total time (hrs)
              <span className={styles.labelOptional}>(optional)</span>
            </Label>
            <Input
              id="portfolio-hours"
              type="number"
              min={0}
              step="0.5"
              placeholder="e.g. 6"
              value={form.totalHours}
              onChange={(event) => form.setTotalHours(event.target.value)}
            />
          </div>
        </div>

        {form.formError && (
          <div className={styles.formError}>{form.formError}</div>
        )}
      </div>

      <PortfolioFormFooter form={form} onClose={onClose} />
    </>
  );
};

const ReferencePhotosSection = ({
  images,
}: {
  images: PortfolioImagesController;
}) => {
  return (
    <div className={styles.section}>
      <span className={styles.sectionHeading}>
        Photos <span className={styles.required}>*</span>
      </span>
      <span className={styles.sectionHelper}>
        Up to 3 — the first is your thumbnail. JPEG, PNG, or WEBP under 5MB.
      </span>

      <div className={styles.photoGrid}>
        {images.slots.map((slot, index) => (
          <div key={slot.id} className={styles.photoTile}>
            <Image
              src={slot.previewUrl}
              alt={`Photo ${index + 1}`}
              fill
              unoptimized
              className={styles.photoImg}
            />
            {index === 0 && (
              <span className={styles.thumbBadge}>Thumbnail</span>
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className={styles.photoRemove}
              aria-label={`Remove photo ${index + 1}`}
              onClick={() => images.handleRemove(slot.id)}
            >
              <X size={14} />
            </Button>
          </div>
        ))}

        {images.canAddMore && (
          <label className={styles.addPhotoTile}>
            <ImageUp size={20} />
            <span>Add photo</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={images.handleAddFiles}
            />
          </label>
        )}
      </div>
    </div>
  );
};

const CompletionDateField = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const selected = value ? parseISODate(value) : undefined;

  return (
    <div className={styles.dateRow}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              type="button"
              variant="outline"
              className={styles.datePickerTrigger}
            >
              <CalendarIcon size={15} />
              {value ? formatDate(value) : "Pick a date"}
            </Button>
          }
        />
        <PopoverContent className={styles.calendarPopover} align="start">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={(date) => {
              onChange(date ? format(date, "yyyy-MM-dd") : "");
              setOpen(false);
            }}
            disabled={{ after: new Date() }}
          />
        </PopoverContent>
      </Popover>
      {value && (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Clear completion date"
          onClick={() => onChange("")}
        >
          <X size={15} />
        </Button>
      )}
    </div>
  );
};

const PortfolioFormFooter = ({
  form,
  onClose,
}: {
  form: ReturnType<typeof usePortfolioForm>;
  onClose: () => void;
}) => {
  const disabled = form.isSaving || form.isTogglingArchive || form.isDeleting;

  if (!form.isEditMode) {
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
        </div>
        <div className={styles.footerRight}>
          <Button
            type="button"
            variant="outline"
            onClick={() => form.handleSave(false)}
            disabled={disabled}
          >
            Save as draft
          </Button>
          <Button
            type="button"
            className={styles.saveBtn}
            onClick={() => form.handleSave(true)}
            disabled={disabled}
          >
            {form.isSaving ? "Adding" : "Add piece"}
            {form.isSaving && <Loader2 size={16} className="animate-spin" />}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.footer}>
      <div className={styles.footerLeft}>
        <Button
          type="button"
          variant="outline"
          onClick={form.isArchived ? form.handleUnarchive : form.handleArchive}
          disabled={disabled}
        >
          {form.isTogglingArchive && (
            <Loader2 size={16} className="animate-spin" />
          )}
          {form.isArchived ? "Unarchive" : "Archive"}
        </Button>
        <DeleteConfirmButton
          isDeleting={form.isDeleting}
          disabled={disabled}
          onConfirm={form.handleDelete}
        />
      </div>
      <div className={styles.footerRight}>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={disabled}
        >
          Cancel
        </Button>
        <Button
          type="button"
          className={styles.saveBtn}
          onClick={() => form.handleSave(false)}
          disabled={disabled}
        >
          {form.isSaving ? "Saving" : "Update piece"}
          {form.isSaving && <Loader2 size={16} className="animate-spin" />}
        </Button>
      </div>
    </div>
  );
};

const DeleteConfirmButton = ({
  isDeleting,
  disabled,
  onConfirm,
}: {
  isDeleting: boolean;
  disabled: boolean;
  onConfirm: () => void;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button type="button" variant="destructive" disabled={disabled}>
            {isDeleting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Trash2 size={16} />
            )}
            Delete
          </Button>
        }
      />
      <PopoverContent align="start" side="top">
        <PopoverHeader>
          <PopoverTitle>Delete this piece?</PopoverTitle>
          <PopoverDescription>This can&apos;t be undone.</PopoverDescription>
        </PopoverHeader>
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => {
              setOpen(false);
              onConfirm();
            }}
          >
            <Trash2 size={14} />
            Delete
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};