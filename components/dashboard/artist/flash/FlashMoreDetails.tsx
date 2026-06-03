"use client";

// CSS
import styles from "@/styles/dashboard/artist/FlashFormSheet.module.css";

// HTML Components
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown } from "lucide-react";

// Types
import { type ColorType } from "@/types/flash";

interface FlashMoreDetailsProps {
  isOpen: boolean;
onOpenChange: (open: boolean) => void;
  colorType: ColorType;
  setColorType: (colorType: ColorType) => void;
  placementsText: string;
  setPlacementsText: (placementsText: string) => void;
  stylesText: string;
  setStylesText: (stylesText: string) => void;
}

export const FlashMoreDetails = ({
  isOpen,
  onOpenChange,
  colorType,
  setColorType,
  placementsText,
  setPlacementsText,
  stylesText,
  setStylesText,
}: FlashMoreDetailsProps) => {
  return (
    <Collapsible
      open={isOpen}
      onOpenChange={onOpenChange}
      className={styles.moreDetailsCard}
    >
      <CollapsibleTrigger className={styles.moreDetailsTrigger}>
        <span>
          More details <span className={styles.labelOptional}>(optional)</span>
        </span>
        <ChevronDown size={16} />
      </CollapsibleTrigger>
      <CollapsibleContent className={styles.moreDetailsBody}>
        <div className={styles.section}>
          <Label htmlFor="flash-color-type">Color type</Label>
          <Select
            value={colorType}
            onValueChange={(value) => value && setColorType(value as ColorType)}
          >
            <SelectTrigger id="flash-color-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="both">Both</SelectItem>
              <SelectItem value="black_and_grey">Black &amp; grey</SelectItem>
              <SelectItem value="color">Color</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className={styles.section}>
          <Label htmlFor="flash-placements">Placement suggestions</Label>
          <Input
            id="flash-placements"
            placeholder="forearm, calf, thigh"
            value={placementsText}
            onChange={(event) => setPlacementsText(event.target.value)}
          />
          <span className={styles.sectionHelper}>Comma-separated.</span>
        </div>

        <div className={styles.section}>
          <Label htmlFor="flash-styles">Style tags</Label>
          <Input
            id="flash-styles"
            placeholder="illustrative, sports"
            value={stylesText}
            onChange={(event) => setStylesText(event.target.value)}
          />
          <span className={styles.sectionHelper}>Comma-separated.</span>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
