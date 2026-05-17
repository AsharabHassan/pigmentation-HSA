import Link from "next/link";
import { CalendarCheck } from "lucide-react";
import { Container } from "../primitives/Container";

interface Props {
  message?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

/**
 * Always-on conversion reminder above the navbar.
 * Server-rendered (no client state) so it shows on first paint.
 */
export function AnnouncementRibbon({
  message = "Free 10-minute online consultation with the Harley Street Aesthetics team",
  ctaLabel = "Book now",
  ctaHref = "#book",
}: Props = {}) {
  return (
    <div className="bg-ink-900 text-surface-50 text-[12px] md:text-[13px]">
      <Container width="wide" className="py-2 md:py-2.5 flex items-center justify-center gap-3 md:gap-4 text-center">
        <CalendarCheck size={14} className="text-clay-300 shrink-0 hidden sm:inline" aria-hidden />
        <span className="leading-snug">
          {message}
        </span>
        <span aria-hidden className="text-surface-50/30 hidden sm:inline">·</span>
        <Link
          href={ctaHref as never}
          className="inline-flex items-center gap-1.5 text-clay-300 hover:text-clay-100 font-semibold whitespace-nowrap transition-colors"
        >
          {ctaLabel}
          <span aria-hidden>→</span>
        </Link>
      </Container>
    </div>
  );
}
