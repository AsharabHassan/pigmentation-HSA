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

export function TimelineScrubber({ stages }: { stages: TimelineStage[] }) {
  const densities = [0.92, 0.74, 0.78, 0.52, 0.32, 0.16];

  return (
    <section id="timeline" className="relative bg-surface-charcoal overflow-hidden border-t border-gold-500/15">
      <Container width="wide" className="relative pt-20 md:pt-28 pb-20 md:pb-28">

        <div className="flex items-baseline justify-between gap-4 mb-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold-500/70">
            Ch. IV · The Timeline
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold-500/35 tabular-nums">
            12 weeks · 06 checkpoints
          </p>
        </div>
        <span aria-hidden className="block h-px bg-gold-500/15" />

        <motion.h2
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 font-display italic text-[clamp(2.5rem,11vw,7rem)] leading-[0.9] text-ivory-50 max-w-5xl"
        >
          A protocol,<br />
          <span className="text-gold-400">in twelve weeks.</span>
        </motion.h2>

        <div className="relative mt-16 md:mt-24">
          <span aria-hidden className="absolute left-3 md:left-1/2 top-0 bottom-0 w-px bg-gold-500/20" />

          <div className="flex flex-col gap-20 md:gap-32">
            {stages.map((s, i) => (
              <Checkpoint
                key={i}
                idx={i}
                stage={s}
                density={densities[i]}
                prevDensity={i === 0 ? densities[0] : densities[i - 1]}
                alignment={i % 2 === 0 ? "right" : "left"}
              />
            ))}
          </div>
        </div>

        <p className="mt-16 max-w-2xl text-xs text-ivory-50/45 leading-loose font-mono uppercase tracking-[0.18em]">
          Outcomes vary by skin type, depth, and SPF adherence. Your consultation refines the protocol to your case.
        </p>
      </Container>
    </section>
  );
}

function Checkpoint({
  idx, stage, density, prevDensity, alignment,
}: {
  idx: number; stage: TimelineStage; density: number; prevDensity: number;
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

  const change = idx === 0 ? "—" : `${Math.round((prevDensity - density) * 100)}%`;
  const isRight = alignment === "right";

  return (
    <motion.div
      ref={ref}
      initial={reduced ? { opacity: 0 } : { opacity: 0, x: isRight ? 40 : -40, filter: "blur(6px)" }}
      whileInView={reduced ? { opacity: 1 } : { opacity: 1, x: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      <span aria-hidden
        className={`absolute left-3 md:left-1/2 top-3 w-3 h-3 rounded-full border-2 transition-all duration-500 -translate-x-[5px] md:-translate-x-1/2 ${
          active ? "bg-gold-400 border-gold-400" : "bg-surface-charcoal border-gold-500/40"
        }`} />

      <p className={`absolute left-9 md:left-1/2 top-1 font-mono text-[10px] uppercase tracking-[0.28em] tabular-nums transition-colors ${
        active ? "text-gold-400" : "text-gold-500/55"
      }`}
        style={{ transform: isRight ? "translateX(12px)" : "translateX(-12px) translateX(-100%)" }}>
        {stage.weekLabel} · {String(idx + 1).padStart(2, "0")}/06
      </p>

      <div className="pl-9 md:pl-0 mt-10 md:mt-12 grid md:grid-cols-2 gap-8 md:gap-16">
        <div className={isRight ? "md:col-start-2" : "md:col-start-1"}>
          <h3 className="font-display italic text-[clamp(1.5rem,5vw,2.5rem)] leading-[1.05] text-ivory-50 max-w-md">
            {stage.contextLine}
          </h3>

          <div className="mt-7">
            <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-gold-500/60 mb-2">
              <span>Pigment density</span>
              <span className="text-ivory-50/70 tabular-nums">{(density * 100).toFixed(0).padStart(2, "0")}%</span>
            </div>
            <div className="relative h-1 bg-gold-500/10 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${density * 100}%` }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 1.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="h-full bg-gold-500"
              />
            </div>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-gold-500/50 tabular-nums">
              Δ {change} since previous
            </p>
          </div>

          <div className="mt-7 pt-5 border-t border-gold-500/15">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold-500/60">
              In session
            </p>
            <p className="mt-2 text-ivory-50/85 text-base md:text-lg leading-snug">{stage.sessionLine}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
