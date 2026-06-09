// Libs
import type {
  PortfolioColorFilter,
  PortfolioItem,
  PortfolioStatus,
  PortfolioStatusFilter,
} from "@/types/portfolio";

export interface PortfolioStats {
  total: number;
  published: number;
  styles: number;
}

export function getPortfolioStats(items: PortfolioItem[]): PortfolioStats {
  const styleSet = new Set<string>();
  let published = 0;
  for (const item of items) {
    if (item.status === "published") published += 1;
    for (const style of item.styles) styleSet.add(style);
  }
  return { total: items.length, published, styles: styleSet.size };
}

export interface PortfolioFilters {
  search: string;
  status: PortfolioStatusFilter;
  style: string;
  color: PortfolioColorFilter;
}

export function filterPortfolioItems(
  items: PortfolioItem[],
  filters: PortfolioFilters,
): PortfolioItem[] {
  const search = filters.search.trim().toLowerCase();

  return items.filter((item) => {
    if (search && !item.title.toLowerCase().includes(search)) return false;
    if (filters.status !== "all" && item.status !== filters.status) {
      return false;
    }
    if (filters.style !== "all" && !item.styles.includes(filters.style)) {
      return false;
    }
    if (filters.color !== "all" && item.colorType !== filters.color) {
      return false;
    }
    return true;
  });
}

export function hasActivePortfolioFilters(filters: PortfolioFilters): boolean {
  return (
    filters.search.trim() !== "" ||
    filters.status !== "all" ||
    filters.style !== "all" ||
    filters.color !== "all"
  );
}

export function getPortfolioStatusLabel(status: PortfolioStatus): string {
  switch (status) {
    case "draft":
      return "Draft";
    case "published":
      return "Published";
    case "archived":
      return "Archived";
  }
}

export function formatTotalTime(totalMinutes: number): string {
  const hours = totalMinutes / 60;
  const rounded = Math.round(hours * 10) / 10;
  return `${rounded} ${rounded === 1 ? "hr" : "hrs"}`;
}
