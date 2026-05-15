"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Container } from "../primitives/Container";

export interface PricingTier {
  name: string;
  price: string;
  cadence: string;
  features: string[];
  cta: { label: string; href: string };
  featured?: boolean;
}

interface Props {
  sectionId?: string;
  sectionKicker?: string;
  headline?: string;
  intro?: string;
  tiers?: PricingTier[];
}

const DEFAULT_TIERS: PricingTier[] = [
  {
    name: "Free consultation",
    price: "£0",
    cadence: "10 minutes · online",
    features: [
      "Dermatological skin analysis",
      "Personalised treatment plan",
      "Transparent pricing breakdown",
      "Zero pressure to book",
    ],
    cta: { label: "Book consultation", href: "#book" },
    featured: false,
  },
  {
    name: "Signature 3-Step Protocol",
    price: "From £399",
    cadence: "per session · 4–6 typical",
    features: [
      "VirtueRF microchanneling",
      "Pulsed-laser pigment fragmentation",
      "Exosome + mesotherapy infusion",
      "Calibrated for Fitzpatrick I–VI",
    ],
    cta: { label: "Book consultation", href: "#book" },
    featured: true,
  },
  {
    name: "Maintenance Peel",
    price: "From £149",
    cadence: "per peel · 6–12 weekly",
    features: [
      "Medical-grade chemical peel",
      "Same-day, no downtime",
      "Pairs with the primary protocol",
    ],
    cta: { label: "Add to plan", href: "#book" },
    featured: false,
  },
];

export function PricingCards({
  sectionId = "pricing",
  sectionKicker = "Pricing",
  headline = "No hidden fees.",
  intro = "Klarna and split-payment available. Final pricing confirmed at your free consultation.",
  tiers = DEFAULT_TIERS,
}: Props = {}) {
  return (
    <section id={sectionId} className="bg-surface-100 py-20 md:py-28">
      <Container width="wide">
        <div className="text-center mb-12 md:mb-16 max-w-2xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.18em] text-clay-500 font-semibold mb-3">
            {sectionKicker}
          </p>
          <h2 className="font-display text-4xl md:text-6xl text-ink-900 leading-[1.05]">
            {headline}
          </h2>
          <p className="mt-5 text-base md:text-lg text-ink-700">{intro}</p>
        </div>

        <div className={`grid grid-cols-1 gap-5 md:gap-6 mx-auto ${
          tiers.length >= 4
            ? "md:grid-cols-2 lg:grid-cols-4 max-w-6xl"
            : "md:grid-cols-3 max-w-5xl"
        }`}>
          {tiers.map((t, i) => (
            <motion.article
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={
                t.featured
                  ? `relative bg-ink-900 text-surface-50 rounded-2xl p-7 md:p-9 order-first md:order-none ${tiers.length < 4 ? "md:scale-[1.04]" : ""} shadow-[0_20px_60px_-20px_rgba(26,22,18,0.3)]`
                  : "relative bg-surface-50 rounded-2xl p-7 md:p-9 border border-surface-200"
              }
            >
              {t.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-clay-500 text-ink-900
                                 text-[10px] uppercase tracking-[0.18em] font-semibold
                                 px-4 py-1.5 rounded-full">
                  Most chosen
                </span>
              )}
              <h3 className={`font-display text-2xl md:text-3xl ${t.featured ? "text-surface-50" : "text-ink-900"}`}>
                {t.name}
              </h3>
              <p className={`mt-5 font-display ${t.featured ? "text-clay-300" : "text-ink-900"} text-4xl md:text-5xl tabular-nums`}>
                {t.price}
              </p>
              <p className={`text-sm mt-1 ${t.featured ? "text-surface-50/60" : "text-ink-500"}`}>
                {t.cadence}
              </p>
              <ul className={`mt-7 space-y-2.5 text-sm ${t.featured ? "text-surface-50/85" : "text-ink-700"}`}>
                {t.features.map(f => (
                  <li key={f} className="flex gap-2.5">
                    <Check size={16} className={`shrink-0 mt-0.5 ${t.featured ? "text-clay-300" : "text-clay-500"}`} aria-hidden />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={t.cta.href as never}
                className={`mt-8 inline-flex items-center justify-center w-full px-6 py-3.5
                            text-[12px] uppercase tracking-[0.12em] font-semibold rounded-full transition-colors ${
                  t.featured
                    ? "bg-clay-500 text-ink-900 hover:bg-clay-600"
                    : "bg-ink-900 text-surface-50 hover:bg-ink-700"
                }`}
              >
                {t.cta.label}
              </Link>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
}
