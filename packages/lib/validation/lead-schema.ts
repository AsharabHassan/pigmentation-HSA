import { z } from "zod";

const nameSchema = z
  .string()
  .trim()
  .min(2, "Name is too short")
  .max(100, "Name is too long")
  .regex(/^[\p{L}][\p{L}\s'\-.]+$/u, "Use letters, spaces, apostrophes, hyphens only");

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Enter a valid email address")
  .max(254);

const phoneSchema = z.string().trim().min(7).max(20);

const quizSchema = z.object({
  primary_concern: z.enum([
    "melasma", "sun-damage", "post-acne", "uneven-tone",
    "lip-pigment", "underarm", "not-sure",
  ]),
  duration: z.enum(["<6mo", "months-worsening", "years", "decade+"]),
  fitzpatrick: z.enum(["I", "II", "III", "IV", "V", "VI"]),
  tried_before: z.array(z.enum([
    "OTC creams", "prescription", "peels", "laser elsewhere",
    "home remedies", "nothing",
  ])).max(6),
  goal: z.enum(["clear", "80% reduction", "before-event", "long-term"]),
  timing: z.enum(["this week", "within a month", "within 3 months", "researching"]),
  location: z.enum([
    "Glasgow", "Edinburgh", "Scotland-other", "UK-other", "International",
  ]),
});

const utmSchema = z.object({
  utm_source:       z.string().nullable(),
  utm_medium:       z.string().nullable(),
  utm_campaign:     z.string().nullable(),
  utm_term:         z.string().nullable(),
  gclid:            z.string().nullable(),
  fbclid:           z.string().nullable(),
  landing_page_url: z.string().nullable(),
  referrer:         z.string().nullable(),
});

export const leadSchema = z.object({
  fullName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  consent: z.literal(true, { errorMap: () => ({ message: "Consent is required" }) }),
  marketingConsent: z.boolean(),
  source: z.string().min(1),
  quiz: quizSchema.optional(),
  utm: utmSchema,
});

export type Lead = z.infer<typeof leadSchema>;
export type LeadQuiz = z.infer<typeof quizSchema>;
export type LeadUtm = z.infer<typeof utmSchema>;
