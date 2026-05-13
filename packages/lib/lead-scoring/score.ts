import type { Lead } from "../validation/lead-schema";

export type LeadTag = "lead-hot" | "lead-warm" | "lead-cold";

export function scoreLead(lead: Lead): number {
  let score = 0;
  const q = lead.quiz;

  if (q?.timing === "this week") score += 30;
  else if (q?.timing === "within a month") score += 20;

  if (q?.primary_concern === "melasma" || q?.primary_concern === "sun-damage") score += 15;

  if (q?.duration === "years" || q?.duration === "decade+") score += 10;

  if (q?.location === "Glasgow") score += 10;

  const seriousAttempts = ["prescription", "laser elsewhere", "peels"] as const;
  if (q?.tried_before.some(t => (seriousAttempts as readonly string[]).includes(t))) score += 10;

  if (lead.phone.startsWith("+")) score += 5;

  return score;
}

export function leadTag(score: number): LeadTag {
  if (score >= 50) return "lead-hot";
  if (score >= 25) return "lead-warm";
  return "lead-cold";
}
