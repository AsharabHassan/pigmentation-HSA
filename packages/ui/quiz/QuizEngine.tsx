"use client";
import { useReducer } from "react";
import { Section } from "../primitives/Section";
import { Container } from "../primitives/Container";
import { Eyebrow } from "../primitives/Eyebrow";
import { Tile } from "./Tile";
import {
  createInitialState, reducer, isStepValid, type QuizAnswers,
} from "./state";
import {
  step1, step2, step3, step4, step5, step6Timing, step6Loc,
} from "./content";

interface Props {
  onComplete: (answers: QuizAnswers) => void;
  id?: string;
}

export function QuizEngine({ onComplete, id = "quiz" }: Props) {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);
  const valid = isStepValid(state);
  const pct = ((state.cursor - 1) / 5) * 100;

  const advance = () => {
    if (state.cursor === 6 && valid) {
      onComplete(state.answers);
      return;
    }
    dispatch({ type: "next" });
  };

  return (
    <Section id={id} className="bg-ivory-100">
      <Container width="content">
        <Eyebrow>60-second skin diagnostic</Eyebrow>
        <p className="text-sm uppercase tracking-wider text-ink-500 mt-1">
          Step {state.cursor} of 6
        </p>
        <div className="mt-2 h-px bg-ink-300/40 overflow-hidden">
          <div className="h-full bg-gold-500 transition-[width] duration-500" style={{ width: `${pct}%` }} />
        </div>

        <div className="mt-12 min-h-[480px]">
          {state.cursor === 1 && (
            <Step question="What brings you here today?" hint="Pick the closest match — you can refine at consultation.">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {step1.map(o => (
                  <Tile key={o.value} label={o.label} sublabel={o.sublabel}
                    selected={state.answers.primary_concern === o.value}
                    onClick={() => dispatch({ type: "answer", key: "primary_concern", value: o.value })}
                  />
                ))}
              </div>
            </Step>
          )}

          {state.cursor === 2 && (
            <Step question="How long has this been bothering you?">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {step2.map(o => (
                  <Tile key={o.value} label={o.label}
                    selected={state.answers.duration === o.value}
                    onClick={() => dispatch({ type: "answer", key: "duration", value: o.value })}
                  />
                ))}
              </div>
            </Step>
          )}

          {state.cursor === 3 && (
            <Step question="Which best describes your skin?" hint="We calibrate laser energy differently for each Fitzpatrick type.">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {step3.map(o => (
                  <Tile key={o.value} label={o.label}
                    sublabel={
                      <span className="flex items-center gap-2 mt-2">
                        <span aria-hidden className="inline-block w-5 h-5 rounded-full" style={{ background: o.tone }} />
                        {o.description}
                      </span>
                    }
                    selected={state.answers.fitzpatrick === o.value}
                    onClick={() => dispatch({ type: "answer", key: "fitzpatrick", value: o.value })}
                  />
                ))}
              </div>
            </Step>
          )}

          {state.cursor === 4 && (
            <Step question="What have you tried for this before?" hint="Select all that apply.">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {step4.map(o => (
                  <Tile key={o.value} label={o.label}
                    selected={(state.answers.tried_before ?? []).includes(o.value)}
                    onClick={() => dispatch({ type: "toggle-multi", key: "tried_before", value: o.value })}
                  />
                ))}
              </div>
            </Step>
          )}

          {state.cursor === 5 && (
            <Step question="What would success look like for you?">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {step5.map(o => (
                  <Tile key={o.value} label={o.label}
                    selected={state.answers.goal === o.value}
                    onClick={() => dispatch({ type: "answer", key: "goal", value: o.value })}
                  />
                ))}
              </div>
            </Step>
          )}

          {state.cursor === 6 && (
            <Step question="When would you ideally start?">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {step6Timing.map(o => (
                  <Tile key={o.value} label={o.label}
                    selected={state.answers.timing === o.value}
                    onClick={() => dispatch({ type: "answer", key: "timing", value: o.value })}
                  />
                ))}
              </div>
              <div className="mt-8">
                <label htmlFor="quiz-location" className="block text-xs uppercase tracking-[0.12em] text-gold-500 mb-2">
                  Where are you based?
                </label>
                <select
                  id="quiz-location"
                  className="w-full bg-ivory-200 border border-ink-300 px-4 py-3 text-base text-ink-900
                             focus:border-gold-500 focus:bg-ivory-50 outline-none"
                  value={state.answers.location ?? ""}
                  onChange={e => dispatch({ type: "answer", key: "location", value: e.target.value })}
                >
                  <option value="">Select…</option>
                  {step6Loc.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
                </select>
              </div>
            </Step>
          )}
        </div>

        <div className="mt-10 flex justify-between items-center">
          <button
            type="button"
            onClick={() => dispatch({ type: "back" })}
            disabled={state.cursor === 1}
            className="text-sm uppercase tracking-wider text-ink-500 hover:text-ink-900
                       disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={advance}
            disabled={!valid}
            className="bg-ink-900 text-ivory-50 px-7 py-3.5 text-sm uppercase tracking-wider
                       ring-1 ring-gold-500 ring-offset-4 ring-offset-ivory-100
                       hover:bg-aubergine-900 transition-colors
                       disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-ink-900"
          >
            {state.cursor === 6 ? "Reveal My Plan →" : "Next"}
          </button>
        </div>
      </Container>
    </Section>
  );
}

function Step({ question, hint, children }: { question: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-tight text-ink-900">
        {question}
      </h3>
      {hint && <p className="mt-2 text-sm text-ink-500">{hint}</p>}
      <div className="mt-6">{children}</div>
    </div>
  );
}
