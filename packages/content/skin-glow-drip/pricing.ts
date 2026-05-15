import type { PricingTier } from "@ui/sections/PricingCards";

/**
 * Real clinic pricing pulled from harleystreetmedics.clinic/iv-drips-glasgow.
 * Course-of-6 pricing adds a ~17% saving — not currently published by the
 * clinic, so this is the LP's differentiator vs. single-session-only competitors.
 */
export const tiers: PricingTier[] = [
  {
    name: "Glutathione Shot",
    price: "£50",
    cadence: "single · or £255 x 6",
    features: [
      "15-minute IM injection",
      "Doctor-administered",
      "Pre-event glow boost",
      "Course saves 15%",
    ],
    cta: { label: "Book a shot", href: "#book" },
    featured: false,
  },
  {
    name: "Skin Glow Drip",
    price: "£295",
    cadence: "single · or £1,475 x 6",
    features: [
      "Glutathione + Vit C + B-Complex",
      "30–45 min IV infusion",
      "6-drip course over 6 weeks",
      "Course saves 17% (£295)",
    ],
    cta: { label: "Book the Glow", href: "#book" },
    featured: true,
  },
  {
    name: "Enhanced Glow Drip",
    price: "£395",
    cadence: "single · or £1,975 x 6",
    features: [
      "Higher Glutathione + NAC + Biotin",
      "For stubborn pigmentation",
      "Doctor-formulated escalation",
      "Course saves 17% (£395)",
    ],
    cta: { label: "Book Enhanced", href: "#book" },
    featured: false,
  },
  {
    name: "Vitamin C 25g",
    price: "£195",
    cadence: "single · or £975 x 6",
    features: [
      "25g IV Vitamin C — saturating dose",
      "Collagen + immune support",
      "Adds well to peel or laser protocols",
      "Course saves 17% (£195)",
    ],
    cta: { label: "Book Vit C", href: "#book" },
    featured: false,
  },
];
