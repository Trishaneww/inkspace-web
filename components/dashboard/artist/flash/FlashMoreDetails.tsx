"use client";

// CSS
import clsx from "clsx";
import styles from "@/styles/dashboard/artist/FlashFormSheet.module.css";
import chips from "@/styles/TattooStylesPicker.module.css";

// HTML Components
import { Button } from "@/components/ui/button";
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

// Components
import { ChipMultiSelect } from "@/components/common/ChipMultiSelect";

// Libs
import {
  TATTOO_STYLE_OPTIONS,
  COLOR_TYPE_OPTIONS,
  PLACEMENT_OPTIONS,
} from "@/constants/tattooStyles";
import { type ColorType } from "@/types/flash";
import { formatSelectValue } from "@/lib/formatters";

interface FlashMoreDetailsProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  colorType: ColorType;
  setColorType: (colorType: ColorType) => void;
  placements: string[];
  setPlacements: (placements: string[]) => void;
  styleTags: string[];
  setStyleTags: (styleTags: string[]) => void;
}

export const FlashMoreDetails = ({
  isOpen,
  onOpenChange,
  colorType,
  setColorType,
  placements,
  setPlacements,
  styleTags,
  setStyleTags,
}: FlashMoreDetailsProps) => {
  const allowsAll = placements.length === 0;
  const togglePlacement = (placement: string) =>
    setPlacements(
      placements.includes(placement)
        ? placements.filter((item) => item !== placement)
        : [...placements, placement],
    );

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
              <SelectValue>
                {(value) => formatSelectValue(value, COLOR_TYPE_OPTIONS)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {COLOR_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className={styles.section}>
          <Label>Allowed placements</Label>
          <span className={styles.sectionHelper}>
            Where clients can place this design. “All” lets them choose any
            area.
          </span>
          <div className={chips.grid}>
            <Button
              type="button"
              className={clsx(chips.chip, { [chips.chipActive]: allowsAll })}
              onClick={() => setPlacements([])}
            >
              All
            </Button>
            {PLACEMENT_OPTIONS.map((option) => (
              <Button
                key={option.value}
                type="button"
                className={clsx(chips.chip, {
                  [chips.chipActive]: placements.includes(option.value),
                })}
                onClick={() => togglePlacement(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <Label>Style tags</Label>
          <ChipMultiSelect
            value={styleTags}
            options={TATTOO_STYLE_OPTIONS}
            onChange={setStyleTags}
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
