"use client";
import dynamic from "next/dynamic";
import type { TimelineStage } from "@ui/timeline/TimelineScrubber";
import type { MechanismStep } from "@ui/mechanism/MechanismAnimation";

const SelfieScanner = dynamic(
  () => import("@ui/scanner/SelfieScanner").then(m => ({ default: m.SelfieScanner })),
  { ssr: false, loading: () => <div className="min-h-[400px] bg-surface-100" /> },
);
const MechanismAnimation = dynamic(
  () => import("@ui/mechanism/MechanismAnimation").then(m => ({ default: m.MechanismAnimation })),
  { ssr: false, loading: () => <div className="min-h-[400px] bg-surface-50" /> },
);
const TimelineScrubberClient = dynamic(
  () => import("@ui/timeline/TimelineScrubber").then(m => ({ default: m.TimelineScrubber })),
  { ssr: false, loading: () => <div className="min-h-[400px] bg-surface-100" /> },
);
const BookingSection = dynamic(
  () => import("@ui/sections/BookingSection").then(m => ({ default: m.BookingSection })),
  { ssr: false, loading: () => <div className="min-h-[600px] bg-surface-100" /> },
);

export function ClientSelfieScanner() {
  return (
    <SelfieScanner
      sectionId="skin-scan"
      sectionKicker="AI skin scan · free"
      headlineMain="See what a drip course"
      headlineAccent="could do for your skin."
      intro="Upload a clear selfie. Our AI reads your tone, texture, and pigmentation pattern — then maps which drip protocol fits. About 5 seconds."
      treatment="skin-glow-drip"
      leadSource="lp-skin-glow-drip-glasgow-scanner"
    />
  );
}

export function ClientMechanismAnimation({ steps }: { steps: MechanismStep[] }) {
  return (
    <MechanismAnimation
      sectionKicker="How an IV glow drip works"
      headlineMain="Bypass the gut."
      headlineAccent="Reach the cell."
      intro="Three states. Tap a stage to see why IV delivery reaches your skin in a way creams and supplements cannot."
      steps={steps}
    />
  );
}

export function ClientTimelineScrubber({ stages, metricValues }: {
  stages: TimelineStage[]; metricValues: number[];
}) {
  return (
    <TimelineScrubberClient
      stages={stages}
      sectionKicker="Your 6 weeks"
      headlineMain="A real drip course,"
      headlineAccent="checkpoint by checkpoint."
      intro="Six checkpoints from baseline to the final review — what changes, when you'll see it, and what's happening in your bloodstream at each stage."
      metricValues={metricValues}
      metricDirection="ascending"
      metricLabel="Skin glow score"
      outroNote="Outcomes vary by skin type, baseline glutathione status, and lifestyle. Your free 10-min consultation calibrates the plan to your case."
    />
  );
}

export function ClientBookingSection() {
  return <BookingSection />;
}
