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
    <section id="how-it-works" className="relative bg-surface-black overflow-hidden border-t border-gold-500/15">
      <Container width="wide" className="relative pt-20 md:pt-28 pb-20 md:pb-28">
        <div className="flex items-baseline justify-between gap-4 mb-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold-500/70">
            Ch. III · How it works
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold-500/35 tabular-nums">
            3 steps · plain English
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
          What we do,<br />
          <span className="text-gold-400">in three steps.</span>
        </motion.h2>

        <p className="mt-6 text-base md:text-lg text-ivory-50/65 max-w-2xl leading-relaxed">
          Most people don&apos;t need the science. Here&apos;s the plain version.
        </p>

        <div className="mt-16 md:mt-20 flex flex-col gap-24 md:gap-32">
          {beats.map((b, i) => {
            const Illus = IllusMap[b.illustration];
            return <Step key={i} beat={b} Illus={Illus} reverse={i % 2 === 1} />;
          })}
        </div>
      </Container>
    </section>
  );
}

function Step({
  beat, Illus, reverse,
}: {
  beat: typeof beats[number];
  Illus: () => React.ReactElement;
  reverse: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className={`grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center ${reverse ? "md:[direction:rtl]" : ""}`}
    >
      <div className="md:[direction:ltr]">
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold-500/55">
          Step {beat.numeral} of 03
        </p>
        <p className="mt-3 font-display italic text-gold-400 text-[clamp(4rem,18vw,10rem)] leading-[0.85] tabular-nums">
          {beat.numeral}
        </p>
        <h3 className="mt-4 font-display italic text-[clamp(1.75rem,6vw,3rem)] leading-[1.02] text-ivory-50 max-w-md">
          {beat.title}
        </h3>
        <p className="mt-5 text-ivory-50/70 leading-relaxed max-w-md text-base md:text-lg">
          {beat.caption}
        </p>
      </div>

      <div className="md:[direction:ltr] relative">
        <div aria-hidden className="absolute -inset-4 bg-gradient-to-br from-gold-500/12 to-transparent blur-2xl pointer-events-none" />
        <div className="relative flex justify-center md:justify-end">
          <Illus />
        </div>
      </div>
    </motion.div>
  );
}
