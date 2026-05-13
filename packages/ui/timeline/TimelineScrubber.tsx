"use client";
import Image from "next/image";
import { useState } from "react";
import { Section } from "../primitives/Section";
import { Container } from "../primitives/Container";
import { Eyebrow } from "../primitives/Eyebrow";

export interface TimelineStage {
  weekLabel: string;
  contextLine: string;
  sessionLine: string;
  imgSrc: string;
}

export function TimelineScrubber({ stages }: { stages: TimelineStage[] }) {
  const [idx, setIdx] = useState(0);
  const max = stages.length - 1;
  const cur = stages[idx];

  return (
    <Section id="timeline" className="bg-ivory-100">
      <Container width="wide">
        <Eyebrow>Your 12 weeks</Eyebrow>
        <h2 className="mt-3 font-display text-[clamp(2rem,3vw,2.75rem)] leading-tight text-ink-900">
          A real protocol timeline — not a marketing promise.
        </h2>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-[60%_40%] gap-10 items-start">
          <div className="relative aspect-[4/3] bg-ink-900 overflow-hidden">
            {stages.map((s, i) => (
              <Image
                key={i} src={s.imgSrc} alt={`${s.weekLabel} progress`} fill
                className="object-cover transition-opacity duration-500"
                style={{ opacity: i === idx ? 1 : 0 }}
              />
            ))}
          </div>

          <div className="border-l-2 border-gold-500 pl-6 md:min-h-[260px]">
            <p className="uppercase tracking-wider text-xs text-gold-500">{cur.weekLabel}</p>
            <p className="mt-3 font-display text-2xl text-ink-900">{cur.contextLine}</p>
            <p className="mt-6 text-sm uppercase tracking-wider text-ink-500">Your session this week</p>
            <p className="text-ink-700">{cur.sessionLine}</p>
          </div>
        </div>

        <div className="mt-12">
          <input
            type="range" min={0} max={max} value={idx}
            onChange={e => setIdx(Number(e.target.value))}
            aria-label="Timeline scrubber"
            aria-valuemin={0} aria-valuemax={max} aria-valuenow={idx}
            className="w-full accent-gold-500 cursor-grab"
          />
          <div className="mt-2 flex justify-between text-xs uppercase tracking-wider text-ink-500">
            {stages.map((s, i) => (
              <button
                key={i} type="button" onClick={() => setIdx(i)}
                className={i === idx ? "text-gold-500 font-medium" : "hover:text-ink-900"}
              >
                {s.weekLabel}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-6 text-xs text-ink-500 max-w-2xl">
          Note: results vary by skin type, pigmentation depth, and adherence to SPF protocol. Your consultation will refine these expectations.
        </p>
      </Container>
    </Section>
  );
}
