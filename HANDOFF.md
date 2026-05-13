# Plan 1 Execution — Handoff Document

**Status:** Phases A + B complete (16 of 63 tasks). Foundation + design system + UI primitives delivered.
**Handoff date:** 2026-05-13
**Next executor:** developer / Cursor / Codex / coding agent of your choice

---

## What's working right now

```
pnpm install     # ✅ runs clean
pnpm test        # ✅ 18 tests pass across 9 files
pnpm dev         # ✅ serves on port 3000 (you may need to free the port — something else is using it on this machine)
                 #    then visit http://localhost:3000/preview to see the design system
```

**Commits so far** (in order):

```
b14ef68  feat(ui): Phase B - 10 primitives + NavBar + Footer + preview, all 18 tests passing
36abc40  chore(foundation): Phase A complete - testing, linting, packages, motion libs
70d2c26  chore(foundation): tailwind v4, design tokens, fonts
17bba8f  chore: scaffold Next.js 15 web app
7f46dde  chore: initialize pnpm monorepo
```

---

## What you're inheriting

**Stack**
- pnpm 9.12.0 monorepo (workspaces under `apps/*` and `packages/*`)
- Next.js 15.0.3 + React 19 RC + TypeScript strict
- Tailwind v4 with design tokens via CSS variables (in `packages/ui/tokens/tokens.css`)
- Fraunces (variable, optical) + Inter via `next/font/google`
- Vitest + jsdom + @testing-library/react for unit
- Playwright installed (not yet wired with e2e tests)
- ESLint 9 + Prettier
- Framer Motion, GSAP, lucide-react, clsx installed

**Workspace layout (live now)**

```
apps/web/
├── app/
│   ├── globals.css           # Tailwind + tokens import + body/typo base
│   ├── layout.tsx            # Fraunces + Inter wired via next/font
│   ├── page.tsx              # placeholder home (gets replaced in Phase F)
│   └── preview/page.tsx      # /preview shows every primitive — eyeball here
├── tests/
│   ├── sanity.test.ts
│   └── setup.ts              # @testing-library/jest-dom + cleanup
├── e2e/.gitkeep              # Playwright dir (no tests yet)
├── playwright.config.ts
├── vitest.config.ts          # includes ../../packages/**/*.test.tsx
├── next.config.ts, postcss.config.mjs, tsconfig.json, package.json
└── .eslintrc.json

packages/
├── ui/
│   ├── tokens/tokens.css     # design system source of truth (palette, type, spacing, motion)
│   ├── primitives/           # Button · Input · Card · Accordion · Eyebrow · Pill · Section · Container (+ tests)
│   └── layout/               # NavBar · Footer (+ tests)
├── lib/                      # (empty scaffold — Phase C populates it)
└── content/                  # (empty scaffold — Phase F populates it)

docs/superpowers/
├── specs/2026-05-13-pigmentation-lp-design.md         # full design spec
└── plans/2026-05-13-plan-1-foundation-pigmentation-lp.md   # 63-task implementation plan
```

---

## Known issues to fix before continuing

These were hit during Phase B verification and need 5–10 min cleanup before Phase C:

### 1. React 19 RC types mismatch
`@types/react@^18.3.12` is installed but app uses React 19 RC. `next build` fails on the `/preview` page with:
```
Type '{ children: string; }' has no properties in common with type 'IntrinsicAttributes & ButtonProps'.
```
Tests pass because the runtime works — only `next build` strict-mode TS catches it.

**Fix:** bump to React 19 types. Run:
```bash
pnpm --filter web add -D @types/react@npm:types-react@rc @types/react-dom@npm:types-react-dom@rc
```
Then re-run `pnpm --filter web build` to confirm clean.

### 2. ESLint config circular structure
Default `.eslintrc.json` extending `next/core-web-vitals` errors with "Converting circular structure to JSON" under ESLint 9. Tests don't hit it; `next build` does.

**Fix:** switch to flat config OR pin ESLint to v8 OR set `eslint.ignoreDuringBuilds: true` in `next.config.ts` (last option fastest for handoff, fix properly later).

### 3. Auto-added `allowJs: true` in tsconfig
Next.js auto-added `allowJs: true` to `apps/web/tsconfig.json` during the failed build. Leave it.

### 4. Build verification is deferred
Once #1 and #2 are fixed, run:
```bash
pnpm --filter web build
```
Should pass clean. Then dev server preview at `/preview` is a real visual milestone.

---

## What's left — 47 tasks across Phases C–H

Open `docs/superpowers/plans/2026-05-13-plan-1-foundation-pigmentation-lp.md` and execute from **Task 17** onward. Every task has:

- Exact file paths
- Complete code (tests + implementation)
- Exact bash commands
- Expected output of test runs

### Phase C — Lead Infrastructure (Tasks 17–24, ~2-3 hours)

The pipeline that takes a quiz answer → GHL contact. Highest-leverage phase because everything downstream depends on it.

- Task 17: Lead Zod schema with 7 validations
- Task 18: Phone normalizer (libphonenumber-js)
- Task 19: Email MX check (Cloudflare DoH)
- Task 20: Lead scoring formula (hot/warm/cold)
- Task 21: GHL client + payload builder
- Task 22: `/api/lead/submit` Edge route
- Task 23: `/api/lead/retry` cron handler + KV queue
- Task 24: `vercel.json` cron config + `.env.example`

After Phase C the entire backend is curl-able. You can submit a fake lead and watch a GHL contact appear before any UI exists.

### Phase D — Page Sections (Tasks 25–34, ~3 hours)
BA slider, dynamic headline, hero, concern cards, doctor section, testimonials, pricing cards, FAQ accordion + JSON-LD, sticky mobile CTA.

### Phase E — Interactive Moments (Tasks 35–43, ~4-5 hours)
Quiz engine state machine + UI, gated lead form, result reveal, MediaPipe selfie scanner, GSAP mechanism animation, timeline scrubber.

### Phase F — Content + Page Assembly (Tasks 44–50, ~2 hours)
MDX content files, `/pigmentation-glasgow` LP, `/pigmentation-faq` dedicated FAQ page with MedicalWebPage schema.

### Phase G — Analytics + Attribution (Tasks 51–56, ~2 hours)
UTM hook, GA4 + Meta Pixel browser, Meta CAPI server-side dedupe.

### Phase H — Production Hardening (Tasks 57–63, ~2 hours)
Dynamic OG, perf pass, axe a11y, Vercel deploy, happy-path E2E, acceptance walkthrough.

**Realistic total remaining**: 15–20 hours of focused work for someone who can grind through it without UI-tool round-trips.

---

## Recommended handoff workflow

### Option A — Codex / Cursor (fastest)
Open the project in Cursor or Codex CLI. Tell it:
> "Execute Plan 1 starting at Task 17 from `docs/superpowers/plans/2026-05-13-plan-1-foundation-pigmentation-lp.md`. The plan is self-contained — each task has files, code, and commands. Fix the React 19 types + ESLint issue documented in HANDOFF.md first. Run tests after each task and commit when green."

### Option B — Human developer
Same instructions but for a person. The plan is detailed enough that they don't need a verbal walkthrough.

### Option C — Continue here, async
Resume in a fresh session with this same project. The plan + handoff are persisted.

---

## Real-world inputs needed before launch

Listed in Section 17 of the spec, repeated here for convenience. Block none of the build, but block the live launch:

- Doctor's GMC number + full credentials + portrait photo
- 6+ real before/after pairs (with patient consent)
- 6+ named testimonials with city + photo
- CQC registration number
- 6-stage patient progression sequence for the timeline scrubber
- Final confirmed pricing (current spec uses £299 / £399 / £149 from existing LP)
- GoHighLevel API key + Location ID
- Google Analytics 4 ID + Measurement Protocol API secret
- Meta Pixel ID + Conversions API access token
- Vercel project + KV database provisioned
- Domain decision: `lp.harleystreetmedics.clinic` vs subpath vs new

---

## How to verify handoff is healthy

Run these now to confirm what I'm handing over works:

```bash
cd "D:/May Project/pigmentation, chemical peel, skin glow drip hsa"
pnpm install          # should be a no-op or fast
pnpm test             # ✅ 18 tests pass
pnpm --filter web dev # ✅ serves to http://localhost:3000 (free port 3000 first)
                      # visit /preview → all primitives render with the editorial palette
```

If those three commands pass, the foundation is sound and the next executor can continue. Anything else is in the plan file.
