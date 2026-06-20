"use client";

// CSS
import clsx from "clsx";
import styles from "@/styles/dashboard/artist/DashboardCards.module.css";

// HTML Components
import { Shapes } from "lucide-react";

// Charts
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

// Components
import { DashboardCard } from "./DashboardCard";
import { DeltaBadge } from "./DeltaBadge";
import { GaugeTicks } from "./GaugeTicks";

// Libs
import { CHART_COLORS } from "@/constants/dashboard";
import { buildDelta } from "@/lib/dashboard/greeting";

// Types
import type { DashboardBookingMix } from "@/types/dashboard";

interface BookingMixCardProps {
  mix: DashboardBookingMix;
  comparable: boolean;
}

export const BookingMixCard = ({ mix, comparable }: BookingMixCardProps) => {
  const total = mix.custom + mix.flash;
  const segments = [
    {
      key: "custom",
      label: "Custom",
      value: mix.custom,
      color: CHART_COLORS.primary,
      dotClass: styles.dotPrimary,
    },
    {
      key: "flash",
      label: "Flash",
      value: mix.flash,
      color: CHART_COLORS.secondary,
      dotClass: styles.dotSecondary,
    },
  ];
  const slices =
    total > 0
      ? segments
      : [{ key: "empty", value: 1, color: CHART_COLORS.primarySoft }];

  const leader = mix.custom >= mix.flash ? segments[0] : segments[1];
  const leaderShare = total > 0 ? Math.round((leader.value / total) * 100) : 0;
  const delta = comparable
    ? buildDelta(total, mix.prevPeriod)
    : { type: "none" as const };

  return (
    <DashboardCard title="Booking mix" icon={Shapes}>
      <div className={styles.metric}>
        <span className={styles.metricValue}>{total}</span>
        <div className={styles.metricMeta}>
          <DeltaBadge delta={delta} />
          <span className={styles.metricCaption}>pieces booked</span>
        </div>
      </div>

      <div className={styles.gaugeWrap}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <Pie
              data={slices}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              innerRadius="85%"
              outerRadius="100%"
              paddingAngle={total > 0 ? 3 : 0}
              cornerRadius={8}
              stroke="none"
            >
              {slices.map((slice) => (
                <Cell key={slice.key} fill={slice.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <GaugeTicks />

        <div className={styles.gaugeCenter}>
          {total > 0 ? (
            <>
              <span className={styles.gaugeValue}>{leaderShare}%</span>
              <span className={styles.gaugeLabel}>{leader.label}</span>
            </>
          ) : (
            <>
              <span className={styles.gaugeValue}>—</span>
              <span className={styles.gaugeLabel}>no bookings yet</span>
            </>
          )}
        </div>
      </div>

      <ul className={styles.legend}>
        {segments.map((segment) => (
          <li key={segment.key} className={styles.legendItem}>
            <span className={clsx(styles.legendDot, segment.dotClass)} />
            <span className={styles.legendLabel}>{segment.label}</span>
            <span className={styles.legendCount}>{segment.value}</span>
          </li>
        ))}
      </ul>
    </DashboardCard>
  );
};
