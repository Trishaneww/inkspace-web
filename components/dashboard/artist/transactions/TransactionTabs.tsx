"use client";

// CSS
import clsx from "clsx";
import styles from "@/styles/dashboard/artist/Transactions.module.css";

// HTML Components
import { Button } from "@/components/ui/button";

// Types
import type { TransactionTab } from "@/types/transactions";

interface TransactionTabsProps {
  value: TransactionTab;
  onChange: (tab: TransactionTab) => void;
}

const TABS: { value: TransactionTab; label: string }[] = [
  { value: "income", label: "Income" },
  { value: "payouts", label: "Payouts" },
];

export const TransactionTabs = ({ value, onChange }: TransactionTabsProps) => (
  <div className={styles.tabs}>
    {TABS.map((tab) => (
      <Button
        key={tab.value}
        variant="bare"
        size="bare"
        type="button"
        className={clsx(styles.tab, {
          [styles.tabActive]: value === tab.value,
        })}
        onClick={() => onChange(tab.value)}
      >
        {tab.label}
      </Button>
    ))}
  </div>
);
