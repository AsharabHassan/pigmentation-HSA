"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "../primitives/Container";
import { Atmosphere } from "../cinema/Atmosphere";
import { FilmReveal } from "../cinema/FilmReveal";

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
    <section id="doctor" className="relative min-h-[100dvh] flex items-center bg-surface-black overflow-hidden border-y border-gold-500/15">
      <Atmosphere variant="spotlight-corner" intensity={0.9} />

      <Container width="wide" className="relative grid grid-cols-1 md:grid-cols-[45%_55%] gap-12 md:gap-16 items-center py-20 md:py-0">
        <motion.div
          initial={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative aspect-[4/5] w-full max-w-[440px] mx-auto md:max-w-none"
        >
          <div aria-hidden className="absolute -inset-4 bg-gradient-to-br from-gold-500/25 to-transparent blur-2xl" />
          <div className="relative w-full h-full ring-1 ring-gold-500/40 bg-surface-charcoal overflow-hidden">
            <Image
              src={p.portrait} alt={p.portraitAlt} fill
              sizes="(max-width: 768px) 90vw, 45vw"
              className="object-cover"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
            <div className="absolute bottom-0 inset-x-0 p-6 md:p-8 z-10">
              <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold-400/80">
                Clinical Director
              </p>
              <p className="mt-1 font-display italic text-2xl md:text-3xl text-ivory-50">
                {p.name}
              </p>
            </div>
          </div>
        </motion.div>

        <div>
          <FilmReveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-gold-500">
              <span className="inline-block w-6 h-px bg-gold-500 align-middle mr-3" />
              The Doctor
            </p>
          </FilmReveal>

          <FilmReveal delay={0.15}>
            <h2 className="mt-6 font-display italic text-[clamp(2.25rem,7vw,4rem)] leading-[0.95] text-ivory-50">
              {p.yearsOfPractice}+ years.<br/>
              <span className="text-gold-400">One protocol, refined.</span>
            </h2>
          </FilmReveal>

          <FilmReveal delay={0.3}>
            <p className="mt-5 text-gold-500 text-[11px] uppercase tracking-[0.22em]">{p.credentials}</p>
          </FilmReveal>

          <FilmReveal delay={0.45}>
            <blockquote className="mt-10 font-display italic text-[clamp(1.5rem,3.5vw,2.25rem)] leading-snug text-ivory-50/90 relative">
              <span aria-hidden className="absolute -left-3 -top-4 text-gold-400/40 text-5xl font-display italic">&ldquo;</span>
              {p.philosophy}
            </blockquote>
          </FilmReveal>
        </div>
      </Container>
    </section>
  );
}
