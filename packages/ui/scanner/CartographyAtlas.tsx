"use client";
import { useMemo } from "react";

export interface AtlasZone {
  x: number;        // 0–1
  y: number;        // 0–1
  radius: number;   // 0–1
  intensity?: number;
  region?: string;
}

interface Props {
  /** Skin type — influences base luminance */
  skin?: "I" | "II" | "III" | "IV" | "V" | "VI";
  /** Explicit zones from Claude vision. If provided, used directly. */
  zones?: AtlasZone[];
  /** Fallback: random seed used when no zones provided */
  seed?: number;
  /** Fallback zone count when only a seed is given */
  zoneCount?: number;
  preview?: boolean;
  scanning?: boolean;
  blurred?: boolean;
}

/**
 * CartographyAtlas — an abstracted topographic rendering of pigmentation density.
 * Never the user's face. Concentric gold contour lines + density clusters,
 * placed deterministically by seed or directly from Claude vision output.
 */
export function CartographyAtlas({
  skin = "III",
  zones,
  seed = 42,
  zoneCount = 9,
  preview = false,
  scanning = false,
  blurred = false,
}: Props) {
  const placedZones = useMemo(() => {
    if (zones && zones.length > 0) {
      return zones.map(z => ({
        x: z.x * 400,
        y: z.y * 500,
        r: Math.max(8, Math.min(28, z.radius * 320)),
        intensity: z.intensity ?? 0.8,
      }));
    }
    return generateFallbackClusters(seed, zoneCount);
  }, [zones, seed, zoneCount]);

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
          <stop offset="0%"  stopColor="#FAF6EE" stopOpacity="1" />
          <stop offset="55%" stopColor="#F2EBDD" stopOpacity="1" />
          <stop offset="100%" stopColor="#E5DAC4" stopOpacity="1" />
        </radialGradient>

        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#B85A3C" strokeOpacity="0.08" strokeWidth="0.5" />
        </pattern>

        <pattern id="dense-grid" width="80" height="80" patternUnits="userSpaceOnUse">
          <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#B85A3C" strokeOpacity="0.15" strokeWidth="0.5" />
        </pattern>

        <radialGradient id="cluster" cx="50%" cy="50%" r="50%">
          <stop offset="0%"  stopColor="#B85A3C" stopOpacity="0.85" />
          <stop offset="50%" stopColor="#B85A3C" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#B85A3C" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="400" height="500" fill="#FAF6EE" />
      <rect width="400" height="500" fill="url(#atlas-bg)" />
      <rect width="400" height="500" fill="url(#grid)" />
      <rect width="400" height="500" fill="url(#dense-grid)" />

      {/* Stylised facial region map — never a likeness */}
      <g stroke="#B85A3C" fill="none" strokeWidth="0.6" opacity="0.35">
        <ellipse cx="200" cy="240" rx="125" ry="170" />
        <ellipse cx="200" cy="240" rx="105" ry="148" />
        <ellipse cx="200" cy="240" rx="82" ry="120" />
        <ellipse cx="200" cy="240" rx="56" ry="86" />
        <line x1="115" y1="195" x2="170" y2="195" />
        <line x1="230" y1="195" x2="285" y2="195" />
        <line x1="200" y1="200" x2="200" y2="290" />
        <line x1="170" y1="320" x2="230" y2="320" />
        {[-1, 0, 1].map(i => (
          <line key={i} x1={185 + i * 15} y1={385} x2={185 + i * 15} y2={395} />
        ))}
      </g>

      {/* Region survey labels */}
      <g stroke="#B85A3C" strokeOpacity="0.35" strokeWidth="0.5" fill="#B85A3C" fillOpacity="0.7"
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
        {placedZones.map((z, i) => (
          <g key={i}>
            <circle
              cx={z.x} cy={z.y} r={z.r}
              fill="url(#cluster)"
              opacity={0.4 + (z.intensity ?? 0.8) * 0.55}
              style={
                scanning
                  ? { animation: `clusterReveal 0.6s ease-out ${i * 90}ms backwards` }
                  : undefined
              }
            />
            {!preview && !blurred && (
              <text x={z.x + z.r + 3} y={z.y + 2}
                    fill="#B85A3C" fillOpacity="0.7"
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
          <line x1="0" y1="0" x2="400" y2="0" stroke="#B85A3C" strokeWidth="1" opacity="0.9">
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

function generateFallbackClusters(seed: number, count: number) {
  const rand = mulberry32(seed);
  const anatomicalHotspots: Array<[number, number, number]> = [
    [150, 220, 24], [250, 220, 22],
    [140, 260, 28], [260, 260, 26],
    [200, 130, 18], [180, 110, 14], [220, 110, 14],
    [200, 305, 16],
    [200, 380, 14],
    [170, 350, 12], [230, 350, 12],
  ];

  return Array.from({ length: Math.min(count, anatomicalHotspots.length) }).map((_, i) => {
    const [zx, zy, zr] = anatomicalHotspots[i];
    return {
      x: zx + (rand() - 0.5) * 18,
      y: zy + (rand() - 0.5) * 18,
      r: zr * (0.7 + rand() * 0.6),
      intensity: 0.7,
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
