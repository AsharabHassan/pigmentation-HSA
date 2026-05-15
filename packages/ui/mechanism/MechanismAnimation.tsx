"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarCheck } from "lucide-react";
import { Container } from "../primitives/Container";
import { SkinJourney } from "./SkinJourney";

export interface MechanismStep {
  numeral: string;
  title: string;
  caption: string;
  pillLabel: string;
}

interface Props {
  sectionId?: string;
  sectionKicker?: string;
  headlineMain?: string;
  headlineAccent?: string;
  intro?: string;
  steps?: MechanismStep[];
}

const DEFAULT_STEPS: MechanismStep[] = [
  {
    numeral: "01",
    title: "Why creams aren't working.",
    caption:
      "Your pigmentation lives about 2mm under your skin. Creams only reach the top 0.2mm — that's why even prescription strength plateaus.",
    pillLabel: "The cream layer",
  },
  {
    numeral: "02",
    title: "The laser reaches deeper.",
    caption:
      "A precision pulse of light passes harmlessly through the surface and shatters the deep pigment in 750 picoseconds — without raising tissue temperature.",
    pillLabel: "The treatment",
  },
  {
    numeral: "03",
    title: "Your body clears it.",
    caption:
      "Over the next few weeks your lymphatic system removes the broken pigment. Four to six sessions, three weeks apart, and the tone holds.",
    pillLabel: "The result",
  },
];

export function MechanismAnimation({
  sectionId = "how-it-works",
  sectionKicker = "How it works",
  headlineMain = "Watch what happens",
  headlineAccent = "2 mm under your skin.",
  intro = "One section of skin. Three states. Tap a stage to see what each step actually does.",
  steps = DEFAULT_STEPS,
}: Props = {}) {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || !autoPlay) return;
    const t = setTimeout(() => {
      setStep(prev => ((prev + 1) % 3) as 0 | 1 | 2);
    }, 5000);
    return () => clearTimeout(t);
  }, [step, inView, autoPlay]);

  const handleSelect = (s: 0 | 1 | 2) => {
    setAutoPlay(false);
    setStep(s);
  };

  return (
    <section
      id={sectionId}
      ref={sectionRef}
      className="bg-surface-50 py-20 md:py-28"
    >
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

        <div className="bg-surface-100 rounded-2xl md:rounded-3xl p-6 md:p-12 border border-surface-200 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-10 lg:gap-12 items-center">
            <div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <p className="font-display text-7xl md:text-8xl tabular-nums leading-none"
                     style={{ color: step === 1 ? "#A8853F" : step === 2 ? "#6B7A52" : "#B85A3C" }}>
                    {steps[step].numeral}
                  </p>
                  <h3 className="mt-5 font-display text-3xl md:text-4xl text-ink-900 leading-tight max-w-md">
                    {steps[step].title}
                  </h3>
                  <p className="mt-4 text-ink-700 leading-relaxed max-w-md text-base md:text-lg">
                    {steps[step].caption}
                  </p>
                </motion.div>
              </AnimatePresence>

              <div className="mt-8 flex flex-wrap gap-2">
                {steps.map((s, i) => {
                  const active = i === step;
                  const isLaser = i === 1;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelect(i as 0 | 1 | 2)}
                      className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full border transition-all ${
                        active
                          ? isLaser
                            ? "bg-aurum-500 border-aurum-500 text-ink-900"
                            : i === 2
                              ? "bg-moss-500 border-moss-500 text-surface-50"
                              : "bg-clay-500 border-clay-500 text-ink-900"
                          : "bg-surface-50 border-surface-200 text-ink-700 hover:border-ink-300"
                      }`}
                      aria-pressed={active}
                    >
                      <span className="font-mono tabular-nums text-[11px] font-semibold opacity-80">
                        {s.numeral}
                      </span>
                      <span className="text-[12px] uppercase tracking-[0.1em] font-semibold">
                        {s.pillLabel}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex items-center gap-3 text-xs text-ink-500">
                <div className="flex gap-1.5">
                  {[0, 1, 2].map(i => (
                    <span
                      key={i}
                      className={`h-1 rounded-full transition-all duration-500 ${
                        i === step ? "w-8 bg-clay-500" : "w-3 bg-surface-200"
                      }`}
                    />
                  ))}
                </div>
                {autoPlay && inView && (
                  <span className="text-ink-500/70 text-[11px] uppercase tracking-[0.12em]">
                    Auto-playing
                  </span>
                )}
                {!autoPlay && (
                  <button
                    type="button"
                    onClick={() => setAutoPlay(true)}
                    className="text-clay-600 hover:text-clay-700 text-[11px] uppercase tracking-[0.12em] font-semibold"
                  >
                    Auto-play ▸
                  </button>
                )}
              </div>
            </div>

            <div className="relative">
              <div
                aria-hidden
                className="absolute -inset-2 blur-2xl rounded-3xl pointer-events-none transition-opacity duration-700"
                style={{
                  background: "radial-gradient(circle, rgba(212,178,106,0.35) 0%, rgba(212,178,106,0) 70%)",
                  opacity: step === 1 ? 1 : 0,
                }}
              />
              <div className="relative bg-surface-50 rounded-xl overflow-hidden border border-surface-200">
                <SkinJourney step={step} />
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-ink-500">
                <span className="font-mono uppercase tracking-[0.12em]">Cross-section · facial skin</span>
                <span className="font-mono uppercase tracking-[0.12em] tabular-nums">
                  Stage {step + 1} / 3
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 md:mt-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-ink-700 text-sm md:text-base max-w-xl">
            Want a doctor to assess which stage your skin is at? Book ten focused minutes — the team will grade it and quote it.
          </p>
          <Link
            href={"#book" as never}
            className="inline-flex items-center gap-2 bg-clay-500 text-ink-900
                       px-5 py-3.5 rounded-full text-[12px] uppercase tracking-[0.12em] font-semibold
                       hover:bg-clay-600 transition-colors whitespace-nowrap"
          >
            <CalendarCheck size={15} aria-hidden />
            Free 10-min consultation →
          </Link>
        </div>
      </Container>
    </section>
  );
}
