"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "../primitives/Container";

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
    <section id="doctor" className="bg-surface-100 py-20 md:py-28">
      <Container width="wide" className="grid grid-cols-1 md:grid-cols-[42%_58%] gap-10 md:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div aria-hidden className="absolute -inset-3 bg-clay-100/50 rounded-3xl -rotate-1" />
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden ring-1 ring-surface-200">
            <Image
              src={p.portrait} alt={p.portraitAlt} fill
              sizes="(max-width: 768px) 90vw, 42vw"
              className="object-cover"
            />
          </div>
        </motion.div>

        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-[11px] uppercase tracking-[0.18em] text-clay-500 font-semibold"
          >
            The doctor behind the protocol
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-4 font-display text-4xl md:text-6xl text-ink-900 leading-[1.05]"
          >
            Hi — I&apos;m <span className="text-clay-600">{p.name.replace("Dr. ", "")}</span>.
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-6 space-y-4 text-ink-700 leading-relaxed max-w-xl"
          >
            <p>
              {p.yearsOfPractice}+ years in aesthetic medicine. I built this protocol because the patients who came to me had usually tried everything — creams, peels, IPL elsewhere — and were tired of being told their pigmentation was &ldquo;just hereditary&rdquo;.
            </p>
            <p className="font-display italic text-xl md:text-2xl text-ink-900 leading-snug">
              &ldquo;{p.philosophy}&rdquo;
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-500"
          >
            <span className="text-moss-700 font-medium">{p.credentials}</span>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
