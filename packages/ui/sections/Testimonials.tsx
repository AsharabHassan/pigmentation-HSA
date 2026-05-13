import Image from "next/image";
import { Star } from "lucide-react";
import { Section } from "../primitives/Section";
import { Container } from "../primitives/Container";

export interface Testimonial {
  firstName: string;
  city: string;
  quote: string;
  stars: number;
  beforeSrc: string;
  afterSrc: string;
}

/**
 * Mobile-first testimonials:
 * - Phone: horizontal snap carousel (one card visible, ~5% peek of next)
 * - Tablet: 2 visible
 * - Desktop: 3 grid
 */
export function Testimonials({ items }: { items: Testimonial[] }) {
  return (
    <Section className="bg-surface-black !py-16 md:!py-24">
      <Container width="wide">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-gold-500">Patient stories</p>
        <h2 className="mt-3 font-display text-[clamp(2rem,7vw,2.75rem)] leading-[1.05] text-ivory-50 italic">
          Real people. Real results.
        </h2>

        <div className="mt-10 -mx-6 px-6 md:mx-0 md:px-0
                        flex md:grid gap-4 md:gap-5
                        md:grid-cols-3
                        overflow-x-auto snap-x snap-mandatory scrollbar-none">
          {items.map((t, i) => (
            <article key={i}
              className="snap-start shrink-0 w-[88%] md:w-auto
                         bg-surface-charcoal border border-gold-500/15 p-6 md:p-7">
              <div className="grid grid-cols-2 gap-1 ring-1 ring-gold-500/20">
                <Image src={t.beforeSrc} alt={`${t.firstName}: before`} width={300} height={300}
                       className="object-cover w-full aspect-square" />
                <Image src={t.afterSrc}  alt={`${t.firstName}: after`}  width={300} height={300}
                       className="object-cover w-full aspect-square" />
              </div>
              <div className="flex gap-0.5 mt-5">
                {Array.from({ length: t.stars }).map((_, n) => (
                  <Star key={n} size={14} className="fill-gold-500 stroke-gold-500" aria-hidden />
                ))}
              </div>
              <p className="mt-3 text-ivory-50/80 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
              <p className="mt-5 text-[11px] uppercase tracking-[0.18em] text-gold-500">
                {t.firstName} · {t.city}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
