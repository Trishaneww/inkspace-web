// Types
import type { DashboardRange } from "@/types/dashboard";

interface DashboardRangeMeta {
  value: DashboardRange;
  label: string;
  caption: string;
}

export const DASHBOARD_RANGES: DashboardRangeMeta[] = [
  { value: "1m", label: "This month", caption: "this month" },
  { value: "6m", label: "Last 6 months", caption: "last 6 months" },
  { value: "1y", label: "Last 12 months", caption: "last 12 months" },
  { value: "all", label: "All time", caption: "all time" },
];

export const DEFAULT_DASHBOARD_RANGE: DashboardRange = "6m";
export const CHART_COLORS = {
  primary: "#6666ff",
  primarySoft: "#ececff",
  secondary: "hsl(156, 74%, 70%)",
  secondarySoft: "hsl(156, 74%, 92%)",
  neutral: "hsl(220, 13%, 84%)",
  grid: "hsl(220, 13%, 93%)",
  axis: "hsl(220, 9%, 55%)",
} as const;
