"use client";

// HTML Components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Libs
import { formatSelectValue, SelectOption } from "@/lib/formatters";

interface OptionsSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  ariaLabel?: string;
  placeholder?: string;
  className?: string;
}

export const OptionsSelect = ({
  value,
  onValueChange,
  options,
  ariaLabel,
  placeholder,
  className,
}: OptionsSelectProps) => {
  return (
    <Select value={value} onValueChange={(next) => next && onValueChange(next)}>
      <SelectTrigger className={className} aria-label={ariaLabel}>
        <SelectValue placeholder={placeholder}>
          {(selected) => {
            const label = selected ? formatSelectValue(selected, options) : "";
            return label ? (
              label
            ) : (
              <span style={{ color: "hsl(220, 9%, 46%)" }}>{placeholder}</span>
            );
          }}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
