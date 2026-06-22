// CSS
import styles from "@/styles/dashboard/artist/DashboardCards.module.css";

// Components
import { PipelineCard } from "./cards/PipelineCard";
import { EarningsTrendCard } from "./cards/EarningsTrendCard";
import { BookingMixCard } from "./cards/BookingMixCard";
import { CollectedBarsCard } from "./cards/CollectedBarsCard";
import { UpcomingCard } from "./cards/UpcomingCard";

// Types
import type { Dashboard } from "@/types/dashboard";

interface DashboardGridProps {
  data: Dashboard;
  rangeCaption: string;
  comparable: boolean;
}

export const DashboardGrid = ({
  data,
  rangeCaption,
  comparable,
}: DashboardGridProps) => (
  <div className={styles.grid}>
    <PipelineCard pipeline={data.pipeline} />
    <EarningsTrendCard
      earnings={data.earnings}
      currency={data.currency}
      caption={rangeCaption}
      comparable={comparable}
    />
    <BookingMixCard mix={data.mix} comparable={comparable} />
    <CollectedBarsCard
      earnings={data.earnings}
      currency={data.currency}
      caption={rangeCaption}
      comparable={comparable}
    />
    <UpcomingCard upcoming={data.upcoming} />
  </div>
);
