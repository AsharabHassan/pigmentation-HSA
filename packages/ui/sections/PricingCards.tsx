"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "../primitives/Container";

const tiers = [
  {
    code: "00",
    name: "Skin Consultation",
    price: "£0",
    cadence: "60 minutes",
    features: ["Dermatological analysis", "Personalised plan", "Pricing breakdown — zero pressure"],
    cta: { label: "Book consultation", href: "#book" },
    featured: false,
  },
  {
    code: "01",
    name: "Signature 3-Step Protocol",
    price: "£399",
    cadence: "per session · 4–6 typical",
    features: ["VirtueRF microchanneling", "Pulsed-laser pigment fragmentation", "Exosome + mesotherapy infusion", "Calibrated for Fitzpatrick I–VI"],
    cta: { label: "Take the diagnostic", href: "#quiz" },
    featured: true,
  },
  {
    code: "02",
    name: "Maintenance Clarity Peel",
    price: "£149",
    cadence: "per peel · 6–12 weekly",
    features: ["Medical-grade chemical peel", "Same-day, no downtime", "Pairs with primary protocol"],
    cta: { label: "Add to plan", href: "#book" },
    featured: false,
  },
];

/**
 * Pricing as a spec catalogue. Each tier is a numbered entry, mono code,
 * data-plate readout. Featured tier has elevated typography but stays
 * editorial — no halo glow, no clichéd "popular" bubble.
 */
export function PricingCards() {
  return (
    <section id="pricing" className="relative bg-surface-charcoal overflow-hidden border-t border-gold-500/15">
      <Container width="wide" className="relative pt-20 md:pt-28 pb-20 md:pb-28">
        <div className="flex items-baseline justify-between gap-4 mb-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold-500/70">
            Ch. VII · Investment
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold-500/35 tabular-nums">
            03 tiers · pricing in GBP
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
          Transparent.<br />
          <span className="text-gold-400">No hidden fees.</span>
        </motion.h2>

        <p className="mt-6 text-base md:text-lg text-ivory-50/65 max-w-xl">
          Klarna and split-payment available. Final pricing confirmed at your free consultation.
        </p>

        <div className="mt-14 md:mt-20 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4">
          {tiers.map((t, i) => (
            <motion.article
              key={t.code}
              initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.9, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={
                t.featured
                  ? "relative bg-surface-black border border-gold-500 md:col-span-6 p-8 md:p-12 order-first md:order-none"
                  : "relative bg-surface-black border border-gold-500/20 md:col-span-3 p-7 md:p-8"
              }
            >
              {/* Catalogue code */}
              <div className="flex items-baseline justify-between mb-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold-500/60 tabular-nums">
                  Ref. № {t.code}
                </p>
                {t.featured && (
                  <p className="font-mono text-[9px] uppercase tracking-[0.32em] text-gold-400">
                    ◆ Most chosen
                  </p>
                )}
              </div>

              <h3 className="font-display italic text-2xl md:text-3xl text-ivory-50">
                {t.name}
              </h3>

              <div className="mt-7 flex items-baseline gap-3">
                <p className={`font-display italic leading-none tabular-nums ${t.featured ? "text-gold-400 text-6xl md:text-7xl" : "text-ivory-50 text-5xl"}`}>
                  {t.price}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold-500/60">
                  {t.cadence}
                </p>
              </div>

              <ul className="mt-8 space-y-2.5 text-sm text-ivory-50/75">
                {t.features.map(f => (
                  <li key={f} className="flex gap-3">
                    <span aria-hidden className="text-gold-500 mt-1">·</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={t.cta.href as never}
                className={`mt-10 inline-flex items-center justify-between w-full px-6 py-4 text-[11px] uppercase tracking-[0.24em] font-semibold transition-colors ${
                  t.featured
                    ? "bg-gold-500 text-ink-900 hover:bg-gold-400"
                    : "border border-gold-500/40 text-ivory-50 hover:bg-gold-500 hover:text-ink-900 hover:border-gold-500"
                }`}
              >
                <span>{t.cta.label}</span>
                <span className="font-mono text-[10px] opacity-60">→</span>
              </Link>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
}
