// HTML Components
import { CalendarCheck, Inbox, Wallet } from "lucide-react";

// Components
import {
  StatsRow,
  type StatCard,
} from "@/components/dashboard/artist/StatsRow";

// Libs
import type { BookingStats } from "@/types/bookings";

interface BookingsStatsProps {
  stats: BookingStats;
}

export const BookingsStats = ({ stats }: BookingsStatsProps) => {
  const cards: StatCard[] = [
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

  return <StatsRow cards={cards} />;
};
