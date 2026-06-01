"use client";

// Next.js
import { useState, type ChangeEvent } from "react";

// Libs
import { uploadFlashImage } from "@/lib/api/flashes";
import type {
  Flash,
  FlashImagesController,
  ResolvedFlashImages,
} from "@/types/flash";

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

  const handleRemoveReference = () => {
    setReferenceFile(null);
    setReferencePreviewUrl(null);
  };

  const resolveForSave = async (
    token: string,
  ): Promise<ResolvedFlashImages> => {
    let primaryKey: string | undefined;
    if (primaryFile) {
      primaryKey = await uploadFlashImage(token, primaryFile);
    }
    let referenceKey: string | undefined;
    if (referenceFile) {
      referenceKey = await uploadFlashImage(token, referenceFile);
    }

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
