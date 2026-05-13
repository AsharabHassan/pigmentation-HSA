import Link from "next/link";
import { Section } from "../primitives/Section";
import { Container } from "../primitives/Container";
import { Eyebrow } from "../primitives/Eyebrow";
import { Card } from "../primitives/Card";

const concerns = [
  { slug: "melasma",     title: "Melasma",       blurb: "Hormonal patches that creams can't reach. Our protocol calibrates laser energy below the dermal layer." },
  { slug: "sun-damage",  title: "Sun damage",    blurb: "Solar lentigines, age spots, photoaging. Clearable in as few as 3 sessions." },
  { slug: "age-spots",   title: "Age spots",     blurb: "Targeted pigment removal without affecting surrounding skin tone." },
  { slug: "post-acne",   title: "Post-acne marks", blurb: "Dark marks left by past breakouts. Treated with peels + targeted laser." },
];

export function ConcernCards() {
  return (
    <Section className="bg-ivory-50">
      <Container width="wide">
        <Eyebrow>What we treat</Eyebrow>
        <h2 className="mt-3 font-display text-[clamp(2rem,3vw,2.5rem)] leading-tight text-ink-900 max-w-2xl">
          Whatever's showing up on your skin — we've treated it.
        </h2>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {concerns.map(c => (
            <Card key={c.slug} className="flex flex-col">
              <h3 className="font-display text-2xl text-ink-900">{c.title}</h3>
              <p className="mt-3 text-ink-700 leading-relaxed flex-1">{c.blurb}</p>
              <Link
                href={`#faq-${c.slug}` as never}
                className="mt-6 text-sm uppercase tracking-wider text-gold-500 hover:text-gold-400"
              >
                Learn more →
              </Link>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
