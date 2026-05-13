"use client";
import Image from "next/image";
import { motion } from "framer-motion";
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
    <section className="relative bg-surface-black overflow-hidden border-t border-gold-500/15">
      <Container width="wide" className="relative pt-20 md:pt-28 pb-20 md:pb-28">
        <div className="flex items-baseline justify-between gap-4 mb-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold-500/70">
            Ch. VI · Patient Stories
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold-500/35 tabular-nums">
            {String(items.length).padStart(2, "0")} cases on record
          </p>
        </div>
        <span aria-hidden className="block h-px bg-gold-500/15" />

        <motion.h2
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 font-display italic text-[clamp(2.5rem,11vw,7rem)] leading-[0.9] text-ivory-50"
        >
          In their words,<br />
          <span className="text-gold-400">not ours.</span>
        </motion.h2>

        <div className="mt-20 md:mt-28 flex flex-col gap-28 md:gap-40">
          {items.map((t, i) => (
            <Case key={i} item={t} index={i} reverse={i % 2 === 1} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function Case({ item: t, index, reverse }: { item: Testimonial; index: number; reverse: boolean }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="relative grid grid-cols-12 gap-4 md:gap-6"
    >
      <div className={`col-span-12 md:col-span-2 ${reverse ? "md:order-3 md:text-right" : "md:order-1"}`}>
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold-500/55">
          Case
        </p>
        <p className="mt-2 font-display italic text-gold-400 text-6xl md:text-7xl leading-none tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </p>
        <span aria-hidden className="mt-4 block w-12 h-px bg-gold-500/40" />
      </div>

      <div className="col-span-12 md:col-span-6 md:order-2">
        <blockquote className="font-display italic text-[clamp(1.5rem,4vw,2.75rem)] leading-[1.1] text-ivory-50">
          <span aria-hidden className="text-gold-400/40">&ldquo;</span>{t.quote}<span aria-hidden className="text-gold-400/40">&rdquo;</span>
        </blockquote>
        <footer className="mt-8 flex items-center gap-5">
          <span className="text-[11px] uppercase tracking-[0.24em] text-gold-500 font-semibold">
            {t.firstName} · {t.city}
          </span>
          <span aria-hidden className="flex-1 h-px bg-gold-500/20" />
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-gold-500/45 tabular-nums">
            ★ {t.stars}/5
          </span>
        </footer>
      </div>

      <div className={`col-span-12 md:col-span-4 ${reverse ? "md:order-1" : "md:order-3"}`}>
        <div className="relative max-w-[300px] md:max-w-none ml-auto">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-gold-500/55 mb-2 flex items-baseline justify-between">
            <span>Plate {String(index + 1).padStart(2, "0")}.{reverse ? "B" : "A"}</span>
            <span className="tabular-nums">Wk 0 → Wk 12</span>
          </p>
          <div className="relative grid grid-cols-2 gap-px bg-gold-500/25 ring-1 ring-gold-500/20">
            <Image src={t.beforeSrc} alt={`${t.firstName}: before`} width={400} height={400}
                   className="object-cover w-full aspect-square" />
            <Image src={t.afterSrc}  alt={`${t.firstName}: after`}  width={400} height={400}
                   className="object-cover w-full aspect-square" />
          </div>
        </div>
      </div>
    </motion.article>
  );
}
