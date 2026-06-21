"use client";

// Next.js
import { createContext, useContext, type CSSProperties } from "react";

// Types
import type { OpenBookTheme } from "@/types/bookings";

export interface OpenBookThemeValue {
  theme: OpenBookTheme;
  customStyle?: CSSProperties;
}

export const OpenBookThemeContext = createContext<OpenBookThemeValue | null>(
  null,
);
export const useOpenBookTheme = () => useContext(OpenBookThemeContext);
