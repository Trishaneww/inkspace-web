"use client";

// Next.js
import { useRef, useState, type ChangeEvent } from "react";

// Libs
import { openBookApi } from "@/lib/api/openBook";
import { ALLOWED_IMAGE_TYPES, MAX_REFERENCES } from "@/constants/bookingFlow";
import type {
  ReferenceImage,
  ReferenceUploadsController,
} from "@/types/bookingFlow";

export const useReferenceUploads = (
  slug: string,
  onError: (message: string | null) => void,
): ReferenceUploadsController => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [references, setReferences] = useState<ReferenceImage[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    onError(null);

    for (const file of files) {
      if (references.length >= MAX_REFERENCES) {
        onError(`You can attach up to ${MAX_REFERENCES} reference images.`);
        break;
      }
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        onError("Reference images must be JPEG, PNG, or WebP.");
        continue;
      }
      setUploading(true);
      try {
        const { url, key } = await openBookApi.presignReference(
          slug,
          file.type,
        );
        const upload = await fetch(url, {
          method: "PUT",
          headers: { "Content-Type": file.type },
          body: file,
        });
        if (!upload.ok) throw new Error("upload failed");
        setReferences((prev) => [
          ...prev,
          { key, previewUrl: URL.createObjectURL(file) },
        ]);
      } catch {
        onError("Couldn't upload that image. Please try again.");
      } finally {
        setUploading(false);
      }
    }
  };

  const removeReference = (key: string) =>
    setReferences((prev) => prev.filter((reference) => reference.key !== key));

  const reset = () => {
    setReferences([]);
    setUploading(false);
  };

  return {
    references,
    uploading,
    canAddMore: references.length < MAX_REFERENCES,
    fileInputRef,
    handleFiles,
    removeReference,
    reset,
  };
};
