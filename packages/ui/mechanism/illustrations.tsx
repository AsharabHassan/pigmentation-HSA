export function SkinCrossSection() {
  return (
    <svg viewBox="0 0 400 400" className="w-full max-w-md" role="img" aria-label="Skin cross-section">
      <defs>
        <linearGradient id="skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F2EBE2"/>
          <stop offset="1" stopColor="#C4B8B0"/>
        </linearGradient>
      </defs>
      <rect x="40" y="40" width="320" height="320" fill="url(#skin)" />
      <line x1="40" y1="120" x2="360" y2="120" stroke="#B8945A" strokeWidth="1" />
      <line x1="40" y1="220" x2="360" y2="220" stroke="#B8945A" strokeWidth="1" />
      {[
        [80, 80], [200, 95], [310, 110],
        [120, 150], [240, 165], [330, 180],
        [100, 260], [220, 280], [280, 250],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="6" fill="#2A1422" opacity="0.7" />
      ))}
      <text x="50" y="65" fill="#6B5F5B" fontSize="11">Epidermis</text>
      <text x="50" y="160" fill="#6B5F5B" fontSize="11">Dermis (where pigmentation lives)</text>
    </svg>
  );
}
export function Microchannels() {
  return (
    <svg viewBox="0 0 400 400" className="w-full max-w-md" role="img" aria-label="Microchannels">
      <rect x="40" y="40" width="320" height="320" fill="#F2EBE2" />
      {Array.from({ length: 12 }).map((_, i) => (
        <line key={i} x1={60 + i * 25} y1="40" x2={60 + i * 25} y2="200"
              stroke="#B8945A" strokeWidth="2" />
      ))}
    </svg>
  );
}
export function LaserPulse() {
  return (
    <svg viewBox="0 0 400 400" className="w-full max-w-md" role="img" aria-label="Laser pulse">
      <rect x="40" y="40" width="320" height="320" fill="#0E0B0A" />
      <circle cx="200" cy="200" r="80" fill="#B8945A" opacity="0.3" />
      <circle cx="200" cy="200" r="40" fill="#C9A874" />
      {[[120, 140], [280, 150], [110, 270], [290, 280], [200, 90], [200, 310]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="3" fill="#FAF6F1" />
      ))}
    </svg>
  );
}
export function Exosomes() {
  return (
    <svg viewBox="0 0 400 400" className="w-full max-w-md" role="img" aria-label="Exosome infusion">
      <rect x="40" y="40" width="320" height="320" fill="#F2EBE2" />
      {Array.from({ length: 30 }).map((_, i) => (
        <circle key={i}
          cx={60 + (i * 47) % 320} cy={60 + (i * 31) % 280}
          r={3 + (i % 3)} fill="#B8945A" opacity={0.4 + ((i * 7) % 4) / 10} />
      ))}
    </svg>
  );
}
export function ClearSkin() {
  return (
    <svg viewBox="0 0 400 400" className="w-full max-w-md" role="img" aria-label="Clear skin result">
      <defs>
        <radialGradient id="glow">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.6"/>
          <stop offset="1" stopColor="#FAF6F1" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <rect x="40" y="40" width="320" height="320" fill="#FAF6F1" />
      <rect x="40" y="40" width="320" height="320" fill="url(#glow)" />
    </svg>
  );
}
