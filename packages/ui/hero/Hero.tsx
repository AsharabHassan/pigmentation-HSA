import Link from "next/link";
import { Container } from "../primitives/Container";
import { BeforeAfterSlider } from "./BeforeAfterSlider";
import { DynamicHeadline } from "./DynamicHeadline";
import { Star } from "lucide-react";

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

/**
 * Mobile-first hero — single column on phones, side-by-side from md.
 * - Image leads on mobile; full-bleed within container, ample headroom for thumb scroll.
 * - Two CTAs stack full-width on mobile; sit side-by-side on tablet+.
 * - Trust row scrolls horizontally on small screens if needed (no truncation).
 */
export function Hero(p: HeroProps) {
  return (
    <section className="relative bg-surface-black overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute -top-32 right-[-20%] w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] rounded-full bg-gold-500/[0.07] blur-[80px]" />

      <Container width="wide" className="relative pt-8 pb-16 md:pt-16 md:pb-28 grid grid-cols-1 md:grid-cols-[55%_45%] gap-10 md:gap-16 md:items-center">
        {/* Image — first on mobile (visual hook), second on desktop */}
        <div className="order-1 md:order-2">
          <BeforeAfterSlider
            beforeSrc={p.beforeSrc} afterSrc={p.afterSrc}
            beforeAlt={p.beforeAlt} afterAlt={p.afterAlt}
            beforeLabel={p.beforeLabel} afterLabel={p.afterLabel}
          />
        </div>

        {/* Copy + CTAs */}
        <div className="order-2 md:order-1">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-gold-500">
            {p.eyebrow}
          </p>

          <DynamicHeadline
            fallback={p.fallbackHeadline}
            className="mt-4 font-display text-[clamp(2.5rem,9vw,4.5rem)] leading-[1.02] tracking-tight text-ivory-50"
          />

          <p className="mt-5 text-base md:text-lg text-ivory-50/70 leading-relaxed max-w-md">
            {p.subtext}
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:gap-3">
            <Link
              href={p.primaryCta.href as never}
              className="inline-flex justify-center items-center bg-gold-500 text-ink-900 px-6 py-4
                         text-[13px] uppercase tracking-[0.16em] font-semibold hover:bg-gold-400 transition-colors"
            >
              {p.primaryCta.label} →
            </Link>
            <Link
              href={p.secondaryCta.href as never}
              className="inline-flex justify-center items-center border border-gold-500/50 text-ivory-50 px-6 py-4
                         text-[13px] uppercase tracking-[0.16em] font-semibold hover:bg-gold-500 hover:text-ink-900
                         hover:border-gold-500 transition-colors"
            >
              {p.secondaryCta.label}
            </Link>
          </div>

          {/* Trust row — horizontal scroll on small screens */}
          <div className="mt-7 -mx-6 px-6 md:mx-0 md:px-0 overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-4 whitespace-nowrap text-sm text-ivory-50/65">
              <span className="flex items-center gap-1.5 shrink-0">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={13} className="fill-gold-500 stroke-gold-500" aria-hidden />
                ))}
                <span className="ml-1 font-medium text-ivory-50">{p.rating.toFixed(1)}</span>
                <span className="text-ivory-50/55">({p.reviewCount})</span>
              </span>
              <span className="h-3 w-px bg-gold-500/30 shrink-0" />
              <span className="text-xs uppercase tracking-[0.16em] text-gold-500 shrink-0">GMC ✓</span>
              <span className="text-xs uppercase tracking-[0.16em] text-gold-500 shrink-0">CQC ✓</span>
              <span className="text-xs uppercase tracking-[0.16em] text-gold-500 shrink-0">Harley St-trained</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
