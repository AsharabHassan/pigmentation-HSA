import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@ui/primitives/Section";
import { Container } from "@ui/primitives/Container";
import { Eyebrow } from "@ui/primitives/Eyebrow";
import { faqGroups, faqPageFlat } from "@content/pigmentation/faq-page";
import { buildFaqJsonLd } from "@lib/schema/faq-jsonld";
import {
  buildMedicalPageJsonLd, buildBreadcrumbJsonLd,
} from "@lib/schema/medical-page-jsonld";
import { doctor } from "@content/pigmentation/doctor";

const PAGE_URL = "https://harleystreetmedics.clinic/pigmentation-faq";
const LAST_REVIEWED = "2026-05-13";

export const metadata: Metadata = {
  title: "Pigmentation Treatment Glasgow — Every Question, Answered",
  description:
    "Comprehensive answers about pigmentation, melasma, sun damage, post-acne marks, lip pigmentation, and treatment in our Glasgow clinic. Medically reviewed by Dr. M.T. Ahmad.",
  alternates: { canonical: "/pigmentation-faq" },
};

export default function PigmentationFaqPage() {
  const faqLd = buildFaqJsonLd(faqPageFlat);
  const medicalLd = buildMedicalPageJsonLd({
    url: PAGE_URL,
    name: "Pigmentation Treatment in Glasgow — Every Question, Answered",
    description:
      "Comprehensive answers about pigmentation, melasma, treatment options, costs, and aftercare at our Glasgow clinic.",
    reviewer: { name: doctor.name, jobTitle: "Aesthetic Physician" },
    lastReviewed: LAST_REVIEWED,
    medicalSpecialty: "Dermatology",
  });
  const crumbsLd = buildBreadcrumbJsonLd([
    { name: "Home", url: "https://harleystreetmedics.clinic/" },
    { name: "Pigmentation Glasgow", url: "https://harleystreetmedics.clinic/pigmentation-glasgow" },
    { name: "FAQ", url: PAGE_URL },
  ]);

  return (
    <>
      <Section className="bg-aubergine-900 text-ivory-50">
        <Container width="content">
          <p className="text-sm text-ivory-100/60">
            <Link href="/" className="hover:underline">Home</Link>
            {" / "}
            <Link href="/pigmentation-glasgow" className="hover:underline">Pigmentation Glasgow</Link>
            {" / FAQ"}
          </p>
          <Eyebrow className="text-gold-400 mt-8">Medically reviewed reference</Eyebrow>
          <h1 className="mt-3 font-display text-[clamp(2.5rem,5vw,4rem)] leading-[1.05]">
            Pigmentation Treatment in Glasgow — Every Question, Answered
          </h1>
          <p className="mt-6 max-w-3xl text-lg text-ivory-100/85 leading-relaxed">
            A reference written and reviewed by Dr. M.T. Ahmad. Whether you&apos;re researching melasma, sun damage,
            post-acne marks, or treatment options for darker skin types — the most common questions are answered
            here in full. If you want a personalised plan instead,{" "}
            <Link href="/pigmentation-glasgow#quiz" className="underline decoration-gold-500 underline-offset-4 hover:text-gold-400">
              take the 60-second skin diagnostic
            </Link>.
          </p>
          <p className="mt-6 text-sm text-ivory-100/60">
            Reviewed by <strong>{doctor.name}</strong> · Last reviewed {LAST_REVIEWED}
          </p>
        </Container>
      </Section>

      <Section className="bg-ivory-100 !py-16">
        <Container width="content">
          <Eyebrow>Contents</Eyebrow>
          <ul className="mt-6 grid md:grid-cols-2 gap-3">
            {faqGroups.map((g, i) => (
              <li key={i}>
                <Link
                  href={`#group-${i}` as never}
                  className="block py-2 text-ink-700 hover:text-aubergine-900 transition-colors border-b border-ink-300/30"
                >
                  {g.heading}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {faqGroups.map((group, gi) => (
        <Section key={gi} id={`group-${gi}`} className="bg-ivory-50">
          <Container width="content">
            <Eyebrow>{`Section ${gi + 1}`}</Eyebrow>
            <h2 className="mt-3 font-display text-[clamp(2rem,3.5vw,2.75rem)] leading-tight text-ink-900">
              {group.heading}
            </h2>
            {group.intro && <p className="mt-4 text-ink-700 max-w-2xl">{group.intro}</p>}
            <div className="mt-10 space-y-12">
              {group.entries.map((e, ei) => (
                <article key={ei} className="border-l-2 border-gold-500 pl-6">
                  <h3 className="font-display text-xl text-ink-900">{e.question}</h3>
                  <p className="mt-3 text-ink-700 leading-relaxed">{e.answer}</p>
                </article>
              ))}
            </div>
          </Container>
        </Section>
      ))}

      <Section className="bg-aubergine-900 text-ivory-50">
        <Container width="content" className="text-center">
          <h2 className="font-display text-[clamp(2rem,3vw,2.75rem)]">
            Still have a question we didn&apos;t answer?
          </h2>
          <p className="mt-4 text-ivory-100/80 max-w-xl mx-auto">
            Your free consultation is the right place for it. We&apos;ll review your specific case and give you a clear,
            no-pressure plan.
          </p>
          <Link
            href="/pigmentation-glasgow#book"
            className="mt-8 inline-block bg-ivory-50 text-ink-900 px-7 py-4 text-sm uppercase tracking-wider hover:bg-gold-400 transition-colors"
          >
            Book Free Consultation
          </Link>
        </Container>
      </Section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbsLd) }} />
    </>
  );
}
