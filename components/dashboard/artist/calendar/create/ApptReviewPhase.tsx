"use client";

// CSS
import styles from "@/styles/dashboard/artist/CreateAppointment.module.css";

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
  ReviewRow,
  ReviewSection,
  ReviewText,
  ReviewTypeBox,
} from "@/components/dashboard/artist/bookings/ReviewPrimitives";

// Libs
import { addMinutes, format } from "date-fns";
import { useAuth } from "@/lib/auth";
import { combineDateTime } from "@/lib/inquiryScheduling";
import { formatDurationMinutes, formatInitials } from "@/lib/formatters";
import { describeFormPiece } from "@/lib/calendar";
import { CONSULTATION_FORMAT_LABELS } from "@/constants/bookings";

// Types
import type { ConsultationFormat } from "@/types/bookings";
import type { ManualAppointmentForm } from "@/types/calendar";
import type { Location } from "@/types/settings";

const FORMAT_ICON: Record<ConsultationFormat, LucideIcon> = {
  in_person: Users,
  online: Video,
  phone: Phone,
};

interface ApptReviewPhaseProps {
  form: ManualAppointmentForm;
  locations: Location[];
}

export const ApptReviewPhase = ({ form, locations }: ApptReviewPhaseProps) => {
  const { user } = useAuth();

  const isSession = form.type === "session";
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
                <AvatarFallback>{formatInitials(organizer)}</AvatarFallback>
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
      </ReviewCard>
    </div>
  );
};
