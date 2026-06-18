// Types
import type { OpenBookTheme } from "@/types/bookings";

export interface OpenBookThemeOption {
  slug: OpenBookTheme;
  label: string;
  pageBg: string;
  surface: string;
  accent: string;
}

export const OPEN_BOOK_THEMES: OpenBookThemeOption[] = [
  {
    slug: "inkspace",
    label: "Inkspace",
    pageBg: "hsl(0, 0%, 100%)",
    surface: "hsl(0, 0%, 100%)",
    accent: "hsl(258, 90%, 66%)",
  },
  {
    slug: "noir",
    label: "Noir",
    pageBg: "hsl(0, 0%, 96%)",
    surface: "hsl(0, 0%, 100%)",
    accent: "hsl(0, 0%, 12%)",
  },
  {
    slug: "sand",
    label: "Sand",
    pageBg: "hsl(35, 38%, 94%)",
    surface: "hsl(38, 55%, 98%)",
    accent: "hsl(14, 72%, 52%)",
  },
  {
    slug: "sage",
    label: "Sage",
    pageBg: "hsl(120, 15%, 93%)",
    surface: "hsl(90, 25%, 98%)",
    accent: "hsl(152, 46%, 37%)",
  },
  {
    slug: "midnight",
    label: "Midnight",
    pageBg: "hsl(240, 10%, 8%)",
    surface: "hsl(240, 8%, 13%)",
    accent: "hsl(258, 90%, 70%)",
  },
  {
    slug: "navy",
    label: "Navy",
    pageBg: "hsl(220, 45%, 12%)",
    surface: "hsl(220, 40%, 17%)",
    accent: "hsl(210, 80%, 56%)",
  },
];
