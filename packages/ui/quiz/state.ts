export type Concern = "melasma" | "sun-damage" | "post-acne" | "uneven-tone" | "lip-pigment" | "underarm" | "not-sure";
export type Duration = "<6mo" | "months-worsening" | "years" | "decade+";
export type Fitzpatrick = "I" | "II" | "III" | "IV" | "V" | "VI";
export type Tried = "OTC creams" | "prescription" | "peels" | "laser elsewhere" | "home remedies" | "nothing";
export type Goal = "clear" | "80% reduction" | "before-event" | "long-term";
export type Timing = "this week" | "within a month" | "within 3 months" | "researching";
export type Location = "Glasgow" | "Edinburgh" | "Scotland-other" | "UK-other" | "International";

export interface QuizAnswers {
  primary_concern?: Concern;
  duration?: Duration;
  fitzpatrick?: Fitzpatrick;
  tried_before?: Tried[];
  goal?: Goal;
  timing?: Timing;
  location?: Location;
}

export interface QuizState {
  cursor: 1 | 2 | 3 | 4 | 5 | 6;
  answers: QuizAnswers;
  complete: boolean;
}

export type QuizAction =
  | { type: "answer"; key: keyof QuizAnswers; value: unknown }
  | { type: "toggle-multi"; key: "tried_before"; value: Tried }
  | { type: "next" }
  | { type: "back" }
  | { type: "reset" };

export function createInitialState(): QuizState {
  return { cursor: 1, answers: {}, complete: false };
}

export function currentStep(s: QuizState): number { return s.cursor; }

const stepRequiresKey: Record<number, keyof QuizAnswers> = {
  1: "primary_concern",
  2: "duration",
  3: "fitzpatrick",
  4: "tried_before",
  5: "goal",
  6: "timing",
};

export function isStepValid(s: QuizState): boolean {
  const key = stepRequiresKey[s.cursor];
  if (!key) return false;
  const v = s.answers[key];
  if (key === "tried_before") return Array.isArray(v) && v.length > 0;
  if (s.cursor === 6) return !!s.answers.timing && !!s.answers.location;
  return v !== undefined && v !== null && v !== "";
}

export function reducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case "answer":
      return { ...state, answers: { ...state.answers, [action.key]: action.value } };
    case "toggle-multi": {
      const arr = (state.answers[action.key] as Tried[] | undefined) ?? [];
      const next = arr.includes(action.value)
        ? arr.filter(v => v !== action.value)
        : [...arr, action.value];
      return { ...state, answers: { ...state.answers, [action.key]: next } };
    }
    case "next":
      if (!isStepValid(state)) return state;
      if (state.cursor === 6) return { ...state, complete: true };
      return { ...state, cursor: (state.cursor + 1) as QuizState["cursor"] };
    case "back":
      if (state.cursor === 1) return state;
      return { ...state, cursor: (state.cursor - 1) as QuizState["cursor"], complete: false };
    case "reset":
      return createInitialState();
  }
}
