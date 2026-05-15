"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "../primitives/Container";
import { CalendarCheck, Check } from "lucide-react";

interface FinanceOption {
  brand: string;
  logo: React.ReactNode;
  tagline: string;
  features: string[];
  footnote?: string;
  featured?: boolean;
}

const options: FinanceOption[] = [
  {
    brand: "Klarna",
    logo: <KlarnaMark />,
    tagline: "Split any treatment into 3 interest-free payments.",
    features: [
      "0% interest, no fees",
      "Best for single sessions up to £500",
      "Instant approval at checkout",
    ],
  },
  {
    brand: "Clearpay",
    logo: <ClearpayMark />,
    tagline: "Pay in 4 fortnightly instalments. Always interest-free.",
    features: [
      "0% interest, no fees if paid on time",
      "Best for single sessions and shorter courses",
      "Instant approval at checkout",
    ],
  },
  {
    brand: "Ideal4Finance",
    logo: <Ideal4Mark />,
    tagline: "Medical loans for full treatment courses — built for clinic spend.",
    features: [
      "0% interest on loans up to £1,000",
      "Longer-term plans for the full course",
      "Soft credit check, no impact on score",
    ],
    footnote: "Subject to status. Final terms confirmed at consultation.",
    featured: true,
  },
];

export function FinancingSection() {
  return (
    <section id="financing" className="bg-surface-50 py-20 md:py-28">
      <Container width="wide">
        <div className="text-center mb-12 md:mb-16 max-w-2xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.18em] text-clay-500 font-semibold mb-3">
            Pay in your own time
          </p>
          <h2 className="font-display text-4xl md:text-6xl text-ink-900 leading-[1.05]">
            Three interest-free<br />
            <span className="text-clay-600">ways to spread the cost.</span>
          </h2>
          <p className="mt-5 text-base md:text-lg text-ink-700">
            We never want price to be the reason someone delays the right protocol. Pick the plan that fits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 max-w-5xl mx-auto">
          {options.map((opt, i) => (
            <motion.article
              key={opt.brand}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={
                opt.featured
                  ? "relative bg-ink-900 text-surface-50 rounded-2xl p-8 md:p-10 md:scale-[1.04] shadow-[0_20px_60px_-20px_rgba(26,22,18,0.3)]"
                  : "relative bg-surface-100 rounded-2xl p-8 md:p-10 border border-surface-200"
              }
            >
              {opt.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-clay-500 text-ink-900
                                 text-[10px] uppercase tracking-[0.18em] font-semibold
                                 px-4 py-1.5 rounded-full">
                  Best for full courses
                </span>
              )}

              <div className="h-10 flex items-center mb-6">{opt.logo}</div>

              <p className={`font-display text-xl md:text-2xl leading-snug ${opt.featured ? "text-surface-50" : "text-ink-900"}`}>
                {opt.tagline}
              </p>

              <ul className={`mt-6 space-y-2.5 text-sm ${opt.featured ? "text-surface-50/85" : "text-ink-700"}`}>
                {opt.features.map(f => (
                  <li key={f} className="flex gap-2.5">
                    <Check size={16} className={`shrink-0 mt-0.5 ${opt.featured ? "text-clay-300" : "text-clay-500"}`} aria-hidden />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {opt.footnote && (
                <p className={`mt-6 text-xs ${opt.featured ? "text-surface-50/60" : "text-ink-500"} leading-relaxed`}>
                  {opt.footnote}
                </p>
              )}
            </motion.article>
          ))}
        </div>

        <div className="mt-12 md:mt-16 flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4 text-center">
          <p className="text-ink-700 text-sm md:text-base max-w-md">
            Not sure which fits? The team will walk you through it in your 10-minute consultation.
          </p>
          <Link
            href={"#book" as never}
            className="inline-flex items-center gap-2 bg-clay-500 text-ink-900
                       px-5 py-3.5 rounded-full text-[12px] uppercase tracking-[0.12em] font-semibold
                       hover:bg-clay-600 transition-colors whitespace-nowrap"
          >
            <CalendarCheck size={15} aria-hidden />
            Book free 10-min consult →
          </Link>
        </div>

        <p className="mt-10 max-w-3xl mx-auto text-center text-xs text-ink-500 leading-relaxed">
          Klarna, Clearpay, and Ideal4Finance are independent third-party providers. Eligibility, late-payment policies, and credit checks are governed by each provider&apos;s own terms. Harley Street Aesthetics does not provide credit directly.
        </p>
      </Container>
    </section>
  );
}

/* ─── Brand marks (typographic placeholders; swap for licensed art at launch) ─── */

function KlarnaMark() {
  return (
    <span
      className="inline-flex items-center justify-center px-3 py-1.5 rounded-md font-bold text-[15px] tracking-tight"
      style={{ backgroundColor: "#FFA8CD", color: "#17120F", letterSpacing: "-0.02em" }}
    >
      Klarna.
    </span>
  );
}

function ClearpayMark() {
  return (
    <span
      className="inline-flex items-center justify-center px-3 py-1.5 rounded-md font-semibold text-[14px] tracking-tight"
      style={{ backgroundColor: "#B2FCE4", color: "#0E1320" }}
    >
      Clearpay
    </span>
  );
}

function Ideal4Mark() {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-bold text-[14px]"
      style={{ backgroundColor: "#0F2E5C", color: "#FFFFFF" }}
    >
      <span style={{ color: "#3FB6F1" }}>i4</span>
      <span className="opacity-90">Finance</span>
    </span>
  );
}
