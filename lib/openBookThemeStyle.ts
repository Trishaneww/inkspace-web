// React
import type { CSSProperties } from "react";

// Types
import type { CustomTheme } from "@/types/bookings";

export const buildCustomThemeStyle = (
  customTheme: CustomTheme,
): CSSProperties => {
  const { background, card, button, text } = customTheme;

  return {
    "--ob-page-bg": background,
    "--ob-surface": card,
    "--ob-surface-hover": `color-mix(in srgb, ${card}, ${text} 6%)`,
    "--ob-avatar-bg": `color-mix(in srgb, ${card}, ${button} 16%)`,
    "--ob-border": `color-mix(in srgb, ${card}, ${text} 16%)`,
    "--ob-text": text,
    "--ob-text-muted": `color-mix(in srgb, ${text}, transparent 38%)`,
    "--ob-accent": button,
    "--ob-accent-hover": `color-mix(in srgb, ${button}, hsl(0, 0%, 0%) 10%)`,
    "--ob-on-accent": pickContrastColor(button),
    "--ob-shadow": `color-mix(in srgb, ${text}, transparent 86%)`,
  } as CSSProperties & Record<string, string>;
};

export const buildBackgroundImageStyle = (
  backgroundImageUrl: string,
): CSSProperties => ({
  backgroundImage: `url(${JSON.stringify(backgroundImageUrl)})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
});

const pickContrastColor = (hex: string): string =>
  isLightColor(hex) ? "hsl(0, 0%, 12%)" : "hsl(0, 0%, 100%)";

const isLightColor = (hex: string): boolean => {
  const { red, green, blue } = parseHexColor(hex);
  const luminance = (0.299 * red + 0.587 * green + 0.114 * blue) / 255;
  return luminance > 0.6;
};

const parseHexColor = (
  hex: string,
): { red: number; green: number; blue: number } => {
  let value = hex.replace("#", "");
  if (value.length === 3) {
    value = value
      .split("")
      .map((char) => char + char)
      .join("");
  }
  const int = parseInt(value, 16);
  return {
    red: (int >> 16) & 255,
    green: (int >> 8) & 255,
    blue: int & 255,
  };
};
