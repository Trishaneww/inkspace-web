"use client";

// Next.js
import { useState } from "react";
import Image from "next/image";

// CSS
import styles from "@/styles/dashboard/artist/Bookings.module.css";

// HTML Components
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

// Components
import { StatusBadge } from "./StatusBadge";

// Libs
import { TATTOO_STYLE_LABELS } from "@/constants/tattooStyles";
import { FLASH_SIZE_LABELS } from "@/constants/flashes";
import {
  APPOINTMENT_STATUS_META,
  APPOINTMENT_TYPE_LABELS,
  COLOR_TYPE_LABELS,
  CONSULTATION_FORMAT_LABELS,
  DEPOSIT_META,
  TYPE_LABELS,
  WAIVER_META,
} from "@/constants/bookings";
import {
  formatDateTime,
  formatDurationMinutes,
  formatLocation,
} from "@/lib/formatters";
import type { Inquiry } from "@/types/bookings";

export const InquiryDetailsPhase = ({ inquiry }: { inquiry: Inquiry }) => {
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  const deposit = DEPOSIT_META[inquiry.depositStatus];
  const waiver = WAIVER_META[inquiry.waiverStatus];

  return (
    <div className={styles.editFields}>
      {inquiry.appointment && (
        <AppointmentSummary appointment={inquiry.appointment} />
      )}

      <div className={styles.detailCard}>
        <span className={styles.detailCardTitle}>The piece</span>
        <DetailRow label="Type" value={TYPE_LABELS[inquiry.type]} />
        {inquiry.flash && (
          <DetailRow label="Design" value={inquiry.flash.title} />
        )}
        {inquiry.placement && (
          <DetailRow label="Placement" value={inquiry.placement} />
        )}
        {inquiry.flash?.sizeCode && (
          <DetailRow
            label="Size"
            value={
              FLASH_SIZE_LABELS[inquiry.flash.sizeCode] ?? inquiry.flash.sizeCode
            }
          />
        )}
        {inquiry.approxSizeInches != null && (
          <DetailRow
            label="Approx. size"
            value={`${inquiry.approxSizeInches}"`}
          />
        )}
        <DetailRow
          label="Color"
          value={COLOR_TYPE_LABELS[inquiry.colorType] ?? inquiry.colorType}
        />
        <DetailRow
          label="Location"
          value={inquiry.location ? formatLocation(inquiry.location) : "—"}
        />
        {inquiry.styles.length > 0 && (
          <div className={styles.chipRow}>
            {inquiry.styles.map((style) => (
              <span key={style} className={styles.chip}>
                {TATTOO_STYLE_LABELS[style] ?? style}
              </span>
            ))}
          </div>
        )}
        {inquiry.description && (
          <p className={styles.detailDescription}>{inquiry.description}</p>
        )}
      </div>

      {inquiry.flash ? (
        <div className={styles.detailCard}>
          <span className={styles.detailCardTitle}>Flash design</span>
          {inquiry.flash.imageUrls.length === 0 ? (
            <span className={styles.detailEmpty}>No image available.</span>
          ) : (
            <div className={styles.referenceGrid}>
              {inquiry.flash.imageUrls.map((url, index) => (
                <button
                  key={url}
                  type="button"
                  className={styles.referenceThumb}
                  onClick={() => setLightboxUrl(url)}
                  aria-label={`View flash image ${index + 1}`}
                >
                  <Image
                    src={url}
                    alt={`Flash image ${index + 1}`}
                    fill
                    unoptimized
                    className={styles.referenceImg}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className={styles.detailCard}>
          <span className={styles.detailCardTitle}>Reference photos</span>
          {inquiry.referenceImageUrls.length === 0 ? (
            <span className={styles.detailEmpty}>
              No reference photos were uploaded.
            </span>
          ) : (
            <div className={styles.referenceGrid}>
              {inquiry.referenceImageUrls.map((url, index) => (
                <button
                  key={url}
                  type="button"
                  className={styles.referenceThumb}
                  onClick={() => setLightboxUrl(url)}
                  aria-label={`View reference photo ${index + 1}`}
                >
                  <Image
                    src={url}
                    alt={`Reference photo ${index + 1}`}
                    fill
                    unoptimized
                    className={styles.referenceImg}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className={styles.detailCard}>
        <span className={styles.detailCardTitle}>Client</span>
        <DetailRow label="Name" value={inquiry.clientName} />
        <DetailRow label="Email" value={inquiry.clientEmail} />
        {inquiry.clientPhone && (
          <DetailRow label="Phone" value={inquiry.clientPhone} />
        )}
      </div>

      <div className={styles.detailCard}>
        <span className={styles.detailCardTitle}>Status</span>
        <div className={styles.detailRow}>
          <span className={styles.detailRowLabel}>Deposit</span>
          <StatusBadge label={deposit.label} variant={deposit.variant} />
        </div>
        <div className={styles.detailRow}>
          <span className={styles.detailRowLabel}>Waiver</span>
          <StatusBadge label={waiver.label} variant={waiver.variant} />
        </div>
      </div>

      {inquiry.customAnswers.length > 0 && (
        <div className={styles.detailCard}>
          <span className={styles.detailCardTitle}>Custom Questions</span>
          {inquiry.customAnswers.map((qa, index) => (
            <div key={index} className={styles.qaItem}>
              <span className={styles.qaPrompt}>{qa.prompt}</span>
              <span className={styles.qaAnswer}>{qa.answer}</span>
            </div>
          ))}
        </div>
      )}

      <ReferenceLightbox
        url={lightboxUrl}
        onClose={() => setLightboxUrl(null)}
      />
    </div>
  );
};

const AppointmentSummary = ({
  appointment,
}: {
  appointment: NonNullable<Inquiry["appointment"]>;
}) => {
  const statusMeta = APPOINTMENT_STATUS_META[appointment.status];
  return (
    <div className={styles.detailCard}>
      <div className={styles.detailTitleRow}>
        <span className={styles.detailCardTitle}>
          {APPOINTMENT_TYPE_LABELS[appointment.type]}
        </span>
        <StatusBadge label={statusMeta.label} variant={statusMeta.variant} />
      </div>
      <DetailRow
        label="When"
        value={
          appointment.scheduledStart
            ? formatDateTime(appointment.scheduledStart)
            : "Client to pick a time"
        }
      />
      <DetailRow
        label="Length"
        value={formatDurationMinutes(appointment.durationMinutes)}
      />
      {appointment.format && (
        <DetailRow
          label="Where"
          value={CONSULTATION_FORMAT_LABELS[appointment.format]}
        />
      )}
    </div>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className={styles.detailRow}>
    <span className={styles.detailRowLabel}>{label}</span>
    <span className={styles.detailRowValue}>{value}</span>
  </div>
);

interface ReferenceLightboxProps {
  url: string | null;
  onClose: () => void;
}

const ReferenceLightbox = ({ url, onClose }: ReferenceLightboxProps) => (
  <Dialog
    open={url !== null}
    onOpenChange={(open) => {
      if (!open) onClose();
    }}
  >
    <DialogContent className={styles.lightbox}>
      <DialogTitle className="sr-only">Reference photo</DialogTitle>
      {url && (
        <div className={styles.lightboxFrame}>
          <Image
            src={url}
            alt="Reference photo"
            fill
            unoptimized
            className={styles.lightboxImg}
          />
        </div>
      )}
    </DialogContent>
  </Dialog>
);
