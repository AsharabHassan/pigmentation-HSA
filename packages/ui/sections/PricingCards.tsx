import Link from "next/link";
import { Check } from "lucide-react";
import { Section } from "../primitives/Section";
import { Container } from "../primitives/Container";

const tiers = [
  {
    name: "Free Consultation",
    price: "£0",
    cadence: "60-minute clinical assessment",
    features: ["Dermatological skin analysis", "Personalised treatment plan", "Pricing breakdown — zero pressure"],
    cta: { label: "Book Consultation", href: "#book" },
    featured: false,
  },
  {
    name: "Signature 3-Step Protocol",
    price: "£399",
    cadence: "per session · 4–6 typical",
    features: ["VirtueRF microchanneling", "Pulsed-laser pigment fragmentation", "Exosome + mesotherapy infusion", "Calibrated for Fitzpatrick IV–VI"],
    cta: { label: "Take the Diagnostic", href: "#quiz" },
    featured: true,
  },
  {
    name: "Maintenance Peel",
    price: "£149",
    cadence: "per peel · 6–12 weekly",
    features: ["Medical-grade chemical peel", "Same-day, no downtime", "Pairs with the primary protocol"],
    cta: { label: "Add to Plan", href: "#book" },
    featured: false,
  },
];

export function PricingCards() {
  return (
    <Section id="pricing" className="bg-surface-charcoal !py-16 md:!py-24">
      <Container width="wide">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-gold-500">Pricing</p>
        <h2 className="mt-3 font-display text-[clamp(2rem,7vw,2.75rem)] leading-[1.05] text-ivory-50 italic">
          Transparent. No hidden fees.
        </h2>
        <p className="mt-3 text-ivory-50/65 max-w-xl">
          Klarna and split-payment available. Final pricing confirmed at your free consultation.
        </p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {tiers.map(t => (
            <article
              key={t.name}
              className={t.featured
                ? "relative bg-gradient-to-b from-surface-ash to-surface-black border-2 border-gold-500 p-8 order-first md:order-none md:scale-[1.02]"
                : "bg-surface-black border border-gold-500/20 p-7"}
            >
              {t.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold-500 text-ink-900 text-[10px] uppercase tracking-[0.2em] px-3 py-1 font-semibold">
                  Most chosen
                </span>
              )}
              <h3 className="font-display italic text-2xl text-ivory-50">{t.name}</h3>
              <p className={`mt-4 font-display ${t.featured ? "text-gold-400" : "text-ivory-50"} text-4xl`}>
                {t.price}
              </p>
              <p className="text-[11px] uppercase tracking-[0.18em] mt-1 text-gold-500">
                {t.cadence}
              </p>
              <ul className="mt-6 space-y-2.5 text-sm text-ivory-50/80">
                {t.features.map(f => (
                  <li key={f} className="flex gap-2">
                    <Check size={16} className="text-gold-500 shrink-0 mt-0.5" aria-hidden />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={t.cta.href as never}
                className={`mt-8 inline-block w-full text-center px-6 py-3.5 text-[12px] uppercase tracking-[0.18em] font-semibold transition-colors ${
                  t.featured
                    ? "bg-gold-500 text-ink-900 hover:bg-gold-400"
                    : "border border-gold-500/60 text-ivory-50 hover:bg-gold-500 hover:text-ink-900 hover:border-gold-500"
                }`}
              >
                {t.cta.label}
              </Link>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
