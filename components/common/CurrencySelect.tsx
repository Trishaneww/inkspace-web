// CSS
import styles from "@/styles/dashboard/artist/FlashFormSheet.module.css";

// HTML Components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CurrencySelectProps {
  currency: string;
  setCurrency: (currency: string) => void;
}

export const CurrencySelect = ({
  currency,
  setCurrency,
}: CurrencySelectProps) => {
  return (
    <div className={styles.currencyRow}>
      <p>Currency</p>
      <Select
        value={currency}
        onValueChange={(value) => value && setCurrency(value)}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="CAD">CAD</SelectItem>
          <SelectItem value="USD">USD</SelectItem>
          <SelectItem value="EUR">EUR</SelectItem>
          <SelectItem value="GBP">GBP</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
