"use client";

// CSS
import styles from "@/styles/dashboard/artist/PortfolioFormSheet.module.css";

// HTML Components
import { Sheet, SheetContent } from "@/components/ui/sheet";

// Components
import { PortfolioForm } from "./PortfolioForm";

// Types
import type { PortfolioItem } from "@/types/portfolio";

interface PortfolioFormSheetProps {
  open: boolean;
  initialItem: PortfolioItem | null;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}

export const PortfolioFormSheet = (props: PortfolioFormSheetProps) => {
  return (
    <Sheet open={props.open} onOpenChange={props.onOpenChange}>
      <SheetContent side="right" className={styles.formSheet}>
        <PortfolioForm
          key={`${props.open ? "open" : "closed"}:${props.initialItem?.id ?? "new"}`}
          initialItem={props.initialItem}
          onClose={() => props.onOpenChange(false)}
          onSaved={props.onSaved}
        />
      </SheetContent>
    </Sheet>
  );
};
