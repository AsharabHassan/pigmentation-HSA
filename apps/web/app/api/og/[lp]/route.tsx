import { ImageResponse } from "next/og";

export const runtime = "edge";

const HEADLINES: Record<string, string> = {
  pigmentation: "Clear pigmentation. Permanently. Without rebound.",
  "chemical-peel": "Medical-grade peels. Doctor-led.",
  "skin-glow-drip": "Brighter, more even skin. Backed by medicine.",
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ lp: string }> },
) {
  const { lp } = await params;
  const headline = HEADLINES[lp] ?? HEADLINES.pigmentation;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column",
          justifyContent: "space-between", padding: 80,
          background: "linear-gradient(135deg, #FAF6F1 0%, #F2EBE2 100%)",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", gap: 12 }}>
          <span style={{ fontSize: 18, letterSpacing: 4, color: "#B8945A", textTransform: "uppercase" }}>
            Harley Street Aesthetics · Glasgow
          </span>
        </div>
        <div style={{ fontSize: 72, color: "#0E0B0A", lineHeight: 1.05, maxWidth: 900, letterSpacing: -1 }}>
          {headline}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: "#6B5F5B", fontSize: 22 }}>
          <span>Doctor-led · Free consultation</span>
          <span style={{ color: "#B8945A" }}>★★★★★ 4.9</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
