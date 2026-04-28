# Section 05 — STACK · Design Spec

**Date:** 2026-04-27
**Status:** Approved for implementation planning
**Predecessor:** Section 04 (By the Numbers / Telemetry) — closes with `NEXT — STACK`
**Successor:** Section 06 — NOW

---

## 1. Purpose

Show what the work is built with — the surface area of tools across six layers from languages up to AI. Capability map, not a daily-driver list and not a re-cut of project metrics. The section answers a single question: *"if I hire him, what does his keyboard look like?"*

Tone matches the rest of the site: file/dossier vocabulary, terminal/HUD typography, hairline borders, accent red on dark.

## 2. Content — the six tiers

Tiers are bottom-up: foundation at the bottom of the visual, surface at the top. DOM order is L06 → L01 (top-down reading), but visually L01 sits at the bottom of the diagram.

| Index | Tier              | Role line                       | Tools (with hover hints)                                                                                                  |
| ----- | ----------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| L06   | AI / ML           | `// LLMS · INFERENCE · ON-DEVICE` | OpenAI (LLM) · Anthropic (LLM) · Groq (FAST LLM) · Gemini (LLM) · ONNX / SCRFD (DETECTION) · TFLite (ON-DEVICE)            |
| L05   | APP / FRAMEWORK   | `// ROUTES · COMPONENTS · STYLE` | Next.js (ROUTING) · React (UI) · Vite (BUNDLER) · Express (API) · Tailwind (STYLING)                                       |
| L04   | DATA              | `// PERSIST · QUERY · STORE`     | PostgreSQL / Supabase (RELATIONAL) · DynamoDB (KV STORE) · Convex (REACTIVE DB) · S3 (OBJECT STORE)                        |
| L03   | INFRA             | `// EDGE · QUEUES · ORCHESTRATE` | AWS SQS (QUEUE) · Inngest (ORCHESTRATION) · Vercel (EDGE / DEPLOY)                                                         |
| L02   | RUNTIME           | `// WHERE THE CODE LIVES`        | Node.js (SERVER) · Browser / WebContainers (IN-PAGE) · Goroutines (POOLED) · Android / Capacitor (NATIVE BRIDGE)           |
| L01   | LANGUAGES         | `// TYPED · COMPILED · GLUE`     | TypeScript (TYPED) · Go (CONCURRENT) · SQL (QUERIED)                                                                       |

**Decisions captured:**

- **S3 lives in DATA, not INFRA.** It's an object store first; the queue is what makes the infra tier feel infra.
- **Capacitor lives in RUNTIME only.** It's the Android shell, not the build pipeline.
- **No Python.** Not in the daily stack.
- **No icons.** Logo soup undermines the file/HUD aesthetic — text labels only.
- **Tool count per tier is auto-derived** from the content array, not hand-coded into copy.

Total entries: **25**.

## 3. Layout & visual treatment

### 3.1 Section frame (matches sections 02–04)

```
┌─ HEADER STRIP ─────────────────────────────────────────────────┐
│  05 · STACK · 6 LAYERS                          FILE 05 / WORKBENCH │
└────────────────────────────────────────────────────────────────┘

┌─ STANDFIRST (12-col grid) ─────────────────────────────────────┐
│  col-span-7                              col-span-5            │
│  SIX LAYERS,                             Tools I reach for,    │
│  ONE                                     not tutorials I've    │
│  WORKBENCH.   ← accent red               finished. Foundation  │
│                                          up — languages,       │
│                                          runtime, infra,       │
│                                          data, app, AI.        │
└────────────────────────────────────────────────────────────────┘

┌─ STACK DIAGRAM (see §3.2) ─────────────────────────────────────┐
│  L06  AI / ML                   [OpenAI] [Anthropic] [Groq]…   │
│  L05  APP / FRAMEWORK           [Next.js] [React] [Vite]…      │
│  L04  DATA                      [PostgreSQL] [DynamoDB]…       │
│  L03  INFRA                     [AWS SQS] [Inngest] [Vercel]   │
│  L02  RUNTIME                   [Node.js] [Browser]…           │
│  L01  LANGUAGES                 [TypeScript] [Go] [SQL]        │
└────────────────────────────────────────────────────────────────┘

┌─ CLOSING RULE ─────────────────────────────────────────────────┐
│  END FILE 05 / NEXT — NOW                  6 LAYERS · 25 ENTRIES │
└────────────────────────────────────────────────────────────────┘
```

Outer container, padding, `max-w-7xl`, header/standfirst/closing copy treatment all mirror `ByTheNumbers.tsx` and `SelectedWork.tsx` exactly. No new section-frame patterns.

### 3.2 The stack diagram

- **Six full-width tier blocks**, stacked vertically with **shared borders** — no gap between tiers, so the diagram reads as one structure rather than six islands.
- Outer frame: hairline border on all four sides.
- Inner dividers: hairline between adjacent tiers (single border, not doubled).
- **CAD corner ticks** (small `⌐ ⌐ ⌐ ⌐` style L-marks, ~14px) at the four outer corners of the diagram frame. Reuses the Hero HUD vocabulary already in the codebase.
- **All tiers visually equal.** No glow, no warmth gradient, no size variation. (User decision: equal is more honest — languages aren't ranked above AI.)

#### Tier block — internal layout

Two-column (CSS grid, `28% / 72%`):

**Left column (meta, ~28%):**

- `L0X` index in Declandar mono, top
- Tier name in Astro caps (`LANGUAGES`, `RUNTIME`, …), large but not heroic — `clamp(1.5rem, 2.5vw, 2.25rem)`
- Tool count tag: `4 ENTRIES` in mono-caps, dim
- Role line: `// TYPED · COMPILED · GLUE` in mono-caps, accent-red comment slashes, body text dim

**Right column (pill row, ~72%):**

- Tools as hairline-bordered pills, mono-caps labels.
- Pills wrap with `flex-wrap`; small gap between pills.
- Vertical alignment: pills sit centered against the meta column.
- Tier height is content-driven with a min-height (`min-h-[140px]` desktop, `min-h-[110px]` mobile) so single-pill tiers don't collapse.

**Mobile (≤md):**

- Tier becomes single-column. Meta block stacks above pill row.
- Tier name shrinks to `clamp(1.25rem, 5vw, 1.75rem)`.
- Min-height removed — content flow only.

### 3.3 Pill — the atomic unit

Hairline border, transparent background, rounded `4px` (squarer than typical pills — matches the file/spec aesthetic, not consumer UI).

**Hover behavior:**

- Pill content crossfades from tool name (default) to role hint (hover). 180ms, `--ease-expo` (already defined in `globals.css`).
- **Width-stable technique:** the pill renders both labels in a CSS grid where both spans share `grid-area: 1 / 1`, so the pill's intrinsic width is the max of the two labels. Only one is visible at a time via opacity. No JS measurement, no row reflow on hover.
- `aria-label` on each pill is `"<name> — <role>"` so screen readers always get both.
- On touch devices: hover is undefined, so the role hint never shows. The `aria-label` covers the AT case. (Acceptable — role hints are flavor, not load-bearing info.)
- Reduced motion: crossfade duration drops to 0ms; swap is instant on hover.

Pill border lifts to accent red on hover (subtle, ~30% opacity → 70%).

### 3.4 Reveal animation

- **Bottom-up stack-in** on scroll-into-view. L01 fades + slides up (8px) first, then L02, L03, …, L06. **130ms stagger** between tiers (matches section 04's stagger constant).
- Each tier's pills appear *with* their tier as a unit — no per-pill stagger. Per-pill stagger would be animation-on-animation and feel busy.
- Standfirst headline + body use `BlurText` per the established pattern (no new effect needed).
- Reduced motion: all six tiers fade in together at 1× duration, no slide. Standfirst still uses `BlurText`'s reduced-motion path.

Trigger: standard `IntersectionObserver` on the diagram container at `rootMargin: "0px 0px -10% 0px"` (fires slightly before the diagram is fully in view, so users don't catch it mid-animation).

## 4. Components

### File layout

```
src/
├── content/
│   └── stack.ts                        ← NEW · single source of truth (tiers + tools + roles)
├── components/
│   ├── sections/
│   │   └── Stack.tsx                   ← NEW · section frame (header, standfirst, diagram, closing)
│   └── stack/                          ← NEW directory
│       ├── StackDiagram.tsx            ← NEW · 6-tier stacked structure, corner ticks, stagger orchestration
│       └── StackTier.tsx               ← NEW · single tier (left meta + right pill row + pill rendering inline)
└── app/
    └── page.tsx                        ← EDIT · add <Stack />, drop "05 STACK" placeholder
```

`ToolPill` is **not** extracted to its own file — it's a small enough subcomponent that keeping it inline in `StackTier.tsx` avoids a file with a 30-line component. Extraction would be premature.

### Component interfaces

**`stack.ts`** — content + types:

```ts
export type Tool = {
  name: string;       // "AWS SQS"
  role: string;       // "QUEUE"
};

export type Tier = {
  index: string;      // "L01" .. "L06"
  name: string;       // "LANGUAGES"
  roleLine: string;   // "// TYPED · COMPILED · GLUE"
  tools: Tool[];
};

// Authored in DOM order (L06 first, L01 last). Matches the visual top-down read.
export const TIERS: Tier[] = [ /* L06, L05, …, L01 */ ];
```

Authoring tiers in DOM order means the stagger function can derive the per-tier delay by reversing the index (`tierCount - 1 - i`) — L01 (last in array, but bottom of visual) animates first.

**`<Stack />`** — props: none. Pulls from `TIERS`. Renders header strip, standfirst, `<StackDiagram />`, closing rule.

**`<StackDiagram />`** — props: `{ tiers: Tier[] }`. Owns the outer hairline frame, the CAD corner ticks, and the per-tier stagger delay calc. Maps tiers to `<StackTier />`.

**`<StackTier />`** — props: `{ tier: Tier; revealDelayMs: number }`. Renders left meta + right pill row. Pill row is a flex-wrapping div of `<button type="button">` elements (button so they're keyboard-focusable for the hover-equivalent state) with the pill markup inline.

Pill markup uses two stacked spans (name + role), absolutely positioned and crossfaded via opacity. Both spans share `aria-hidden="true"`; the button itself carries `aria-label="<name> — <role>"`.

## 5. Reduced motion & accessibility

- All animations clamp to ~0ms duration under `prefers-reduced-motion: reduce` (already wired in `globals.css`).
- Stack diagram is **decorative as structure** but **informational as content**. It must remain comprehensible without animation, without hover, and to keyboard users:
  - Pills are buttons, focusable in tab order. `:focus-visible` shows the role hint identically to hover.
  - `aria-label` on each pill always includes both name and role.
  - Tier blocks use a `<section aria-labelledby="tier-L0X">` with the tier name as the heading, so AT users get the layer structure.
- Color contrast: pill borders + labels at `text-fg/85` against `bg-bg` → ≥7:1 (AAA).
- The CAD corner ticks are `aria-hidden`.

## 6. Copy — final

- **Header left:** `<accent>05 ·</accent> STACK · 6 LAYERS`
- **Header right:** `FILE 05 / WORKBENCH`
- **Standfirst headline:** `SIX LAYERS,` / `ONE` / `<accent>WORKBENCH.</accent>`
- **Standfirst body:** "Tools I reach for, not tutorials I've finished. Foundation up — languages, runtime, infra, data, app, AI."
- **Closing left:** `END FILE 05 / NEXT — NOW`
- **Closing right:** `6 LAYERS · 25 ENTRIES` (entries auto-derived from `TIERS.flatMap(t => t.tools).length`)

Section 04's closing line currently reads `END FILE 04 / NEXT — STACK` — already correct, no change needed.

## 7. Out of scope

- No icons / logos. Decided in §2.
- No per-tool "years of experience" or proficiency dots. The section is what's in the workbench, not a self-rating.
- No "view source" / link-out per tool. Pill is informational, not navigational.
- No project-cross-reference (e.g., "TypeScript appears in 4/4 projects"). That's option (c) from the brainstorm — explicitly rejected because it duplicates section 04's energy.
- No animation choreography beyond the per-tier stagger. The pills don't pulse, the corner ticks don't flicker.

## 8. Acceptance

- All six tiers render with full tool lists from `stack.ts`.
- Hover on any pill swaps name → role with no row reflow.
- Keyboard tab cycles through every pill; focus-visible reveals role hint.
- On scroll-in, tiers stack bottom-up with 130ms stagger; reduced-motion path replaces stagger with a single fade.
- Mobile reflows tier to single-column without horizontal scroll.
- `END FILE 05 / NEXT — NOW` and `6 LAYERS · 25 ENTRIES` match the auto-derived counts.
- No console errors, no hydration warnings, no Tailwind purge surprises (all class names literal — no template-string class composition for spans).
