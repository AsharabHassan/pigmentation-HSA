import { Container } from "../primitives/Container";
import { Star } from "lucide-react";

/**
 * Trust signals under the hero — designed for scan-readability.
 * Reviews badge uses an inlined Google "G" mark to signal authenticity.
 */
export function TrustStrip() {
  return (
    <section className="bg-surface-100 border-y border-surface-200">
      <Container width="wide" className="py-8 md:py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 text-center">
          {/* 1. Google reviews */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5">
              <GoogleG size={18} />
              <span className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={12} className="fill-clay-500 stroke-clay-500" aria-hidden />
                ))}
              </span>
              <span className="font-display text-xl md:text-2xl text-ink-900 ml-1 tabular-nums">4.9</span>
            </div>
            <p className="mt-1 text-xs md:text-sm text-ink-500 uppercase tracking-[0.12em]">
              243 Google reviews
            </p>
          </div>

          {/* 2. Treatment volume */}
          <div className="flex flex-col items-center">
            <p className="font-display text-2xl md:text-3xl text-ink-900 tabular-nums">10,000+</p>
            <p className="mt-1 text-xs md:text-sm text-ink-500 uppercase tracking-[0.12em]">
              Treatments performed
            </p>
          </div>

          {/* 3. Positioning */}
          <div className="flex flex-col items-center">
            <p className="font-display text-2xl md:text-3xl text-ink-900 leading-none">Leading</p>
            <p className="mt-1 text-xs md:text-sm text-ink-500 uppercase tracking-[0.12em]">
              Glasgow aesthetic clinic
            </p>
          </div>

          {/* 4. Financing */}
          <div className="flex flex-col items-center">
            <p className="font-display text-2xl md:text-3xl text-ink-900 tabular-nums">0%</p>
            <p className="mt-1 text-xs md:text-sm text-ink-500 uppercase tracking-[0.12em]">
              Interest financing · 3 plans
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

/** Inline Google "G" mark — used to signal that the review rating is from Google. */
function GoogleG({ size = 16 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 48 48"
      aria-label="Google reviews"
      role="img"
    >
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C33.6 6.1 29 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C33.6 6.1 29 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5 0 9.6-1.9 13-5l-6-5.1c-2 1.4-4.5 2.2-7 2.2-5.3 0-9.7-3.4-11.3-8L6 32.5C9.3 39.5 16.1 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.4-4.2 5.9l6 5.1c-.4.4 6.5-4.8 6.5-15-.1-1.3-.2-2.4-.4-3.5z" />
    </svg>
  );
}
