"use client";
import { useState } from "react";
import { QuizEngine } from "./QuizEngine";
import { LeadForm, type RevealPayload } from "./LeadForm";
import { ResultReveal } from "./ResultReveal";
import type { QuizAnswers } from "./state";

export function QuizSection() {
  const [phase, setPhase] = useState<"quiz" | "gate" | "revealed">("quiz");
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [reveal, setReveal] = useState<RevealPayload | null>(null);

  if (phase === "quiz") {
    return (
      <QuizEngine onComplete={a => { setAnswers(a); setPhase("gate"); }} />
    );
  }
  if (phase === "gate") {
    return (
      <section id="quiz" className="bg-ivory-100 py-24 md:py-32">
        <LeadForm answers={answers} onReveal={r => { setReveal(r); setPhase("revealed"); }} />
      </section>
    );
  }
  return <ResultReveal reveal={reveal!} answers={answers} />;
}
