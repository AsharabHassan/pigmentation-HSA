import Link from "next/link";
import { Section } from "../primitives/Section";
import { Container } from "../primitives/Container";

const concerns = [
  { slug: "melasma",     title: "Melasma",          blurb: "Hormonal patches that creams can't reach." },
  { slug: "sun-damage",  title: "Sun damage",       blurb: "Solar lentigines, age spots, photoaging." },
  { slug: "age-spots",   title: "Age spots",        blurb: "Targeted pigment removal without affecting surrounding skin tone." },
  { slug: "post-acne",   title: "Post-acne marks",  blurb: "Dark marks left by past breakouts." },
];

/**
 * Mobile-first concern cards.
 * - Phone: horizontal snap carousel, one-and-a-half cards visible, swipeable
 * - Tablet+: 2x2 grid
 * - Desktop: 4 across
 */
export function ConcernCards() {
  return (
    <Section className="bg-surface-charcoal !py-16 md:!py-24">
      <Container width="wide">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-gold-500">What we treat</p>
        <h2 className="mt-3 font-display text-[clamp(2rem,7vw,2.75rem)] leading-[1.1] text-ivory-50 italic max-w-xl">
          Whatever&apos;s on your skin — we&apos;ve treated it.
        </h2>

        {/* Mobile: horizontal scroll; md+: grid */}
        <div className="mt-10 -mx-6 px-6 md:mx-0 md:px-0
                        flex md:grid gap-4 md:gap-5
                        md:grid-cols-2 lg:grid-cols-4
                        overflow-x-auto snap-x snap-mandatory scrollbar-none">
          {concerns.map(c => (
            <article key={c.slug}
              className="snap-start shrink-0 w-[78%] md:w-auto
                         flex flex-col bg-surface-black border border-gold-500/15
                         p-6 md:p-7 hover:border-gold-500/50 transition-colors">
              <h3 className="font-display text-2xl text-ivory-50 italic">{c.title}</h3>
              <div className="mt-3 h-px w-8 bg-gold-500" />
              <p className="mt-4 text-ivory-50/70 leading-relaxed flex-1">{c.blurb}</p>
              <Link
                href={`#faq-${c.slug}` as never}
                className="mt-6 text-[11px] uppercase tracking-[0.18em] text-gold-500 hover:text-gold-400 font-semibold"
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
