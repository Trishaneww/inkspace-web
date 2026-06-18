// Libs
import { PortfolioBrowsePhase } from "@/types/portfolioBrowse";

export const PORTFOLIO_BROWSE_PHASE_META: Record<
  PortfolioBrowsePhase,
  { lead: string; rest: string }
> = {
  [PortfolioBrowsePhase.Grid]: {
    lead: "Their portfolio.",
    rest: "Tap a piece to take a closer look.",
  },
  [PortfolioBrowsePhase.Detail]: {
    lead: "A closer look.",
    rest: "Browse the photos of this piece.",
  },
};
