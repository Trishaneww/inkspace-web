"use client";

// CSS
import clsx from "clsx";
import styles from "@/styles/dashboard/artist/FiltersRow.module.css";

// HTML Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Search } from "lucide-react";

// Libs
import type { FilterAction, FilterSelectConfig } from "@/types/filters";

interface FiltersRowProps {
  searchValue: string;
  searchPlaceholder: string;
  onSearchChange: (value: string) => void;
  selects: FilterSelectConfig[];
  isFiltered: boolean;
  onReset: () => void;
  actions: FilterAction[];
}

export const FiltersRow = ({
  searchValue,
  searchPlaceholder,
  onSearchChange,
  selects,
  isFiltered,
  onReset,
  actions,
}: FiltersRowProps) => {
  return (
    <div className={styles.filters}>
      <div className={styles.searchField}>
        <Search size={16} className={styles.searchIcon} />
        <Input
          type="search"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          className={styles.searchInput}
        />
      </div>

      {selects.map((select) => (
        <FilterSelect key={select.placeholder} {...select} />
      ))}

      <Button
        type="button"
        variant="ghost"
        className={styles.resetBtn}
        onClick={onReset}
        disabled={!isFiltered}
      >
        Reset filters
      </Button>

      <div className={styles.actions}>
        {actions.map((action) => (
          <ActionButton key={action.label} action={action} />
        ))}
      </div>
    </div>
  );
};

const FilterSelect = ({
  placeholder,
  value,
  options,
  onChange,
}: FilterSelectConfig) => {
  const isDefault = value === options[0]?.value;
  const selectedLabel = options.find((option) => option.value === value)?.label;

  return (
    <Select value={value} onValueChange={(next) => next && onChange(next)}>
      <SelectTrigger className={styles.filterSelect}>
        <span className={clsx(isDefault && styles.selectPlaceholder)}>
          {isDefault ? placeholder : selectedLabel}
        </span>
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

const ActionButton = ({ action }: { action: FilterAction }) => {
  const isSecondary = action.tone === "secondary";
  const Icon = action.icon;

  return (
    <Button
      type="button"
      variant={isSecondary ? "outline" : "default"}
      className={isSecondary ? styles.secondaryActionBtn : styles.primaryActionBtn}
      onClick={action.onClick}
      disabled={action.disabled}
    >
      {Icon && <Icon className={styles.btnIcon} />}
      {action.label}
      {action.trailing}
    </Button>
  );
};
