"use client";

// Components
import { ChipMultiSelect } from "@/components/common/ChipMultiSelect";

// Libs
import { TATTOO_STYLE_OPTIONS } from "@/constants/tattooStyles";

interface TattooStylesPickerProps {
  value: string[];
  onChange: (next: string[]) => void;
}

export const TattooStylesPicker = ({
  value,
  onChange,
}: TattooStylesPickerProps) => (
  <ChipMultiSelect
    value={value}
    options={TATTOO_STYLE_OPTIONS}
    onChange={onChange}
  />
);
