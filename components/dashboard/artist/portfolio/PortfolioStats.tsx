"use client";

// HTML Components
import { CheckCircle2, LayoutGrid, Palette } from "lucide-react";

// Components
import {
  StatsRow,
  type StatCard,
} from "@/components/dashboard/artist/StatsRow";

// Libs
import type { PortfolioStats as PortfolioStatsData } from "@/lib/portfolio";

interface PortfolioStatsProps {
  stats: PortfolioStatsData;
}

export const PortfolioStats = ({ stats }: PortfolioStatsProps) => {
  const cards: StatCard[] = [
    {
      key: "total",
      label: "Total pieces",
      value: stats.total,
      icon: LayoutGrid,
    },
    {
      key: "published",
      label: "Published",
      value: stats.published,
      icon: CheckCircle2,
    },
    {
      key: "styles",
      label: "Styles covered",
      value: stats.styles,
      icon: Palette,
    },
  ];

  return <StatsRow cards={cards} />;
};
