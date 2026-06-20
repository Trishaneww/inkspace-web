"use client";

// CSS
import clsx from "clsx";
import styles from "@/styles/dashboard/artist/DashboardCards.module.css";

// HTML Components
import { Coins } from "lucide-react";

// Charts
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

// Components
import { DashboardCard } from "./DashboardCard";
import { DeltaBadge } from "./DeltaBadge";
import { ChartTooltip } from "./ChartTooltip";

// Libs
import { CHART_COLORS } from "@/constants/dashboard";
import { formatPrice } from "@/lib/formatters";
import { buildDelta } from "@/lib/dashboard/greeting";

// Types
import type { DashboardEarnings } from "@/types/dashboard";

interface CollectedBarsCardProps {
  earnings: DashboardEarnings;
  currency: string;
  caption: string;
  comparable: boolean;
}

export const CollectedBarsCard = ({
  earnings,
  currency,
  caption,
  comparable,
}: CollectedBarsCardProps) => {
  const data = earnings.months.map((month) => ({
    label: month.label,
    collected: month.collectedCents / 100,
  }));
  const delta = comparable
    ? buildDelta(
        earnings.thisPeriodCollectedCents,
        earnings.prevPeriodCollectedCents,
      )
    : { type: "none" as const };

  return (
    <DashboardCard title="Collected" icon={Coins}>
      <div className={clsx(styles.metric, styles.metricStacked)}>
        <span className={styles.metricValue}>
          {formatPrice(earnings.thisPeriodCollectedCents, currency)}
        </span>
        <div className={styles.metricMeta}>
          <DeltaBadge delta={delta} />
          <span className={styles.metricCaption}>{caption}</span>
        </div>
      </div>

      <div className={styles.chart}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 8, right: 0, bottom: 0, left: 0 }}
          >
            <defs>
              <linearGradient id="collectedFill" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={CHART_COLORS.primary}
                  stopOpacity={1}
                />
                <stop
                  offset="100%"
                  stopColor={CHART_COLORS.primary}
                  stopOpacity={0.55}
                />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fill: CHART_COLORS.axis, fontSize: 12 }}
            />
            <Tooltip
              cursor={{ fill: CHART_COLORS.primarySoft }}
              content={<ChartTooltip currency={currency} />}
            />
            <Bar
              dataKey="collected"
              fill="url(#collectedFill)"
              radius={[8, 8, 0, 0]}
              maxBarSize={48}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
};
