"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Container } from "../primitives/Container";

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
    <section className="bg-surface-50 py-20 md:py-28">
      <Container width="wide">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-clay-500 font-semibold mb-3">
              Real patients, Glasgow
            </p>
            <h2 className="font-display text-4xl md:text-6xl text-ink-900 leading-[1.05] max-w-3xl">
              You&apos;ve heard our promise.<br />
              Here&apos;s what they say.
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {items.map((t, i) => (
            <motion.article
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="bg-surface-100 rounded-2xl overflow-hidden border border-surface-200"
            >
              <div className="grid grid-cols-2 gap-0.5 bg-surface-200">
                <Image src={t.beforeSrc} alt={`${t.firstName} — before`} width={400} height={400}
                       className="object-cover w-full aspect-square" />
                <Image src={t.afterSrc} alt={`${t.firstName} — after`} width={400} height={400}
                       className="object-cover w-full aspect-square" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex gap-0.5">
                    {Array.from({ length: t.stars }).map((_, n) => (
                      <Star key={n} size={13} className="fill-clay-500 stroke-clay-500" aria-hidden />
                    ))}
                  </div>
                  <span className="text-xs text-ink-500">via Google</span>
                </div>
                <p className="text-ink-900 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                <p className="mt-4 text-sm text-ink-700 font-medium">
                  {t.firstName} <span className="text-ink-500 font-normal">— {t.city}</span>
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
}
