import Link from "next/link";
import { Section } from "../primitives/Section";
import { Container } from "../primitives/Container";
import { Eyebrow } from "../primitives/Eyebrow";
import type { QuizAnswers } from "./state";
import type { RevealPayload } from "./LeadForm";

interface Props {
  reveal: RevealPayload;
  answers: QuizAnswers;
}

function buildWhyParagraph(answers: QuizAnswers): string {
  const tried = answers.tried_before ?? [];
  if (tried.includes("prescription")) {
    return "Hydroquinone and tretinoin plateau at ~30% improvement because they only address surface melanin. The 3-step protocol reaches the dermal layer where your pigmentation lives — that's why you see the difference.";
  }
  if (tried.includes("peels")) {
    return "Peels alone resurface — they don't reach the dermal melanocytes that drive recurrence. Combined with pulsed laser + exosome infusion, peels become 3-4× more effective.";
  }
  if (tried.includes("laser elsewhere")) {
    return "Laser without proper Fitzpatrick calibration can trigger rebound — especially for darker skin types. Our protocol calibrates energy to your specific skin type, eliminating that risk.";
  }
  if (tried.includes("OTC creams") || tried.includes("home remedies")) {
    return "OTC actives top out around 15% improvement because they can't reach the dermal layer where pigmentation actually originates. Medical-grade protocols penetrate three times deeper.";
  }
  return "Most pigmentation lives below the skin's surface — beyond what creams can reach. Our 3-step protocol works at the dermal level where pigmentation originates, which is why it lasts.";
}

export function ResultReveal({ reveal, answers }: Props) {
  return (
    <Section className="bg-ivory-50">
      <Container width="content">
        <Eyebrow>Your personalised plan</Eyebrow>
        <h2 className="mt-3 font-display text-[clamp(2.5rem,4vw,3.5rem)] leading-tight text-ink-900">
          Here&apos;s your plan, {reveal.firstName}.
        </h2>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="border-l-2 border-gold-500 pl-4">
            <p className="uppercase tracking-wider text-ink-500 text-xs">Your concern</p>
            <p className="mt-1 text-ink-900 text-lg capitalize">{reveal.concern?.replace("-", " ") ?? "—"}</p>
          </div>
          <div className="border-l-2 border-gold-500 pl-4">
            <p className="uppercase tracking-wider text-ink-500 text-xs">Your skin type</p>
            <p className="mt-1 text-ink-900 text-lg">Fitzpatrick {reveal.fitzpatrick}</p>
          </div>
          <div className="border-l-2 border-gold-500 pl-4">
            <p className="uppercase tracking-wider text-ink-500 text-xs">Estimated sessions</p>
            <p className="mt-1 text-ink-900 text-lg">{reveal.estimatedSessions}</p>
          </div>
        </div>

        <div className="mt-12 bg-aubergine-900 text-ivory-50 p-8 md:p-12">
          <Eyebrow className="text-gold-400">Recommended protocol</Eyebrow>
          <h3 className="mt-3 font-display text-3xl">{reveal.recommendedProtocol}</h3>
          <ul className="mt-6 space-y-2 text-ivory-100/85">
            <li>· Calibrated for your skin type (Fitzpatrick {reveal.fitzpatrick} laser energy)</li>
            <li>· Targets the dermal-layer cause of your pigmentation</li>
            <li>· £399 per session</li>
          </ul>
        </div>

        <div className="mt-10">
          <Eyebrow>Why this works for you</Eyebrow>
          <p className="mt-3 text-ink-700 leading-relaxed text-lg max-w-2xl">
            {buildWhyParagraph(answers)}
          </p>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row gap-4">
          <Link href="#book" className="inline-flex justify-center bg-ink-900 text-ivory-50 px-7 py-4 text-sm uppercase tracking-wider
                                       ring-1 ring-gold-500 ring-offset-4 ring-offset-ivory-50 hover:bg-aubergine-900 transition-colors">
            Book Free Consultation — Glasgow
          </Link>
          <a href="tel:0141XXXXXXX" className="inline-flex justify-center border border-gold-500 text-ink-900 px-7 py-4 text-sm uppercase tracking-wider hover:bg-ink-900 hover:text-ivory-50 transition-colors">
            Call us: 0141 XXX XXXX
          </a>
        </div>

        <p className="mt-6 text-sm text-ink-500">Your plan was just emailed and texted to you.</p>
      </Container>
    </Section>
  );
}
