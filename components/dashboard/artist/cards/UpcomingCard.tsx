// CSS
import styles from "@/styles/dashboard/artist/DashboardCards.module.css";

// HTML Components
import { CalendarClock } from "lucide-react";

// Components
import { DashboardCard } from "./DashboardCard";
import { StatusBadge } from "@/components/dashboard/artist/bookings/StatusBadge";
import { InitialsAvatar } from "@/components/common/InitialsAvatar";

// Libs
import { APPOINTMENT_TYPE_META, REQUEST_TYPE_META } from "@/constants/bookings";
import { formatDate, formatTimeRange } from "@/lib/formatters";

// Types
import type { DashboardUpcomingAppointment } from "@/types/dashboard";

interface UpcomingCardProps {
  upcoming: DashboardUpcomingAppointment[];
}

export const UpcomingCard = ({ upcoming }: UpcomingCardProps) => (
  <DashboardCard title="Upcoming appointments" icon={CalendarClock}>
    {upcoming.length === 0 ? (
      <div className={styles.upcomingEmpty}>
        Nothing booked yet. Confirmed sessions and consultations will appear
        here.
      </div>
    ) : (
      <div className={styles.upcomingScroll}>
        <ul className={styles.upcomingList}>
          {upcoming.map((appointment) => (
            <li key={appointment.id} className={styles.upcomingRow}>
              <InitialsAvatar
                name={appointment.clientName}
                seed={appointment.clientEmail}
              />
              <div className={styles.upcomingClient}>
                <span className={styles.upcomingName}>
                  {appointment.clientName}
                </span>
                <span className={styles.upcomingEmail}>
                  {appointment.clientEmail}
                </span>
              </div>
              <span className={styles.upcomingWhen}>
                {formatDate(appointment.scheduledStart)}
              </span>
              <StatusBadge {...APPOINTMENT_TYPE_META[appointment.type]} />
              <StatusBadge {...REQUEST_TYPE_META[appointment.requestType]} />
              <span className={styles.upcomingRange}>
                {formatTimeRange(
                  appointment.scheduledStart,
                  appointment.durationMinutes,
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
    )}
  </DashboardCard>
);
