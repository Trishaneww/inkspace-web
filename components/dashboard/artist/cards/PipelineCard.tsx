// CSS
import clsx from "clsx";
import styles from "@/styles/dashboard/artist/DashboardCards.module.css";

// HTML Components
import { Inbox } from "lucide-react";

// Components
import { DashboardCard } from "./DashboardCard";
import { DeltaBadge } from "./DeltaBadge";

// Libs
import { buildDelta } from "@/lib/dashboard/greeting";

// Types
import type { DashboardPipeline } from "@/types/dashboard";

interface PipelineCardProps {
  pipeline: DashboardPipeline;
}

export const PipelineCard = ({ pipeline }: PipelineCardProps) => {
  const segments = [
    {
      key: "new",
      label: "New",
      value: pipeline.newInquiries,
      barClass: styles.barNew,
      dotClass: styles.dotPrimary,
    },
    {
      key: "awaiting",
      label: "Awaiting deposit",
      value: pipeline.awaitingDeposit,
      barClass: styles.barAwaiting,
      dotClass: styles.dotSecondary,
    },
    {
      key: "scheduled",
      label: "Scheduled",
      value: pipeline.scheduled,
      barClass: styles.barScheduled,
      dotClass: styles.dotNeutral,
    },
  ];
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  const tallest = Math.max(...segments.map((segment) => segment.value), 1);
  const delta = buildDelta(pipeline.leadsThisMonth, pipeline.leadsLastMonth);

  return (
    <DashboardCard title="Leads pipeline" icon={Inbox}>
      <div className={styles.metric}>
        <span className={styles.metricValue}>{total}</span>
        <div className={styles.metricMeta}>
          <DeltaBadge delta={delta} />
          <span className={styles.metricCaption}>active in your pipeline</span>
        </div>
      </div>

      <div className={styles.barGroup}>
        {segments.map((segment) => (
          <div key={segment.key} className={styles.barColumn}>
            <span className={styles.barValue}>{segment.value}</span>
            <div className={styles.barTrack}>
              {segment.value > 0 && (
                <div
                  className={clsx(styles.barFill, segment.barClass)}
                  style={{ height: `${(segment.value / tallest) * 100}%` }}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      <ul className={styles.legend}>
        {segments.map((segment) => (
          <li key={segment.key} className={styles.legendItem}>
            <span className={clsx(styles.legendDot, segment.dotClass)} />
            <span className={styles.legendLabel}>{segment.label}</span>
          </li>
        ))}
      </ul>
    </DashboardCard>
  );
};
