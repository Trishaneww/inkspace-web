"use client";

// Next.js
import { useMemo, useState } from "react";

// Libs
import { flashesApi } from "@/lib/api/flashes";
import { useAuth } from "@/lib/auth";
import {
  buildBlankTierRows,
  buildPricingTiersFromRows,
  buildTierRowsFromFlash,
  convertDollarsToCents,
} from "@/lib/flashes";
import { formatCurrency } from "@/lib/formatters";
import { displayToast } from "@/lib/toast";

// Types
import {
  type ColorType,
  type CreateFlashPayload,
  type Flash,
  type FlashSizeCode,
  type PricingMode,
  type TierFormRow,
  type UpdateFlashPayload,
  type FlashImagesController,
} from "@/types/flash";

interface UseFlashFormProps {
  initialFlash: Flash | null;
  images: FlashImagesController;
  onSaved: () => void;
}

export function useFlashForm({
  initialFlash,
  images,
  onSaved,
}: UseFlashFormProps) {
  const { token } = useAuth();
  const isEditMode = initialFlash !== null;
  const isArchived = initialFlash?.status === "archived";

  const [title, setTitle] = useState(initialFlash?.title ?? "");
  const [description, setDescription] = useState(
    initialFlash?.description ?? "",
  );
  const [repeatable, setRepeatable] = useState(
    initialFlash?.repeatable ?? true,
  );
  const [pricingMode, setPricingMode] = useState<PricingMode>(
    initialFlash?.pricing_mode ?? "per_size",
  );
  const [flatPriceDollars, setFlatPriceDollars] = useState(
    initialFlash?.flat_price_cents !== null &&
      initialFlash?.flat_price_cents !== undefined
      ? formatCurrency((initialFlash.flat_price_cents / 100).toString())
      : "",
  );
  const [flatDurationMinutes, setFlatDurationMinutes] = useState(
    initialFlash?.flat_duration_minutes?.toString() ?? "",
  );
  const [tierRows, setTierRows] = useState<Record<FlashSizeCode, TierFormRow>>(
    initialFlash
      ? buildTierRowsFromFlash(initialFlash.pricing_tiers)
      : buildBlankTierRows(),
  );
  const [colorType, setColorType] = useState<ColorType>(
    initialFlash?.color_type ?? "both",
  );
  const [styleTags, setStyleTags] = useState<string[]>(
    initialFlash?.styles ?? [],
  );
  const [placements, setPlacements] = useState<string[]>(
    initialFlash?.placements ?? [],
  );
  const [depositDollars, setDepositDollars] = useState(
    initialFlash?.deposit_cents != null
      ? formatCurrency((initialFlash.deposit_cents / 100).toString())
      : "",
  );

  const [isSaving, setIsSaving] = useState(false);
  const [isTogglingArchive, setIsTogglingArchive] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const updateTierRow = (code: FlashSizeCode, patch: Partial<TierFormRow>) => {
    setTierRows((prev) => ({
      ...prev,
      [code]: { ...prev[code], ...patch },
    }));
  };

  const enabledTiers = useMemo(
    () => buildPricingTiersFromRows(tierRows),
    [tierRows],
  );

  const handleSave = async (publish: boolean) => {
    if (!token) {
      setFormError("You must be signed in.");
      return;
    }
    setFormError(null);

    if (!title.trim()) {
      setFormError("Title is required.");
      return;
    }
    const depositCents = convertDollarsToCents(depositDollars);
    if (!depositCents || depositCents <= 0) {
      setFormError("A deposit greater than zero is required.");
      return;
    }
    if (publish && !images.hasPrimaryImage) {
      setFormError("Publish requires an uploaded image.");
      return;
    }
    if (pricingMode === "per_size" && enabledTiers.length === 0) {
      setFormError("Pick at least one size and set its duration + price.");
      return;
    }
    if (pricingMode === "flat") {
      const flatCents = convertDollarsToCents(flatPriceDollars);
      const flatDuration = parseInt(flatDurationMinutes, 10);
      if (!flatCents || flatCents <= 0) {
        setFormError("Flat rate needs a price greater than zero.");
        return;
      }
      if (!flatDuration || flatDuration <= 0) {
        setFormError("Flat rate needs a duration greater than zero.");
        return;
      }
    }

    setIsSaving(true);
    try {
      const { primaryKey, referenceKey, clearReference } =
        await images.resolveForSave(token);

      if (isEditMode && initialFlash) {
        const payload: UpdateFlashPayload = {
          title: title.trim(),
          description: description.trim() ? description.trim() : null,
          color_type: colorType,
          styles: styleTags,
          placements,
          pricing_mode: pricingMode,
          flat_price_cents:
            pricingMode === "flat"
              ? convertDollarsToCents(flatPriceDollars)
              : null,
          flat_duration_minutes:
            pricingMode === "flat"
              ? parseInt(flatDurationMinutes, 10) || null
              : null,
          deposit_cents: depositCents,
          repeatable,
          pricing_tiers: pricingMode === "per_size" ? enabledTiers : [],
        };
        if (primaryKey !== undefined) payload.s3_key = primaryKey;
        if (referenceKey !== undefined) {
          payload.reference_s3_key = referenceKey;
        } else if (clearReference) {
          payload.clear_reference_image = true;
        }

        await flashesApi.update(token, initialFlash.id, payload);
      } else {
        const payload: CreateFlashPayload = {
          title: title.trim(),
          description: description.trim() ? description.trim() : null,
          s3_key: primaryKey ?? null,
          reference_s3_key: referenceKey ?? null,
          color_type: colorType,
          styles: styleTags,
          placements,
          pricing_mode: pricingMode,
          flat_price_cents:
            pricingMode === "flat"
              ? convertDollarsToCents(flatPriceDollars)
              : null,
          flat_duration_minutes:
            pricingMode === "flat"
              ? parseInt(flatDurationMinutes, 10) || null
              : null,
          deposit_cents: depositCents,
          repeatable,
          pricing_tiers: pricingMode === "per_size" ? enabledTiers : [],
          publish,
        };
        await flashesApi.create(token, payload);
      }

      if (isEditMode) {
        displayToast(
          "Flash updated",
          "success",
          "Your changes have been saved.",
        );
      } else {
        displayToast(
          "Flash created",
          "success",
          "Your new flash is now in your flashbook.",
        );
      }

      onSaved();
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Failed to save flash.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleArchive = async () => {
    if (!token) {
      setFormError("You must be signed in.");
      return;
    }
    if (!initialFlash) return;

    setFormError(null);
    setIsTogglingArchive(true);
    try {
      await flashesApi.archive(token, initialFlash.id);
      displayToast(
        "Flash archived",
        "success",
        "It's been moved to your archived flashes and hidden from clients.",
      );
      onSaved();
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Failed to archive flash.",
      );
    } finally {
      setIsTogglingArchive(false);
    }
  };

  const handleUnarchive = async () => {
    if (!token) {
      setFormError("You must be signed in.");
      return;
    }
    if (!initialFlash) return;

    setFormError(null);
    setIsTogglingArchive(true);
    try {
      await flashesApi.unarchive(token, initialFlash.id);
      displayToast(
        "Flash unarchived",
        "success",
        "It's back in your flashbook and visible to clients again.",
      );
      onSaved();
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Failed to unarchive flash.",
      );
    } finally {
      setIsTogglingArchive(false);
    }
  };

  return {
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
    colorType,
    setColorType,
    styleTags,
    setStyleTags,
    placements,
    setPlacements,
    depositDollars,
    setDepositDollars,
    isSaving,
    isTogglingArchive,
    isArchived,
    formError,
    handleSave,
    handleArchive,
    handleUnarchive,
  };
}
