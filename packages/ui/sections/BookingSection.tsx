"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Container } from "../primitives/Container";
import { Clock, MapPin, ShieldCheck } from "lucide-react";

interface Props {
  calendarUrl?: string;
}

const FALLBACK_URL =
  process.env.NEXT_PUBLIC_GHL_CALENDAR_URL ??
  "https://api.leadconnectorhq.com/widget/booking/PLACEHOLDER";

export function BookingSection({ calendarUrl = FALLBACK_URL }: Props) {
  const [height, setHeight] = useState(820);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
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
    <section id="book" className="bg-surface-50 py-20 md:py-28">
      <Container width="wide">
        <div className="grid grid-cols-1 md:grid-cols-[40%_60%] gap-10 md:gap-12 items-start">
          {/* Left: intro */}
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-clay-500 font-semibold mb-3">
              Free online consultation
            </p>
            <h2 className="font-display text-4xl md:text-6xl text-ink-900 leading-[1.05]">
              Pick a time<br />
              that works.
            </h2>
            <p className="mt-6 text-base md:text-lg text-ink-700 max-w-md leading-relaxed">
              Sixty minutes with Dr. Ahmad over video. He&apos;ll review your skin, walk you through the protocol options, and share a transparent price. No card, no pressure, no upsell.
            </p>

            <ul className="mt-8 space-y-4 text-sm text-ink-700">
              <li className="flex items-start gap-3">
                <Clock size={18} className="text-clay-500 mt-0.5 shrink-0" aria-hidden />
                <span><strong className="text-ink-900">60 minutes</strong> · online via secure video link</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-clay-500 mt-0.5 shrink-0" aria-hidden />
                <span><strong className="text-ink-900">Anywhere</strong> · UK and international patients welcome</span>
              </li>
              <li className="flex items-start gap-3">
                <ShieldCheck size={18} className="text-moss-500 mt-0.5 shrink-0" aria-hidden />
                <span><strong className="text-ink-900">GDPR-compliant</strong> · we never share your details</span>
              </li>
            </ul>
          </div>

          {/* Right: calendar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-2xl overflow-hidden ring-1 ring-surface-200 bg-surface-50"
          >
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
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

function CalendarPlaceholder() {
  return (
    <div className="aspect-[4/5] md:aspect-[4/3] bg-surface-100 text-ink-900 flex flex-col items-center justify-center p-10 text-center">
      <p className="text-[11px] uppercase tracking-[0.18em] text-clay-500 font-semibold mb-4">
        Calendar pending
      </p>
      <p className="font-display text-2xl md:text-3xl text-ink-900 max-w-md leading-tight">
        Your GoHighLevel calendar will live here.
      </p>
      <p className="mt-4 text-sm text-ink-700 max-w-md leading-relaxed">
        Set <code className="bg-surface-200 px-2 py-0.5 rounded text-[12px] font-mono">NEXT_PUBLIC_GHL_CALENDAR_URL</code> in your env to your GHL booking widget URL.
      </p>
      <a
        href="mailto:bookings@harleystreetmedics.clinic?subject=Consultation%20Request"
        className="mt-8 inline-flex items-center bg-clay-500 text-surface-50 px-6 py-3
                   text-[12px] uppercase tracking-[0.12em] font-semibold rounded-full
                   hover:bg-clay-600 transition-colors"
      >
        Email us instead →
      </a>
    </div>
  );
}
