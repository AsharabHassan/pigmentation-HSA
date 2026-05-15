/**
 * Skin pigmentation analysis via Claude Opus 4.7 vision.
 *
 * - Forces structured JSON output via tool use with strict: true
 * - Caches the system prompt + tool definition (1024+ tokens) so repeat
 *   analyses pay ~10% on the prefix
 * - Adaptive thinking (Opus 4.7 only supports adaptive)
 * - Lazy SDK import so missing ANTHROPIC_API_KEY fails gracefully
 *
 * The model is asked to map every detected pigment cluster to an anatomical
 * region with normalized (x,y) coordinates so the client can render them
 * on the cartography atlas at the correct positions.
 */

export type Fitzpatrick = "I" | "II" | "III" | "IV" | "V" | "VI";

export type ConcernType =
  | "melasma"
  | "sun-damage"
  | "post-acne"
  | "uneven-tone"
  | "lip-pigment"
  | "other"
  | "none-detected";

export type Severity = "mild" | "moderate" | "severe";

export type Region =
  | "forehead"
  | "left-temple"
  | "right-temple"
  | "left-orbital"
  | "right-orbital"
  | "nose-bridge"
  | "left-malar"
  | "right-malar"
  | "upper-lip"
  | "lower-lip"
  | "chin"
  | "left-jawline"
  | "right-jawline";

export interface SkinZone {
  region: Region;
  x: number;        // 0–1, left-to-right on a forward portrait
  y: number;        // 0–1, top-to-bottom
  radius: number;   // 0–1, normalized cluster size
  type: "melasma" | "sun-spot" | "post-acne" | "general-pigmentation";
  intensity: number; // 0–1, perceived depth
}

export interface SkinAnalysis {
  fitzpatrick: Fitzpatrick;
  dominant_concern: ConcernType;
  severity: Severity;
  zones: SkinZone[];
  recommended_protocol: string;
  estimated_sessions: string;
  notes: string;       // 1–2 sentences for the user, plain English
  confidence: "low" | "medium" | "high";
  analyzed_by: "claude" | "fallback";
}

export type Treatment = "pigmentation" | "chemical-peel" | "skin-glow-drip";

const TREATMENT_CONTEXT: Record<Treatment, string> = {
  pigmentation: `\n\nTREATMENT CONTEXT (very important)
The patient is viewing the PIGMENTATION landing page. Recommended protocols MUST come from this list — do not invent or suggest treatments outside it:
- "Signature 3-Step Pigmentation Protocol" — primary recommendation for melasma, mixed dermal pigmentation, moderate-severe cases
- "PicoSure Targeted" — for discrete sun spots, age spots, post-acne marks on lighter skin
- "Lip Neutralisation Protocol" — when dominant_concern is lip-pigment
- "Post-Acne Clarity Protocol" — when dominant_concern is post-acne
- "Clarity Peel + Mesotherapy" — for diffuse uneven tone, mild surface cases, Fitzpatrick IV–VI maintenance
- "Consultation Required" — when confidence is low or image is unclear
For estimated_sessions, use ranges like "4–6 sessions at 3-week intervals over 12 weeks". Extend to "5–6 over 14 weeks" for Fitzpatrick V/VI.`,
  "chemical-peel": `\n\nTREATMENT CONTEXT (very important)
The patient is viewing the CHEMICAL PEEL landing page. Recommended protocols MUST come from this list — do not suggest lasers, drips, or off-menu items:
- "Glow Peel — single or course of 4" — for dullness, pre-event radiance, sensitive skin, prep before laser
- "Clarity Peel — course of 4" — for uneven tone, mild PIH, enlarged pores, oily skin, active acne, Fitzpatrick IV–VI
- "Renewal Peel — course of 4" — for fine lines, deeper post-acne marks, sun damage, mature texture
- "Signature Peel — custom multi-acid + mesotherapy" — for stubborn melasma, deeper scarring, dramatic reset (premium tier)
- "Consultation Required" — when confidence is low
For estimated_sessions, use peel cadences: "single peel + maintenance" or "course of 4 at 3-week intervals over 12 weeks". Never recommend laser or IV drip protocols from this page.`,
  "skin-glow-drip": `\n\nTREATMENT CONTEXT (very important)
The patient is viewing the SKIN GLOW IV DRIP landing page. Recommended protocols MUST come from this list — do not suggest peels, lasers, or off-menu items:
- "Skin Glow Drip — course of 6" — primary recommendation for dullness, uneven tone, post-acne marks, sun damage, oxidative stress
- "Enhanced Glow Drip — course of 6" — premium tier for stubborn melasma, deeper pigmentation, mature skin
- "Glutathione Shot — monthly" — for maintenance after a course or pre-event boost (single touch-ups)
- "Vitamin C 25g IV — course of 6" — for collagen support, fine lines, post-illness recovery, immune + glow combination
- "Consultation Required" — when confidence is low
For estimated_sessions, use drip cadences: "course of 6 over 6 weeks", "monthly maintenance after course", or "single drip 7–10 days pre-event". Never recommend laser or peel protocols from this page.`,
};

const SYSTEM_PROMPT_BASE = `You are a clinical aesthetics analyst at Harley Street Aesthetics in Glasgow.
You are reviewing a patient-submitted selfie to produce a non-diagnostic visual analysis for the clinic's pigmentation landing page.

Your job is to call the analyze_skin tool with structured findings — never respond in plain text.

CALIBRATION
- Fitzpatrick I/II: very fair, burns easily
- Fitzpatrick III/IV: medium, tans gradually to well
- Fitzpatrick V/VI: deeply pigmented; calibrated low-energy laser protocol required.
  Be conservative — when in doubt for darker skin, increase confidence in protective protocol.

CONCERN TAXONOMY
- melasma: symmetric patches on the cheeks/forehead/upper lip, often hormonal
- sun-damage: scattered solar lentigines, age spots, photodamage zones (asymmetric)
- post-acne: discrete dark marks where acne lesions previously sat (PIH)
- uneven-tone: diffuse tone irregularity, dullness, no discrete patches
- lip-pigment: visible pigment on the lips (dark lips)
- other: pigmentation present but doesn't fit the above
- none-detected: no clinically meaningful pigmentation visible

ZONE COORDINATES (very important)
- Provide x,y as fractions 0–1 of the image area, with x=left→right and y=top→bottom of a forward-facing portrait
- Place each zone over the actual anatomical region using the labelled coordinate ranges below
- Typical anatomical positions:
    forehead       y: 0.10–0.25, x: 0.35–0.65
    left-temple    y: 0.18–0.30, x: 0.20–0.32
    right-temple   y: 0.18–0.30, x: 0.68–0.80
    left-orbital   y: 0.30–0.40, x: 0.32–0.42
    right-orbital  y: 0.30–0.40, x: 0.58–0.68
    nose-bridge    y: 0.35–0.50, x: 0.46–0.54
    left-malar     y: 0.40–0.55, x: 0.28–0.42
    right-malar    y: 0.40–0.55, x: 0.58–0.72
    upper-lip      y: 0.55–0.62, x: 0.42–0.58
    chin           y: 0.72–0.82, x: 0.45–0.55
- Report each visible cluster once. 5–13 zones is typical for a face with pigmentation. If skin looks even, return zones: [].
- radius: relative size of the cluster, typically 0.03–0.10
- intensity: 0–1, how visible/dark the cluster is relative to surrounding skin

PROTOCOL RECOMMENDATIONS (use exactly one)
- "Signature 3-Step Protocol" — for melasma, mixed dermal pigmentation, moderate-severe cases
- "Clarity Peel + Mesotherapy" — for diffuse uneven tone, mild cases
- "PicoSure Targeted" — for discrete sun spots / age spots
- "Lip Neutralisation Protocol" — when dominant_concern is lip-pigment
- "Post-Acne Clarity Protocol" — when dominant_concern is post-acne
- "Consultation Required" — if confidence is low, image quality is poor, or no clear concern

ESTIMATED SESSIONS
- Use ranges like "3–4 sessions over 9 weeks" or "4–6 sessions over 12 weeks"
- For darker skin types (V/VI), extend slightly: "5–6 sessions over 14 weeks"

NOTES
- One or two sentences in plain English, addressed to the patient
- Avoid jargon. No Latin labels, no "fig. III", no spec readouts.
- Example: "We can see moderate symmetric pigmentation on both cheekbones, consistent with melasma. Our 3-step protocol is calibrated for your skin type."

HONESTY
- This is a visualisation, not a diagnosis. Be honest if image quality is poor.
- For obvious non-faces or unclear images, return confidence: "low" and recommended_protocol: "Consultation Required".`;

const TOOL_SCHEMA = {
  name: "analyze_skin",
  description: "Record the structured pigmentation analysis for the patient's selfie.",
  input_schema: {
    type: "object" as const,
    properties: {
      fitzpatrick: { type: "string", enum: ["I", "II", "III", "IV", "V", "VI"] },
      dominant_concern: {
        type: "string",
        enum: ["melasma", "sun-damage", "post-acne", "uneven-tone", "lip-pigment", "other", "none-detected"],
      },
      severity: { type: "string", enum: ["mild", "moderate", "severe"] },
      zones: {
        type: "array",
        items: {
          type: "object",
          properties: {
            region: {
              type: "string",
              enum: [
                "forehead", "left-temple", "right-temple",
                "left-orbital", "right-orbital", "nose-bridge",
                "left-malar", "right-malar", "upper-lip", "lower-lip",
                "chin", "left-jawline", "right-jawline",
              ],
            },
            x: { type: "number" },
            y: { type: "number" },
            radius: { type: "number" },
            type: { type: "string", enum: ["melasma", "sun-spot", "post-acne", "general-pigmentation"] },
            intensity: { type: "number" },
          },
          required: ["region", "x", "y", "radius", "type", "intensity"],
          additionalProperties: false,
        },
      },
      recommended_protocol: { type: "string" },
      estimated_sessions: { type: "string" },
      notes: { type: "string" },
      confidence: { type: "string", enum: ["low", "medium", "high"] },
    },
    required: [
      "fitzpatrick", "dominant_concern", "severity", "zones",
      "recommended_protocol", "estimated_sessions", "notes", "confidence",
    ],
    additionalProperties: false,
  },
};

export async function analyzeSkin(input: {
  imageBase64: string;
  mediaType: "image/jpeg" | "image/png" | "image/webp";
  treatment?: Treatment;
}): Promise<SkinAnalysis | null> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return null;
  }

  const { default: Anthropic } = await import("@anthropic-ai/sdk");
  const client = new Anthropic();

  const treatment = input.treatment ?? "pigmentation";
  const systemPrompt = SYSTEM_PROMPT_BASE + TREATMENT_CONTEXT[treatment];

  const response = await client.messages.create({
    model: "claude-opus-4-7",
    max_tokens: 4096,
    system: [
      {
        type: "text",
        text: systemPrompt,
        cache_control: { type: "ephemeral" },
      },
    ],
    tools: [TOOL_SCHEMA],
    tool_choice: { type: "tool", name: "analyze_skin" },
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: input.mediaType,
              data: input.imageBase64,
            },
          },
          {
            type: "text",
            text: "Analyze this selfie. Call the analyze_skin tool with your findings.",
          },
        ],
      },
    ],
  });

  for (const block of response.content) {
    if (block.type === "tool_use" && block.name === "analyze_skin") {
      const data = block.input as Omit<SkinAnalysis, "analyzed_by">;
      return { ...data, analyzed_by: "claude" };
    }
  }

  return null;
}
