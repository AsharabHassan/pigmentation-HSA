/**
 * Headline rules are serialised as plain string patterns so they can
 * cross the React Server Components boundary (RegExp instances can't).
 * The regex is compiled lazily inside the client component.
 */
export interface HeadlineRule {
  pattern: string;
  flags?: string;
  headline: string;
  imageHint: string;
}

const RULES: HeadlineRule[] = [
  { pattern: "melasma",                              headline: "Stubborn melasma. Finally answered.",                  imageHint: "melasma" },
  { pattern: "lip",                                  headline: "Restore your lip colour. Naturally. Safely.",          imageHint: "lip" },
  { pattern: "age[\\s-]?spot|sun[\\s-]?damage",      headline: "Sun damage, undone. In as few as 3 sessions.",         imageHint: "sun-damage" },
  { pattern: "whitening|brightening",                headline: "Brighter, more even skin. Backed by medicine.",        imageHint: "brightening" },
  { pattern: "glasgow|scotland",                     headline: "Glasgow's doctor-led pigmentation clinic.",            imageHint: "glasgow" },
  { pattern: "hyperpigmentation",                    headline: "Clear hyperpigmentation. Permanently. Without rebound.", imageHint: "hyperpig" },
];

const DEFAULT_HEADLINE = "Clear pigmentation. Permanently. Without rebound.";

function ruleMatches(rule: HeadlineRule, term: string): boolean {
  try {
    return new RegExp(rule.pattern, rule.flags ?? "i").test(term);
  } catch {
    return false;
  }
}

export function matchHeadline(
  utmTerm: string | null | undefined,
  rules: HeadlineRule[] = RULES,
  fallback: string = DEFAULT_HEADLINE,
): string {
  if (!utmTerm) return fallback;
  for (const rule of rules) if (ruleMatches(rule, utmTerm)) return rule.headline;
  return fallback;
}

export function matchImageHint(utmTerm: string | null | undefined): string {
  if (!utmTerm) return "default";
  for (const rule of RULES) if (ruleMatches(rule, utmTerm)) return rule.imageHint;
  return "default";
}
