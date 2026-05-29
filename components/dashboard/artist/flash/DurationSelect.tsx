// HTML Components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Libs
import { DURATION_OPTIONS } from "@/constants/flashes";

interface DurationSelectProps {
  value: string;
  onChange: (nextMinutesString: string) => void;
  disabled?: boolean;
  ariaLabel?: string;
}

export const DurationSelect = ({
  value,
  onChange,
  disabled,
  ariaLabel,
}: DurationSelectProps) => (
  <Select
    value={value}
    onValueChange={(next) => next && onChange(next)}
    disabled={disabled}
  >
    <SelectTrigger aria-label={ariaLabel} className="w-full">
      <SelectValue placeholder="—" />
    </SelectTrigger>
    <SelectContent>
      {DURATION_OPTIONS.map((option) => (
        <SelectItem key={option.minutes} value={String(option.minutes)}>
          {option.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);
