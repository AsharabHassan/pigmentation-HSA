"use client";
import { useState } from "react";
import { Section } from "../primitives/Section";
import { Container } from "../primitives/Container";
import { Eyebrow } from "../primitives/Eyebrow";

export interface TimelineStage {
  weekLabel: string;
  contextLine: string;
  sessionLine: string;
  imgSrc: string;
}

const ROMAN = ["I", "II", "III", "IV", "V", "VI"];

export function TimelineScrubber({ stages }: { stages: TimelineStage[] }) {
  const [idx, setIdx] = useState(0);
  const max = stages.length - 1;
  const cur = stages[idx];
  const densities = [0.92, 0.74, 0.78, 0.52, 0.32, 0.16];

  return (
    <Section id="timeline" className="bg-surface-charcoal relative overflow-hidden">
      <Container width="wide">
        <div className="flex items-baseline justify-between flex-wrap gap-4">
          <div>
            <Eyebrow>Le Calendrier</Eyebrow>
            <h2 className="mt-3 font-display text-[clamp(2.25rem,3.5vw,3rem)] leading-[1.05] text-ivory-50 italic">
              Your twelve weeks, charted.
            </h2>
          </div>
          <p className="text-sm text-ivory-50/55 max-w-sm font-mono leading-relaxed">
            Drag the dial. Each marker is a real protocol checkpoint — including the week-four phase where pigment may briefly darken before clearance.
          </p>
        </div>

        <div className="mt-16">
          <div className="relative">
            <div className="h-px bg-gold-500/30 w-full" />
            <div className="h-px bg-gold-500/12 w-full mt-1" />

            <div className="absolute inset-x-0 -top-2.5 grid"
                 style={{ gridTemplateColumns: `repeat(${stages.length}, 1fr)` }}>
              {stages.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIdx(i)}
                  className="group flex flex-col items-center"
                  aria-label={`Jump to ${s.weekLabel}`}
                  aria-current={i === idx}
                >
                  <span className={`h-5 w-px transition-colors ${
                    i === idx ? "bg-gold-400" : "bg-gold-500/40 group-hover:bg-gold-500/80"}`} />
                  <span className={`mt-3 font-mono text-[10px] uppercase tracking-[0.28em] transition-colors ${
                    i === idx ? "text-gold-400" : "text-gold-500/45 group-hover:text-gold-500/80"}`}>
                    {s.weekLabel}
                  </span>
                  <span className={`mt-1.5 font-display italic transition-all ${
                    i === idx ? "text-gold-400 text-base" : "text-gold-500/30 text-xs"}`}>
                    {ROMAN[i]}
                  </span>
                </button>
              ))}
            </div>

            <input
              type="range" min={0} max={max} value={idx}
              onChange={e => setIdx(Number(e.target.value))}
              aria-label="Timeline scrubber"
              className="absolute inset-x-0 top-0 -translate-y-1/2 w-full h-10 opacity-0 cursor-grab"
            />
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-[55%_45%] gap-12 items-start">
          <div className="relative aspect-[16/10] bg-surface-black ring-1 ring-gold-500/25 overflow-hidden">
            <DensityChart stages={stages} densities={densities} activeIdx={idx} />
          </div>

          <div className="relative bg-gradient-to-br from-surface-ash to-surface-black p-8 md:p-10
                          border border-gold-500/40 overflow-hidden">
            <span aria-hidden className="absolute top-0 left-0 w-6 h-px bg-gold-500/60" />
            <span aria-hidden className="absolute top-0 left-0 w-px h-6 bg-gold-500/60" />
            <span aria-hidden className="absolute top-0 right-0 w-6 h-px bg-gold-500/60" />
            <span aria-hidden className="absolute top-0 right-0 w-px h-6 bg-gold-500/60" />
            <span aria-hidden className="absolute bottom-0 left-0 w-6 h-px bg-gold-500/60" />
            <span aria-hidden className="absolute bottom-0 left-0 w-px h-6 bg-gold-500/60" />
            <span aria-hidden className="absolute bottom-0 right-0 w-6 h-px bg-gold-500/60" />
            <span aria-hidden className="absolute bottom-0 right-0 w-px h-6 bg-gold-500/60" />

            <div className="flex items-baseline justify-between gap-4">
              <span className="font-display italic text-gold-400 text-5xl leading-none">
                {ROMAN[idx]}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold-500/60">
                {cur.weekLabel}
              </span>
            </div>

            <p className="mt-8 font-display italic text-2xl leading-snug text-ivory-50">
              {cur.contextLine}
            </p>

            <div className="mt-8 pt-6 border-t border-gold-500/20">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-gold-500/60">
                This week
              </p>
              <p className="mt-2 text-ivory-50/85">{cur.sessionLine}</p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 font-mono text-[10px] uppercase tracking-[0.18em]">
              <div className="border-t border-gold-500/15 pt-2">
                <div className="text-gold-500/55">Density</div>
                <div className="text-ivory-50 mt-0.5">
                  {(densities[idx] * 100).toFixed(0).padStart(2, "0")}%
                </div>
              </div>
              <div className="border-t border-gold-500/15 pt-2">
                <div className="text-gold-500/55">Δ since Day 0</div>
                <div className="text-ivory-50 mt-0.5">
                  {idx === 0 ? "—" : `${((densities[0] - densities[idx]) * 100).toFixed(0)}%`}
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-10 max-w-2xl text-xs font-mono uppercase tracking-[0.22em] text-gold-500/45 leading-loose">
          Results vary by skin type, depth, and SPF adherence. Your consultation refines these expectations to your case.
        </p>
      </Container>
    </Section>
  );
}

function DensityChart({
  stages, densities, activeIdx,
}: { stages: TimelineStage[]; densities: number[]; activeIdx: number }) {
  const W = 800, H = 500, PAD_L = 60, PAD_R = 40, PAD_T = 40, PAD_B = 60;
  const innerW = W - PAD_L - PAD_R, innerH = H - PAD_T - PAD_B;
  const xFor = (i: number) => PAD_L + (i / (stages.length - 1)) * innerW;
  const yFor = (d: number) => PAD_T + (1 - d) * innerH;

  const path = densities.reduce((acc, d, i) => {
    const x = xFor(i), y = yFor(d);
    if (i === 0) return `M ${x} ${y}`;
    const px = xFor(i - 1), py = yFor(densities[i - 1]);
    const cx1 = px + (x - px) * 0.5, cx2 = x - (x - px) * 0.5;
    return `${acc} C ${cx1} ${py}, ${cx2} ${y}, ${x} ${y}`;
  }, "");

  const areaPath = `${path} L ${xFor(densities.length - 1)} ${PAD_T + innerH} L ${PAD_L} ${PAD_T + innerH} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" role="img" aria-label="Pigment density over twelve weeks">
      <defs>
        <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="#C9A65C" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#C9A65C" stopOpacity="0" />
        </linearGradient>
        <pattern id="chart-grid" width="80" height="50" patternUnits="userSpaceOnUse">
          <path d="M 80 0 L 0 0 0 50" fill="none" stroke="#C9A65C" strokeOpacity="0.06" strokeWidth="0.5" />
        </pattern>
      </defs>

      <rect width={W} height={H} fill="#000" />
      <rect x={PAD_L} y={PAD_T} width={innerW} height={innerH} fill="url(#chart-grid)" />

      {[0, 0.5, 1].map((d, i) => (
        <g key={i}>
          <line x1={PAD_L - 4} y1={yFor(d)} x2={W - PAD_R} y2={yFor(d)}
                stroke="#C9A65C" strokeOpacity={d === 0.5 ? 0.18 : 0.3} strokeWidth="0.5"
                strokeDasharray={d === 0.5 ? "3 3" : undefined} />
          <text x={PAD_L - 12} y={yFor(d) + 3} fill="#C9A65C" fillOpacity="0.55"
                fontFamily="DM Mono" fontSize="10" textAnchor="end">
            {(d * 100).toString().padStart(2, "0")}
          </text>
        </g>
      ))}
      <text x={PAD_L - 12} y={PAD_T - 14} fill="#C9A65C" fillOpacity="0.55"
            fontFamily="DM Mono" fontSize="9" textAnchor="end" letterSpacing="1.8">
        DENSITY %
      </text>

      {stages.map((s, i) => (
        <g key={i}>
          <line x1={xFor(i)} y1={PAD_T + innerH} x2={xFor(i)} y2={PAD_T + innerH + 4}
                stroke="#C9A65C" strokeOpacity="0.4" />
          <text x={xFor(i)} y={PAD_T + innerH + 22} fill="#C9A65C" fillOpacity="0.45"
                fontFamily="DM Mono" fontSize="10" textAnchor="middle" letterSpacing="1.5">
            {s.weekLabel}
          </text>
        </g>
      ))}

      <path d={areaPath} fill="url(#area)" />
      <path d={path} fill="none" stroke="#C9A65C" strokeOpacity="0.85" strokeWidth="1.5" />

      {densities.map((d, i) => (
        <g key={i}>
          <circle cx={xFor(i)} cy={yFor(d)} r={i === activeIdx ? 7 : 3.5}
                  fill={i === activeIdx ? "#E6CB8F" : "#C9A65C"} />
          {i === activeIdx && (
            <circle cx={xFor(i)} cy={yFor(d)} r="12"
                    fill="none" stroke="#E6CB8F" strokeOpacity="0.5" strokeWidth="1" />
          )}
        </g>
      ))}

      <line x1={xFor(activeIdx)} y1={PAD_T} x2={xFor(activeIdx)} y2={PAD_T + innerH}
            stroke="#E6CB8F" strokeOpacity="0.4" strokeWidth="0.5" strokeDasharray="3 4" />
    </svg>
  );
}
