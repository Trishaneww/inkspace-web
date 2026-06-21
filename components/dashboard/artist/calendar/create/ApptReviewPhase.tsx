"use client";

// CSS
import styles from "@/styles/dashboard/artist/CreateAppointment.module.css";

// HTML Components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Banknote,
  CalendarClock,
  CalendarDays,
  Clock,
  Mail,
  MapPin,
  PenTool,
  Phone,
  Users,
  Video,
  type LucideIcon,
} from "lucide-react";

// Components
import {
  ReviewCard,
  ReviewLineItem,
  ReviewRow,
  ReviewSection,
  ReviewText,
  ReviewTypeBox,
} from "@/components/dashboard/artist/bookings/ReviewPrimitives";

// Libs
import { addMinutes, format } from "date-fns";
import { useAuth } from "@/lib/auth";
import { combineDateTime, parseDepositCents } from "@/lib/inquiryScheduling";
import { formatDurationMinutes, formatPrice } from "@/lib/formatters";
import { describeFormPiece } from "@/lib/calendar";
import { getPaymentBreakdown } from "@/lib/payments";
import { CONSULTATION_FORMAT_LABELS } from "@/constants/bookings";
import {
  FEE_PAYER_NOTE,
  PLATFORM_FEE_PERCENT_LABEL,
} from "@/constants/payments";
import { getInitials } from "@/lib/avatar";

// Types
import type { ConsultationFormat } from "@/types/bookings";
import type { ManualAppointmentForm } from "@/types/calendar";
import type { Location, PlatformFeePayer } from "@/types/settings";

const FORMAT_ICON: Record<ConsultationFormat, LucideIcon> = {
  in_person: Users,
  online: Video,
  phone: Phone,
};

interface ApptReviewPhaseProps {
  form: ManualAppointmentForm;
  locations: Location[];
  currency: string;
  feePayer: PlatformFeePayer;
}

export const ApptReviewPhase = ({
  form,
  locations,
  currency,
  feePayer,
}: ApptReviewPhaseProps) => {
  const { user } = useAuth();

  const isSession = form.type === "session";
  const depositCents = isSession ? parseDepositCents(form.depositAmount) : 0;
  const depositBreakdown =
    depositCents > 0 ? getPaymentBreakdown(depositCents, feePayer) : null;
  const feeAddedToClient = feePayer !== "artist";
  const durationMinutes =
    isSession && form.startMinute !== null && form.endMinute !== null
      ? form.endMinute - form.startMinute
      : form.consultationDurationMinutes;
  const startDate =
    form.date !== null && form.startMinute !== null
      ? new Date(combineDateTime(form.date, form.startMinute))
      : new Date();
  const endDate = addMinutes(startDate, durationMinutes);

  const organizer = user ? `${user.firstName} ${user.lastName}`.trim() : "You";
  const location = locations.find((l) => l.id === form.locationId);
  const isRemoteConsultation =
    !isSession && (form.format === "online" || form.format === "phone");
  const locationLabel =
    location && !isRemoteConsultation
      ? [location.address, location.city, location.country]
          .filter(Boolean)
          .join(", ")
      : null;

  const piece = describeFormPiece(form);
  const typeIcon = isSession ? CalendarClock : FORMAT_ICON[form.format];

  return (
    <div className={styles.phase}>
      <ReviewCard>
        <ReviewTypeBox
          icon={typeIcon}
          label={isSession ? "New session" : "New consultation"}
          hint={`${formatDurationMinutes(durationMinutes)} · with ${form.clientName}`}
        />

        <ReviewSection>
          <ReviewRow icon={Clock}>
            {`${format(startDate, "h:mm a")} - ${format(endDate, "h:mm a")}`}
          </ReviewRow>
          <ReviewRow icon={CalendarDays}>
            {format(startDate, "EEEE, MMMM d, yyyy")}
          </ReviewRow>
          {locationLabel && (
            <ReviewRow icon={MapPin}>{locationLabel}</ReviewRow>
          )}
          {!isSession && (
            <ReviewRow icon={FORMAT_ICON[form.format]}>
              {CONSULTATION_FORMAT_LABELS[form.format]}
            </ReviewRow>
          )}
        </ReviewSection>

        {isSession && (piece || form.description.trim()) && (
          <ReviewSection label="The piece">
            {piece && <ReviewRow icon={PenTool}>{piece}</ReviewRow>}
            {form.description.trim() && (
              <ReviewText>{form.description}</ReviewText>
            )}
          </ReviewSection>
        )}

        <ReviewSection label="People">
          <ReviewRow
            leading={
              <Avatar size="sm">
                {user?.avatarUrl && (
                  <AvatarImage src={user.avatarUrl} alt={organizer} />
                )}
                <AvatarFallback>{getInitials(organizer)}</AvatarFallback>
              </Avatar>
            }
          >
            {organizer} (you)
          </ReviewRow>
          <ReviewRow icon={Mail}>{form.clientEmail}</ReviewRow>
          {form.clientPhone.trim() && (
            <ReviewRow icon={Phone}>{form.clientPhone}</ReviewRow>
          )}
        </ReviewSection>

        {isSession && (
          <ReviewSection label="Deposit">
            {depositBreakdown ? (
              <>
                <ReviewLineItem
                  label="Deposit"
                  value={formatPrice(depositBreakdown.amountCents, currency)}
                />
                <ReviewLineItem
                  label={`Platform fee (${PLATFORM_FEE_PERCENT_LABEL})`}
                  note={FEE_PAYER_NOTE[feePayer]}
                  value={`${feeAddedToClient ? "+" : ""}${formatPrice(depositBreakdown.platformFeeCents, currency)}`}
                />
                <ReviewLineItem
                  label="Client pays"
                  value={formatPrice(depositBreakdown.clientChargeCents, currency)}
                  variant="total"
                />
                <ReviewLineItem
                  label="You receive"
                  value={formatPrice(depositBreakdown.artistNetCents, currency)}
                  variant="muted"
                />
              </>
            ) : (
              <ReviewRow icon={Banknote}>No deposit</ReviewRow>
            )}
          </ReviewSection>
        )}
      </ReviewCard>
    </div>
  );
};
