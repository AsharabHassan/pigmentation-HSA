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

      const activate = (idx: number) => {
        illos.forEach((el, j) => {
          gsap.to(el, { autoAlpha: j === idx ? 1 : 0, duration: 0.6, ease: "power2.out" });
        });
      };

      const triggers = Array.from(panels).map((p, i) =>
        ScrollTrigger.create({
          trigger: p,
          start: "top 70%",
          end: "bottom 30%",
          onEnter:    () => activate(i),
          onEnterBack: () => activate(i),
        })
      );
      activate(0);

      cleanup = () => triggers.forEach(t => t.kill());
    })();

    return () => cleanup?.();
  }, []);

  return (
    <Section id="how-it-works" className="bg-ivory-50">
      <Container width="wide">
        <Eyebrow>How it works</Eyebrow>
        <h2 className="mt-3 font-display text-[clamp(2rem,3.5vw,3rem)] leading-tight text-ink-900 max-w-2xl">
          Pigmentation doesn&apos;t live on your skin. It lives in it.
        </h2>

        <div ref={containerRef} className="mt-16 md:grid md:grid-cols-[40%_60%] md:gap-12 md:items-start">
          <div>
            {beats.map((b, i) => (
              <div key={i} data-beat
                   className="min-h-[80vh] flex flex-col justify-center md:py-32">
                <p className="uppercase tracking-wider text-xs text-gold-500">Step {i + 1}</p>
                <h3 className="mt-3 font-display text-[clamp(1.75rem,2.5vw,2.5rem)] leading-tight text-ink-900">
                  {b.title}
                </h3>
                <p className="mt-4 text-ink-700 leading-relaxed max-w-md">{b.caption}</p>
              </div>
            ))}
          </div>

          <div className="md:sticky md:top-24 md:h-[70vh] hidden md:block">
            <div className="relative w-full h-full">
              {beats.map((b, i) => {
                const Illus = IllusMap[b.illustration];
                return (
                  <div
                    key={i}
                    data-illus
                    style={{ opacity: i === 0 ? 1 : 0 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Illus />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="md:hidden">
            {beats.map((b, i) => {
              const Illus = IllusMap[b.illustration];
              return (
                <div key={i} className="my-12 flex flex-col items-center">
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
