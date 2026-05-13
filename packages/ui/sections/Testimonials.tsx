import Image from "next/image";
import { Star } from "lucide-react";
import { Section } from "../primitives/Section";
import { Container } from "../primitives/Container";
import { Eyebrow } from "../primitives/Eyebrow";

export interface Testimonial {
  firstName: string;
  city: string;
  quote: string;
  stars: number;
  beforeSrc: string;
  afterSrc: string;
}

export function Testimonials({ items }: { items: Testimonial[] }) {
  return (
    <Section className="bg-surface-charcoal">
      <Container width="wide">
        <Eyebrow>Patient stories</Eyebrow>
        <h2 className="mt-3 font-display text-[clamp(2rem,3vw,2.75rem)] leading-tight text-ivory-50">
          Real people. Real results.
        </h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((t, i) => (
            <article key={i} className="bg-surface-black border border-gold-500/15 p-6 hover:border-gold-500/50 transition-colors">
              <div className="grid grid-cols-2 gap-1 ring-1 ring-gold-500/20">
                <Image src={t.beforeSrc} alt={`${t.firstName}: before`} width={300} height={300} className="object-cover w-full h-40" />
                <Image src={t.afterSrc}  alt={`${t.firstName}: after`}  width={300} height={300} className="object-cover w-full h-40" />
              </div>
              <div className="flex gap-0.5 mt-5">
                {Array.from({ length: t.stars }).map((_, n) => (
                  <Star key={n} size={14} className="fill-gold-500 stroke-gold-500" aria-hidden />
                ))}
              </div>
              <p className="mt-3 text-ivory-50/80 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
              <p className="mt-5 text-xs uppercase tracking-[0.18em] text-gold-500">
                {t.firstName} · {t.city}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
