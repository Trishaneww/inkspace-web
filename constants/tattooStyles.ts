export const TATTOO_STYLE_OPTIONS: { value: string; label: string }[] = [
  { value: "black_grey_realism", label: "Black & Grey Realism" },
  { value: "color_realism", label: "Color Realism" },
  { value: "micro_realism", label: "Micro-Realism" },
  { value: "fine_line", label: "Fine Line" },
  { value: "single_needle", label: "Single Needle" },
  { value: "minimalist", label: "Minimalist" },
  { value: "blackwork", label: "Blackwork" },
  { value: "american_traditional", label: "American Traditional" },
  { value: "neo_traditional", label: "Neo-Traditional" },
  { value: "japanese", label: "Japanese (Irezumi)" },
  { value: "tribal", label: "Tribal" },
  { value: "dotwork", label: "Dotwork / Stippling" },
  { value: "geometric", label: "Geometric" },
  { value: "illustrative", label: "Illustrative" },
  { value: "watercolor", label: "Watercolor" },
  { value: "lettering", label: "Lettering & Script" },
];

export const TATTOO_STYLE_LABELS: Record<string, string> = Object.fromEntries(
  TATTOO_STYLE_OPTIONS.map((option) => [option.value, option.label]),
);
