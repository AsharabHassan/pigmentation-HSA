import type { Metadata } from "next";
import { Hero } from "@ui/hero/Hero";
import { TrustStrip } from "@ui/sections/TrustStrip";
import { ConcernCards } from "@ui/sections/ConcernCards";
import { DoctorSection } from "@ui/sections/DoctorSection";
import { Testimonials } from "@ui/sections/Testimonials";
import { PricingCards } from "@ui/sections/PricingCards";
import { FinancingSection } from "@ui/sections/FinancingSection";
import { FAQ } from "@ui/sections/FAQ";

import { hero } from "@content/chemical-peel/hero";
import { team } from "@content/chemical-peel/doctor";
import { testimonialsGlasgow as testimonials } from "@content/chemical-peel/testimonials";
import { timelineStages, timelineMetricValues } from "@content/chemical-peel/timeline";
import { faqOnPage } from "@content/chemical-peel/faq-on-page";
import { concerns } from "@content/chemical-peel/concerns";
import { tiers } from "@content/chemical-peel/pricing";
import { mechanismSteps } from "@content/chemical-peel/mechanism";

import {
  ClientSelfieScanner,
  ClientMechanismAnimation,
  ClientTimelineScrubber,
  ClientBookingSection,
} from "./ClientInteractives";

export const metadata: Metadata = {
  title: "Chemical Peels Glasgow — Doctor-Led Medical Peels | Harley Street Aesthetics",
  description:
    "Doctor-graded chemical peels in Glasgow. Clarity, Renewal, and Glow peels — calibrated to your skin type and concern. Safe for Fitzpatrick I–VI. Free consultation.",
  alternates: { canonical: "/chemical-peel-glasgow" },
  openGraph: {
    title: "The reset your skin's been asking for.",
    description: "Doctor-graded chemical peels in Glasgow.",
    url: "/chemical-peel-glasgow",
    type: "website",
    images: [{ url: "/api/og/chemical-peel", width: 1200, height: 630 }],
  },
};

export default function ChemicalPeelLpPage() {
  return (
    <>
      <Hero {...hero} />
      <TrustStrip />
      <ConcernCards
        sectionKicker="What peels actually treat"
        headline="Six concerns, four peel grades."
        intro="A peel is a precision tool — not a single recipe. Not sure which concern is yours? Let our AI map it in 5 seconds."
        concerns={concerns}
      />
      <ClientSelfieScanner />
      <ClientMechanismAnimation steps={mechanismSteps} />
      <ClientTimelineScrubber stages={timelineStages} metricValues={timelineMetricValues} />
      <DoctorSection
        doctors={team}
        sectionKicker="The team grading your peel"
        headline="Two doctors. One transparent ladder."
      />
      <Testimonials
        items={testimonials}
        sectionKicker="Real patients, Glasgow"
        headlineMain="Skin that doesn't lie."
        headlineAccent="Here's what they say."
      />
      <PricingCards
        sectionKicker="Pricing"
        headline="Four grades. One transparent ladder."
        intro="Course prices save £97–£147 over single sessions. Three interest-free financing options available. Final grade confirmed at your free consultation — no hidden fees, no brand markup."
        tiers={tiers}
      />
      <FinancingSection />
      <ClientBookingSection />
      <FAQ
        heading="Frequently asked about peels"
        entries={faqOnPage}
        id="faq"
      />
    </>
  );
}
