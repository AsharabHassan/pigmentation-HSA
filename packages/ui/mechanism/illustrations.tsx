/**
 * Le Mécanisme — illustrations rendered as if exposing the protocol's
 * "movement": precise, framed apertures with gold-on-black line work.
 */

const goldRing = (id: string) => (
  <defs>
    <radialGradient id={id} cx="50%" cy="50%" r="50%">
      <stop offset="0%"  stopColor="#E6CB8F" stopOpacity="0" />
      <stop offset="60%" stopColor="#C9A65C" stopOpacity="0.06" />
      <stop offset="100%" stopColor="#C9A65C" stopOpacity="0.22" />
    </radialGradient>
  </defs>
);

function Frame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="relative w-full max-w-md">
      <svg viewBox="0 0 400 400" className="w-full" role="img" aria-label={label}>
        {goldRing("frame-ring")}
        <circle cx="200" cy="200" r="190" fill="#000" />
        <circle cx="200" cy="200" r="190" fill="url(#frame-ring)" />
        <circle cx="200" cy="200" r="188" fill="none" stroke="#C9A65C" strokeOpacity="0.45" strokeWidth="0.6" />
        <circle cx="200" cy="200" r="180" fill="none" stroke="#C9A65C" strokeOpacity="0.2" strokeWidth="0.4" />
        {Array.from({ length: 60 }).map((_, i) => {
          const a = (i / 60) * Math.PI * 2;
          const r1 = 178, r2 = i % 5 === 0 ? 170 : 174;
          const x1 = 200 + Math.cos(a) * r1, y1 = 200 + Math.sin(a) * r1;
          const x2 = 200 + Math.cos(a) * r2, y2 = 200 + Math.sin(a) * r2;
          return (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke="#C9A65C" strokeOpacity={i % 5 === 0 ? 0.65 : 0.25} strokeWidth="0.5" />
          );
        })}
        <circle cx="200" cy="200" r="155" fill="#080808" stroke="#C9A65C" strokeOpacity="0.5" strokeWidth="0.5" />
        {children}
      </svg>
      <div className="mt-4 flex items-baseline justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.28em] text-gold-500/55">
        <span>{label}</span>
        <span>HSA · GLA</span>
      </div>
    </div>
  );
}

export function SkinCrossSection() {
  return (
    <Frame label="I · Dermal Topology">
      <g>
        <path d="M 80 170 Q 200 130 320 170" fill="none" stroke="#C9A65C" strokeOpacity="0.4" strokeWidth="0.8" />
        <path d="M 80 200 Q 200 170 320 200" fill="none" stroke="#C9A65C" strokeOpacity="0.55" strokeWidth="0.8" />
        <path d="M 80 240 Q 200 220 320 240" fill="none" stroke="#C9A65C" strokeOpacity="0.7" strokeWidth="1" />
        <path d="M 80 285 Q 200 270 320 285" fill="none" stroke="#C9A65C" strokeOpacity="0.5" strokeWidth="0.8" />
        <text x="120" y="155" fill="#C9A65C" fontFamily="DM Mono" fontSize="6.5" letterSpacing="1.5" opacity="0.55">EPIDERMIS</text>
        <text x="120" y="215" fill="#C9A65C" fontFamily="DM Mono" fontSize="6.5" letterSpacing="1.5" opacity="0.75">DERMIS — MELANIN STRATUM</text>
        <text x="120" y="305" fill="#C9A65C" fontFamily="DM Mono" fontSize="6.5" letterSpacing="1.5" opacity="0.55">HYPODERMIS</text>
        {[[130, 240, 4], [165, 245, 3], [200, 238, 5], [240, 244, 4], [270, 240, 3]].map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill="#C9A65C" opacity="0.85" />
        ))}
        <line x1="335" y1="200" x2="335" y2="240" stroke="#C9A65C" strokeOpacity="0.5" strokeWidth="0.5" />
        <line x1="332" y1="200" x2="338" y2="200" stroke="#C9A65C" strokeOpacity="0.5" strokeWidth="0.5" />
        <line x1="332" y1="240" x2="338" y2="240" stroke="#C9A65C" strokeOpacity="0.5" strokeWidth="0.5" />
        <text x="342" y="222" fill="#C9A65C" fontFamily="DM Mono" fontSize="7" opacity="0.7">2.4mm</text>
      </g>
    </Frame>
  );
}

export function Microchannels() {
  return (
    <Frame label="II · VirtueRF Aperture">
      <g>
        {Array.from({ length: 9 }).map((_, i) => {
          const x = 130 + i * 17.5;
          return (
            <g key={i}>
              <line x1={x} y1={100} x2={x} y2={170} stroke="#C9A65C" strokeOpacity="0.85" strokeWidth="1.2" />
              <polygon points={`${x - 3},170 ${x + 3},170 ${x},182`} fill="#C9A65C" />
              <line x1={x} y1={185} x2={x} y2={255} stroke="#C9A65C" strokeOpacity="0.3" strokeWidth="0.6" strokeDasharray="2 2" />
            </g>
          );
        })}
        <line x1="100" y1="185" x2="300" y2="185" stroke="#C9A65C" strokeOpacity="0.6" strokeWidth="0.8" />
        <text x="80" y="188" fill="#C9A65C" fontFamily="DM Mono" fontSize="7" textAnchor="end" opacity="0.55">0</text>
        <text x="80" y="258" fill="#C9A65C" fontFamily="DM Mono" fontSize="7" textAnchor="end" opacity="0.55">2.4</text>
        <text x="200" y="295" fill="#C9A65C" fontFamily="DM Mono" fontSize="7" textAnchor="middle" letterSpacing="1.8" opacity="0.7">
          9 × CHANNELS — 250 μm Ø
        </text>
      </g>
    </Frame>
  );
}

export function LaserPulse() {
  return (
    <Frame label="III · Pulsed Fragmentation">
      <g>
        <circle cx="200" cy="200" r="90" fill="none" stroke="#C9A65C" strokeOpacity="0.15" strokeWidth="1" />
        <circle cx="200" cy="200" r="65" fill="none" stroke="#C9A65C" strokeOpacity="0.35" strokeWidth="1" />
        <circle cx="200" cy="200" r="40" fill="none" stroke="#C9A65C" strokeOpacity="0.7"  strokeWidth="1.2" />
        <circle cx="200" cy="200" r="14" fill="#E6CB8F" />
        <circle cx="200" cy="200" r="14" fill="none" stroke="#C9A65C" strokeOpacity="1"  strokeWidth="0.5" />
        {[
          [120, 160], [285, 165], [115, 250], [290, 245],
          [195, 105], [205, 295], [155, 130], [255, 280],
          [255, 130], [145, 280], [110, 200], [295, 200],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={1.6} fill="#C9A65C" opacity={0.6 + (i % 3) * 0.13} />
        ))}
        <text x="200" y="335" fill="#C9A65C" fontFamily="DM Mono" fontSize="7" textAnchor="middle" letterSpacing="2" opacity="0.7">
          750 ps · 532 NM
        </text>
      </g>
    </Frame>
  );
}

export function Exosomes() {
  return (
    <Frame label="IV · Exosome Infusion">
      <g>
        {Array.from({ length: 14 }).map((_, i) => {
          const x = 110 + i * 14;
          return (
            <line key={i} x1={x} y1={100} x2={x} y2={300}
                  stroke="#C9A65C" strokeOpacity="0.18" strokeWidth="0.5" />
          );
        })}
        {Array.from({ length: 36 }).map((_, i) => {
          const x = 110 + (i % 14) * 14 + ((i * 7) % 8) - 4;
          const y = 110 + Math.floor(i / 4) * 22 + ((i * 11) % 14) - 7;
          const r = 1.2 + (i % 3) * 0.7;
          return (
            <circle key={i} cx={x} cy={y} r={r} fill="#C9A65C"
                    opacity={0.35 + ((i * 17) % 7) / 20} />
          );
        })}
        <text x="200" y="335" fill="#C9A65C" fontFamily="DM Mono" fontSize="7" textAnchor="middle" letterSpacing="2" opacity="0.7">
          GROWTH FACTORS · VIT-C · TRANEXAMIC
        </text>
      </g>
    </Frame>
  );
}

export function ClearSkin() {
  return (
    <Frame label="V · Result">
      <g>
        <defs>
          <radialGradient id="result-glow" cx="50%" cy="45%" r="55%">
            <stop offset="0%"  stopColor="#E6CB8F" stopOpacity="0.32" />
            <stop offset="55%" stopColor="#C9A65C" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="200" cy="200" r="120" fill="url(#result-glow)" />
        {[[170, 210], [240, 215]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={1.2} fill="#C9A65C" opacity="0.35" />
        ))}
        <line x1="100" y1="232" x2="300" y2="232" stroke="#C9A65C" strokeOpacity="0.45" strokeWidth="0.6" />
        <text x="200" y="335" fill="#C9A65C" fontFamily="DM Mono" fontSize="7" textAnchor="middle" letterSpacing="2" opacity="0.7">
          ~94% CLEARANCE · WK 12
        </text>
      </g>
    </Frame>
  );
}
