"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "../primitives/Container";
import { CalendarCheck } from "lucide-react";

export interface DoctorProfile {
  name: string;
  credentials: string;
  portrait: string;
  portraitAlt: string;
  philosophy: string;
  yearsOfPractice: number;
  bio?: string;
}

interface Props {
  /** Multi-doctor team. If a single legacy `doctor` is passed via spread, pass [doctor] here. */
  doctors: DoctorProfile[];
  sectionKicker?: string;
  headline?: string;
  intro?: string;
  /** Inline CTA at section foot. */
  ctaLabel?: string;
  ctaHref?: string;
}

export function DoctorSection({
  doctors,
  sectionKicker = "The doctors behind the protocol",
  headline,
  intro,
  ctaLabel = "Book your free 10-min consultation →",
  ctaHref = "#book",
}: Props) {
  const isTeam = doctors.length > 1;
  const computedHeadline = headline ?? (isTeam ? "Meet your doctors." : `Hi — I'm ${doctors[0]?.name.replace(/^(Dr\.|Mr\.|Mrs\.|Ms\.)\s*/, "")}.`);
  const totalYears = doctors.reduce((sum, d) => sum + d.yearsOfPractice, 0);
  const computedIntro = intro ?? (isTeam
    ? `${totalYears}+ years of combined experience across aesthetic medicine, dermatology, and plastic surgery — calibrated to your skin type, your concern, and your goal.`
    : doctors[0]?.bio);

  return (
    <section id="doctor" className="bg-surface-100 py-20 md:py-28">
      <Container width="wide">
        <div className="max-w-3xl mb-12 md:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-[11px] uppercase tracking-[0.18em] text-clay-500 font-semibold"
          >
            {sectionKicker}
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mt-4 font-display text-4xl md:text-6xl text-ink-900 leading-[1.05]"
          >
            {computedHeadline}
          </motion.h2>

          {computedIntro && (
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="mt-6 text-ink-700 leading-relaxed max-w-2xl text-base md:text-lg"
            >
              {computedIntro}
            </motion.p>
          )}
        </div>

        <div className={`grid grid-cols-1 ${doctors.length === 2 ? "md:grid-cols-2" : doctors.length >= 3 ? "md:grid-cols-2 lg:grid-cols-3" : ""} gap-8 md:gap-10`}>
          {doctors.map((d, i) => (
            <DoctorCard key={d.name} doctor={d} idx={i} solo={!isTeam} />
          ))}
        </div>

        {ctaLabel && ctaHref && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 md:mt-16 flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-8 border-t border-surface-200"
          >
            <p className="text-ink-700 text-sm md:text-base max-w-md">
              Speak to the team in ten focused minutes — they&apos;ll review your skin, walk through your options, and quote you transparently.
            </p>
            <Link
              href={ctaHref as never}
              className="group inline-flex items-center gap-2 bg-clay-500 text-ink-900
                         px-5 py-3.5 rounded-full text-[12px] uppercase tracking-[0.12em] font-semibold
                         hover:bg-clay-600 transition-colors whitespace-nowrap"
            >
              <CalendarCheck size={15} aria-hidden />
              {ctaLabel}
            </Link>
          </motion.div>
        )}
      </Container>
    </section>
  );
}

function DoctorCard({ doctor: d, idx, solo }: { doctor: DoctorProfile; idx: number; solo: boolean }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      <div className="relative">
        <div aria-hidden className="absolute -inset-2 bg-clay-100/50 rounded-3xl -rotate-1" />
        <div className={`relative ${solo ? "aspect-[4/5]" : "aspect-[4/5] md:aspect-[3/4]"} rounded-2xl overflow-hidden ring-1 ring-surface-200`}>
          <Image
            src={d.portrait}
            alt={d.portraitAlt}
            fill
            sizes={solo ? "(max-width: 768px) 90vw, 45vw" : "(max-width: 768px) 90vw, 40vw"}
            className="object-cover"
          />
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-display text-2xl md:text-3xl text-ink-900 leading-tight">
          {d.name}
        </h3>
        <p className="mt-1 text-sm text-moss-700 font-medium">{d.credentials}</p>

        <p className="mt-5 font-display italic text-lg md:text-xl text-ink-900 leading-snug border-l-2 border-clay-500 pl-4">
          &ldquo;{d.philosophy}&rdquo;
        </p>

        {d.bio && (
          <p className="mt-4 text-ink-700 leading-relaxed text-sm md:text-base">
            {d.bio}
          </p>
        )}
      </div>
    </motion.article>
  );
}
