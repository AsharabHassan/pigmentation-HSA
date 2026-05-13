export interface Beat {
  numeral: string;
  title: string;
  caption: string;
  illustration: "skin-cross-section" | "microchannels" | "laser-pulse" | "exosomes" | "clear-skin";
}

export const beats: Beat[] = [
  {
    numeral: "I",
    title: "The pigment lives below.",
    caption:
      "Topical creams reach only the upper 0.2mm. Pigmentation forms 2–2.4mm deeper, in the dermal layer.",
    illustration: "skin-cross-section",
  },
  {
    numeral: "II",
    title: "We open a precise aperture.",
    caption:
      "VirtueRF descends 9 microchannels at 250 microns — opening access without thermal trauma to the surrounding tissue.",
    illustration: "microchannels",
  },
  {
    numeral: "III",
    title: "A pulse fragments the pigment.",
    caption:
      "A 750-picosecond pulse shatters melanin clusters into particles small enough for the body to clear, without raising tissue temperature.",
    illustration: "laser-pulse",
  },
  {
    numeral: "IV",
    title: "Repair is infused into the channels.",
    caption:
      "Growth factors, Vitamin-C and tranexamic acid are delivered straight to the treatment depth — accelerating clearance and silencing re-pigmentation triggers.",
    illustration: "exosomes",
  },
  {
    numeral: "V",
    title: "Clearance holds.",
    caption:
      "Most patients reach ~90% clearance by week 12. With SPF discipline and a quarterly maintenance peel, results compound.",
    illustration: "clear-skin",
  },
];
