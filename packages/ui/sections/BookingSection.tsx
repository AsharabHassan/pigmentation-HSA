"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Container } from "../primitives/Container";
import { FilmReveal } from "../cinema/FilmReveal";
import { Atmosphere } from "../cinema/Atmosphere";

interface Props {
  /**
   * GoHighLevel calendar embed URL.
   * Format: https://api.leadconnectorhq.com/widget/booking/<calendar-id>
   * Set NEXT_PUBLIC_GHL_CALENDAR_URL in env to override the placeholder.
   */
  calendarUrl?: string;
}

const FALLBACK_URL =
  process.env.NEXT_PUBLIC_GHL_CALENDAR_URL ??
  "https://api.leadconnectorhq.com/widget/booking/PLACEHOLDER";

/**
 * "Book your free consultation" — embeds the clinic's GoHighLevel calendar.
 * The GHL widget script auto-resizes the iframe; we listen for its
 * postMessage to keep height in sync if the script isn't present.
 */
export function BookingSection({ calendarUrl = FALLBACK_URL }: Props) {
  const [height, setHeight] = useState(820);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      // GHL widget posts { type: "MSG_BOOKING_LOADED" | "MSG_CALENDAR_DIMENSIONS", height }
      if (typeof e.data !== "object" || !e.data) return;
      const data = e.data as { type?: string; height?: number };
      if (typeof data.height === "number" && data.height > 200 && data.height < 4000) {
        setHeight(data.height);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const isPlaceholder = calendarUrl.includes("PLACEHOLDER");

  return (
    <section id="book" className="relative bg-surface-charcoal overflow-hidden border-t border-gold-500/15">
      <Atmosphere variant="halo" intensity={0.4} />

      <Container width="wide" className="relative pt-20 md:pt-28 pb-20 md:pb-28">
        {/* Chapter header */}
        <div className="flex items-baseline justify-between gap-4 mb-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold-500/70">
            Ch. VIII · Free Consultation
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold-500/35 tabular-nums">
            60 min · online · £0
          </p>
        </div>
        <span aria-hidden className="block h-px bg-gold-500/15" />

        <FilmReveal>
          <h2 className="mt-10 font-display italic text-[clamp(2.5rem,11vw,7rem)] leading-[0.9] text-ivory-50 max-w-5xl">
            Book your free<br />
            <span className="text-gold-400">online consultation.</span>
          </h2>
        </FilmReveal>

        <FilmReveal delay={0.15}>
          <p className="mt-6 text-base md:text-lg text-ivory-50/65 max-w-2xl leading-relaxed">
            Pick a time. We&apos;ll send a video link. Dr. Ahmad reviews your skin, walks you through the protocol, and shares a transparent pricing breakdown — no pressure.
          </p>
        </FilmReveal>

        {/* Calendar embed */}
        <FilmReveal delay={0.3}>
          <div className="mt-12 md:mt-16 bg-ivory-50 ring-1 ring-gold-500/30 overflow-hidden">
            {isPlaceholder ? (
              <CalendarPlaceholder />
            ) : (
              <iframe
                src={calendarUrl}
                title="Book Free Consultation"
                style={{ width: "100%", height: `${height}px`, border: 0 }}
                scrolling="no"
                allow="payment"
              />
            )}
          </div>
        </FilmReveal>

        {/* Trust strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] uppercase tracking-[0.22em] font-mono text-gold-500/60"
        >
          <span>Doctor-led</span>
          <span className="text-gold-500/20">·</span>
          <span>GMC registered</span>
          <span className="text-gold-500/20">·</span>
          <span>No card required</span>
          <span className="text-gold-500/20">·</span>
          <span>Free re-book</span>
        </motion.div>
      </Container>
    </section>
  );
}

function CalendarPlaceholder() {
  return (
    <div className="aspect-[16/10] bg-ivory-50 text-ink-900 flex flex-col items-center justify-center p-12 text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-gold-600 mb-4">
        Calendar pending
      </p>
      <p className="font-display italic text-2xl md:text-3xl text-ink-900 max-w-md leading-tight">
        Your GoHighLevel calendar will appear here.
      </p>
      <p className="mt-4 text-sm text-ink-700/70 max-w-md font-mono leading-relaxed">
        Set <code className="bg-ink-900/10 px-2 py-0.5 text-[11px]">NEXT_PUBLIC_GHL_CALENDAR_URL</code> in your env to your GHL booking widget URL — e.g.<br />
        <span className="text-ink-900/80">https://api.leadconnectorhq.com/widget/booking/<em>your-calendar-id</em></span>
      </p>
      <a
        href="mailto:bookings@harleystreetmedics.clinic?subject=Consultation%20Request"
        className="mt-8 inline-flex items-center bg-ink-900 text-ivory-50 px-6 py-3 text-[11px] uppercase tracking-[0.24em] font-semibold hover:bg-aubergine-900 transition-colors"
      >
        Email us instead →
      </a>
    </div>
  );
}
