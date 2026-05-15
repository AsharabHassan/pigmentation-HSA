"use client";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "../primitives/Container";

export interface TimelineStage {
  weekLabel: string;
  contextLine: string;
  sessionLine: string;
  imgSrc: string;
}

interface Props {
  stages: TimelineStage[];
  sectionId?: string;
  sectionKicker?: string;
  headlineMain?: string;
  headlineAccent?: string;
  intro?: string;
  /**
   * Per-stage progress values 0–1, same length as stages.
   * For pigmentation this is "remaining pigment density".
   * For chemical peel this is "tone uniformity" / "renewal stage".
   */
  metricValues?: number[];
  /** Whether higher values are better (peel: ascending renewal) or worse (pigmentation: descending). */
  metricDirection?: "descending" | "ascending";
  metricLabel?: string;
  outroNote?: string;
}

const DEFAULT_VALUES = [0.92, 0.74, 0.78, 0.52, 0.32, 0.16];

export function TimelineScrubber({
  stages,
  sectionId = "timeline",
  sectionKicker = "Your 12 weeks",
  headlineMain = "A real timeline,",
  headlineAccent = "checkpoint by checkpoint.",
  intro = "Six checkpoints from Day 0 to Week 12 — including the week-four phase where pigment may briefly darken before clearing.",
  metricValues = DEFAULT_VALUES,
  metricDirection = "descending",
  metricLabel = "Pigment density",
  outroNote = "Outcomes vary by skin type, depth, and SPF adherence. Your free consultation refines the plan to your case.",
}: Props) {
  return (
    <section id={sectionId} className="bg-surface-100 py-20 md:py-28">
      <Container width="wide">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-clay-500 font-semibold mb-3">
              {sectionKicker}
            </p>
            <h2 className="font-display text-4xl md:text-6xl text-ink-900 leading-[1.05] max-w-3xl">
              {headlineMain}<br />
              <span className="text-clay-600">{headlineAccent}</span>
            </h2>
          </div>
          <p className="text-base text-ink-700 max-w-sm">{intro}</p>
        </div>

        <div className="relative mt-12 md:mt-16">
          <span aria-hidden className="absolute left-3 md:left-1/2 top-0 bottom-0 w-px bg-surface-200" />

          <div className="flex flex-col gap-16 md:gap-24">
            {stages.map((s, i) => (
              <Checkpoint
                key={i}
                idx={i}
                stage={s}
                value={metricValues[i] ?? 0}
                prevValue={i === 0 ? (metricValues[0] ?? 0) : (metricValues[i - 1] ?? 0)}
                direction={metricDirection}
                metricLabel={metricLabel}
                total={stages.length}
                alignment={i % 2 === 0 ? "right" : "left"}
              />
            ))}
          </div>
        </div>

        <p className="mt-12 max-w-2xl text-sm text-ink-500 leading-relaxed">
          {outroNote}
        </p>
      </Container>
    </section>
  );
}

function Checkpoint({ idx, stage, value, prevValue, direction, metricLabel, total, alignment }: {
  idx: number;
  stage: TimelineStage;
  value: number;
  prevValue: number;
  direction: "descending" | "ascending";
  metricLabel: string;
  total: number;
  alignment: "left" | "right";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { threshold: 0.45 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const delta = idx === 0 ? "—" : direction === "descending"
    ? `${Math.round((prevValue - value) * 100)}% cleared`
    : `+${Math.round((value - prevValue) * 100)}% improvement`;
  const isRight = alignment === "right";
  const barColor = direction === "ascending" ? "bg-moss-500" : "bg-clay-500";

  return (
    <motion.div
      ref={ref}
      initial={reduced ? { opacity: 0 } : { opacity: 0, x: isRight ? 30 : -30 }}
      whileInView={reduced ? { opacity: 1 } : { opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      <span aria-hidden
        className={`absolute left-3 md:left-1/2 top-2 w-4 h-4 rounded-full border-2 transition-all duration-500 -translate-x-[7px] md:-translate-x-1/2 ${
          active ? "bg-clay-500 border-clay-500" : "bg-surface-50 border-surface-200"
        }`} />

      <p className={`absolute left-10 md:left-1/2 top-0 text-[11px] uppercase tracking-[0.14em] font-semibold tabular-nums transition-colors ${
        active ? "text-clay-600" : "text-ink-500"
      }`}
        style={{ transform: isRight ? "translateX(16px)" : "translateX(-16px) translateX(-100%)" }}>
        {stage.weekLabel} · {String(idx + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
      </p>

      <div className="pl-10 md:pl-0 mt-10 grid md:grid-cols-2 gap-8 md:gap-16">
        <div className={isRight ? "md:col-start-2" : "md:col-start-1"}>
          <h3 className="font-display text-2xl md:text-3xl text-ink-900 leading-tight max-w-md">
            {stage.contextLine}
          </h3>

          <div className="mt-6">
            <div className="flex items-baseline justify-between text-xs text-ink-500 mb-2">
              <span className="uppercase tracking-[0.14em] font-semibold">{metricLabel}</span>
              <span className="text-ink-900 font-semibold tabular-nums">{(value * 100).toFixed(0).padStart(2, "0")}%</span>
            </div>
            <div className="relative h-1.5 bg-surface-200 overflow-hidden rounded-full">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${value * 100}%` }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className={`h-full ${barColor}`}
              />
            </div>
            <p className="mt-2 text-xs text-ink-500 tabular-nums">
              {delta === "—" ? "Starting point" : `${delta} since previous`}
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-surface-200">
            <p className="text-[11px] uppercase tracking-[0.14em] text-ink-500 font-semibold">
              In session
            </p>
            <p className="mt-2 text-ink-900 text-base md:text-lg leading-snug">{stage.sessionLine}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
