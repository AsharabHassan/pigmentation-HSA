"use client";
import dynamic from "next/dynamic";
import type { TimelineStage } from "@ui/timeline/TimelineScrubber";

const SelfieScanner = dynamic(
  () => import("@ui/scanner/SelfieScanner").then(m => ({ default: m.SelfieScanner })),
  { ssr: false, loading: () => <div className="min-h-[400px] bg-ivory-100" /> },
);
const MechanismAnimation = dynamic(
  () => import("@ui/mechanism/MechanismAnimation").then(m => ({ default: m.MechanismAnimation })),
  { ssr: false, loading: () => <div className="min-h-[400px] bg-ivory-50" /> },
);
const TimelineScrubberClient = dynamic(
  () => import("@ui/timeline/TimelineScrubber").then(m => ({ default: m.TimelineScrubber })),
  { ssr: false, loading: () => <div className="min-h-[400px] bg-ivory-100" /> },
);
const QuizSection = dynamic(
  () => import("@ui/quiz/QuizSection").then(m => ({ default: m.QuizSection })),
  { ssr: false, loading: () => <div className="min-h-[600px] bg-ivory-100" /> },
);

export function ClientSelfieScanner() {
  return <SelfieScanner />;
}
export function ClientMechanismAnimation() {
  return <MechanismAnimation />;
}
export function ClientTimelineScrubber({ stages }: { stages: TimelineStage[] }) {
  return <TimelineScrubberClient stages={stages} />;
}
export function ClientQuizSection() {
  return <QuizSection />;
}
