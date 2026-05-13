"use client";
import { useMemo } from "react";

interface Props {
  /** Deterministic seed so the same upload yields the same map */
  seed: number;
  /** Count of detected pigmentation zones to render */
  zones: number;
  /** Fitzpatrick type — influences base luminance */
  skin?: "I" | "II" | "III" | "IV" | "V" | "VI";
  preview?: boolean;
  scanning?: boolean;
  blurred?: boolean;
}

/**
 * CartographyAtlas — an abstracted topographic rendering of pigmentation density.
 * Never the user's face. Concentric gold contour lines + density clusters,
 * placed deterministically by seed across a stylised facial region map.
 *
 * Visual language: late-19th-century cartography, but rendered in gold-on-black.
 * Reads as clinical-prestige rather than tech-demo.
 */
export function CartographyAtlas({
  seed, zones, skin = "III",
  preview = false, scanning = false, blurred = false,
}: Props) {
  const clusters = useMemo(() => generateClusters(seed, zones), [seed, zones]);
  const luminance = skinToLuminance(skin);

  return (
    <svg
      viewBox="0 0 400 500"
      role="img"
      aria-label="Topographic map of pigmentation density"
      className={`w-full h-full ${blurred ? "blur-sm" : ""}`}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id="atlas-bg" cx="50%" cy="42%" r="62%">
          <stop offset="0%"  stopColor={`hsl(40 30% ${luminance + 4}%)`} stopOpacity="0.25" />
          <stop offset="55%" stopColor="#0F0F0F" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#000" stopOpacity="1" />
        </radialGradient>

        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#C9A65C" strokeOpacity="0.05" strokeWidth="0.5" />
        </pattern>

        <pattern id="dense-grid" width="80" height="80" patternUnits="userSpaceOnUse">
          <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#C9A65C" strokeOpacity="0.12" strokeWidth="0.5" />
        </pattern>

        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" />
          <feColorMatrix values="0 0 0 0 0.79  0 0 0 0 0.65  0 0 0 0 0.36  0 0 0 0.08 0" />
        </filter>

        <radialGradient id="cluster" cx="50%" cy="50%" r="50%">
          <stop offset="0%"  stopColor="#E6CB8F" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#C9A65C" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#C9A65C" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="400" height="500" fill="#000" />
      <rect width="400" height="500" fill="url(#atlas-bg)" />
      <rect width="400" height="500" fill="url(#grid)" />
      <rect width="400" height="500" fill="url(#dense-grid)" />
      <rect width="400" height="500" fill="url(#grain)" opacity="0.4" />

      {/* Stylised facial region map — never a likeness, just oval contour topology */}
      <g stroke="#C9A65C" fill="none" strokeWidth="0.6" opacity="0.35">
        {/* outer face contour */}
        <ellipse cx="200" cy="240" rx="125" ry="170" />
        <ellipse cx="200" cy="240" rx="105" ry="148" />
        <ellipse cx="200" cy="240" rx="82" ry="120" />
        <ellipse cx="200" cy="240" rx="56" ry="86" />
        {/* eye lines */}
        <line x1="115" y1="195" x2="170" y2="195" />
        <line x1="230" y1="195" x2="285" y2="195" />
        {/* nose ridge */}
        <line x1="200" y1="200" x2="200" y2="290" />
        {/* mouth line */}
        <line x1="170" y1="320" x2="230" y2="320" />
        {/* jaw ticks */}
        {[-1, 0, 1].map(i => (
          <line key={i} x1={185 + i * 15} y1={385} x2={185 + i * 15} y2={395} />
        ))}
      </g>

      {/* Region label hairlines — read like a survey chart */}
      <g stroke="#C9A65C" strokeOpacity="0.35" strokeWidth="0.5" fill="#C9A65C" fillOpacity="0.7"
         fontFamily="DM Mono, monospace" fontSize="7" letterSpacing="1.5">
        <line x1="60" y1="170" x2="115" y2="195" />
        <text x="20" y="172">L. ORBITAL</text>
        <line x1="345" y1="170" x2="285" y2="195" />
        <text x="318" y="172">R. ORBITAL</text>
        <line x1="40" y1="270" x2="105" y2="270" />
        <text x="6" y="272">L. MALAR</text>
        <line x1="360" y1="270" x2="295" y2="270" />
        <text x="332" y="272">R. MALAR</text>
        <line x1="200" y1="80" x2="200" y2="120" />
        <text x="173" y="76">FRONTAL</text>
        <line x1="200" y1="430" x2="200" y2="395" />
        <text x="183" y="445">MENTAL</text>
      </g>

      {/* Pigmentation density clusters */}
      <g>
        {clusters.map((c, i) => (
          <g key={i}>
            <circle
              cx={c.x} cy={c.y} r={c.r}
              fill="url(#cluster)"
              style={
                scanning
                  ? { animation: `clusterReveal 0.6s ease-out ${i * 90}ms backwards` }
                  : undefined
              }
            />
            {/* tiny index number, mono */}
            {!preview && !blurred && (
              <text x={c.x + c.r + 3} y={c.y + 2}
                    fill="#C9A65C" fillOpacity="0.7"
                    fontFamily="DM Mono, monospace" fontSize="6">
                {String(i + 1).padStart(2, "0")}
              </text>
            )}
          </g>
        ))}
      </g>

      {/* Scan sweep */}
      {scanning && (
        <g>
          <line x1="0" y1="0" x2="400" y2="0" stroke="#C9A65C" strokeWidth="1" opacity="0.9">
            <animate attributeName="y1" from="0" to="500" dur="2.5s" fill="freeze" />
            <animate attributeName="y2" from="0" to="500" dur="2.5s" fill="freeze" />
          </line>
          <rect x="0" y="0" width="400" height="50" fill="url(#cluster)" opacity="0.4">
            <animate attributeName="y" from="-50" to="500" dur="2.5s" fill="freeze" />
          </rect>
        </g>
      )}

      <style>{`
        @keyframes clusterReveal {
          from { opacity: 0; transform: scale(0.6); transform-origin: center; }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </svg>
  );
}

function generateClusters(seed: number, count: number) {
  const rand = mulberry32(seed);
  // Anatomically plausible pigment hotspots — malar zones, forehead, upper lip, chin
  const zones: Array<[number, number, number]> = [
    [150, 220, 24], [250, 220, 22], // upper malar
    [140, 260, 28], [260, 260, 26], // lower malar
    [200, 130, 18], [180, 110, 14], [220, 110, 14], // forehead
    [200, 305, 16], // upper lip
    [200, 380, 14], // chin
    [170, 350, 12], [230, 350, 12], // jawline corners
  ];

  return Array.from({ length: Math.min(count, zones.length) }).map((_, i) => {
    const [zx, zy, zr] = zones[i];
    return {
      x: zx + (rand() - 0.5) * 18,
      y: zy + (rand() - 0.5) * 18,
      r: zr * (0.7 + rand() * 0.6),
    };
  });
}

function mulberry32(a: number) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function skinToLuminance(s: NonNullable<Props["skin"]>): number {
  return ({ I: 38, II: 32, III: 26, IV: 20, V: 14, VI: 9 } as const)[s];
}
