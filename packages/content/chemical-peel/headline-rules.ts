import type { HeadlineRule } from "@ui/hero/headline-map";

/**
 * UTM-term-driven headline rules for the chemical peel landing page.
 * If no UTM term matches (or there's no UTM at all), the hero's
 * `fallbackHeadline` is used instead.
 *
 * Patterns are strings (not RegExp instances) so the data can cross
 * the React Server Components boundary into the client Hero.
 */
export const headlineRules: HeadlineRule[] = [
  { pattern: "acne(?!\\s*scar)|breakout|spot",
    headline: "Calm active acne. With a salicylic peel.",
    imageHint: "acne" },
  { pattern: "scar|scarring|post[-\\s]?acne|pih",
    headline: "Reset post-acne marks. Doctor-graded peel.",
    imageHint: "scarring" },
  { pattern: "melasma",
    headline: "Stubborn melasma. Cosmelan-grade. Doctor-applied.",
    imageHint: "melasma" },
  { pattern: "wedding|event|pre[-\\s]?event|bride",
    headline: "Glass-skin glow for the camera. Timed to your event.",
    imageHint: "event" },
  { pattern: "wrinkle|fine[-\\s]?line|aging|ageing|anti[-\\s]?aging",
    headline: "Soften fine lines at the dermal layer.",
    imageHint: "aging" },
  { pattern: "pore|oily|congest",
    headline: "Tighter pores. Less shine. Smoother skin.",
    imageHint: "pores" },
  { pattern: "dull|glow|brightening|brighter",
    headline: "Glass-skin glow. In a single peel.",
    imageHint: "glow" },
  { pattern: "sun[-\\s]?damage|age[-\\s]?spot|photo[-\\s]?aging",
    headline: "Sun damage, undone. In as few as 3 peels.",
    imageHint: "sun-damage" },
  { pattern: "glasgow|scotland",
    headline: "Glasgow's doctor-graded chemical peel clinic.",
    imageHint: "glasgow" },
  { pattern: "sensitive|rosacea",
    headline: "Sensitive skin? A mandelic peel was made for you.",
    imageHint: "sensitive" },
  { pattern: "darker[-\\s]?skin|fitzpatrick|asian|brown|black\\s?skin",
    headline: "Peels calibrated for Fitzpatrick IV–VI.",
    imageHint: "fitzpatrick" },
];
