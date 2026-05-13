"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Chapter { id: string; label: string }

const chapters: Chapter[] = [
  { id: "hero",          label: "Opening" },
  { id: "treatments",    label: "Concerns" },
  { id: "pigmentation-map", label: "Cartography" },
  { id: "how-it-works",  label: "Mechanism" },
  { id: "timeline",      label: "Chapters" },
  { id: "doctor",        label: "Practitioner" },
  { id: "pricing",       label: "Investment" },
  { id: "faq",           label: "Reference" },
];

/**
 * Persistent left rail — like a book's chapter index.
 * Highlights current section via IntersectionObserver.
 * Hidden on small screens, narrow vertical strip on lg+.
 */
export function ChapterRail() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const ids = chapters.map(c => c.id);
    const els = ids.map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;

    const io = new IntersectionObserver((entries) => {
      const visible = entries.filter(e => e.isIntersecting)
                             .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) {
        const idx = ids.indexOf(visible.target.id);
        if (idx >= 0) setActive(idx);
      }
    }, { rootMargin: "-30% 0% -50% 0%", threshold: [0.1, 0.5, 0.9] });

    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <nav aria-label="Chapters"
         className="hidden lg:flex fixed left-0 top-0 bottom-0 z-30 flex-col items-start justify-center pl-6 pointer-events-none">
      <div className="flex flex-col gap-5 pointer-events-auto">
        {chapters.map((c, i) => {
          const isActive = i === active;
          return (
            <a key={c.id} href={`#${c.id}`}
               aria-current={isActive}
               className="group relative flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.32em]">
              <span className={`relative h-px transition-all duration-500 ${isActive ? "w-9 bg-gold-400" : "w-3 bg-gold-500/40 group-hover:bg-gold-500/80 group-hover:w-6"}`} />
              <span className={`tabular-nums transition-colors duration-300 ${isActive ? "text-gold-400" : "text-gold-500/35 group-hover:text-gold-500/70"}`}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <motion.span
                initial={false}
                animate={{
                  opacity: isActive ? 1 : 0,
                  x: isActive ? 0 : -4,
                }}
                transition={{ duration: 0.3 }}
                className={`pointer-events-none ${isActive ? "text-ivory-50/85" : "text-transparent"}`}
              >
                {c.label}
              </motion.span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
