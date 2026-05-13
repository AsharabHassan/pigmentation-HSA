export interface Beat {
  numeral: string;
  title: string;
  caption: string;
  illustration: "cream-stops" | "laser-reaches" | "body-clears";
}

/**
 * Three plain-English steps. Anyone — your mother, your neighbour, a 14-year-old —
 * should "get" this without re-reading.
 */
export const beats: Beat[] = [
  {
    numeral: "01",
    title: "Why creams aren't working.",
    caption:
      "Your pigmentation lives about 2mm under your skin. Creams only reach the top 0.2mm. That's why they plateau, no matter how expensive.",
    illustration: "cream-stops",
  },
  {
    numeral: "02",
    title: "We treat where it actually lives.",
    caption:
      "A medical laser passes harmlessly through the surface and breaks up the deep pigment into tiny pieces — without damaging the skin around it.",
    illustration: "laser-reaches",
  },
  {
    numeral: "03",
    title: "Your body clears it naturally.",
    caption:
      "Over the next few weeks your lymphatic system removes the broken-up pigment. Four to six sessions, three weeks apart, and the result holds.",
    illustration: "body-clears",
  },
];
