"use client";
import { useEffect, useRef } from "react";
import { Section } from "../primitives/Section";
import { Container } from "../primitives/Container";
import { Eyebrow } from "../primitives/Eyebrow";
import { beats } from "./beats";
import { SkinCrossSection, Microchannels, LaserPulse, Exosomes, ClearSkin } from "./illustrations";

const IllusMap = {
  "skin-cross-section": SkinCrossSection,
  "microchannels": Microchannels,
  "laser-pulse": LaserPulse,
  "exosomes": Exosomes,
  "clear-skin": ClearSkin,
};

export function MechanismAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cleanup: (() => void) | undefined;

    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const root = containerRef.current;
      if (!root) return;
      const panels = root.querySelectorAll<HTMLDivElement>("[data-beat]");
      const illos = root.querySelectorAll<HTMLDivElement>("[data-illus]");
      const counter = root.querySelector<HTMLSpanElement>("[data-counter]");

      const activate = (idx: number) => {
        illos.forEach((el, j) => {
          gsap.to(el, { autoAlpha: j === idx ? 1 : 0, duration: 0.6, ease: "power2.out" });
        });
        if (counter) counter.textContent = beats[idx].numeral;
      };

      const triggers = Array.from(panels).map((p, i) =>
        ScrollTrigger.create({
          trigger: p,
          start: "top 65%",
          end: "bottom 35%",
          onEnter:     () => activate(i),
          onEnterBack: () => activate(i),
        })
      );
      activate(0);

      cleanup = () => triggers.forEach(t => t.kill());
    })();

    return () => cleanup?.();
  }, []);

  return (
    <Section id="how-it-works" className="bg-surface-black relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0
                                   bg-[radial-gradient(ellipse_at_70%_30%,rgba(201,166,92,0.06),transparent_50%)]" />

      <Container width="wide" className="relative">
        <div className="flex items-baseline justify-between flex-wrap gap-4 mb-4">
          <Eyebrow>Le Mécanisme</Eyebrow>
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-gold-500/55">
            Five movements · One protocol
          </span>
        </div>
        <h2 className="font-display text-[clamp(2.25rem,4vw,3.5rem)] leading-[1.02] text-ivory-50 max-w-3xl">
          Pigmentation doesn&apos;t live <em className="text-gold-400">on</em> your skin.
          <br />It lives <em className="text-gold-400">in</em> it.
        </h2>

        <div ref={containerRef} className="mt-20 md:grid md:grid-cols-[45%_55%] md:gap-16 md:items-start">
          <ol className="relative">
            <div aria-hidden className="absolute left-3 top-0 bottom-0 w-px bg-gold-500/15" />
            {beats.map((b, i) => (
              <li key={i} data-beat
                  className="relative pl-12 min-h-[78vh] flex flex-col justify-center md:py-24">
                <span aria-hidden className="absolute left-0 top-[calc(50%-1.25rem)] flex items-center justify-center w-7 h-10
                                              bg-surface-black border border-gold-500/40 font-display italic
                                              text-gold-400 text-lg leading-none">
                  {b.numeral}
                </span>
                <h3 className="font-display text-[clamp(1.75rem,2.6vw,2.5rem)] leading-tight text-ivory-50 italic max-w-md">
                  {b.title}
                </h3>
                <p className="mt-5 text-ivory-50/65 leading-relaxed max-w-md">{b.caption}</p>
                <div className="mt-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-gold-500/55">
                  <span className="w-8 h-px bg-gold-500/40" />
                  <span>Movement {b.numeral} of V</span>
                </div>
              </li>
            ))}
          </ol>

          <div className="hidden md:block md:sticky md:top-24 md:h-[80vh]">
            <div className="relative w-full h-full flex items-center justify-center">
              <span data-counter aria-hidden
                    className="absolute -top-2 right-0 font-display italic text-gold-400/70 text-2xl">
                I
              </span>
              <div className="relative w-full max-w-md">
                {beats.map((b, i) => {
                  const Illus = IllusMap[b.illustration];
                  return (
                    <div key={i} data-illus
                         style={{ opacity: i === 0 ? 1 : 0 }}
                         className="absolute inset-0 flex items-center justify-center">
                      <Illus />
                    </div>
                  );
                })}
                <div className="invisible">
                  <SkinCrossSection />
                </div>
              </div>
            </div>
          </div>

          <div className="md:hidden">
            {beats.map((b, i) => {
              const Illus = IllusMap[b.illustration];
              return (
                <div key={i} className="my-16 flex flex-col items-center">
                  <Illus />
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </Section>
  );
}
