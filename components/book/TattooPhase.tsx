"use client";

// CSS
import ob from "@/styles/onboarding/Onboarding.module.css";
import bk from "@/styles/book/BookingFlow.module.css";

// HTML Components
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, Loader2, X } from "lucide-react";

// Libs
import type {
  BookingFlowFormState,
  ReferenceUploadsController,
  UpdateBookingForm,
} from "@/types/bookingFlow";

interface TattooPhaseProps {
  form: BookingFlowFormState;
  update: UpdateBookingForm;
  uploads: ReferenceUploadsController;
}

export const TattooPhase = ({ form, update, uploads }: TattooPhaseProps) => {
  const {
    references,
    uploading,
    canAddMore,
    fileInputRef,
    handleFiles,
    removeReference,
  } = uploads;

  return (
    <>
      <div className={ob.field}>
        <Label htmlFor="ob-description">What do you want?</Label>
        <Textarea
          id="ob-description"
          className={bk.textarea}
          value={form.description}
          placeholder="Describe your idea — subject, style, vibe, anything that helps."
          onChange={(e) => update({ description: e.target.value })}
        />
      </div>

      <div className={ob.field}>
        <Label>Reference photos</Label>
        <p className={ob.reassure}>
          Flash, sketches, or style references that show what you&apos;re after.
        </p>
        {canAddMore && (
          <button
            type="button"
            className={bk.dropzone}
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <Loader2 size={28} className="animate-spin" />
            ) : (
              <ImagePlus size={28} className={bk.dropzoneIcon} />
            )}
            <span className={bk.dropzoneLabel}>Upload photo</span>
          </button>
        )}
        {references.length > 0 && (
          <div className={bk.referenceGrid}>
            {references.map((reference) => (
              <div key={reference.key} className={bk.referenceThumb}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={reference.previewUrl}
                  alt="Reference"
                  className={bk.referenceImage}
                />
                <Button
                  type="button"
                  className={bk.referenceRemove}
                  onClick={() => removeReference(reference.key)}
                  aria-label="Remove image"
                >
                  <X size={14} />
                </Button>
              </div>
            ))}
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className={bk.hiddenInput}
          onChange={handleFiles}
        />
      </div>
    </>
  );
};
