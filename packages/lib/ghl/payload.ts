import type { Lead } from "../validation/lead-schema";
import type { LeadTag } from "../lead-scoring/score";
import type { GhlContact } from "./types";

function splitName(fullName: string): { first: string; last: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return { first: parts[0], last: "" };
  return { first: parts[0], last: parts.slice(1).join(" ") };
}

const concernToProtocol: Record<string, string> = {
  "melasma": "Signature 3-Step",
  "sun-damage": "Signature 3-Step",
  "post-acne": "Signature 3-Step + Mesotherapy",
  "uneven-tone": "Clarity Peel + Mesotherapy",
  "lip-pigment": "Lip Neutralisation Protocol",
  "underarm": "Underarm Clarity Protocol",
  "not-sure": "Consultation Required",
};

const concernToSessions: Record<string, string> = {
  "melasma": "4-6 over 12 weeks",
  "sun-damage": "3-4 over 9 weeks",
  "post-acne": "4-6 over 12 weeks",
  "uneven-tone": "3-5 over 9 weeks",
  "lip-pigment": "3-4 over 8 weeks",
  "underarm": "4-6 over 12 weeks",
  "not-sure": "TBD at consultation",
};

export function buildGhlContact(
  lead: Lead,
  source: string,
  tag: LeadTag,
  score: number,
): GhlContact {
  const { first, last } = splitName(lead.fullName);
  const q = lead.quiz;

  const tags = [
    "lp-pigmentation",
    q ? "quiz-complete" : "quiz-partial",
    q && `concern-${q.primary_concern}`,
    q && `fitzpatrick-${q.fitzpatrick}`,
    q && `urgency-${q.timing.replace(/\s+/g, "-")}`,
    q && `loc-${q.location.toLowerCase()}`,
    tag,
    lead.marketingConsent && "marketing-opt-in",
  ].filter(Boolean) as string[];

  const protocol = q ? concernToProtocol[q.primary_concern] : null;
  const sessions = q ? concernToSessions[q.primary_concern] : null;

  return {
    firstName: first,
    lastName: last,
    email: lead.email,
    phone: lead.phone,
    source,
    tags,
    customFields: {
      primary_concern: q?.primary_concern ?? null,
      duration: q?.duration ?? null,
      fitzpatrick: q?.fitzpatrick ?? null,
      tried_before: q?.tried_before ?? null,
      goal: q?.goal ?? null,
      timing: q?.timing ?? null,
      location: q?.location ?? null,
      recommended_protocol: protocol,
      estimated_sessions: sessions,
      lead_score: score,
      utm_source: lead.utm.utm_source,
      utm_medium: lead.utm.utm_medium,
      utm_campaign: lead.utm.utm_campaign,
      utm_term: lead.utm.utm_term,
      gclid: lead.utm.gclid,
      fbclid: lead.utm.fbclid,
      landing_page_url: lead.utm.landing_page_url,
      referrer: lead.utm.referrer,
    },
  };
}
