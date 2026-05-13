import { analyzeSkin, type SkinAnalysis } from "@lib/anthropic/analyze-skin";

export const runtime = "nodejs";
export const maxDuration = 30;

interface RequestBody {
  imageBase64?: string;
  mediaType?: "image/jpeg" | "image/png" | "image/webp";
}

export async function POST(req: Request): Promise<Response> {
  let body: RequestBody;
  try {
    body = (await req.json()) as RequestBody;
  } catch {
    return json(400, { ok: false, error: "Invalid JSON" });
  }

  const { imageBase64, mediaType } = body;
  if (!imageBase64 || !mediaType) {
    return json(400, { ok: false, error: "imageBase64 and mediaType are required" });
  }
  if (!["image/jpeg", "image/png", "image/webp"].includes(mediaType)) {
    return json(400, { ok: false, error: "Unsupported media type" });
  }
  // Reject anything over ~8MB after base64 inflation
  if (imageBase64.length > 11_000_000) {
    return json(413, { ok: false, error: "Image too large (max 8MB)" });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn("[analyze-skin] ANTHROPIC_API_KEY not set — returning fallback");
    return json(200, { ok: true, analysis: fallbackAnalysis() });
  }

  try {
    const analysis = await analyzeSkin({ imageBase64, mediaType });
    if (!analysis) {
      return json(200, { ok: true, analysis: fallbackAnalysis() });
    }
    return json(200, { ok: true, analysis });
  } catch (e) {
    console.error("[analyze-skin] Claude error", e);
    return json(200, { ok: true, analysis: fallbackAnalysis() });
  }
}

function fallbackAnalysis(): SkinAnalysis {
  return {
    fitzpatrick: "III",
    dominant_concern: "uneven-tone",
    severity: "mild",
    zones: [
      { region: "left-malar",    x: 0.35, y: 0.48, radius: 0.06, type: "general-pigmentation", intensity: 0.55 },
      { region: "right-malar",   x: 0.65, y: 0.48, radius: 0.06, type: "general-pigmentation", intensity: 0.55 },
      { region: "forehead",      x: 0.50, y: 0.18, radius: 0.05, type: "general-pigmentation", intensity: 0.45 },
      { region: "upper-lip",     x: 0.50, y: 0.58, radius: 0.04, type: "general-pigmentation", intensity: 0.40 },
    ],
    recommended_protocol: "Consultation Required",
    estimated_sessions: "Confirmed at consultation",
    notes:
      "We couldn't analyse this image — please book a free in-clinic consultation for a clinical assessment.",
    confidence: "low",
    analyzed_by: "fallback",
  };
}

function json(status: number, data: unknown): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}
