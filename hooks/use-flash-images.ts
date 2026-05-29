"use client";

// Next.js
import { useState, type ChangeEvent } from "react";

// Libs
import { uploadFlashImage } from "@/lib/api/flashes";

// Types
import type { Flash, FlashImagesController, ResolvedFlashImages } from "@/types/flash";

// useFlashImages owns the primary + reference image pickers: the picked File
// objects, their preview URLs, and the upload-on-save flow. A reference photo
// is single-slot, so removing it clears the preview and — for an existing
// flash — signals the API to drop the stored image.
export function useFlashImages(
  initialFlash: Flash | null,
): FlashImagesController {
  const [primaryFile, setPrimaryFile] = useState<File | null>(null);
  const [primaryPreviewUrl, setPrimaryPreviewUrl] = useState<string | null>(
    initialFlash?.image_url ?? null,
  );
  const [referenceFile, setReferenceFile] = useState<File | null>(null);
  const [referencePreviewUrl, setReferencePreviewUrl] = useState<string | null>(
    initialFlash?.reference_image_url ?? null,
  );

  const handlePrimaryFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setPrimaryFile(file);
    setPrimaryPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  const handleReferenceFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setReferenceFile(file);
    setReferencePreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  // Clears whatever reference photo is currently shown — a freshly picked
  // file or the one loaded from an existing flash. resolveForSave then sees
  // the empty slot and asks the API to remove it.
  const handleRemoveReference = () => {
    setReferenceFile(null);
    setReferencePreviewUrl(null);
  };

  const resolveForSave = async (
    token: string,
  ): Promise<ResolvedFlashImages> => {
    // Upload any newly picked files first so we have s3_keys to send.
    let primaryKey: string | undefined;
    if (primaryFile) {
      primaryKey = await uploadFlashImage(token, primaryFile);
    }
    let referenceKey: string | undefined;
    if (referenceFile) {
      referenceKey = await uploadFlashImage(token, referenceFile);
    }

    // Had a saved reference, no new one uploaded, preview now empty — the
    // artist removed it.
    const clearReference =
      Boolean(initialFlash?.reference_image_url) &&
      !referenceFile &&
      !referencePreviewUrl;

    return { primaryKey, referenceKey, clearReference };
  };

  return {
    primaryPreviewUrl,
    referencePreviewUrl,
    hasPrimaryImage: Boolean(primaryFile || primaryPreviewUrl),
    handlePrimaryFileChange,
    handleReferenceFileChange,
    handleRemoveReference,
    resolveForSave,
  };
}
