import { kv } from "@vercel/kv";
import { leadSchema } from "@lib/validation/lead-schema";
import { normalizePhone } from "@lib/validation/phone";
import { hasMxRecord } from "@lib/validation/email-mx";
import { scoreLead, leadTag } from "@lib/lead-scoring/score";
import { buildGhlContact } from "@lib/ghl/payload";
import { ghlUpsertContact } from "@lib/ghl/client";
import type { CountryCode } from "libphonenumber-js";

export const runtime = "edge";

const protocolMap: Record<string, string> = {
  "melasma": "Signature 3-Step", "sun-damage": "Signature 3-Step",
  "post-acne": "Signature 3-Step + Mesotherapy", "uneven-tone": "Clarity Peel + Mesotherapy",
  "lip-pigment": "Lip Neutralisation Protocol", "underarm": "Underarm Clarity Protocol",
  "not-sure": "Consultation Required",
};
const sessionsMap: Record<string, string> = {
  "melasma": "4-6 over 12 weeks", "sun-damage": "3-4 over 9 weeks",
  "post-acne": "4-6 over 12 weeks", "uneven-tone": "3-5 over 9 weeks",
  "lip-pigment": "3-4 over 8 weeks", "underarm": "4-6 over 12 weeks",
  "not-sure": "TBD at consultation",
};

export async function POST(req: Request): Promise<Response> {
  let raw: Record<string, unknown>;
  try { raw = await req.json() as Record<string, unknown>; }
  catch { return json(400, { ok: false, error: "Invalid JSON" }); }

  const country = ((raw.phoneCountry as string) || "GB") as CountryCode;
  const phoneE164 = typeof raw.rawPhone === "string" ? normalizePhone(raw.rawPhone, country) : null;
  if (!phoneE164) return json(400, { ok: false, fieldErrors: { phone: "Enter a valid mobile number" } });

  if (typeof raw.email === "string" && !(await hasMxRecord(raw.email))) {
    return json(400, { ok: false, fieldErrors: { email: "This email domain doesn't accept mail" } });
  }

  const parsed = leadSchema.safeParse({
    fullName: raw.fullName, email: raw.email, phone: phoneE164,
    consent: raw.consent, marketingConsent: raw.marketingConsent ?? false,
    source: raw.source ?? "lp-pigmentation",
    quiz: raw.quiz, utm: raw.utm,
  });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] = issue.message;
    return json(400, { ok: false, fieldErrors });
  }

  const lead = parsed.data;
  const score = scoreLead(lead);
  const tag = leadTag(score);
  const contact = buildGhlContact(lead, "Pigmentation LP — Glasgow", tag, score);

  const result = await ghlUpsertContact(contact);

  if (!result.ok) {
    const id = crypto.randomUUID();
    await kv.set(`leads:failed:${id}`, JSON.stringify({
      contact, lead, attempts: 1, firstAttempt: Date.now(),
    }), { ex: 60 * 60 * 24 * 7 });
  }

  const eventId = (raw.eventId as string) ?? crypto.randomUUID();
  const concern = lead.quiz?.primary_concern;
  return json(200, {
    ok: true,
    eventId,
    reveal: {
      firstName: contact.firstName,
      concern: lead.quiz?.primary_concern ?? null,
      fitzpatrick: lead.quiz?.fitzpatrick ?? null,
      recommendedProtocol: concern ? protocolMap[concern] : null,
      estimatedSessions: concern ? sessionsMap[concern] : null,
      tag,
    },
  });
}

function json(status: number, data: unknown): Response {
  return new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });
}
