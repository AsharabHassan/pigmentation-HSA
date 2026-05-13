export interface Beat {
  title: string;
  caption: string;
  illustration: "skin-cross-section" | "microchannels" | "laser-pulse" | "exosomes" | "clear-skin";
}

export const beats: Beat[] = [
  {
    title: "The skin you see is only the surface.",
    caption: "Pigmentation lives at multiple depths. Topical creams only reach the top 15%.",
    illustration: "skin-cross-section",
  },
  {
    title: "VirtueRF opens micro-channels.",
    caption: "Precision microchannels create access without damaging surrounding tissue.",
    illustration: "microchannels",
  },
  {
    title: "Pulsed laser shatters pigment.",
    caption: "Pulsed-mode technology fragments melanin without triggering inflammation — the root cause of rebound.",
    illustration: "laser-pulse",
  },
  {
    title: "Exosomes + mesotherapy infuse repair.",
    caption: "Growth factors and customised actives accelerate clearance and even tone — for weeks after the session.",
    illustration: "exosomes",
  },
  {
    title: "Result: pigment lifted, not masked.",
    caption: "Clear skin that holds — typically over 4-6 sessions spaced 3 weeks apart.",
    illustration: "clear-skin",
  },
];
