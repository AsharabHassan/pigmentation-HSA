import type { Metadata } from "next";
import { Hero } from "@ui/hero/Hero";
import { TrustStrip } from "@ui/sections/TrustStrip";
import { ConcernCards } from "@ui/sections/ConcernCards";
import { DoctorSection } from "@ui/sections/DoctorSection";
import { Testimonials } from "@ui/sections/Testimonials";
import { PricingCards } from "@ui/sections/PricingCards";
import { FinancingSection } from "@ui/sections/FinancingSection";
import { FAQ } from "@ui/sections/FAQ";

import { hero } from "@content/pigmentation/hero";
import { team } from "@content/pigmentation/doctor";
import { testimonialsLondon as testimonials } from "@content/pigmentation/testimonials";
import { timelineStages } from "@content/pigmentation/timeline";
import { faqOnPage } from "@content/pigmentation/faq-on-page";

import {
  ClientSelfieScanner,
  ClientMechanismAnimation,
  ClientTimelineScrubber,
  ClientBookingSection,
} from "./ClientInteractives";

export const metadata: Metadata = {
  title: "Pigmentation Removal London — Doctor-Led Clinic | Harley Street Aesthetics",
  description: "Doctor-led pigmentation clinic in London. Calibrated for all skin types (Fitzpatrick I–VI). 3-step protocol with no rebound. Free consultation.",
  alternates: { canonical: "/pigmentation-london" },
  openGraph: {
    title: "Clear pigmentation. Permanently. Without rebound.",
    description: "Doctor-led 3-step pigmentation protocol in London.",
    url: "/pigmentation-london",
    type: "website",
    images: [{ url: "/api/og/pigmentation", width: 1200, height: 630 }],
  },
};

export default function PigmentationLondonLpPage() {
  return (
    <>
      <Hero {...hero} />
      <TrustStrip />
      <ConcernCards />
      <ClientSelfieScanner />
      <ClientMechanismAnimation />
      <ClientTimelineScrubber stages={timelineStages} />
      <DoctorSection doctors={team} />
      <Testimonials items={testimonials} />
      <PricingCards />
      <FinancingSection />
      <ClientBookingSection />
      <FAQ
        heading="Frequently asked"
        entries={faqOnPage}
        id="faq"
      />
    </>
  );
}
