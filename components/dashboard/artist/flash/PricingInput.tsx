// HTML Components
import { Input } from "@/components/ui/input";

// Libs
import { formatCurrency } from "@/lib/formatters";

interface PriceInputProps {
  value: string;
  onChange: (next: string) => void;
  disabled?: boolean;
  placeholder?: string;
  ariaLabel?: string;
}

export const PriceInput = ({
  value,
  onChange,
  disabled,
  placeholder = "—",
  ariaLabel,
}: PriceInputProps) => (
  <Input
    type="text"
    inputMode="decimal"
    value={value}
    onChange={(event) => onChange(formatCurrency(event.target.value))}
    placeholder={placeholder}
    disabled={disabled}
    aria-label={ariaLabel}
  />
);
