"use client";

// React
import { useEffect, useState } from "react";
import Image from "next/image";

// CSS
import styles from "@/styles/dashboard/artist/Bookings.module.css";

// HTML Components
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

// Components
import { StatusBadge } from "./StatusBadge";

// Libs
import { bookingsApi } from "@/lib/api/bookings";
import { TATTOO_STYLE_LABELS } from "@/constants/tattooStyles";
import { useAuth } from "@/lib/auth";
import { displayToast } from "@/lib/toast";
import {
  COLOR_TYPE_LABELS,
  DEPOSIT_META,
  STATUS_META,
  TYPE_LABELS,
  WAIVER_META,
} from "@/constants/bookings";
import { formatRelativeDate, getInquiryActions } from "@/lib/bookings";
import type { Inquiry, InquiryAction, InquiryActionId } from "@/types/bookings";
import { formatLocation } from "@/lib/formatters";

interface InquiryDetailSheetProps {
  inquiryId: string | null;
  onClose: () => void;
  onActed: () => void;
}

export const InquiryDetailSheet = ({
  inquiryId,
  onClose,
  onActed,
}: InquiryDetailSheetProps) => {
  return (
    <Sheet
      open={Boolean(inquiryId)}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent side="right" className={styles.editSheet} showCloseButton>
        {inquiryId && (
          <InquiryDetailContent
            key={inquiryId}
            inquiryId={inquiryId}
            onActed={onActed}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};

interface InquiryDetailContentProps {
  inquiryId: string;
  onActed: () => void;
}

const InquiryDetailContent = ({
  inquiryId,
  onActed,
}: InquiryDetailContentProps) => {
  const { token } = useAuth();

  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actingId, setActingId] = useState<InquiryActionId | null>(null);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    let active = true;
    bookingsApi
      .get(token, inquiryId)
      .then((data) => active && setInquiry(data))
      .catch(
        (err) =>
          active &&
          setLoadError(err instanceof Error ? err.message : "Failed to load"),
      )
      .finally(() => active && setIsLoading(false));
    return () => {
      active = false;
    };
  }, [inquiryId, token]);

  const runAction = async (action: InquiryActionId) => {
    if (!token || !inquiry) return;
    setActingId(action);
    try {
      if (action === "accept") {
        setInquiry(await bookingsApi.accept(token, inquiry.id));
        displayToast("Booking accepted", "success");
        onActed();
      } else if (action === "decline") {
        setInquiry(await bookingsApi.decline(token, inquiry.id));
        displayToast("Booking declined", "success");
        onActed();
      } else if (action === "reopen") {
        setInquiry(await bookingsApi.reopen(token, inquiry.id));
        displayToast("Booking reopened", "success");
        onActed();
      } else {
        displayToast("Coming soon", "info");
      }
    } catch (err) {
      displayToast(
        err instanceof Error ? err.message : "Action failed",
        "error",
      );
    } finally {
      setActingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.editForm}>
        <SheetTitle className={styles.detailTitle}>Booking request</SheetTitle>
        <div className={styles.detailState}>Loading inquiry…</div>
      </div>
    );
  }

  if (loadError || !inquiry) {
    return (
      <div className={styles.editForm}>
        <SheetTitle className={styles.detailTitle}>Booking request</SheetTitle>
        <div className={styles.detailState}>
          {loadError ?? "Inquiry not found."}
        </div>
      </div>
    );
  }

  const status = STATUS_META[inquiry.status];
  const deposit = DEPOSIT_META[inquiry.depositStatus];
  const waiver = WAIVER_META[inquiry.waiverStatus];
  const actions = getInquiryActions(inquiry);

  return (
    <div className={styles.editForm}>
      <div className={styles.detailHeader}>
        <div className={styles.detailTitleRow}>
          <SheetTitle className={styles.detailTitle}>
            {inquiry.clientName}
          </SheetTitle>
          <StatusBadge label={status.label} variant={status.variant} />
        </div>
        <span className={styles.detailSub}>
          {TYPE_LABELS[inquiry.type]} request · Submitted{" "}
          {formatRelativeDate(inquiry.createdAt)}
        </span>
      </div>

      <div className={styles.editFields}>
        <div className={styles.detailCard}>
          <span className={styles.detailCardTitle}>The piece</span>
          <DetailRow label="Type" value={TYPE_LABELS[inquiry.type]} />
          {inquiry.placement && (
            <DetailRow label="Placement" value={inquiry.placement} />
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
      </div>

      <InquirySheetFooter
        actions={actions}
        actingId={actingId}
        onAction={runAction}
      />

      <ReferenceLightbox
        url={lightboxUrl}
        onClose={() => setLightboxUrl(null)}
      />
    </div>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className={styles.detailRow}>
    <span className={styles.detailRowLabel}>{label}</span>
    <span className={styles.detailRowValue}>{value}</span>
  </div>
);

interface InquirySheetFooterProps {
  actions: InquiryAction[];
  actingId: InquiryActionId | null;
  onAction: (action: InquiryActionId) => void;
}

const InquirySheetFooter = ({
  actions,
  actingId,
  onAction,
}: InquirySheetFooterProps) => {
  if (actions.length === 0) return null;

  return (
    <div className={styles.editFooter}>
      {actions.map((action) => {
        const isAccept = action.id === "accept";
        return (
          <Button
            key={action.id}
            type="button"
            variant={
              action.destructive
                ? "destructive"
                : isAccept
                  ? "default"
                  : "outline"
            }
            className={isAccept ? styles.acceptBtn : undefined}
            disabled={actingId !== null}
            onClick={() => onAction(action.id)}
          >
            <action.icon size={16} className={styles.actionBtnIcon} />
            {action.label}
            {actingId === action.id && (
              <Loader2 size={16} className="animate-spin" />
            )}
          </Button>
        );
      })}
    </div>
  );
};

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
