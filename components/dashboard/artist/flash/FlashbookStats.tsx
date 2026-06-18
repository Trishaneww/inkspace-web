"use client";

// HTML Components
import { Archive, BookmarkCheck, Eye, Sparkles } from "lucide-react";

// Components
import {
  StatsRow,
  type StatCard,
} from "@/components/dashboard/artist/StatsRow";

// Libs
import type { FlashStats } from "@/lib/flashes";

interface FlashbookStatsProps {
  stats: FlashStats;
}

export const FlashbookStats = ({ stats }: FlashbookStatsProps) => {
  const cards: StatCard[] = [
    {
      key: "available",
      label: "Available",
      value: stats.available,
      icon: Sparkles,
    },
    {
      key: "claimed",
      label: "Claimed",
      value: stats.claimed,
      icon: BookmarkCheck,
    },
    {
      key: "archived",
      label: "Archived",
      value: stats.archived,
      icon: Archive,
    },
    { key: "views", label: "Total views", value: stats.totalViews, icon: Eye },
  ];

  return <StatsRow cards={cards} />;
};
