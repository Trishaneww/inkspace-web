"use client";

// CSS
import clsx from "clsx";
import styles from "@/styles/dashboard/artist/Calendar.module.css";

// HTML Components
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { StatusBadge } from "@/components/dashboard/artist/bookings/StatusBadge";
import {
  Brush,
  CalendarDays,
  Clock,
  MapPin,
  MessagesSquare,
  Phone,
  Users,
  Video,
} from "lucide-react";

// Libs
import { format } from "date-fns";
import { APPOINTMENT_STATUS_META } from "@/constants/bookings";
import {
  LANE_HEIGHT_PX,
  MINUTE_WIDTH_PX,
  formatEventTimeRange,
  getEventDetails,
  isEventActive,
} from "@/lib/calendar";

// Types
import type { ConsultationFormat } from "@/types/bookings";
import type { PositionedEvent } from "@/types/calendar";
import type { LucideIcon } from "lucide-react";

const COMPACT_WIDTH_PX = 132;
const LANE_GAP_PX = 4;

const FORMAT_ICONS: Record<ConsultationFormat, LucideIcon> = {
  in_person: Users,
  online: Video,
  phone: Phone,
};

interface CalendarEventBlockProps {
  positioned: PositionedEvent;
  currentTime: Date;
  onSelect: (bookingRequestId: string) => void;
}

export const CalendarEventBlock = ({
  positioned,
  currentTime,
  onSelect,
}: CalendarEventBlockProps) => {
  const { event, startMinute, endMinute, lane } = positioned;
  const active = isEventActive(event, currentTime);
  const { typeLabel, location, formatLabel } = getEventDetails(event);

  const TypeIcon = event.type === "consultation" ? MessagesSquare : Brush;
  const FormatIcon = event.format ? FORMAT_ICONS[event.format] : null;
  const statusMeta = APPOINTMENT_STATUS_META[event.status];

  const left = startMinute * MINUTE_WIDTH_PX;
  const width = Math.max((endMinute - startMinute) * MINUTE_WIDTH_PX, 40);
  const compact = width < COMPACT_WIDTH_PX;

  const timeRange = formatEventTimeRange(event);
  const typeClass =
    event.type === "consultation"
      ? styles.eventConsultation
      : styles.eventSession;

  return (
    <Popover>
      <PopoverTrigger
        openOnHover
        delay={120}
        closeDelay={80}
        nativeButton={false}
        render={
          <div
            className={clsx(styles.event, typeClass, {
              [styles.eventActive]: active,
            })}
            style={{
              left: `${left + LANE_GAP_PX / 2}px`,
              width: `${width - LANE_GAP_PX}px`,
              top: `${lane * LANE_HEIGHT_PX + LANE_GAP_PX / 2}px`,
              height: `${LANE_HEIGHT_PX - LANE_GAP_PX}px`,
            }}
          />
        }
      >
        <span className={styles.eventIcon}>
          <TypeIcon size={14} />
        </span>
        <span className={styles.eventBody}>
          <span className={styles.eventLine}>
            <span className={styles.eventName}>{event.clientName}</span>
            {!compact && <span className={styles.eventTime}>{timeRange}</span>}
          </span>
          {!compact && (
            <span className={styles.eventMeta}>
              {typeLabel}
              {location ? ` · ${location}` : ""}
              {formatLabel ? ` · ${formatLabel}` : ""}
            </span>
          )}
        </span>
      </PopoverTrigger>

      <PopoverContent
        side="top"
        align="start"
        sideOffset={6}
        className={clsx(styles.popover, typeClass)}
      >
        <div className={styles.popHeader}>
          <span className={clsx(styles.eventIcon, styles.popIcon)}>
            <TypeIcon size={18} />
          </span>
          <div className={styles.popHeadText}>
            <span className={styles.popName}>{event.clientName}</span>
            <span className={styles.popType}>{typeLabel}</span>
          </div>
        </div>

        <div className={styles.popRow}>
          <Clock size={14} />
          <span>{timeRange}</span>
        </div>
        <div className={styles.popRow}>
          <CalendarDays size={14} />
          <span>{format(new Date(event.scheduledStart), "EEEE, MMMM d")}</span>
        </div>
        {location && (
          <div className={styles.popRow}>
            <MapPin size={14} />
            <span>{location}</span>
          </div>
        )}
        {formatLabel && FormatIcon && (
          <div className={styles.popRow}>
            <FormatIcon size={14} />
            <span>{formatLabel}</span>
          </div>
        )}

        <div className={styles.popFooter}>
          <StatusBadge label={statusMeta.label} variant={statusMeta.variant} />
          <Button
            size="sm"
            className={styles.popBtn}
            onClick={() => onSelect(event.bookingRequestId)}
          >
            View details
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
