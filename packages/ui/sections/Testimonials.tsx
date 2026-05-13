import Image from "next/image";
import { Star } from "lucide-react";
import { Section } from "../primitives/Section";
import { Container } from "../primitives/Container";
import { Eyebrow } from "../primitives/Eyebrow";
import { Card } from "../primitives/Card";

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
    <Section className="bg-ivory-100">
      <Container width="wide">
        <Eyebrow>Patient stories</Eyebrow>
        <h2 className="mt-3 font-display text-[clamp(2rem,3vw,2.5rem)] leading-tight text-ink-900">
          Real people. Real results.
        </h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((t, i) => (
            <Card key={i} className="bg-ivory-50">
              <div className="grid grid-cols-2 gap-1">
                <Image src={t.beforeSrc} alt={`${t.firstName}: before`} width={300} height={300} className="object-cover w-full h-40" />
                <Image src={t.afterSrc}  alt={`${t.firstName}: after`}  width={300} height={300} className="object-cover w-full h-40" />
              </div>
              <div className="flex gap-0.5 mt-4">
                {Array.from({ length: t.stars }).map((_, n) => (
                  <Star key={n} size={14} className="fill-gold-500 stroke-gold-500" aria-hidden />
                ))}
              </div>
              <p className="mt-3 text-ink-700 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
              <p className="mt-4 text-sm uppercase tracking-wider text-ink-500">
                {t.firstName} · {t.city}
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
