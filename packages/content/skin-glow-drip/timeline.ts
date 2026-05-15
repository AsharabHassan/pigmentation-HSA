import type { TimelineStage } from "@ui/timeline/TimelineScrubber";

/**
 * Skin Glow Drip — 6-drip course over 6 weeks.
 * Metric is "glow score" — ascending (higher is better).
 */
export const timelineStages: TimelineStage[] = [
  { weekLabel: "Wk 0",
    contextLine: "Baseline. Bloodwork screen, consultation, and the first infusion. Most patients leave with a subtle freshness the same evening.",
    sessionLine: "Drip 01 — Skin Glow",
    imgSrc: "/images/timeline/day-0.svg" },
  { weekLabel: "Wk 1",
    contextLine: "Antioxidant reserves rebuilding. Skin starts to look less reactive — fewer rough patches, less afternoon dullness.",
    sessionLine: "Drip 02 — Skin Glow",
    imgSrc: "/images/timeline/wk-2.svg" },
  { weekLabel: "Wk 2",
    contextLine: "Melanin down-regulation kicks in. Tone begins to even — particularly visible on the cheekbones and forehead.",
    sessionLine: "Drip 03 — Skin Glow",
    imgSrc: "/images/timeline/wk-4.svg" },
  { weekLabel: "Wk 4",
    contextLine: "Mid-course transformation. Collagen support from the Vit C dose makes itself felt — skin reads firmer, plumper, more reflective.",
    sessionLine: "Drip 04 — Skin Glow",
    imgSrc: "/images/timeline/wk-6.svg" },
  { weekLabel: "Wk 5",
    contextLine: "The compliment phase. Friends, colleagues, mirror. Stubborn post-acne or sun-damage spots noticeably faded.",
    sessionLine: "Drip 05 — Skin Glow",
    imgSrc: "/images/timeline/wk-9.svg" },
  { weekLabel: "Wk 6",
    contextLine: "Course complete. Results typically hold for 3–6 months with good SPF and a maintenance drip every 6–8 weeks.",
    sessionLine: "Drip 06 + maintenance plan",
    imgSrc: "/images/timeline/wk-12.svg" },
];

/** Ascending glow score 0–1. */
export const timelineMetricValues = [0.22, 0.36, 0.50, 0.66, 0.82, 0.94];
