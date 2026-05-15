import type { TimelineStage } from "@ui/timeline/TimelineScrubber";

/**
 * Timeline for the Renewal Peel Series (4 peels at 3-week intervals).
 * Metric is "tone & texture score" — ascending (higher is better).
 */
export const timelineStages: TimelineStage[] = [
  { weekLabel: "Day 0",
    contextLine: "Starting point. Your peel grade is matched to your skin type, concern depth, and Fitzpatrick — not the same recipe for everyone.",
    sessionLine: "Free consultation + grading",
    imgSrc: "/images/timeline/day-0.svg" },
  { weekLabel: "Day 1–7",
    contextLine: "Day 1: skin feels tight, slight pink — looks polished. Days 4–7: light, almost-invisible flaking begins. Most patients return to work the next day.",
    sessionLine: "Peel 01 — Clarity grade",
    imgSrc: "/images/timeline/wk-2.svg" },
  { weekLabel: "Wk 3",
    contextLine: "First peel cycle complete — fresh surface revealed, glow noticeable, pores already looking finer. Time for peel two.",
    sessionLine: "Peel 02 — Clarity / Renewal grade",
    imgSrc: "/images/timeline/wk-4.svg" },
  { weekLabel: "Wk 6",
    contextLine: "Cumulative renewal kicks in. Texture irregularity smooths, post-acne marks visibly lighter, tone evens across the face.",
    sessionLine: "Peel 03 — Renewal grade",
    imgSrc: "/images/timeline/wk-6.svg" },
  { weekLabel: "Wk 9",
    contextLine: "The mid-series transformation. Skin looks lit-from-within — patients consistently report compliments by this point.",
    sessionLine: "Peel 04 — Renewal grade",
    imgSrc: "/images/timeline/wk-9.svg" },
  { weekLabel: "Wk 12",
    contextLine: "Series complete. Texture, tone, and clarity holding. Quarterly maintenance peels keep the glow long-term.",
    sessionLine: "Review + maintenance plan",
    imgSrc: "/images/timeline/wk-12.svg" },
];

/** Ascending renewal score — higher = clearer, more even-toned. */
export const timelineMetricValues = [0.22, 0.38, 0.50, 0.66, 0.80, 0.92];
