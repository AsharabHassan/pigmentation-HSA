import Image from "next/image";
import { Section } from "../primitives/Section";
import { Container } from "../primitives/Container";

interface Props {
  name: string;
  credentials: string;
  portrait: string;
  portraitAlt: string;
  philosophy: string;
  yearsOfPractice: number;
}

/**
 * Mobile-first doctor section.
 * - Phone: stacked — portrait above, text below
 * - Tablet+: side-by-side
 */
export function DoctorSection(p: Props) {
  return (
    <Section id="doctor" className="bg-surface-black border-y border-gold-500/15 !py-16 md:!py-24">
      <Container width="wide" className="grid grid-cols-1 md:grid-cols-[42%_58%] gap-8 md:gap-12 items-center">
        <div className="relative aspect-[4/5] w-full max-w-[400px] mx-auto md:max-w-none ring-1 ring-gold-500/30 bg-surface-charcoal overflow-hidden">
          <Image
            src={p.portrait} alt={p.portraitAlt} fill
            sizes="(max-width: 768px) 90vw, 42vw"
            className="object-cover"
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
        </div>
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-gold-500">The Doctor</p>
          <h2 className="mt-3 font-display text-[clamp(2rem,7vw,3rem)] leading-[1.1] text-ivory-50 italic">{p.name}</h2>
          <p className="mt-3 text-gold-500 text-[11px] uppercase tracking-[0.18em]">{p.credentials}</p>
          <p className="mt-2 text-ivory-50/55 text-sm">{p.yearsOfPractice}+ years in aesthetic medicine</p>
          <blockquote className="mt-8 font-display italic text-[clamp(1.25rem,4.5vw,1.75rem)] leading-snug text-ivory-50/90 pl-5 border-l-2 border-gold-500">
            {p.philosophy}
          </blockquote>
        </div>
      </Container>
    </Section>
  );
}
