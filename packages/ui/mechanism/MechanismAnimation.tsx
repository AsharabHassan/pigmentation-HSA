"use client";
import { useEffect, useRef, useState } from "react";
import { Section } from "../primitives/Section";
import { Container } from "../primitives/Container";
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
 * Mobile-first mechanism:
 * - Phone: full-width snap carousel — one beat per screen, swipe horizontally
 * - Tablet+: same carousel but wider cards
 * - Desktop (lg+): two-column with scroll-driven sticky illustration
 */
export function MechanismAnimation() {
  return (
    <Section id="how-it-works" className="bg-surface-black relative overflow-hidden !py-16 md:!py-24">
      <Container width="wide" className="relative">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-gold-500">How it works</p>
        <h2 className="mt-3 font-display text-[clamp(2rem,8vw,3.5rem)] leading-[1.02] text-ivory-50">
          Pigmentation doesn&apos;t live <em className="text-gold-400">on</em> your skin.
          <br />It lives <em className="text-gold-400">in</em> it.
        </h2>
        <p className="mt-4 text-ivory-50/65 max-w-lg">
          The five-step protocol, swipe through.
        </p>

        {/* Mobile + tablet: horizontal carousel. lg+: desktop layout */}
        <div className="lg:hidden">
          <MobileCarousel />
        </div>
        <div className="hidden lg:block">
          <DesktopScroller />
        </div>
      </Container>
    </Section>
  );
}

function MobileCarousel() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // Track active beat via IntersectionObserver
  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;
    const cards = root.querySelectorAll<HTMLDivElement>("[data-beat-card]");
    const io = new IntersectionObserver((entries) => {
      const top = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (top) setActive(Number(top.target.getAttribute("data-idx") ?? 0));
    }, { root, threshold: [0.55, 0.8] });
    cards.forEach(c => io.observe(c));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <div
        ref={scrollerRef}
        className="mt-10 -mx-6 px-6 flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-2"
      >
        {beats.map((b, i) => {
          const Illus = IllusMap[b.illustration];
          return (
            <article
              key={i}
              data-beat-card
              data-idx={i}
              className="snap-start shrink-0 w-[88%] md:w-[60%]
                         bg-surface-charcoal border border-gold-500/20 p-6 md:p-8
                         flex flex-col"
            >
              <div className="flex items-baseline justify-between mb-6">
                <span className="font-display italic text-gold-400 text-4xl leading-none">{b.numeral}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold-500/55">
                  {b.numeral} of V
                </span>
              </div>

              <div className="w-full">
                <Illus />
              </div>

              <h3 className="mt-8 font-display text-[clamp(1.5rem,5vw,2rem)] leading-tight text-ivory-50 italic">
                {b.title}
              </h3>
              <p className="mt-3 text-ivory-50/70 leading-relaxed">{b.caption}</p>
            </article>
          );
        })}
      </div>

      {/* Pagination dots */}
      <div className="mt-6 flex items-center justify-center gap-2.5">
        {beats.map((_, i) => (
          <span
            key={i}
            className={`h-1 transition-all ${i === active ? "w-6 bg-gold-400" : "w-1 bg-gold-500/30"}`}
            aria-hidden
          />
        ))}
      </div>
    </>
  );
}

function DesktopScroller() {
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
          gsap.to(el, { autoAlpha: j === idx ? 1 : 0, duration: 0.55, ease: "power2.out" });
        });
      };
      const triggers = Array.from(panels).map((p, i) =>
        ScrollTrigger.create({
          trigger: p, start: "top 60%", end: "bottom 40%",
          onEnter: () => activate(i), onEnterBack: () => activate(i),
        })
      );
      activate(0);
      cleanup = () => triggers.forEach(t => t.kill());
    })();
    return () => cleanup?.();
  }, []);

  return (
    <div ref={containerRef} className="mt-16 grid grid-cols-[40%_60%] gap-16 items-start">
      <ol className="relative">
        {beats.map((b, i) => (
          <li key={i} data-beat className="min-h-[72vh] flex flex-col justify-center py-20">
            <span className="font-display italic text-gold-400 text-3xl leading-none">{b.numeral}</span>
            <h3 className="mt-5 font-display text-[clamp(1.75rem,2.6vw,2.5rem)] leading-tight text-ivory-50 italic max-w-md">
              {b.title}
            </h3>
            <p className="mt-4 text-ivory-50/70 leading-relaxed max-w-md">{b.caption}</p>
          </li>
        ))}
      </ol>
      <div className="sticky top-24 h-[78vh]">
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="relative w-full max-w-md">
            {beats.map((b, i) => {
              const Illus = IllusMap[b.illustration];
              return (
                <div key={i} data-illus style={{ opacity: i === 0 ? 1 : 0 }}
                     className="absolute inset-0 flex items-center justify-center">
                  <Illus />
                </div>
              );
            })}
            <div className="invisible"><SkinCrossSection /></div>
          </div>
        </div>
      </div>
    </div>
  );
}
