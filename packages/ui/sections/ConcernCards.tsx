import Link from "next/link";
import { Section } from "../primitives/Section";
import { Container } from "../primitives/Container";
import { Eyebrow } from "../primitives/Eyebrow";

const concerns = [
  { slug: "melasma",     title: "Melasma",       blurb: "Hormonal patches that creams can't reach. Our protocol calibrates laser energy below the dermal layer." },
  { slug: "sun-damage",  title: "Sun damage",    blurb: "Solar lentigines, age spots, photoaging. Clearable in as few as 3 sessions." },
  { slug: "age-spots",   title: "Age spots",     blurb: "Targeted pigment removal without affecting surrounding skin tone." },
  { slug: "post-acne",   title: "Post-acne marks", blurb: "Dark marks left by past breakouts. Treated with peels + targeted laser." },
];

export function ConcernCards() {
  return (
    <Section className="bg-surface-charcoal">
      <Container width="wide">
        <Eyebrow>What we treat</Eyebrow>
        <h2 className="mt-3 font-display text-[clamp(2rem,3vw,2.75rem)] leading-tight text-ivory-50 max-w-2xl">
          Whatever&apos;s showing up on your skin — we&apos;ve treated it.
        </h2>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {concerns.map(c => (
            <article key={c.slug}
              className="group flex flex-col p-8 bg-surface-black border border-gold-500/15
                         hover:border-gold-500/60 transition-colors">
              <h3 className="font-display text-2xl text-ivory-50">{c.title}</h3>
              <div className="mt-3 h-px w-10 bg-gold-500 group-hover:w-16 transition-all" />
              <p className="mt-4 text-ivory-50/70 leading-relaxed flex-1">{c.blurb}</p>
              <Link
                href={`#faq-${c.slug}` as never}
                className="mt-6 text-xs uppercase tracking-[0.18em] text-gold-500 hover:text-gold-400 font-medium"
              >
                Learn more →
              </Link>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
