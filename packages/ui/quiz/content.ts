import type { Concern, Duration, Fitzpatrick, Tried, Goal, Timing, Location } from "./state";

export const step1: { value: Concern; label: string; sublabel: string }[] = [
  { value: "melasma",      label: "Melasma / hormonal patches",   sublabel: "Brown patches, often symmetrical" },
  { value: "sun-damage",   label: "Sun damage / age spots",       sublabel: "Solar lentigines, photoaging" },
  { value: "post-acne",    label: "Post-acne marks / dark spots", sublabel: "PIH left by past breakouts" },
  { value: "uneven-tone",  label: "Uneven skin tone / dullness",  sublabel: "Overall tone irregularity" },
  { value: "lip-pigment",  label: "Lip pigmentation / dark lips", sublabel: "Pigment on the lips" },
  { value: "underarm",     label: "Underarm / body pigmentation", sublabel: "Pigment beyond the face" },
  { value: "not-sure",     label: "I'm not sure — help me identify it", sublabel: "We'll diagnose at consult" },
];

export const step2: { value: Duration; label: string }[] = [
  { value: "<6mo",             label: "Just started (< 6 months)" },
  { value: "months-worsening", label: "Months but getting worse" },
  { value: "years",            label: "Years — I've tried things" },
  { value: "decade+",          label: "Decade+ — feels permanent" },
];

export const step3: { value: Fitzpatrick; label: string; description: string; tone: string }[] = [
  { value: "I",   label: "I",   description: "Always burns, never tans",  tone: "#F5E1D2" },
  { value: "II",  label: "II",  description: "Burns easily, tans minimally", tone: "#EBC9A6" },
  { value: "III", label: "III", description: "Burns moderately, tans gradually", tone: "#D8AB7E" },
  { value: "IV",  label: "IV",  description: "Burns minimally, tans well", tone: "#B0815A" },
  { value: "V",   label: "V",   description: "Rarely burns, tans deeply",  tone: "#7A5238" },
  { value: "VI",  label: "VI",  description: "Never burns, deeply pigmented", tone: "#3F2A1F" },
];

export const step4: { value: Tried; label: string }[] = [
  { value: "OTC creams",     label: "Over-the-counter creams" },
  { value: "prescription",   label: "Prescription cream (hydroquinone, tretinoin)" },
  { value: "peels",          label: "Chemical peels" },
  { value: "laser elsewhere", label: "Laser elsewhere" },
  { value: "home remedies",  label: "Home remedies" },
  { value: "nothing",        label: "Nothing yet" },
];

export const step5: { value: Goal; label: string }[] = [
  { value: "clear",          label: "Completely clear, even-toned skin" },
  { value: "80% reduction",  label: "80% reduction — visible, not perfect" },
  { value: "before-event",   label: "Noticeable shift before a specific event/season" },
  { value: "long-term",      label: "Long-term maintenance, not just a fix" },
];

export const step6Timing: { value: Timing; label: string }[] = [
  { value: "this week",         label: "This week" },
  { value: "within a month",    label: "Within a month" },
  { value: "within 3 months",   label: "Within 3 months" },
  { value: "researching",       label: "Just researching" },
];

export const step6Loc: { value: Location; label: string }[] = [
  { value: "Glasgow",          label: "Glasgow / Greater Glasgow" },
  { value: "Edinburgh",        label: "Edinburgh / Lothians" },
  { value: "Scotland-other",   label: "Elsewhere in Scotland" },
  { value: "UK-other",         label: "Rest of UK" },
  { value: "International",    label: "International" },
];
