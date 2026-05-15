"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "../primitives/Container";
import { BeforeAfterSlider } from "./BeforeAfterSlider";
import { DynamicHeadline } from "./DynamicHeadline";
import type { HeadlineRule } from "./headline-map";
import { Star, ShieldCheck } from "lucide-react";

function GoogleG({ size = 16 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 48 48" aria-label="Google" role="img">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C33.6 6.1 29 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C33.6 6.1 29 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5 0 9.6-1.9 13-5l-6-5.1c-2 1.4-4.5 2.2-7 2.2-5.3 0-9.7-3.4-11.3-8L6 32.5C9.3 39.5 16.1 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.4-4.2 5.9l6 5.1c-.4.4 6.5-4.8 6.5-15-.1-1.3-.2-2.4-.4-3.5z" />
    </svg>
  );
}

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
  headlineRules?: HeadlineRule[];
}

export function Hero(p: HeroProps) {
  return (
    <section id="hero" className="relative bg-surface-50">
      <Container width="wide" className="pt-8 pb-16 md:pt-16 md:pb-24
                                          grid grid-cols-1 md:grid-cols-[55%_45%]
                                          gap-10 md:gap-16 items-center">
        {/* Copy — first on mobile, left on desktop */}
        <div className="order-1 md:order-1">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-clay-500 font-semibold"
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-clay-500" />
            {p.eyebrow}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <DynamicHeadline
              fallback={p.fallbackHeadline}
              rules={p.headlineRules}
              className="mt-5 font-display text-[clamp(2.5rem,7vw,4.5rem)] leading-[1.02] tracking-tight text-ink-900"
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-6 text-base md:text-lg text-ink-700 leading-relaxed max-w-md"
          >
            {p.subtext}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="mt-8 flex flex-col sm:flex-row gap-3"
          >
            <Link
              href={p.primaryCta.href as never}
              className="group inline-flex items-center justify-center gap-2 bg-clay-500 text-ink-900
                         px-6 py-4 text-[13px] uppercase tracking-[0.12em] font-semibold
                         rounded-full hover:bg-clay-600 transition-colors"
            >
              {p.primaryCta.label}
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
            <Link
              href={p.secondaryCta.href as never}
              className="inline-flex items-center justify-center gap-2 border border-ink-300 text-ink-900
                         px-6 py-4 text-[13px] uppercase tracking-[0.12em] font-semibold
                         rounded-full hover:border-ink-900 hover:bg-ink-900 hover:text-surface-50 transition-colors"
            >
              {p.secondaryCta.label}
            </Link>
          </motion.div>

          {/* Trust row — small, real signals */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-ink-500"
          >
            <span className="flex items-center gap-1.5">
              <GoogleG size={16} />
              <span className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className="fill-clay-500 stroke-clay-500" aria-hidden />
                ))}
              </span>
              <span className="font-semibold text-ink-900 ml-1">{p.rating.toFixed(1)}</span>
              <span className="text-ink-500">({p.reviewCount} Google reviews)</span>
            </span>
            <span className="flex items-center gap-1.5 text-moss-700">
              <ShieldCheck size={14} aria-hidden />
              <span className="font-medium">GMC registered</span>
            </span>
          </motion.div>
        </div>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="order-2 md:order-2 relative"
        >
          <div aria-hidden className="absolute -inset-3 bg-clay-100/40 rounded-3xl rotate-1" />
          <div className="relative rounded-2xl overflow-hidden ring-1 ring-surface-200">
            <BeforeAfterSlider
              beforeSrc={p.beforeSrc} afterSrc={p.afterSrc}
              beforeAlt={p.beforeAlt} afterAlt={p.afterAlt}
              beforeLabel={p.beforeLabel} afterLabel={p.afterLabel}
            />
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
