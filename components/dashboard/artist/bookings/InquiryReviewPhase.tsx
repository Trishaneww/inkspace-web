"use client";

// CSS
import styles from "@/styles/dashboard/artist/Bookings.module.css";

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
import { buildScheduleReview } from "@/lib/inquiryScheduling";
import { useAuth } from "@/lib/auth";
import { formatInitials, formatLocation } from "@/lib/formatters";
import { CONSULTATION_FORMAT_LABELS } from "@/constants/bookings";
import { TATTOO_STYLE_LABELS } from "@/constants/tattooStyles";
import type {
  AppointmentType,
  ConsultationFormat,
  Inquiry,
  InquirySchedulingForm,
} from "@/types/bookings";
import { describePiece } from "@/lib/bookings";

const FORMAT_ICON: Record<ConsultationFormat, LucideIcon> = {
  in_person: Users,
  online: Video,
  phone: Phone,
};

interface InquiryReviewPhaseProps {
  inquiry: Inquiry;
  type: AppointmentType;
  form: InquirySchedulingForm;
}

export const InquiryReviewPhase = ({
  inquiry,
  type,
  form,
}: InquiryReviewPhaseProps) => {
  const { user } = useAuth();
  const review = buildScheduleReview(inquiry, type, form);

  const organizer = user ? `${user.firstName} ${user.lastName}`.trim() : "You";
  const piece = describePiece(inquiry);

  const isRemoteConsult =
    type === "consultation" &&
    (review.format === "online" || review.format === "phone");
  const location =
    inquiry.location && !isRemoteConsult
      ? formatLocation(inquiry.location)
      : null;

  return (
    <div className={styles.editFields}>
      <div className={styles.reviewCard}>
        <div className={styles.reviewHead}>
          <span className={styles.reviewType}>{review.typeLabel}</span>
          <span className={styles.reviewSub}>
            {review.durationLabel} · with {review.clientName}
          </span>
        </div>

        <div className={styles.reviewRows}>
          <ReviewRow icon={Clock} value={review.timeLabel} />
          <ReviewRow icon={CalendarDays} value={review.dateLabel} />
          {location && <ReviewRow icon={MapPin} value={location} />}
          {review.format && (
            <ReviewRow
              icon={FORMAT_ICON[review.format]}
              value={CONSULTATION_FORMAT_LABELS[review.format]}
            />
          )}
        </div>

        <div className={styles.reviewSection}>
          <span className={styles.reviewSectionLabel}>The piece</span>
          <ReviewRow icon={PenTool} value={piece} />
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
          <ReviewRow icon={Mail} value={inquiry.clientEmail} />
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
