"use client";

// CSS
import styles from "@/styles/dashboard/artist/Bookings.module.css";

// HTML Components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
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
  ReviewChips,
  ReviewRow,
  ReviewSection,
  ReviewText,
  ReviewTypeBox,
} from "@/components/dashboard/artist/bookings/ReviewPrimitives";

// Libs
import { buildScheduleReview } from "@/lib/inquiryScheduling";
import { useAuth } from "@/lib/auth";
import { formatInitials, formatLocation } from "@/lib/formatters";
import { describePiece } from "@/lib/bookings";
import { CONSULTATION_FORMAT_LABELS } from "@/constants/bookings";
import { TATTOO_STYLE_LABELS } from "@/constants/tattooStyles";

// Types
import type {
  AppointmentType,
  ConsultationFormat,
  Inquiry,
  InquirySchedulingForm,
} from "@/types/bookings";

const FORMAT_ICON: Record<ConsultationFormat, LucideIcon> = {
  in_person: Users,
  online: Video,
  phone: Phone,
};

interface InquiryReviewPhaseProps {
  inquiry: Inquiry;
  type: AppointmentType;
  form: InquirySchedulingForm;
  isReschedule: boolean;
}

export const InquiryReviewPhase = ({
  inquiry,
  type,
  form,
  isReschedule,
}: InquiryReviewPhaseProps) => {
  const { user } = useAuth();
  const review = buildScheduleReview(inquiry, type, form, isReschedule);

  const organizer = user ? `${user.firstName} ${user.lastName}`.trim() : "You";
  const piece = describePiece(inquiry);

  const isRemoteConsultation =
    type === "consultation" &&
    (review.format === "online" || review.format === "phone");
  const location =
    inquiry.location && !isRemoteConsultation
      ? formatLocation(inquiry.location)
      : null;

  const typeIcon =
    type === "session"
      ? CalendarClock
      : FORMAT_ICON[review.format ?? "in_person"];
  const action = isReschedule ? "Reschedule" : "Book";
  const bookingTypeLabel = type === "session" ? "session" : "consultation";

  return (
    <div className={styles.editFields}>
      <ReviewCard>
        <ReviewTypeBox
          icon={typeIcon}
          label={`${action} ${bookingTypeLabel}`}
          hint={`${review.durationLabel} · with ${review.clientName}`}
        />

        <ReviewSection>
          {review.clientScheduled ? (
            <ReviewRow icon={CalendarClock}>
              {review.clientName.split(" ")[0]} picks their own start time
            </ReviewRow>
          ) : (
            <>
              <ReviewRow icon={Clock}>{review.timeLabel}</ReviewRow>
              <ReviewRow icon={CalendarDays}>{review.dateLabel}</ReviewRow>
            </>
          )}
          {location && <ReviewRow icon={MapPin}>{location}</ReviewRow>}
          {review.format && (
            <ReviewRow icon={FORMAT_ICON[review.format]}>
              {CONSULTATION_FORMAT_LABELS[review.format]}
            </ReviewRow>
          )}
        </ReviewSection>

        <ReviewSection label="The piece">
          <ReviewRow icon={PenTool}>{piece}</ReviewRow>
          {inquiry.styles.length > 0 && (
            <ReviewChips
              items={inquiry.styles.map(
                (style) => TATTOO_STYLE_LABELS[style] ?? style,
              )}
            />
          )}
          {inquiry.description && (
            <ReviewText>{inquiry.description}</ReviewText>
          )}
        </ReviewSection>

        <ReviewSection label="People">
          <ReviewRow
            leading={
              <Avatar size="sm">
                {user?.avatarUrl && (
                  <AvatarImage src={user.avatarUrl} alt={organizer} />
                )}
                <AvatarFallback>{formatInitials(organizer)}</AvatarFallback>
              </Avatar>
            }
          >
            {organizer} (you)
          </ReviewRow>
          <ReviewRow icon={Mail}>{inquiry.clientEmail}</ReviewRow>
        </ReviewSection>
      </ReviewCard>
    </div>
  );
};
