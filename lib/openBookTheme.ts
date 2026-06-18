"use client";

// React
import { createContext, useContext } from "react";

// Types
import type { OpenBookTheme } from "@/types/bookings";

export const OpenBookThemeContext = createContext<OpenBookTheme | null>(null);
export const useOpenBookTheme = () => useContext(OpenBookThemeContext);
