interface Rule {
  test: RegExp;
  headline: string;
  imageHint: string;
}

const RULES: Rule[] = [
  { test: /melasma/i,             headline: "Stubborn melasma. Finally answered.",        imageHint: "melasma" },
  { test: /lip/i,                 headline: "Restore your lip colour. Naturally. Safely.", imageHint: "lip" },
  { test: /age[\s-]?spot|sun[\s-]?damage/i, headline: "Sun damage, undone. In as few as 3 sessions.", imageHint: "sun-damage" },
  { test: /whitening|brightening/i, headline: "Brighter, more even skin. Backed by medicine.", imageHint: "brightening" },
  { test: /glasgow|scotland/i,    headline: "Glasgow's doctor-led pigmentation clinic.",   imageHint: "glasgow" },
  { test: /hyperpigmentation/i,   headline: "Clear hyperpigmentation. Permanently. Without rebound.", imageHint: "hyperpig" },
];

const DEFAULT: Rule = {
  test: /.*/,
  headline: "Clear pigmentation. Permanently. Without rebound.",
  imageHint: "default",
};

export function matchHeadline(utmTerm: string | null | undefined): string {
  return matchRule(utmTerm).headline;
}

export function matchImageHint(utmTerm: string | null | undefined): string {
  return matchRule(utmTerm).imageHint;
}

function matchRule(term: string | null | undefined): Rule {
  if (!term) return DEFAULT;
  for (const rule of RULES) if (rule.test.test(term)) return rule;
  return DEFAULT;
}
