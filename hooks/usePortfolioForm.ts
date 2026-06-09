"use client";

// React
import { useState } from "react";

// Libs
import { portfolioApi } from "@/lib/api/portfolio";
import { useAuth } from "@/lib/auth";
import { displayToast } from "@/lib/toast";
import type {
  CreatePortfolioPayload,
  PortfolioColorType,
  PortfolioImagesController,
  PortfolioItem,
  UpdatePortfolioPayload,
} from "@/types/portfolio";

interface UsePortfolioFormProps {
  initialItem: PortfolioItem | null;
  images: PortfolioImagesController;
  onSaved: () => void;
}

export function usePortfolioForm({
  initialItem,
  images,
  onSaved,
}: UsePortfolioFormProps) {
  const { token } = useAuth();
  const isEditMode = initialItem !== null;
  const isArchived = initialItem?.status === "archived";

  const [title, setTitle] = useState(initialItem?.title ?? "");
  const [description, setDescription] = useState(
    initialItem?.description ?? "",
  );
  const [completionDate, setCompletionDate] = useState(
    initialItem?.completionDate ?? "",
  );
  const [styles, setStyles] = useState<string[]>(initialItem?.styles ?? []);
  const [placement, setPlacement] = useState(initialItem?.placement ?? "");
  const [colorType, setColorType] = useState<PortfolioColorType | "">(
    initialItem?.colorType ?? "",
  );
  const [approxSizeInches, setApproxSizeInches] = useState(
    initialItem?.approxSizeInches?.toString() ?? "",
  );
  const [healed, setHealed] = useState(initialItem?.healed ?? false);
  const [sessionCount, setSessionCount] = useState(
    initialItem?.sessionCount?.toString() ?? "",
  );
  const [totalHours, setTotalHours] = useState(
    initialItem?.totalMinutes != null
      ? (initialItem.totalMinutes / 60).toString()
      : "",
  );

  const [isSaving, setIsSaving] = useState(false);
  const [isTogglingArchive, setIsTogglingArchive] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

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
    if (!images.hasImages) {
      setFormError("Add at least one photo.");
      return;
    }
    setIsSaving(true);
    try {
      const imageKeys = await images.resolveKeys(token);
      if (imageKeys.length === 0) {
        setFormError("Add at least one photo.");
        setIsSaving(false);
        return;
      }

      const basePayload = {
        title: title.trim(),
        description: description.trim() ? description.trim() : null,
        completionDate: completionDate || null,
        imageKeys,
        styles,
        placement: placement.trim() ? placement.trim() : null,
        colorType: colorType ? colorType : null,
        approxSizeInches: parsePositiveInt(approxSizeInches),
        healed,
        sessionCount: parsePositiveInt(sessionCount),
        totalMinutes: parseHoursAsMinutes(totalHours),
      };

      if (isEditMode && initialItem) {
        const payload: UpdatePortfolioPayload = basePayload;
        await portfolioApi.update(token, initialItem.id, payload);
        displayToast(
          "Piece updated",
          "success",
          "Your changes have been saved.",
        );
      } else {
        const payload: CreatePortfolioPayload = { ...basePayload, publish };
        await portfolioApi.create(token, payload);
        displayToast(
          "Piece added",
          "success",
          publish ? "It's now live on your portfolio." : "Saved as a draft.",
        );
      }

      onSaved();
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Failed to save piece.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleArchive = async () => {
    if (!token || !initialItem) return;
    setFormError(null);
    setIsTogglingArchive(true);
    try {
      await portfolioApi.archive(token, initialItem.id);
      displayToast(
        "Piece archived",
        "success",
        "It's hidden from your public portfolio.",
      );
      onSaved();
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Failed to archive piece.",
      );
    } finally {
      setIsTogglingArchive(false);
    }
  };

  const handleUnarchive = async () => {
    if (!token || !initialItem) return;
    setFormError(null);
    setIsTogglingArchive(true);
    try {
      await portfolioApi.unarchive(token, initialItem.id);
      displayToast(
        "Piece unarchived",
        "success",
        "It's back in your portfolio.",
      );
      onSaved();
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Failed to unarchive piece.",
      );
    } finally {
      setIsTogglingArchive(false);
    }
  };

  const handleDelete = async () => {
    if (!token || !initialItem) return;
    setFormError(null);
    setIsDeleting(true);
    try {
      await portfolioApi.delete(token, initialItem.id);
      displayToast(
        "Piece deleted",
        "success",
        "It's been permanently removed.",
      );
      onSaved();
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Failed to delete piece.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isEditMode,
    isArchived,
    title,
    setTitle,
    description,
    setDescription,
    completionDate,
    setCompletionDate,
    styles,
    setStyles,
    placement,
    setPlacement,
    colorType,
    setColorType,
    approxSizeInches,
    setApproxSizeInches,
    healed,
    setHealed,
    sessionCount,
    setSessionCount,
    totalHours,
    setTotalHours,
    isSaving,
    isTogglingArchive,
    isDeleting,
    formError,
    handleSave,
    handleArchive,
    handleUnarchive,
    handleDelete,
  };
}

function parsePositiveInt(input: string): number | null {
  const n = parseInt(input, 10);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function parseHoursAsMinutes(input: string): number | null {
  const n = Number(input);
  return Number.isFinite(n) && n > 0 ? Math.round(n * 60) : null;
}
