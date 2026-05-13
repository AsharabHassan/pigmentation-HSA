"use client";
import { motion, useReducedMotion } from "framer-motion";
import { Section } from "../primitives/Section";
import { Container } from "../primitives/Container";
import { Atmosphere } from "../cinema/Atmosphere";
import { FilmReveal } from "../cinema/FilmReveal";
import { beats } from "./beats";
import { SkinCrossSection, Microchannels, LaserPulse, Exosomes, ClearSkin } from "./illustrations";

const IllusMap = {
  "skin-cross-section": SkinCrossSection,
  "microchannels": Microchannels,
  "laser-pulse": LaserPulse,
  "exosomes": Exosomes,
  "clear-skin": ClearSkin,
};

/**
 * Cinematic mechanism — each "movement" is its own full-viewport chapter.
 * Vertical scroll progresses through I → V. Each chapter has atmosphere,
 * a large italic title, and the framed illustration centered with gold halo.
 */
export function MechanismAnimation() {
  return (
    <section id="how-it-works" className="relative bg-surface-black">
      {/* Intro chapter */}
      <div className="relative min-h-[80dvh] flex items-center overflow-hidden">
        <Atmosphere variant="spotlight-top" intensity={1.1} />
        <Container width="wide" className="relative">
          <FilmReveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-gold-500">
              <span className="inline-block w-6 h-px bg-gold-500 align-middle mr-3" />
              The Protocol
            </p>
          </FilmReveal>
          <FilmReveal delay={0.2}>
            <h2 className="mt-6 font-display italic text-[clamp(2.5rem,10vw,5.5rem)] leading-[0.95] text-ivory-50 max-w-4xl">
              Pigmentation doesn&apos;t live <span className="text-gold-400">on</span> your skin.
              <br />It lives <span className="text-gold-400">in</span> it.
            </h2>
          </FilmReveal>
          <FilmReveal delay={0.4}>
            <p className="mt-8 text-base md:text-lg text-ivory-50/65 max-w-xl leading-relaxed">
              Five movements. One protocol. Scroll through the mechanics — the same way Dr. Ahmad would walk you through them at consultation.
            </p>
          </FilmReveal>
        </Container>
      </div>

      {/* Five chapters */}
      {beats.map((b, i) => {
        const Illus = IllusMap[b.illustration];
        const isEven = i % 2 === 0;
        return <Chapter key={i} index={i} beat={b} Illus={Illus} isEven={isEven} />;
      })}
    </section>
  );
}

function Chapter({
  index, beat, Illus, isEven,
}: {
  index: number;
  beat: typeof beats[number];
  Illus: () => React.ReactElement;
  isEven: boolean;
}) {
  const reduced = useReducedMotion();
  return (
    <div className="relative min-h-[100dvh] flex items-center overflow-hidden border-t border-gold-500/10">
      <Atmosphere variant={index === 4 ? "halo" : "ambient"} intensity={0.8} />

      <Container width="wide" className="relative py-20 md:py-0">
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center ${isEven ? "" : "md:[direction:rtl]"}`}>
          {/* Copy column */}
          <div className="md:[direction:ltr]">
            <FilmReveal>
              <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold-500/60">
                Movement {beat.numeral} of V
              </span>
            </FilmReveal>
            <FilmReveal delay={0.15}>
              <p className="mt-5 font-display italic text-gold-400 text-[clamp(4rem,16vw,9rem)] leading-[0.85]">
                {beat.numeral}
              </p>
            </FilmReveal>
            <FilmReveal delay={0.3}>
              <h3 className="mt-6 font-display italic text-[clamp(1.75rem,5vw,2.75rem)] leading-tight text-ivory-50 max-w-md">
                {beat.title}
              </h3>
            </FilmReveal>
            <FilmReveal delay={0.45}>
              <p className="mt-6 text-ivory-50/65 leading-relaxed max-w-md text-base md:text-lg">
                {beat.caption}
              </p>
            </FilmReveal>
          </div>

          {/* Illustration column */}
          <div className="md:[direction:ltr] relative">
            <motion.div
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.92, filter: "blur(12px)" }}
              whileInView={reduced ? { opacity: 1 } : { opacity: 1, scale: 1, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex justify-center"
            >
              <div aria-hidden className="absolute inset-0 bg-gradient-radial from-gold-500/15 via-transparent to-transparent blur-3xl" />
              <Illus />
            </motion.div>
          </div>
        </div>
      </Container>
    </div>
  );
}
