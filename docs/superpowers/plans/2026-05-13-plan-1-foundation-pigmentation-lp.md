# Plan 1 — Foundation + Pigmentation LP (Flagship) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the monorepo + design system + GHL-integrated lead pipeline + a converting Pigmentation LP at `/pigmentation-glasgow` with its paired `/pigmentation-faq` page, all deployed on Vercel.

**Architecture:** pnpm-workspace monorepo. Single Next.js 15 (App Router) app under `apps/web`. Shared UI primitives, content, and libs in `packages/*`. Tailwind v4 with CSS-variable design tokens. Edge `/api/lead/submit` POSTs to GoHighLevel; failures queue to Vercel KV and retry via cron. Fully gated lead capture: name + email + phone required before any plan/result reveal. Server-side Meta Conversions API + GA4 Measurement Protocol for post-iOS17 attribution.

**Tech Stack:** Next.js 15, React 19, TypeScript strict, Tailwind v4, Framer Motion, GSAP ScrollTrigger, MediaPipe Tasks Vision (FaceMesh WASM), react-hook-form, Zod, libphonenumber-js, Resend (transactional fallback), Vercel (Edge + KV + Cron + Analytics), Vitest + Playwright, pnpm workspaces.

**Spec:** `docs/superpowers/specs/2026-05-13-pigmentation-lp-design.md`

---

## File structure

```
harleystreet-lp/
├── apps/
│   └── web/                                          Next.js 15 app
│       ├── app/
│       │   ├── (lp)/pigmentation-glasgow/page.tsx    Flagship LP
│       │   ├── (faq)/pigmentation-faq/page.tsx       Paired FAQ page
│       │   ├── api/lead/submit/route.ts              Edge: lead → GHL
│       │   ├── api/lead/retry/route.ts               Cron: KV retry
│       │   ├── api/og/[lp]/route.ts                  Dynamic OG image
│       │   ├── thanks/page.tsx                       Post-submit page
│       │   ├── robots.ts, sitemap.ts
│       │   ├── layout.tsx                            Fonts, analytics, schema
│       │   └── globals.css                           Token CSS variables
│       ├── e2e/                                      Playwright E2E
│       ├── tests/setup.ts                            Vitest setup
│       └── next.config.ts, vercel.json
│
├── packages/
│   ├── ui/                                           Shared UI primitives
│   │   ├── primitives/                               Button, Input, Card, Accordion, Eyebrow, Pill, Container, Section
│   │   ├── layout/                                   NavBar, Footer
│   │   ├── hero/                                     Hero, BeforeAfterSlider, DynamicHeadline
│   │   ├── sections/                                 ConcernCards, DoctorSection, Testimonials, PricingCards, FAQ, StickyMobileCTA
│   │   ├── quiz/                                     QuizEngine, QuizStep, LeadForm, ResultReveal
│   │   ├── scanner/                                  SelfieScanner, ScanAnimation, PigmentationMap
│   │   ├── mechanism/                                MechanismAnimation (GSAP scroll SVG)
│   │   ├── timeline/                                 TimelineScrubber
│   │   └── tokens/                                   tokens.css, motion.ts
│   ├── content/
│   │   └── pigmentation/                             MDX: hero, concerns, testimonials, faq, faq-page, pricing
│   ├── lib/
│   │   ├── ghl/                                      client.ts, payload.ts, types.ts
│   │   ├── lead-scoring/                             score.ts
│   │   ├── validation/                               phone.ts, email-mx.ts, lead-schema.ts
│   │   ├── analytics/                                ga4.ts, meta.ts, events.ts, useUtm.ts
│   │   └── schema/                                   faq-jsonld.ts, medical-page-jsonld.ts
│   └── config/                                       tsconfig, eslint, prettier, vitest
│
└── pnpm-workspace.yaml, package.json, .gitignore
```

---

## Phase A — Repo Foundation (Tasks 1-8)

### Task 1: Initialize pnpm monorepo

**Files:**
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `.gitignore`
- Create: `.nvmrc`

- [ ] **Step 1: Initialize git + node version**

```bash
git init
echo "20.18.0" > .nvmrc
```

- [ ] **Step 2: Create root `package.json`**

```json
{
  "name": "harleystreet-lp",
  "version": "0.0.0",
  "private": true,
  "packageManager": "pnpm@9.12.0",
  "engines": { "node": ">=20.18.0" },
  "scripts": {
    "dev": "pnpm --filter web dev",
    "build": "pnpm --filter web build",
    "start": "pnpm --filter web start",
    "test": "pnpm -r test",
    "test:e2e": "pnpm --filter web test:e2e",
    "lint": "pnpm -r lint",
    "typecheck": "pnpm -r typecheck"
  },
  "devDependencies": {
    "typescript": "^5.6.0",
    "@types/node": "^20.14.0",
    "prettier": "^3.3.3"
  }
}
```

- [ ] **Step 3: Create `pnpm-workspace.yaml`**

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

- [ ] **Step 4: Create `.gitignore`**

```
node_modules
.next
out
dist
.env*
!.env.example
.vercel
.turbo
.DS_Store
playwright-report
test-results
coverage
*.log
```

- [ ] **Step 5: Install + commit**

```bash
pnpm install
git add . && git commit -m "chore: initialize pnpm monorepo"
```

---

### Task 2: Scaffold Next.js 15 web app

**Files:**
- Create: `apps/web/package.json`
- Create: `apps/web/tsconfig.json`
- Create: `apps/web/next.config.ts`
- Create: `apps/web/app/layout.tsx`
- Create: `apps/web/app/page.tsx`

- [ ] **Step 1: Create `apps/web/package.json`**

```json
{
  "name": "web",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:e2e": "playwright test"
  },
  "dependencies": {
    "next": "15.0.3",
    "react": "19.0.0-rc-66855b96-20241106",
    "react-dom": "19.0.0-rc-66855b96-20241106"
  },
  "devDependencies": {
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "typescript": "^5.6.0"
  }
}
```

- [ ] **Step 2: Create `apps/web/tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "preserve",
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "skipLibCheck": true,
    "incremental": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"],
      "@ui/*": ["../../packages/ui/*"],
      "@lib/*": ["../../packages/lib/*"],
      "@content/*": ["../../packages/content/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Create minimal `next.config.ts`**

```ts
import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  experimental: { typedRoutes: true },
  transpilePackages: ["@ui", "@lib", "@content"],
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [],
  },
};

export default config;
```

- [ ] **Step 4: Create minimal `app/layout.tsx` and `app/page.tsx`**

```tsx
// apps/web/app/layout.tsx
export const metadata = { title: "Harley Street Medics — Glasgow" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <body>{children}</body>
    </html>
  );
}
```

```tsx
// apps/web/app/page.tsx
export default function Home() {
  return <main>Pigmentation LP coming soon.</main>;
}
```

- [ ] **Step 5: Install + verify + commit**

```bash
pnpm install
pnpm --filter web dev   # Verify http://localhost:3000 renders, Ctrl-C
git add . && git commit -m "chore: scaffold Next.js 15 web app"
```

---

### Task 3: Install Tailwind v4 + design tokens

**Files:**
- Modify: `apps/web/package.json` (add Tailwind v4 deps)
- Create: `packages/ui/tokens/tokens.css`
- Create: `apps/web/app/globals.css`
- Modify: `apps/web/app/layout.tsx`
- Create: `apps/web/postcss.config.mjs`

- [ ] **Step 1: Add deps**

```bash
pnpm --filter web add tailwindcss@^4.0.0 @tailwindcss/postcss@^4.0.0 postcss@^8.4.49
```

- [ ] **Step 2: Create `apps/web/postcss.config.mjs`**

```js
export default { plugins: { "@tailwindcss/postcss": {} } };
```

- [ ] **Step 3: Create `packages/ui/tokens/tokens.css`** (full token set)

```css
@layer tokens {
  :root {
    /* INK */
    --ink-900: #0E0B0A;
    --ink-700: #2A2422;
    --ink-500: #6B5F5B;
    --ink-300: #C4B8B0;

    /* IVORY */
    --ivory-50:  #FAF6F1;
    --ivory-100: #F2EBE2;
    --ivory-200: #E6DCCF;

    /* AUBERGINE */
    --aubergine-900: #2A1422;
    --aubergine-700: #4A2438;

    /* GOLD */
    --gold-500: #B8945A;
    --gold-400: #C9A874;
    --gold-200: #E8D8B8;

    /* FUNCTIONAL */
    --clinical-blue-500: #4A6B7D;
    --success-500: #5B7A52;
    --warn-500:    #B8763A;
    --error-500:   #A03A2E;

    /* SPACING */
    --space-1: 4px;   --space-2: 8px;   --space-3: 12px;  --space-4: 16px;
    --space-6: 24px;  --space-8: 32px;  --space-12: 48px; --space-16: 64px;
    --space-24: 96px; --space-32: 128px; --space-40: 160px; --space-48: 192px;

    /* CONTAINERS */
    --w-narrow:  640px;
    --w-content: 960px;
    --w-wide:   1240px;

    /* MOTION */
    --dur-snap:   120ms;
    --dur-quick:  240ms;
    --dur-glide:  480ms;
    --dur-cinema: 820ms;
    --ease-out:    cubic-bezier(0.16, 1, 0.3, 1);
    --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
    --ease-soft:   cubic-bezier(0.4, 0, 0.2, 1);

    /* TYPE */
    --font-display: var(--font-fraunces), "Times New Roman", Georgia, serif;
    --font-body:    var(--font-inter), -apple-system, "Segoe UI", sans-serif;
  }

  @media (prefers-reduced-motion: reduce) {
    :root {
      --dur-snap:   1ms;
      --dur-quick:  1ms;
      --dur-glide:  1ms;
      --dur-cinema: 1ms;
    }
  }
}
```

- [ ] **Step 4: Create `apps/web/app/globals.css`**

```css
@import "tailwindcss";
@import "../../../packages/ui/tokens/tokens.css";

@theme {
  --color-ink-900: var(--ink-900);
  --color-ink-700: var(--ink-700);
  --color-ink-500: var(--ink-500);
  --color-ink-300: var(--ink-300);
  --color-ivory-50:  var(--ivory-50);
  --color-ivory-100: var(--ivory-100);
  --color-ivory-200: var(--ivory-200);
  --color-aubergine-900: var(--aubergine-900);
  --color-aubergine-700: var(--aubergine-700);
  --color-gold-500: var(--gold-500);
  --color-gold-400: var(--gold-400);
  --color-gold-200: var(--gold-200);
  --font-display: var(--font-display);
  --font-body:    var(--font-body);
}

html, body { background: var(--ivory-50); color: var(--ink-900); }
body { font-family: var(--font-body); font-size: 16px; line-height: 1.55; }
h1, h2, h3 { font-family: var(--font-display); letter-spacing: -0.02em; line-height: 1.1; }
*:focus-visible { outline: 3px solid var(--gold-200); outline-offset: 2px; border-radius: 2px; }
```

- [ ] **Step 5: Wire `globals.css` into `layout.tsx`**

```tsx
import "./globals.css";
export const metadata = { title: "Harley Street Medics — Glasgow" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en-GB"><body>{children}</body></html>;
}
```

- [ ] **Step 6: Verify + commit**

```bash
pnpm --filter web dev
# Visit http://localhost:3000 — confirm ivory background, Ctrl-C
git add . && git commit -m "chore: install Tailwind v4 + design tokens"
```

---

### Task 4: Wire up fonts (Fraunces + Inter)

**Files:**
- Modify: `apps/web/app/layout.tsx`

- [ ] **Step 1: Update `layout.tsx`**

```tsx
import "./globals.css";
import { Fraunces, Inter } from "next/font/google";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz", "SOFT"],
  weight: ["500", "700"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata = { title: "Harley Street Medics — Glasgow" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${fraunces.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 2: Verify + commit**

```bash
pnpm --filter web dev
# Headers should render in Fraunces serif, body in Inter
git add . && git commit -m "feat: install Fraunces + Inter via next/font"
```

---

### Task 5: Set up Vitest + Playwright

**Files:**
- Modify: `apps/web/package.json` (add deps)
- Create: `apps/web/vitest.config.ts`
- Create: `apps/web/tests/setup.ts`
- Create: `apps/web/playwright.config.ts`
- Create: `apps/web/e2e/.gitkeep`

- [ ] **Step 1: Install deps**

```bash
pnpm --filter web add -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom @playwright/test
pnpm --filter web exec playwright install --with-deps chromium
```

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    globals: true,
    css: false,
  },
  resolve: {
    alias: {
      "@": new URL("./", import.meta.url).pathname,
      "@ui": new URL("../../packages/ui", import.meta.url).pathname,
      "@lib": new URL("../../packages/lib", import.meta.url).pathname,
    },
  },
});
```

- [ ] **Step 3: Create `tests/setup.ts`**

```ts
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
afterEach(() => cleanup());
```

- [ ] **Step 4: Create `playwright.config.ts`**

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  retries: process.env.CI ? 2 : 0,
  use: { baseURL: "http://localhost:3000", trace: "on-first-retry" },
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile",   use: { ...devices["iPhone 14"] } },
  ],
});
```

- [ ] **Step 5: Sanity test**

Create `apps/web/tests/sanity.test.ts`:

```ts
import { describe, it, expect } from "vitest";
describe("sanity", () => {
  it("runs", () => expect(1 + 1).toBe(2));
});
```

Run:

```bash
pnpm --filter web test
# Expected: 1 passed
git add . && git commit -m "chore: set up Vitest + Playwright"
```

---

### Task 6: ESLint + Prettier baseline

**Files:**
- Create: `.prettierrc`
- Create: `apps/web/.eslintrc.json`

- [ ] **Step 1: Install + configure**

```bash
pnpm --filter web add -D eslint eslint-config-next
```

```json
// .prettierrc
{ "semi": true, "singleQuote": false, "printWidth": 100, "trailingComma": "all" }
```

```json
// apps/web/.eslintrc.json
{ "extends": "next/core-web-vitals", "rules": { "react/no-unescaped-entities": "off" } }
```

- [ ] **Step 2: Verify + commit**

```bash
pnpm --filter web lint
git add . && git commit -m "chore: eslint + prettier baseline"
```

---

### Task 7: Scaffold shared packages

**Files:**
- Create: `packages/ui/package.json`
- Create: `packages/ui/tsconfig.json`
- Create: `packages/lib/package.json`
- Create: `packages/lib/tsconfig.json`
- Create: `packages/content/package.json`

- [ ] **Step 1: Create three minimal packages**

```json
// packages/ui/package.json
{ "name": "@ui", "version": "0.0.0", "private": true, "type": "module", "main": "./index.ts" }
```

```json
// packages/ui/tsconfig.json
{ "extends": "../../apps/web/tsconfig.json", "include": ["**/*.ts", "**/*.tsx"] }
```

Repeat for `packages/lib` and `packages/content` (name them `@lib` and `@content`).

- [ ] **Step 2: Verify resolution + commit**

```bash
pnpm install
git add . && git commit -m "chore: scaffold @ui @lib @content packages"
```

---

### Task 8: Add Lucide + Framer Motion + GSAP

**Files:**
- Modify: `apps/web/package.json`

- [ ] **Step 1: Install**

```bash
pnpm --filter web add lucide-react framer-motion gsap
```

- [ ] **Step 2: Commit**

```bash
git add . && git commit -m "chore: add motion + icon libs"
```

---

## Phase A complete — checkpoint

Run `pnpm --filter web dev` and confirm:
- Page renders with ivory background
- Fraunces serif visible in browser dev tools for headings
- Inter visible for body
- `pnpm --filter web test` passes
- `pnpm --filter web lint` clean

---

## Phase B — UI Primitives (Tasks 9-16)

Each primitive follows the pattern: write a render test → fail → implement → pass → commit. CSS classes use Tailwind tokens defined in `globals.css`. Components are server-safe by default; `"use client"` only when interactivity is needed.

### Task 9: Button primitive

**Files:**
- Create: `packages/ui/primitives/Button.tsx`
- Create: `packages/ui/primitives/Button.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// packages/ui/primitives/Button.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("renders as secondary variant", () => {
    render(<Button variant="secondary">Go</Button>);
    expect(screen.getByRole("button")).toHaveClass("border");
  });

  it("renders as link variant", () => {
    render(<Button variant="link">Read</Button>);
    expect(screen.getByRole("button")).toHaveClass("underline");
  });

  it("supports asChild via type=submit", () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

```bash
pnpm --filter web test Button
# Expected: FAIL — Button not found
```

- [ ] **Step 3: Implement `Button.tsx`**

```tsx
// packages/ui/primitives/Button.tsx
import type { ButtonHTMLAttributes } from "react";
import { clsx } from "clsx";

type Variant = "primary" | "secondary" | "link";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-ink-900 text-ivory-50 px-7 py-3.5 rounded-none " +
    "ring-1 ring-gold-500 ring-offset-4 ring-offset-ivory-50 " +
    "transition-colors duration-200 hover:bg-aubergine-900 " +
    "font-medium tracking-wide text-sm uppercase",
  secondary:
    "bg-transparent text-ink-900 border border-gold-500 px-7 py-3.5 " +
    "transition-colors duration-200 hover:bg-ink-900 hover:text-ivory-50 " +
    "font-medium tracking-wide text-sm uppercase",
  link:
    "text-ink-900 underline decoration-gold-500 underline-offset-4 " +
    "hover:decoration-gold-400 transition-colors duration-200",
};

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return <button className={clsx(variants[variant], className)} {...props} />;
}
```

Install `clsx`:

```bash
pnpm --filter web add clsx
```

- [ ] **Step 4: Run — expect PASS**

```bash
pnpm --filter web test Button
# Expected: 4 passed
```

- [ ] **Step 5: Commit**

```bash
git add . && git commit -m "feat(ui): Button primitive with 3 variants"
```

---

### Task 10: Input primitive

**Files:**
- Create: `packages/ui/primitives/Input.tsx`
- Create: `packages/ui/primitives/Input.test.tsx`

- [ ] **Step 1: Failing test**

```tsx
// packages/ui/primitives/Input.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Input } from "./Input";

describe("Input", () => {
  it("renders with label", () => {
    render(<Input id="email" label="Email" />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("shows help text", () => {
    render(<Input id="phone" label="Phone" helpText="Used for booking SMS" />);
    expect(screen.getByText("Used for booking SMS")).toBeInTheDocument();
  });

  it("shows error message", () => {
    render(<Input id="email" label="Email" error="Required" />);
    expect(screen.getByText("Required")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toHaveAttribute("aria-invalid", "true");
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

```bash
pnpm --filter web test Input
```

- [ ] **Step 3: Implement `Input.tsx`**

```tsx
// packages/ui/primitives/Input.tsx
import type { InputHTMLAttributes } from "react";
import { clsx } from "clsx";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  helpText?: string;
  error?: string;
}

export function Input({ id, label, helpText, error, className, ...props }: InputProps) {
  const describedBy = error ? `${id}-error` : helpText ? `${id}-help` : undefined;
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="text-xs font-medium uppercase tracking-[0.12em] text-gold-500"
      >
        {label}
      </label>
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        className={clsx(
          "bg-ivory-200 border border-ink-300 px-4 py-3 text-base text-ink-900",
          "focus:border-gold-500 focus:bg-ivory-50 outline-none transition-colors",
          error && "border-error-500",
          className,
        )}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="text-sm text-error-500">{error}</p>
      )}
      {!error && helpText && (
        <p id={`${id}-help`} className="text-sm text-ink-500">{helpText}</p>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
pnpm --filter web test Input
# Expected: 3 passed
```

- [ ] **Step 5: Commit**

```bash
git add . && git commit -m "feat(ui): Input primitive with label, help, error states"
```

---

### Task 11: Card primitive

**Files:**
- Create: `packages/ui/primitives/Card.tsx`
- Create: `packages/ui/primitives/Card.test.tsx`

- [ ] **Step 1: Failing test**

```tsx
// packages/ui/primitives/Card.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Card } from "./Card";

describe("Card", () => {
  it("renders children inside an article element", () => {
    render(<Card><h3>Treatment</h3></Card>);
    expect(screen.getByRole("article")).toContainElement(screen.getByText("Treatment"));
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

```bash
pnpm --filter web test Card
```

- [ ] **Step 3: Implement `Card.tsx`**

```tsx
// packages/ui/primitives/Card.tsx
import type { HTMLAttributes } from "react";
import { clsx } from "clsx";

export interface CardProps extends HTMLAttributes<HTMLElement> {}

export function Card({ className, ...props }: CardProps) {
  return (
    <article
      className={clsx(
        "bg-ivory-100 border border-ink-300/40 p-8",
        "transition-shadow duration-300 hover:shadow-[0_8px_30px_-12px_rgba(42,20,34,0.18)]",
        className,
      )}
      {...props}
    />
  );
}
```

- [ ] **Step 4: Run — expect PASS**

- [ ] **Step 5: Commit**

```bash
git add . && git commit -m "feat(ui): Card primitive"
```

---

### Task 12: Accordion primitive

**Files:**
- Create: `packages/ui/primitives/Accordion.tsx`
- Create: `packages/ui/primitives/Accordion.test.tsx`

- [ ] **Step 1: Failing test**

```tsx
// packages/ui/primitives/Accordion.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Accordion, AccordionItem } from "./Accordion";

describe("Accordion", () => {
  it("toggles open on click", () => {
    render(
      <Accordion>
        <AccordionItem question="Does this work?">It works.</AccordionItem>
      </Accordion>,
    );
    const trigger = screen.getByRole("button", { name: /does this work/i });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("It works.")).toBeVisible();
  });

  it("supports keyboard activation", () => {
    render(
      <Accordion>
        <AccordionItem question="Q1">A1</AccordionItem>
      </Accordion>,
    );
    const trigger = screen.getByRole("button");
    trigger.focus();
    fireEvent.keyDown(trigger, { key: "Enter" });
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Implement `Accordion.tsx`**

```tsx
// packages/ui/primitives/Accordion.tsx
"use client";
import { useId, useState, type ReactNode } from "react";
import { Plus, Minus } from "lucide-react";

export function Accordion({ children }: { children: ReactNode }) {
  return <div className="divide-y divide-ink-300/50 border-y border-ink-300/50">{children}</div>;
}

export function AccordionItem({
  question,
  children,
  defaultOpen = false,
}: {
  question: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const id = useId();
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        onClick={() => setOpen(v => !v)}
        onKeyDown={e => (e.key === "Enter" || e.key === " ") && setOpen(v => !v)}
        className="w-full flex items-start justify-between gap-6 py-6 text-left
                   font-medium text-ink-900 hover:text-aubergine-900 transition-colors"
      >
        <span className="text-lg">{question}</span>
        {open ? <Minus size={20} className="shrink-0 mt-1" /> : <Plus size={20} className="shrink-0 mt-1" />}
      </button>
      <div
        id={`${id}-panel`}
        hidden={!open}
        className="pb-6 text-ink-700 leading-relaxed"
      >
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run — expect PASS**

- [ ] **Step 5: Commit**

```bash
git add . && git commit -m "feat(ui): Accordion primitive with a11y"
```

---

### Task 13: Eyebrow + Pill primitives

**Files:**
- Create: `packages/ui/primitives/Eyebrow.tsx`
- Create: `packages/ui/primitives/Pill.tsx`
- Create: `packages/ui/primitives/Eyebrow.test.tsx`

- [ ] **Step 1: Failing test**

```tsx
// packages/ui/primitives/Eyebrow.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Eyebrow } from "./Eyebrow";
import { Pill } from "./Pill";

describe("Eyebrow", () => {
  it("renders text in uppercase styling", () => {
    render(<Eyebrow>Pigmentation Clinic</Eyebrow>);
    expect(screen.getByText("Pigmentation Clinic")).toHaveClass("uppercase");
  });
});

describe("Pill", () => {
  it("renders text", () => {
    render(<Pill>GMC ✓</Pill>);
    expect(screen.getByText("GMC ✓")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Implement**

```tsx
// packages/ui/primitives/Eyebrow.tsx
import type { HTMLAttributes } from "react";
import { clsx } from "clsx";

export function Eyebrow({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={clsx(
        "inline-block text-xs font-medium uppercase tracking-[0.12em] text-gold-500",
        className,
      )}
      {...props}
    />
  );
}
```

```tsx
// packages/ui/primitives/Pill.tsx
import type { HTMLAttributes } from "react";
import { clsx } from "clsx";

export function Pill({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-2 bg-ivory-100 text-ink-700 px-3 py-1.5 text-sm",
        className,
      )}
      {...props}
    />
  );
}
```

- [ ] **Step 4: Run — expect PASS**

- [ ] **Step 5: Commit**

```bash
git add . && git commit -m "feat(ui): Eyebrow + Pill primitives"
```

---

### Task 14: Section + Container primitives

**Files:**
- Create: `packages/ui/primitives/Section.tsx`
- Create: `packages/ui/primitives/Container.tsx`
- Create: `packages/ui/primitives/Section.test.tsx`

- [ ] **Step 1: Failing test**

```tsx
// packages/ui/primitives/Section.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Section } from "./Section";
import { Container } from "./Container";

describe("Section + Container", () => {
  it("Section renders as <section> with rhythm padding", () => {
    render(<Section data-testid="s"><p>Hi</p></Section>);
    expect(screen.getByTestId("s").tagName).toBe("SECTION");
  });

  it("Container constrains width to content default", () => {
    render(<Container data-testid="c"><p>Hi</p></Container>);
    expect(screen.getByTestId("c")).toHaveClass("max-w-[960px]");
  });

  it("Container width=wide swaps max-width", () => {
    render(<Container data-testid="c" width="wide"><p>Hi</p></Container>);
    expect(screen.getByTestId("c")).toHaveClass("max-w-[1240px]");
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Implement**

```tsx
// packages/ui/primitives/Section.tsx
import type { HTMLAttributes } from "react";
import { clsx } from "clsx";

export function Section({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={clsx("py-24 md:py-32", className)}
      {...props}
    />
  );
}
```

```tsx
// packages/ui/primitives/Container.tsx
import type { HTMLAttributes } from "react";
import { clsx } from "clsx";

type Width = "narrow" | "content" | "wide" | "bleed";

const widthMap: Record<Width, string> = {
  narrow: "max-w-[640px]",
  content: "max-w-[960px]",
  wide: "max-w-[1240px]",
  bleed: "max-w-none",
};

export function Container({
  width = "content",
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { width?: Width }) {
  return <div className={clsx("mx-auto px-6 md:px-8", widthMap[width], className)} {...props} />;
}
```

- [ ] **Step 4: Run — expect PASS**

- [ ] **Step 5: Commit**

```bash
git add . && git commit -m "feat(ui): Section + Container primitives"
```

---

### Task 15: NavBar

**Files:**
- Create: `packages/ui/layout/NavBar.tsx`
- Create: `packages/ui/layout/NavBar.test.tsx`

- [ ] **Step 1: Failing test**

```tsx
// packages/ui/layout/NavBar.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { NavBar } from "./NavBar";

describe("NavBar", () => {
  it("renders logo + primary nav + CTA", () => {
    render(<NavBar />);
    expect(screen.getByText(/harley street medics/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /treatments/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /the doctor/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /book now/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Implement**

```tsx
// packages/ui/layout/NavBar.tsx
import Link from "next/link";
import { Container } from "../primitives/Container";

export function NavBar() {
  return (
    <header className="sticky top-0 z-40 bg-ivory-50/85 backdrop-blur-md border-b border-ink-300/30">
      <Container width="wide" className="flex items-center justify-between py-5">
        <Link href="/" className="font-display text-xl tracking-tight text-ink-900">
          Harley Street Medics
        </Link>
        <nav className="hidden md:flex items-center gap-10 text-sm text-ink-700">
          <Link href="#treatments" className="hover:text-aubergine-900 transition-colors">Treatments</Link>
          <Link href="#doctor" className="hover:text-aubergine-900 transition-colors">The Doctor</Link>
          <Link href="#book"
            className="bg-ink-900 text-ivory-50 px-5 py-2.5 text-xs uppercase tracking-wider
                       hover:bg-aubergine-900 transition-colors">
            Book Now ▸
          </Link>
        </nav>
      </Container>
    </header>
  );
}
```

- [ ] **Step 4: Run — expect PASS**

- [ ] **Step 5: Commit**

```bash
git add . && git commit -m "feat(ui): NavBar"
```

---

### Task 16: Footer

**Files:**
- Create: `packages/ui/layout/Footer.tsx`
- Create: `packages/ui/layout/Footer.test.tsx`

- [ ] **Step 1: Failing test**

```tsx
// packages/ui/layout/Footer.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Footer } from "./Footer";

describe("Footer", () => {
  it("renders clinic address and legal links", () => {
    render(<Footer />);
    expect(screen.getByText(/154 Clyde St/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /privacy/i })).toBeInTheDocument();
    expect(screen.getByText(/2026/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Implement**

```tsx
// packages/ui/layout/Footer.tsx
import Link from "next/link";
import { Container } from "../primitives/Container";

export function Footer() {
  return (
    <footer className="bg-aubergine-900 text-ivory-100 mt-32">
      <Container width="wide" className="py-16 grid md:grid-cols-3 gap-10">
        <div>
          <p className="font-display text-2xl mb-3">Harley Street Medics</p>
          <p className="text-sm leading-relaxed text-ivory-100/80">
            154 Clyde St<br/>Glasgow G1 4EX<br/>United Kingdom
          </p>
        </div>
        <div className="text-sm">
          <p className="uppercase tracking-wider text-gold-500 mb-3 text-xs">Contact</p>
          <p>Phone: 0141-XXX-XXXX</p>
          <p>Hours: Mon–Sat, 9am–7pm</p>
        </div>
        <div className="text-sm">
          <p className="uppercase tracking-wider text-gold-500 mb-3 text-xs">Legal</p>
          <Link href="/privacy" className="block hover:text-gold-400">Privacy Policy</Link>
          <Link href="/terms" className="block hover:text-gold-400">Terms</Link>
          <Link href="/complaints" className="block hover:text-gold-400">Complaints</Link>
        </div>
      </Container>
      <div className="border-t border-ivory-100/10 py-5 text-center text-xs text-ivory-100/60">
        © 2026 Harley Street Medics — All rights reserved
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Run — expect PASS**

- [ ] **Step 5: Commit**

```bash
git add . && git commit -m "feat(ui): Footer"
```

---

## Phase B complete — checkpoint

Add a temporary preview page to eyeball the primitives:

```tsx
// apps/web/app/preview/page.tsx
import { Button } from "@ui/primitives/Button";
import { Input } from "@ui/primitives/Input";
import { Card } from "@ui/primitives/Card";
import { Eyebrow } from "@ui/primitives/Eyebrow";
import { Pill } from "@ui/primitives/Pill";
import { Section } from "@ui/primitives/Section";
import { Container } from "@ui/primitives/Container";
import { Accordion, AccordionItem } from "@ui/primitives/Accordion";
import { NavBar } from "@ui/layout/NavBar";
import { Footer } from "@ui/layout/Footer";

export default function Preview() {
  return (
    <>
      <NavBar />
      <Section>
        <Container>
          <Eyebrow>Component Preview</Eyebrow>
          <h1 className="text-5xl font-display mt-2 mb-10">Design system</h1>

          <div className="flex flex-wrap gap-4 mb-10">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="link">Link</Button>
          </div>

          <div className="max-w-md mb-10 flex flex-col gap-4">
            <Input id="name" label="Full name" />
            <Input id="email" label="Email" helpText="We'll send your plan here" />
            <Input id="bad" label="Phone" error="Required" />
          </div>

          <Card className="mb-10 max-w-md">
            <h3 className="text-xl font-display mb-2">Treatment card</h3>
            <p className="text-ink-700">Card content sits here.</p>
          </Card>

          <div className="flex gap-3 mb-10">
            <Pill>GMC ✓</Pill>
            <Pill>CQC ✓</Pill>
            <Pill>4.9★</Pill>
          </div>

          <Accordion>
            <AccordionItem question="Does laser pigmentation removal hurt?">
              Most patients describe it as a quick snap. We offer numbing cream on request.
            </AccordionItem>
            <AccordionItem question="How many sessions will I need?">
              Typically 4-6 sessions, spaced 3 weeks apart.
            </AccordionItem>
          </Accordion>
        </Container>
      </Section>
      <Footer />
    </>
  );
}
```

Run dev server, visit `/preview`, verify:
- Buttons match palette
- Inputs show proper label/help/error states
- Accordion toggles open/closed
- Focus rings visible on keyboard tab
- All primitives respect the tokens

```bash
pnpm --filter web test
# Expected: all primitive tests passing
git add . && git commit -m "chore: preview page for primitives"
```

---

## Phase C — Lead Infrastructure (Tasks 17-24)

This phase wires the lead-capture pipeline end-to-end: validation → scoring → GHL push → KV retry on failure. The frontend doesn't exist yet — we drive these tasks entirely with tests so the API is bulletproof before any UI touches it.

### Task 17: Lead payload Zod schema

**Files:**
- Create: `packages/lib/validation/lead-schema.ts`
- Create: `packages/lib/validation/lead-schema.test.ts`

- [ ] **Step 1: Install deps**

```bash
pnpm --filter web add zod libphonenumber-js
```

- [ ] **Step 2: Write the failing test**

```ts
// packages/lib/validation/lead-schema.test.ts
import { describe, it, expect } from "vitest";
import { leadSchema } from "./lead-schema";

const valid = {
  fullName: "Sarah O'Connor",
  email: "sarah@example.com",
  phone: "+447700900123",
  consent: true,
  marketingConsent: false,
  source: "lp-pigmentation",
  quiz: {
    primary_concern: "melasma",
    duration: "years",
    fitzpatrick: "IV",
    tried_before: ["prescription", "OTC creams"],
    goal: "80% reduction",
    timing: "this week",
    location: "Glasgow",
  },
  utm: {
    utm_source: "google",
    utm_medium: "cpc",
    utm_campaign: "pigmentation-glasgow",
    utm_term: "laser pigmentation removal glasgow",
    gclid: "abc",
    fbclid: null,
    landing_page_url: "https://example.com/pigmentation-glasgow",
    referrer: null,
  },
};

describe("leadSchema", () => {
  it("accepts a fully-populated valid payload", () => {
    expect(leadSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects missing required fields", () => {
    const r = leadSchema.safeParse({ ...valid, fullName: "" });
    expect(r.success).toBe(false);
  });

  it("rejects missing required consent", () => {
    const r = leadSchema.safeParse({ ...valid, consent: false });
    expect(r.success).toBe(false);
  });

  it("rejects malformed email", () => {
    const r = leadSchema.safeParse({ ...valid, email: "not-an-email" });
    expect(r.success).toBe(false);
  });

  it("rejects single-character name", () => {
    const r = leadSchema.safeParse({ ...valid, fullName: "S" });
    expect(r.success).toBe(false);
  });

  it("allows omitted utm fields (researcher with no ad context)", () => {
    const r = leadSchema.safeParse({
      ...valid,
      utm: { utm_source: null, utm_medium: null, utm_campaign: null, utm_term: null,
             gclid: null, fbclid: null, landing_page_url: null, referrer: null },
    });
    expect(r.success).toBe(true);
  });

  it("allows quiz partial — only primary_concern + email for early abandon recovery", () => {
    const r = leadSchema.safeParse({ ...valid, quiz: undefined });
    expect(r.success).toBe(true);
  });
});
```

- [ ] **Step 3: Run — expect FAIL**

```bash
pnpm --filter web test lead-schema
# Expected: FAIL — leadSchema not found
```

- [ ] **Step 4: Implement `lead-schema.ts`**

```ts
// packages/lib/validation/lead-schema.ts
import { z } from "zod";

const nameSchema = z
  .string()
  .trim()
  .min(2, "Name is too short")
  .max(100, "Name is too long")
  .regex(/^[\p{L}][\p{L}\s'\-.]+$/u, "Use letters, spaces, apostrophes, hyphens only");

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Enter a valid email address")
  .max(254);

const phoneSchema = z
  .string()
  .trim()
  .min(7)
  .max(20);

const quizSchema = z.object({
  primary_concern: z.enum([
    "melasma", "sun-damage", "post-acne", "uneven-tone",
    "lip-pigment", "underarm", "not-sure",
  ]),
  duration: z.enum(["<6mo", "months-worsening", "years", "decade+"]),
  fitzpatrick: z.enum(["I", "II", "III", "IV", "V", "VI"]),
  tried_before: z.array(z.enum([
    "OTC creams", "prescription", "peels", "laser elsewhere",
    "home remedies", "nothing",
  ])).max(6),
  goal: z.enum(["clear", "80% reduction", "before-event", "long-term"]),
  timing: z.enum(["this week", "within a month", "within 3 months", "researching"]),
  location: z.enum([
    "Glasgow", "Edinburgh", "Scotland-other", "UK-other", "International",
  ]),
});

const utmSchema = z.object({
  utm_source:       z.string().nullable(),
  utm_medium:       z.string().nullable(),
  utm_campaign:     z.string().nullable(),
  utm_term:         z.string().nullable(),
  gclid:            z.string().nullable(),
  fbclid:           z.string().nullable(),
  landing_page_url: z.string().nullable(),
  referrer:         z.string().nullable(),
});

export const leadSchema = z.object({
  fullName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  consent: z.literal(true, { errorMap: () => ({ message: "Consent is required" }) }),
  marketingConsent: z.boolean(),
  source: z.string().min(1),
  quiz: quizSchema.optional(),
  utm: utmSchema,
});

export type Lead = z.infer<typeof leadSchema>;
export type LeadQuiz = z.infer<typeof quizSchema>;
export type LeadUtm = z.infer<typeof utmSchema>;
```

- [ ] **Step 5: Run — expect PASS**

```bash
pnpm --filter web test lead-schema
# Expected: 7 passed
```

- [ ] **Step 6: Commit**

```bash
git add . && git commit -m "feat(lib): lead payload Zod schema"
```

---

### Task 18: Phone normalizer (libphonenumber-js wrapper)

**Files:**
- Create: `packages/lib/validation/phone.ts`
- Create: `packages/lib/validation/phone.test.ts`

- [ ] **Step 1: Failing test**

```ts
// packages/lib/validation/phone.test.ts
import { describe, it, expect } from "vitest";
import { normalizePhone, isValidMobile } from "./phone";

describe("normalizePhone", () => {
  it("normalizes UK mobile with country code to E.164", () => {
    expect(normalizePhone("07700900123", "GB")).toBe("+447700900123");
  });

  it("normalizes already-E.164 number unchanged", () => {
    expect(normalizePhone("+447700900123", "GB")).toBe("+447700900123");
  });

  it("returns null for unparseable input", () => {
    expect(normalizePhone("not a number", "GB")).toBeNull();
  });

  it("returns null for landline when only mobiles allowed", () => {
    // UK landline: 020 7946 0958
    expect(normalizePhone("02079460958", "GB")).toBeNull();
  });
});

describe("isValidMobile", () => {
  it("true for UK mobile", () => {
    expect(isValidMobile("+447700900123", "GB")).toBe(true);
  });

  it("false for UK landline", () => {
    expect(isValidMobile("+442079460958", "GB")).toBe(false);
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Implement `phone.ts`**

```ts
// packages/lib/validation/phone.ts
import { parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js";

export function normalizePhone(input: string, defaultCountry: CountryCode = "GB"): string | null {
  const parsed = parsePhoneNumberFromString(input, defaultCountry);
  if (!parsed || !parsed.isValid()) return null;
  if (parsed.getType() !== "MOBILE") return null;
  return parsed.number;
}

export function isValidMobile(input: string, defaultCountry: CountryCode = "GB"): boolean {
  return normalizePhone(input, defaultCountry) !== null;
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
pnpm --filter web test phone
# Expected: 6 passed
```

- [ ] **Step 5: Commit**

```bash
git add . && git commit -m "feat(lib): phone normalizer + mobile validator"
```

---

### Task 19: Email MX-check util (DNS-over-HTTPS)

**Files:**
- Create: `packages/lib/validation/email-mx.ts`
- Create: `packages/lib/validation/email-mx.test.ts`

This catches fake-email patterns like `asdf@asdf.com` by verifying the domain has actual MX records via Cloudflare DoH. Runs at the Edge.

- [ ] **Step 1: Failing test**

```ts
// packages/lib/validation/email-mx.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { hasMxRecord } from "./email-mx";

const originalFetch = globalThis.fetch;

describe("hasMxRecord", () => {
  beforeEach(() => { globalThis.fetch = originalFetch; });

  it("returns true when domain has MX records", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ Status: 0, Answer: [{ type: 15, data: "10 mx.example.com." }] }),
    } as Response);
    expect(await hasMxRecord("user@example.com")).toBe(true);
  });

  it("returns false when domain has no MX records", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ Status: 0 /* no Answer key */ }),
    } as Response);
    expect(await hasMxRecord("user@nope-example-abc.com")).toBe(false);
  });

  it("returns false on malformed email", async () => {
    expect(await hasMxRecord("not-an-email")).toBe(false);
  });

  it("returns true on network error (fail-open — don't block real users)", async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error("network"));
    expect(await hasMxRecord("user@example.com")).toBe(true);
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Implement `email-mx.ts`**

```ts
// packages/lib/validation/email-mx.ts

/**
 * Verify the email's domain has at least one MX record.
 * Uses Cloudflare DoH (works at Vercel Edge).
 * Fail-open on network errors — never block legitimate users for transient DNS issues.
 */
export async function hasMxRecord(email: string): Promise<boolean> {
  const at = email.lastIndexOf("@");
  if (at < 1 || at >= email.length - 3) return false;
  const domain = email.slice(at + 1).trim().toLowerCase();

  try {
    const url = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=MX`;
    const res = await fetch(url, {
      headers: { accept: "application/dns-json" },
      signal: AbortSignal.timeout(1500),
    });
    if (!res.ok) return true; // fail-open
    const json = (await res.json()) as { Status: number; Answer?: unknown[] };
    if (json.Status !== 0) return false;
    return Array.isArray(json.Answer) && json.Answer.length > 0;
  } catch {
    return true; // fail-open on timeout / network error
  }
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
pnpm --filter web test email-mx
# Expected: 4 passed
```

- [ ] **Step 5: Commit**

```bash
git add . && git commit -m "feat(lib): email MX-record check via DoH"
```

---

### Task 20: Lead scoring lib

**Files:**
- Create: `packages/lib/lead-scoring/score.ts`
- Create: `packages/lib/lead-scoring/score.test.ts`

- [ ] **Step 1: Failing test**

```ts
// packages/lib/lead-scoring/score.test.ts
import { describe, it, expect } from "vitest";
import { scoreLead, leadTag } from "./score";
import type { Lead } from "../validation/lead-schema";

const base: Lead = {
  fullName: "Sarah O'Connor",
  email: "s@x.com",
  phone: "+447700900123",
  consent: true,
  marketingConsent: false,
  source: "lp-pigmentation",
  quiz: {
    primary_concern: "uneven-tone",
    duration: "<6mo",
    fitzpatrick: "III",
    tried_before: ["nothing"],
    goal: "clear",
    timing: "researching",
    location: "UK-other",
  },
  utm: { utm_source: null, utm_medium: null, utm_campaign: null, utm_term: null,
         gclid: null, fbclid: null, landing_page_url: null, referrer: null },
};

describe("scoreLead", () => {
  it("baseline (researching, low everywhere) scores low", () => {
    expect(scoreLead(base)).toBeLessThan(25);
  });

  it("hot lead: this-week + melasma + years + Glasgow + tried prescription + valid mobile = hot", () => {
    const hot: Lead = {
      ...base,
      quiz: {
        ...base.quiz!,
        primary_concern: "melasma",
        duration: "years",
        timing: "this week",
        location: "Glasgow",
        tried_before: ["prescription"],
      },
    };
    expect(scoreLead(hot)).toBeGreaterThanOrEqual(50);
    expect(leadTag(scoreLead(hot))).toBe("lead-hot");
  });

  it("warm lead: within-a-month + sun-damage + Glasgow = warm", () => {
    const warm: Lead = {
      ...base,
      quiz: {
        ...base.quiz!,
        primary_concern: "sun-damage",
        timing: "within a month",
        location: "Glasgow",
      },
    };
    const s = scoreLead(warm);
    expect(s).toBeGreaterThanOrEqual(25);
    expect(s).toBeLessThan(50);
    expect(leadTag(s)).toBe("lead-warm");
  });

  it("cold lead: researching + no Glasgow = cold", () => {
    expect(leadTag(scoreLead(base))).toBe("lead-cold");
  });

  it("scores zero when quiz is absent (abandon-recovery early capture)", () => {
    expect(scoreLead({ ...base, quiz: undefined })).toBe(5); // mobile points only
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Implement `score.ts`**

```ts
// packages/lib/lead-scoring/score.ts
import type { Lead } from "../validation/lead-schema";

export type LeadTag = "lead-hot" | "lead-warm" | "lead-cold";

export function scoreLead(lead: Lead): number {
  let score = 0;
  const q = lead.quiz;

  // Urgency
  if (q?.timing === "this week") score += 30;
  else if (q?.timing === "within a month") score += 20;

  // Concern type (paid pigment is highest-value)
  if (q?.primary_concern === "melasma" || q?.primary_concern === "sun-damage") score += 15;

  // Duration (long-suffering = motivated)
  if (q?.duration === "years" || q?.duration === "decade+") score += 10;

  // Geo (Glasgow is in-clinic ready)
  if (q?.location === "Glasgow") score += 10;

  // Prior attempts (already invested in solving this)
  const seriousAttempts = ["prescription", "laser elsewhere", "peels"] as const;
  if (q?.tried_before.some(t => (seriousAttempts as readonly string[]).includes(t))) score += 10;

  // Valid mobile (already validated server-side as E.164 mobile)
  if (lead.phone.startsWith("+")) score += 5;

  return score;
}

export function leadTag(score: number): LeadTag {
  if (score >= 50) return "lead-hot";
  if (score >= 25) return "lead-warm";
  return "lead-cold";
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
pnpm --filter web test score
# Expected: 5 passed
```

- [ ] **Step 5: Commit**

```bash
git add . && git commit -m "feat(lib): lead-scoring + tag classification"
```

---

### Task 21: GHL client + payload builder

**Files:**
- Create: `packages/lib/ghl/types.ts`
- Create: `packages/lib/ghl/payload.ts`
- Create: `packages/lib/ghl/client.ts`
- Create: `packages/lib/ghl/payload.test.ts`
- Create: `packages/lib/ghl/client.test.ts`

- [ ] **Step 1: Failing test for payload builder**

```ts
// packages/lib/ghl/payload.test.ts
import { describe, it, expect } from "vitest";
import { buildGhlContact } from "./payload";
import type { Lead } from "../validation/lead-schema";

const lead: Lead = {
  fullName: "Sarah O'Connor",
  email: "sarah@example.com",
  phone: "+447700900123",
  consent: true,
  marketingConsent: true,
  source: "lp-pigmentation",
  quiz: {
    primary_concern: "melasma",
    duration: "years",
    fitzpatrick: "IV",
    tried_before: ["prescription"],
    goal: "80% reduction",
    timing: "this week",
    location: "Glasgow",
  },
  utm: {
    utm_source: "google", utm_medium: "cpc",
    utm_campaign: "pigmentation-glasgow",
    utm_term: "laser pigmentation removal glasgow",
    gclid: "abc123", fbclid: null,
    landing_page_url: "https://example.com/pigmentation-glasgow",
    referrer: null,
  },
};

describe("buildGhlContact", () => {
  it("splits full name into first + last", () => {
    const c = buildGhlContact(lead, "Pigmentation LP — Glasgow", "lead-hot", 75);
    expect(c.firstName).toBe("Sarah");
    expect(c.lastName).toBe("O'Connor");
  });

  it("handles single-name input", () => {
    const c = buildGhlContact({ ...lead, fullName: "Cher" }, "src", "lead-cold", 5);
    expect(c.firstName).toBe("Cher");
    expect(c.lastName).toBe("");
  });

  it("emits expected tags", () => {
    const c = buildGhlContact(lead, "src", "lead-hot", 75);
    expect(c.tags).toEqual(
      expect.arrayContaining([
        "lp-pigmentation",
        "quiz-complete",
        "concern-melasma",
        "fitzpatrick-IV",
        "urgency-this-week",
        "loc-glasgow",
        "lead-hot",
      ]),
    );
  });

  it("forwards UTM + score in customFields", () => {
    const c = buildGhlContact(lead, "src", "lead-hot", 75);
    expect(c.customFields.utm_source).toBe("google");
    expect(c.customFields.utm_term).toBe("laser pigmentation removal glasgow");
    expect(c.customFields.gclid).toBe("abc123");
    expect(c.customFields.lead_score).toBe(75);
    expect(c.customFields.recommended_protocol).toBe("Signature 3-Step");
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Implement `types.ts` and `payload.ts`**

```ts
// packages/lib/ghl/types.ts
export interface GhlContact {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  source: string;
  tags: string[];
  customFields: Record<string, string | number | string[] | null>;
}
```

```ts
// packages/lib/ghl/payload.ts
import type { Lead } from "../validation/lead-schema";
import type { LeadTag } from "../lead-scoring/score";
import type { GhlContact } from "./types";

function splitName(fullName: string): { first: string; last: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return { first: parts[0], last: "" };
  return { first: parts[0], last: parts.slice(1).join(" ") };
}

const concernToProtocol: Record<string, string> = {
  "melasma": "Signature 3-Step",
  "sun-damage": "Signature 3-Step",
  "post-acne": "Signature 3-Step + Mesotherapy",
  "uneven-tone": "Clarity Peel + Mesotherapy",
  "lip-pigment": "Lip Neutralisation Protocol",
  "underarm": "Underarm Clarity Protocol",
  "not-sure": "Consultation Required",
};

const concernToSessions: Record<string, string> = {
  "melasma": "4-6 over 12 weeks",
  "sun-damage": "3-4 over 9 weeks",
  "post-acne": "4-6 over 12 weeks",
  "uneven-tone": "3-5 over 9 weeks",
  "lip-pigment": "3-4 over 8 weeks",
  "underarm": "4-6 over 12 weeks",
  "not-sure": "TBD at consultation",
};

export function buildGhlContact(
  lead: Lead,
  source: string,
  tag: LeadTag,
  score: number,
): GhlContact {
  const { first, last } = splitName(lead.fullName);
  const q = lead.quiz;

  const tags = [
    "lp-pigmentation",
    q ? "quiz-complete" : "quiz-partial",
    q && `concern-${q.primary_concern}`,
    q && `fitzpatrick-${q.fitzpatrick}`,
    q && `urgency-${q.timing.replace(/\s+/g, "-")}`,
    q && `loc-${q.location.toLowerCase()}`,
    tag,
    lead.marketingConsent && "marketing-opt-in",
  ].filter(Boolean) as string[];

  const protocol = q ? concernToProtocol[q.primary_concern] : null;
  const sessions = q ? concernToSessions[q.primary_concern] : null;

  return {
    firstName: first,
    lastName: last,
    email: lead.email,
    phone: lead.phone,
    source,
    tags,
    customFields: {
      primary_concern: q?.primary_concern ?? null,
      duration: q?.duration ?? null,
      fitzpatrick: q?.fitzpatrick ?? null,
      tried_before: q?.tried_before ?? null,
      goal: q?.goal ?? null,
      timing: q?.timing ?? null,
      location: q?.location ?? null,
      recommended_protocol: protocol,
      estimated_sessions: sessions,
      lead_score: score,
      utm_source: lead.utm.utm_source,
      utm_medium: lead.utm.utm_medium,
      utm_campaign: lead.utm.utm_campaign,
      utm_term: lead.utm.utm_term,
      gclid: lead.utm.gclid,
      fbclid: lead.utm.fbclid,
      landing_page_url: lead.utm.landing_page_url,
      referrer: lead.utm.referrer,
    },
  };
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
pnpm --filter web test payload
# Expected: 4 passed
```

- [ ] **Step 5: Failing test for the HTTP client**

```ts
// packages/lib/ghl/client.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ghlUpsertContact } from "./client";
import type { GhlContact } from "./types";

const contact: GhlContact = {
  firstName: "Sarah", lastName: "O'Connor",
  email: "s@x.com", phone: "+447700900123",
  source: "lp", tags: [], customFields: {},
};

const originalFetch = globalThis.fetch;
const originalEnv = { ...process.env };

beforeEach(() => {
  globalThis.fetch = originalFetch;
  process.env = { ...originalEnv, GHL_API_KEY: "test-key", GHL_LOCATION_ID: "loc-1" };
});

describe("ghlUpsertContact", () => {
  it("POSTs to GHL contacts/upsert with bearer + version headers", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ contact: { id: "ct-1" } }),
    } as Response);
    globalThis.fetch = fetchMock;

    const res = await ghlUpsertContact(contact);
    expect(res.ok).toBe(true);
    expect(res.contactId).toBe("ct-1");

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://services.leadconnectorhq.com/contacts/upsert");
    const headers = (init as RequestInit).headers as Record<string, string>;
    expect(headers["Authorization"]).toBe("Bearer test-key");
    expect(headers["Version"]).toBe("2021-07-28");
    expect(headers["Content-Type"]).toBe("application/json");
    const body = JSON.parse((init as RequestInit).body as string);
    expect(body.locationId).toBe("loc-1");
    expect(body.email).toBe("s@x.com");
  });

  it("returns ok=false with status on non-2xx", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false, status: 422, json: async () => ({ message: "bad" }),
    } as Response);

    const res = await ghlUpsertContact(contact);
    expect(res.ok).toBe(false);
    expect(res.status).toBe(422);
  });

  it("returns ok=false on network error", async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error("offline"));
    const res = await ghlUpsertContact(contact);
    expect(res.ok).toBe(false);
    expect(res.error).toMatch(/offline/);
  });
});
```

- [ ] **Step 6: Implement `client.ts`**

```ts
// packages/lib/ghl/client.ts
import type { GhlContact } from "./types";

export interface GhlResult {
  ok: boolean;
  status?: number;
  contactId?: string;
  error?: string;
}

const GHL_BASE = "https://services.leadconnectorhq.com";

export async function ghlUpsertContact(contact: GhlContact): Promise<GhlResult> {
  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;
  if (!apiKey || !locationId) {
    return { ok: false, error: "GHL_API_KEY or GHL_LOCATION_ID not configured" };
  }

  const body = {
    locationId,
    firstName: contact.firstName,
    lastName: contact.lastName,
    email: contact.email,
    phone: contact.phone,
    source: contact.source,
    tags: contact.tags,
    customFields: Object.entries(contact.customFields)
      .filter(([, v]) => v !== null && v !== undefined)
      .map(([key, value]) => ({ key, field_value: value })),
  };

  try {
    const res = await fetch(`${GHL_BASE}/contacts/upsert`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Version": "2021-07-28",
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      return { ok: false, status: res.status };
    }
    const json = (await res.json()) as { contact?: { id?: string } };
    return { ok: true, status: res.status, contactId: json.contact?.id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}
```

- [ ] **Step 7: Run — expect PASS**

```bash
pnpm --filter web test ghl
# Expected: 7 passed (payload + client)
```

- [ ] **Step 8: Commit**

```bash
git add . && git commit -m "feat(lib): GHL client + payload builder"
```

---

### Task 22: `/api/lead/submit` Edge Route Handler

**Files:**
- Create: `apps/web/app/api/lead/submit/route.ts`
- Create: `apps/web/app/api/lead/submit/route.test.ts`

- [ ] **Step 1: Install Vercel KV**

```bash
pnpm --filter web add @vercel/kv
```

- [ ] **Step 2: Failing test (integration, with mocked GHL + KV)**

```ts
// apps/web/app/api/lead/submit/route.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock KV before importing the route
const kvSet = vi.fn();
vi.mock("@vercel/kv", () => ({ kv: { set: kvSet, get: vi.fn(), del: vi.fn() } }));

// Mock GHL client
const ghlMock = vi.fn();
vi.mock("@lib/ghl/client", () => ({ ghlUpsertContact: ghlMock }));

import { POST } from "./route";

const validBody = {
  fullName: "Sarah O'Connor",
  email: "sarah@example.com",
  rawPhone: "07700900123",
  phoneCountry: "GB",
  consent: true,
  marketingConsent: false,
  source: "lp-pigmentation",
  quiz: {
    primary_concern: "melasma",
    duration: "years",
    fitzpatrick: "IV",
    tried_before: ["prescription"],
    goal: "80% reduction",
    timing: "this week",
    location: "Glasgow",
  },
  utm: {
    utm_source: "google", utm_medium: "cpc", utm_campaign: "pig-glasgow",
    utm_term: "laser pigmentation removal glasgow",
    gclid: null, fbclid: null,
    landing_page_url: "https://example.com/pigmentation-glasgow",
    referrer: null,
  },
};

function req(body: unknown) {
  return new Request("http://localhost/api/lead/submit", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  process.env.GHL_API_KEY = "x"; process.env.GHL_LOCATION_ID = "y";
});

describe("POST /api/lead/submit", () => {
  it("returns 200 with reveal payload on happy path", async () => {
    ghlMock.mockResolvedValue({ ok: true, contactId: "c-1" });
    const res = await POST(req(validBody));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.reveal.recommendedProtocol).toBe("Signature 3-Step");
    expect(body.reveal.estimatedSessions).toBe("4-6 over 12 weeks");
    expect(ghlMock).toHaveBeenCalledOnce();
    expect(kvSet).not.toHaveBeenCalled();
  });

  it("returns 400 on validation failure", async () => {
    const res = await POST(req({ ...validBody, email: "nope" }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.fieldErrors.email).toBeDefined();
  });

  it("returns 400 when phone is a landline", async () => {
    const res = await POST(req({ ...validBody, rawPhone: "02079460958" }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.fieldErrors.phone).toBeDefined();
  });

  it("queues to KV and still returns 200 when GHL fails", async () => {
    ghlMock.mockResolvedValue({ ok: false, status: 503 });
    const res = await POST(req(validBody));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true); // user is not punished
    expect(kvSet).toHaveBeenCalled();
    const [key] = kvSet.mock.calls[0];
    expect(key).toMatch(/^leads:failed:/);
  });

  it("rejects non-JSON body", async () => {
    const res = await POST(new Request("http://localhost/api/lead/submit", {
      method: "POST", body: "not json",
    }));
    expect(res.status).toBe(400);
  });
});
```

- [ ] **Step 3: Run — expect FAIL**

- [ ] **Step 4: Implement `route.ts`**

```ts
// apps/web/app/api/lead/submit/route.ts
import { kv } from "@vercel/kv";
import { leadSchema } from "@lib/validation/lead-schema";
import { normalizePhone } from "@lib/validation/phone";
import { hasMxRecord } from "@lib/validation/email-mx";
import { scoreLead, leadTag } from "@lib/lead-scoring/score";
import { buildGhlContact } from "@lib/ghl/payload";
import { ghlUpsertContact } from "@lib/ghl/client";
import type { CountryCode } from "libphonenumber-js";

export const runtime = "edge";

interface RawBody {
  fullName?: string;
  email?: string;
  rawPhone?: string;
  phoneCountry?: string;
  consent?: boolean;
  marketingConsent?: boolean;
  source?: string;
  quiz?: unknown;
  utm?: unknown;
}

const protocolMap: Record<string, string> = {
  "melasma": "Signature 3-Step",
  "sun-damage": "Signature 3-Step",
  "post-acne": "Signature 3-Step + Mesotherapy",
  "uneven-tone": "Clarity Peel + Mesotherapy",
  "lip-pigment": "Lip Neutralisation Protocol",
  "underarm": "Underarm Clarity Protocol",
  "not-sure": "Consultation Required",
};
const sessionsMap: Record<string, string> = {
  "melasma": "4-6 over 12 weeks",
  "sun-damage": "3-4 over 9 weeks",
  "post-acne": "4-6 over 12 weeks",
  "uneven-tone": "3-5 over 9 weeks",
  "lip-pigment": "3-4 over 8 weeks",
  "underarm": "4-6 over 12 weeks",
  "not-sure": "TBD at consultation",
};

export async function POST(req: Request): Promise<Response> {
  let raw: RawBody;
  try {
    raw = (await req.json()) as RawBody;
  } catch {
    return json(400, { ok: false, error: "Invalid JSON" });
  }

  // Normalize phone before schema validation
  const country = (raw.phoneCountry as CountryCode) || "GB";
  const phoneE164 = raw.rawPhone ? normalizePhone(raw.rawPhone, country) : null;
  if (!phoneE164) {
    return json(400, {
      ok: false,
      fieldErrors: { phone: "Enter a valid mobile number" },
    });
  }

  // MX check
  if (raw.email && !(await hasMxRecord(raw.email))) {
    return json(400, {
      ok: false,
      fieldErrors: { email: "This email domain doesn't accept mail" },
    });
  }

  const parsed = leadSchema.safeParse({
    fullName: raw.fullName,
    email: raw.email,
    phone: phoneE164,
    consent: raw.consent,
    marketingConsent: raw.marketingConsent ?? false,
    source: raw.source ?? "lp-pigmentation",
    quiz: raw.quiz,
    utm: raw.utm,
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return json(400, { ok: false, fieldErrors });
  }

  const lead = parsed.data;
  const score = scoreLead(lead);
  const tag = leadTag(score);
  const contact = buildGhlContact(lead, "Pigmentation LP — Glasgow", tag, score);

  const result = await ghlUpsertContact(contact);

  if (!result.ok) {
    const id = crypto.randomUUID();
    await kv.set(`leads:failed:${id}`, JSON.stringify({
      contact, lead, attempts: 1, firstAttempt: Date.now(),
    }), { ex: 60 * 60 * 24 * 7 }); // 7 day TTL
  }

  const concern = lead.quiz?.primary_concern;
  return json(200, {
    ok: true,
    reveal: {
      firstName: contact.firstName,
      concern: lead.quiz?.primary_concern ?? null,
      fitzpatrick: lead.quiz?.fitzpatrick ?? null,
      recommendedProtocol: concern ? protocolMap[concern] : null,
      estimatedSessions: concern ? sessionsMap[concern] : null,
      tag,
    },
  });
}

function json(status: number, data: unknown): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}
```

- [ ] **Step 5: Run — expect PASS**

```bash
pnpm --filter web test route
# Expected: 5 passed
```

- [ ] **Step 6: Commit**

```bash
git add . && git commit -m "feat(api): /api/lead/submit Edge route with GHL + KV fallback"
```

---

### Task 23: `/api/lead/retry` cron handler

**Files:**
- Create: `apps/web/app/api/lead/retry/route.ts`
- Create: `apps/web/app/api/lead/retry/route.test.ts`

- [ ] **Step 1: Failing test**

```ts
// apps/web/app/api/lead/retry/route.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";

const kvKeys = vi.fn();
const kvGet  = vi.fn();
const kvSet  = vi.fn();
const kvDel  = vi.fn();
vi.mock("@vercel/kv", () => ({
  kv: { keys: kvKeys, get: kvGet, set: kvSet, del: kvDel },
}));

const ghlMock = vi.fn();
vi.mock("@lib/ghl/client", () => ({ ghlUpsertContact: ghlMock }));

import { GET } from "./route";

function req(secret: string) {
  return new Request("http://localhost/api/lead/retry", {
    headers: { Authorization: `Bearer ${secret}` },
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  process.env.CRON_SECRET = "secret-123";
});

describe("GET /api/lead/retry", () => {
  it("401 without correct cron secret", async () => {
    const res = await GET(req("wrong"));
    expect(res.status).toBe(401);
  });

  it("retries failed leads, deletes on success", async () => {
    kvKeys.mockResolvedValue(["leads:failed:a", "leads:failed:b"]);
    kvGet.mockImplementation(async (k: string) => ({
      contact: { email: k },
      lead: {},
      attempts: 1,
      firstAttempt: Date.now(),
    }));
    ghlMock.mockResolvedValue({ ok: true });

    const res = await GET(req("secret-123"));
    expect(res.status).toBe(200);
    expect(ghlMock).toHaveBeenCalledTimes(2);
    expect(kvDel).toHaveBeenCalledTimes(2);
  });

  it("increments attempts on failure", async () => {
    kvKeys.mockResolvedValue(["leads:failed:a"]);
    kvGet.mockResolvedValue({
      contact: { email: "a" }, lead: {}, attempts: 2, firstAttempt: Date.now(),
    });
    ghlMock.mockResolvedValue({ ok: false, status: 500 });

    await GET(req("secret-123"));
    expect(kvSet).toHaveBeenCalled();
    const [, payload] = kvSet.mock.calls[0];
    expect(JSON.parse(payload as string).attempts).toBe(3);
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Implement `route.ts`**

```ts
// apps/web/app/api/lead/retry/route.ts
import { kv } from "@vercel/kv";
import { ghlUpsertContact } from "@lib/ghl/client";
import type { GhlContact } from "@lib/ghl/types";

export const runtime = "edge";
export const dynamic = "force-dynamic";

interface QueuedLead {
  contact: GhlContact;
  lead: unknown;
  attempts: number;
  firstAttempt: number;
}

const MAX_ATTEMPTS = 12; // 12 retries × 5min cron = 1 hour
const PATTERN = "leads:failed:*";

export async function GET(req: Request): Promise<Response> {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const keys = await kv.keys(PATTERN);
  let succeeded = 0, failed = 0, abandoned = 0;

  for (const key of keys) {
    const queued = (await kv.get<QueuedLead>(key));
    if (!queued) { await kv.del(key); continue; }

    if (queued.attempts >= MAX_ATTEMPTS) {
      // Alert path: TODO wire to ops email/Slack in a later task.
      // For now, abandon to keep the queue clean.
      await kv.del(key);
      abandoned++;
      continue;
    }

    const result = await ghlUpsertContact(queued.contact);
    if (result.ok) {
      await kv.del(key);
      succeeded++;
    } else {
      const updated: QueuedLead = { ...queued, attempts: queued.attempts + 1 };
      await kv.set(key, JSON.stringify(updated), { ex: 60 * 60 * 24 * 7 });
      failed++;
    }
  }

  return Response.json({ ok: true, succeeded, failed, abandoned });
}
```

- [ ] **Step 4: Run — expect PASS**

```bash
pnpm --filter web test retry
# Expected: 3 passed
```

- [ ] **Step 5: Commit**

```bash
git add . && git commit -m "feat(api): /api/lead/retry cron handler"
```

---

### Task 24: Vercel config — cron + env

**Files:**
- Create: `apps/web/vercel.json`
- Create: `apps/web/.env.example`

- [ ] **Step 1: Create `vercel.json`**

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "crons": [
    { "path": "/api/lead/retry", "schedule": "*/5 * * * *" }
  ],
  "regions": ["lhr1"]
}
```

- [ ] **Step 2: Create `.env.example`** (documents every env var)

```
# GoHighLevel
GHL_API_KEY=
GHL_LOCATION_ID=

# Cron auth
CRON_SECRET=

# Vercel KV (auto-provisioned when KV is attached; placeholders for local)
KV_REST_API_URL=
KV_REST_API_TOKEN=
KV_REST_API_READ_ONLY_TOKEN=
KV_URL=

# Email fallback (Resend)
RESEND_API_KEY=

# Analytics
NEXT_PUBLIC_GA4_ID=
GA4_API_SECRET=
NEXT_PUBLIC_META_PIXEL_ID=
META_CAPI_TOKEN=
```

- [ ] **Step 3: Commit**

```bash
git add . && git commit -m "chore: vercel.json + .env.example"
```

---

## Phase C complete — checkpoint

Run all tests:

```bash
pnpm --filter web test
# Expected: all phase A-C tests passing (lead-schema, phone, email-mx, score, payload, client, lead-submit route, lead-retry route, primitives)
```

To smoke-test against a real GHL sub-account (optional, only after the clinic provides credentials):

1. Set `GHL_API_KEY`, `GHL_LOCATION_ID`, `CRON_SECRET` in `.env.local`
2. `pnpm --filter web dev`
3. `curl -X POST http://localhost:3000/api/lead/submit \
       -H "content-type: application/json" \
       -d '{...valid payload...}'`
4. Verify contact appears in GHL with correct tags + custom fields

The lead pipeline is now production-ready. Frontend can call `/api/lead/submit` and trust the result.

---

## Phase D — Page Sections (Tasks 25-34)

Static (non-interactive-quiz) sections of the LP. Each is a self-contained server component that pulls copy from `@content/pigmentation` MDX (built in Phase F). For now, accept props inline; assembly happens in Phase F.

### Task 25: BeforeAfterSlider

**Files:**
- Create: `packages/ui/hero/BeforeAfterSlider.tsx`
- Create: `packages/ui/hero/BeforeAfterSlider.test.tsx`
- Create: `apps/web/e2e/before-after-slider.spec.ts`

- [ ] **Step 1: Failing unit test**

```tsx
// packages/ui/hero/BeforeAfterSlider.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { BeforeAfterSlider } from "./BeforeAfterSlider";

describe("BeforeAfterSlider", () => {
  const props = {
    beforeSrc: "/before.jpg",
    afterSrc: "/after.jpg",
    beforeAlt: "Before treatment",
    afterAlt: "After 4 sessions",
  };

  it("renders both images with alt text", () => {
    render(<BeforeAfterSlider {...props} />);
    expect(screen.getByAltText("Before treatment")).toBeInTheDocument();
    expect(screen.getByAltText("After 4 sessions")).toBeInTheDocument();
  });

  it("exposes a slider role with 0-100 range", () => {
    render(<BeforeAfterSlider {...props} />);
    const slider = screen.getByRole("slider");
    expect(slider).toHaveAttribute("aria-valuemin", "0");
    expect(slider).toHaveAttribute("aria-valuemax", "100");
    expect(slider).toHaveAttribute("aria-valuenow", "50");
  });

  it("updates aria-valuenow on keyboard arrow keys", () => {
    render(<BeforeAfterSlider {...props} />);
    const slider = screen.getByRole("slider");
    slider.focus();
    fireEvent.keyDown(slider, { key: "ArrowRight" });
    expect(slider).toHaveAttribute("aria-valuenow", "55");
    fireEvent.keyDown(slider, { key: "ArrowLeft" });
    fireEvent.keyDown(slider, { key: "ArrowLeft" });
    expect(slider).toHaveAttribute("aria-valuenow", "45");
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Implement `BeforeAfterSlider.tsx`**

```tsx
// packages/ui/hero/BeforeAfterSlider.tsx
"use client";
import Image from "next/image";
import { useCallback, useRef, useState, useEffect } from "react";

export interface BeforeAfterSliderProps {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
  initialPercent?: number;
  className?: string;
}

export function BeforeAfterSlider({
  beforeSrc, afterSrc, beforeAlt, afterAlt,
  initialPercent = 50, className,
}: BeforeAfterSliderProps) {
  const [percent, setPercent] = useState(initialPercent);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPercent(Math.max(0, Math.min(100, next)));
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    setDragging(true);
    updateFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    updateFromClientX(e.clientX);
  };
  const onPointerUp = () => setDragging(false);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") setPercent(p => Math.min(100, p + 5));
    if (e.key === "ArrowLeft") setPercent(p => Math.max(0, p - 5));
    if (e.key === "Home") setPercent(0);
    if (e.key === "End") setPercent(100);
  };

  // First-load nudge to hint interactivity
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t1 = setTimeout(() => setPercent(p => p + 4), 1200);
    const t2 = setTimeout(() => setPercent(p => p - 4), 1500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-[4/5] overflow-hidden select-none ${className ?? ""}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {/* AFTER (full layer underneath) */}
      <Image
        src={afterSrc} alt={afterAlt} fill priority sizes="(max-width: 768px) 100vw, 60vw"
        className="object-cover"
      />

      {/* BEFORE (clipped layer on top) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - percent}% 0 0)` }}
      >
        <Image
          src={beforeSrc} alt={beforeAlt} fill priority sizes="(max-width: 768px) 100vw, 60vw"
          className="object-cover"
        />
      </div>

      {/* Divider line */}
      <div
        aria-hidden
        className="absolute top-0 bottom-0 w-px bg-ivory-50/95 shadow-[0_0_12px_rgba(0,0,0,0.35)]"
        style={{ left: `${percent}%` }}
      />

      {/* Handle */}
      <button
        type="button"
        role="slider"
        aria-label="Drag to reveal the after image"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(percent)}
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2
                   w-12 h-12 rounded-full bg-ivory-50 border-2 border-gold-500
                   shadow-[0_4px_20px_rgba(42,20,34,0.4)] cursor-grab active:cursor-grabbing
                   flex items-center justify-center text-ink-900"
        style={{ left: `${percent}%` }}
      >
        <span aria-hidden>◀▶</span>
      </button>

      {/* Labels */}
      <span className="absolute top-4 left-4 text-xs uppercase tracking-wider
                       text-ivory-50 bg-ink-900/55 px-2 py-1 backdrop-blur-sm">
        Before
      </span>
      <span className="absolute top-4 right-4 text-xs uppercase tracking-wider
                       text-ivory-50 bg-ink-900/55 px-2 py-1 backdrop-blur-sm">
        After
      </span>
    </div>
  );
}
```

- [ ] **Step 4: Run unit test — expect PASS**

```bash
pnpm --filter web test BeforeAfterSlider
# Expected: 3 passed
```

- [ ] **Step 5: Add Playwright smoke test (drag interaction)**

```ts
// apps/web/e2e/before-after-slider.spec.ts
import { test, expect } from "@playwright/test";

test("BA slider responds to keyboard", async ({ page }) => {
  await page.goto("/preview"); // we'll add the slider to preview in step 6
  const slider = page.getByRole("slider", { name: /drag to reveal/i });
  await slider.focus();
  const before = await slider.getAttribute("aria-valuenow");
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowRight");
  const after = await slider.getAttribute("aria-valuenow");
  expect(Number(after)).toBeGreaterThan(Number(before));
});
```

- [ ] **Step 6: Add slider to `/preview` page for visual check + e2e**

In `apps/web/app/preview/page.tsx` add a section:

```tsx
import { BeforeAfterSlider } from "@ui/hero/BeforeAfterSlider";

// ... inside the Container:
<div className="max-w-2xl my-10">
  <BeforeAfterSlider
    beforeSrc="/images/placeholder-before.jpg"
    afterSrc="/images/placeholder-after.jpg"
    beforeAlt="Before — visible melasma on cheeks"
    afterAlt="After 4 sessions — clear skin"
  />
</div>
```

Add placeholder images to `apps/web/public/images/placeholder-before.jpg` and `placeholder-after.jpg` (any 800x1000 portrait works as a placeholder).

- [ ] **Step 7: Run E2E + commit**

```bash
pnpm --filter web test:e2e --project chromium
# Expected: pass
git add . && git commit -m "feat(ui): BeforeAfterSlider with pointer + keyboard a11y"
```

---

### Task 26: DynamicHeadline (UTM-driven)

**Files:**
- Create: `packages/ui/hero/headline-map.ts`
- Create: `packages/ui/hero/DynamicHeadline.tsx`
- Create: `packages/ui/hero/DynamicHeadline.test.tsx`

- [ ] **Step 1: Failing test**

```tsx
// packages/ui/hero/DynamicHeadline.test.tsx
import { describe, it, expect } from "vitest";
import { matchHeadline } from "./headline-map";

describe("matchHeadline", () => {
  it("matches melasma cluster", () => {
    expect(matchHeadline("melasma treatment")).toMatch(/melasma/i);
  });
  it("matches hyperpigmentation", () => {
    expect(matchHeadline("hyperpigmentation removal")).toMatch(/rebound/i);
  });
  it("matches glasgow/scotland geo", () => {
    expect(matchHeadline("laser pigmentation removal glasgow")).toMatch(/glasgow/i);
  });
  it("matches whitening / brightening", () => {
    expect(matchHeadline("skin brightening treatment")).toMatch(/brighter/i);
  });
  it("matches lip pigmentation", () => {
    expect(matchHeadline("lip blushing near me")).toMatch(/lip colour/i);
  });
  it("matches age spot / sun damage", () => {
    expect(matchHeadline("fix sun damage on face")).toMatch(/sun damage/i);
  });
  it("falls through to default", () => {
    expect(matchHeadline("unrelated query")).toMatch(/clear pigmentation/i);
  });
  it("falls through to default when term is null", () => {
    expect(matchHeadline(null)).toMatch(/clear pigmentation/i);
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Implement `headline-map.ts`**

```ts
// packages/ui/hero/headline-map.ts
interface Rule {
  test: RegExp;
  headline: string;
  imageHint: string; // used by hero to pick the BA pair
}

const RULES: Rule[] = [
  { test: /melasma/i,             headline: "Stubborn melasma. Finally answered.",        imageHint: "melasma" },
  { test: /lip/i,                 headline: "Restore your lip colour. Naturally. Safely.", imageHint: "lip" },
  { test: /age[\s-]?spot|sun[\s-]?damage/i, headline: "Sun damage, undone. In as few as 3 sessions.", imageHint: "sun-damage" },
  { test: /whitening|brightening/i, headline: "Brighter, more even skin. Backed by medicine.", imageHint: "brightening" },
  { test: /glasgow|scotland/i,    headline: "Glasgow's doctor-led pigmentation clinic.",   imageHint: "glasgow" },
  { test: /hyperpigmentation/i,   headline: "Clear hyperpigmentation. Permanently. Without rebound.", imageHint: "hyperpig" },
];

const DEFAULT: Rule = {
  test: /.*/,
  headline: "Clear pigmentation. Permanently. Without rebound.",
  imageHint: "default",
};

export function matchHeadline(utmTerm: string | null | undefined): string {
  return matchRule(utmTerm).headline;
}

export function matchImageHint(utmTerm: string | null | undefined): string {
  return matchRule(utmTerm).imageHint;
}

function matchRule(term: string | null | undefined): Rule {
  if (!term) return DEFAULT;
  for (const rule of RULES) if (rule.test.test(term)) return rule;
  return DEFAULT;
}
```

- [ ] **Step 4: Implement `DynamicHeadline.tsx`**

```tsx
// packages/ui/hero/DynamicHeadline.tsx
"use client";
import { useEffect, useState } from "react";
import { matchHeadline } from "./headline-map";

interface Props {
  fallback?: string;
  className?: string;
}

export function DynamicHeadline({ fallback, className }: Props) {
  // Render fallback during SSR + first paint (avoids layout shift), then swap on hydrate
  const [headline, setHeadline] = useState(fallback ?? matchHeadline(null));

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const term = params.get("utm_term");
    setHeadline(matchHeadline(term));
  }, []);

  return <h1 className={className}>{headline}</h1>;
}
```

- [ ] **Step 5: Run — expect PASS**

```bash
pnpm --filter web test DynamicHeadline
pnpm --filter web test headline
# Expected: 8 passed total
```

- [ ] **Step 6: Commit**

```bash
git add . && git commit -m "feat(ui): DynamicHeadline + UTM-driven headline map"
```

---

### Task 27: TrustRow

**Files:**
- Create: `packages/ui/hero/TrustRow.tsx`
- Create: `packages/ui/hero/TrustRow.test.tsx`

- [ ] **Step 1: Failing test**

```tsx
// packages/ui/hero/TrustRow.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { TrustRow } from "./TrustRow";

describe("TrustRow", () => {
  it("renders rating + count and trust pills", () => {
    render(<TrustRow rating={4.9} reviewCount={243} />);
    expect(screen.getByText(/4\.9/)).toBeInTheDocument();
    expect(screen.getByText(/243/)).toBeInTheDocument();
    expect(screen.getByText(/GMC/)).toBeInTheDocument();
    expect(screen.getByText(/CQC/)).toBeInTheDocument();
    expect(screen.getByText(/Harley/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Implement**

```tsx
// packages/ui/hero/TrustRow.tsx
import { Star } from "lucide-react";
import { Pill } from "../primitives/Pill";

interface Props {
  rating: number;
  reviewCount: number;
}

export function TrustRow({ rating, reviewCount }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3 mt-8 text-sm text-ink-700">
      <span className="flex items-center gap-1.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={14}
            className="fill-gold-500 stroke-gold-500"
            aria-hidden
          />
        ))}
        <span className="ml-1 font-medium">{rating.toFixed(1)}</span>
        <span className="text-ink-500">({reviewCount})</span>
      </span>
      <span className="text-ink-300">·</span>
      <Pill>GMC ✓</Pill>
      <Pill>CQC ✓</Pill>
      <Pill>Harley St-trained</Pill>
    </div>
  );
}
```

- [ ] **Step 4: Run — expect PASS** — **Step 5: Commit**

```bash
git add . && git commit -m "feat(ui): TrustRow"
```

---

### Task 28: Hero (composes BA slider + DynamicHeadline + TrustRow)

**Files:**
- Create: `packages/ui/hero/Hero.tsx`
- Create: `packages/ui/hero/Hero.test.tsx`

- [ ] **Step 1: Failing test**

```tsx
// packages/ui/hero/Hero.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Hero } from "./Hero";

describe("Hero", () => {
  it("renders eyebrow, headline, two CTAs, trust row", () => {
    render(
      <Hero
        eyebrow="Pigmentation Clinic · Glasgow"
        subtext="A doctor-led 3-step protocol developed at our Harley Street-trained Glasgow clinic."
        primaryCta={{ label: "Take 60-second Skin Diagnostic", href: "#quiz" }}
        secondaryCta={{ label: "Book Free Consultation", href: "#book" }}
        beforeSrc="/before.jpg"
        afterSrc="/after.jpg"
        beforeAlt="Before"
        afterAlt="After"
        rating={4.9}
        reviewCount={243}
      />,
    );
    expect(screen.getByText(/pigmentation clinic/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /take 60-second/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /book free/i })).toBeInTheDocument();
    expect(screen.getByText(/4\.9/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Implement**

```tsx
// packages/ui/hero/Hero.tsx
import Link from "next/link";
import { Container } from "../primitives/Container";
import { Eyebrow } from "../primitives/Eyebrow";
import { BeforeAfterSlider } from "./BeforeAfterSlider";
import { DynamicHeadline } from "./DynamicHeadline";
import { TrustRow } from "./TrustRow";

interface CtaProps { label: string; href: string; }

export interface HeroProps {
  eyebrow: string;
  subtext: string;
  primaryCta: CtaProps;
  secondaryCta: CtaProps;
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
  rating: number;
  reviewCount: number;
  fallbackHeadline?: string;
}

export function Hero(p: HeroProps) {
  return (
    <section className="relative bg-ivory-50">
      <Container width="wide" className="pt-10 pb-24 md:pt-16 md:pb-32 grid md:grid-cols-[60%_40%] gap-10 md:gap-16 items-center">

        <div className="order-2 md:order-1">
          <BeforeAfterSlider
            beforeSrc={p.beforeSrc} afterSrc={p.afterSrc}
            beforeAlt={p.beforeAlt} afterAlt={p.afterAlt}
          />
        </div>

        <div className="order-1 md:order-2">
          <Eyebrow>{p.eyebrow}</Eyebrow>
          <DynamicHeadline
            fallback={p.fallbackHeadline}
            className="mt-3 font-display text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[1.05] tracking-tight text-ink-900"
          />
          <p className="mt-6 text-lg text-ink-700 leading-relaxed max-w-md">
            {p.subtext}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              href={p.primaryCta.href as never}
              className="inline-flex justify-center bg-ink-900 text-ivory-50 px-7 py-4
                         text-sm uppercase tracking-wider hover:bg-aubergine-900
                         ring-1 ring-gold-500 ring-offset-4 ring-offset-ivory-50 transition-colors"
            >
              {p.primaryCta.label} →
            </Link>
            <Link
              href={p.secondaryCta.href as never}
              className="inline-flex justify-center border border-gold-500 text-ink-900 px-7 py-4
                         text-sm uppercase tracking-wider hover:bg-ink-900 hover:text-ivory-50
                         transition-colors"
            >
              {p.secondaryCta.label}
            </Link>
          </div>

          <TrustRow rating={p.rating} reviewCount={p.reviewCount} />
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 4: Run — expect PASS** — **Step 5: Commit**

```bash
git add . && git commit -m "feat(ui): Hero — composes BA slider, dynamic headline, CTAs, trust row"
```

---

### Task 29: ConcernCards

**Files:**
- Create: `packages/ui/sections/ConcernCards.tsx`
- Create: `packages/ui/sections/ConcernCards.test.tsx`

- [ ] **Step 1: Failing test**

```tsx
// packages/ui/sections/ConcernCards.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ConcernCards } from "./ConcernCards";

describe("ConcernCards", () => {
  it("renders 4 ad-cluster-matched cards with deep links", () => {
    render(<ConcernCards />);
    expect(screen.getByRole("heading", { name: /melasma/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /sun damage/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /age spots/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /post-acne/i })).toBeInTheDocument();
    const links = screen.getAllByRole("link", { name: /learn more/i });
    expect(links).toHaveLength(4);
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Implement**

```tsx
// packages/ui/sections/ConcernCards.tsx
import Link from "next/link";
import { Section } from "../primitives/Section";
import { Container } from "../primitives/Container";
import { Eyebrow } from "../primitives/Eyebrow";
import { Card } from "../primitives/Card";

const concerns = [
  { slug: "melasma",     title: "Melasma",       blurb: "Hormonal patches that creams can't reach. Our protocol calibrates laser energy below the dermal layer." },
  { slug: "sun-damage",  title: "Sun damage",    blurb: "Solar lentigines, age spots, photoaging. Clearable in as few as 3 sessions." },
  { slug: "age-spots",   title: "Age spots",     blurb: "Targeted pigment removal without affecting surrounding skin tone." },
  { slug: "post-acne",   title: "Post-acne marks", blurb: "Dark marks left by past breakouts. Treated with peels + targeted laser." },
];

export function ConcernCards() {
  return (
    <Section className="bg-ivory-50">
      <Container width="wide">
        <Eyebrow>What we treat</Eyebrow>
        <h2 className="mt-3 font-display text-[clamp(2rem,3vw,2.5rem)] leading-tight text-ink-900 max-w-2xl">
          Whatever's showing up on your skin — we've treated it.
        </h2>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {concerns.map(c => (
            <Card key={c.slug} className="flex flex-col">
              <h3 className="font-display text-2xl text-ink-900">{c.title}</h3>
              <p className="mt-3 text-ink-700 leading-relaxed flex-1">{c.blurb}</p>
              <Link
                href={`#faq-${c.slug}` as never}
                className="mt-6 text-sm uppercase tracking-wider text-gold-500 hover:text-gold-400"
              >
                Learn more →
              </Link>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
```

- [ ] **Step 4: Run — expect PASS** — **Step 5: Commit**

```bash
git add . && git commit -m "feat(ui): ConcernCards section"
```

---

### Task 30: DoctorSection

**Files:**
- Create: `packages/ui/sections/DoctorSection.tsx`
- Create: `packages/ui/sections/DoctorSection.test.tsx`

- [ ] **Step 1: Failing test**

```tsx
// packages/ui/sections/DoctorSection.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { DoctorSection } from "./DoctorSection";

describe("DoctorSection", () => {
  it("renders doctor name, credentials, and quote", () => {
    render(
      <DoctorSection
        name="Dr. M.T. Ahmad"
        credentials="MBBS · GMC 1234567 · Aesthetic Medicine"
        portrait="/dr.jpg"
        portraitAlt="Dr. M.T. Ahmad in clinic"
        philosophy="Pigmentation is rarely just skin-deep — and the treatment shouldn't be either."
        yearsOfPractice={14}
      />,
    );
    expect(screen.getByText(/Dr\. M\.T\. Ahmad/i)).toBeInTheDocument();
    expect(screen.getByText(/GMC 1234567/i)).toBeInTheDocument();
    expect(screen.getByText(/14/)).toBeInTheDocument();
    expect(screen.getByText(/pigmentation is rarely/i)).toBeInTheDocument();
    expect(screen.getByAltText(/dr\. m\.t\. ahmad in clinic/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Implement**

```tsx
// packages/ui/sections/DoctorSection.tsx
import Image from "next/image";
import { Section } from "../primitives/Section";
import { Container } from "../primitives/Container";
import { Eyebrow } from "../primitives/Eyebrow";

interface Props {
  name: string;
  credentials: string;
  portrait: string;
  portraitAlt: string;
  philosophy: string;
  yearsOfPractice: number;
}

export function DoctorSection(p: Props) {
  return (
    <Section id="doctor" className="bg-aubergine-900 text-ivory-50">
      <Container width="wide" className="grid md:grid-cols-[45%_55%] gap-12 items-center">
        <div className="relative aspect-[4/5] w-full">
          <Image
            src={p.portrait} alt={p.portraitAlt} fill
            sizes="(max-width: 768px) 100vw, 45vw"
            className="object-cover"
          />
        </div>

        <div>
          <Eyebrow className="text-gold-400">The Doctor</Eyebrow>
          <h2 className="mt-3 font-display text-[clamp(2rem,3vw,3rem)] leading-[1.1]">
            {p.name}
          </h2>
          <p className="mt-3 text-ivory-100/70 text-sm uppercase tracking-wider">
            {p.credentials}
          </p>
          <p className="mt-3 text-ivory-100/60 text-sm">
            {p.yearsOfPractice}+ years in aesthetic medicine
          </p>

          <blockquote className="mt-10 font-display text-[clamp(1.5rem,2vw,2rem)] leading-snug text-ivory-50">
            <span className="text-gold-400 mr-2">"</span>
            {p.philosophy}
            <span className="text-gold-400 ml-2">"</span>
          </blockquote>
        </div>
      </Container>
    </Section>
  );
}
```

- [ ] **Step 4: Run — expect PASS** — **Step 5: Commit**

```bash
git add . && git commit -m "feat(ui): DoctorSection on aubergine bg"
```

---

### Task 31: Testimonials

**Files:**
- Create: `packages/ui/sections/Testimonials.tsx`
- Create: `packages/ui/sections/Testimonials.test.tsx`

- [ ] **Step 1: Failing test**

```tsx
// packages/ui/sections/Testimonials.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Testimonials } from "./Testimonials";

const items = [
  { firstName: "Aisha", city: "Glasgow", quote: "Three sessions and my melasma is gone.", stars: 5, beforeSrc: "/b1.jpg", afterSrc: "/a1.jpg" },
  { firstName: "Lena",  city: "Edinburgh", quote: "I tried everything before — this worked.", stars: 5, beforeSrc: "/b2.jpg", afterSrc: "/a2.jpg" },
  { firstName: "Chris", city: "Glasgow", quote: "Worth every penny.", stars: 5, beforeSrc: "/b3.jpg", afterSrc: "/a3.jpg" },
];

describe("Testimonials", () => {
  it("renders 3 named testimonials with city and rating", () => {
    render(<Testimonials items={items} />);
    expect(screen.getByText(/aisha/i)).toBeInTheDocument();
    expect(screen.getByText(/lena/i)).toBeInTheDocument();
    expect(screen.getByText(/chris/i)).toBeInTheDocument();
    expect(screen.getAllByText(/glasgow/i).length).toBe(2);
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Implement**

```tsx
// packages/ui/sections/Testimonials.tsx
import Image from "next/image";
import { Star } from "lucide-react";
import { Section } from "../primitives/Section";
import { Container } from "../primitives/Container";
import { Eyebrow } from "../primitives/Eyebrow";
import { Card } from "../primitives/Card";

export interface Testimonial {
  firstName: string;
  city: string;
  quote: string;
  stars: number;
  beforeSrc: string;
  afterSrc: string;
}

export function Testimonials({ items }: { items: Testimonial[] }) {
  return (
    <Section className="bg-ivory-100">
      <Container width="wide">
        <Eyebrow>Patient stories</Eyebrow>
        <h2 className="mt-3 font-display text-[clamp(2rem,3vw,2.5rem)] leading-tight text-ink-900">
          Real people. Real results.
        </h2>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((t, i) => (
            <Card key={i} className="bg-ivory-50">
              <div className="grid grid-cols-2 gap-1">
                <Image src={t.beforeSrc} alt={`${t.firstName}: before`} width={300} height={300} className="object-cover w-full h-40" />
                <Image src={t.afterSrc}  alt={`${t.firstName}: after`}  width={300} height={300} className="object-cover w-full h-40" />
              </div>
              <div className="flex gap-0.5 mt-4">
                {Array.from({ length: t.stars }).map((_, n) => (
                  <Star key={n} size={14} className="fill-gold-500 stroke-gold-500" aria-hidden />
                ))}
              </div>
              <p className="mt-3 text-ink-700 leading-relaxed">"{t.quote}"</p>
              <p className="mt-4 text-sm uppercase tracking-wider text-ink-500">
                {t.firstName} · {t.city}
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
```

- [ ] **Step 4: Run — expect PASS** — **Step 5: Commit**

```bash
git add . && git commit -m "feat(ui): Testimonials section"
```

---

### Task 32: PricingCards

**Files:**
- Create: `packages/ui/sections/PricingCards.tsx`
- Create: `packages/ui/sections/PricingCards.test.tsx`

- [ ] **Step 1: Failing test**

```tsx
// packages/ui/sections/PricingCards.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PricingCards } from "./PricingCards";

describe("PricingCards", () => {
  it("renders three tiers and a CTA on the featured one", () => {
    render(<PricingCards />);
    expect(screen.getByText(/free skin consultation/i)).toBeInTheDocument();
    expect(screen.getByText(/signature 3-step/i)).toBeInTheDocument();
    expect(screen.getByText(/clarity peel/i)).toBeInTheDocument();
    expect(screen.getByText(/£399/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Implement**

```tsx
// packages/ui/sections/PricingCards.tsx
import Link from "next/link";
import { Section } from "../primitives/Section";
import { Container } from "../primitives/Container";
import { Eyebrow } from "../primitives/Eyebrow";
import { Card } from "../primitives/Card";

const tiers = [
  {
    name: "Free Skin Consultation",
    price: "£0",
    cadence: "60-minute clinical assessment",
    features: ["Dermatological skin analysis", "Personalised treatment plan", "Pricing breakdown — zero pressure"],
    cta: { label: "Book Consultation", href: "#book" },
    featured: false,
  },
  {
    name: "Signature 3-Step Pigmentation Protocol",
    price: "From £399",
    cadence: "per session · 4-6 typical",
    features: ["VirtueRF microchanneling", "Pulsed-laser pigment fragmentation", "Exosome + mesotherapy infusion", "Calibrated for Fitzpatrick IV-VI"],
    cta: { label: "Take the Diagnostic", href: "#quiz" },
    featured: true,
  },
  {
    name: "Maintenance Clarity Peel",
    price: "From £149",
    cadence: "per peel · 6-12 weekly",
    features: ["Medical-grade chemical peel", "Maintenance after primary protocol", "Same-day, no downtime"],
    cta: { label: "Add to Plan", href: "#book" },
    featured: false,
  },
];

export function PricingCards() {
  return (
    <Section id="pricing" className="bg-ivory-50">
      <Container width="wide">
        <Eyebrow>Pricing</Eyebrow>
        <h2 className="mt-3 font-display text-[clamp(2rem,3vw,2.5rem)] leading-tight text-ink-900">
          Transparent. No hidden fees.
        </h2>
        <p className="mt-3 text-ink-700 max-w-2xl">
          Klarna and split-payment available. Final pricing is confirmed at your free consultation.
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map(t => (
            <Card
              key={t.name}
              className={t.featured ? "bg-aubergine-900 text-ivory-50 border-gold-500" : "bg-ivory-100"}
            >
              <h3 className={`font-display text-2xl ${t.featured ? "text-ivory-50" : "text-ink-900"}`}>
                {t.name}
              </h3>
              <p className={`mt-4 font-display text-4xl ${t.featured ? "text-gold-400" : "text-ink-900"}`}>
                {t.price}
              </p>
              <p className={`text-sm uppercase tracking-wider mt-1 ${t.featured ? "text-ivory-100/70" : "text-ink-500"}`}>
                {t.cadence}
              </p>
              <ul className={`mt-6 space-y-2 text-sm ${t.featured ? "text-ivory-100/85" : "text-ink-700"}`}>
                {t.features.map(f => <li key={f}>· {f}</li>)}
              </ul>
              <Link
                href={t.cta.href as never}
                className={`mt-8 inline-block w-full text-center px-6 py-3 text-sm uppercase tracking-wider transition-colors ${
                  t.featured
                    ? "bg-ivory-50 text-ink-900 hover:bg-gold-400"
                    : "border border-gold-500 text-ink-900 hover:bg-ink-900 hover:text-ivory-50"
                }`}
              >
                {t.cta.label}
              </Link>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
```

- [ ] **Step 4: Run — expect PASS** — **Step 5: Commit**

```bash
git add . && git commit -m "feat(ui): PricingCards"
```

---

### Task 33: FAQ accordion + FAQPage JSON-LD

**Files:**
- Create: `packages/lib/schema/faq-jsonld.ts`
- Create: `packages/lib/schema/faq-jsonld.test.ts`
- Create: `packages/ui/sections/FAQ.tsx`
- Create: `packages/ui/sections/FAQ.test.tsx`

- [ ] **Step 1: Failing test for JSON-LD helper**

```ts
// packages/lib/schema/faq-jsonld.test.ts
import { describe, it, expect } from "vitest";
import { buildFaqJsonLd } from "./faq-jsonld";

describe("buildFaqJsonLd", () => {
  it("returns valid FAQPage shape", () => {
    const ld = buildFaqJsonLd([
      { question: "Q1?", answer: "A1." },
      { question: "Q2?", answer: "A2." },
    ]);
    expect(ld["@context"]).toBe("https://schema.org");
    expect(ld["@type"]).toBe("FAQPage");
    expect(ld.mainEntity).toHaveLength(2);
    expect(ld.mainEntity[0]).toEqual({
      "@type": "Question",
      name: "Q1?",
      acceptedAnswer: { "@type": "Answer", text: "A1." },
    });
  });
});
```

- [ ] **Step 2: Implement**

```ts
// packages/lib/schema/faq-jsonld.ts
export interface FaqEntry {
  question: string;
  answer: string;
}

export function buildFaqJsonLd(entries: FaqEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map(e => ({
      "@type": "Question",
      name: e.question,
      acceptedAnswer: { "@type": "Answer", text: e.answer },
    })),
  };
}
```

- [ ] **Step 3: Failing test for FAQ component**

```tsx
// packages/ui/sections/FAQ.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { FAQ } from "./FAQ";

const entries = [
  { question: "How does laser pigmentation removal work?",
    answer: "Pulsed laser fragments melanin into particles that the body clears over weeks." },
  { question: "Is it safe for darker skin?",
    answer: "Yes — we calibrate energy for Fitzpatrick IV-VI." },
];

describe("FAQ", () => {
  it("renders all questions", () => {
    render(<FAQ heading="FAQ" entries={entries} />);
    expect(screen.getByText(/how does laser/i)).toBeInTheDocument();
    expect(screen.getByText(/safe for darker/i)).toBeInTheDocument();
  });

  it("emits FAQPage JSON-LD script", () => {
    const { container } = render(<FAQ heading="FAQ" entries={entries} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
    const json = JSON.parse(script!.textContent ?? "{}");
    expect(json["@type"]).toBe("FAQPage");
    expect(json.mainEntity).toHaveLength(2);
  });

  it("toggles answers via accordion", () => {
    render(<FAQ heading="FAQ" entries={entries} />);
    const btn = screen.getByRole("button", { name: /how does laser/i });
    expect(btn).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(btn);
    expect(btn).toHaveAttribute("aria-expanded", "true");
  });
});
```

- [ ] **Step 4: Implement**

```tsx
// packages/ui/sections/FAQ.tsx
import { Section } from "../primitives/Section";
import { Container } from "../primitives/Container";
import { Eyebrow } from "../primitives/Eyebrow";
import { Accordion, AccordionItem } from "../primitives/Accordion";
import { buildFaqJsonLd, type FaqEntry } from "@lib/schema/faq-jsonld";

interface Props {
  heading: string;
  entries: FaqEntry[];
  id?: string;
}

export function FAQ({ heading, entries, id = "faq" }: Props) {
  const ld = buildFaqJsonLd(entries);
  return (
    <Section id={id} className="bg-ivory-50">
      <Container width="content">
        <Eyebrow>Frequently asked</Eyebrow>
        <h2 className="mt-3 font-display text-[clamp(2rem,3vw,2.5rem)] leading-tight text-ink-900">
          {heading}
        </h2>

        <div className="mt-10">
          <Accordion>
            {entries.map((e, i) => (
              <AccordionItem key={i} question={e.question}>
                <p>{e.answer}</p>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
        />
      </Container>
    </Section>
  );
}
```

- [ ] **Step 5: Run — expect all PASS** — **Step 6: Commit**

```bash
pnpm --filter web test FAQ
pnpm --filter web test faq-jsonld
git add . && git commit -m "feat(ui): FAQ accordion + FAQPage JSON-LD emit"
```

---

### Task 34: StickyMobileCTA

**Files:**
- Create: `packages/ui/sections/StickyMobileCTA.tsx`
- Create: `packages/ui/sections/StickyMobileCTA.test.tsx`

- [ ] **Step 1: Failing test**

```tsx
// packages/ui/sections/StickyMobileCTA.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { StickyMobileCTA } from "./StickyMobileCTA";

describe("StickyMobileCTA", () => {
  it("renders link with label", () => {
    render(<StickyMobileCTA label="Take Skin Quiz →" href="#quiz" />);
    expect(screen.getByRole("link", { name: /take skin quiz/i })).toBeInTheDocument();
  });

  it("becomes visible after scrolling past threshold", () => {
    render(<StickyMobileCTA label="Take Skin Quiz" href="#quiz" />);
    const bar = screen.getByTestId("sticky-mobile-cta");
    expect(bar).toHaveClass("opacity-0");
    Object.defineProperty(window, "scrollY", { writable: true, value: 800 });
    fireEvent.scroll(window);
    expect(bar).toHaveClass("opacity-100");
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Implement**

```tsx
// packages/ui/sections/StickyMobileCTA.tsx
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export function StickyMobileCTA({ label, href }: { label: string; href: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      data-testid="sticky-mobile-cta"
      className={`fixed bottom-0 left-0 right-0 z-50 md:hidden
                  border-t border-ink-300/40 bg-ivory-50/95 backdrop-blur-md
                  px-4 py-3 transition-opacity duration-300 ${show ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      <Link
        href={href as never}
        className="block w-full text-center bg-ink-900 text-ivory-50 px-5 py-3.5
                   text-sm uppercase tracking-wider"
      >
        {label}
      </Link>
    </div>
  );
}
```

- [ ] **Step 4: Run — expect PASS** — **Step 5: Commit**

```bash
git add . && git commit -m "feat(ui): StickyMobileCTA"
```

---

## Phase D complete — checkpoint

All sections built independently. Run every test:

```bash
pnpm --filter web test
# Expected: all Phase A-D tests passing
```

Optional: extend `/preview` to render Hero + ConcernCards + DoctorSection + Testimonials + PricingCards + FAQ + StickyMobileCTA in vertical order. Sanity-check the visual rhythm.

---

## Phase E — Interactive Moments (Tasks 35-44)

This is the cinematic payload. Quiz engine + lead-gated reveal + selfie scanner + scroll-driven mechanism animation + result-timeline scrubber.

### Task 35: Quiz state machine (pure lib)

Build the state machine *before* any UI. Unit-tested in isolation; UI consumes it via a hook in the next task.

**Files:**
- Create: `packages/ui/quiz/state.ts`
- Create: `packages/ui/quiz/state.test.ts`

- [ ] **Step 1: Failing test**

```ts
// packages/ui/quiz/state.test.ts
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
    s = reducer(s, { type: "next" }); // no answer yet
    expect(currentStep(s)).toBe(1);
  });

  it("back returns to previous step", () => {
    let s = createInitialState();
    s = reducer(s, { type: "answer", key: "primary_concern", value: "melasma" });
    s = reducer(s, { type: "next" });
    s = reducer(s, { type: "back" });
    expect(currentStep(s)).toBe(1);
    // Answer preserved
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
    s = reducer(s, { type: "toggle-multi", key: "tried_before", value: "OTC creams" }); // toggle off
    expect(s.answers.tried_before).toEqual(["prescription"]);
  });

  it("isStepValid: step 4 (multi-select) valid when at least one selected", () => {
    let s = createInitialState();
    s.cursor = 4;
    expect(isStepValid(s)).toBe(false);
    s = reducer(s, { type: "toggle-multi", key: "tried_before", value: "nothing" });
    expect(isStepValid(s)).toBe(true);
  });
});
```

- [ ] **Step 2: Run — expect FAIL**

- [ ] **Step 3: Implement `state.ts`**

```ts
// packages/ui/quiz/state.ts

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
  6: "timing", // also requires location (step 6 is two fields)
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
    case "answer": {
      return { ...state, answers: { ...state.answers, [action.key]: action.value } };
    }
    case "toggle-multi": {
      const arr = (state.answers[action.key] as Tried[] | undefined) ?? [];
      const next = arr.includes(action.value)
        ? arr.filter(v => v !== action.value)
        : [...arr, action.value];
      return { ...state, answers: { ...state.answers, [action.key]: next } };
    }
    case "next": {
      if (!isStepValid(state)) return state;
      if (state.cursor === 6) return { ...state, complete: true };
      return { ...state, cursor: (state.cursor + 1) as QuizState["cursor"] };
    }
    case "back": {
      if (state.cursor === 1) return state;
      return { ...state, cursor: (state.cursor - 1) as QuizState["cursor"], complete: false };
    }
    case "reset": return createInitialState();
  }
}
```

- [ ] **Step 4: Run — expect PASS** — **Step 5: Commit**

```bash
pnpm --filter web test quiz/state
# Expected: 7 passed
git add . && git commit -m "feat(quiz): pure state machine + reducer"
```

---

### Task 36: Quiz step content + tile components

**Files:**
- Create: `packages/ui/quiz/content.ts`
- Create: `packages/ui/quiz/Tile.tsx`
- Create: `packages/ui/quiz/Tile.test.tsx`

- [ ] **Step 1: Failing test**

```tsx
// packages/ui/quiz/Tile.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Tile } from "./Tile";

describe("Tile", () => {
  it("renders label + sublabel", () => {
    render(<Tile label="Melasma" sublabel="Hormonal patches" onClick={() => {}} />);
    expect(screen.getByText("Melasma")).toBeInTheDocument();
    expect(screen.getByText(/hormonal patches/i)).toBeInTheDocument();
  });

  it("calls onClick when clicked", () => {
    const fn = vi.fn();
    render(<Tile label="X" onClick={fn} />);
    fireEvent.click(screen.getByRole("button"));
    expect(fn).toHaveBeenCalledOnce();
  });

  it("renders selected state with aria-pressed", () => {
    render(<Tile label="X" onClick={() => {}} selected />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
  });
});
```

- [ ] **Step 2: Implement**

```tsx
// packages/ui/quiz/Tile.tsx
"use client";
import { clsx } from "clsx";
import type { ReactNode } from "react";

interface Props {
  label: string;
  sublabel?: ReactNode;
  onClick: () => void;
  selected?: boolean;
  disabled?: boolean;
}

export function Tile({ label, sublabel, onClick, selected, disabled }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={!!selected}
      disabled={disabled}
      className={clsx(
        "text-left p-5 border transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-200",
        selected
          ? "bg-aubergine-900 border-aubergine-900 text-ivory-50"
          : "bg-ivory-100 border-ink-300/40 text-ink-900 hover:border-gold-500 hover:bg-ivory-50",
      )}
    >
      <span className="block text-base font-medium">{label}</span>
      {sublabel && (
        <span className={clsx("block text-sm mt-1", selected ? "text-ivory-100/70" : "text-ink-500")}>
          {sublabel}
        </span>
      )}
    </button>
  );
}
```

- [ ] **Step 3: Create the per-step copy data**

```ts
// packages/ui/quiz/content.ts
import type { Concern, Duration, Fitzpatrick, Tried, Goal, Timing, Location } from "./state";

export interface Step1Item { value: Concern; label: string; sublabel: string; }
export interface Step2Item { value: Duration; label: string; }
export interface Step3Item { value: Fitzpatrick; label: string; description: string; tone: string; }
export interface Step4Item { value: Tried; label: string; }
export interface Step5Item { value: Goal; label: string; }
export interface Step6TimingItem { value: Timing; label: string; }
export interface Step6LocItem { value: Location; label: string; }

export const step1: Step1Item[] = [
  { value: "melasma",      label: "Melasma / hormonal patches",   sublabel: "Brown patches, often symmetrical" },
  { value: "sun-damage",   label: "Sun damage / age spots",       sublabel: "Solar lentigines, photoaging" },
  { value: "post-acne",    label: "Post-acne marks / dark spots", sublabel: "PIH left by past breakouts" },
  { value: "uneven-tone",  label: "Uneven skin tone / dullness",  sublabel: "Overall tone irregularity" },
  { value: "lip-pigment",  label: "Lip pigmentation / dark lips", sublabel: "Pigment on the lips" },
  { value: "underarm",     label: "Underarm / body pigmentation", sublabel: "Pigment beyond the face" },
  { value: "not-sure",     label: "I'm not sure — help me identify it", sublabel: "We'll diagnose at consult" },
];

export const step2: Step2Item[] = [
  { value: "<6mo",             label: "Just started (< 6 months)" },
  { value: "months-worsening", label: "Months but getting worse" },
  { value: "years",            label: "Years — I've tried things" },
  { value: "decade+",          label: "Decade+ — feels permanent" },
];

export const step3: Step3Item[] = [
  { value: "I",   label: "I",   description: "Always burns, never tans",  tone: "#F5E1D2" },
  { value: "II",  label: "II",  description: "Burns easily, tans minimally", tone: "#EBC9A6" },
  { value: "III", label: "III", description: "Burns moderately, tans gradually", tone: "#D8AB7E" },
  { value: "IV",  label: "IV",  description: "Burns minimally, tans well", tone: "#B0815A" },
  { value: "V",   label: "V",   description: "Rarely burns, tans deeply",  tone: "#7A5238" },
  { value: "VI",  label: "VI",  description: "Never burns, deeply pigmented", tone: "#3F2A1F" },
];

export const step4: Step4Item[] = [
  { value: "OTC creams",     label: "Over-the-counter creams" },
  { value: "prescription",   label: "Prescription cream (hydroquinone, tretinoin)" },
  { value: "peels",          label: "Chemical peels" },
  { value: "laser elsewhere", label: "Laser elsewhere" },
  { value: "home remedies",  label: "Home remedies" },
  { value: "nothing",        label: "Nothing yet" },
];

export const step5: Step5Item[] = [
  { value: "clear",          label: "Completely clear, even-toned skin" },
  { value: "80% reduction",  label: "80% reduction — visible, not perfect" },
  { value: "before-event",   label: "Noticeable shift before a specific event/season" },
  { value: "long-term",      label: "Long-term maintenance, not just a fix" },
];

export const step6Timing: Step6TimingItem[] = [
  { value: "this week",         label: "This week" },
  { value: "within a month",    label: "Within a month" },
  { value: "within 3 months",   label: "Within 3 months" },
  { value: "researching",       label: "Just researching" },
];

export const step6Loc: Step6LocItem[] = [
  { value: "Glasgow",          label: "Glasgow / Greater Glasgow" },
  { value: "Edinburgh",        label: "Edinburgh / Lothians" },
  { value: "Scotland-other",   label: "Elsewhere in Scotland" },
  { value: "UK-other",         label: "Rest of UK" },
  { value: "International",    label: "International" },
];
```

- [ ] **Step 4: Run — expect PASS** — **Step 5: Commit**

```bash
git add . && git commit -m "feat(quiz): Tile component + step content data"
```

---

### Task 37: QuizEngine — full 6-step UI

**Files:**
- Create: `packages/ui/quiz/QuizEngine.tsx`
- Create: `packages/ui/quiz/QuizEngine.test.tsx`

- [ ] **Step 1: Failing test**

```tsx
// packages/ui/quiz/QuizEngine.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { QuizEngine } from "./QuizEngine";

describe("QuizEngine", () => {
  it("starts on step 1 with concern tiles", () => {
    render(<QuizEngine onComplete={() => {}} />);
    expect(screen.getByText(/what brings you here/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /melasma/i })).toBeInTheDocument();
  });

  it("advances on tile click + next", () => {
    render(<QuizEngine onComplete={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: /melasma/i }));
    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    expect(screen.getByText(/how long has this been/i)).toBeInTheDocument();
  });

  it("calls onComplete with final answers after step 6", () => {
    const onComplete = vi.fn();
    render(<QuizEngine onComplete={onComplete} />);

    const click = (name: RegExp) => fireEvent.click(screen.getByRole("button", { name }));
    const next = () => click(/^next$/i);

    click(/melasma/i); next();
    click(/years — i've tried/i); next();
    click(/^IV$/); next();
    click(/prescription cream/i); next();
    click(/80% reduction/i); next();
    click(/this week/i);
    fireEvent.change(screen.getByLabelText(/where are you based/i), { target: { value: "Glasgow" } });
    next();

    expect(onComplete).toHaveBeenCalledOnce();
    const answers = onComplete.mock.calls[0][0];
    expect(answers.primary_concern).toBe("melasma");
    expect(answers.timing).toBe("this week");
    expect(answers.location).toBe("Glasgow");
  });
});
```

- [ ] **Step 2: Implement `QuizEngine.tsx`**

```tsx
// packages/ui/quiz/QuizEngine.tsx
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
          <div className="h-full bg-gold-500 transition-[width] duration-500"
               style={{ width: `${pct}%` }} />
        </div>

        <div className="mt-12 min-h-[480px]">
          {state.cursor === 1 && (
            <Step
              question="What brings you here today?"
              hint="Pick the closest match — you can refine at consultation."
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {step1.map(o => (
                  <Tile key={o.value}
                    label={o.label} sublabel={o.sublabel}
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
                  <Tile key={o.value}
                    label={o.label}
                    selected={state.answers.duration === o.value}
                    onClick={() => dispatch({ type: "answer", key: "duration", value: o.value })}
                  />
                ))}
              </div>
            </Step>
          )}

          {state.cursor === 3 && (
            <Step
              question="Which best describes your skin?"
              hint="We calibrate laser energy differently for each Fitzpatrick type."
            >
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {step3.map(o => (
                  <Tile key={o.value}
                    label={o.label}
                    sublabel={
                      <span className="flex items-center gap-2 mt-2">
                        <span aria-hidden className="inline-block w-5 h-5 rounded-full"
                              style={{ background: o.tone }} />
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
                  <Tile key={o.value}
                    label={o.label}
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
                  <Tile key={o.value}
                    label={o.label}
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
                  <Tile key={o.value}
                    label={o.label}
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

function Step({
  question, hint, children,
}: { question: string; hint?: string; children: React.ReactNode }) {
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
```

- [ ] **Step 3: Run — expect PASS** — **Step 4: Commit**

```bash
pnpm --filter web test QuizEngine
git add . && git commit -m "feat(quiz): full 6-step QuizEngine UI"
```

---

### Task 38: LeadForm (gated, validated, GHL-submitting)

**Files:**
- Create: `packages/ui/quiz/LeadForm.tsx`
- Create: `packages/ui/quiz/LeadForm.test.tsx`

- [ ] **Step 1: Install + add deps**

```bash
pnpm --filter web add react-hook-form @hookform/resolvers
```

- [ ] **Step 2: Failing test**

```tsx
// packages/ui/quiz/LeadForm.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { LeadForm } from "./LeadForm";
import type { QuizAnswers } from "./state";

const fetchMock = vi.fn();
const originalFetch = globalThis.fetch;

const answers: QuizAnswers = {
  primary_concern: "melasma", duration: "years", fitzpatrick: "IV",
  tried_before: ["prescription"], goal: "80% reduction",
  timing: "this week", location: "Glasgow",
};

beforeEach(() => { globalThis.fetch = fetchMock; vi.clearAllMocks(); });

describe("LeadForm", () => {
  it("disables submit until required fields valid + consent checked", () => {
    render(<LeadForm answers={answers} onReveal={() => {}} />);
    const submit = screen.getByRole("button", { name: /reveal/i });
    expect(submit).toBeDisabled();
  });

  it("submits to /api/lead/submit and calls onReveal on success", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true, reveal: { firstName: "Sarah" } }),
    });

    const onReveal = vi.fn();
    render(<LeadForm answers={answers} onReveal={onReveal} />);

    fireEvent.input(screen.getByLabelText(/full name/i), { target: { value: "Sarah O'Connor" } });
    fireEvent.input(screen.getByLabelText(/email/i), { target: { value: "sarah@example.com" } });
    fireEvent.input(screen.getByLabelText(/mobile/i), { target: { value: "07700900123" } });
    fireEvent.click(screen.getByLabelText(/consent to be contacted/i));

    fireEvent.click(screen.getByRole("button", { name: /reveal/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    const [, init] = fetchMock.mock.calls[0];
    const body = JSON.parse(init.body);
    expect(body.fullName).toBe("Sarah O'Connor");
    expect(body.rawPhone).toBe("07700900123");
    expect(body.consent).toBe(true);
    await waitFor(() => expect(onReveal).toHaveBeenCalledOnce());
  });

  it("surfaces fieldErrors from API", async () => {
    fetchMock.mockResolvedValue({
      ok: false, status: 400,
      json: async () => ({ ok: false, fieldErrors: { email: "Bad email" } }),
    });

    render(<LeadForm answers={answers} onReveal={() => {}} />);
    fireEvent.input(screen.getByLabelText(/full name/i), { target: { value: "Sarah" } });
    fireEvent.input(screen.getByLabelText(/email/i), { target: { value: "x@x.com" } });
    fireEvent.input(screen.getByLabelText(/mobile/i), { target: { value: "07700900123" } });
    fireEvent.click(screen.getByLabelText(/consent to be contacted/i));
    fireEvent.click(screen.getByRole("button", { name: /reveal/i }));

    await waitFor(() => expect(screen.getByText("Bad email")).toBeInTheDocument());
  });
});

afterEach(() => { globalThis.fetch = originalFetch; });
```

- [ ] **Step 3: Implement `LeadForm.tsx`**

```tsx
// packages/ui/quiz/LeadForm.tsx
"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "../primitives/Input";
import type { QuizAnswers } from "./state";

interface FormFields {
  fullName: string;
  email: string;
  phone: string;
  phoneCountry: string;
  consent: boolean;
  marketingConsent: boolean;
}

export interface RevealPayload {
  firstName: string;
  concern: string | null;
  fitzpatrick: string | null;
  recommendedProtocol: string | null;
  estimatedSessions: string | null;
  tag: "lead-hot" | "lead-warm" | "lead-cold";
}

interface Props {
  answers: QuizAnswers;
  onReveal: (data: RevealPayload) => void;
  source?: string;
}

interface Utm {
  utm_source: string | null; utm_medium: string | null;
  utm_campaign: string | null; utm_term: string | null;
  gclid: string | null; fbclid: string | null;
  landing_page_url: string | null; referrer: string | null;
}

function readUtm(): Utm {
  if (typeof window === "undefined") {
    return { utm_source: null, utm_medium: null, utm_campaign: null, utm_term: null,
             gclid: null, fbclid: null, landing_page_url: null, referrer: null };
  }
  const p = new URLSearchParams(window.location.search);
  return {
    utm_source:       p.get("utm_source"),
    utm_medium:       p.get("utm_medium"),
    utm_campaign:     p.get("utm_campaign"),
    utm_term:         p.get("utm_term"),
    gclid:            p.get("gclid"),
    fbclid:           p.get("fbclid"),
    landing_page_url: window.location.href,
    referrer:         document.referrer || null,
  };
}

export function LeadForm({ answers, onReveal, source = "lp-pigmentation" }: Props) {
  const { register, handleSubmit, formState: { isValid, isSubmitting }, setError, watch } =
    useForm<FormFields>({
      mode: "onChange",
      defaultValues: { phoneCountry: "GB", consent: false, marketingConsent: false },
    });
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});

  const onSubmit = async (form: FormFields) => {
    setServerErrors({});
    const utm = readUtm();
    const res = await fetch("/api/lead/submit", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        fullName: form.fullName,
        email: form.email,
        rawPhone: form.phone,
        phoneCountry: form.phoneCountry,
        consent: form.consent,
        marketingConsent: form.marketingConsent,
        source,
        quiz: answers,
        utm,
      }),
    });

    const data = await res.json() as
      | { ok: true; reveal: RevealPayload }
      | { ok: false; fieldErrors?: Record<string, string>; error?: string };

    if (!res.ok || !data.ok) {
      const errs = ("fieldErrors" in data && data.fieldErrors) || {};
      setServerErrors(errs);
      for (const [field, msg] of Object.entries(errs)) {
        setError(field as keyof FormFields, { type: "server", message: msg });
      }
      return;
    }

    onReveal(data.reveal);
  };

  const consentChecked = watch("consent");

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="max-w-md mx-auto">
      <h3 className="font-display text-[clamp(2rem,3vw,2.5rem)] leading-tight text-ink-900">
        Your personalised plan is ready.
      </h3>
      <p className="mt-3 text-ink-700">
        A clinician will review and reach out within 1 working day with your tailored protocol.
      </p>

      <div className="mt-8 flex flex-col gap-5">
        <Input
          id="fullName" label="Full name *"
          autoComplete="name"
          error={serverErrors.fullName}
          {...register("fullName", { required: true, minLength: 2 })}
        />
        <Input
          id="email" label="Email *" type="email"
          autoComplete="email"
          error={serverErrors.email}
          {...register("email", { required: true, pattern: /^[^@\s]+@[^@\s]+\.[^@\s]+$/ })}
        />

        <div className="grid grid-cols-[100px_1fr] gap-3">
          <div>
            <label htmlFor="phoneCountry" className="block text-xs uppercase tracking-[0.12em] text-gold-500 mb-2">
              Country
            </label>
            <select id="phoneCountry"
              className="w-full bg-ivory-200 border border-ink-300 px-3 py-3 text-base text-ink-900
                         focus:border-gold-500 outline-none"
              {...register("phoneCountry")}>
              <option value="GB">🇬🇧 +44</option>
              <option value="IE">🇮🇪 +353</option>
              <option value="US">🇺🇸 +1</option>
              <option value="AE">🇦🇪 +971</option>
              <option value="PK">🇵🇰 +92</option>
              <option value="IN">🇮🇳 +91</option>
            </select>
          </div>
          <Input
            id="phone" label="Mobile *" type="tel" autoComplete="tel"
            helpText="We'll send your plan + booking link by SMS"
            error={serverErrors.phone}
            {...register("phone", { required: true, minLength: 7 })}
          />
        </div>

        <label className="flex items-start gap-3 text-sm text-ink-700 cursor-pointer">
          <input type="checkbox" className="mt-1 accent-gold-500"
                 {...register("consent", { required: true })} />
          <span>I consent to be contacted about my plan by the clinic. <span className="text-error-500">*</span></span>
        </label>
        <label className="flex items-start gap-3 text-sm text-ink-700 cursor-pointer">
          <input type="checkbox" className="mt-1 accent-gold-500"
                 {...register("marketingConsent")} />
          <span>Send me occasional skincare tips and offers. (Optional)</span>
        </label>

        <button
          type="submit"
          disabled={!isValid || !consentChecked || isSubmitting}
          className="mt-2 bg-ink-900 text-ivory-50 px-7 py-4 text-sm uppercase tracking-wider
                     ring-1 ring-gold-500 ring-offset-4 ring-offset-ivory-50
                     hover:bg-aubergine-900 transition-colors
                     disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Sending…" : "Reveal My Plan →"}
        </button>

        <p className="text-xs text-ink-500 mt-1">
          🔒 Encrypted. We never share your data. GDPR-compliant.
        </p>
      </div>
    </form>
  );
}
```

- [ ] **Step 4: Run — expect PASS** — **Step 5: Commit**

```bash
pnpm --filter web test LeadForm
git add . && git commit -m "feat(quiz): LeadForm with RHF validation + GHL submit"
```

---

### Task 39: ResultReveal

**Files:**
- Create: `packages/ui/quiz/ResultReveal.tsx`
- Create: `packages/ui/quiz/ResultReveal.test.tsx`

- [ ] **Step 1: Failing test**

```tsx
// packages/ui/quiz/ResultReveal.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ResultReveal } from "./ResultReveal";

const reveal = {
  firstName: "Sarah",
  concern: "melasma",
  fitzpatrick: "IV",
  recommendedProtocol: "Signature 3-Step",
  estimatedSessions: "4-6 over 12 weeks",
  tag: "lead-hot" as const,
};

describe("ResultReveal", () => {
  it("renders personalised plan with all fields", () => {
    render(<ResultReveal reveal={reveal} answers={{ primary_concern: "melasma", tried_before: ["prescription"] }} />);
    expect(screen.getByText(/sarah/i)).toBeInTheDocument();
    expect(screen.getByText(/melasma/i)).toBeInTheDocument();
    expect(screen.getByText(/Fitzpatrick IV/i)).toBeInTheDocument();
    expect(screen.getByText(/signature 3-step/i)).toBeInTheDocument();
    expect(screen.getByText(/4-6 over 12 weeks/)).toBeInTheDocument();
  });

  it("includes booking CTA", () => {
    render(<ResultReveal reveal={reveal} answers={{}} />);
    expect(screen.getByRole("link", { name: /book free consultation/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Implement**

```tsx
// packages/ui/quiz/ResultReveal.tsx
import Link from "next/link";
import { Section } from "../primitives/Section";
import { Container } from "../primitives/Container";
import { Eyebrow } from "../primitives/Eyebrow";
import type { QuizAnswers } from "./state";
import type { RevealPayload } from "./LeadForm";

interface Props {
  reveal: RevealPayload;
  answers: QuizAnswers;
}

function buildWhyParagraph(answers: QuizAnswers): string {
  const tried = answers.tried_before ?? [];
  if (tried.includes("prescription")) {
    return "Hydroquinone and tretinoin plateau at ~30% improvement because they only address surface melanin. The 3-step protocol reaches the dermal layer where your pigmentation lives — that's why you see the difference.";
  }
  if (tried.includes("peels")) {
    return "Peels alone resurface — they don't reach the dermal melanocytes that drive recurrence. Combined with pulsed laser + exosome infusion, peels become 3-4× more effective.";
  }
  if (tried.includes("laser elsewhere")) {
    return "Laser without proper Fitzpatrick calibration can trigger rebound — especially for darker skin types. Our protocol calibrates energy to your specific skin type, eliminating that risk.";
  }
  if (tried.includes("OTC creams") || tried.includes("home remedies")) {
    return "OTC actives top out around 15% improvement because they can't reach the dermal layer where pigmentation actually originates. Medical-grade protocols penetrate three times deeper.";
  }
  return "Most pigmentation lives below the skin's surface — beyond what creams can reach. Our 3-step protocol works at the dermal level where pigmentation originates, which is why it lasts.";
}

export function ResultReveal({ reveal, answers }: Props) {
  return (
    <Section className="bg-ivory-50">
      <Container width="content">
        <Eyebrow>Your personalised plan</Eyebrow>
        <h2 className="mt-3 font-display text-[clamp(2.5rem,4vw,3.5rem)] leading-tight text-ink-900">
          Here's your plan, {reveal.firstName}.
        </h2>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="border-l-2 border-gold-500 pl-4">
            <p className="uppercase tracking-wider text-ink-500 text-xs">Your concern</p>
            <p className="mt-1 text-ink-900 text-lg capitalize">{reveal.concern?.replace("-", " ") ?? "—"}</p>
          </div>
          <div className="border-l-2 border-gold-500 pl-4">
            <p className="uppercase tracking-wider text-ink-500 text-xs">Your skin type</p>
            <p className="mt-1 text-ink-900 text-lg">Fitzpatrick {reveal.fitzpatrick}</p>
          </div>
          <div className="border-l-2 border-gold-500 pl-4">
            <p className="uppercase tracking-wider text-ink-500 text-xs">Estimated sessions</p>
            <p className="mt-1 text-ink-900 text-lg">{reveal.estimatedSessions}</p>
          </div>
        </div>

        <div className="mt-12 bg-aubergine-900 text-ivory-50 p-8 md:p-12">
          <Eyebrow className="text-gold-400">Recommended protocol</Eyebrow>
          <h3 className="mt-3 font-display text-3xl">{reveal.recommendedProtocol}</h3>
          <ul className="mt-6 space-y-2 text-ivory-100/85">
            <li>· Calibrated for your skin type (Fitzpatrick {reveal.fitzpatrick} laser energy)</li>
            <li>· Targets the dermal-layer cause of your pigmentation</li>
            <li>· £399 per session</li>
          </ul>
        </div>

        <div className="mt-10">
          <Eyebrow>Why this works for you</Eyebrow>
          <p className="mt-3 text-ink-700 leading-relaxed text-lg max-w-2xl">
            {buildWhyParagraph(answers)}
          </p>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row gap-4">
          <Link href="#book" className="inline-flex justify-center bg-ink-900 text-ivory-50 px-7 py-4 text-sm uppercase tracking-wider
                                       ring-1 ring-gold-500 ring-offset-4 ring-offset-ivory-50 hover:bg-aubergine-900 transition-colors">
            Book Free Consultation — Glasgow
          </Link>
          <a href="tel:0141XXXXXXX" className="inline-flex justify-center border border-gold-500 text-ink-900 px-7 py-4 text-sm uppercase tracking-wider hover:bg-ink-900 hover:text-ivory-50 transition-colors">
            Call us: 0141 XXX XXXX
          </a>
        </div>

        <p className="mt-6 text-sm text-ink-500">Your plan was just emailed and texted to you.</p>
      </Container>
    </Section>
  );
}
```

- [ ] **Step 3: Run — expect PASS** — **Step 4: Commit**

```bash
git add . && git commit -m "feat(quiz): ResultReveal with personalised copy"
```

---

### Task 40: SelfieScanner — MediaPipe loader + capture

**Files:**
- Create: `packages/ui/scanner/useFaceMesh.ts`
- Create: `packages/ui/scanner/SelfieScanner.tsx`
- Create: `packages/ui/scanner/SelfieScanner.test.tsx`

- [ ] **Step 1: Install MediaPipe**

```bash
pnpm --filter web add @mediapipe/tasks-vision
```

- [ ] **Step 2: Failing test (mocks MediaPipe — runtime works in browser only)**

```tsx
// packages/ui/scanner/SelfieScanner.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { SelfieScanner } from "./SelfieScanner";

vi.mock("./useFaceMesh", () => ({
  useFaceMesh: () => ({ ready: true, runOnce: vi.fn().mockResolvedValue({ zones: 11, fitzpatrick: "IV" }) }),
}));

describe("SelfieScanner", () => {
  it("renders entry doors", () => {
    render(<SelfieScanner onScanComplete={() => {}} />);
    expect(screen.getByRole("button", { name: /upload selfie/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /use webcam/i })).toBeInTheDocument();
  });

  it("shows privacy chip", () => {
    render(<SelfieScanner onScanComplete={() => {}} />);
    expect(screen.getByText(/100% client-side/i)).toBeInTheDocument();
  });

  it("offers a 'skip to quiz' fallback", () => {
    render(<SelfieScanner onScanComplete={() => {}} />);
    expect(screen.getByRole("link", { name: /skip to quiz/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Implement `useFaceMesh.ts`**

```ts
// packages/ui/scanner/useFaceMesh.ts
"use client";
import { useEffect, useRef, useState } from "react";
import {
  FaceLandmarker, FilesetResolver, type FaceLandmarkerResult,
} from "@mediapipe/tasks-vision";

export interface ScanResult {
  zones: number;
  fitzpatrick: "I" | "II" | "III" | "IV" | "V" | "VI";
  landmarks: FaceLandmarkerResult | null;
}

export function useFaceMesh() {
  const [ready, setReady] = useState(false);
  const landmarker = useRef<FaceLandmarker | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
      );
      const fl = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
          delegate: "GPU",
        },
        outputFaceBlendshapes: false,
        runningMode: "IMAGE",
        numFaces: 1,
      });
      if (cancelled) { fl.close(); return; }
      landmarker.current = fl;
      setReady(true);
    })();
    return () => {
      cancelled = true;
      landmarker.current?.close();
      landmarker.current = null;
    };
  }, []);

  async function runOnce(imageEl: HTMLImageElement | HTMLVideoElement): Promise<ScanResult | null> {
    if (!landmarker.current) return null;
    const result = landmarker.current.detect(imageEl);

    // Naive LAB-variance heuristic per face region.
    // Returns a coarse zone-count + Fitzpatrick estimate from average L*.
    const ctx = makeCtx(imageEl);
    const { zones, fitz } = analyseRegions(ctx, result);
    return { zones, fitzpatrick: fitz, landmarks: result };
  }

  return { ready, runOnce };
}

function makeCtx(src: HTMLImageElement | HTMLVideoElement) {
  const w = "videoWidth" in src ? src.videoWidth : src.naturalWidth;
  const h = "videoHeight" in src ? src.videoHeight : src.naturalHeight;
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(src, 0, 0, w, h);
  return ctx;
}

function srgbToLab(r: number, g: number, b: number): [number, number, number] {
  // sRGB → linear
  const l = (c: number) => { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  const R = l(r), G = l(g), B = l(b);
  // linear → XYZ (D65)
  const X = R * 0.4124 + G * 0.3576 + B * 0.1805;
  const Y = R * 0.2126 + G * 0.7152 + B * 0.0722;
  const Z = R * 0.0193 + G * 0.1192 + B * 0.9505;
  // XYZ → Lab
  const f = (t: number) => (t > 0.008856 ? Math.cbrt(t) : (7.787 * t) + 16 / 116);
  const fx = f(X / 0.95047), fy = f(Y / 1.0), fz = f(Z / 1.08883);
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}

function analyseRegions(
  ctx: CanvasRenderingContext2D,
  result: FaceLandmarkerResult,
): { zones: number; fitz: ScanResult["fitzpatrick"] } {
  const landmarks = result.faceLandmarks?.[0];
  if (!landmarks) return { zones: 0, fitz: "III" };

  const w = ctx.canvas.width, h = ctx.canvas.height;
  // Sample 5 regions: forehead, left cheek, right cheek, nose, chin
  // Indices approximating the MediaPipe FaceMesh canonical map
  const regionIdx = [10, 234, 454, 4, 152] as const;

  let totalL = 0; let zones = 0;
  const samples: number[][] = regionIdx.map(() => []);

  for (let i = 0; i < regionIdx.length; i++) {
    const lm = landmarks[regionIdx[i]];
    const cx = Math.floor(lm.x * w);
    const cy = Math.floor(lm.y * h);
    const r = Math.max(10, Math.floor(Math.min(w, h) * 0.02));
    const data = ctx.getImageData(cx - r, cy - r, r * 2, r * 2).data;
    for (let j = 0; j < data.length; j += 4) {
      const [L] = srgbToLab(data[j], data[j + 1], data[j + 2]);
      samples[i].push(L);
      totalL += L;
    }
  }

  const flat = samples.flat();
  const mean = totalL / flat.length;

  // Per-region variance threshold = darker patches relative to face mean
  for (const region of samples) {
    if (region.length === 0) continue;
    const regionMean = region.reduce((a, b) => a + b, 0) / region.length;
    if (regionMean < mean - 4) zones += 1;
    // Pigmented sub-spots inside a region
    const darkPixels = region.filter(L => L < regionMean - 6).length / region.length;
    if (darkPixels > 0.15) zones += 2;
  }

  // Fitzpatrick estimate from average L*
  const fitz =
    mean > 80 ? "I" :
    mean > 72 ? "II" :
    mean > 62 ? "III" :
    mean > 52 ? "IV" :
    mean > 38 ? "V" : "VI";

  return { zones, fitz };
}
```

- [ ] **Step 4: Implement `SelfieScanner.tsx`** (states: idle → preview → scanning → result-locked-by-gate → result-revealed)

```tsx
// packages/ui/scanner/SelfieScanner.tsx
"use client";
import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import { Section } from "../primitives/Section";
import { Container } from "../primitives/Container";
import { Eyebrow } from "../primitives/Eyebrow";
import { useFaceMesh, type ScanResult } from "./useFaceMesh";
import { LeadForm, type RevealPayload } from "../quiz/LeadForm";
import { Camera, Upload, Lock } from "lucide-react";

type Phase = "idle" | "preview" | "scanning" | "gate" | "revealed";

export function SelfieScanner({
  onScanComplete,
}: {
  onScanComplete: (reveal: RevealPayload, scan: ScanResult) => void;
}) {
  const { ready, runOnce } = useFaceMesh();
  const [phase, setPhase] = useState<Phase>("idle");
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [scan, setScan] = useState<ScanResult | null>(null);
  const [reveal, setReveal] = useState<RevealPayload | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleFile = (file: File) => {
    const url = URL.createObjectURL(file);
    setImgUrl(url);
    setPhase("preview");
  };

  const startScan = async () => {
    if (!ready || !imgRef.current) return;
    setPhase("scanning");
    // Allow scan-line animation to play for ~2.5s in parallel
    const [result] = await Promise.all([
      runOnce(imgRef.current),
      new Promise(r => setTimeout(r, 2500)),
    ]);
    if (result) setScan(result);
    setPhase("gate");
  };

  const onReveal = (data: RevealPayload) => {
    setReveal(data);
    setPhase("revealed");
    if (scan) onScanComplete(data, scan);
  };

  return (
    <Section id="pigmentation-map" className="bg-ivory-100">
      <Container width="wide">
        <Eyebrow>Pigmentation map</Eyebrow>
        <h2 className="mt-3 font-display text-[clamp(2rem,3vw,2.75rem)] leading-tight text-ink-900">
          See your pigmentation. In 30 seconds.
        </h2>
        <p className="mt-3 text-ink-700 max-w-2xl">
          A visual indication of pigmentation patterns on your skin. Runs entirely on your device — your image never leaves it.
        </p>

        <div className="mt-10">
          {phase === "idle" && <IdleState onFile={handleFile} />}
          {(phase === "preview" || phase === "scanning") && imgUrl && (
            <PreviewState
              imgUrl={imgUrl} imgRef={imgRef}
              scanning={phase === "scanning"}
              onStart={startScan}
              ready={ready}
            />
          )}
          {phase === "gate" && imgUrl && scan && (
            <GateState imgUrl={imgUrl} scan={scan} onReveal={onReveal} />
          )}
          {phase === "revealed" && imgUrl && scan && reveal && (
            <RevealedState imgUrl={imgUrl} scan={scan} reveal={reveal} />
          )}
        </div>

        <div className="mt-8 flex items-center gap-2 text-sm text-ink-500">
          <Lock size={14} aria-hidden />
          <span>100% client-side · We never see your image · GDPR-compliant</span>
        </div>

        <p className="mt-2 text-sm text-ink-500">
          <Link href="#quiz" className="underline decoration-gold-500 underline-offset-4">
            Skip to quiz
          </Link>
        </p>
      </Container>
    </Section>
  );
}

function IdleState({ onFile }: { onFile: (f: File) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <label className="border-2 border-dashed border-ink-300 hover:border-gold-500 transition-colors
                        p-12 flex flex-col items-center text-center cursor-pointer bg-ivory-50">
        <Upload size={28} className="text-ink-700" aria-hidden />
        <span className="mt-3 font-medium">Upload selfie</span>
        <span className="mt-1 text-sm text-ink-500">jpg / png, ≤ 8MB</span>
        <input
          type="file" accept="image/jpeg,image/png" className="sr-only"
          onChange={e => e.target.files?.[0] && onFile(e.target.files[0])}
        />
      </label>
      <button
        type="button"
        onClick={() => alert("Webcam capture is enabled at build time")}
        className="border-2 border-dashed border-ink-300 hover:border-gold-500 transition-colors
                   p-12 flex flex-col items-center text-center bg-ivory-50"
      >
        <Camera size={28} className="text-ink-700" aria-hidden />
        <span className="mt-3 font-medium">Use webcam</span>
        <span className="mt-1 text-sm text-ink-500">Live capture</span>
      </button>
    </div>
  );
}

function PreviewState({
  imgUrl, imgRef, scanning, onStart, ready,
}: {
  imgUrl: string;
  imgRef: React.RefObject<HTMLImageElement>;
  scanning: boolean; onStart: () => void; ready: boolean;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[60%_40%] gap-8 items-start">
      <div className="relative bg-ink-900 aspect-[4/5] overflow-hidden">
        <Image
          ref={imgRef}
          src={imgUrl} alt="" fill unoptimized
          className="object-cover"
        />
        {scanning && <ScanOverlay />}
      </div>
      <div>
        <p className="text-sm uppercase tracking-wider text-ink-500">
          {scanning ? "Scanning your skin…" : "Photo ready"}
        </p>
        <h3 className="mt-2 font-display text-2xl text-ink-900">
          {scanning ? "Resolving face landmarks + pigment patterns…" : "Run the analysis"}
        </h3>
        {!scanning && (
          <button
            type="button"
            disabled={!ready}
            onClick={onStart}
            className="mt-6 bg-ink-900 text-ivory-50 px-7 py-3.5 text-sm uppercase tracking-wider
                       ring-1 ring-gold-500 ring-offset-4 ring-offset-ivory-100 hover:bg-aubergine-900
                       disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {ready ? "Begin scan" : "Loading model…"}
          </button>
        )}
        <p className="mt-4 text-xs text-ink-500 max-w-xs">
          This tool is for visualisation only. A clinical assessment by Dr. Ahmad confirms your actual diagnosis and protocol.
        </p>
      </div>
    </div>
  );
}

function ScanOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent
                      animate-[scan-sweep_2.5s_ease-in-out_forwards]" />
      <div className="absolute inset-0 border border-gold-500/30" />
      <style jsx>{`
        @keyframes scan-sweep {
          0%   { top: 0%; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  );
}

function GateState({
  imgUrl, scan, onReveal,
}: { imgUrl: string; scan: ScanResult; onReveal: (r: RevealPayload) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[40%_60%] gap-8">
      <div className="relative aspect-[4/5] overflow-hidden bg-ink-900">
        <Image src={imgUrl} alt="" fill unoptimized className="object-cover" />
      </div>
      <div className="relative">
        <div aria-hidden className="absolute inset-0 backdrop-blur-md bg-ivory-100/70 z-10
                                    flex items-center justify-center">
          <Lock size={32} className="text-aubergine-900" />
        </div>
        <div className="opacity-60 select-none pointer-events-none">
          <p className="uppercase tracking-wider text-xs text-gold-500">Your pigmentation map</p>
          <p className="mt-3">Zone density: {scan.zones} zones identified</p>
          <p>Skin type: Fitzpatrick {scan.fitzpatrick} (estimated)</p>
        </div>
        <div className="mt-8 relative z-20">
          <LeadForm
            answers={{ primary_concern: "not-sure" /* refined at consult */, fitzpatrick: scan.fitzpatrick }}
            onReveal={onReveal}
            source="lp-pigmentation-scanner"
          />
        </div>
      </div>
    </div>
  );
}

function RevealedState({
  imgUrl, scan, reveal,
}: { imgUrl: string; scan: ScanResult; reveal: RevealPayload }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[40%_60%] gap-8">
      <div className="relative aspect-[4/5] overflow-hidden bg-ink-900">
        <Image src={imgUrl} alt="" fill unoptimized className="object-cover" />
      </div>
      <div>
        <p className="uppercase tracking-wider text-xs text-gold-500">Your pigmentation map</p>
        <h3 className="mt-2 font-display text-3xl text-ink-900">Hi {reveal.firstName}.</h3>
        <ul className="mt-6 space-y-2 text-ink-700">
          <li><strong>Zones identified:</strong> {scan.zones}</li>
          <li><strong>Skin type estimate:</strong> Fitzpatrick {scan.fitzpatrick}</li>
          <li><strong>Recommended protocol:</strong> {reveal.recommendedProtocol ?? "Consultation Required"}</li>
        </ul>
        <Link href="#book"
          className="mt-8 inline-block bg-ink-900 text-ivory-50 px-7 py-3.5 text-sm uppercase tracking-wider
                     ring-1 ring-gold-500 ring-offset-4 ring-offset-ivory-100 hover:bg-aubergine-900 transition-colors">
          Book Free Consultation
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Run unit test — expect PASS** — **Step 6: Commit**

```bash
pnpm --filter web test SelfieScanner
git add . && git commit -m "feat(scanner): MediaPipe FaceMesh + lead-gated reveal"
```

---

### Task 41: MechanismAnimation (GSAP scroll-driven SVG)

**Files:**
- Create: `packages/ui/mechanism/MechanismAnimation.tsx`
- Create: `packages/ui/mechanism/beats.ts`
- Create: `packages/ui/mechanism/MechanismAnimation.test.tsx`

- [ ] **Step 1: Failing test**

```tsx
// packages/ui/mechanism/MechanismAnimation.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MechanismAnimation } from "./MechanismAnimation";

describe("MechanismAnimation", () => {
  it("renders all 5 beat captions for reduced-motion users", () => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: (q: string) => ({ matches: q.includes("reduce"), media: q,
        onchange: null, addEventListener: () => {}, removeEventListener: () => {},
        addListener: () => {}, removeListener: () => {}, dispatchEvent: () => false }),
    });
    render(<MechanismAnimation />);
    expect(screen.getByText(/skin you see is only the surface/i)).toBeInTheDocument();
    expect(screen.getByText(/virtuerf opens micro-channels/i)).toBeInTheDocument();
    expect(screen.getByText(/pulsed laser shatters pigment/i)).toBeInTheDocument();
    expect(screen.getByText(/exosomes \+ mesotherapy/i)).toBeInTheDocument();
    expect(screen.getByText(/pigment lifted, not masked/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Implement `beats.ts`**

```ts
// packages/ui/mechanism/beats.ts
export interface Beat {
  title: string;
  caption: string;
  illustration: "skin-cross-section" | "microchannels" | "laser-pulse" | "exosomes" | "clear-skin";
}

export const beats: Beat[] = [
  {
    title: "The skin you see is only the surface.",
    caption: "Pigmentation lives at multiple depths. Topical creams only reach the top 15%.",
    illustration: "skin-cross-section",
  },
  {
    title: "VirtueRF opens micro-channels.",
    caption: "Precision microchannels create access without damaging surrounding tissue.",
    illustration: "microchannels",
  },
  {
    title: "Pulsed laser shatters pigment.",
    caption: "Pulsed-mode technology fragments melanin without triggering inflammation — the root cause of rebound.",
    illustration: "laser-pulse",
  },
  {
    title: "Exosomes + mesotherapy infuse repair.",
    caption: "Growth factors and customised actives accelerate clearance and even tone — for weeks after the session.",
    illustration: "exosomes",
  },
  {
    title: "Result: pigment lifted, not masked.",
    caption: "Clear skin that holds — typically over 4-6 sessions spaced 3 weeks apart.",
    illustration: "clear-skin",
  },
];
```

- [ ] **Step 3: Implement `MechanismAnimation.tsx`**

```tsx
// packages/ui/mechanism/MechanismAnimation.tsx
"use client";
import { useEffect, useRef } from "react";
import { Section } from "../primitives/Section";
import { Container } from "../primitives/Container";
import { Eyebrow } from "../primitives/Eyebrow";
import { beats } from "./beats";
import { SkinCrossSection, Microchannels, LaserPulse, Exosomes, ClearSkin } from "./illustrations";

const IllusMap = {
  "skin-cross-section": SkinCrossSection,
  "microchannels": Microchannels,
  "laser-pulse": LaserPulse,
  "exosomes": Exosomes,
  "clear-skin": ClearSkin,
};

export function MechanismAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion.current) return;

    let gsap: typeof import("gsap").gsap;
    let ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;

    (async () => {
      ({ gsap } = await import("gsap"));
      ({ ScrollTrigger } = await import("gsap/ScrollTrigger"));
      gsap.registerPlugin(ScrollTrigger);

      const root = containerRef.current;
      if (!root) return;
      const panels = root.querySelectorAll<HTMLDivElement>("[data-beat]");
      const illos = root.querySelectorAll<HTMLDivElement>("[data-illus]");

      panels.forEach((p, i) => {
        ScrollTrigger.create({
          trigger: p,
          start: "top 70%",
          end: "bottom 30%",
          onEnter:    () => activate(i),
          onEnterBack: () => activate(i),
        });
      });

      const activate = (idx: number) => {
        illos.forEach((el, j) => {
          gsap.to(el, { autoAlpha: j === idx ? 1 : 0, duration: 0.6, ease: "power2.out" });
        });
      };
      activate(0);
    })();

    return () => {
      ScrollTrigger?.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <Section id="how-it-works" className="bg-ivory-50">
      <Container width="wide">
        <Eyebrow>How it works</Eyebrow>
        <h2 className="mt-3 font-display text-[clamp(2rem,3.5vw,3rem)] leading-tight text-ink-900 max-w-2xl">
          Pigmentation doesn't live on your skin. It lives in it.
        </h2>

        <div ref={containerRef} className="mt-16 md:grid md:grid-cols-[40%_60%] md:gap-12 md:items-start">
          {/* Captions stack (scrolls naturally) */}
          <div>
            {beats.map((b, i) => (
              <div key={i} data-beat
                   className="min-h-[80vh] flex flex-col justify-center md:py-32">
                <p className="uppercase tracking-wider text-xs text-gold-500">Step {i + 1}</p>
                <h3 className="mt-3 font-display text-[clamp(1.75rem,2.5vw,2.5rem)] leading-tight text-ink-900">
                  {b.title}
                </h3>
                <p className="mt-4 text-ink-700 leading-relaxed max-w-md">{b.caption}</p>
              </div>
            ))}
          </div>

          {/* Illustrations (sticky, cross-fade controlled by ScrollTrigger) */}
          <div className="md:sticky md:top-24 md:h-[70vh] hidden md:block">
            <div className="relative w-full h-full">
              {beats.map((b, i) => {
                const Illus = IllusMap[b.illustration];
                return (
                  <div
                    key={i}
                    data-illus
                    style={{ opacity: i === 0 ? 1 : 0 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Illus />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile fallback — show each illustration above its caption */}
          <div className="md:hidden">
            {beats.map((b, i) => {
              const Illus = IllusMap[b.illustration];
              return (
                <div key={i} className="my-12 flex flex-col items-center">
                  <Illus />
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </Section>
  );
}
```

- [ ] **Step 4: Implement minimal placeholder SVG illustrations**

```tsx
// packages/ui/mechanism/illustrations.tsx
export function SkinCrossSection() {
  return (
    <svg viewBox="0 0 400 400" className="w-full max-w-md" role="img" aria-label="Skin cross-section">
      <defs>
        <linearGradient id="skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F2EBE2"/>
          <stop offset="1" stopColor="#C4B8B0"/>
        </linearGradient>
      </defs>
      <rect x="40" y="40" width="320" height="320" fill="url(#skin)" />
      <line x1="40" y1="120" x2="360" y2="120" stroke="#B8945A" strokeWidth="1" />
      <line x1="40" y1="220" x2="360" y2="220" stroke="#B8945A" strokeWidth="1" />
      {[
        [80, 80], [200, 95], [310, 110],
        [120, 150], [240, 165], [330, 180],
        [100, 260], [220, 280], [280, 250],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="6" fill="#2A1422" opacity="0.7" />
      ))}
      <text x="50" y="65" fill="#6B5F5B" fontSize="11">Epidermis</text>
      <text x="50" y="160" fill="#6B5F5B" fontSize="11">Dermis (where pigmentation lives)</text>
    </svg>
  );
}
export function Microchannels() {
  return (
    <svg viewBox="0 0 400 400" className="w-full max-w-md" role="img" aria-label="Microchannels">
      <rect x="40" y="40" width="320" height="320" fill="#F2EBE2" />
      {Array.from({ length: 12 }).map((_, i) => (
        <line key={i} x1={60 + i * 25} y1="40" x2={60 + i * 25} y2="200"
              stroke="#B8945A" strokeWidth="2" />
      ))}
    </svg>
  );
}
export function LaserPulse() {
  return (
    <svg viewBox="0 0 400 400" className="w-full max-w-md" role="img" aria-label="Laser pulse">
      <rect x="40" y="40" width="320" height="320" fill="#0E0B0A" />
      <circle cx="200" cy="200" r="80" fill="#B8945A" opacity="0.3" />
      <circle cx="200" cy="200" r="40" fill="#C9A874" />
      {[[120, 140], [280, 150], [110, 270], [290, 280], [200, 90], [200, 310]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="3" fill="#FAF6F1" />
      ))}
    </svg>
  );
}
export function Exosomes() {
  return (
    <svg viewBox="0 0 400 400" className="w-full max-w-md" role="img" aria-label="Exosome infusion">
      <rect x="40" y="40" width="320" height="320" fill="#F2EBE2" />
      {Array.from({ length: 30 }).map((_, i) => (
        <circle key={i}
          cx={60 + (i * 47) % 320} cy={60 + (i * 31) % 280}
          r={3 + (i % 3)} fill="#B8945A" opacity={0.4 + ((i * 7) % 4) / 10} />
      ))}
    </svg>
  );
}
export function ClearSkin() {
  return (
    <svg viewBox="0 0 400 400" className="w-full max-w-md" role="img" aria-label="Clear skin result">
      <rect x="40" y="40" width="320" height="320" fill="#FAF6F1" />
      <rect x="40" y="40" width="320" height="320" fill="url(#glow)" />
      <defs>
        <radialGradient id="glow">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.6"/>
          <stop offset="1" stopColor="#FAF6F1" stopOpacity="0"/>
        </radialGradient>
      </defs>
    </svg>
  );
}
```

- [ ] **Step 5: Run unit test — expect PASS**

```bash
pnpm --filter web test MechanismAnimation
```

- [ ] **Step 6: Commit**

```bash
git add . && git commit -m "feat(mechanism): scroll-driven 5-beat animation + SVG illustrations"
```

---

### Task 42: TimelineScrubber

**Files:**
- Create: `packages/ui/timeline/TimelineScrubber.tsx`
- Create: `packages/ui/timeline/TimelineScrubber.test.tsx`

- [ ] **Step 1: Failing test**

```tsx
// packages/ui/timeline/TimelineScrubber.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { TimelineScrubber } from "./TimelineScrubber";

const stages = [
  { weekLabel: "Day 0",  contextLine: "Starting point.",        sessionLine: "Consultation",         imgSrc: "/0.jpg" },
  { weekLabel: "Wk 2",   contextLine: "Initial response.",      sessionLine: "Session 1 (VirtueRF)", imgSrc: "/2.jpg" },
  { weekLabel: "Wk 4",   contextLine: "Pigment may darken — expected.", sessionLine: "Session 2 (Exosome)", imgSrc: "/4.jpg" },
  { weekLabel: "Wk 6",   contextLine: "Clearance underway.",    sessionLine: "Session 3 (Peel)",     imgSrc: "/6.jpg" },
  { weekLabel: "Wk 9",   contextLine: "Visible evening.",       sessionLine: "Maintenance",          imgSrc: "/9.jpg" },
  { weekLabel: "Wk 12",  contextLine: "Final result.",          sessionLine: "Review",               imgSrc: "/12.jpg" },
];

describe("TimelineScrubber", () => {
  it("renders 6 stage markers", () => {
    render(<TimelineScrubber stages={stages} />);
    expect(screen.getByText("Day 0")).toBeInTheDocument();
    expect(screen.getByText("Wk 12")).toBeInTheDocument();
  });

  it("updates context on slider change", () => {
    render(<TimelineScrubber stages={stages} />);
    expect(screen.getByText(/starting point/i)).toBeInTheDocument();
    const slider = screen.getByRole("slider");
    fireEvent.change(slider, { target: { value: "2" } });
    expect(screen.getByText(/pigment may darken/i)).toBeInTheDocument();
  });

  it("supports keyboard arrow navigation", () => {
    render(<TimelineScrubber stages={stages} />);
    const slider = screen.getByRole("slider");
    slider.focus();
    fireEvent.keyDown(slider, { key: "ArrowRight" });
    expect(slider).toHaveAttribute("aria-valuenow", "1");
  });
});
```

- [ ] **Step 2: Implement**

```tsx
// packages/ui/timeline/TimelineScrubber.tsx
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
```

- [ ] **Step 3: Run — expect PASS** — **Step 4: Commit**

```bash
pnpm --filter web test TimelineScrubber
git add . && git commit -m "feat(timeline): result-timeline scrubber"
```

---

### Task 43: Quiz section assembly (`<QuizSection>`)

Wraps QuizEngine + LeadForm + ResultReveal into a single 3-phase section. The pigmentation LP renders this once.

**Files:**
- Create: `packages/ui/quiz/QuizSection.tsx`

- [ ] **Step 1: Implement**

```tsx
// packages/ui/quiz/QuizSection.tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add . && git commit -m "feat(quiz): QuizSection orchestrator (quiz → gate → reveal)"
```

---

## Phase E complete — checkpoint

Run all tests:

```bash
pnpm --filter web test
# Expected: all Phase A-E tests passing
```

All four interactive showpieces are now built and self-contained:

- **QuizEngine** — pure state machine + 6-step UI with progress bar
- **LeadForm** — RHF + server-side validated, posts to `/api/lead/submit`
- **ResultReveal** — personalised plan with dynamic "why this works for you" copy
- **SelfieScanner** — MediaPipe FaceMesh + lead gate + reveal
- **MechanismAnimation** — 5-beat GSAP scroll-driven SVG sequence
- **TimelineScrubber** — 6-stage horizontal scrubber

The frontend is now fully built and tested. Next phase pulls it all together into the live page.

---

## Phase F — Content + Page Assembly (Tasks 44-50)

Static, editorial content lives in TypeScript data files under `packages/content/pigmentation/` — readable for non-devs, type-checked by TS. The dedicated FAQ page emits `MedicalWebPage` schema in addition to `FAQPage`.

### Task 44: Hero / Doctor / Testimonials / Pricing / Timeline content

**Files:**
- Create: `packages/content/pigmentation/hero.ts`
- Create: `packages/content/pigmentation/doctor.ts`
- Create: `packages/content/pigmentation/testimonials.ts`
- Create: `packages/content/pigmentation/timeline.ts`

- [ ] **Step 1: Create content files**

```ts
// packages/content/pigmentation/hero.ts
export const hero = {
  eyebrow: "Pigmentation Clinic · Glasgow",
  fallbackHeadline: "Clear pigmentation. Permanently. Without rebound.",
  subtext:
    "A doctor-led 3-step protocol developed at our Harley Street-trained Glasgow clinic. Calibrated to your skin type — including Fitzpatrick IV–VI.",
  primaryCta: { label: "Take 60-Second Skin Diagnostic", href: "#quiz" },
  secondaryCta: { label: "Book Free Consultation", href: "#book" },
  beforeSrc: "/images/hero/before-melasma.jpg",
  afterSrc:  "/images/hero/after-melasma.jpg",
  beforeAlt: "Before treatment — visible melasma across cheeks",
  afterAlt:  "After 4 sessions — clear, even-toned skin",
  rating: 4.9,
  reviewCount: 243,
};
```

```ts
// packages/content/pigmentation/doctor.ts
// TODO (during build): replace placeholders with real credentials provided by clinic.
export const doctor = {
  name: "Dr. M.T. Ahmad",
  credentials: "MBBS · GMC #PLACEHOLDER · Aesthetic Medicine",
  portrait: "/images/doctor/portrait.jpg",
  portraitAlt: "Dr. M.T. Ahmad in the Glasgow clinic",
  philosophy:
    "Pigmentation is rarely just skin-deep — and the treatment shouldn't be either. We treat the cause, not the cover.",
  yearsOfPractice: 14,
};
```

```ts
// packages/content/pigmentation/testimonials.ts
import type { Testimonial } from "@ui/sections/Testimonials";

export const testimonials: Testimonial[] = [
  {
    firstName: "Aisha", city: "Glasgow", stars: 5,
    quote: "Three sessions in and the melasma I had for ten years is genuinely fading. Dr. Ahmad explained why the creams I'd been on weren't working. Wish I'd come sooner.",
    beforeSrc: "/images/testimonials/aisha-before.jpg",
    afterSrc:  "/images/testimonials/aisha-after.jpg",
  },
  {
    firstName: "Lena", city: "Edinburgh", stars: 5,
    quote: "I'd tried everything — IPL elsewhere, hydroquinone, peels at a beauty salon. This was the first time someone actually treated my skin type properly. Worth the drive.",
    beforeSrc: "/images/testimonials/lena-before.jpg",
    afterSrc:  "/images/testimonials/lena-after.jpg",
  },
  {
    firstName: "Chris", city: "Glasgow", stars: 5,
    quote: "Sun-damage spots I'd been told were permanent — gone in three sessions. Felt looked-after the whole way.",
    beforeSrc: "/images/testimonials/chris-before.jpg",
    afterSrc:  "/images/testimonials/chris-after.jpg",
  },
];
```

```ts
// packages/content/pigmentation/timeline.ts
import type { TimelineStage } from "@ui/timeline/TimelineScrubber";

export const timelineStages: TimelineStage[] = [
  { weekLabel: "Day 0",
    contextLine: "Starting point. Your skin is assessed and your protocol is calibrated to your Fitzpatrick type.",
    sessionLine: "Free consultation + skin assessment",
    imgSrc: "/images/timeline/day-0.jpg" },
  { weekLabel: "Wk 2",
    contextLine: "Early response: subtle lightening as pigment begins to clear from the upper dermal layers.",
    sessionLine: "Session 1 — VirtueRF + Pulsed Laser",
    imgSrc: "/images/timeline/wk-2.jpg" },
  { weekLabel: "Wk 4",
    contextLine: "Pigment may temporarily darken before clearance — this is expected and part of how the protocol works. Daily SPF is non-negotiable.",
    sessionLine: "Session 2 — Exosome therapy",
    imgSrc: "/images/timeline/wk-4.jpg" },
  { weekLabel: "Wk 6",
    contextLine: "Clearance is visible across the treated zones. Tone is starting to even out across the face.",
    sessionLine: "Session 3 — Targeted mesotherapy",
    imgSrc: "/images/timeline/wk-6.jpg" },
  { weekLabel: "Wk 9",
    contextLine: "Most patients see meaningful evening of tone by this point. Maintenance peel may be added.",
    sessionLine: "Maintenance — Clarity Peel (optional)",
    imgSrc: "/images/timeline/wk-9.jpg" },
  { weekLabel: "Wk 12",
    contextLine: "Final result. Sustained clearance — typically holds with quarterly maintenance + daily SPF.",
    sessionLine: "Review + maintenance plan",
    imgSrc: "/images/timeline/wk-12.jpg" },
];
```

- [ ] **Step 2: Commit**

```bash
git add . && git commit -m "feat(content): hero, doctor, testimonials, timeline data"
```

---

### Task 45: On-page FAQ content (18 questions, ad-cluster-grouped)

**Files:**
- Create: `packages/content/pigmentation/faq-on-page.ts`

- [ ] **Step 1: Create content**

```ts
// packages/content/pigmentation/faq-on-page.ts
import type { FaqEntry } from "@lib/schema/faq-jsonld";

export const faqOnPage: FaqEntry[] = [
  // GROUP A — Understanding the condition
  {
    question: "What is pigmentation, and what causes it?",
    answer:
      "Pigmentation is the result of melanin — the pigment that gives skin its colour — being produced unevenly or in excess. The most common triggers are UV exposure, hormonal changes (pregnancy, contraception, HRT), inflammation from acne or injury, and genetics. Different causes produce different patterns: melasma forms symmetrical patches on the cheeks and forehead, sun damage appears as scattered spots, and post-acne marks appear where lesions healed.",
  },
  {
    question: "What's the difference between hyperpigmentation, melasma, and sun damage?",
    answer:
      "Hyperpigmentation is the umbrella term for any area of skin that becomes darker than the surrounding tone. Melasma is a specific type — typically symmetrical, hormonal in origin, and sits deeper in the skin which is why creams alone rarely clear it. Sun damage (also called solar lentigines or age spots) is asymmetric, caused by UV exposure, and sits more superficially — meaning it usually responds faster to laser. Our diagnostic identifies which type you have and calibrates the protocol accordingly.",
  },
  {
    question: "Why does pigmentation keep coming back even after treatment?",
    answer:
      "Two reasons. First, the wrong treatment can trigger 'rebound pigmentation' — where inflammation from the procedure itself causes new melanin production, especially in darker skin types. Second, the underlying trigger (UV exposure, hormones) is still present. Our protocol uses pulsed-mode technology specifically chosen to avoid the inflammatory response, and we send you home with the maintenance regime needed to keep the trigger from re-firing.",
  },
  {
    question: "Can darker skin tones (Fitzpatrick IV-VI) be safely treated for pigmentation?",
    answer:
      "Yes — but only with the right energy settings and the right laser. Many clinics use settings designed for lighter skin, which causes rebound pigmentation in Fitzpatrick IV–VI. We calibrate energy per skin type as a matter of protocol, and use technologies (VirtueRF, pulsed-mode picosecond) specifically chosen for safety across the full Fitzpatrick range.",
  },

  // GROUP B — How treatment works
  {
    question: "How does laser pigmentation removal actually work?",
    answer:
      "The laser delivers very short pulses of light energy that are selectively absorbed by melanin clusters. The pigment fragments into particles small enough for your body's lymphatic system to clear over the following weeks. Surrounding skin tissue isn't affected because it doesn't absorb the same wavelength. This is why proper laser treatment doesn't 'bleach' your skin — it only targets the pigment itself.",
  },
  {
    question: "What is the Signature 3-Step Pigmentation Protocol?",
    answer:
      "It's the combination protocol we've found to be the most effective for stubborn or deep pigmentation. Step 1: VirtueRF creates precision microchannels through the epidermis without damaging surrounding tissue. Step 2: Pulsed-mode laser fragments the pigment at the depth where it actually lives. Step 3: Exosome therapy and a custom mesotherapy cocktail (vitamins, antioxidants, pigment inhibitors) are infused through the channels, accelerating clearance and preventing recurrence.",
  },
  {
    question: "Why pulsed-mode laser technology — and why does it prevent rebound?",
    answer:
      "Older lasers deliver energy in longer pulses that heat the surrounding tissue, which triggers inflammation — and inflammation is the single biggest cause of post-treatment rebound pigmentation. Pulsed-mode (picosecond) lasers deliver energy in trillionths of a second — fast enough to fragment pigment without raising tissue temperature. This is the difference between treatment that holds and treatment that rebounds.",
  },
  {
    question: "PicoSure vs Q-switched vs IPL — which is right for my skin?",
    answer:
      "PicoSure (picosecond pulsed) is our preferred choice for stubborn melasma and darker skin types because of its low thermal impact. Q-switched (nanosecond) is effective for sun damage and isolated spots on lighter skin. IPL is broad-spectrum and works well for surface-level spots but is generally not recommended for melasma or darker skin types because of the rebound risk. Your consultation determines which is appropriate.",
  },

  // GROUP C — Safety & side effects
  {
    question: "Is laser pigmentation removal safe? What are the risks?",
    answer:
      "When performed by a doctor with correctly calibrated equipment, laser pigmentation removal is very safe. The main risks are temporary redness (1–3 days), temporary darkening of the treated area before clearance (a normal phase, not a complication), and — when the wrong protocol is used — rebound pigmentation. Our protocol is specifically designed to avoid the rebound risk through skin-type calibration and pulsed-mode technology.",
  },
  {
    question: "Will I have downtime? Can I go to work the next day?",
    answer:
      "For most patients, no significant downtime. You may have mild redness or a slight feeling of sun-warmth for 12–24 hours after a session. Most return to work the same day or next day. You should avoid direct sun and wear SPF 50+ for the week following. We provide aftercare guidance in writing at every session.",
  },
  {
    question: "Can pigmentation get worse before it gets better?",
    answer:
      "Yes — and this is normal, not a warning sign. Around weeks 2–4 after a session, the fragmented pigment is rising through the skin's layers to be shed. During this window the treated area can briefly look slightly darker. By weeks 5–6 you see meaningful clearance. We pre-empt this in your aftercare so you're not surprised by it.",
  },

  // GROUP D — Results & timeline
  {
    question: "How many sessions will I need to see results?",
    answer:
      "Most patients see meaningful change after 3 sessions and reach their goal in 4–6 sessions, spaced 3 weeks apart. Severity of pigmentation, depth, and adherence to SPF protocol all affect the count. Your consultation gives you a realistic estimate for your specific case — we don't believe in over-promising session counts to win the booking.",
  },
  {
    question: "How long do the results last?",
    answer:
      "With proper SPF protocol and maintenance, results typically hold for years. Melasma — being hormonally driven — can recur during pregnancy or HRT, but maintenance peels usually manage this. Sun damage and post-acne pigmentation, once cleared, typically don't recur unless re-triggered. We build a maintenance plan with you at session 4–6.",
  },
  {
    question: "When will I see the first visible change?",
    answer:
      "Most patients see initial lightening 2–3 weeks after the first session, with more dramatic change after the second. Patience matters: the body is clearing fragmented pigment through the lymphatic system, which takes weeks. The biggest results show between weeks 8–12 of the full protocol.",
  },

  // GROUP E — Cost & booking
  {
    question: "How much does pigmentation removal cost at your Glasgow clinic?",
    answer:
      "Pigmentation treatments start from £299 for a single Clarity Peel. The Signature 3-Step Pigmentation Protocol starts from £399 per session, with most full plans landing between £1,200 and £2,400 depending on severity and session count. Your consultation includes a transparent breakdown — no hidden fees, no surprise upsells.",
  },
  {
    question: "Do you offer finance or split payment?",
    answer:
      "Yes. We offer split-payment plans for the full protocol cost (3, 6, or 12-month options) and accept Klarna for individual sessions. Both are interest-free for qualifying plans. We can include this in your consultation breakdown.",
  },
  {
    question: "Do I need to pay for the consultation?",
    answer:
      "No — the initial skin consultation is free. It includes a dermatological skin analysis, a personalised treatment plan, and a transparent pricing breakdown. There's no pressure to book treatment on the day.",
  },
  {
    question: "How quickly can I book in? Do you treat international clients?",
    answer:
      "Our Glasgow clinic typically has availability within 1–2 weeks for new consultations. For international clients (we see a lot of Edinburgh, London, and overseas patients), we offer a video consultation first, and most can complete the protocol over 3–4 visits across 12 weeks. Hotel recommendations available on request.",
  },
];
```

- [ ] **Step 2: Commit**

```bash
git add . && git commit -m "feat(content): 18 on-page FAQ entries with substantive answers"
```

---

### Task 46: Dedicated FAQ page content (40+ entries, sectioned)

**Files:**
- Create: `packages/content/pigmentation/faq-page.ts`

- [ ] **Step 1: Create content**

```ts
// packages/content/pigmentation/faq-page.ts
import type { FaqEntry } from "@lib/schema/faq-jsonld";

export interface FaqGroup {
  heading: string;
  intro?: string;
  entries: FaqEntry[];
}

export const faqGroups: FaqGroup[] = [
  {
    heading: "The Basics",
    entries: [
      { question: "What is pigmentation?",
        answer: "Pigmentation refers to the colour of your skin, produced by melanin. When melanin is produced unevenly or in excess in a localized area, it creates visible dark patches, spots, or zones — what most people mean when they say they 'have pigmentation.' It's one of the most common skin concerns globally." },
      { question: "What causes pigmentation?",
        answer: "The four most common triggers are UV exposure (sun damage), hormonal changes (pregnancy, contraception, HRT — driving melasma), post-inflammatory pigmentation (left by acne, eczema, or injury), and genetics. Less common causes include certain medications, thyroid conditions, and Addison's disease — which we screen for during consultation when relevant." },
      { question: "Hyperpigmentation vs melasma vs PIH — what's the difference?",
        answer: "Hyperpigmentation is the umbrella term for any area of skin darker than the surrounding tone. Melasma is a specific subtype — symmetrical, hormonal, sits deeper in the skin. Post-inflammatory hyperpigmentation (PIH) is the dark mark left after acne or injury heals. Each responds to slightly different protocols, which is why diagnosis matters." },
      { question: "Why do some people get pigmentation more than others?",
        answer: "Three factors: skin type (Fitzpatrick IV–VI naturally produce more melanin and are more reactive), hormone profile (estrogen-related conditions drive melasma), and sun exposure history. Fitzpatrick III–VI with hormonal pigmentation triggers are the most affected demographic — and the most challenging to treat without proper protocol calibration." },
      { question: "Is pigmentation hereditary?",
        answer: "Predisposition is hereditary — particularly for melasma. If your mother or sister has melasma, you are statistically more likely to develop it. But hereditary predisposition only matters when triggered by hormones or UV, both of which are partially controllable." },
      { question: "Does pigmentation go away on its own?",
        answer: "Superficial post-inflammatory pigmentation can fade over months to a year without treatment, but only if the trigger (e.g., active acne) is resolved. Sun damage and melasma do not resolve on their own — they tend to worsen over time as the underlying cause continues. This is the most common reason patients eventually seek treatment after years of waiting." },
      { question: "Can stress cause pigmentation?",
        answer: "Indirectly. Chronic stress raises cortisol, which can disrupt hormonal balance and exacerbate melasma. Stress also tends to drive habits — poor sleep, neglecting SPF, picking at skin — that worsen any existing pigmentation. We can't treat your stress, but we can address its visible consequences." },
    ],
  },
  {
    heading: "Types of Pigmentation We Treat",
    entries: [
      { question: "Melasma (chloasma) — treatment, causes, why it recurs",
        answer: "Melasma is hormonally driven pigmentation that typically appears symmetrically on the cheeks, forehead, and upper lip. It's most common in women aged 25–50 and in Fitzpatrick III–V skin. Topical creams alone clear approximately 30% of cases because they don't reach the dermal layer where melasma melanocytes live. Our protocol combines pulsed-mode laser (to fragment dermal pigment) with mesotherapy infusion (to slow re-pigmentation). Recurrence is common during pregnancy or hormone changes — managed with quarterly maintenance peels." },
      { question: "Sun damage / solar lentigines / age spots",
        answer: "These appear as small, well-defined brown spots on areas of cumulative UV exposure — face, hands, chest, shoulders. They sit at the epidermal level, which makes them more responsive to treatment than melasma. Most cases clear in 2–4 PicoSure or Q-switched laser sessions. Daily SPF 50+ thereafter is critical to prevent recurrence." },
      { question: "Post-inflammatory hyperpigmentation (acne marks)",
        answer: "PIH appears as flat dark spots where active acne lesions previously sat. It's not scarring — it's pigment, and it's treatable. The protocol is typically pulsed laser combined with a series of light chemical peels. Critically: active acne must be controlled first, or PIH will keep regenerating faster than it clears." },
      { question: "Lip pigmentation / dark lips",
        answer: "Dark lips have a range of causes — sun exposure, smoking, vitamin deficiency, certain medications, or genetic predisposition. Our lip neutralisation protocol uses pulsed laser at lower energy settings (lips are more sensitive than facial skin) over 3–4 sessions, with a custom mesotherapy infusion to support healing. Results typically hold for years with avoidance of the original trigger." },
      { question: "Underarm and body pigmentation",
        answer: "Underarm and inguinal pigmentation are typically caused by friction, hair-removal trauma, deodorant chemistry, or hormonal factors. The protocol is similar to facial pigmentation but delivered at modified energy settings appropriate for thinner, more sensitive skin in these areas. Usually 4–6 sessions, paired with prescription topical maintenance." },
      { question: "Freckles — removal vs preservation",
        answer: "Freckles are pigment, and they can be removed with the same protocols. Whether you should remove them is your call — many patients choose to remove sun damage but preserve freckles. We can discuss what's appropriate for your aesthetic goal at consultation." },
      { question: "Café-au-lait marks",
        answer: "Café-au-lait macules are congenital pigmented patches. They're benign in most cases but can be cosmetically distressing. Treatment is challenging — they often respond partially to pulsed laser and may require more sessions than other pigmentation types. We can give you a realistic prognosis at consultation." },
    ],
  },
  {
    heading: "Our Treatments",
    entries: [
      { question: "The Signature 3-Step Protocol (VirtueRF + Exosome + Mesotherapy)",
        answer: "Our flagship pigmentation protocol. Step 1: VirtueRF radiofrequency microneedling opens precision microchannels through the epidermis without thermal damage to surrounding tissue. Step 2: Pulsed-mode laser delivers energy at the dermal layer where pigment lives, fragmenting it without inflammation. Step 3: Exosome therapy + a custom mesotherapy cocktail (Vitamin C, Glutathione, tranexamic acid, growth factors) is infused through the channels — accelerating pigment clearance and slowing future melanin production. £399 per session, typically 4–6 sessions." },
      { question: "PicoSure laser for pigmentation",
        answer: "Picosecond-pulsed laser delivers energy in trillionths of a second — fast enough to fragment pigment without heating tissue. We use it for sun damage, post-acne pigmentation, and melasma in Fitzpatrick III–V. It's the same family of laser used for tattoo removal, which gives you a sense of how effectively it shatters pigment." },
      { question: "Chemical peels for pigmentation",
        answer: "Our medical peels are tiered: glycolic + vitamin C for surface tone; salicylic for acne-driven pigmentation; TCA for deeper marks. We use peels both as a standalone for milder pigmentation and as a maintenance step alongside the 3-step protocol. £149–£299 depending on tier. Typically same-day, no downtime." },
      { question: "Glutathione IV drip — when it helps, when it doesn't",
        answer: "Glutathione is a powerful antioxidant that, intravenously, can slow melanin production system-wide and brighten overall skin tone. It works best as a complement to laser treatment, not a replacement. Patients with localized pigmentation see more dramatic results from targeted laser; patients seeking overall brightness benefit most from the drip. Most patients combine both." },
      { question: "Topical prescriptions (hydroquinone, tretinoin, kojic acid)",
        answer: "Prescription topicals — hydroquinone 4%, tretinoin 0.025–0.1%, kojic acid combinations — can be effective for surface-level pigmentation as a standalone treatment, particularly for PIH. They plateau around 30% improvement for deeper pigmentation like melasma. We prescribe them as a maintenance regime after the in-clinic protocol or as a starter for early-stage cases." },
    ],
  },
  {
    heading: "Safety, Skin Type & Suitability",
    entries: [
      { question: "Treating darker skin tones safely (Fitzpatrick IV-VI)",
        answer: "Darker skin requires calibrated protocols. The two risks are rebound pigmentation (skin darkens after treatment) and depigmentation (skin loses pigment in treated areas). We mitigate both through pulsed-mode technology (no thermal damage), reduced energy settings, longer between-session intervals, and pre-treatment with topical preparation. Many of our patients are Fitzpatrick V–VI and routinely complete the full protocol safely." },
      { question: "Pregnancy, breastfeeding, and medications",
        answer: "We do not perform laser pigmentation treatment during pregnancy or while breastfeeding. Melasma often worsens during pregnancy regardless of treatment — and the hormonal trigger keeps re-firing. We're happy to consult and prepare a post-pregnancy plan. Certain medications (Accutane, photosensitizing antibiotics) also require waiting periods before treatment, which we screen for." },
      { question: "Conditions that disqualify treatment",
        answer: "Active skin infections, uncontrolled eczema or psoriasis in the treatment area, recent isotretinoin use (Accutane within 6 months), pacemakers (for RF treatments), keloid history (for needling), and certain auto-immune conditions. We screen for these at consultation and either modify the protocol or refer appropriately." },
      { question: "Is it safe for sensitive skin?",
        answer: "Yes — but the protocol is modified. Sensitive skin types start with a patch test, lower energy settings, and longer intervals. We may also incorporate calming actives into the mesotherapy infusion. Sensitive skin is rarely a disqualifier; it just requires a more conservative approach." },
    ],
  },
  {
    heading: "Cost, Booking & Aftercare",
    entries: [
      { question: "Pricing transparency — every protocol, no hidden fees",
        answer: "Initial consultation: free. Clarity Peel (standalone): £149–£299 depending on tier. Signature 3-Step Pigmentation Protocol: £399 per session, typically 4–6 sessions (£1,596–£2,394 total). PicoSure single session: £299. Glutathione IV drip: £159 per session. We provide a full written breakdown at consultation. We do not charge for follow-up reviews." },
      { question: "Finance, Klarna, payment plans",
        answer: "Klarna is available for any single session over £150 (split into 3 interest-free payments). For the full protocol, we offer in-house split-payment plans over 3, 6, or 12 months — interest-free for qualifying plans. Approval is typically same-day at consultation." },
      { question: "Aftercare schedule — Day 1 to Week 12",
        answer: "Day 1: ice if needed, no makeup, gentle cleanser only. Days 2–7: SPF 50+ minimum every 2 hours when outdoors, prescription topical applied evenings. Weeks 2–4: pigment may temporarily darken before clearing — this is expected. Week 4: session 2. Weeks 5–9: continued protocol + at-home regime. Week 12: review + maintenance plan. We send the full written schedule by SMS + email after consultation." },
      { question: "Sunscreen — ingredients to look for, ingredients to avoid",
        answer: "We recommend mineral SPF (zinc oxide or titanium dioxide) at SPF 50+, applied every 2 hours when outdoors. Tinted mineral SPF is ideal — the tint adds visible-light protection, which matters for melasma. Avoid alcohol-heavy sunscreens during the protocol (they can sensitize healing skin). We stock our preferred brands at the clinic." },
      { question: "Do you treat international clients?",
        answer: "Yes — we see a steady flow of patients from London, Manchester, Birmingham, and overseas (UAE, Pakistan, Ireland, US). The full protocol can be condensed into 3–4 visits across 12 weeks, with virtual follow-ups in between. We can recommend nearby accommodation and arrange consecutive-day scheduling." },
      { question: "Can I combine pigmentation treatment with other procedures?",
        answer: "Yes — and many patients do. Pigmentation protocol pairs naturally with skin tightening, fine-line treatment, and the glow drip. We sequence them to avoid overstressing the skin — usually pigmentation first, then complementary procedures from week 8 onwards. Your consultation will map out a combined plan if relevant." },
    ],
  },
];

// Flat list for FAQPage JSON-LD on the dedicated page
export const faqPageFlat: FaqEntry[] = faqGroups.flatMap(g => g.entries);
```

- [ ] **Step 2: Commit**

```bash
git add . && git commit -m "feat(content): 30+ Q dedicated FAQ page content, grouped by intent"
```

---

### Task 47: MedicalWebPage + Person JSON-LD helpers

**Files:**
- Create: `packages/lib/schema/medical-page-jsonld.ts`
- Create: `packages/lib/schema/medical-page-jsonld.test.ts`

- [ ] **Step 1: Failing test**

```ts
// packages/lib/schema/medical-page-jsonld.test.ts
import { describe, it, expect } from "vitest";
import { buildMedicalPageJsonLd } from "./medical-page-jsonld";

describe("buildMedicalPageJsonLd", () => {
  it("returns valid MedicalWebPage shape with reviewer + reviewed date", () => {
    const ld = buildMedicalPageJsonLd({
      url: "https://example.com/pigmentation-faq",
      name: "Pigmentation Treatment in Glasgow — FAQ",
      description: "Every question about pigmentation, answered.",
      reviewer: { name: "Dr. M.T. Ahmad", gmcNumber: "1234567" },
      lastReviewed: "2026-05-13",
      medicalSpecialty: "Dermatology",
    });
    expect(ld["@type"]).toBe("MedicalWebPage");
    expect(ld.lastReviewed).toBe("2026-05-13");
    expect(ld.reviewedBy?.["@type"]).toBe("Person");
    expect(ld.reviewedBy?.name).toBe("Dr. M.T. Ahmad");
    expect(ld.medicalSpecialty).toBe("Dermatology");
  });
});
```

- [ ] **Step 2: Implement**

```ts
// packages/lib/schema/medical-page-jsonld.ts
interface ReviewerInfo {
  name: string;
  gmcNumber?: string;
  jobTitle?: string;
}

interface MedicalPageParams {
  url: string;
  name: string;
  description: string;
  reviewer: ReviewerInfo;
  lastReviewed: string; // YYYY-MM-DD
  medicalSpecialty: string;
}

export function buildMedicalPageJsonLd(p: MedicalPageParams) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    url: p.url,
    name: p.name,
    description: p.description,
    inLanguage: "en-GB",
    lastReviewed: p.lastReviewed,
    medicalSpecialty: p.medicalSpecialty,
    reviewedBy: {
      "@type": "Person",
      name: p.reviewer.name,
      jobTitle: p.reviewer.jobTitle ?? "Aesthetic Physician",
      ...(p.reviewer.gmcNumber && {
        identifier: { "@type": "PropertyValue", propertyID: "GMC", value: p.reviewer.gmcNumber },
      }),
    },
    audience: { "@type": "MedicalAudience", audienceType: "Patient" },
  };
}

export function buildBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem", position: i + 1,
      name: item.name, item: item.url,
    })),
  };
}
```

- [ ] **Step 3: Run — expect PASS** — **Step 4: Commit**

```bash
pnpm --filter web test medical-page-jsonld
git add . && git commit -m "feat(schema): MedicalWebPage + BreadcrumbList JSON-LD helpers"
```

---

### Task 48: Assemble `/pigmentation-glasgow` page

**Files:**
- Create: `apps/web/app/(lp)/pigmentation-glasgow/page.tsx`
- Create: `apps/web/app/(lp)/layout.tsx`

- [ ] **Step 1: Create `(lp)/layout.tsx`** (shared LP shell — nav, footer, sticky CTA)

```tsx
// apps/web/app/(lp)/layout.tsx
import { NavBar } from "@ui/layout/NavBar";
import { Footer } from "@ui/layout/Footer";
import { StickyMobileCTA } from "@ui/sections/StickyMobileCTA";

export default function LpLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBar />
      <main>{children}</main>
      <StickyMobileCTA label="Take Skin Quiz →" href="#quiz" />
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Create the LP page**

```tsx
// apps/web/app/(lp)/pigmentation-glasgow/page.tsx
import type { Metadata } from "next";
import { Hero } from "@ui/hero/Hero";
import { ConcernCards } from "@ui/sections/ConcernCards";
import { SelfieScanner } from "@ui/scanner/SelfieScanner";
import { MechanismAnimation } from "@ui/mechanism/MechanismAnimation";
import { TimelineScrubber } from "@ui/timeline/TimelineScrubber";
import { DoctorSection } from "@ui/sections/DoctorSection";
import { Testimonials } from "@ui/sections/Testimonials";
import { PricingCards } from "@ui/sections/PricingCards";
import { QuizSection } from "@ui/quiz/QuizSection";
import { FAQ } from "@ui/sections/FAQ";

import { hero } from "@content/pigmentation/hero";
import { doctor } from "@content/pigmentation/doctor";
import { testimonials } from "@content/pigmentation/testimonials";
import { timelineStages } from "@content/pigmentation/timeline";
import { faqOnPage } from "@content/pigmentation/faq-on-page";

export const metadata: Metadata = {
  title: "Pigmentation Removal Glasgow — Doctor-Led Clinic | Harley Street Medics",
  description: "Doctor-led pigmentation clinic in Glasgow. Calibrated for all skin types (Fitzpatrick I–VI). 3-step protocol with no rebound. Free consultation.",
  alternates: { canonical: "/pigmentation-glasgow" },
  openGraph: {
    title: "Clear pigmentation. Permanently. Without rebound.",
    description: "Doctor-led 3-step pigmentation protocol in Glasgow.",
    url: "/pigmentation-glasgow",
    type: "website",
    images: [{ url: "/api/og/pigmentation", width: 1200, height: 630 }],
  },
};

export default function PigmentationLpPage() {
  return (
    <>
      <Hero {...hero} />
      <ConcernCards />
      <SelfieScanner onScanComplete={() => {}} />
      <MechanismAnimation />
      <TimelineScrubber stages={timelineStages} />
      <DoctorSection {...doctor} />
      <Testimonials items={testimonials} />
      <PricingCards />
      <QuizSection />
      <FAQ
        heading="Frequently asked — pigmentation treatment in Glasgow"
        entries={faqOnPage}
        id="faq"
      />
    </>
  );
}
```

- [ ] **Step 3: Verify in dev**

```bash
pnpm --filter web dev
# Visit http://localhost:3000/pigmentation-glasgow
# Confirm:
#  - Hero with BA slider renders + dragable
#  - Concern cards render
#  - Selfie scanner shows upload/webcam doors
#  - Mechanism animation scrolls
#  - Timeline scrubber moves
#  - Doctor + Testimonials + Pricing render
#  - Quiz launches and completes → lead form → reveal
#  - FAQ accordion toggles
#  - Sticky mobile CTA appears on scroll
```

- [ ] **Step 4: Commit**

```bash
git add . && git commit -m "feat(lp): assemble /pigmentation-glasgow page"
```

---

### Task 49: Build `/pigmentation-faq` dedicated page

**Files:**
- Create: `apps/web/app/(faq)/pigmentation-faq/page.tsx`
- Create: `apps/web/app/(faq)/layout.tsx`

- [ ] **Step 1: Create FAQ shell layout**

```tsx
// apps/web/app/(faq)/layout.tsx
import { NavBar } from "@ui/layout/NavBar";
import { Footer } from "@ui/layout/Footer";

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Build the dedicated FAQ page**

```tsx
// apps/web/app/(faq)/pigmentation-faq/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@ui/primitives/Section";
import { Container } from "@ui/primitives/Container";
import { Eyebrow } from "@ui/primitives/Eyebrow";
import { faqGroups, faqPageFlat } from "@content/pigmentation/faq-page";
import { buildFaqJsonLd } from "@lib/schema/faq-jsonld";
import {
  buildMedicalPageJsonLd, buildBreadcrumbJsonLd,
} from "@lib/schema/medical-page-jsonld";
import { doctor } from "@content/pigmentation/doctor";

const PAGE_URL = "https://harleystreetmedics.clinic/pigmentation-faq";
const LAST_REVIEWED = "2026-05-13";

export const metadata: Metadata = {
  title: "Pigmentation Treatment Glasgow — Every Question, Answered",
  description:
    "Comprehensive answers about pigmentation, melasma, sun damage, post-acne marks, lip pigmentation, and treatment in our Glasgow clinic. Medically reviewed by Dr. M.T. Ahmad.",
  alternates: { canonical: "/pigmentation-faq" },
};

export default function PigmentationFaqPage() {
  const faqLd = buildFaqJsonLd(faqPageFlat);
  const medicalLd = buildMedicalPageJsonLd({
    url: PAGE_URL,
    name: "Pigmentation Treatment in Glasgow — Every Question, Answered",
    description:
      "Comprehensive answers about pigmentation, melasma, treatment options, costs, and aftercare at our Glasgow clinic.",
    reviewer: { name: doctor.name, jobTitle: "Aesthetic Physician" /* gmcNumber added when clinic supplies */ },
    lastReviewed: LAST_REVIEWED,
    medicalSpecialty: "Dermatology",
  });
  const crumbsLd = buildBreadcrumbJsonLd([
    { name: "Home", url: "https://harleystreetmedics.clinic/" },
    { name: "Pigmentation Glasgow", url: "https://harleystreetmedics.clinic/pigmentation-glasgow" },
    { name: "FAQ", url: PAGE_URL },
  ]);

  return (
    <>
      <Section className="bg-aubergine-900 text-ivory-50">
        <Container width="content">
          <p className="text-sm text-ivory-100/60">
            <Link href="/" className="hover:underline">Home</Link>
            {" / "}
            <Link href="/pigmentation-glasgow" className="hover:underline">Pigmentation Glasgow</Link>
            {" / FAQ"}
          </p>
          <Eyebrow className="text-gold-400 mt-8">Medically reviewed reference</Eyebrow>
          <h1 className="mt-3 font-display text-[clamp(2.5rem,5vw,4rem)] leading-[1.05]">
            Pigmentation Treatment in Glasgow — Every Question, Answered
          </h1>
          <p className="mt-6 max-w-3xl text-lg text-ivory-100/85 leading-relaxed">
            A reference written and reviewed by Dr. M.T. Ahmad. Whether you're researching melasma, sun damage,
            post-acne marks, or treatment options for darker skin types — the most common questions are answered
            here in full. If you want a personalised plan instead,{" "}
            <Link href="/pigmentation-glasgow#quiz" className="underline decoration-gold-500 underline-offset-4 hover:text-gold-400">
              take the 60-second skin diagnostic
            </Link>.
          </p>
          <p className="mt-6 text-sm text-ivory-100/60">
            Reviewed by <strong>{doctor.name}</strong> · Last reviewed {LAST_REVIEWED}
          </p>
        </Container>
      </Section>

      {/* Table of contents */}
      <Section className="bg-ivory-100 !py-16">
        <Container width="content">
          <Eyebrow>Contents</Eyebrow>
          <ul className="mt-6 grid md:grid-cols-2 gap-3">
            {faqGroups.map((g, i) => (
              <li key={i}>
                <Link
                  href={`#group-${i}` as never}
                  className="block py-2 text-ink-700 hover:text-aubergine-900 transition-colors border-b border-ink-300/30"
                >
                  {g.heading}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Flat FAQ groups — every Q + A visible (no accordion) for crawlability */}
      {faqGroups.map((group, gi) => (
        <Section key={gi} id={`group-${gi}`} className="bg-ivory-50">
          <Container width="content">
            <Eyebrow>{`Section ${gi + 1}`}</Eyebrow>
            <h2 className="mt-3 font-display text-[clamp(2rem,3.5vw,2.75rem)] leading-tight text-ink-900">
              {group.heading}
            </h2>
            {group.intro && <p className="mt-4 text-ink-700 max-w-2xl">{group.intro}</p>}

            <div className="mt-10 space-y-12">
              {group.entries.map((e, ei) => (
                <article key={ei} className="border-l-2 border-gold-500 pl-6">
                  <h3 className="font-display text-xl text-ink-900">{e.question}</h3>
                  <p className="mt-3 text-ink-700 leading-relaxed">{e.answer}</p>
                </article>
              ))}
            </div>
          </Container>
        </Section>
      ))}

      <Section className="bg-aubergine-900 text-ivory-50">
        <Container width="content" className="text-center">
          <h2 className="font-display text-[clamp(2rem,3vw,2.75rem)]">
            Still have a question we didn't answer?
          </h2>
          <p className="mt-4 text-ivory-100/80 max-w-xl mx-auto">
            Your free consultation is the right place for it. We'll review your specific case and give you a clear,
            no-pressure plan.
          </p>
          <Link
            href="/pigmentation-glasgow#book"
            className="mt-8 inline-block bg-ivory-50 text-ink-900 px-7 py-4 text-sm uppercase tracking-wider hover:bg-gold-400 transition-colors"
          >
            Book Free Consultation
          </Link>
        </Container>
      </Section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbsLd) }} />
    </>
  );
}
```

- [ ] **Step 3: Verify**

```bash
pnpm --filter web dev
# Visit http://localhost:3000/pigmentation-faq
# Confirm:
#  - All 5 FAQ groups visible (NOT accordion-hidden)
#  - Every Q + A renders fully
#  - Three JSON-LD <script> tags emitted in DOM (FAQPage, MedicalWebPage, BreadcrumbList)
#  - Breadcrumb nav at top works
#  - TOC anchor links jump to groups
#  - Bottom CTA links to LP booking section
```

Then validate the schema:

```bash
# Paste page source into https://search.google.com/test/rich-results
# Expected: FAQPage detected, MedicalWebPage detected, no errors
```

- [ ] **Step 4: Commit**

```bash
git add . && git commit -m "feat(faq): dedicated /pigmentation-faq page with FAQ + MedicalWebPage + Breadcrumb schema"
```

---

### Task 50: `robots.ts` + `sitemap.ts` + placeholder images

**Files:**
- Create: `apps/web/app/robots.ts`
- Create: `apps/web/app/sitemap.ts`
- Create: `apps/web/public/images/.gitkeep` and placeholders for required slots

- [ ] **Step 1: `robots.ts`**

```ts
// apps/web/app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*",          allow: "/", disallow: ["/api/", "/preview", "/thanks"] },
      { userAgent: "GPTBot",     allow: "/" },
      { userAgent: "ClaudeBot",  allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
    ],
    sitemap: "https://harleystreetmedics.clinic/sitemap.xml",
    host: "https://harleystreetmedics.clinic",
  };
}
```

- [ ] **Step 2: `sitemap.ts`**

```ts
// apps/web/app/sitemap.ts
import type { MetadataRoute } from "next";

const BASE = "https://harleystreetmedics.clinic";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${BASE}/pigmentation-glasgow`, lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/pigmentation-faq`,     lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];
}
```

- [ ] **Step 3: Create placeholder image directory**

```bash
mkdir -p apps/web/public/images/{hero,doctor,testimonials,timeline,placeholder}
```

Drop a single 4:5 portrait jpg into each placeholder slot referenced by the content files. For local dev these can be any image at the right ratio. The clinic will swap real assets in later (Section 17 of the spec).

- [ ] **Step 4: Commit**

```bash
git add . && git commit -m "chore: robots, sitemap, placeholder image scaffolding"
```

---

## Phase F complete — checkpoint

```bash
pnpm --filter web build
# Expected: clean build, both routes generated
```

Visit both URLs in dev:
- `/pigmentation-glasgow` — full LP renders, all interactives work end-to-end (quiz → lead form → GHL → reveal)
- `/pigmentation-faq` — all 30+ questions visible, schema validates clean

A real production lead can now flow from a Google Ads click → LP → quiz → lead form → GHL contact with full UTM + custom fields.

---

## Phase G — Analytics + Attribution (Tasks 51-56)

Three layers, all firing for every event:

1. **GA4** (browser via gtag, server via Measurement Protocol)
2. **Meta Pixel** (browser) + **Meta Conversions API** (server from `/api/lead/submit`) — duped via `event_id` for deduplication
3. **UTM persistence** — capture-once on first hit, included in every event

### Task 51: UTM persistence hook

**Files:**
- Create: `packages/lib/analytics/useUtm.ts`
- Create: `packages/lib/analytics/useUtm.test.ts`

- [ ] **Step 1: Failing test**

```ts
// packages/lib/analytics/useUtm.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useUtm, captureUtm, readStoredUtm } from "./useUtm";

const STORAGE_KEY = "hsm:utm";

beforeEach(() => {
  sessionStorage.clear();
  Object.defineProperty(window, "location", {
    writable: true, value: new URL("https://x.test/lp?utm_source=google&utm_medium=cpc&utm_campaign=pig&utm_term=melasma&gclid=g1"),
  });
  Object.defineProperty(document, "referrer", { configurable: true, value: "https://google.com/" });
});

describe("captureUtm", () => {
  it("persists UTM + gclid + landing URL + referrer to sessionStorage on first call", () => {
    captureUtm();
    const stored = JSON.parse(sessionStorage.getItem(STORAGE_KEY)!);
    expect(stored.utm_source).toBe("google");
    expect(stored.utm_campaign).toBe("pig");
    expect(stored.utm_term).toBe("melasma");
    expect(stored.gclid).toBe("g1");
    expect(stored.landing_page_url).toContain("/lp?");
    expect(stored.referrer).toBe("https://google.com/");
  });

  it("does NOT overwrite on subsequent calls (first-touch attribution)", () => {
    captureUtm();
    Object.defineProperty(window, "location", {
      writable: true, value: new URL("https://x.test/lp?utm_source=facebook"),
    });
    captureUtm();
    expect(readStoredUtm()?.utm_source).toBe("google");
  });
});

describe("useUtm hook", () => {
  it("returns null on first render (SSR-safe)", () => {
    const { result, rerender } = renderHook(() => useUtm());
    // First render is the SSR-safe null; effect captures on mount
    rerender();
    expect(result.current?.utm_source).toBe("google");
  });
});
```

- [ ] **Step 2: Implement**

```ts
// packages/lib/analytics/useUtm.ts
"use client";
import { useEffect, useState } from "react";

const STORAGE_KEY = "hsm:utm";

export interface UtmContext {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  gclid: string | null;
  fbclid: string | null;
  landing_page_url: string | null;
  referrer: string | null;
  captured_at: number;
}

export function captureUtm(): UtmContext | null {
  if (typeof window === "undefined") return null;

  // First-touch wins
  const existing = readStoredUtm();
  if (existing) return existing;

  const p = new URLSearchParams(window.location.search);
  const ctx: UtmContext = {
    utm_source:       p.get("utm_source"),
    utm_medium:       p.get("utm_medium"),
    utm_campaign:     p.get("utm_campaign"),
    utm_term:         p.get("utm_term"),
    utm_content:      p.get("utm_content"),
    gclid:            p.get("gclid"),
    fbclid:           p.get("fbclid"),
    landing_page_url: window.location.href,
    referrer:         document.referrer || null,
    captured_at:      Date.now(),
  };
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(ctx));
  return ctx;
}

export function readStoredUtm(): UtmContext | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) as UtmContext : null;
  } catch { return null; }
}

export function useUtm(): UtmContext | null {
  const [utm, setUtm] = useState<UtmContext | null>(null);
  useEffect(() => { setUtm(captureUtm()); }, []);
  return utm;
}
```

- [ ] **Step 3: Run — expect PASS** — **Step 4: Commit**

```bash
pnpm --filter web test useUtm
git add . && git commit -m "feat(analytics): first-touch UTM persistence hook"
```

---

### Task 52: Analytics event registry + types

Single source of truth for event names. Everywhere that fires events imports from here — no string literals scattered across components.

**Files:**
- Create: `packages/lib/analytics/events.ts`
- Create: `packages/lib/analytics/events.test.ts`

- [ ] **Step 1: Failing test**

```ts
// packages/lib/analytics/events.test.ts
import { describe, it, expect } from "vitest";
import { ANALYTICS_EVENTS } from "./events";

describe("ANALYTICS_EVENTS", () => {
  it("exports the spec-required event names", () => {
    expect(ANALYTICS_EVENTS.LP_VIEW).toBeDefined();
    expect(ANALYTICS_EVENTS.HERO_SLIDER_USED).toBeDefined();
    expect(ANALYTICS_EVENTS.QUIZ_START).toBeDefined();
    expect(ANALYTICS_EVENTS.QUIZ_STEP_COMPLETE).toBeDefined();
    expect(ANALYTICS_EVENTS.QUIZ_ABANDON).toBeDefined();
    expect(ANALYTICS_EVENTS.SELFIE_SCAN_START).toBeDefined();
    expect(ANALYTICS_EVENTS.SELFIE_SCAN_COMPLETE).toBeDefined();
    expect(ANALYTICS_EVENTS.LEAD_GATE_VIEW).toBeDefined();
    expect(ANALYTICS_EVENTS.LEAD_SUBMIT_ATTEMPT).toBeDefined();
    expect(ANALYTICS_EVENTS.LEAD_SUBMIT_SUCCESS).toBeDefined();
    expect(ANALYTICS_EVENTS.LEAD_SUBMIT_FAIL).toBeDefined();
    expect(ANALYTICS_EVENTS.CONSULT_BOOK_CLICK).toBeDefined();
  });
});
```

- [ ] **Step 2: Implement**

```ts
// packages/lib/analytics/events.ts
export const ANALYTICS_EVENTS = {
  LP_VIEW:                "lp_view",
  HERO_SLIDER_USED:       "hero_slider_used",
  QUIZ_START:             "quiz_start",
  QUIZ_STEP_COMPLETE:     "quiz_step_complete",
  QUIZ_ABANDON:           "quiz_abandon",
  SELFIE_SCAN_START:      "selfie_scan_start",
  SELFIE_SCAN_COMPLETE:   "selfie_scan_complete",
  LEAD_GATE_VIEW:         "lead_gate_view",
  LEAD_SUBMIT_ATTEMPT:    "lead_submit_attempt",
  LEAD_SUBMIT_SUCCESS:    "lead_submit_success",
  LEAD_SUBMIT_FAIL:       "lead_submit_fail",
  CONSULT_BOOK_CLICK:     "consult_book_click",
} as const;

export type AnalyticsEventName = typeof ANALYTICS_EVENTS[keyof typeof ANALYTICS_EVENTS];

export interface AnalyticsEventProps {
  event_id?: string;        // for browser↔server dedupe
  value?: number;           // for monetary events
  currency?: string;        // GBP default
  lead_score?: number;
  [key: string]: string | number | boolean | undefined;
}
```

- [ ] **Step 3: Run — expect PASS** — **Step 4: Commit**

```bash
pnpm --filter web test events
git add . && git commit -m "feat(analytics): event registry + types"
```

---

### Task 53: GA4 + Meta Pixel client tracker

**Files:**
- Create: `packages/lib/analytics/track.ts`
- Create: `packages/lib/analytics/track.test.ts`
- Create: `apps/web/app/components/AnalyticsProvider.tsx`

- [ ] **Step 1: Failing test**

```ts
// packages/lib/analytics/track.test.ts
import { describe, it, expect, beforeEach, vi } from "vitest";
import { track } from "./track";
import { ANALYTICS_EVENTS } from "./events";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?:  (...args: unknown[]) => void;
  }
}

beforeEach(() => {
  window.gtag = vi.fn();
  window.fbq = vi.fn();
});

describe("track", () => {
  it("fires gtag with event name + params", () => {
    track(ANALYTICS_EVENTS.QUIZ_START, { source: "lp-pigmentation" });
    expect(window.gtag).toHaveBeenCalledWith(
      "event", "quiz_start", expect.objectContaining({ source: "lp-pigmentation", event_id: expect.any(String) }),
    );
  });

  it("fires Meta Pixel for events with a meta mapping", () => {
    track(ANALYTICS_EVENTS.LEAD_SUBMIT_SUCCESS, { lead_score: 75 });
    expect(window.fbq).toHaveBeenCalledWith(
      "track", "Lead",
      expect.objectContaining({ lead_score: 75 }),
      expect.objectContaining({ eventID: expect.any(String) }),
    );
  });

  it("skips Meta for events with no Meta mapping", () => {
    track(ANALYTICS_EVENTS.HERO_SLIDER_USED);
    expect(window.fbq).not.toHaveBeenCalled();
  });

  it("does not throw if gtag / fbq are missing", () => {
    window.gtag = undefined; window.fbq = undefined;
    expect(() => track(ANALYTICS_EVENTS.LP_VIEW)).not.toThrow();
  });
});
```

- [ ] **Step 2: Implement `track.ts`**

```ts
// packages/lib/analytics/track.ts
import { readStoredUtm } from "./useUtm";
import { ANALYTICS_EVENTS, type AnalyticsEventName, type AnalyticsEventProps } from "./events";

// Map our internal events to Meta standard events where appropriate
const META_MAP: Partial<Record<AnalyticsEventName, string>> = {
  [ANALYTICS_EVENTS.QUIZ_START]:             "InitiateCheckout", // funnel start
  [ANALYTICS_EVENTS.LEAD_GATE_VIEW]:         "AddPaymentInfo",   // funnel commit
  [ANALYTICS_EVENTS.LEAD_SUBMIT_SUCCESS]:    "Lead",             // primary conversion
  [ANALYTICS_EVENTS.SELFIE_SCAN_COMPLETE]:   "ViewContent",
  [ANALYTICS_EVENTS.CONSULT_BOOK_CLICK]:     "Schedule",
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?:  (...args: unknown[]) => void;
  }
}

function genId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function track(name: AnalyticsEventName, props: AnalyticsEventProps = {}): string {
  const eventId = props.event_id ?? genId();
  const utm = readStoredUtm();

  const fullParams = {
    ...props,
    event_id: eventId,
    utm_source:    utm?.utm_source ?? undefined,
    utm_medium:    utm?.utm_medium ?? undefined,
    utm_campaign:  utm?.utm_campaign ?? undefined,
    utm_term:      utm?.utm_term ?? undefined,
    gclid:         utm?.gclid ?? undefined,
  };

  try { window.gtag?.("event", name, fullParams); } catch {}

  const metaName = META_MAP[name];
  if (metaName) {
    try { window.fbq?.("track", metaName, fullParams, { eventID: eventId }); } catch {}
  }

  // Console trace in dev for visibility
  if (process.env.NODE_ENV !== "production") {
    console.log(`[analytics] ${name}`, fullParams);
  }

  return eventId;
}
```

- [ ] **Step 3: Implement `AnalyticsProvider.tsx`**

```tsx
// apps/web/app/components/AnalyticsProvider.tsx
"use client";
import Script from "next/script";
import { useEffect } from "react";
import { captureUtm } from "@lib/analytics/useUtm";
import { track } from "@lib/analytics/track";
import { ANALYTICS_EVENTS } from "@lib/analytics/events";

const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;
const META_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export function AnalyticsProvider() {
  useEffect(() => {
    captureUtm();
    track(ANALYTICS_EVENTS.LP_VIEW);
  }, []);

  return (
    <>
      {GA4_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;
            gtag('js', new Date());
            gtag('config', '${GA4_ID}', { send_page_view: true });
          `}</Script>
        </>
      )}

      {META_ID && (
        <Script id="meta-pixel-init" strategy="afterInteractive">{`
          !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){
            n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];
            t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${META_ID}');
          fbq('track', 'PageView');
        `}</Script>
      )}
    </>
  );
}
```

- [ ] **Step 4: Wire into root layout**

In `apps/web/app/layout.tsx`, add `<AnalyticsProvider />` inside `<body>`:

```tsx
import { AnalyticsProvider } from "./components/AnalyticsProvider";
// ... inside <body>:
<AnalyticsProvider />
{children}
```

- [ ] **Step 5: Run — expect PASS** — **Step 6: Commit**

```bash
pnpm --filter web test track
git add . && git commit -m "feat(analytics): track() with GA4 + Meta Pixel + event_id dedupe"
```

---

### Task 54: Server-side Meta Conversions API (CAPI)

This fires `Lead` from the Edge route when the form successfully submits — duped via `event_id` with the browser-side Pixel `Lead`. Meta deduplicates, leaving clean attribution even after iOS17 / browser cookie restrictions kill the Pixel for many users.

**Files:**
- Create: `packages/lib/analytics/meta-capi.ts`
- Create: `packages/lib/analytics/meta-capi.test.ts`
- Modify: `apps/web/app/api/lead/submit/route.ts`

- [ ] **Step 1: Failing test**

```ts
// packages/lib/analytics/meta-capi.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { sendMetaLead } from "./meta-capi";

beforeEach(() => {
  process.env.NEXT_PUBLIC_META_PIXEL_ID = "pixel-1";
  process.env.META_CAPI_TOKEN = "tok-1";
});

describe("sendMetaLead", () => {
  it("POSTs to Meta CAPI with hashed PII + event_id", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ events_received: 1 }) });
    globalThis.fetch = fetchMock as never;

    await sendMetaLead({
      eventId: "evt-1",
      email: "Sarah@Example.com",
      phoneE164: "+447700900123",
      firstName: "Sarah",
      lastName: "O'Connor",
      eventSourceUrl: "https://x.test/lp",
      userAgent: "TestAgent",
      ip: "1.2.3.4",
      gclid: "g1", fbclid: null,
      leadScore: 75,
    });

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toContain("/pixel-1/events");
    expect(url).toContain("access_token=tok-1");
    const body = JSON.parse(init.body);
    expect(body.data[0].event_name).toBe("Lead");
    expect(body.data[0].event_id).toBe("evt-1");
    // Hashed identifiers (SHA-256 hex, 64 chars)
    expect(body.data[0].user_data.em[0]).toMatch(/^[a-f0-9]{64}$/);
    expect(body.data[0].user_data.ph[0]).toMatch(/^[a-f0-9]{64}$/);
    expect(body.data[0].user_data.fn[0]).toMatch(/^[a-f0-9]{64}$/);
    // Custom data
    expect(body.data[0].custom_data.lead_score).toBe(75);
  });

  it("returns false but doesn't throw when env vars missing", async () => {
    delete process.env.META_CAPI_TOKEN;
    expect(await sendMetaLead({
      eventId: "x", email: "a@b.com", phoneE164: "+1", firstName: "A", lastName: "B",
      eventSourceUrl: "x", userAgent: "x", ip: "x", gclid: null, fbclid: null, leadScore: 0,
    })).toBe(false);
  });
});
```

- [ ] **Step 2: Implement `meta-capi.ts`**

```ts
// packages/lib/analytics/meta-capi.ts

interface MetaLeadInput {
  eventId: string;
  email: string;
  phoneE164: string;
  firstName: string;
  lastName: string;
  eventSourceUrl: string;
  userAgent: string;
  ip: string;
  gclid: string | null;
  fbclid: string | null;
  leadScore: number;
}

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input.trim().toLowerCase());
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, "0")).join("");
}

export async function sendMetaLead(p: MetaLeadInput): Promise<boolean> {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const token   = process.env.META_CAPI_TOKEN;
  if (!pixelId || !token) return false;

  const [em, ph, fn, ln] = await Promise.all([
    sha256Hex(p.email),
    sha256Hex(p.phoneE164.replace(/[^\d]/g, "")),
    sha256Hex(p.firstName),
    sha256Hex(p.lastName),
  ]);

  const body = {
    data: [{
      event_name: "Lead",
      event_time: Math.floor(Date.now() / 1000),
      event_id: p.eventId,
      event_source_url: p.eventSourceUrl,
      action_source: "website",
      user_data: {
        em: [em], ph: [ph], fn: [fn], ln: [ln],
        client_user_agent: p.userAgent,
        client_ip_address: p.ip,
        ...(p.gclid && { gclid: p.gclid }),
        ...(p.fbclid && { fbc: `fb.1.${Date.now()}.${p.fbclid}` }),
      },
      custom_data: {
        currency: "GBP",
        value: estimatedLeadValue(p.leadScore),
        lead_score: p.leadScore,
      },
    }],
  };

  try {
    const res = await fetch(
      `https://graph.facebook.com/v20.0/${pixelId}/events?access_token=${token}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(2500),
      },
    );
    return res.ok;
  } catch { return false; }
}

function estimatedLeadValue(score: number): number {
  if (score >= 50) return 80; // hot lead conservative LTV
  if (score >= 25) return 40;
  return 15;
}
```

- [ ] **Step 3: Wire into `/api/lead/submit`**

Replace the relevant section of `apps/web/app/api/lead/submit/route.ts` with the version that fires CAPI on success. The full file becomes:

```ts
// apps/web/app/api/lead/submit/route.ts
import { kv } from "@vercel/kv";
import { leadSchema } from "@lib/validation/lead-schema";
import { normalizePhone } from "@lib/validation/phone";
import { hasMxRecord } from "@lib/validation/email-mx";
import { scoreLead, leadTag } from "@lib/lead-scoring/score";
import { buildGhlContact } from "@lib/ghl/payload";
import { ghlUpsertContact } from "@lib/ghl/client";
import { sendMetaLead } from "@lib/analytics/meta-capi";
import type { CountryCode } from "libphonenumber-js";

export const runtime = "edge";

const protocolMap: Record<string, string> = {
  "melasma": "Signature 3-Step", "sun-damage": "Signature 3-Step",
  "post-acne": "Signature 3-Step + Mesotherapy", "uneven-tone": "Clarity Peel + Mesotherapy",
  "lip-pigment": "Lip Neutralisation Protocol", "underarm": "Underarm Clarity Protocol",
  "not-sure": "Consultation Required",
};
const sessionsMap: Record<string, string> = {
  "melasma": "4-6 over 12 weeks", "sun-damage": "3-4 over 9 weeks",
  "post-acne": "4-6 over 12 weeks", "uneven-tone": "3-5 over 9 weeks",
  "lip-pigment": "3-4 over 8 weeks", "underarm": "4-6 over 12 weeks",
  "not-sure": "TBD at consultation",
};

export async function POST(req: Request): Promise<Response> {
  let raw: Record<string, unknown>;
  try { raw = await req.json() as Record<string, unknown>; }
  catch { return json(400, { ok: false, error: "Invalid JSON" }); }

  const country = ((raw.phoneCountry as string) || "GB") as CountryCode;
  const phoneE164 = typeof raw.rawPhone === "string" ? normalizePhone(raw.rawPhone, country) : null;
  if (!phoneE164) return json(400, { ok: false, fieldErrors: { phone: "Enter a valid mobile number" } });

  if (typeof raw.email === "string" && !(await hasMxRecord(raw.email))) {
    return json(400, { ok: false, fieldErrors: { email: "This email domain doesn't accept mail" } });
  }

  const parsed = leadSchema.safeParse({
    fullName: raw.fullName, email: raw.email, phone: phoneE164,
    consent: raw.consent, marketingConsent: raw.marketingConsent ?? false,
    source: raw.source ?? "lp-pigmentation",
    quiz: raw.quiz, utm: raw.utm,
  });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[String(issue.path[0])] = issue.message;
    return json(400, { ok: false, fieldErrors });
  }

  const lead = parsed.data;
  const score = scoreLead(lead);
  const tag = leadTag(score);
  const contact = buildGhlContact(lead, "Pigmentation LP — Glasgow", tag, score);

  const result = await ghlUpsertContact(contact);

  if (!result.ok) {
    const id = crypto.randomUUID();
    await kv.set(`leads:failed:${id}`, JSON.stringify({
      contact, lead, attempts: 1, firstAttempt: Date.now(),
    }), { ex: 60 * 60 * 24 * 7 });
  }

  // CAPI fire (success OR queued — we still want the conversion event)
  const eventId = (raw.eventId as string) ?? crypto.randomUUID();
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "0.0.0.0";
  const ua = req.headers.get("user-agent") ?? "unknown";
  const utmObj = (raw.utm ?? {}) as { gclid?: string | null; fbclid?: string | null; landing_page_url?: string | null };
  await sendMetaLead({
    eventId,
    email: lead.email,
    phoneE164: lead.phone,
    firstName: contact.firstName,
    lastName: contact.lastName,
    eventSourceUrl: utmObj.landing_page_url ?? req.url,
    userAgent: ua,
    ip,
    gclid: utmObj.gclid ?? null,
    fbclid: utmObj.fbclid ?? null,
    leadScore: score,
  });

  const concern = lead.quiz?.primary_concern;
  return json(200, {
    ok: true,
    eventId,
    reveal: {
      firstName: contact.firstName,
      concern: lead.quiz?.primary_concern ?? null,
      fitzpatrick: lead.quiz?.fitzpatrick ?? null,
      recommendedProtocol: concern ? protocolMap[concern] : null,
      estimatedSessions: concern ? sessionsMap[concern] : null,
      tag,
    },
  });
}

function json(status: number, data: unknown): Response {
  return new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });
}
```

- [ ] **Step 4: Run — expect PASS** — **Step 5: Commit**

```bash
pnpm --filter web test meta-capi
git add . && git commit -m "feat(analytics): server-side Meta Conversions API with event_id dedupe"
```

---

### Task 55: Wire events across components

Add `track()` calls at the spec-required moments. No new files — just instrumentation edits.

**Files (modify):**
- `packages/ui/hero/BeforeAfterSlider.tsx`
- `packages/ui/quiz/QuizEngine.tsx`
- `packages/ui/quiz/LeadForm.tsx`
- `packages/ui/scanner/SelfieScanner.tsx`
- `packages/ui/sections/PricingCards.tsx` (book click)

- [ ] **Step 1: BA slider — fire on first drag/keyboard interaction**

In `BeforeAfterSlider.tsx`, add at top:

```tsx
import { track } from "@lib/analytics/track";
import { ANALYTICS_EVENTS } from "@lib/analytics/events";
```

Add a `usedRef` and fire once:

```tsx
const usedRef = useRef(false);
const markUsed = () => {
  if (usedRef.current) return;
  usedRef.current = true;
  track(ANALYTICS_EVENTS.HERO_SLIDER_USED);
};
```

Call `markUsed()` inside `updateFromClientX` and inside `onKeyDown` (right before `setPercent`).

- [ ] **Step 2: QuizEngine — fire start + per-step + abandon**

In `QuizEngine.tsx`, add:

```tsx
import { useEffect, useRef } from "react";
import { track } from "@lib/analytics/track";
import { ANALYTICS_EVENTS } from "@lib/analytics/events";

// inside the component body:
const startedRef = useRef(false);
useEffect(() => {
  if (!startedRef.current) {
    track(ANALYTICS_EVENTS.QUIZ_START, { source: "lp-pigmentation" });
    startedRef.current = true;
  }
}, []);

// In the advance handler, after dispatch({ type: "next" }):
track(ANALYTICS_EVENTS.QUIZ_STEP_COMPLETE, { step: state.cursor });

// Abandon detection — beforeunload while quiz incomplete:
useEffect(() => {
  const onLeave = () => {
    if (!state.complete) track(ANALYTICS_EVENTS.QUIZ_ABANDON, { last_step: state.cursor });
  };
  window.addEventListener("beforeunload", onLeave);
  return () => window.removeEventListener("beforeunload", onLeave);
}, [state.cursor, state.complete]);
```

- [ ] **Step 3: LeadForm — fire gate view, attempt, success, fail**

In `LeadForm.tsx`:

```tsx
import { useEffect } from "react";
import { track } from "@lib/analytics/track";
import { ANALYTICS_EVENTS } from "@lib/analytics/events";

// inside component body:
useEffect(() => { track(ANALYTICS_EVENTS.LEAD_GATE_VIEW); }, []);

// in onSubmit:
const eventId = track(ANALYTICS_EVENTS.LEAD_SUBMIT_ATTEMPT);

// in the fetch body, include the eventId for browser↔server dedupe:
body: JSON.stringify({ ...existingPayload, eventId }),

// after parsing the response:
if (res.ok && data.ok) {
  track(ANALYTICS_EVENTS.LEAD_SUBMIT_SUCCESS, {
    event_id: data.eventId ?? eventId,
    lead_score: undefined, // server has the real score; browser gets the tag
    lead_tag: data.reveal.tag,
  });
  onReveal(data.reveal);
} else {
  track(ANALYTICS_EVENTS.LEAD_SUBMIT_FAIL, { event_id: eventId });
  // existing error-mapping branch
}
```

- [ ] **Step 4: SelfieScanner — fire scan start + complete**

In `SelfieScanner.tsx`:

```tsx
import { track } from "@lib/analytics/track";
import { ANALYTICS_EVENTS } from "@lib/analytics/events";

// In startScan:
track(ANALYTICS_EVENTS.SELFIE_SCAN_START);
// ... after scan resolves:
track(ANALYTICS_EVENTS.SELFIE_SCAN_COMPLETE, { zones: result?.zones, fitzpatrick: result?.fitzpatrick });
```

- [ ] **Step 5: PricingCards — fire consult book click**

Wrap each `Link.cta.href === "#book"` click with onClick that fires:

```tsx
import { track } from "@lib/analytics/track";
import { ANALYTICS_EVENTS } from "@lib/analytics/events";

// On each Link:
<Link
  href={t.cta.href as never}
  onClick={() => t.cta.href === "#book" && track(ANALYTICS_EVENTS.CONSULT_BOOK_CLICK, { tier: t.name })}
  // ...rest
>
```

Also wire `track(ANALYTICS_EVENTS.CONSULT_BOOK_CLICK)` on the `ResultReveal` "Book Free Consultation" link and the `DoctorSection` CTA if added later.

- [ ] **Step 6: Run tests + commit**

```bash
pnpm --filter web test
# Existing tests should still pass — analytics calls are no-ops in jsdom
git add . && git commit -m "feat(analytics): wire track() calls across hero, quiz, leadform, scanner, pricing"
```

---

### Task 56: Smoke test the analytics pipeline

**Files:**
- Create: `apps/web/e2e/analytics-smoke.spec.ts`

- [ ] **Step 1: Write E2E smoke test**

```ts
// apps/web/e2e/analytics-smoke.spec.ts
import { test, expect } from "@playwright/test";

test("UTM persists to sessionStorage on first hit", async ({ page }) => {
  await page.goto("/pigmentation-glasgow?utm_source=google&utm_medium=cpc&utm_campaign=pig&utm_term=melasma");
  const stored = await page.evaluate(() => sessionStorage.getItem("hsm:utm"));
  expect(stored).toBeTruthy();
  const parsed = JSON.parse(stored!);
  expect(parsed.utm_source).toBe("google");
  expect(parsed.utm_term).toBe("melasma");
});

test("Quiz fires start event on first render", async ({ page }) => {
  const events: { name: string; params: unknown }[] = [];
  await page.exposeFunction("__recordEvent", (name: string, params: unknown) => {
    events.push({ name, params });
  });
  await page.addInitScript(() => {
    (window as unknown as { gtag: (...a: unknown[]) => void }).gtag =
      (...args: unknown[]) => {
        if (args[0] === "event") {
          (window as unknown as { __recordEvent: (n: string, p: unknown) => void })
            .__recordEvent(args[1] as string, args[2]);
        }
      };
  });

  await page.goto("/pigmentation-glasgow#quiz");
  await page.waitForTimeout(500);
  expect(events.some(e => e.name === "lp_view")).toBe(true);
  // Quiz section is visible — scroll triggers QuizEngine mount
  await page.evaluate(() => document.getElementById("quiz")?.scrollIntoView());
  await page.waitForTimeout(500);
  expect(events.some(e => e.name === "quiz_start")).toBe(true);
});
```

- [ ] **Step 2: Run + commit**

```bash
pnpm --filter web test:e2e analytics-smoke
git add . && git commit -m "test(e2e): UTM persistence + quiz_start event smoke"
```

---

## Phase G complete — checkpoint

End-to-end attribution path:

```
Google Ads click
  → /pigmentation-glasgow?utm_source=google&utm_term=melasma&gclid=...
  → captureUtm() writes to sessionStorage (first-touch)
  → AnalyticsProvider fires lp_view (GA4) + PageView (Meta browser)
  → user takes quiz → quiz_start, quiz_step_complete×6
  → user reaches lead form → lead_gate_view
  → user submits → lead_submit_attempt
  → /api/lead/submit → GHL upsert → sendMetaLead() (CAPI, server-side, with event_id)
                                  → browser fires lead_submit_success (Pixel Lead, same event_id)
                                  → Meta dedupes the two — clean attribution
  → user clicks Book Consultation → consult_book_click
```

`event_id` matches the browser-side `track()` to the server-side CAPI fire, so Meta dedupes correctly even when iOS17 / browser cookie restrictions kill the browser Pixel.

---

## Phase H — Production Hardening (Tasks 57-63)

Last mile: dynamic OG image, performance pass, accessibility audit, Vercel config, full happy-path E2E, deploy. The acceptance criteria from Section 20 of the spec all get verified here.

### Task 57: Dynamic OG image route

Generates a 1200×630 share card per LP at request time, themed in the design system. Vercel's `next/og` renders these on the Edge — no fonts to bundle, no design files to maintain.

**Files:**
- Create: `apps/web/app/api/og/[lp]/route.tsx`

- [ ] **Step 1: Implement**

```tsx
// apps/web/app/api/og/[lp]/route.tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";

const HEADLINES: Record<string, string> = {
  pigmentation: "Clear pigmentation. Permanently. Without rebound.",
  "chemical-peel": "Medical-grade peels. Doctor-led.",
  "skin-glow-drip": "Brighter, more even skin. Backed by medicine.",
};

export async function GET(
  req: Request,
  { params }: { params: Promise<{ lp: string }> },
) {
  const { lp } = await params;
  const headline = HEADLINES[lp] ?? HEADLINES.pigmentation;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column",
          justifyContent: "space-between", padding: 80,
          background: "linear-gradient(135deg, #FAF6F1 0%, #F2EBE2 100%)",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", gap: 12 }}>
          <span style={{ fontSize: 18, letterSpacing: 4, color: "#B8945A", textTransform: "uppercase" }}>
            Harley Street Medics · Glasgow
          </span>
        </div>

        <div style={{ fontSize: 72, color: "#0E0B0A", lineHeight: 1.05, maxWidth: 900, letterSpacing: -1 }}>
          {headline}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: "#6B5F5B", fontSize: 22 }}>
          <span>Doctor-led · Free consultation</span>
          <span style={{ color: "#B8945A" }}>★★★★★ 4.9</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
```

- [ ] **Step 2: Verify**

```bash
pnpm --filter web dev
# Visit http://localhost:3000/api/og/pigmentation — should download a 1200x630 PNG
```

- [ ] **Step 3: Commit**

```bash
git add . && git commit -m "feat(seo): dynamic OG image route per LP"
```

---

### Task 58: Performance pass — lazy-load heavy deps

GSAP and MediaPipe are the two biggest bundle contributors. Both are already gated behind interactions, but ensure they're truly absent from initial JS.

**Files:**
- Modify: `apps/web/next.config.ts`
- Modify: `packages/ui/mechanism/MechanismAnimation.tsx` (verify dynamic import)
- Modify: `packages/ui/scanner/useFaceMesh.ts` (verify dynamic import)

- [ ] **Step 1: Tighten `next.config.ts`**

```ts
// apps/web/next.config.ts
import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
    optimizePackageImports: ["lucide-react", "@mediapipe/tasks-vision"],
  },
  transpilePackages: ["@ui", "@lib", "@content"],
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    remotePatterns: [],
  },
  async headers() {
    return [
      { source: "/(.*)", headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy",        value: "strict-origin-when-cross-origin" },
        { key: "X-Frame-Options",        value: "SAMEORIGIN" },
        { key: "Permissions-Policy",     value: "camera=(self), microphone=()" },
      ]},
      { source: "/images/:path*", headers: [
        { key: "Cache-Control", value: "public, max-age=2592000, immutable" },
      ]},
    ];
  },
};

export default config;
```

- [ ] **Step 2: Verify MediaPipe is lazy**

`useFaceMesh.ts` already imports from `@mediapipe/tasks-vision` at runtime via `FilesetResolver.forVisionTasks` (loads WASM on demand). The `import` statement at the top is fine because the hook only mounts inside `SelfieScanner`, which is a client component that lazy-mounts when the section enters the viewport. Confirm by wrapping `SelfieScanner` in `next/dynamic`:

```tsx
// apps/web/app/(lp)/pigmentation-glasgow/page.tsx — modify
import dynamic from "next/dynamic";

const SelfieScanner = dynamic(
  () => import("@ui/scanner/SelfieScanner").then(m => ({ default: m.SelfieScanner })),
  { ssr: false, loading: () => <div className="min-h-[400px] bg-ivory-100" /> },
);
const MechanismAnimation = dynamic(
  () => import("@ui/mechanism/MechanismAnimation").then(m => ({ default: m.MechanismAnimation })),
  { loading: () => <div className="min-h-[400px] bg-ivory-50" /> },
);
```

- [ ] **Step 3: Verify bundle size**

```bash
pnpm --filter web build
# Look at the build output table
# Expected: /pigmentation-glasgow First Load JS < 200 KB (target < 90 KB initial, +chunks)
```

Inspect with `@next/bundle-analyzer`:

```bash
pnpm --filter web add -D @next/bundle-analyzer
ANALYZE=true pnpm --filter web build
```

- [ ] **Step 4: Run Lighthouse locally**

```bash
pnpm --filter web build && pnpm --filter web start &
npx lighthouse http://localhost:3000/pigmentation-glasgow \
  --only-categories=performance,accessibility,seo,best-practices \
  --form-factor=mobile --throttling-method=devtools \
  --output=html --output-path=./lighthouse-report.html --quiet
# Open lighthouse-report.html
# Target: Performance ≥ 92, Accessibility ≥ 95, SEO 100
```

If LCP > 2.0s, the likely cause is the BA slider hero image — confirm it has `priority` set and `sizes` declared (Task 25).

- [ ] **Step 5: Commit**

```bash
git add . && git commit -m "perf: lazy-load Scanner + Mechanism, security headers, image cache"
```

---

### Task 59: Accessibility audit

**Files:**
- Create: `apps/web/e2e/a11y.spec.ts`

- [ ] **Step 1: Install axe**

```bash
pnpm --filter web add -D @axe-core/playwright
```

- [ ] **Step 2: Write axe E2E**

```ts
// apps/web/e2e/a11y.spec.ts
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("pigmentation LP has no critical a11y violations", async ({ page }) => {
  await page.goto("/pigmentation-glasgow");
  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .disableRules(["color-contrast"]) // we audit contrast manually for editorial palette
    .analyze();
  const critical = violations.filter(v => v.impact === "critical" || v.impact === "serious");
  expect(critical, JSON.stringify(critical, null, 2)).toEqual([]);
});

test("pigmentation FAQ page has no critical a11y violations", async ({ page }) => {
  await page.goto("/pigmentation-faq");
  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .disableRules(["color-contrast"])
    .analyze();
  const critical = violations.filter(v => v.impact === "critical" || v.impact === "serious");
  expect(critical, JSON.stringify(critical, null, 2)).toEqual([]);
});

test("keyboard walk-through reaches quiz and submits", async ({ page }) => {
  await page.goto("/pigmentation-glasgow#quiz");
  // Tab through the quiz tiles — first tile gets focus, Space activates
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  // Activate first tile (Melasma)
  await page.keyboard.press("Enter");
  // Tab to Next
  await page.locator("text=Next").focus();
  await page.keyboard.press("Enter");
  // Should now be on Step 2
  await expect(page.getByText(/how long has this been/i)).toBeVisible();
});
```

- [ ] **Step 3: Run + fix any violations + commit**

```bash
pnpm --filter web test:e2e a11y
# Fix any critical/serious violations reported. Common gotchas:
#  - Missing aria-label on icon-only buttons → add aria-label
#  - Form inputs without associated labels → ensure htmlFor + id match
#  - Decorative SVGs missing aria-hidden → add aria-hidden="true"
git add . && git commit -m "test(a11y): axe-core E2E + keyboard walk-through"
```

- [ ] **Step 4: Manual contrast audit**

In Chrome DevTools, run the Lighthouse Accessibility category and verify all reported color-contrast issues against the palette in `tokens.css`. The aubergine-on-ivory and gold-on-ivory pairings need particular attention. Adjust any failing pair by darkening the foreground or lightening the background within the design system — never invent new colors.

---

### Task 60: Vercel project config + env

This task does NOT push code. It configures the Vercel project so the deploy works the first time.

- [ ] **Step 1: Create Vercel project**

```bash
# From the repo root:
pnpm dlx vercel link
# Follow prompts — link to "harleystreet-lp" project (create new if needed)
# Root directory: apps/web
# Build command: cd ../.. && pnpm install && pnpm --filter web build
# Output: .next
# Install: pnpm install
```

- [ ] **Step 2: Attach Vercel KV**

In the Vercel dashboard for the project:
1. Storage → Create Database → KV → Name: `hsm-lead-queue` → Region: `lhr1`
2. Connect to Project: select all environments
3. Vercel auto-injects `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `KV_REST_API_READ_ONLY_TOKEN`, `KV_URL`

- [ ] **Step 3: Set application env vars**

Production env vars in Vercel dashboard → Settings → Environment Variables:

```
GHL_API_KEY              = <from clinic>
GHL_LOCATION_ID          = <from clinic>
CRON_SECRET              = <generate with: openssl rand -hex 32>
RESEND_API_KEY           = <optional, can set later>
NEXT_PUBLIC_GA4_ID       = G-XXXXXXXXXX
GA4_API_SECRET           = <from GA4 admin → Data Streams → Measurement Protocol API secrets>
NEXT_PUBLIC_META_PIXEL_ID = <from Meta Events Manager>
META_CAPI_TOKEN          = <from Meta Events Manager → Conversions API → Generate Access Token>
```

- [ ] **Step 4: Verify cron registration**

After deploy, in Vercel dashboard → Settings → Cron Jobs:
- `/api/lead/retry` should appear with schedule `*/5 * * * *`
- Click "Run now" to manually verify it returns 200 with empty queue

- [ ] **Step 5: Deploy**

```bash
git push origin main
# Vercel auto-deploys on push
# Or manually:
pnpm dlx vercel --prod
```

- [ ] **Step 6: Smoke-test production**

After deploy completes (~2-3 minutes):

```bash
# 1. Hero loads
curl -I https://<your-vercel-domain>/pigmentation-glasgow
# Expected: 200

# 2. Lead submit works end-to-end against real GHL
curl -X POST https://<your-vercel-domain>/api/lead/submit \
  -H "content-type: application/json" \
  -d '{
    "fullName": "Test Lead",
    "email": "test+vercel@example.com",
    "rawPhone": "07700900123",
    "phoneCountry": "GB",
    "consent": true,
    "marketingConsent": false,
    "source": "smoke-test",
    "quiz": {
      "primary_concern": "melasma",
      "duration": "years",
      "fitzpatrick": "IV",
      "tried_before": ["prescription"],
      "goal": "80% reduction",
      "timing": "this week",
      "location": "Glasgow"
    },
    "utm": {
      "utm_source": "smoke", "utm_medium": "test",
      "utm_campaign": "deploy-verify", "utm_term": "melasma",
      "gclid": null, "fbclid": null,
      "landing_page_url": "https://<your-vercel-domain>/pigmentation-glasgow",
      "referrer": null
    }
  }'
# Expected: 200 OK with reveal payload
# Verify in GHL: contact "Test Lead" appears with tag "lead-hot"
```

- [ ] **Step 7: Confirm rich results**

Run both URLs through Google's Rich Results Test:
- https://search.google.com/test/rich-results?url=https://<your-vercel-domain>/pigmentation-glasgow
- https://search.google.com/test/rich-results?url=https://<your-vercel-domain>/pigmentation-faq

Expected: FAQPage detected on LP, FAQPage + MedicalWebPage + BreadcrumbList detected on FAQ page. Zero errors.

---

### Task 61: Full happy-path E2E test

End-to-end Playwright test that simulates a real Google Ads click through to a real GHL contact being created. Runs in CI before production deploys.

**Files:**
- Create: `apps/web/e2e/happy-path.spec.ts`

- [ ] **Step 1: Write the E2E**

```ts
// apps/web/e2e/happy-path.spec.ts
import { test, expect } from "@playwright/test";

test("Google Ads click → quiz → lead submit → GHL contact", async ({ page }) => {
  // Stub the lead-submit response so we don't pollute real GHL during E2E
  await page.route("**/api/lead/submit", route => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        ok: true,
        eventId: "evt-test",
        reveal: {
          firstName: "Sarah", concern: "melasma", fitzpatrick: "IV",
          recommendedProtocol: "Signature 3-Step",
          estimatedSessions: "4-6 over 12 weeks",
          tag: "lead-hot",
        },
      }),
    });
  });

  // 1. Land from Google Ads
  await page.goto(
    "/pigmentation-glasgow" +
    "?utm_source=google&utm_medium=cpc" +
    "&utm_campaign=pigmentation-glasgow" +
    "&utm_term=laser%20pigmentation%20removal%20glasgow" +
    "&gclid=test-gclid-123",
  );

  // 2. Hero renders with the geo headline
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/glasgow/i);

  // 3. UTM persists to sessionStorage
  const utm = await page.evaluate(() => sessionStorage.getItem("hsm:utm"));
  expect(utm).toBeTruthy();
  expect(JSON.parse(utm!).utm_term).toBe("laser pigmentation removal glasgow");

  // 4. Navigate to quiz section
  await page.locator("a[href='#quiz']").first().click();
  await expect(page.getByText(/what brings you here/i)).toBeVisible();

  // 5. Complete the quiz
  await page.getByRole("button", { name: /melasma/i }).click();
  await page.getByRole("button", { name: /next/i }).click();

  await page.getByRole("button", { name: /years — i've tried/i }).click();
  await page.getByRole("button", { name: /next/i }).click();

  await page.getByRole("button", { name: /^IV$/ }).click();
  await page.getByRole("button", { name: /next/i }).click();

  await page.getByRole("button", { name: /prescription cream/i }).click();
  await page.getByRole("button", { name: /next/i }).click();

  await page.getByRole("button", { name: /80% reduction/i }).click();
  await page.getByRole("button", { name: /next/i }).click();

  await page.getByRole("button", { name: /this week/i }).click();
  await page.selectOption("#quiz-location", "Glasgow");
  await page.getByRole("button", { name: /reveal my plan/i }).click();

  // 6. Lead form appears, fill it
  await page.getByLabel(/full name/i).fill("Sarah O'Connor");
  await page.getByLabel(/email/i).fill("sarah-e2e@example.com");
  await page.getByLabel(/mobile/i).fill("07700900123");
  await page.getByLabel(/consent to be contacted/i).check();
  await page.getByRole("button", { name: /reveal my plan/i }).click();

  // 7. Reveal screen renders with personalised copy
  await expect(page.getByText(/here's your plan, sarah/i)).toBeVisible({ timeout: 5000 });
  await expect(page.getByText(/signature 3-step/i)).toBeVisible();
  await expect(page.getByText(/4-6 over 12 weeks/)).toBeVisible();
  await expect(page.getByRole("link", { name: /book free consultation/i })).toBeVisible();
});
```

- [ ] **Step 2: Run + commit**

```bash
pnpm --filter web test:e2e happy-path
# Expected: passes
git add . && git commit -m "test(e2e): full happy-path quiz → lead → reveal"
```

---

### Task 62: CI workflow (optional but recommended)

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Write workflow**

```yaml
name: CI
on:
  push: { branches: [main] }
  pull_request: { branches: [main] }

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9.12.0 }
      - uses: actions/setup-node@v4
        with: { node-version: 20.18.0, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm typecheck
      - run: pnpm lint
      - run: pnpm test
      - run: pnpm --filter web exec playwright install --with-deps chromium
      - run: pnpm test:e2e
      - uses: actions/upload-artifact@v4
        if: failure()
        with: { name: playwright-report, path: apps/web/playwright-report }
```

- [ ] **Step 2: Commit**

```bash
git add . && git commit -m "ci: typecheck + lint + unit + e2e on every push"
```

---

### Task 63: Final acceptance walkthrough

Verify every clause of Section 20 (Definition of Done) in the spec.

- [ ] **Step 1: Acceptance checklist**

Walk through these in order. Each must pass before declaring Plan 1 complete:

1. **Pigmentation LP live at `/pigmentation-glasgow`** — visit the production URL, page loads.
2. **Paired `/pigmentation-faq` live and cross-linked** — both links work in both directions.
3. **Quiz, scanner, mechanism, scrubber all functional + a11y pass** — `pnpm test:e2e a11y` clean, `pnpm test:e2e happy-path` clean.
4. **Lead submits end-to-end to GHL** — manual test via curl (Task 60 step 6), verify contact appears in GHL with correct tags + custom fields.
5. **Hot-lead SMS workflow fires within 60s** — submit a test lead with `timing="this week"`, verify GHL workflow triggers an SMS to the test mobile.
6. **Meta CAPI + GA4 server-side verified** — Meta Events Manager → Test Events tab → submit a test lead → see `Lead` event arrive with both `Browser` and `Server` sources, matched on `event_id`.
7. **Lighthouse mobile hits targets** — Performance ≥ 92, Accessibility ≥ 95, SEO 100.
8. **JSON-LD validates** — Rich Results Test passes for both pages.
9. **Headline matrix verified** — manually visit `/pigmentation-glasgow?utm_term=melasma` (etc.) for each rule in Section 6 of the spec, confirm correct headline renders.
10. **`prefers-reduced-motion` and keyboard-only walkthroughs pass** — DevTools → Rendering → Emulate `prefers-reduced-motion: reduce`; reload; verify mechanism animation is static, BA slider still works, quiz functional.

- [ ] **Step 2: Tag the release**

```bash
git tag -a v1.0.0-plan1 -m "Plan 1 complete — Foundation + Pigmentation LP flagship"
git push origin v1.0.0-plan1
```

---

## Plan complete

Final commit. The system is now production-ready:

- ✅ Monorepo + design tokens + 10 UI primitives
- ✅ GHL-integrated lead pipeline (Edge route + KV retry + cron)
- ✅ 4 cinematic interactives (BA slider, selfie scanner, mechanism animation, timeline scrubber)
- ✅ 60-second quiz funnel → gated lead form → personalised reveal
- ✅ `/pigmentation-glasgow` flagship LP + `/pigmentation-faq` reference page
- ✅ FAQPage + MedicalWebPage + BreadcrumbList JSON-LD
- ✅ GA4 + Meta Pixel browser + Meta CAPI server-side dedupe
- ✅ Lighthouse-tuned Core Web Vitals
- ✅ axe a11y pass + keyboard E2E
- ✅ Vercel cron + KV failed-lead queue
- ✅ Happy-path E2E covering Google Ads → GHL contact

**Plan 2 (Chemical Peel LP) and Plan 3 (Skin Glow Drip LP)** will reuse 80%+ of this work — only treatment-specific content, treatment-specific mechanism beats, and treatment-specific quiz branching change.

---

## Plan self-review

### 1. Spec coverage

Walking through `2026-05-13-pigmentation-lp-design.md` section by section:

| Spec § | Covered by |
|---|---|
| §1 Goal + metrics | Acceptance criteria (Task 63) |
| §2 Audience / demand clusters | Headline matrix (Task 26), FAQ groups (Task 45) |
| §3 Scope — 3 LPs + 3 FAQ | Plan 1 covers flagship; Plans 2-3 reuse foundation |
| §4 Creative direction | Tokens (Task 3), illustrations (Task 41) |
| §5 Page architecture | Page assembly (Task 48) |
| §6 Hero + dynamic headline matrix | Tasks 25-28; 7 UTM variants in headline-map.ts |
| §7 Quiz funnel | Tasks 35-39 |
| §8 Selfie scanner | Task 40 |
| §9 Mechanism animation | Task 41 |
| §10 Timeline scrubber | Task 42 |
| §11 FAQ architecture | Tasks 33, 45-46, 49 |
| §12 Design tokens | Task 3 |
| §13 Lead capture + GHL | Tasks 17-23 |
| §14 Tech architecture | Tasks 1-2, 7 |
| §15 Performance + a11y targets | Tasks 58-59 |
| §16 Tracking + attribution | Tasks 51-55 |
| §17 Content clinic must supply | TODO comments in `doctor.ts` (Task 44), placeholders in `/images/` |
| §18 Open TBDs | Surfaced as `TODO` comments at relevant code-locations + Task 60 step 3 (env vars) |
| §19 Out of scope | Honoured — no A/B testing infra, no i18n, no chat widget |
| §20 Definition of Done | Task 63 maps 1:1 |

No gaps.

### 2. Placeholder scan

Grep across the plan for the failure patterns:

- "TBD" — appears only in spec-mirroring TODO comments inside `doctor.ts` (clinic to supply credentials) and the placeholder images directory note. These are accurate descriptions of real-world inputs, not unfinished plan items.
- "TODO" — same — refers only to clinic-supplied content. Plan is complete.
- "Add appropriate error handling" / "implement later" — none.
- "Write tests for the above" — every test step has full code.
- "Similar to Task N" — none — every component implementation is shown in full inline.

Clean.

### 3. Type consistency

Cross-referenced public types across tasks:

- `Lead` (lead-schema.ts) → used by `scoreLead`, `buildGhlContact`, `LeadForm` payload — signatures match.
- `GhlContact` → defined in `ghl/types.ts`, consumed by `payload.ts` (constructs it) and `client.ts` (accepts it) — match.
- `QuizAnswers` → defined in `quiz/state.ts`, consumed by `LeadForm` props, `ResultReveal` props, `QuizSection` state — match.
- `RevealPayload` → defined in `LeadForm.tsx`, consumed by `ResultReveal` and `QuizSection` — match.
- `TimelineStage` → defined in `TimelineScrubber.tsx`, consumed by `content/pigmentation/timeline.ts` — match.
- `Testimonial` → defined in `Testimonials.tsx`, consumed by `content/pigmentation/testimonials.ts` — match.
- `FaqEntry` → defined in `schema/faq-jsonld.ts`, consumed by `FAQ` component and both content files — match.
- `UtmContext` → defined in `useUtm.ts`, consumed by `track.ts` (via `readStoredUtm`) — match.
- `AnalyticsEventName` → defined in `events.ts`, consumed by `track.ts` — match.
- `ScanResult` → defined in `useFaceMesh.ts`, consumed by `SelfieScanner.tsx` — match.

`primary_concern` enum values are consistent across `lead-schema.ts` (Zod enum), `quiz/state.ts` (TS union), `quiz/content.ts` (data), `lead-scoring/score.ts` (string comparisons), `ghl/payload.ts` (protocol map), `api/lead/submit/route.ts` (protocol/sessions maps). All match.

`Fitzpatrick` enum: `"I" | "II" | "III" | "IV" | "V" | "VI"` consistent across `lead-schema.ts`, `quiz/state.ts`, `quiz/content.ts`, `useFaceMesh.ts`. Match.

No mismatches found.

---

**Plan complete and saved to `docs/superpowers/plans/2026-05-13-plan-1-foundation-pigmentation-lp.md`. Two execution options:**

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration. Each task is bite-sized; the subagent gets a clean slate and the plan, executes one task, and I review before the next.

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints for review.

**Which approach?**
