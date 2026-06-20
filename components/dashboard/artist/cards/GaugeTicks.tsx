// CSS
import styles from "@/styles/dashboard/artist/DashboardCards.module.css";

const TICK_COUNT = 60;
const TICK_OUTER = 40;
const TICK_INNER = 31;
const CENTER = 50;

export const GaugeTicks = () => (
  <svg className={styles.gaugeTicks} viewBox="0 0 100 100" aria-hidden>
    {Array.from({ length: TICK_COUNT }, (_, index) => (
      <line
        key={index}
        x1={CENTER}
        y1={CENTER - TICK_OUTER}
        x2={CENTER}
        y2={CENTER - TICK_INNER}
        transform={`rotate(${(index / TICK_COUNT) * 360} ${CENTER} ${CENTER})`}
        className={styles.gaugeTick}
      />
    ))}
  </svg>
);
