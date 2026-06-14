"use client";

// Next.js
import { useEffect, useState, type ReactNode } from "react";

// CSS
import styles from "@/styles/dashboard/artist/Bookings.module.css";

// HTML Components
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

// Components
import { InquiryDetailView } from "./InquiryDetailView";

// Libs
import { bookingsApi } from "@/lib/api/bookings";
import { useAuth } from "@/lib/auth";
import type { Inquiry, InquiryActionId } from "@/types/bookings";

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

  if (isLoading) {
    return <DetailShell>Loading inquiry…</DetailShell>;
  }
  if (loadError || !inquiry) {
    return <DetailShell>{loadError ?? "Inquiry not found."}</DetailShell>;
  }

  return (
    <InquiryDetailView
      inquiry={inquiry}
      setInquiry={setInquiry}
      onActed={onActed}
      actingId={actingId}
      setActingId={setActingId}
    />
  );
};

const DetailShell = ({ children }: { children: ReactNode }) => (
  <div className={styles.editForm}>
    <SheetTitle className={styles.detailTitle}>Booking request</SheetTitle>
    <div className={styles.detailState}>{children}</div>
  </div>
);
