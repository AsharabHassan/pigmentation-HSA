import { describe, it, expect } from "vitest";
import { createInitialState, reducer, isStepValid, currentStep, type QuizAnswers } from "./state";

describe("quiz reducer", () => {
  it("starts at step 1 with empty answers", () => {
    const s = createInitialState();
    expect(currentStep(s)).toBe(1);
    expect(s.answers).toEqual({});
    expect(s.complete).toBe(false);
  });

  it("answer-then-next advances to step 2", () => {
    let s = createInitialState();
    s = reducer(s, { type: "answer", key: "primary_concern", value: "melasma" });
    s = reducer(s, { type: "next" });
    expect(currentStep(s)).toBe(2);
    expect(s.answers.primary_concern).toBe("melasma");
  });

  it("blocks next when current step incomplete", () => {
    let s = createInitialState();
    s = reducer(s, { type: "next" });
    expect(currentStep(s)).toBe(1);
  });

  it("back returns to previous step", () => {
    let s = createInitialState();
    s = reducer(s, { type: "answer", key: "primary_concern", value: "melasma" });
    s = reducer(s, { type: "next" });
    s = reducer(s, { type: "back" });
    expect(currentStep(s)).toBe(1);
    expect(s.answers.primary_concern).toBe("melasma");
  });

  it("completes after step 6 answered + next", () => {
    let s = createInitialState();
    const fullAnswers: QuizAnswers = {
      primary_concern: "melasma",
      duration: "years",
      fitzpatrick: "IV",
      tried_before: ["prescription"],
      goal: "80% reduction",
      timing: "this week",
      location: "Glasgow",
    };
    (Object.entries(fullAnswers) as [keyof QuizAnswers, unknown][]).forEach(([k, v]) => {
      s = reducer(s, { type: "answer", key: k, value: v as never });
      s = reducer(s, { type: "next" });
    });
    expect(s.complete).toBe(true);
  });

  it("multi-select tried_before accumulates and de-dupes", () => {
    let s = createInitialState();
    s = reducer(s, { type: "toggle-multi", key: "tried_before", value: "OTC creams" });
    s = reducer(s, { type: "toggle-multi", key: "tried_before", value: "prescription" });
    s = reducer(s, { type: "toggle-multi", key: "tried_before", value: "OTC creams" });
    expect(s.answers.tried_before).toEqual(["prescription"]);
  });

  it("isStepValid: step 4 valid when at least one selected", () => {
    let s = createInitialState();
    s.cursor = 4;
    expect(isStepValid(s)).toBe(false);
    s = reducer(s, { type: "toggle-multi", key: "tried_before", value: "nothing" });
    expect(isStepValid(s)).toBe(true);
  });
});
