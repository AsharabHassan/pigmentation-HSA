"use client";
import { useEffect, useRef, useState } from "react";
import { Section } from "../primitives/Section";
import { Container } from "../primitives/Container";

export interface TimelineStage {
  weekLabel: string;
  contextLine: string;
  sessionLine: string;
  imgSrc: string;
}

/**
 * Mobile-first timeline.
 * - Phone: horizontal snap carousel of session cards; swipe through weeks
 * - Tablet+: chart visible, card grid below the chart
 */
export function TimelineScrubber({ stages }: { stages: TimelineStage[] }) {
  const densities = [0.92, 0.74, 0.78, 0.52, 0.32, 0.16];
  const [active, setActive] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;
    const cards = root.querySelectorAll<HTMLElement>("[data-week-card]");
    const io = new IntersectionObserver((entries) => {
      const top = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (top) setActive(Number(top.target.getAttribute("data-idx") ?? 0));
    }, { root, threshold: [0.55, 0.8] });
    cards.forEach(c => io.observe(c));
    return () => io.disconnect();
  }, []);

  return (
    <Section id="timeline" className="bg-surface-charcoal relative overflow-hidden !py-16 md:!py-24">
      <Container width="wide">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-gold-500">Your 12 weeks</p>
        <h2 className="mt-3 font-display text-[clamp(2rem,7vw,2.75rem)] leading-[1.05] text-ivory-50 italic">
          A real protocol timeline.
        </h2>
        <p className="mt-3 text-ivory-50/65 max-w-lg">
          Swipe through your weeks. Each marker is a real protocol checkpoint — including the week-four phase where pigment may temporarily darken before clearance.
        </p>

        {/* Density chart — desktop only, mobile gets the card carousel which carries the info */}
        <div className="hidden md:block mt-10 relative aspect-[16/9] bg-surface-black ring-1 ring-gold-500/20 overflow-hidden">
          <DensityChart stages={stages} densities={densities} activeIdx={active} />
        </div>

        {/* Session card carousel */}
        <div
          ref={scrollerRef}
          className="mt-8 -mx-6 px-6 md:mx-0 md:px-0
                     flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-2"
        >
          {stages.map((s, i) => (
            <article
              key={i}
              data-week-card
              data-idx={i}
              className={`snap-start shrink-0 w-[82%] sm:w-[60%] md:w-[31%]
                          bg-surface-black border p-6 md:p-7 transition-colors
                          ${i === active ? "border-gold-500" : "border-gold-500/20"}`}
            >
              <div className="flex items-baseline justify-between">
                <span className={`font-mono text-[10px] uppercase tracking-[0.22em] ${
                  i === active ? "text-gold-400" : "text-gold-500/60"}`}>
                  {s.weekLabel}
                </span>
                <span className={`font-mono text-[10px] uppercase tracking-[0.22em] ${
                  i === active ? "text-gold-400" : "text-gold-500/30"}`}>
                  {String(i + 1).padStart(2, "0")} / 06
                </span>
              </div>

              {/* Density meter */}
              <div className="mt-4">
                <div className="h-1 bg-gold-500/15 overflow-hidden">
                  <div className="h-full bg-gold-500" style={{ width: `${densities[i] * 100}%` }} />
                </div>
                <div className="mt-1 flex items-baseline justify-between font-mono text-[10px] text-ivory-50/55 uppercase tracking-[0.18em]">
                  <span>Pigment density</span>
                  <span>{(densities[i] * 100).toFixed(0).padStart(2, "0")}%</span>
                </div>
              </div>

              <p className="mt-6 font-display italic text-xl leading-snug text-ivory-50">
                {s.contextLine}
              </p>

              <div className="mt-6 pt-5 border-t border-gold-500/15">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold-500/60">
                  This week
                </p>
                <p className="mt-1.5 text-ivory-50/85 text-sm">{s.sessionLine}</p>
              </div>
            </article>
          ))}
        </div>

        {/* Pagination dots */}
        <div className="mt-5 flex items-center justify-center gap-2.5">
          {stages.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                const card = scrollerRef.current?.querySelector<HTMLElement>(`[data-idx="${i}"]`);
                card?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
              }}
              aria-label={`Jump to ${stages[i].weekLabel}`}
              className={`h-1 transition-all ${i === active ? "w-6 bg-gold-400" : "w-1 bg-gold-500/30 hover:bg-gold-500/60"}`}
            />
          ))}
        </div>

        <p className="mt-10 max-w-2xl text-xs text-ivory-50/45 leading-loose">
          Results vary by skin type, depth, and SPF adherence. Your consultation refines these expectations to your case.
        </p>
      </Container>
    </Section>
  );
}

function DensityChart({
  stages, densities, activeIdx,
}: { stages: TimelineStage[]; densities: number[]; activeIdx: number }) {
  const W = 800, H = 360, PAD_L = 50, PAD_R = 30, PAD_T = 30, PAD_B = 40;
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
      </defs>
      <rect width={W} height={H} fill="#000" />
      {[0, 0.5, 1].map((d, i) => (
        <line key={i} x1={PAD_L} y1={yFor(d)} x2={W - PAD_R} y2={yFor(d)}
              stroke="#C9A65C" strokeOpacity="0.12" strokeWidth="0.5" />
      ))}
      <path d={areaPath} fill="url(#area)" />
      <path d={path} fill="none" stroke="#C9A65C" strokeOpacity="0.9" strokeWidth="2" />
      {densities.map((d, i) => (
        <g key={i}>
          <circle cx={xFor(i)} cy={yFor(d)} r={i === activeIdx ? 8 : 4}
                  fill={i === activeIdx ? "#E6CB8F" : "#C9A65C"} />
          {i === activeIdx && (
            <circle cx={xFor(i)} cy={yFor(d)} r="14"
                    fill="none" stroke="#E6CB8F" strokeOpacity="0.5" strokeWidth="1" />
          )}
          <text x={xFor(i)} y={PAD_T + innerH + 20} fill="#C9A65C" fillOpacity="0.6"
                fontFamily="DM Mono" fontSize="11" textAnchor="middle">
            {stages[i].weekLabel}
          </text>
        </g>
      ))}
    </svg>
  );
}
