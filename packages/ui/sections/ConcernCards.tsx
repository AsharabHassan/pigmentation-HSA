"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "../primitives/Container";

const concerns = [
  { slug: "melasma",       title: "Melasma",          depth: "1.8–2.4 mm", origin: "Hormonal",       sessions: "4–6", note: "Symmetric malar patches; deepest pigment; calibrated low-energy pulsed protocol." },
  { slug: "sun-damage",    title: "Sun damage",       depth: "0.4–1.2 mm", origin: "UV cumulative",  sessions: "2–4", note: "Solar lentigines, age spots. Most responsive layer." },
  { slug: "post-acne",     title: "Post-acne PIH",    depth: "0.6–1.6 mm", origin: "Inflammatory",   sessions: "3–5", note: "Treated only once active acne is controlled." },
  { slug: "lip-pigment",   title: "Lip pigmentation", depth: "0.3–0.9 mm", origin: "Mixed",          sessions: "3–4", note: "Reduced energy, thinner tissue; neutralisation protocol." },
];

/**
 * Editorial asymmetric mosaic — like a print-magazine spread.
 * First concern gets a hero-sized tile with hand-annotated dimension data;
 * remaining three are stacked spec cards. Hairline gold rules anchor.
 */
export function ConcernCards() {
  return (
    <section id="treatments" className="relative bg-surface-black overflow-hidden border-t border-gold-500/15">
      <Container width="wide" className="relative pt-20 md:pt-28 pb-20 md:pb-28">

        {/* Chapter header */}
        <div className="flex items-baseline justify-between gap-4 mb-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold-500/70">
            Ch. II · The Concerns
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold-500/35 tabular-nums">
            04 entries
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
          What we read<br />
          <span className="text-gold-400">in the dermis.</span>
        </motion.h2>

        {/* Mosaic */}
        <div className="mt-16 md:mt-20 grid grid-cols-12 gap-3 md:gap-4">
          {/* Hero concern — large */}
          <motion.article
            initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="col-span-12 md:col-span-7 lg:col-span-7 relative bg-surface-charcoal border border-gold-500/20 p-7 md:p-10 lg:p-14 min-h-[420px] md:min-h-[520px] flex flex-col justify-between"
          >
            {/* Index numeral */}
            <span aria-hidden className="absolute top-6 right-8 font-display italic text-gold-500/15 text-[7rem] md:text-[10rem] leading-none">
              01
            </span>

            <div className="relative">
              <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold-500/60">
                Entry № 01
              </p>
              <h3 className="mt-4 font-display italic text-5xl md:text-7xl text-ivory-50">
                {concerns[0].title}
              </h3>
              <p className="mt-4 text-ivory-50/65 max-w-md leading-relaxed">{concerns[0].note}</p>
            </div>

            {/* Spec readout */}
            <div className="relative mt-10 grid grid-cols-3 gap-px bg-gold-500/20">
              {[
                ["Origin", concerns[0].origin],
                ["Depth", concerns[0].depth],
                ["Sessions", concerns[0].sessions],
              ].map(([k, v]) => (
                <div key={k} className="bg-surface-charcoal p-3.5">
                  <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-gold-500/55">{k}</p>
                  <p className="mt-1.5 text-ivory-50 text-lg font-display italic tabular-nums">{v}</p>
                </div>
              ))}
            </div>

            <Link href={`#faq-${concerns[0].slug}` as never}
              className="relative mt-8 inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.24em] text-gold-500 hover:text-gold-400 font-semibold">
              <span aria-hidden className="w-6 h-px bg-gold-500" />
              Read protocol
            </Link>
          </motion.article>

          {/* Three smaller spec cards */}
          <div className="col-span-12 md:col-span-5 lg:col-span-5 grid grid-cols-1 gap-3 md:gap-4">
            {concerns.slice(1).map((c, i) => (
              <motion.article
                key={c.slug}
                initial={{ opacity: 0, x: 30, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group relative bg-surface-charcoal border border-gold-500/15 p-5 md:p-7 hover:border-gold-500/50 transition-colors flex-1"
              >
                <div className="flex items-baseline justify-between">
                  <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-gold-500/60">
                    № {String(i + 2).padStart(2, "0")}
                  </p>
                  <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-gold-500/35 tabular-nums">
                    {c.sessions} ses.
                  </p>
                </div>
                <h3 className="mt-3 font-display italic text-2xl md:text-3xl text-ivory-50">{c.title}</h3>
                <p className="mt-3 text-ivory-50/60 text-sm leading-relaxed">{c.note}</p>
                <div className="mt-5 pt-4 border-t border-gold-500/15 flex items-baseline justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.22em]">
                  <span className="text-gold-500/55">{c.origin}</span>
                  <span className="text-gold-400 tabular-nums">{c.depth}</span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>

        {/* Hand-annotated dimensional rule — page footer mark */}
        <div className="mt-16 grid grid-cols-12 gap-3 md:gap-4 items-center">
          <span aria-hidden className="col-span-2 h-px bg-gold-500/25" />
          <p className="col-span-8 text-center font-mono text-[10px] uppercase tracking-[0.32em] text-gold-500/45">
            Treatable across Fitzpatrick I — VI · 14+ years in practice · Glasgow
          </p>
          <span aria-hidden className="col-span-2 h-px bg-gold-500/25" />
        </div>
      </Container>
    </section>
  );
}
