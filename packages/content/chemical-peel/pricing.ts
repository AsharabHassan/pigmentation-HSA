import type { PricingTier } from "@ui/sections/PricingCards";

export const tiers: PricingTier[] = [
  {
    name: "Glow Peel",
    price: "£149",
    cadence: "single · or £499 x 4",
    features: [
      "30-minute light peel",
      "Same day, no real downtime",
      "Pre-event timing (10–14 days out)",
      "Safe on sensitive skin",
    ],
    cta: { label: "Book Glow", href: "#book" },
    featured: false,
  },
  {
    name: "Clarity Peel",
    price: "£199",
    cadence: "single · or £699 x 4",
    features: [
      "Mandelic + lactic blend",
      "Safe Fitzpatrick I–VI",
      "Treats tone, pores, mild PIH",
      "Optional mesotherapy add-on",
    ],
    cta: { label: "Book Clarity", href: "#book" },
    featured: true,
  },
  {
    name: "Renewal Peel",
    price: "£279",
    cadence: "single · or £999 x 4",
    features: [
      "Medium-depth TCA / Jessner",
      "Fine lines, scarring, sun damage",
      "4–7 days visible peel",
      "Written aftercare plan",
    ],
    cta: { label: "Book Renewal", href: "#book" },
    featured: false,
  },
  {
    name: "Signature Peel",
    price: "£349",
    cadence: "single · or £1,249 x 4",
    features: [
      "Custom multi-acid + mesotherapy",
      "Stubborn melasma & deeper scarring",
      "Doctor-applied, neutralised on contact",
      "Includes LED + take-home kit",
    ],
    cta: { label: "Book Signature", href: "#book" },
    featured: false,
  },
];
