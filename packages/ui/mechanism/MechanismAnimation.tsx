"use client";
import { motion } from "framer-motion";
import { Container } from "../primitives/Container";
import { beats } from "./beats";
import { StepCreamStops, StepLaserReaches, StepBodyClears } from "./illustrations";

const IllusMap = {
  "cream-stops":   StepCreamStops,
  "laser-reaches": StepLaserReaches,
  "body-clears":   StepBodyClears,
};

export function MechanismAnimation() {
  return (
    <section id="how-it-works" className="bg-surface-50 py-20 md:py-28">
      <Container width="wide">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-clay-500 font-semibold mb-3">
              How it works
            </p>
            <h2 className="font-display text-4xl md:text-6xl text-ink-900 leading-[1.05] max-w-3xl">
              Three steps. <span className="text-clay-600">Plain English.</span>
            </h2>
          </div>
          <p className="text-base text-ink-700 max-w-sm">
            Most people don&apos;t need the science. Here&apos;s what we actually do.
          </p>
        </div>

        <div className="flex flex-col gap-16 md:gap-24">
          {beats.map((b, i) => {
            const Illus = IllusMap[b.illustration];
            return <Step key={i} beat={b} Illus={Illus} reverse={i % 2 === 1} />;
          })}
        </div>
      </Container>
    </section>
  );
}

function Step({ beat, Illus, reverse }: {
  beat: typeof beats[number];
  Illus: () => React.ReactElement;
  reverse: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center ${reverse ? "md:[direction:rtl]" : ""}`}
    >
      <div className="md:[direction:ltr]">
        <p className="text-[11px] uppercase tracking-[0.18em] text-clay-500 font-semibold tabular-nums">
          Step {beat.numeral}
        </p>
        <h3 className="mt-4 font-display text-3xl md:text-5xl text-ink-900 leading-[1.05] max-w-md">
          {beat.title}
        </h3>
        <p className="mt-5 text-ink-700 leading-relaxed max-w-md text-base md:text-lg">
          {beat.caption}
        </p>
      </div>

      <div className="md:[direction:ltr] relative">
        <div aria-hidden className="absolute -inset-3 bg-clay-100/40 rounded-3xl -rotate-1" />
        <div className="relative rounded-2xl overflow-hidden bg-surface-100 border border-surface-200 flex justify-center p-4">
          <Illus />
        </div>
      </div>
    </motion.div>
  );
}
