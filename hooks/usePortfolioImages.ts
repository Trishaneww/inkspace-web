"use client";

// Next.js
import { useState, type ChangeEvent } from "react";

// Libs
import { uploadPortfolioImage } from "@/lib/api/portfolio";
import type {
  PortfolioImageSlot,
  PortfolioImagesController,
  PortfolioItem,
} from "@/types/portfolio";

const MAX_IMAGES = 3;

export function usePortfolioImages(
  initialItem: PortfolioItem | null,
): PortfolioImagesController {
  const [slots, setSlots] = useState<PortfolioImageSlot[]>(() =>
    initialItem
      ? initialItem.imageKeys.map((key, index) => ({
          id: key,
          previewUrl: initialItem.imageUrls[index] ?? "",
          key,
        }))
      : [],
  );

  const handleAddFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = ""; // let the same file be re-picked after removal
    if (files.length === 0) return;

    setSlots((prev) => {
      const room = MAX_IMAGES - prev.length;
      const added = files.slice(0, room).map((file) => ({
        id: crypto.randomUUID(),
        previewUrl: URL.createObjectURL(file),
        file,
      }));
      return [...prev, ...added];
    });
  };

  const handleRemove = (id: string) =>
    setSlots((prev) => prev.filter((slot) => slot.id !== id));

  // Upload pending files in slot order, returning the ordered keys.
  const resolveKeys = async (token: string): Promise<string[]> => {
    const keys: string[] = [];
    for (const slot of slots) {
      if (slot.key) {
        keys.push(slot.key);
      } else if (slot.file) {
        keys.push(await uploadPortfolioImage(token, slot.file));
      }
    }
    return keys;
  };

  return {
    slots,
    canAddMore: slots.length < MAX_IMAGES,
    hasImages: slots.length > 0,
    handleAddFiles,
    handleRemove,
    resolveKeys,
  };
}
