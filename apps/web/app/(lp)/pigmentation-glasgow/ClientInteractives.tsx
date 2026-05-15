"use client";
import dynamic from "next/dynamic";
import type { TimelineStage } from "@ui/timeline/TimelineScrubber";

const SelfieScanner = dynamic(
  () => import("@ui/scanner/SelfieScanner").then(m => ({ default: m.SelfieScanner })),
  { ssr: false, loading: () => <div className="min-h-[400px] bg-surface-charcoal" /> },
);
const MechanismAnimation = dynamic(
  () => import("@ui/mechanism/MechanismAnimation").then(m => ({ default: m.MechanismAnimation })),
  { ssr: false, loading: () => <div className="min-h-[400px] bg-surface-black" /> },
);
const TimelineScrubberClient = dynamic(
  () => import("@ui/timeline/TimelineScrubber").then(m => ({ default: m.TimelineScrubber })),
  { ssr: false, loading: () => <div className="min-h-[400px] bg-surface-charcoal" /> },
);
const BookingSection = dynamic(
  () => import("@ui/sections/BookingSection").then(m => ({ default: m.BookingSection })),
  { ssr: false, loading: () => <div className="min-h-[600px] bg-surface-charcoal" /> },
);

export function ClientSelfieScanner() {
  return <SelfieScanner leadSource="lp-pigmentation-glasgow-scanner" />;
}
export function ClientMechanismAnimation() {
  return <MechanismAnimation />;
}
export function ClientTimelineScrubber({ stages }: { stages: TimelineStage[] }) {
  return <TimelineScrubberClient stages={stages} />;
}
export function ClientBookingSection() {
  return <BookingSection />;
}
