"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "../primitives/Container";

const concerns = [
  {
    slug: "melasma",
    title: "Melasma",
    blurb: "Hormonal patches that don't fade with creams. We treat the dermal source.",
    tone: "bg-clay-50",
  },
  {
    slug: "sun-damage",
    title: "Sun damage & age spots",
    blurb: "Solar lentigines from years of sun exposure. Clearable in 2–4 sessions.",
    tone: "bg-surface-100",
  },
  {
    slug: "post-acne",
    title: "Post-acne marks",
    blurb: "Dark marks left after acne. Sequence-treated with peels and pulsed laser.",
    tone: "bg-surface-100",
  },
  {
    slug: "lip-pigment",
    title: "Lip pigmentation",
    blurb: "Neutralisation protocol at lower energy for thinner lip tissue. Three to four sessions.",
    tone: "bg-clay-50",
  },
];

export function ConcernCards() {
  return (
    <section id="treatments" className="bg-surface-50 py-20 md:py-28">
      <Container width="wide">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-clay-500 font-semibold mb-3">
              What we treat
            </p>
            <h2 className="font-display text-4xl md:text-6xl text-ink-900 leading-[1.05] max-w-2xl">
              Pigmentation, by name.
            </h2>
          </div>
          <p className="text-base text-ink-700 max-w-sm">
            Different patterns, different treatments. We diagnose at consultation and calibrate the protocol to your skin type — including Fitzpatrick IV–VI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {concerns.map((c, i) => (
            <motion.article
              key={c.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className={`group ${c.tone} rounded-2xl p-8 md:p-10 border border-surface-200
                         hover:border-clay-300 transition-colors`}
            >
              <div className="flex items-baseline justify-between mb-4">
                <span className="text-[11px] uppercase tracking-[0.18em] text-clay-500 font-semibold tabular-nums">
                  0{i + 1}
                </span>
              </div>
              <h3 className="font-display text-3xl md:text-4xl text-ink-900 leading-tight">
                {c.title}
              </h3>
              <p className="mt-4 text-ink-700 leading-relaxed max-w-sm">{c.blurb}</p>
              <Link
                href={`#faq-${c.slug}` as never}
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-clay-600 hover:text-clay-700"
              >
                Read protocol
                <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
              </Link>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
}
