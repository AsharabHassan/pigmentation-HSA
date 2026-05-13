import { Container } from "../primitives/Container";

/**
 * Thin trust strip directly under the hero — credibility signals as a
 * horizontal scroll on mobile, evenly distributed on desktop.
 * No flashy media logos (avoids the "as seen in" cliché when those don't exist yet);
 * leans on verifiable credentials and metrics.
 */
export function TrustStrip() {
  const items = [
    { metric: "12,000+", label: "Treatments performed" },
    { metric: "14 yrs", label: "Doctor-led practice" },
    { metric: "I — VI", label: "Fitzpatrick range" },
    { metric: "£0", label: "Initial consultation" },
  ];

  return (
    <section className="bg-surface-100 border-y border-surface-200">
      <Container width="wide" className="py-8 md:py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 text-center">
          {items.map((it, i) => (
            <div key={i} className="flex flex-col items-center">
              <p className="font-display text-2xl md:text-3xl text-ink-900">{it.metric}</p>
              <p className="mt-1 text-xs md:text-sm text-ink-500 uppercase tracking-[0.12em]">
                {it.label}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
