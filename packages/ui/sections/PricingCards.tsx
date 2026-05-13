import Link from "next/link";
import { Section } from "../primitives/Section";
import { Container } from "../primitives/Container";
import { Eyebrow } from "../primitives/Eyebrow";

const tiers = [
  {
    name: "Free Skin Consultation",
    price: "£0",
    cadence: "60-minute clinical assessment",
    features: ["Dermatological skin analysis", "Personalised treatment plan", "Pricing breakdown — zero pressure"],
    cta: { label: "Book Consultation", href: "#book" },
    featured: false,
  },
  {
    name: "Signature 3-Step Pigmentation Protocol",
    price: "From £399",
    cadence: "per session · 4-6 typical",
    features: ["VirtueRF microchanneling", "Pulsed-laser pigment fragmentation", "Exosome + mesotherapy infusion", "Calibrated for Fitzpatrick IV-VI"],
    cta: { label: "Take the Diagnostic", href: "#quiz" },
    featured: true,
  },
  {
    name: "Maintenance Clarity Peel",
    price: "From £149",
    cadence: "per peel · 6-12 weekly",
    features: ["Medical-grade chemical peel", "Maintenance after primary protocol", "Same-day, no downtime"],
    cta: { label: "Add to Plan", href: "#book" },
    featured: false,
  },
];

export function PricingCards() {
  return (
    <Section id="pricing" className="bg-surface-black">
      <Container width="wide">
        <Eyebrow>Pricing</Eyebrow>
        <h2 className="mt-3 font-display text-[clamp(2rem,3vw,2.75rem)] leading-tight text-ivory-50">
          Transparent. No hidden fees.
        </h2>
        <p className="mt-3 text-ivory-50/70 max-w-2xl">
          Klarna and split-payment available. Final pricing is confirmed at your free consultation.
        </p>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map(t => (
            <article
              key={t.name}
              className={t.featured
                ? "relative bg-gradient-to-b from-surface-charcoal to-surface-black border-2 border-gold-500 p-8 md:scale-[1.03]"
                : "bg-surface-charcoal border border-gold-500/20 p-8"}
            >
              {t.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold-500 text-ink-900 text-[10px] uppercase tracking-[0.2em] px-3 py-1 font-medium">
                  Most chosen
                </span>
              )}
              <h3 className="font-display text-2xl text-ivory-50">{t.name}</h3>
              <p className={`mt-4 font-display text-4xl ${t.featured ? "text-gold-400" : "text-ivory-50"}`}>
                {t.price}
              </p>
              <p className="text-xs uppercase tracking-[0.18em] mt-1 text-gold-500">
                {t.cadence}
              </p>
              <ul className="mt-6 space-y-2.5 text-sm text-ivory-50/80">
                {t.features.map(f => (
                  <li key={f} className="flex gap-2">
                    <span aria-hidden className="text-gold-500 mt-0.5">·</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={t.cta.href as never}
                className={`mt-8 inline-block w-full text-center px-6 py-3.5 text-xs uppercase tracking-[0.18em] font-medium transition-colors ${
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
