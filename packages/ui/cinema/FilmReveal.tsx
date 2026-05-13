"use client";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  className?: string;
  once?: boolean;
}

/**
 * Cinematic reveal — slow, deliberate fade-up on scroll, like a film cut.
 * Stagger via `delay`. Reduced motion users get instant opacity.
 */
export function FilmReveal({
  children, delay = 0, y = 40, duration = 0.9, className, once = true,
}: Props) {
  const reduced = useReducedMotion();
  const variants: Variants = reduced
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.15 } } }
    : {
        hidden: { opacity: 0, y, filter: "blur(8px)" },
        show: {
          opacity: 1, y: 0, filter: "blur(0px)",
          transition: { duration, delay, ease: [0.16, 1, 0.3, 1] },
        },
      };

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount: 0.2 }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerProps {
  children: ReactNode;
  stagger?: number;
  className?: string;
}

/** Stagger child <FilmReveal /> automatically. */
export function FilmStagger({ children, stagger = 0.12, className }: StaggerProps) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: reduced ? 0 : stagger } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
