// HTML Components
import { Banknote, CalendarCheck, CreditCard, Wallet } from "lucide-react";

// Components
import {
  StatsRow,
  type StatCard,
} from "@/components/dashboard/artist/StatsRow";

// Libs
import { formatPrice } from "@/lib/formatters";

// Types
import type { Earnings } from "@/types/earnings";

interface EarningsStatsProps {
  earnings: Earnings;
}

export const EarningsStats = ({ earnings }: EarningsStatsProps) => {
  const { allTime, thisMonth, currency } = earnings;

  const cards: StatCard[] = [
    {
      key: "net",
      label: "Net earnings",
      value: formatPrice(allTime.netCents, currency),
      icon: Wallet,
    },
    {
      key: "month",
      label: "Net this month",
      value: formatPrice(thisMonth.netCents, currency),
      icon: CalendarCheck,
    },
    {
      key: "collected",
      label: "Collected",
      value: formatPrice(allTime.collectedCents, currency),
      icon: Banknote,
    },
    {
      key: "payments",
      label: "Payments",
      value: allTime.count,
      icon: CreditCard,
    },
  ];

  return <StatsRow cards={cards} />;
};
