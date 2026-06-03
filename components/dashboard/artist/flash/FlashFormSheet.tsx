"use client";

// CSS
import styles from "@/styles/dashboard/artist/FlashFormSheet.module.css";

// HTML Components
import { Sheet, SheetContent } from "@/components/ui/sheet";

// Components
import { FlashForm } from "./FlashForm";

// Types
import { type Flash } from "@/types/flash";

interface FlashFormSheetProps {
  open: boolean;
  initialFlash: Flash | null;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}

export const FlashFormSheet = (props: FlashFormSheetProps) => {
  return (
    <Sheet open={props.open} onOpenChange={props.onOpenChange}>
      <SheetContent side="right" className={styles.flashFormSheet}>
        <FlashForm
          key={`${props.open ? "open" : "closed"}:${props.initialFlash?.id ?? "new"}`}
          initialFlash={props.initialFlash}
          onClose={() => props.onOpenChange(false)}
          onSaved={props.onSaved}
        />
      </SheetContent>
    </Sheet>
  );
};
