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
      headlineMain="Find the right peel"
      headlineAccent="for your skin."
      intro="Upload a clear selfie. Our AI reads your texture, tone, and concern depth — then matches a peel grade. About 5 seconds."
      treatment="chemical-peel"
      leadSource="lp-chemical-peel-london-scanner"
    />
  );
}

export function ClientMechanismAnimation({ steps }: { steps: MechanismStep[] }) {
  return (
    <MechanismAnimation
      sectionKicker="How a medical peel works"
      headlineMain="What's actually happening"
      headlineAccent="when you peel."
      intro="One section of skin. Three states. Tap a stage to see the mechanism behind a medical-grade peel."
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
      sectionKicker="Your 12 weeks"
      headlineMain="A real peel series,"
      headlineAccent="checkpoint by checkpoint."
      intro="Six checkpoints from the first peel to the final review — what changes, when you'll see it, and what's happening in each session."
      metricValues={metricValues}
      metricDirection="ascending"
      metricLabel="Tone & texture score"
      outroNote="Outcomes vary by skin type, concern depth, and SPF adherence. Your free consultation refines the plan to your case."
    />
  );
}

export function ClientBookingSection() {
  return <BookingSection />;
}
