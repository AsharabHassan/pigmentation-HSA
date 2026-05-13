"use client";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "../primitives/Container";
import { BeforeAfterSlider } from "./BeforeAfterSlider";
import { DynamicHeadline } from "./DynamicHeadline";
import { Star, ArrowDown } from "lucide-react";

interface CtaProps { label: string; href: string; }

export interface HeroProps {
  eyebrow: string;
  subtext: string;
  primaryCta: CtaProps;
  secondaryCta: CtaProps;
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
  beforeLabel?: string;
  afterLabel?: string;
  rating: number;
  reviewCount: number;
  fallbackHeadline?: string;
}

/**
 * Field-journal hero — type-led, asymmetric.
 * - Massive serif headline dominates the upper register
 * - Image is a small inset "plate" in the bottom-right with hand-set caption strip
 * - Serial numbers and registration marks decorate the margins
 * - Hairline gold rules anchor the composition
 */
export function Hero(p: HeroProps) {
  const reduced = useReducedMotion();

  return (
    <section id="hero" className="relative min-h-[100dvh] bg-surface-black overflow-hidden">
      {/* Atmospheric base — film grain only, no gold blob */}
      <Grain />

      {/* Registration marks at corners */}
      <RegistrationMarks />

      {/* The composition */}
      <Container width="wide" className="relative h-full min-h-[100dvh] flex flex-col">

        {/* Top spec bar */}
        <div className="pt-8 md:pt-10 flex items-baseline justify-between text-[10px] font-mono uppercase tracking-[0.32em] text-gold-500/60">
          <span>Harley Street Aesthetics</span>
          <span className="tabular-nums">№ 001 / Pigmentation</span>
        </div>

        {/* Main grid */}
        <div className="flex-1 grid grid-cols-12 gap-x-3 md:gap-x-6 pt-10 md:pt-16 pb-10 md:pb-16">

          {/* HEADLINE — spans most of grid, top */}
          <div className="col-span-12 lg:col-span-10 lg:col-start-1 self-start">
            <motion.div
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 40, filter: "blur(8px)" }}
              animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold-500">
                Vol. 01 · {p.eyebrow}
              </p>
              <DynamicHeadline
                fallback={p.fallbackHeadline}
                className="mt-6 md:mt-10 font-display italic
                           text-[clamp(3rem,15vw,11rem)]
                           leading-[0.86] tracking-[-0.02em] text-ivory-50"
              />
            </motion.div>
          </div>

          {/* SUBTEXT + CTAs — left column on desktop, full width on mobile */}
          <div className="col-span-12 lg:col-span-5 lg:col-start-1 mt-8 md:mt-12 lg:mt-10 self-end">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <span aria-hidden className="block w-12 h-px bg-gold-500" />
              <p className="mt-5 text-base md:text-lg text-ivory-50/70 leading-relaxed max-w-md">
                {p.subtext}
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  href={p.primaryCta.href as never}
                  className="group inline-flex items-center justify-between bg-gold-500 text-ink-900
                             px-6 py-4 min-w-[260px]
                             text-[11px] uppercase tracking-[0.24em] font-semibold
                             hover:bg-gold-400 transition-colors"
                >
                  <span>{p.primaryCta.label}</span>
                  <span className="font-mono text-[10px] opacity-60">→</span>
                </Link>
                <Link
                  href={p.secondaryCta.href as never}
                  className="inline-flex items-center justify-center border border-gold-500/40 text-ivory-50
                             px-6 py-4 text-[11px] uppercase tracking-[0.24em] font-semibold
                             hover:bg-gold-500 hover:text-ink-900 hover:border-gold-500 transition-colors"
                >
                  {p.secondaryCta.label}
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-px bg-gold-500/15 max-w-[520px] border border-gold-500/15">
                <Stat label="Rating" big={p.rating.toFixed(1)} sub={`${p.reviewCount} reviews`} accent />
                <Stat label="Skin" big="I–VI" sub="Fitzpatrick" />
                <Stat label="Body" big="GMC" sub="Registered" />
                <Stat label="Care" big="CQC" sub="Inspected" />
              </div>
            </motion.div>
          </div>

          {/* IMAGE PLATE — bottom-right corner */}
          <motion.figure
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 30, scale: 0.96 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.4, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="col-span-12 lg:col-span-5 lg:col-start-8 lg:row-start-2 mt-10 lg:mt-0 self-end relative"
          >
            <div aria-hidden className="absolute -inset-3 bg-gradient-to-br from-gold-500/15 to-transparent blur-2xl pointer-events-none" />

            {/* Plate header — caption row */}
            <div className="relative flex items-baseline justify-between mb-2 font-mono text-[10px] uppercase tracking-[0.28em] text-gold-500/70">
              <span>Plate · I</span>
              <span className="tabular-nums">{p.beforeLabel} → {p.afterLabel}</span>
            </div>

            <div className="relative ring-1 ring-gold-500/30 max-w-[480px] lg:max-w-none lg:w-full">
              <BeforeAfterSlider
                beforeSrc={p.beforeSrc} afterSrc={p.afterSrc}
                beforeAlt={p.beforeAlt} afterAlt={p.afterAlt}
                beforeLabel={p.beforeLabel} afterLabel={p.afterLabel}
              />
            </div>

            {/* Plate footer */}
            <figcaption className="relative mt-3 flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-gold-500/55">
              <span>Signature 3-Step Protocol</span>
              <span className="tabular-nums">04–06 sessions</span>
            </figcaption>
          </motion.figure>

        </div>

        {/* Bottom rule + scroll cue */}
        <div className="relative flex items-end justify-between pb-8 md:pb-10 gap-4">
          <span className="hidden md:block flex-1 h-px bg-gold-500/15 mr-8" />
          <motion.a
            href="#treatments"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.8 }}
            className="flex items-center gap-3 text-[10px] uppercase tracking-[0.32em] text-gold-500/60 hover:text-gold-400 transition-colors"
          >
            <span>Begin</span>
            <motion.span
              animate={reduced ? undefined : { y: [0, 4, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowDown size={12} />
            </motion.span>
          </motion.a>
        </div>
      </Container>
    </section>
  );
}

function Stat({
  label, big, sub, accent,
}: { label: string; big: string; sub: string; accent?: boolean }) {
  return (
    <div className={`p-4 ${accent ? "bg-gradient-to-b from-surface-charcoal to-surface-black" : "bg-surface-black"}`}>
      <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-gold-500/55">{label}</p>
      <p className={`mt-2 font-display italic leading-none text-2xl ${accent ? "text-gold-400" : "text-ivory-50"}`}>
        {big}
      </p>
      <p className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-ivory-50/45">{sub}</p>
    </div>
  );
}

function RegistrationMarks() {
  return (
    <>
      {/* Top-left and bottom-right registration crosses */}
      {[
        "top-6 left-6", "top-6 right-6",
        "bottom-6 left-6", "bottom-6 right-6",
      ].map((pos, i) => (
        <span key={i} aria-hidden className={`hidden md:block absolute ${pos} w-3 h-3 opacity-40`}>
          <span className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-px bg-gold-500" />
          <span className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gold-500" />
        </span>
      ))}
    </>
  );
}

function Grain() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 opacity-[0.07] mix-blend-overlay pointer-events-none"
      style={{
        backgroundImage:
          `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.79  0 0 0 0 0.65  0 0 0 0 0.36  0 0 0 0.7 0'/></filter><rect width='300' height='300' filter='url(%23n)'/></svg>")`,
        backgroundSize: "300px 300px",
      }}
    />
  );
}
