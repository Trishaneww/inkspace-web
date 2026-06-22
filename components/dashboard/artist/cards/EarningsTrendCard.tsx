"use client";

// CSS
import styles from "@/styles/dashboard/artist/DashboardCards.module.css";

// HTML Components
import { Wallet } from "lucide-react";

// Charts
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

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

interface EarningsTrendCardProps {
  earnings: DashboardEarnings;
  currency: string;
  caption: string;
  comparable: boolean;
}

export const EarningsTrendCard = ({
  earnings,
  currency,
  caption,
  comparable,
}: EarningsTrendCardProps) => {
  const data = earnings.months.map((month) => ({
    label: month.label,
    net: month.netCents / 100,
  }));

  const isSinglePeriod = data.length <= 1;
  const delta = comparable
    ? buildDelta(earnings.thisPeriodNetCents, earnings.prevPeriodNetCents)
    : { type: "none" as const };

  return (
    <DashboardCard
      title="Net earnings"
      icon={Wallet}
      className={styles.wideCard}
    >
      <div className={styles.metric}>
        <span className={styles.metricValue}>
          {formatPrice(earnings.thisPeriodNetCents, currency)}
        </span>
        <div className={styles.metricMeta}>
          <DeltaBadge delta={delta} />
          <span className={styles.metricCaption}>{caption}</span>
        </div>
      </div>

      <div className={styles.chart}>
        <ResponsiveContainer width="100%" height="100%">
          {isSinglePeriod ? (
            <BarChart data={data} margin={{ top: 8, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="earningsBarFill" x1="0" y1="0" x2="0" y2="1">
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
                dataKey="net"
                fill="url(#earningsBarFill)"
                radius={[8, 8, 0, 0]}
                maxBarSize={48}
              />
            </BarChart>
          ) : (
            <AreaChart
              data={data}
              margin={{ top: 8, right: 8, bottom: 0, left: 8 }}
            >
              <defs>
                <linearGradient id="earningsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor={CHART_COLORS.primary}
                    stopOpacity={0.35}
                  />
                  <stop
                    offset="100%"
                    stopColor={CHART_COLORS.primary}
                    stopOpacity={0.02}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke={CHART_COLORS.grid} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fill: CHART_COLORS.axis, fontSize: 12 }}
              />
              <Tooltip
                cursor={{ stroke: CHART_COLORS.grid }}
                content={<ChartTooltip currency={currency} />}
              />
              <Area
                type="monotone"
                dataKey="net"
                stroke={CHART_COLORS.primary}
                strokeWidth={2.5}
                fill="url(#earningsFill)"
                dot={{ r: 3, fill: CHART_COLORS.primary, strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </DashboardCard>
  );
};
