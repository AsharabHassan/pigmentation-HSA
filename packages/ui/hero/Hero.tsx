import Link from "next/link";
import { Container } from "../primitives/Container";
import { Eyebrow } from "../primitives/Eyebrow";
import { BeforeAfterSlider } from "./BeforeAfterSlider";
import { DynamicHeadline } from "./DynamicHeadline";
import { TrustRow } from "./TrustRow";

interface CtaProps { label: string; href: string; }

export interface HeroProps {
  eyebrow: string;
  subtext: string;
  primaryCta: CtaProps;
  secondaryCta: CtaProps;
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
  rating: number;
  reviewCount: number;
  fallbackHeadline?: string;
}

export function Hero(p: HeroProps) {
  return (
    <section className="relative bg-ivory-50">
      <Container width="wide" className="pt-10 pb-24 md:pt-16 md:pb-32 grid md:grid-cols-[60%_40%] gap-10 md:gap-16 items-center">
        <div className="order-2 md:order-1">
          <BeforeAfterSlider
            beforeSrc={p.beforeSrc} afterSrc={p.afterSrc}
            beforeAlt={p.beforeAlt} afterAlt={p.afterAlt}
          />
        </div>
        <div className="order-1 md:order-2">
          <Eyebrow>{p.eyebrow}</Eyebrow>
          <DynamicHeadline
            fallback={p.fallbackHeadline}
            className="mt-3 font-display text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[1.05] tracking-tight text-ink-900"
          />
          <p className="mt-6 text-lg text-ink-700 leading-relaxed max-w-md">{p.subtext}</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              href={p.primaryCta.href as never}
              className="inline-flex justify-center bg-ink-900 text-ivory-50 px-7 py-4
                         text-sm uppercase tracking-wider hover:bg-aubergine-900
                         ring-1 ring-gold-500 ring-offset-4 ring-offset-ivory-50 transition-colors"
            >
              {p.primaryCta.label} →
            </Link>
            <Link
              href={p.secondaryCta.href as never}
              className="inline-flex justify-center border border-gold-500 text-ink-900 px-7 py-4
                         text-sm uppercase tracking-wider hover:bg-ink-900 hover:text-ivory-50
                         transition-colors"
            >
              {p.secondaryCta.label}
            </Link>
          </div>
          <TrustRow rating={p.rating} reviewCount={p.reviewCount} />
        </div>
      </Container>
    </section>
  );
}
