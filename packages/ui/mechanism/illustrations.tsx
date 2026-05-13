/**
 * Three plain-English explanatory illustrations for the mechanism section.
 * Designed for a regular customer to "get" in 3 seconds, not for a dermatologist.
 *
 * Visual language: a clear cross-section of skin (epidermis / dermis / fat),
 * with one BIG idea per frame — cream stops at the top, laser reaches deeper,
 * pigment disperses.
 */

interface SkinLayersProps {
  highlightLayer?: "epidermis" | "dermis" | null;
  showCream?: boolean;
  showLaser?: boolean;
  pigmentState?: "intact" | "fragmented" | "clearing" | "cleared";
}

function SkinLayers({
  highlightLayer = null,
  showCream = false,
  showLaser = false,
  pigmentState = "intact",
}: SkinLayersProps) {
  // Layer Y positions
  const SURFACE_Y = 120;
  const EPIDERMIS_BOTTOM = 175;
  const DERMIS_BOTTOM = 320;
  const FAT_BOTTOM = 420;

  const epiActive = highlightLayer === "epidermis";
  const dermActive = highlightLayer === "dermis";

  // Pigment positions in dermis
  const basePigment: [number, number, number][] = [
    [120, 240, 9], [180, 230, 7], [240, 245, 11],
    [300, 235, 8], [360, 250, 9], [420, 232, 7],
  ];

  return (
    <svg viewBox="0 0 500 460" className="w-full max-w-[560px]" role="img" aria-label="Skin cross-section">
      <defs>
        <linearGradient id="epi" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#F0DFC5" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#D9C29B" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="derm" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#5C4530" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#3A2A1E" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="fat" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#2A1F16" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#1A1410" stopOpacity="0.65" />
        </linearGradient>
        <linearGradient id="laser" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#E6CB8F" stopOpacity="0" />
          <stop offset="20%" stopColor="#E6CB8F" stopOpacity="0.85" />
          <stop offset="80%" stopColor="#C9A65C" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#8C6B34" stopOpacity="0.2" />
        </linearGradient>
        <radialGradient id="laser-impact" cx="50%" cy="50%" r="50%">
          <stop offset="0%"  stopColor="#FFE3A8" stopOpacity="0.95" />
          <stop offset="40%" stopColor="#C9A65C" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#C9A65C" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="500" height="460" fill="#080808" />

      {/* Layer labels — outside the skin */}
      <text x="30" y="148" fill="#C9A65C" opacity={epiActive ? 1 : 0.4}
            fontFamily="DM Mono" fontSize="10" letterSpacing="1.5">
        SURFACE
      </text>
      <text x="30" y="250" fill="#C9A65C" opacity={dermActive ? 1 : 0.4}
            fontFamily="DM Mono" fontSize="10" letterSpacing="1.5">
        WHERE PIGMENT LIVES
      </text>

      {/* Epidermis */}
      <rect x="80" y={SURFACE_Y} width="400" height={EPIDERMIS_BOTTOM - SURFACE_Y} fill="url(#epi)"
            opacity={epiActive ? 1 : 0.85} />

      {/* Dermis */}
      <rect x="80" y={EPIDERMIS_BOTTOM} width="400" height={DERMIS_BOTTOM - EPIDERMIS_BOTTOM} fill="url(#derm)"
            opacity={dermActive ? 1 : 0.85} />

      {/* Fat / hypodermis */}
      <rect x="80" y={DERMIS_BOTTOM} width="400" height={FAT_BOTTOM - DERMIS_BOTTOM} fill="url(#fat)" />

      {/* Gentle texture on dermis */}
      <g opacity="0.15">
        {Array.from({ length: 30 }).map((_, i) => {
          const x = 90 + (i * 23) % 380;
          const y = EPIDERMIS_BOTTOM + 6 + ((i * 17) % 120);
          return <circle key={i} cx={x} cy={y} r={0.6} fill="#FFE3A8" />;
        })}
      </g>

      {/* Highlight ring on active layer */}
      {epiActive && (
        <rect x="80" y={SURFACE_Y} width="400" height={EPIDERMIS_BOTTOM - SURFACE_Y}
              fill="none" stroke="#E6CB8F" strokeWidth="1.5" strokeOpacity="0.7" />
      )}
      {dermActive && (
        <rect x="80" y={EPIDERMIS_BOTTOM} width="400" height={DERMIS_BOTTOM - EPIDERMIS_BOTTOM}
              fill="none" stroke="#E6CB8F" strokeWidth="1.5" strokeOpacity="0.7" />
      )}

      {/* Cream blob sitting on the surface */}
      {showCream && (
        <g>
          {/* Big cream pool */}
          <ellipse cx="250" cy={SURFACE_Y} rx="120" ry="14" fill="#FAF6F1" opacity="0.92" />
          <ellipse cx="250" cy={SURFACE_Y - 4} rx="115" ry="11" fill="#FFFFFF" opacity="0.6" />
          {/* Cream label arrow */}
          <line x1="380" y1={SURFACE_Y - 35} x2="320" y2={SURFACE_Y - 5}
                stroke="#FAF6F1" strokeOpacity="0.7" strokeWidth="0.8" />
          <text x="385" y={SURFACE_Y - 33} fill="#FAF6F1" opacity="0.85"
                fontFamily="DM Mono" fontSize="11" letterSpacing="1.2">
            CREAM
          </text>
          {/* "Stops here" marker */}
          <line x1="80" y1={EPIDERMIS_BOTTOM} x2="480" y2={EPIDERMIS_BOTTOM}
                stroke="#FFE3A8" strokeWidth="0.8" strokeDasharray="3 3" strokeOpacity="0.7" />
          <text x="85" y={EPIDERMIS_BOTTOM - 6} fill="#FFE3A8" opacity="0.9"
                fontFamily="DM Mono" fontSize="9.5" letterSpacing="1.4">
            ← CREAM STOPS HERE
          </text>
        </g>
      )}

      {/* Laser beam reaching deep */}
      {showLaser && (
        <g>
          {/* Beam shaft */}
          <rect x="240" y="40" width="20" height={EPIDERMIS_BOTTOM + 60 - 40} fill="url(#laser)" opacity="0.85" />
          {/* Glow on impact */}
          <circle cx="250" cy={EPIDERMIS_BOTTOM + 60} r="55" fill="url(#laser-impact)" />
          <circle cx="250" cy={EPIDERMIS_BOTTOM + 60} r="14" fill="#FFE3A8" opacity="0.95" />
          {/* Top label */}
          <text x="250" y="32" fill="#E6CB8F" textAnchor="middle"
                fontFamily="DM Mono" fontSize="11" letterSpacing="1.6" opacity="0.9">
            ← LASER
          </text>
        </g>
      )}

      {/* Pigment particles in dermis */}
      {pigmentState === "intact" && (
        <g>
          {basePigment.map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill="#1A0F08" opacity="0.92" />
          ))}
        </g>
      )}

      {pigmentState === "fragmented" && (
        <g>
          {/* Smaller fragmented dots scattered from where the originals were */}
          {basePigment.flatMap(([x, y], i) =>
            [
              [x - 5, y - 4, 2.5], [x + 4, y - 6, 2], [x - 2, y + 5, 2.5],
              [x + 6, y + 3, 1.8], [x - 8, y + 2, 2.2],
            ].map(([cx, cy, cr], j) => (
              <circle key={`${i}-${j}`} cx={cx} cy={cy} r={cr} fill="#1A0F08" opacity="0.7" />
            ))
          )}
        </g>
      )}

      {pigmentState === "clearing" && (
        <g>
          {/* Very faint, drifting upward as if being cleared */}
          {basePigment.flatMap(([x, y], i) =>
            [[x - 3, y - 12, 1.5], [x + 2, y - 18, 1.2], [x, y - 6, 2]].map(([cx, cy, cr], j) => (
              <circle key={`${i}-${j}`} cx={cx} cy={cy} r={cr} fill="#1A0F08" opacity={0.25 - j * 0.05} />
            ))
          )}
          {/* Arrows pointing up */}
          {[160, 250, 340].map((x, i) => (
            <g key={i} opacity="0.7">
              <line x1={x} y1={EPIDERMIS_BOTTOM + 30} x2={x} y2={EPIDERMIS_BOTTOM + 5}
                    stroke="#E6CB8F" strokeWidth="1" />
              <polygon points={`${x-4},${EPIDERMIS_BOTTOM + 10} ${x+4},${EPIDERMIS_BOTTOM + 10} ${x},${EPIDERMIS_BOTTOM + 2}`}
                       fill="#E6CB8F" />
            </g>
          ))}
        </g>
      )}

      {pigmentState === "cleared" && (
        <g>
          {/* Just a couple of faint residuals — honest */}
          <circle cx="200" cy="240" r="1.5" fill="#1A0F08" opacity="0.18" />
          <circle cx="320" cy="245" r="1.2" fill="#1A0F08" opacity="0.15" />
          {/* Subtle glow on the surface — even tone */}
          <rect x="80" y={SURFACE_Y} width="400" height="20" fill="#FFE3A8" opacity="0.12" />
        </g>
      )}
    </svg>
  );
}

/* ====== Public exports ====== */

export function StepCreamStops() {
  return <SkinLayers showCream highlightLayer="epidermis" pigmentState="intact" />;
}

export function StepLaserReaches() {
  return <SkinLayers showLaser highlightLayer="dermis" pigmentState="fragmented" />;
}

export function StepBodyClears() {
  return <SkinLayers pigmentState="clearing" />;
}

export function StepResult() {
  return <SkinLayers pigmentState="cleared" />;
}

/* Legacy named exports kept for backwards compat — alias to clearest equivalent */
export const SkinCrossSection = StepCreamStops;
export const Microchannels    = StepLaserReaches;
export const LaserPulse       = StepLaserReaches;
export const Exosomes         = StepBodyClears;
export const ClearSkin        = StepResult;
