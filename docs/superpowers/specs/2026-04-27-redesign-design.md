# Portfolio redesign — design spec

**Date:** 2026-04-27
**Status:** approved (pending user spec review)
**Scope:** full visual + tonal redesign of every section except current Hero (kept for A/B comparison).

---

## 1. Why

The current portfolio has three problems the user wants fixed:

1. **Tone is brag-adjacent and Flashback-Labs-dependent.** "ENGINEER BEHIND THE COMPANY", repeated employer references, and self-proclamation read as insecure rather than confident.
2. **Design is military/dossier cosplay.** Strings like `CHANNEL OPEN`, `FILE 02 / DOSSIER`, `CLEARANCE · PUBLIC`, `4 OF 4 PUBLIC`, `FILED · SEP 2024 — APR 2026` are placed for vibe, not meaning. The aesthetic reads as costume.
3. **Projects don't communicate.** Hand-drawn architecture flowcharts (`GrokDiagram`, `AuraDiagram`) crowd the section without explaining what each project is or what the user actually built. A first-time reader cannot tell what AURA *does*.

Secondary issues:

- Palette is red-on-pure-black. User wants Iron Man Mark III warmth: red + antique gold + bronze on warm charcoal, not pure black.
- Pure-black backgrounds across every section read monolithic. Sections don't breathe.

## 2. What we're keeping

- Current Hero (`src/components/sections/Hero.tsx` + `src/components/hero/*`) — user likes the photo + HUD + text layering. Compared head-to-head against a redesigned variant before we decide whether to swap.
- Section ordering: Hero → About → Selected Work → By the Numbers → Stack → Now → Contact.
- The "wow moment" of the By the Numbers section — its visual richness is the most-loved part.
- Custom font choices (Astro, Declandar, Chakra) and the Lenis smooth scroll.

## 3. What we're changing

### 3.1 Identity & tone

Lead identity (used on Hero, About header, OG meta):

> Mokshith Rao — engineer who ships distributed systems and AI tooling.

Tone rules applied across every section:

- Lead with **capability**, not employer. Flashback Labs appears once in the experience timeline, alongside the IEI mentor role; nowhere else.
- No fake-classified copy. Banned strings: `CHANNEL OPEN`, `DOSSIER`, `FILE 0X`, `CLEARANCE · PUBLIC`, `END FILE`, `FILED · MMM YYYY — MMM YYYY`, `X OF Y PUBLIC`, `TRANSMISSION`.
- Micro-meta only when it carries real information. `4 projects · 2024–2026` is fine; `FILED · SEP 2024 — APR 2026` is not.
- Drop "ENGINEER BEHIND THE COMPANY" headline. Replace with capability-led equivalent (e.g. `I BUILD / PRODUCTION / SYSTEMS.`).

### 3.2 Palette — Iron Man Mark III + signal-red accent

Add new tokens alongside the existing ones (do NOT delete the existing tokens until the user has approved the redesigned hero and we're committing to the swap):

```css
/* warm charcoal, not pure black */
--bg-deep: #14100E;
--bg-panel: #1C1714;       /* one step up — for cards / panels */
--fg: #F4ECDD;             /* parchment-warm white */
--fg-muted: #9C8E7B;       /* warm muted gray-tan */

/* reds */
--red-hotrod: #A0202B;     /* primary red — most red usage */
--red-signal: #E63946;     /* loud signal red — CTAs only, sparingly */

/* golds & bronze */
--gold-antique: #D4A24C;   /* primary gold — section numerals, stat values, hovers */
--gold-glow: rgba(212,162,76,0.35);
--bronze: #7B4B26;
--hairline-bronze: rgba(212,162,76,0.18);
--hairline-warm: rgba(244,236,221,0.08);
```

Usage rules:

- **Background**: `--bg-deep` for sections, `--bg-panel` for elevated cards. Pure black (`#0a0a0a`) is banned in the redesign.
- **Gold is the workhorse accent**, not red. Section numerals (`01`, `02`...), stat values, hover states, dividers, hairlines all use gold/bronze.
- **Red is identity, not utility.** 1–2 elements per section maximum. Hot-rod red `#A0202B` for most red usage; signal red `#E63946` reserved for primary CTAs and one hero element per section.
- **Hairlines** shift from cool-white (`rgba(255,255,255,0.08)`) to bronze (`rgba(212,162,76,0.18)`).

### 3.3 Section-by-section iteration plan

The redesign happens **in main, in place**, one section at a time.

**Hero is the only section with an A/B comparison.** A redesigned `HeroV2` is added beside the existing `Hero` and rendered immediately below it on `/`. The user scrolls, sees both, and picks one. The loser is deleted; the winner becomes `Hero`. Commit.

**Every other section is replaced directly.** Build the redesigned section, swap the import in `src/app/page.tsx`, delete the predecessor's component file + sub-component folder + content file in the same commit. No stacked comparison.

Sequence:

1. Hero → HeroV2 comparison → pick winner, delete loser
2. About — replace
3. SelectedWork — replace (the big one — see §3.4)
4. ByTheNumbers — replace
5. Stack — replace
6. Now — replace
7. Contact — replace

### 3.4 Selected Work — replace flowcharts with case studies

Drop `GrokDiagram`, `AuraDiagram`, `AutoDevMockup`, `ChefMateMockup` framing. Replace with a **case-study card grid**: 2-up on desktop (≥1024px), 1-up below.

Each card uniformly contains:

```
┌──────────────────────────────────────────────────┐
│  Visual slot (varies per project — see below)    │
├──────────────────────────────────────────────────┤
│  Title row: PROJECT NAME · short tagline         │
│                                                  │
│  Description (2–3 sentences, plain English):     │
│  what it is, who it's for, what it does          │
│                                                  │
│  Highlights — 3 bullets max, each one thing      │
│  the user actually built (not generic features)  │
│                                                  │
│  Stack chips: 4–6 most-relevant techs            │
│                                                  │
│  Links: → live   → repo (or → private)           │
└──────────────────────────────────────────────────┘
```

Visual slot per project:

- **AURA** — screenshot of chat interface mid-execution (showing the agent plan + step status). Source: user provides, or Playwright the live demo.
- **ChefMate** — screenshot of meal-planner page or recipe-detail card on mobile frame.
- **AutoDev** — screenshot of the in-browser editor with the WebContainer running.
- **Grok pipeline** — **no screenshot** (private/internal). Replace with a static **data-art tile**: gold-on-charcoal pixel-grid background with the headline numbers (`442K images · 60 GB · 99.99% consistency · 13 days`) typeset in display font. No flowchart, no boxes-and-arrows.

Card content sources (drawn from the user's `Work.docx` and resume):

#### AURA — Agentic Unified Reasoning Assistant
Description: Multi-agent AI workflow platform. Type natural language ("draft an email to my team and add a calendar invite") and a Planner → 5 Workers → Evaluator pipeline executes across Gmail, Drive, Docs, Sheets, and Calendar autonomously.
Highlights:
- Hierarchical Planner → 5 Workers → Evaluator with resumable DAG execution
- AES-256-GCM encrypted OAuth tokens with 5-min pre-expiry auto-refresh
- Realtime progress streaming via Supabase Realtime
Stack: `Next.js 16 · Gemini 2.5 · Supabase · Google APIs · TypeScript`

#### ChefMate — AI Recipe & Meal Planning
Description: AI-powered recipe generator and meal planner shipping as both a web app and a native Android app. On-device ingredient detection, calorie/macro tracking, 7-day auto-fill meal planning, subscription tiers.
Highlights:
- On-device ingredient detection (TFLite via TensorFlow.js, custom Vite plugin)
- Mifflin-St Jeor BMR → TDEE nutritional calculations with macro validation
- Multi-source image fallback (Pixabay → Pexels → placeholder) with subscription-tier quota enforcement
Stack: `React · Capacitor · Supabase · Gemini · TensorFlow.js · Vite`

#### AutoDev — Autonomous In-Browser Code Editor
Description: Browser-native AI code editor that converts natural language into multi-file projects, running Node.js dev servers in-browser via WebContainers. Honorable Mention at hackathon.
Highlights:
- Async agent pipeline (Inngest) with multi-LLM routing and structured tool-call error handling
- Live file-tree and editor sync via Convex
- GitHub OAuth + Octokit import/export
Stack: `Next.js · WebContainers · Inngest · Convex · Multi-LLM · Clerk`

#### Grok Pipeline — Distributed Media Ingestion at Scale
Description: Three-stage distributed pipeline (TypeScript scraper → Go image processor → enricher) ingesting AI-generated media across 10 rotating accounts. Triple-tier deduplication, stealth fingerprinting, ML-based face detection inline.
Highlights:
- 442K deduplicated images (60 GB) at 99.99% S3 ↔ DynamoDB consistency in 13 days
- Triple-dedup: URL → SHA-256 → perceptual hash (Hamming ≤ 10)
- SCRFD ONNX face detection in Go with goroutine-pool concurrency across 27K+ hourly windows
Stack: `TypeScript · Go · AWS SQS/DynamoDB/S3 · Playwright · ONNX Runtime`
Note: private repo.

### 3.5 Other section directions

| Section | V2 direction |
|---|---|
| **Hero** | Same composition (photo + HUD + text) recolored to Mark III palette. Tagline: *"Engineer who ships distributed systems and AI tooling."* No glitch / decoded effects on the name unless they survive a sober look. HUD readouts use gold, not red. |
| **About** | Header changes from `ENGINEER / BEHIND THE / COMPANY.` to `I BUILD / PRODUCTION / SYSTEMS.` (or similar capability-led phrasing). Drop `ABOUT · CHANNEL OPEN`, `FILE 02 / DOSSIER`, `END FILE 02 / NEXT — SELECTED WORK`, `CLEARANCE · PUBLIC`. Photo + bio + fact strip layout preserved. Bio rewritten to lead with what the user builds, not where. |
| **By the Numbers** | Most-loved section visually — preserve the beam/glitch energy. Reskin to gold-on-charcoal: stat values in `--gold-antique`, one hero number in `--red-signal`, panels on `--bg-panel`. Strip mono-caps milspeak copy. |
| **Stack** | Current `StackDiagram` is unreviewed but suspected to be flowchart-style. Replace with **logo grid grouped by tier** (Languages / Frontend / Backend / AI-ML / Infra). Clean type, bronze hairlines between tiers, no connector lines. Logo-or-wordmark per tech. |
| **Now** | Keep only if "now" content is real (current focus, current reading, current ship). Drop fake telemetry framing (`uptime`, `status: nominal`). Replace with a 2-column block: *Currently building* (1–2 sentences), *Currently learning* (1–2 sentences), *Last shipped* (date + project name). |
| **Contact** | Keep CTA structure. Drop `TRANSMISSION / CHANNEL` copy. Email button rim-trace recolors from red to gold. Secondary buttons (LinkedIn, GitHub) keep hairline-outline pattern but with bronze hairlines. |

## 4. Architecture / file structure

**Hero (A/B):** redesigned variant lives as `HeroV2.tsx` alongside the existing `Hero.tsx`, with its sub-components in `src/components/hero-v2/`. Both are imported in `src/app/page.tsx` and rendered back to back:

```tsx
<Hero />
<HeroV2 />   {/* below for side-by-side scroll comparison — temporary */}
<About />
…
```

When the user picks: delete the loser's section file, the loser's sub-component folder, and any loser-only content. Rename the winner's files back to canonical names (`HeroV2 → Hero`, `hero-v2/ → hero/`) so the codebase has a single Hero. Commit as `replace: section 01 — hero (redesign)` if V2 wins, or `keep: section 01 — hero (v1)` and delete V2 if V1 wins.

**All other sections:** in-place replacement. For each section in turn, the redesigned component overwrites the existing one. No `*V2.tsx` siblings. Sub-component folders are rewritten in place (or deleted and recreated). Content files (`src/content/*.ts`) are rewritten in place where applicable.

`src/content/projects.ts` is rewritten with the case-study content drawn from `Work.docx` + resume (see §3.4).

CSS tokens: append the Mark III palette to `globals.css` under `:root` and `@theme` alongside the existing red-on-black tokens. Existing tokens stay live during the Hero A/B (so `Hero` keeps its current look). Once the Hero comparison resolves and we commit to the redesign across all sections, the old tokens are deleted as part of the second section's commit. From the About replacement onward, redesigned components reference the new tokens directly (`var(--bg-deep)`, `var(--gold-antique)`, etc.).

## 5. Out of scope

- Server-side concerns (no API routes added/changed).
- Analytics / OG meta updates — separate task once the redesign settles.
- New custom cursor behavior, new fonts, new scroll library.
- Mobile-specific redesign beyond responsive collapse of the case-study grid.
- Performance regressions caused by the temporary 2x section render are acceptable during comparison; final state is single-render.

## 6. Acceptance

- All `CHANNEL OPEN`, `DOSSIER`, `FILE 0X`, `CLEARANCE`, `END FILE`, `FILED ·`, `X OF Y PUBLIC` strings are gone from the rendered page.
- Flashback Labs appears at most once on the page (in the experience timeline).
- Selected Work renders four case-study cards with no flowchart-style architecture diagrams.
- Page background is `#14100E` (warm charcoal), not `#0a0a0a` (pure black).
- Gold appears on every section as the dominant non-fg accent; red is bounded to ≤2 elements per section.
- Page header copy reads as capability-led ("I build production systems") not employer-led ("Engineer behind the company").
