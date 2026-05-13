import Link from "next/link";
import { Section } from "../primitives/Section";
import { Container } from "../primitives/Container";
import { Eyebrow } from "../primitives/Eyebrow";
import { Card } from "../primitives/Card";

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
    <Section id="pricing" className="bg-ivory-50">
      <Container width="wide">
        <Eyebrow>Pricing</Eyebrow>
        <h2 className="mt-3 font-display text-[clamp(2rem,3vw,2.5rem)] leading-tight text-ink-900">
          Transparent. No hidden fees.
        </h2>
        <p className="mt-3 text-ink-700 max-w-2xl">
          Klarna and split-payment available. Final pricing is confirmed at your free consultation.
        </p>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map(t => (
            <Card
              key={t.name}
              className={t.featured ? "bg-aubergine-900 text-ivory-50 border-gold-500" : "bg-ivory-100"}
            >
              <h3 className={`font-display text-2xl ${t.featured ? "text-ivory-50" : "text-ink-900"}`}>
                {t.name}
              </h3>
              <p className={`mt-4 font-display text-4xl ${t.featured ? "text-gold-400" : "text-ink-900"}`}>
                {t.price}
              </p>
              <p className={`text-sm uppercase tracking-wider mt-1 ${t.featured ? "text-ivory-100/70" : "text-ink-500"}`}>
                {t.cadence}
              </p>
              <ul className={`mt-6 space-y-2 text-sm ${t.featured ? "text-ivory-100/85" : "text-ink-700"}`}>
                {t.features.map(f => <li key={f}>· {f}</li>)}
              </ul>
              <Link
                href={t.cta.href as never}
                className={`mt-8 inline-block w-full text-center px-6 py-3 text-sm uppercase tracking-wider transition-colors ${
                  t.featured
                    ? "bg-ivory-50 text-ink-900 hover:bg-gold-400"
                    : "border border-gold-500 text-ink-900 hover:bg-ink-900 hover:text-ivory-50"
                }`}
              >
                {t.cta.label}
              </Link>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
