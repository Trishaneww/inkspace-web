// CSS
import styles from "@/styles/dashboard/artist/Bookings.module.css";

// HTML Components
import { CalendarCheck, Inbox, Wallet } from "lucide-react";

// Libs
import type { BookingStats } from "@/types/bookings";

interface BookingsStatsProps {
  stats: BookingStats;
}

export const BookingsStats = ({ stats }: BookingsStatsProps) => {
  const cards = [
    {
      key: "new",
      label: "New inquiries",
      value: stats.newInquiries,
      icon: Inbox,
    },
    {
      key: "deposit",
      label: "Awaiting deposit",
      value: stats.awaitingDeposit,
      icon: Wallet,
    },
    {
      key: "booked",
      label: "Booked this month",
      value: stats.bookedThisMonth,
      icon: CalendarCheck,
    },
  ];

  return (
    <div className={styles.stats}>
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.key} className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statIcon}>
                <Icon size={16} />
              </span>
              <span className={styles.statLabel}>{card.label}</span>
            </div>
            <span className={styles.statValue}>
              {card.value.toLocaleString()}
            </span>
          </div>
        );
      })}
    </div>
  );
};
