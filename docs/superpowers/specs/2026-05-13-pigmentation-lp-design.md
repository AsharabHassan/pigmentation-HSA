# Pigmentation / Chemical Peel / Skin Glow Drip — Lead-Gen Landing Page Engine

**Design spec · 2026-05-13**

Client: Harley Street Medics, Glasgow
Reference page being replaced: <https://harleystreetmedics.clinic/lp-pigmentation-removal-glasgow/>
Spec author: Claude (Opus 4.7) with Faisal
Status: Awaiting user sign-off → handoff to `writing-plans`

---

## 1. Goal

Build a **conversion-focused lead-generation engine** for Harley Street Medics' three highest-demand aesthetic treatments: pigmentation removal, chemical peels, and skin glow IV drip. Drive Google Ads traffic into a premium cinematic landing experience that captures qualified leads in GoHighLevel CRM.

### Success metrics (90 days post-launch)

| Metric | Current (existing LP) | Target |
|---|---|---|
| Lead conversion rate | 7.4% (paid traffic) | ≥ 12% |
| Cost per lead | $20.93 | ≤ $14 |
| Google Ads Quality Score (avg.) | Unknown — assume avg 6 | ≥ 8 across pigmentation cluster |
| Lead-to-consult show rate | Not tracked | ≥ 60% |
| Lighthouse Performance | n/a | ≥ 92 (mobile) |
| LCP / INP / CLS | n/a | < 2.0s / < 200ms / < 0.05 |

---

## 2. Audience & demand evidence

### Keyword data summary (1,754 keywords, all-time)

- **3,777 clicks → 278.06 conversions** at $20.93 CPL, 7.36% CVR, $5,819 spent
- 116 keywords have converted at least once

### Five demand clusters (by conversion volume)

| # | Cluster | Hero keywords | Implication |
|---|---|---|---|
| 1 | Pigmentation / hyperpigmentation | "hyperpigmentation removal" (9 conv), "skin pigmentation removal" (8.58), "pigmentation treatment", "melasma treatment" (6, 20% CR) | Primary LP focus |
| 2 | Glasgow / Scotland geo | "laser pigmentation removal glasgow" (8.25 conv, 16% CTR), "chemical peel scotland" (6.6), "pigmentation removal glasgow" | Geo-modified = lowest CPC. Make Glasgow ownership unmistakable in hero. |
| 3 | Chemical peels | "chemical peels" (8.5), "chemical peels glasgow" (4.7), "laser peel face" (5) | Dedicated LP justified by volume |
| 4 | Lip pigmentation (sleeper) | "lip pigment treatment" (9 conv), "lip blushing near me" (5, 20% CR), "lip blush glasgow", "permanent lip pigmentation" | Sub-section on pigmentation LP; explicit ad-cluster hero variant |
| 5 | Skin whitening / brightening / underarm | "skin brightening treatment" (28% CR), "underarm whitening treatment", "whitening treatment for skin" | Skin glow drip LP angle |

### Highest-ROI sub-themes (lowest CPL)

`fix sun damage on face` ($2.41), `age spot remover` ($2.37), `remove freckles` ($2.59, 100% CR), `laser therapy for pigmentation` ($1.55, 75% CR), `how to stop hyperpigmentation` ($0.52). These get dedicated FAQ entries + dedicated quiz-result variants on the pigmentation LP.

### Gaps in the current LP

1. Placeholder counters visible ("0 + Years of Experience")
2. Doctor unnamed beyond initials, zero credentials shown
3. No real testimonials — four unlabelled before/after pairs
4. No interactivity in a category that demands "show me the result"
5. Lip pigmentation cluster (30+ converting keywords) has no on-page landing
6. Generic premium signals — no Harley Street provenance, no doctor proof, no CQC/GMC trust

---

## 3. Scope

**Build three dedicated Next.js landing pages on Vercel, sharing a single design system and component library.**

| URL | Ad cluster | Primary CTA |
|---|---|---|
| `/pigmentation-glasgow` | Pigmentation, hyperpig, melasma, lip pigment, whitening, sun damage, age spots | 60-second skin diagnostic → consultation booking |
| `/chemical-peel-glasgow` | Chemical peels, face peels, laser peels | Skin diagnostic (peel-focused branch) → consultation booking |
| `/skin-glow-drip-glasgow` | Glutathione drip, IV vitamin drip, skin glow drip, brightening | Glow assessment quiz → consultation booking |

Each LP has a paired FAQ page:

- `/pigmentation-faq`
- `/chemical-peel-faq`
- `/skin-glow-drip-faq`

All three LPs share: design tokens, lead form, quiz engine, selfie scanner, mechanism animation pattern, timeline scrubber, FAQ component, schema markup, GHL integration, analytics.

Pigmentation is the flagship — built first, validates the system, then peel + drip follow with their own copy, treatment-specific interactive moments, and ad-match heroes.

---

## 4. Creative direction

**A + B hybrid: Editorial Beauty Brand with Cinematic Diagnostic Lab moments inside the interactive sections.**

The overall register is editorial (Vogue Beauty / Hermès Beauté grade). Inside the selfie scanner, mechanism animation, and timeline scrubber, the visual vocabulary shifts toward clinical precision (scientific overlays, data callouts, diagnostic-feeling UI). The shift is intentional — it signals "this clinic is both refined and rigorous."

**Tone of voice:** confident, calm, doctor-led. Not bubbly. Not corporate. Closer to *the Atlantic* than *Cosmo*. Earns its premium through restraint, accuracy, and respect for the reader's intelligence.

---

## 5. Page architecture (pigmentation LP — flagship)

Sections in scroll order:

1. **Hero** — dynamic ad-message-matched headline, drag-to-reveal BA slider, dual CTA (quiz + consult), trust chip row
2. **The Concern** — empathy + 4 cluster-matched cards (Melasma · Sun damage · Age spots · Post-acne marks)
3. **Interactive #1: Selfie Pigmentation Map** — upload/webcam → scan animation → lead gate → result reveal
4. **Interactive #2: How It Works** — scroll-driven mechanism animation (5 beats)
5. **Interactive #3: Result Timeline Scrubber** — Day 0 → Week 12 progression
6. **The Doctor** — editorial portrait, GMC #, credentials, philosophy
7. **Patient Stories** — 3 testimonial cards (designed for real-asset swap-in)
8. **Pricing & Offer** — Free Consultation £0 · Signature 3-Step Protocol £399 · Maintenance Peel £149
9. **Quiz CTA Banner** — full-width safety-net for users who skipped earlier interactives
10. **FAQ** — 18 questions, accordion, ad-cluster-grouped, FAQPage schema
11. **Clinic & Contact** — address, map, phone, hours
12. **Sticky Mobile CTA Bar** — always-visible "Take Skin Quiz →"

**Order rationale:** hook → empathy → wow-factor interactive (early lead capture) → education → expectation-setting → authority → social proof → offer → safety-net → objection-handling → contact. Three lead-capture moments: hero CTA, selfie-scan reveal gate, sticky bar.

Peel + drip LPs mirror this skeleton; their interactive #1, #2, #3 swap to treatment-specific content (peel: skin-prep simulator, peel-strength selector, peel timeline; drip: IV-formula configurator, glow timeline, glutathione mechanism).

---

## 6. Hero detail

```
NAV (minimal): Logo · Treatments · The Doctor · Book Now ▸

LEFT (image, 60% on desktop):
  Full-bleed drag-to-reveal BA slider, cinematic portrait

RIGHT (content, 40%):
  Eyebrow:    PIGMENTATION CLINIC · GLASGOW  (small caps, gold)
  H1:         [dynamic — see matrix below]
  Sub:        A doctor-led 3-step protocol developed at our
              Harley Street-trained Glasgow clinic.
  CTA-1:      Take 60-Second Skin Diagnostic →
  CTA-2:      Book Free Consultation
  Trust row:  ★★★★★ 4.9 (243)  ·  GMC ✓  ·  CQC ✓  ·  Harley St-trained
```

### Dynamic headline matrix (UTM-driven)

Single LP, headline + BA image swap based on ad keyword UTM:

| `utm_term` matches | Headline rendered |
|---|---|
| `melasma*` | "Stubborn melasma. Finally answered." |
| `hyperpigmentation*` | "Clear hyperpigmentation. Permanently. Without rebound." |
| `*glasgow*` / `*scotland*` | "Glasgow's doctor-led pigmentation clinic." |
| `*whitening*` / `*brightening*` | "Brighter, more even skin. Backed by medicine." |
| `*lip*` | "Restore your lip colour. Naturally. Safely." |
| `*age*spot*` / `*sun*damage*` | "Sun damage, undone. In as few as 3 sessions." |
| `*chemical*peel*` | (redirect to peel LP, not this one) |
| (default) | "Clear pigmentation. Permanently. Without rebound." |

### Motion choreography on load

1. Hero portrait fade in (300ms)
2. Headline glide up + opacity (400ms, `--ease-out`)
3. Sub + CTAs cascade (80ms stagger)
4. Slider handle gives one subtle nudge (signals interactivity)
5. Trust row resolves last

### Mobile

BA slider stacks above text. Trust row condenses to a single line. Sticky "Take Skin Quiz" bar appears after first scroll.

---

## 7. Quiz funnel — 60-second skin diagnostic

Primary conversion engine. 6 questions, ~10s each, branded throughout, premium tone.

### Steps

1. **Primary concern** — single-select tiles (Melasma · Sun damage · Post-acne · Uneven tone · Lip pigment · Underarm · Not sure)
2. **Duration** — `< 6 months` / `months but worsening` / `years` / `decade+`
3. **Skin type (Fitzpatrick I-VI)** — 6 realistic gradient tiles. Critical: drives safe-laser-protocol branching.
4. **What you've tried** — multi-select (OTC creams / prescription / peels / laser elsewhere / home remedies / nothing)
5. **Goal** — clear / 80% reduction / before [event] / long-term maintenance
6. **Timing + Location** — when (this week / 1mo / 3mo / researching) + where (Glasgow / Edinburgh / Scotland / UK / international)

### Lead gate

Sits **between Step 6 and the result reveal**. All three fields required.

```
Title:   "Your personalised plan is ready."
Sub:     A clinician will review and reach out within 1 working day.

Fields:
  Full name *           — ≥2 chars, letters + space + apostrophe
  Email *               — RFC valid + MX-record check
  Mobile number *       — country code dropdown, libphonenumber-js E.164
                          UK default, helper: "We'll send your plan + a
                          booking link by SMS."

Consents:
  ☐ I consent to be contacted about my plan by the clinic. *  (required)
  ☐ Send me occasional skincare tips. (optional)

Submit:  [ Reveal My Plan → ]
Trust:   🔒 Encrypted submission. We never share your data.
Proof:   Testimonial strip under form
```

Submit button disabled until all required validations pass. Inline error messaging on blur.

### Result reveal (post-gate)

```
"Here's your plan, [Name]."

YOUR CONCERN      YOUR SKIN TYPE      ESTIMATED SESSIONS
Melasma           Fitzpatrick IV      4-6 over 12 weeks

── RECOMMENDED PROTOCOL ──
The Signature 3-Step Pigmentation Protocol
  • Calibrated for your skin type (we set laser energy
    differently for Fitzpatrick IV+)
  • Targets melasma without rebound risk
  • £399 per session · plan starts ~£1,196 for 3

── WHY THIS WORKS FOR YOU ──
[Dynamic 2-3 sentence paragraph composed from quiz answers —
 e.g., if Step 4 = prescription creams: "Hydroquinone plateaus
 at ~30% improvement because it only addresses surface melanin.
 The 3-step protocol reaches the dermal layer where melasma
 actually lives."]

── YOUR NEXT STEP ──
[ Book Free Consultation — Glasgow ]  (GHL calendar embed)
[ Call us: 0141-... ]

↓ "Your plan was just emailed to you."
```

### Lead scoring (server-computed)

```
+30  urgency = "this week"
+20  urgency = "within a month"
+15  concern in ["melasma", "sun damage"]
+10  duration = "years" or "decade+"
+10  location = Glasgow / Greater Glasgow
+10  tried = prescription / laser elsewhere / peels
+5   valid mobile (not landline)

Tags emitted to GHL:
  Score ≥ 50 → "lead-hot"
  Score 25-49 → "lead-warm"
  Score < 25 → "lead-cold"
```

### Abandon recovery

If a user starts the quiz and abandons after Step 3:

- `localStorage` flag stores progress
- Exit-intent modal: "Save your progress? We'll email what we've got so far."
- Email-only mini-form, captured separately, tagged `quiz-partial`

---

## 8. Selfie-upload Pigmentation Map

### Flow

1. **Entry** — two doors: "Upload selfie" / "Use webcam". Privacy chip prominent.
2. **Scan animation** (2.5s) — face landmark mesh resolves → vertical scan line sweeps → pigmentation zones highlight one by one → Fitzpatrick estimate appears.
3. **Lead gate** — same component as quiz gate (Section 7). Name + email + phone required.
4. **Reveal** — annotated photo + zone density + dominant pattern + recommended protocol + estimated sessions + anchor to booking.

### Tech / honesty

- **Runtime:** MediaPipe FaceMesh (WASM, on-device). 468 landmarks for stable region map.
- **Analysis:** LAB colour-space variance per region + common pattern distribution. Visualisation only.
- **Framing copy:** "This tool is for visualisation. A clinical assessment by Dr. Ahmad confirms your actual diagnosis and protocol." Never claim diagnostic accuracy.
- **Privacy:** images never leave the device. Stated explicitly in UI, in `/privacy`, and in the GDPR-friendly consent text.

### Accessibility

- "Skip to quiz" link at top of component
- Keyboard-operable: upload via Enter, webcam via Space
- All states announce to screen readers
- Result has text-equivalent description, not image-only

---

## 9. Mechanism animation ("How It Works")

5-beat scroll-driven cinematic SVG sequence on the pigmentation LP. Left column = scroll-locked captions, right column = animated visualization.

| Beat | Visual | Caption |
|---|---|---|
| 1 | Skin cross-section, melanin clusters at multiple depths | "The skin you see is only the surface. Pigmentation lives at multiple depths — topical creams only reach the top 15%." |
| 2 | VirtueRF needle array descending, microchannels opening | "Precision microchannels create access without damaging surrounding tissue." |
| 3 | Pulsed laser fragments melanin particles | "Pulsed-mode technology fragments melanin without triggering inflammation — the root cause of rebound." |
| 4 | Nutrient particles flowing through channels | "Growth factors and customised actives accelerate clearance and even tone — for weeks after the session." |
| 5 | Clean, even-toned skin layers | "Clear skin that holds — typically over 4-6 sessions spaced 3 weeks apart." |

**Build:** SVG + GSAP ScrollTrigger (or Framer Motion `useScroll`). Not video — scroll-driven SVG is sharper, lighter, edit-friendly, deep-linkable.

**Reduced motion:** static 5-panel diagram with identical captions. Functional + still elegant.

**Inline CTA at end:** "See if this protocol suits your skin — take the 60-sec diagnostic →"

Peel LP variant: 3 beats (prep → peel → recovery) for whichever peel tier they select.
Drip LP variant: 4 beats (formulation → IV path → cellular antioxidant action → glow result).

---

## 10. Result-timeline scrubber

Horizontal scrubber: Day 0 → Week 2 → Week 4 → Week 6 → Week 9 → Week 12. Three synchronized layers update on scrub:

1. Patient image (6 stages, cross-faded)
2. Context paragraph (manages expectations — including the "may darken first" phase around Week 4)
3. "Your session this week" callout (anchors the user inside the protocol they'd undergo)

**Purpose:** pre-empt the biggest reason aesthetic leads ghost — unmanaged expectations. Showing the temporary worsening at Week 4 raises booking confidence by removing surprise.

**Mobile:** snap-stop horizontal carousel.

---

## 11. FAQ architecture

Two tiers, both emit `FAQPage` JSON-LD.

### On-page FAQ (each LP — 18 questions, accordion)

Grouped by ad-cluster intent so every paid click finds the question that brought them:

| Group | Mapped ad cluster | Sample questions |
|---|---|---|
| A. Understanding the condition | "what is hyperpigmentation", "melasma vs pigmentation", "how to stop hyperpigmentation" | What is pigmentation? · Difference between hyperpigmentation, melasma, sun damage? · Why does pigmentation keep coming back? · Can darker skin (Fitzpatrick IV-VI) be safely treated? |
| B. How treatment works | "laser pigmentation removal", "picosure", "pico laser", "carbon laser facial" | How does laser pigmentation removal work? · What is the 3-step Signature Protocol? · Why pulsed-mode prevents rebound · PicoSure vs Q-switched vs IPL |
| C. Safety & side effects | medical-trust queries | Is it safe? · Downtime? · Can pigmentation get worse before better? |
| D. Results & timeline | "how long", "results" | How many sessions? · How long do results last? · When will I see first change? |
| E. Cost & booking | "cost", "price", "near me", "glasgow" | How much? · Finance available? · Free consult? · How quickly can I book? |

Each answer ≥ 3-5 sentences, substantive, links to the relevant LP section.

### Dedicated `/pigmentation-faq` page

40-60 questions, flat hierarchy (not accordion-hidden) so every Q + A is crawlable. Includes:

- The on-page 18 (canonical answers)
- Long-tail per-condition entries (melasma, PIH, café-au-lait, lentigines, lip pigmentation, underarm pigmentation, freckles)
- Treatment-specific deep dives (3-step protocol, PicoSure, peels, glutathione drip, topical regimes)
- Safety-by-skin-type (Fitzpatrick IV-VI calibration explained)
- Pregnancy / medications / disqualifying conditions
- Pricing transparency table
- Aftercare schedule Day 1 → Week 12

Schema on the dedicated page: `FAQPage` + `MedicalWebPage` + `Person` (Dr. Ahmad, medical reviewer with `medicalSpecialty`) + `BreadcrumbList` + `lastReviewed` + `reviewedBy`.

Each LP cross-links to its FAQ page. FAQ pages cross-link to the relevant LP.

### Why this matters for paid

Landing Page Experience score weighs useful, original content and ease of navigation. A genuine 40+ question reference page on the topic the LP advertises is the highest-leverage path from Average → Above Average LP Experience — typically reducing CPC 15-30%.

---

## 12. Design system tokens

### Palette

```
INK
  --ink-900    #0E0B0A    primary text, headlines
  --ink-700    #2A2422    secondary text
  --ink-500    #6B5F5B    tertiary, captions
  --ink-300    #C4B8B0    borders, dividers

IVORY
  --ivory-50   #FAF6F1    page background
  --ivory-100  #F2EBE2    section bg, cards
  --ivory-200  #E6DCCF    subtle dividers, input bg

AUBERGINE
  --aubergine-900  #2A1422   hero gradients, doctor section
  --aubergine-700  #4A2438   hover states

GOLD
  --gold-500   #B8945A    primary accent (sparingly)
  --gold-400   #C9A874    hover
  --gold-200   #E8D8B8    focus rings, subtle highlights

FUNCTIONAL
  --clinical-blue-500  #4A6B7D   diagnostic/scientific overlays only
  --success-500        #5B7A52
  --warn-500           #B8763A
  --error-500          #A03A2E
```

**Palette rule:** any single component uses at most 3 core colours. Gold is precious — sparingly or it stops feeling premium.

### Typography

```
DISPLAY       Fraunces (variable, optical) · 500 default, 700 rare
              Fallback: 'Times New Roman', Georgia, serif
              Tracking -0.02em on display, leading 1.05-1.15

BODY + UI     Inter (variable) · 400 body, 500 UI, 600 buttons
              Fallback: -apple-system, 'Segoe UI', sans-serif
              Tracking 0, leading 1.55 body / 1.4 UI

EYEBROW       Inter 12-13px, +0.12em, UPPERCASE, gold-500

NUMERIC       Fraunces with tabular-nums feature on
```

Fluid scale (`clamp`):
```
--text-display  clamp(48px, 6.5vw, 88px)
--text-h1       clamp(36px, 4.5vw, 56px)
--text-h2       clamp(28px, 3vw, 40px)
--text-h3       clamp(20px, 2vw, 24px)
--text-lead     clamp(18px, 1.4vw, 22px)
--text-body     16px
--text-sm       14px
--text-xs       12px
```

### Spacing

8px base. Section rhythm in multiples of 24.

```
--space-1   4px      --space-12   48px      --space-32  128px
--space-2   8px      --space-16   64px      --space-40  160px
--space-3  12px      --space-24   96px      --space-48  192px
--space-4  16px
--space-6  24px
--space-8  32px

Containers:
--w-narrow   640px    long-form copy
--w-content  960px    most sections
--w-wide    1240px    interactive moments
--w-bleed    100vw    hero
```

### Motion

```
DURATION
  --dur-snap     120ms     micro
  --dur-quick    240ms     hover/focus
  --dur-glide    480ms     reveals
  --dur-cinema   820ms     hero stagger

EASING
  --ease-out     cubic-bezier(0.16, 1, 0.3, 1)        default
  --ease-in-out  cubic-bezier(0.65, 0, 0.35, 1)       transitions
  --ease-soft    cubic-bezier(0.4, 0.0, 0.2, 1)       material

Stagger:  80ms cascade between children of any reveal group
```

**Rules:** every motion has a clear cause (no autoplay loops). `prefers-reduced-motion` strips entrance animations, freezes mechanism animation to static diagram, replaces parallax with fades.

### Component primitives

```
Button (Primary)
  • ink-900 bg · ivory-50 text · 14px/28px padding
  • 1px gold-500 outset ring (4px offset)
  • Hover: aubergine-900 bg
  • Focus: gold-200 ring (3px)

Button (Secondary)
  • Transparent · 1px gold-500 border · ink-900 text
  • Hover: ink-900 bg, ivory-50 text

Button (Link)
  • ink-900 text · gold-500 underline · hover gold-400

Input
  • ivory-200 bg · 1px ink-300 border · 16px/18px padding
  • Focus: gold-500 border + ivory-50 bg
  • Label above (uppercase eyebrow style)
  • Help text below in ink-500

Card (treatment / testimonial)
  • ivory-100 bg · 1px ink-300/40 border · 32px padding
  • Image top, content stacked
  • Hover: 2px lift + soft warm-tinted shadow

Accordion (FAQ)
  • ink-900 question (weight 500) · ink-700 answer
  • 1px ink-300/50 divider between items
  • Plus → minus icon (no caret)
  • Expand: --dur-glide --ease-out

Pill / Chip
  • ivory-100 bg · ink-700 text · 12px x 8px padding
  • Optional gold-500 dot prefix for "premium" chips

Eyebrow (small caps label)
  • 12px Inter · +0.12em tracking · UPPERCASE · gold-500

Section
  • Vertical rhythm: --space-32 (desktop) / --space-24 (mobile)
  • Container width per content type (--w-narrow / --w-content / --w-wide)
```

All primitives reference the tokens above — no hard-coded values inside components.

### Imagery direction

- Hero: cinematic editorial portraiture (generated or licensed), diverse skin tones across the 3 LPs
- Doctor: environmental portrait, available light, defocused clinic
- Treatment animation: custom vector illustration (not stock medical)
- Subtle film-grain overlay (3% opacity) on hero + section breaks
- **No stock-looking photography. Ever.** If a real photo isn't available, the section gets editorial illustration or stays text-led on rich layout.

### Iconography

Lucide outline, 1.5px stroke, 16/20/24/32 sizes, inherits colour.

### Accessibility minimums

- Contrast: 4.5:1 body, 3:1 large
- Tap targets: ≥ 44×44px
- Visible focus rings (gold-200, 3px offset)
- Quiz, slider, scrubber fully keyboard-operable
- BA slider has number-input fallback for screen readers
- Selfie scan has "skip to quiz" fallback
- `prefers-reduced-motion` respected throughout
- Strict heading hierarchy
- Alt text drafted at component level

---

## 13. Lead capture flow + GoHighLevel integration

### Capture rule

**Name + email + phone all required before any plan/result reveal.** Applies to both the quiz funnel and the selfie scanner. Phone uses libphonenumber-js validation against country code, normalises to E.164.

### Submission pipeline

```
Client form submit
   ↓ POST /api/lead/submit  (Next.js Route Handler, Edge runtime)
   ↓
1. Zod schema validation
2. Server re-validates name / email (MX check) / phone (E.164)
3. Lead-scoring formula computes hot/warm/cold tag
4. Build GHL contact payload
5. POST to GHL:
     https://services.leadconnectorhq.com/contacts/
     Headers:
       Authorization: Bearer ${GHL_API_KEY}
       Version: 2021-07-28
6. On success → return reveal payload to client (200)
   On failure → enqueue to Vercel KV `leads:failed:{uuid}`
              → return 200 with reveal anyway (user not punished)
              → cron retries every 5 min for 1hr
              → after 1hr → alert email to ops
7. Server-side Meta Conversions API fire (clean post-iOS17 attribution)
```

### GHL contact payload structure

```json
{
  "firstName": "...",
  "lastName": "...",
  "email": "...",
  "phone": "+44...",
  "source": "Pigmentation LP — Glasgow",
  "tags": [
    "lp-pigmentation",
    "quiz-complete",
    "concern-melasma",
    "fitzpatrick-IV",
    "urgency-this-week",
    "loc-glasgow",
    "lead-hot"
  ],
  "customFields": {
    "primary_concern": "melasma",
    "duration": "years",
    "fitzpatrick": "IV",
    "tried_before": ["prescription", "OTC creams"],
    "goal": "80% reduction",
    "timing": "this week",
    "location": "Glasgow",
    "recommended_protocol": "Signature 3-Step",
    "estimated_sessions": "4-6 over 12 weeks",
    "lead_score": 75,
    "utm_source": "google",
    "utm_medium": "cpc",
    "utm_campaign": "pigmentation-glasgow",
    "utm_term": "laser pigmentation removal glasgow",
    "gclid": "...",
    "fbclid": "...",
    "landing_page_url": "https://.../pigmentation-glasgow?...",
    "referrer": "..."
  }
}
```

### GHL-side configuration (not code)

- Custom fields created in GHL to match payload keys
- Smart lists segment by score tag
- Workflows:
  - **Hot lead (urgency=this-week + valid mobile):** SMS within 60s ("Hi {name}, this is Dr. Ahmad's team — your plan is on the way. Want a spot this week? Book here: {calendar-link}") + Slack/email to reception within 60s
  - **Warm:** 3-touch email sequence over 5 days
  - **Cold:** 5-email educational nurture over 14 days
- Calendar booking link embedded in confirmation SMS + email

### Why we don't embed a GHL form directly

Loses cinematic experience, heavy embed, breaks design system, no server-side validation, no clean UTM/gclid pass-through. We POST to GHL via our own Edge route — full control, still lands in GHL.

---

## 14. Tech architecture

**Hosting:** Vercel Pro · Vercel KV · Vercel Cron · Vercel Analytics + Speed Insights
**Framework:** Next.js 15 (App Router, Server Components, Edge runtime where applicable)
**Language:** TypeScript strict
**Styling:** Tailwind CSS v4 with token-driven CSS variables; PostCSS for nested rules
**Motion:** Framer Motion (page-level) + GSAP ScrollTrigger (mechanism animation)
**Forms:** react-hook-form + Zod (shared schema client + server)
**Phone validation:** libphonenumber-js
**Email MX check:** lightweight on-Edge DNS lookup via DNS-over-HTTPS
**Selfie scanner:** MediaPipe Tasks Vision (FaceMesh) via WASM, client-only
**Analytics:** GA4 + Meta Pixel (browser) + Meta Conversions API (server-side from `/api/lead/submit`) + GA4 Measurement Protocol (server)
**Email fallback:** Resend (transactional `your plan` email if GHL hasn't fired)

### Monorepo layout

```
harleystreet-lp/                     pnpm workspaces
├── apps/
│   └── web/                          Next.js 15 app
│       ├── app/
│       │   ├── (lp)/
│       │   │   ├── pigmentation-glasgow/page.tsx
│       │   │   ├── chemical-peel-glasgow/page.tsx
│       │   │   └── skin-glow-drip-glasgow/page.tsx
│       │   ├── (faq)/
│       │   │   ├── pigmentation-faq/page.tsx
│       │   │   ├── chemical-peel-faq/page.tsx
│       │   │   └── skin-glow-drip-faq/page.tsx
│       │   ├── api/
│       │   │   ├── lead/submit/route.ts        Edge
│       │   │   ├── lead/retry/route.ts         Cron
│       │   │   └── og/[lp]/route.ts            Dynamic OG
│       │   ├── thanks/page.tsx
│       │   ├── layout.tsx
│       │   └── globals.css
│       └── next.config.ts
│
├── packages/
│   ├── ui/                                     Shared components
│   │   ├── Hero/                               BA slider + dynamic headline
│   │   ├── Quiz/                               6-step state machine
│   │   ├── SelfieScanner/                      MediaPipe + canvas
│   │   ├── MechanismAnimation/                 SVG + GSAP
│   │   ├── TimelineScrubber/                   scrubber
│   │   ├── LeadForm/                           gated form
│   │   ├── FAQ/                                accordion + schema
│   │   ├── PricingCards/, Testimonials/, ...
│   │   └── tokens/                             colours, type, motion
│   ├── content/                                MDX per LP
│   ├── lib/
│   │   ├── ghl/                                client, payload builder
│   │   ├── analytics/                          GA4, Meta, GTM
│   │   ├── leadScoring/                        formula
│   │   └── schema/                             JSON-LD helpers
│   └── config/                                 tsconfig, eslint, prettier
│
└── vercel.json                                 cron, env, regions
```

### Env vars

`GHL_API_KEY`, `GHL_LOCATION_ID`, `RESEND_API_KEY`, `META_PIXEL_ID`, `META_CAPI_TOKEN`, `GA4_ID`, `GA4_API_SECRET`, `KV_*` (auto-provisioned by Vercel).

---

## 15. Performance & accessibility targets

| Metric | Target |
|---|---|
| Lighthouse Performance (mobile) | ≥ 92 |
| Lighthouse Accessibility | ≥ 95 |
| Lighthouse SEO | 100 |
| LCP | < 2.0s on 4G |
| INP | < 200ms |
| CLS | < 0.05 |
| Initial JS (gzipped) | < 90KB per LP |
| Total page weight (initial render) | < 350KB |

**Tactics:**

- Server Components by default; interactive components as client islands only where needed
- Fonts: `next/font` with `display: swap` + preload only display weight on hero
- Images: `next/image`, AVIF/WebP, responsive `sizes`, blur placeholders
- LCP element: hero portrait — preload, `fetchPriority="high"`, dimensions set, no layout shift
- GSAP + MediaPipe lazy-loaded on user interaction (not on first paint)
- Tailwind v4 zero-runtime, purged aggressively
- `prefers-reduced-motion` honored throughout

---

## 16. Tracking & attribution

### Events (GA4 + Meta Pixel + server-side dupes)

| Event | Fires when |
|---|---|
| `lp_view` | Page mount, with UTM context |
| `hero_slider_used` | First drag of BA slider |
| `quiz_start` | Question 1 rendered |
| `quiz_step_complete` | Each step submitted, with step number |
| `quiz_abandon` | Beforeunload while quiz in progress |
| `selfie_scan_start` | Upload accepted or webcam granted |
| `selfie_scan_complete` | Scan animation finishes |
| `lead_gate_view` | Form rendered |
| `lead_submit_attempt` | Form submit clicked |
| `lead_submit_success` | 200 from `/api/lead/submit` |
| `lead_submit_fail` | Non-2xx response |
| `consult_book_click` | Calendar embed opened |
| `consult_booked` | Calendar webhook (from GHL) |

`lead_submit_success` and `consult_booked` mirror server-side via Meta CAPI and GA4 Measurement Protocol for clean attribution post-iOS17.

### UTM hygiene

Single `useUtm()` hook persists UTMs + gclid + fbclid to `sessionStorage` on first hit. Every lead payload includes the original landing UTM set even if the user moved between pages.

---

## 17. Content the clinic must supply

Marked clearly so we can ship with placeholders and swap later.

- Doctor: full name (currently "Dr. M.T. Ahmad"), GMC number, qualifications, environmental portrait, 80-100 word philosophy quote
- Before / after photos: 6+ pairs across pigmentation conditions, with patient consent
- Testimonials: 6+ named (first name + city + star + 1-3 line quote)
- Real Trustpilot / Google review counts + screenshots
- CQC registration number
- Patient progression sequence for timeline scrubber (6 stages, same patient ideally)
- Final pricing confirmation (current LP says £299 / £399 / £149)
- Glow drip formulation specifics (current LP mentions Glutathione + Vit C + B Complex)
- Chemical peel tiers + acids used
- Booking calendar URL from GHL

Until supplied, every slot uses cinematic editorial illustration or text-rich layouts that earn their space without weak imagery.

---

## 18. Open questions / TBDs

These don't block the implementation plan but need answers during build:

1. **Doctor's full credentials** — needed verbatim for the doctor section + FAQ author byline + schema `Person.medicalSpecialty`
2. **GHL Location ID** + API key access — needed to test the `/api/lead/submit` route
3. **Calendar embed source** — GHL native calendar vs Calendly vs Cal.com
4. **Domain / subdomain decision** — `harleystreetmedics.clinic/pigmentation-glasgow` vs `lp.harleystreetmedics.clinic` vs new domain. Affects DNS, SSL, and how the existing WP site coexists with the Next.js app.
5. **Skin glow drip treatment details** — current LP describes it minimally. Need formulation, session length, frequency, contraindications.
6. **Chemical peel tiers** — which acids (glycolic / salicylic / TCA), strengths, downtime per tier.
7. **Real before/after asset readiness ETA** — informs whether launch uses illustration-first or photo-first.

---

## 19. Out of scope (explicitly)

- A/B testing framework (post-launch addition)
- Multilingual support (English UK only at launch)
- Live chat widget (lead form is the primary capture; chat adds noise pre-launch)
- Blog / article hub (FAQ pages serve the SEO function for v1)
- Patient login / portal
- Online payment / deposit collection (post-launch — GHL handles booking deposits if needed)

---

## 20. Definition of done

A landing page passes acceptance when all of the following are true:

1. Pigmentation, chemical peel, and skin glow drip LPs are live at their three URLs on Vercel
2. Each has its paired FAQ page live and cross-linked
3. Quiz, selfie scanner, mechanism animation, and timeline scrubber all functional + accessibility-pass
4. Lead form submits successfully end-to-end to GHL with full payload (verified by a real contact appearing in GHL with correct tags and custom fields)
5. Hot-lead SMS workflow fires within 60s of a test submission
6. Meta Conversions API + GA4 server-side events verified
7. Lighthouse mobile scores hit targets in Section 15
8. JSON-LD schema validates clean against Google's Rich Results Test for FAQPage + MedicalWebPage
9. Dynamic hero headline matrix verified across all UTM permutations
10. `prefers-reduced-motion` and keyboard-only walkthroughs pass

---

## Appendix A — Component inventory

| Component | Used on | Notes |
|---|---|---|
| `<Hero>` | All 3 LPs | Dynamic headline, BA slider, trust row |
| `<BeforeAfterSlider>` | Hero | Drag-to-reveal, keyboard alt |
| `<DynamicHeadline>` | Hero | UTM-driven copy map |
| `<ConcernCards>` | All 3 LPs | 4 cluster-matched cards |
| `<SelfieScanner>` | Pigmentation, Drip | MediaPipe-based, gated |
| `<MechanismAnimation>` | All 3 LPs | Scroll-driven SVG |
| `<TimelineScrubber>` | All 3 LPs | 6-stage scrubber |
| `<DoctorSection>` | All 3 LPs | Editorial bio |
| `<Testimonials>` | All 3 LPs | 3-card row |
| `<PricingCards>` | All 3 LPs | 3-tier card layout |
| `<QuizEngine>` | All 3 LPs | 6-step, branched |
| `<LeadForm>` | Quiz + Scanner | Gated, validated |
| `<ResultReveal>` | Quiz + Scanner | Dynamic copy |
| `<FAQ>` | All 3 LPs | Accordion + JSON-LD |
| `<FAQPage>` | 3 dedicated FAQ pages | Flat hierarchy + extended schema |
| `<StickyMobileCTA>` | All 3 LPs | Always-visible bar |
| `<TrustRow>` | Hero, FAQ pages | Compact badges |
| `<NavBar>`, `<Footer>` | All pages | Minimal |

---

## Appendix B — Files for reference

- Keyword performance data: `Search keyword report (25).csv` (1,754 keywords, all-time)
- Existing LP reference: `https://harleystreetmedics.clinic/lp-pigmentation-removal-glasgow/`
