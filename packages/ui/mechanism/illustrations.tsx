/**
 * Technical-illustration style — like Patek Philippe caliber drawings
 * or 1950s anatomy plates. Hairline gold strokes, dimension marks,
 * leader lines pointing to labels in mono type. No bezel frames.
 */

function Plate({ children, label, spec }: { children: React.ReactNode; label: string; spec: string }) {
  return (
    <figure className="relative w-full max-w-[520px]">
      {/* corner marks */}
      {["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"].map((pos, i) => (
        <span key={i} aria-hidden className={`absolute ${pos} w-4 h-4 z-10`}>
          <span className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-px bg-gold-500/50" />
          <span className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gold-500/50" />
        </span>
      ))}
      <svg viewBox="0 0 500 500" className="w-full" role="img" aria-label={label}>
        <rect width="500" height="500" fill="#080808" />
        {children}
      </svg>
      <figcaption className="mt-3 flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.28em] text-gold-500/55">
        <span>{label}</span>
        <span className="tabular-nums">{spec}</span>
      </figcaption>
    </figure>
  );
}

/* Common helpers */
const goldText = { fill: "#C9A65C", fontFamily: "DM Mono, ui-monospace, monospace" };

function LeaderLine({ x1, y1, x2, y2, label, anchor = "start", opacity = 0.65 }: {
  x1: number; y1: number; x2: number; y2: number; label: string; anchor?: "start" | "end" | "middle"; opacity?: number;
}) {
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#C9A65C" strokeOpacity={opacity} strokeWidth="0.6" />
      <circle cx={x1} cy={y1} r="1.5" fill="#C9A65C" opacity={opacity} />
      <text x={x2 + (anchor === "start" ? 5 : anchor === "end" ? -5 : 0)} y={y2 + 3}
            fontSize="8.5" letterSpacing="1.3" textAnchor={anchor} {...goldText}
            opacity={opacity + 0.05}>
        {label}
      </text>
    </g>
  );
}

function DimensionLine({ y, x1, x2, label }: { y: number; x1: number; x2: number; label: string }) {
  return (
    <g stroke="#C9A65C" strokeWidth="0.5" strokeOpacity="0.6" fill="none">
      <line x1={x1} y1={y} x2={x2} y2={y} />
      <line x1={x1} y1={y - 4} x2={x1} y2={y + 4} />
      <line x1={x2} y1={y - 4} x2={x2} y2={y + 4} />
      <text x={(x1 + x2) / 2} y={y - 8} fontSize="8.5" textAnchor="middle" letterSpacing="1.3" {...goldText}>
        {label}
      </text>
    </g>
  );
}

export function SkinCrossSection() {
  return (
    <Plate label="Fig. I — Dermal Topology" spec="Scale 1:1 / Glasgow">
      <g>
        {/* skin strata as flowing horizontal lines */}
        <path d="M 50 120 Q 250 90 450 120" fill="none" stroke="#C9A65C" strokeOpacity="0.35" strokeWidth="0.7" />
        <path d="M 50 165 Q 250 145 450 165" fill="none" stroke="#C9A65C" strokeOpacity="0.55" strokeWidth="0.7" />
        <path d="M 50 230 Q 250 215 450 230" fill="none" stroke="#C9A65C" strokeOpacity="0.85" strokeWidth="1.1" />
        <path d="M 50 305 Q 250 285 450 305" fill="none" stroke="#C9A65C" strokeOpacity="0.55" strokeWidth="0.7" />
        <path d="M 50 380 Q 250 365 450 380" fill="none" stroke="#C9A65C" strokeOpacity="0.35" strokeWidth="0.7" />

        {/* melanin cluster in dermal layer */}
        {[[160, 240, 4.5], [200, 232, 3.5], [240, 244, 6], [285, 228, 4], [325, 240, 4.5], [365, 234, 3]].map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill="#C9A65C" opacity="0.92" />
        ))}

        {/* Cream depth indicator on left */}
        <DimensionLine y={120} x1={20} x2={45} label="0" />
        <DimensionLine y={165} x1={20} x2={45} label="0.2mm" />
        <DimensionLine y={230} x1={20} x2={45} label="2.4mm" />

        {/* Leader callouts */}
        <LeaderLine x1={140} y1={132} x2={75} y2={100} label="EPIDERMIS" anchor="start" />
        <LeaderLine x1={310} y1={240} x2={400} y2={185} label="MELANIN STRATUM" anchor="end" />
        <LeaderLine x1={150} y1={310} x2={75} y2={345} label="HYPODERMIS" anchor="start" />

        {/* Cream penetration band — shows what topicals can reach */}
        <rect x="50" y="120" width="400" height="45" fill="#C9A65C" opacity="0.04" />
        <text x="450" y="148" fontSize="7.5" letterSpacing="1.5" textAnchor="end" {...goldText} opacity="0.45">
          ← TOPICAL CEILING
        </text>
      </g>
    </Plate>
  );
}

export function Microchannels() {
  return (
    <Plate label="Fig. II — VirtueRF Aperture" spec="9 × 250 μm">
      <g>
        {/* 9 needles descending */}
        {Array.from({ length: 9 }).map((_, i) => {
          const x = 140 + i * 28;
          return (
            <g key={i}>
              {/* needle shaft */}
              <line x1={x} y1={85} x2={x} y2={195} stroke="#C9A65C" strokeOpacity="0.85" strokeWidth="1.4" />
              {/* tip triangle */}
              <polygon points={`${x - 3.5},195 ${x + 3.5},195 ${x},210`} fill="#C9A65C" />
              {/* channel below skin */}
              <line x1={x} y1={215} x2={x} y2={310} stroke="#C9A65C" strokeOpacity="0.3" strokeWidth="0.6" strokeDasharray="2 2.5" />
            </g>
          );
        })}

        {/* surface line */}
        <line x1="110" y1="210" x2="395" y2="210" stroke="#C9A65C" strokeOpacity="0.65" strokeWidth="1" />

        {/* depth scale on left */}
        <DimensionLine y={210} x1={75} x2={105} label="0" />
        <DimensionLine y={310} x1={75} x2={105} label="2.4mm" />

        {/* Quantity callout */}
        <LeaderLine x1={140} y1={140} x2={70} y2={120} label="9 NEEDLES" anchor="start" />

        {/* Bottom spec rule */}
        <line x1="140" y1="380" x2="392" y2="380" stroke="#C9A65C" strokeOpacity="0.4" strokeWidth="0.5" />
        <line x1="140" y1="376" x2="140" y2="384" stroke="#C9A65C" strokeOpacity="0.4" strokeWidth="0.5" />
        <line x1="392" y1="376" x2="392" y2="384" stroke="#C9A65C" strokeOpacity="0.4" strokeWidth="0.5" />
        <text x="266" y="372" fontSize="8" letterSpacing="1.6" textAnchor="middle" {...goldText} opacity="0.6">
          252mm ARRAY · CALIBRATED PER FITZPATRICK
        </text>
      </g>
    </Plate>
  );
}

export function LaserPulse() {
  return (
    <Plate label="Fig. III — Pulsed Fragmentation" spec="750 ps / 532 nm">
      <g>
        {/* Concentric pulse rings */}
        {[140, 110, 80, 50].map((r, i) => (
          <circle key={i} cx="250" cy="250" r={r} fill="none"
                  stroke="#C9A65C" strokeOpacity={0.12 + i * 0.12} strokeWidth="0.9" />
        ))}
        {/* Center */}
        <circle cx="250" cy="250" r="20" fill="#E6CB8F" />

        {/* fragmented pigment particles flying outward */}
        {[
          [140, 180, 1.6], [340, 175, 1.4], [120, 320, 1.8], [375, 315, 1.3],
          [240, 110, 1.5], [255, 380, 1.6], [180, 145, 1.2], [320, 365, 1.4],
          [325, 155, 1.7], [175, 365, 1.3], [100, 250, 1.5], [395, 250, 1.6],
          [200, 95, 1], [310, 405, 1.1], [85, 200, 1.3], [415, 290, 1.2],
        ].map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill="#C9A65C" opacity={0.6 + (i % 3) * 0.13} />
        ))}

        {/* Trajectory hairlines from center */}
        {[[140, 180], [340, 175], [120, 320], [375, 315]].map(([x2, y2], i) => (
          <line key={i} x1="250" y1="250" x2={x2} y2={y2}
                stroke="#C9A65C" strokeOpacity="0.18" strokeWidth="0.4" strokeDasharray="1.5 2.5" />
        ))}

        {/* Spec readout — top-left */}
        <text x="50" y="60" fontSize="9" letterSpacing="1.5" {...goldText} opacity="0.65">
          PULSE WIDTH
        </text>
        <text x="50" y="78" fontSize="14" {...goldText} opacity="0.95">
          750 ps
        </text>

        {/* Spec readout — top-right */}
        <text x="450" y="60" fontSize="9" letterSpacing="1.5" textAnchor="end" {...goldText} opacity="0.65">
          WAVELENGTH
        </text>
        <text x="450" y="78" fontSize="14" textAnchor="end" {...goldText} opacity="0.95">
          532 nm
        </text>

        {/* Bottom annotation */}
        <line x1="100" y1="430" x2="400" y2="430" stroke="#C9A65C" strokeOpacity="0.35" strokeWidth="0.5" />
        <text x="250" y="450" fontSize="8" letterSpacing="1.6" textAnchor="middle" {...goldText} opacity="0.55">
          PHOTO-MECHANICAL FRAGMENTATION · NO THERMAL DAMAGE
        </text>
      </g>
    </Plate>
  );
}

export function Exosomes() {
  return (
    <Plate label="Fig. IV — Exosome Infusion" spec="3 actives · pH 5.5">
      <g>
        {/* Microchannels (faint vertical) */}
        {Array.from({ length: 13 }).map((_, i) => {
          const x = 130 + i * 20;
          return (
            <line key={i} x1={x} y1={100} x2={x} y2={400}
                  stroke="#C9A65C" strokeOpacity="0.12" strokeWidth="0.5" />
          );
        })}

        {/* Exosome microspheres descending in flow pattern */}
        {Array.from({ length: 50 }).map((_, i) => {
          const col = i % 13;
          const row = Math.floor(i / 5);
          const x = 130 + col * 20 + ((i * 7) % 10) - 5;
          const y = 110 + row * 26 + ((i * 11) % 14) - 7;
          const r = 1.5 + (i % 4) * 0.6;
          return (
            <circle key={i} cx={x} cy={y} r={r} fill="#C9A65C"
                    opacity={0.35 + ((i * 17) % 8) / 20} />
          );
        })}

        {/* Three labelled compounds */}
        <LeaderLine x1={170} y1={150} x2={70} y2={120} label="GROWTH FACTORS" anchor="start" opacity={0.65} />
        <LeaderLine x1={260} y1={250} x2={75} y2={290} label="VIT-C" anchor="start" opacity={0.65} />
        <LeaderLine x1={340} y1={330} x2={450} y2={370} label="TRANEXAMIC" anchor="end" opacity={0.65} />

        {/* Flow direction arrow */}
        <line x1="60" y1="100" x2="60" y2="400" stroke="#C9A65C" strokeOpacity="0.6" strokeWidth="0.6" />
        <polygon points="56,395 64,395 60,405" fill="#C9A65C" opacity="0.6" />
        <text x="40" y="250" fontSize="8" letterSpacing="1.5" {...goldText} opacity="0.55"
              transform="rotate(-90 40 250)">
          FLOW
        </text>
      </g>
    </Plate>
  );
}

export function ClearSkin() {
  return (
    <Plate label="Fig. V — Result Composition" spec="Wk 12 · ~94% clearance">
      <g>
        <defs>
          <radialGradient id="result-radial" cx="50%" cy="45%" r="55%">
            <stop offset="0%"  stopColor="#E6CB8F" stopOpacity="0.32" />
            <stop offset="55%" stopColor="#C9A65C" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Glowing center */}
        <circle cx="250" cy="240" r="160" fill="url(#result-radial)" />

        {/* Faint residuals — honesty signal */}
        <circle cx="200" cy="260" r="1.6" fill="#C9A65C" opacity="0.35" />
        <circle cx="300" cy="268" r="1.4" fill="#C9A65C" opacity="0.3" />
        <circle cx="240" cy="220" r="1" fill="#C9A65C" opacity="0.2" />

        {/* Horizon rule */}
        <line x1="100" y1="270" x2="400" y2="270" stroke="#C9A65C" strokeOpacity="0.45" strokeWidth="0.7" />

        {/* Clearance percentage as the centerpiece */}
        <text x="250" y="180" fontSize="60" textAnchor="middle"
              fill="#E6CB8F" fontFamily="Cormorant Garamond, Georgia, serif"
              fontStyle="italic" opacity="0.92">
          ~94%
        </text>
        <text x="250" y="200" fontSize="8.5" letterSpacing="2" textAnchor="middle" {...goldText} opacity="0.55">
          CLEARANCE
        </text>

        {/* Outcome metrics row */}
        <line x1="60" y1="385" x2="440" y2="385" stroke="#C9A65C" strokeOpacity="0.25" strokeWidth="0.5" />

        <text x="100" y="410" fontSize="9" textAnchor="middle" {...goldText} opacity="0.55" letterSpacing="1.5">SESSIONS</text>
        <text x="100" y="430" fontSize="20" textAnchor="middle" fill="#E6CB8F" fontFamily="Cormorant Garamond" fontStyle="italic">4–6</text>

        <text x="250" y="410" fontSize="9" textAnchor="middle" {...goldText} opacity="0.55" letterSpacing="1.5">DURATION</text>
        <text x="250" y="430" fontSize="20" textAnchor="middle" fill="#E6CB8F" fontFamily="Cormorant Garamond" fontStyle="italic">12 WK</text>

        <text x="400" y="410" fontSize="9" textAnchor="middle" {...goldText} opacity="0.55" letterSpacing="1.5">REBOUND</text>
        <text x="400" y="430" fontSize="20" textAnchor="middle" fill="#E6CB8F" fontFamily="Cormorant Garamond" fontStyle="italic">&lt; 6%</text>
      </g>
    </Plate>
  );
}
