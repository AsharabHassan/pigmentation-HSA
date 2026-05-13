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
    <Section id="doctor" className="bg-aubergine-900 text-ivory-50">
      <Container width="wide" className="grid md:grid-cols-[45%_55%] gap-12 items-center">
        <div className="relative aspect-[4/5] w-full">
          <Image
            src={p.portrait} alt={p.portraitAlt} fill
            sizes="(max-width: 768px) 100vw, 45vw"
            className="object-cover"
          />
        </div>
        <div>
          <Eyebrow className="text-gold-400">The Doctor</Eyebrow>
          <h2 className="mt-3 font-display text-[clamp(2rem,3vw,3rem)] leading-[1.1]">{p.name}</h2>
          <p className="mt-3 text-ivory-100/70 text-sm uppercase tracking-wider">{p.credentials}</p>
          <p className="mt-3 text-ivory-100/60 text-sm">{p.yearsOfPractice}+ years in aesthetic medicine</p>
          <blockquote className="mt-10 font-display text-[clamp(1.5rem,2vw,2rem)] leading-snug text-ivory-50">
            <span className="text-gold-400 mr-2">"</span>
            {p.philosophy}
            <span className="text-gold-400 ml-2">"</span>
          </blockquote>
        </div>
      </Container>
    </Section>
  );
}
