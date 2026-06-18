"use client";

// Next.js
import type { ReactNode } from "react";

// CSS
import ob from "@/styles/onboarding/Onboarding.module.css";
import styles from "@/styles/book/BookingFlow.module.css";

// HTML Components
import { DialogTitle } from "@/components/ui/dialog";

interface DetailLayoutProps {
  lead: string;
  rest: string;
  media: ReactNode;
  children: ReactNode;
}

export const DetailLayout = ({
  lead,
  rest,
  media,
  children,
}: DetailLayoutProps) => {
  return (
    <div className={styles.layout}>
      <div className={styles.media}>
        <DialogTitle className={ob.heading}>
          <span className={ob.headingLead}>{lead}</span> {rest}
        </DialogTitle>
        {media}
      </div>
      <div className={styles.info}>{children}</div>
    </div>
  );
};
