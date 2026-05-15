import type { HeadlineRule } from "@ui/hero/headline-map";

/**
 * UTM-term-driven headline rules for the skin glow drip LP.
 * Patterns are plain strings so the data can cross the RSC boundary.
 */
export const headlineRules: HeadlineRule[] = [
  { pattern: "glutathione",
    headline: "Glutathione, delivered the way your skin actually uses it.",
    imageHint: "glutathione" },
  { pattern: "skin\\s?whiten|whitening",
    headline: "Brighter, more even skin — without the bleach.",
    imageHint: "brightening" },
  { pattern: "glow|brightening|brighter|radiance|lit",
    headline: "Glow that starts in your bloodstream.",
    imageHint: "glow" },
  { pattern: "tired|fatigue|dull",
    headline: "Tired skin? Your gut probably isn't absorbing enough.",
    imageHint: "tired" },
  { pattern: "wedding|event|pre[-\\s]?event|bride",
    headline: "Wedding glow, six drips in advance.",
    imageHint: "event" },
  { pattern: "melasma|pigmentation|sun[-\\s]?damage|spot",
    headline: "Antioxidant therapy for stubborn pigmentation.",
    imageHint: "pigmentation" },
  { pattern: "anti[-\\s]?aging|aging|ageing|collagen|fine[-\\s]?line",
    headline: "Collagen support, antioxidant defence — by IV.",
    imageHint: "aging" },
  { pattern: "vitamin\\s?c|high[-\\s]?dose",
    headline: "High-dose Vitamin C — 25g, IV, doctor-administered.",
    imageHint: "vitamin-c" },
  { pattern: "smoker|pollution|city|oxidative",
    headline: "City-life skin? Replenish what's getting burned through.",
    imageHint: "urban" },
  { pattern: "glasgow|scotland",
    headline: "Glasgow's doctor-administered skin glow drip.",
    imageHint: "glasgow" },
];
