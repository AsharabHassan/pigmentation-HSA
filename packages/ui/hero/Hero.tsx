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
  beforeLabel?: string;
  afterLabel?: string;
  rating: number;
  reviewCount: number;
  fallbackHeadline?: string;
}

export function Hero(p: HeroProps) {
  return (
    <section className="relative bg-surface-black overflow-hidden">
      {/* Decorative gold halo */}
      <div aria-hidden className="pointer-events-none absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gold-500/10 blur-[120px]" />
      <div aria-hidden className="pointer-events-none absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-gold-700/10 blur-[120px]" />

      <Container width="wide" className="relative pt-10 pb-24 md:pt-16 md:pb-32 grid md:grid-cols-[58%_42%] gap-10 md:gap-16 items-center">
        <div className="order-2 md:order-1">
          <div className="relative">
            <div aria-hidden className="absolute -inset-2 bg-gradient-to-br from-gold-500/30 via-transparent to-gold-700/20 blur-xl" />
            <div className="relative ring-1 ring-gold-500/30">
              <BeforeAfterSlider
                beforeSrc={p.beforeSrc} afterSrc={p.afterSrc}
                beforeAlt={p.beforeAlt} afterAlt={p.afterAlt}
                beforeLabel={p.beforeLabel} afterLabel={p.afterLabel}
              />
            </div>
          </div>
        </div>
        <div className="order-1 md:order-2">
          <Eyebrow>{p.eyebrow}</Eyebrow>
          <DynamicHeadline
            fallback={p.fallbackHeadline}
            className="mt-4 font-display text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[1.02] tracking-tight text-ivory-50"
          />
          <p className="mt-6 text-lg text-ivory-50/70 leading-relaxed max-w-md">{p.subtext}</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              href={p.primaryCta.href as never}
              className="inline-flex justify-center bg-gold-500 text-ink-900 px-7 py-4
                         text-sm uppercase tracking-[0.18em] font-medium hover:bg-gold-400
                         transition-colors"
            >
              {p.primaryCta.label} →
            </Link>
            <Link
              href={p.secondaryCta.href as never}
              className="inline-flex justify-center border border-gold-500/50 text-ivory-50 px-7 py-4
                         text-sm uppercase tracking-[0.18em] font-medium hover:bg-gold-500 hover:text-ink-900
                         hover:border-gold-500 transition-colors"
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
