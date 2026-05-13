import Image from "next/image";
import { Section } from "../primitives/Section";
import { Container } from "../primitives/Container";
import { Eyebrow } from "../primitives/Eyebrow";

interface Props {
  name: string;
  credentials: string;
  portrait: string;
  portraitAlt: string;
  philosophy: string;
  yearsOfPractice: number;
}

export function DoctorSection(p: Props) {
  return (
    <Section id="doctor" className="bg-surface-black border-y border-gold-500/15">
      <Container width="wide" className="grid md:grid-cols-[45%_55%] gap-12 items-center">
        <div className="relative aspect-[4/5] w-full ring-1 ring-gold-500/30 bg-surface-charcoal overflow-hidden">
          <Image
            src={p.portrait} alt={p.portraitAlt} fill
            sizes="(max-width: 768px) 100vw, 45vw"
            className="object-cover"
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-surface-black/60 via-transparent to-transparent" />
        </div>
        <div>
          <Eyebrow>The Doctor</Eyebrow>
          <h2 className="mt-3 font-display text-[clamp(2rem,3vw,3rem)] leading-[1.1] text-ivory-50">{p.name}</h2>
          <p className="mt-3 text-gold-500 text-xs uppercase tracking-[0.18em]">{p.credentials}</p>
          <p className="mt-2 text-ivory-50/55 text-sm">{p.yearsOfPractice}+ years in aesthetic medicine</p>
          <blockquote className="mt-10 font-display text-[clamp(1.5rem,2vw,2rem)] leading-snug text-ivory-50/90 relative pl-6 border-l-2 border-gold-500">
            {p.philosophy}
          </blockquote>
        </div>
      </Container>
    </Section>
  );
}
