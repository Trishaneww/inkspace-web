"use client";

// CSS
import ob from "@/styles/onboarding/Onboarding.module.css";
import bk from "@/styles/book/BookingFlow.module.css";

// HTML Components
import { DialogTitle } from "@/components/ui/dialog";
import { Check } from "lucide-react";

// Libs
import { BOOKING_FLOW_PHASE_META } from "@/constants/bookingFlow";
import { BookingFlowPhase } from "@/types/bookingFlow";

export const BookingSuccess = () => {
  const { lead, rest } = BOOKING_FLOW_PHASE_META[BookingFlowPhase.Completed];

  return (
    <div className={bk.successColumn}>
      <span className={bk.successIcon} aria-hidden>
        <Check size={28} />
      </span>
      <DialogTitle className={ob.heading}>
        <span className={ob.headingLead}>{lead}</span> {rest}
      </DialogTitle>
    </div>
  );
};
