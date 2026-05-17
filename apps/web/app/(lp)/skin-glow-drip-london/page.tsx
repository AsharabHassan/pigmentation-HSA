import type { Metadata } from "next";
import { Hero } from "@ui/hero/Hero";
import { TrustStrip } from "@ui/sections/TrustStrip";
import { ConcernCards } from "@ui/sections/ConcernCards";
import { DoctorSection } from "@ui/sections/DoctorSection";
import { Testimonials } from "@ui/sections/Testimonials";
import { PricingCards } from "@ui/sections/PricingCards";
import { FinancingSection } from "@ui/sections/FinancingSection";
import { ClinicSection } from "@ui/sections/ClinicSection";
import { FAQ } from "@ui/sections/FAQ";

import { clinics } from "@content/clinics";
import { hero } from "@content/skin-glow-drip/hero";
import { team } from "@content/skin-glow-drip/doctor";
import { testimonialsLondon as testimonials } from "@content/skin-glow-drip/testimonials";
import { timelineStages, timelineMetricValues } from "@content/skin-glow-drip/timeline";
import { faqOnPage } from "@content/skin-glow-drip/faq-on-page";
import { concerns } from "@content/skin-glow-drip/concerns";
import { tiers } from "@content/skin-glow-drip/pricing";
import { mechanismSteps } from "@content/skin-glow-drip/mechanism";

import {
  ClientSelfieScanner,
  ClientMechanismAnimation,
  ClientTimelineScrubber,
  ClientBookingSection,
} from "./ClientInteractives";

export const metadata: Metadata = {
  title: "Skin Glow IV Drip London — Glutathione · Vit C · Doctor-Administered | Harley Street Aesthetics",
  description:
    "Doctor-administered Skin Glow IV drips in London. Glutathione, high-dose Vitamin C, B-Complex — 6-drip courses with transparent pricing. Safe for Fitzpatrick I–VI.",
  alternates: { canonical: "/skin-glow-drip-london" },
  openGraph: {
    title: "Glow from the inside out.",
    description: "Doctor-administered Skin Glow IV drips in London.",
    url: "/skin-glow-drip-london",
    type: "website",
    images: [{ url: "/api/og/skin-glow-drip", width: 1200, height: 630 }],
  },
};

export default function SkinGlowDripLondonLpPage() {
  return (
    <>
      <Hero {...hero} />
      <TrustStrip />
      <ConcernCards
        sectionKicker="What an IV glow drip treats"
        headline="Six reasons people book the drip."
        intro="A drip course is a systemic reset — antioxidant defence, melanin slowdown, collagen support. Best results when the concern is partly oxidative or pigment-driven. Not sure if it's yours? AI can tell you in 5 seconds."
        concerns={concerns}
      />
      <ClientSelfieScanner />
      <ClientMechanismAnimation steps={mechanismSteps} />
      <ClientTimelineScrubber stages={timelineStages} metricValues={timelineMetricValues} />
      <DoctorSection
        doctors={team}
        sectionKicker="The team administering your drip"
        headline="Two doctors. One transparent ladder."
      />
      <Testimonials
        items={testimonials}
        sectionKicker="Real patients, London"
        headlineMain="Glow that holds up in photos."
        headlineAccent="Here's what they say."
      />
      <PricingCards
        sectionKicker="Pricing"
        headline="Four drips. One transparent ladder."
        intro="Course prices save 15–17% over single sessions. Three interest-free financing options available. Final protocol confirmed at your free 10-min consultation — no hidden fees, no brand markup."
        tiers={tiers}
      />
      <FinancingSection />
      <ClientBookingSection />
      <FAQ
        heading="Frequently asked about IV glow drips"
        entries={faqOnPage}
        id="faq"
      />
      <ClinicSection clinic={clinics.london} />
    </>
  );
}
