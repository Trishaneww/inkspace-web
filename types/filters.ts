// Libs
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export interface FilterOption<TValue extends string = string> {
  value: TValue;
  label: string;
}

export interface FilterSelectConfig {
  placeholder: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
}

export interface FilterAction {
  label: string;
  onClick: () => void;
  icon?: LucideIcon;
  tone?: "primary" | "secondary";
  disabled?: boolean;
  trailing?: ReactNode;
}
