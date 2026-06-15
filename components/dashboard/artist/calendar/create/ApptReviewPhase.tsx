"use client";

// CSS
import styles from "@/styles/dashboard/artist/CreateAppointment.module.css";

// HTML Components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
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

// Libs
import { addMinutes, format } from "date-fns";
import { useAuth } from "@/lib/auth";
import { combineDateTime } from "@/lib/inquiryScheduling";
import { formatDurationMinutes, formatInitials } from "@/lib/formatters";
import { CONSULTATION_FORMAT_LABELS } from "@/constants/bookings";
import { describeFormPiece } from "@/lib/calendar";

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
  const isRemoteConsult =
    !isSession && (form.format === "online" || form.format === "phone");
  const locationLabel =
    location && !isRemoteConsult
      ? [location.address, location.city, location.country]
          .filter(Boolean)
          .join(", ")
      : null;

  const piece = describeFormPiece(form);

  return (
    <div className={styles.phase}>
      <div className={styles.reviewCard}>
        <div className={styles.reviewHead}>
          <span className={styles.reviewType}>
            {isSession ? "Tattoo session" : "Consultation"}
          </span>
          <span className={styles.reviewSub}>
            {formatDurationMinutes(durationMinutes)} · with {form.clientName}
          </span>
        </div>

        <div className={styles.reviewRows}>
          <ReviewRow
            icon={Clock}
            value={`${format(startDate, "h:mm a")} - ${format(endDate, "h:mm a")}`}
          />
          <ReviewRow
            icon={CalendarDays}
            value={format(startDate, "EEEE, MMMM d, yyyy")}
          />
          {locationLabel && <ReviewRow icon={MapPin} value={locationLabel} />}
          {!isSession && (
            <ReviewRow
              icon={FORMAT_ICON[form.format]}
              value={CONSULTATION_FORMAT_LABELS[form.format]}
            />
          )}
        </div>

        {isSession && (piece || form.description.trim()) && (
          <div className={styles.reviewSection}>
            <span className={styles.reviewSectionLabel}>The piece</span>
            {piece && <ReviewRow icon={PenTool} value={piece} />}
            {form.description.trim() && (
              <p className={styles.reviewNote}>{form.description}</p>
            )}
          </div>
        )}

        <div className={styles.reviewSection}>
          <span className={styles.reviewSectionLabel}>People</span>
          <div className={styles.reviewRow}>
            <Avatar size="sm">
              {user?.avatarUrl && (
                <AvatarImage src={user.avatarUrl} alt={organizer} />
              )}
              <AvatarFallback>{formatInitials(organizer)}</AvatarFallback>
            </Avatar>
            <span>{organizer} (you)</span>
          </div>
          <ReviewRow icon={Mail} value={form.clientEmail} />
          {form.clientPhone.trim() && (
            <ReviewRow icon={Phone} value={form.clientPhone} />
          )}
        </div>
      </div>
    </div>
  );
};

const ReviewRow = ({
  icon: Icon,
  value,
}: {
  icon: LucideIcon;
  value: string;
}) => (
  <div className={styles.reviewRow}>
    <Icon size={18} className={styles.reviewRowIcon} />
    <span>{value}</span>
  </div>
);
