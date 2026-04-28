# Section 06 — NOW · Design

**Status:** approved · **Date:** 2026-04-27 · **Source of truth:** [.claude/PLAN.md §5 Section 06](../../../.claude/PLAN.md)

## Purpose

A live "what I'm doing right now" HUD panel. Section 06 is the human checkpoint
between the dossier sections (02–05, telemetry) and the bookend Contact (07).
It reads as a real-time terminal readout — pulsing live dot, ticking uptime,
short status lines — not a static "currently" list.

The single biggest "looks AI" failure mode for this section would be an MDX
template, a glassy card with three emoji bullets, or generic "I'm currently
learning…" copy. The cure is a typed status board with a real ticking
counter, real anchor date, ops vocabulary, and asymmetric framing consistent
with sections 02–05.

## Locked decisions (from PLAN.md)

These are pre-decided and out of scope for re-debate:

- **Single centered HUD panel** — not a grid, not stacked cells.
- **Content lives at `src/content/now.ts`** — typed module, *not* MDX.
  PLAN.md §2 originally called for MDX; we override here for parity with
  `stack.ts`/`stats.ts` and to avoid pulling in `@next/mdx` for one file.
  Editing copy still means editing one file.
- **Live uptime anchor:** `2025-08-22T00:00:00Z` — Flashback Labs founding
  engineer start. Ticks every 1000ms. Format: `Xd Xh Xm Xs`.
- **Pulsing `●` LIVE dot** at 1.5s loop.
- **Trailing `▮` blink cursor** at 1s loop.
- **Header `NOW` glitches in** (GlitchText), each `→` line then decodes
  (DecryptedText) on a 150ms stagger, then uptime starts ticking.
- **Section frame:** matches sections 04/05 — `data-section="06-now"`,
  `bg-bg`, `px-5 py-28 md:px-10 md:py-40 lg:px-20 lg:py-48`,
  `max-w-7xl` inner, BlurText section header, hairline closing rule reading
  `END FILE 06 / NEXT — CONTACT`.

## Layout

```
┌─ section header ──────────────────────────────────────────────────┐
│ 06 · NOW · LIVE                              FILE 06 / STATUS     │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│           ┌─ HUD panel (max-w-3xl, centered) ──────────┐          │
│           │ ● LIVE              LAST SYNC: 27 APR 2026 │          │
│           │                                            │          │
│           │ NOW                                        │          │
│           │                                            │          │
│           │ → CURRENT OP    GROK PIPELINE / PHASE 2 …  │          │
│           │ → BOTTLENECK    SCRFD face-detection …     │          │
│           │ → JUST SHIPPED  flashbacklabs.com …        │          │
│           │ → STATUS        B.TECH CSE · final sem …   │          │
│           │ → OPEN TO       conversations · founding … │          │
│           │                                            │          │
│           │ FLASHBACK LABS · UPTIME: 248d 03h 17m 42s▮ │          │
│           └────────────────────────────────────────────┘          │
│                                                                   │
├───────────────────────────────────────────────────────────────────┤
│ END FILE 06 / NEXT — CONTACT       1 PANEL · LIVE                 │
└───────────────────────────────────────────────────────────────────┘
```

The HUD panel is the only content. No supporting columns, no asymmetric
sidebar. The asymmetry comes from inside the panel — the line labels are a
fixed-width column, the values are ragged-right.

## Components

```
components/sections/Now.tsx        — section frame (matches Stack/ByTheNumbers)
components/now/StatusPanel.tsx     — the HUD panel (border, glow, content layout)
components/now/UptimeCounter.tsx   — client component, computes elapsed every 1s
components/effects/PulsingDot.tsx  — reusable pulsing dot (red, 1.5s loop)
content/now.ts                     — single source of truth for copy
```

`PulsingDot` is split out (rather than inlined) because PLAN.md §6 lists it
as a reusable effect and Contact (Section 07) may reuse it.

`UptimeCounter` is its own component because it owns interval state and a
`useEffect` cleanup — keeping it isolated lets `StatusPanel` stay declarative
and lets the counter mount/unmount cleanly.

## Content shape — `src/content/now.ts`

```ts
export type StatusLine = {
  /** mono-caps label, e.g. "CURRENT OP" */
  label: string;
  /** value rendered to the right; may include · separators */
  value: string;
};

export type NowContent = {
  /** date string shown after "LAST SYNC:" — manually bumped on edit */
  lastSync: string;            // e.g. "27 APR 2026"
  /** ISO instant the uptime counter counts FROM */
  uptimeAnchor: string;        // "2025-08-22T00:00:00Z"
  /** label preceding the live counter, e.g. "FLASHBACK LABS · UPTIME:" */
  uptimeLabel: string;
  /** ordered status lines — rendered in array order, decoded in array order */
  lines: StatusLine[];
};

export const NOW: NowContent = { /* … */ };
```

`lastSync` is a string, not `Date.now()` formatted, so editing the file is
the explicit "I updated this" gesture. Anchored values, not derived.

## Component contracts

### `<PulsingDot />`
- Props: `className?: string` — caller sizes it.
- Renders a 6px red disc with a second absolutely-positioned disc
  scaling 1 → 2 and fading 0.6 → 0 over 1.5s, infinite. Uses Framer
  `motion.span` (already in dependency tree).
- No props for color/duration — single use case, single purpose.

### `<UptimeCounter anchorIso={string} />`
- Client component (`"use client"`). Next.js still SSRs the initial markup
  for client components — the `"use client"` boundary only governs where
  effects/state run, not initial render.
- Initial render: computes elapsed once from `anchorIso` and renders it.
  Same code path runs on server and on first client render. There will be
  a small drift (server time ≠ client time when hydrate happens), which is
  acceptable — the next interval tick overwrites it.
- On mount: starts a `setInterval(tick, 1000)`. `tick` computes
  `Date.now() - new Date(anchorIso).getTime()` and formats as
  `Xd Xh Xm Xs` (zero-padded h/m/s, no leading zero on days).
- Cleans up interval in the effect cleanup.

### `<StatusPanel />`
- Server component. Imports `NOW` from `content/now.ts`.
- Renders the panel chrome (hairline red border, outer red glow, backdrop
  blur) and arranges children: header row (live dot + LAST SYNC), `NOW`
  glitch heading, status lines, footer row (uptime label + `<UptimeCounter />`
  + blink cursor).
- Reveal motion is delegated to the existing `BlurText` / `GlitchText` /
  `DecryptedText` effect components — `StatusPanel` only orders them.
- Stagger: header BlurText → `NOW` GlitchText (delay 200ms) → each
  `lines[i]` DecryptedText with delay `400 + i*150` → uptime row BlurText
  at `400 + lines.length*150 + 100`.

### `<Now />`
- Section frame (matches `Stack.tsx` and `ByTheNumbers.tsx` exactly):
  header strip with `06 · NOW · LIVE` and `FILE 06 / STATUS`, the
  `<StatusPanel />`, and the `END FILE 06 / NEXT — CONTACT` closing rule.
- No standfirst block — sections 04/05 have one, 06 deliberately doesn't.
  The panel itself is the entire content; a standfirst would dilute the
  "this is the readout" feel.

## Visual treatment

- Panel chrome:
  - 1px solid `rgba(255, 45, 45, 0.25)` border (red hairline)
  - Outer glow: `box-shadow: 0 0 60px rgba(255, 45, 45, 0.18), inset 0 0 0 1px rgba(255, 255, 255, 0.03)`
  - Background: `bg-bg/60` with `backdrop-blur-sm`
  - Padding: `p-8 md:p-12`
  - Width: `max-w-3xl mx-auto`
- Inside the panel:
  - Top row: `● LIVE` (PulsingDot + small Declandar caps) on the left,
    `LAST SYNC: …` (muted Declandar) on the right.
  - `NOW` heading: Astro, `clamp(2rem, 4vw, 3.5rem)`, `text-fg`. GlitchText.
  - Status lines: two-column grid. Label column is `font-declandar`,
    `text-accent`, fixed width (`w-32` md+). Value column is
    `font-chakra`, `text-fg/85`. Each line prefixed with `→` in
    `text-accent`. Lines separated by `space-y-3`.
  - Footer row: `font-declandar` muted caps, uptime number in
    `font-astro` accent. Blink cursor `▮` after the number.

## Anomaly (the "not AI" tell, per PLAN.md §3)

The `NOW` heading sits **flush-left inside the panel and nudged 6px above
the LIVE/LAST-SYNC row's baseline** — i.e. the heading and the meta row are
deliberately not on a tidy grid. This mirrors the About-section misalignment
anomaly. Implemented with a negative `mt-[-6px]` on the heading, not via
flex magic, so it is obviously intentional in source.

## Reduced motion

- PulsingDot: replace pulse with static red dot (no scale animation).
- GlitchText: existing component already respects reduced-motion — no
  override needed.
- DecryptedText: existing component already respects reduced-motion.
- UptimeCounter: still ticks. The counter is information, not motion.

## Testing

This is a single-section UI piece — no unit tests. Manual verification:

1. Section renders at `/` between Stack and the section-07 placeholder.
2. Live dot pulses; stops if `prefers-reduced-motion: reduce`.
3. Uptime counter shows non-zero on first paint, increments by 1s.
4. Editing a line in `src/content/now.ts` shows up in the panel without
   any other edits.
5. `npm run build` clean. `npm run lint` clean.
6. Mobile (≤md): panel padding shrinks, label column collapses to
   stacked label-over-value.

## Out of scope

- MDX wiring (rejected — uses `.ts` for parity).
- Editing PLAN.md §5.6 to reflect the MDX→TS swap (do separately if at all).
- Section 07 (Contact) — this spec stops at "NEXT — CONTACT".
- Polishing reduced-motion behavior beyond the three notes above —
  Section 08 (Polish) owns the global reduced-motion pass.
