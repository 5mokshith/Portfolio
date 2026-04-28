# Dual-Tone · RGB-Split Redesign

**Date:** 2026-04-28
**Scope:** Full redesign of every section EXCEPT Hero (kept as-is). Introduces a second accent color (cyan) and an RGB-split aesthetic as the site's visual signature, plus a layered motion system.

---

## 1. Goals

- Replace the current mono-red palette with a disciplined **red + cyan** dual-tone system. Cyan is not merely decorative — it forms a *pair* with red, and the two appear together as RGB-split chromatic-aberration: borders, hover states, scroll reveals, headline reveals.
- Rebuild every section after Hero with new layouts and richer interactions. Each section keeps its purpose but gets new structure + motion.
- Add three layered motion behaviors site-wide: **scroll-scrub**, **cursor-reactive RGB**, and **2-stage hover**.
- Preserve current strengths: mono-caps frames, Astro headlines, hairline rules, "alive not static" floor, custom cursor, Lenis smooth scroll.

## 2. Non-Goals

- Hero is **not** touched (HeroText, PhotoLayer, HUDOverlay all preserved).
- No new fonts. Astro / Declandar / Chakra Petch only.
- No section-to-section datamosh transitions (rejected during brainstorming — exhausting).
- No structural change to `BubbleMenu`, `SmoothScroll`, `CustomCursor`, `GrainOverlay`. They are infrastructure.
- No new content writing — copy is preserved or trimmed only where layout demands it.

## 3. Color System

### 3.1 Tokens (added to `globals.css` + Tailwind theme)

```
--color-accent          #ff2d2d   (existing — primary, red)
--color-accent-glow     rgba(255,45,45,0.4)   (existing)
--color-cyan            #00e5ff   (NEW — secondary)
--color-cyan-glow       rgba(0,229,255,0.45)  (NEW)
--color-hairline-cyan   rgba(0,229,255,0.22)  (NEW)
```

`--color-accent` keeps every current use. Cyan is added alongside; *no existing red references are recolored*.

### 3.2 Semantic Rules

Red and cyan operate as a **pair**, not as separate channels. The rules:

- **Solid fills:** red is still primary. Cyan never replaces red as the brand color.
- **RGB-split layers:** any element with the `.rgb-split` class gets a red shadow offset to the left and a cyan shadow offset to the right. The two layers are fixed siblings of the white text. Static state has 0px offset; hover/scroll state expands offset to 3-6px.
- **Hairlines:** sections alternate hairline color. About / Selected Work / Now use red hairline (`--color-hairline-red`). Stack / Contact use cyan hairline (`--color-hairline-cyan`). By the Numbers uses both (red top rule, cyan bottom rule) as the visual handoff.
- **Hover settles:** interactive elements (links, chips, cards) RGB-split on hover-enter, then settle into either red or cyan based on intent — primary CTAs settle red, secondary/exploratory links settle cyan.
- **Selection:** keep red (already shipped).

### 3.3 Reduced-Motion Fallback

When `prefers-reduced-motion: reduce`:
- RGB-split offsets stay at 0px. Static state only.
- Cursor-reactive effects disabled.
- Scroll-scrub becomes scroll-snap reveal (opacity 0→1, no transform).

## 4. Motion System

Three layered behaviors. All section redesigns compose these.

### 4.1 Scroll-Scrub (`useScrollScrub` hook, NEW)

Built on Motion's `useScroll` + `useTransform`. Each instance ties an element's transform/offset to its own viewport progress. Used for:
- RGB-split offset on section headlines (0px at center, ±6px at edges)
- Sticky pin + reveal stages (Stack uses this for the kinetic grid)
- Parallax layers (background grid drifts at 0.4× scroll speed)

### 4.2 Cursor-Reactive (`useMouseSpotlight` hook, NEW)

Builds on existing `useMouseParallax`. Provides per-element x/y proximity (0-1 distance from cursor to element center). Used for:
- Card RGB-split intensifies as cursor approaches (0px at >300px away, 6px at <60px)
- Spotlight gradient on Selected Work cards (radial mask follows cursor)
- Magnetic pull on primary CTAs (button translates 0-8px toward cursor when within 80px)

### 4.3 2-Stage Hover (`.hover-rgb` utility class)

Pure CSS. On `:hover`:
- Stage 1 (0-120ms): RGB-split widens to 4px, white text stays centered.
- Stage 2 (120-240ms): offsets collapse, element settles into its target color (red or cyan, set by data attribute).

Applied to: every link, every project card, every stack chip, every nav item.

## 5. Section Redesigns

Hero is preserved. Six sections redesigned:

### 5.1 About (Section 02)

**Current:** Photo left + bio right + 3-column fact strip. Already personal-tone.

**Redesign:**
- Replace 4/5-aspect cropped photo with a **two-frame stack**: foreground photo + offset cyan duplicate behind it (chromatic-aberration on a real image). On scroll, the cyan ghost slides 0→14px as the photo enters viewport. Hairline corner marks alternate red/cyan.
- "HI, I'M MOKSHITH." headline gets `.rgb-split` treatment with scroll-scrub offset.
- Fact strip: 3 columns become an interactive HUD strip — each cell pulses (red or cyan dot) on a 6s loop, hover reveals an extended caption below.
- Add a small **typing readout** below the bio: rotating list of "currently building / reading / breaking" lines, cyan caret, swaps every 4s.

### 5.2 By the Numbers (Section 04)

**Current:** Strong already — pixel canvas, beams, glitch on 442K. Memory says this is the floor for "alive."

**Redesign (lighter touch — preserve strength):**
- Add cyan as the second beam color (currently red-only beams).
- 442K cell glitch swaps red glitch layer for **red+cyan paired layers** (true RGB-split, not just chromatic red).
- Cursor-reactive: the cell directly under the cursor gets a +6px RGB-split widening.
- New cell variant: a live data sparkline (cyan stroke, red gridlines).

### 5.3 Selected Work (Section 03)

**Current:** 2-up case-study card grid. Hover = `y: -4` lift + corner brighten.

**Redesign:**
- Card grid becomes **scroll-scrub stagger**: each card enters with its own RGB-split that resolves to 0px as it crosses 60% viewport. Out-of-view cards have 8px split.
- Card hover: cursor-reactive spotlight (radial cyan glow follows mouse over the visual slot) + 2-stage RGB-split on title + corner marks switch from red to cyan during hover.
- Stack chips use `.hover-rgb` settling cyan (secondary).
- "→ LIVE / GITHUB" links use `.hover-rgb` settling red (primary).
- Visual slots updated: AURA Cubes ripple gets a cyan secondary ripple. Grok PixelCanvas keeps its gold palette but adds a cyan grid mask. Data-art panels get a cyan secondary number ghost behind the bigNumber.

### 5.4 Stack (Section 05)

**Current:** Existing layout (per `docs/superpowers/specs/2026-04-27-section-05-stack-design.md`).

**Redesign:**
- This section becomes the **most cyan-dominant** in the site (it represents technical/system intent — even though we're in RGB-split land, cyan leads here).
- Convert stack list into a **kinetic chip cloud** — chips arranged in 3 horizontal lanes, each lane drifts slowly at a different speed (lane 1 right→left at 18s, lane 2 left→right at 26s, lane 3 right→left at 32s). Lanes pause on hover.
- Each chip: cyan hairline border, white text, RGB-split on hover, click expands to show category caption (where it lives in the runtime).
- Section header: large RGB-split "STACK" headline, scroll-scrub.
- Background: parallax grid at 0.4× scroll, cyan hairlines instead of red.

### 5.5 Now (Section 06)

**Current:** Existing layout (per `docs/superpowers/specs/2026-04-27-section-06-now-design.md`).

**Redesign:**
- Becomes a **status console**: 3-column grid (top), big metric tiles (middle), live readout (bottom).
- Top: STATUS / FOCUS / LOCATION — each cell has a pulsing dot (alternating red/cyan), live timestamp updates every 60s.
- Middle: 2 large tiles — UPTIME (red, scroll-scrub counts up) and CURRENT BUILD (cyan, rotating text).
- Bottom: a terminal-style live feed — fake `tail -f` output of "what I touched today" entries, cyan timestamps, white messages, occasional red `[err]` line. Scrolls upward continuously, pauses on hover.

### 5.6 Contact (Section 07)

**Current:** Existing layout. Has the animated rim trace on email CTA (`@property --star-angle` already in globals).

**Redesign:**
- Headline: huge RGB-split "LET'S BUILD SOMETHING" with scroll-scrub. Cursor-reactive — RGB-split offset increases as cursor approaches the headline (max 12px, the most aggressive on the site).
- Primary email CTA: keep the rim trace, but the trace is now a red→cyan gradient sweeping around the border continuously.
- Secondary buttons (Twitter, GitHub, LinkedIn, Resume): hairline-cyan borders, `.hover-rgb` settling cyan.
- Add a **field of dots**: 12×6 grid of small dots behind the headline. Each dot is red OR cyan (alternating). Cursor proximity shifts each dot's color, scale, and opacity within a 200px radius — calm interactive ambient.
- Footer line under everything: copyright + "MADE IN KARIMNAGAR" + tiny RGB-split logo mark.

## 6. Component Architecture

### 6.1 New shared components

- `src/components/effects/RgbSplit.tsx` — wrapper that renders `children` three times (red layer, white layer, cyan layer) with absolute positioning. Props: `offset` (number, current px), `as` (element), `className`. Used by `RgbSplitText` (scroll/cursor driven), `RgbSplitImage` (About photo).
- `src/components/effects/RgbSplitText.tsx` — composes `RgbSplit` with `useScrollScrub` for scroll-driven offset, optionally with `useMouseSpotlight` for cursor amplification.
- `src/lib/useScrollScrub.ts` — Motion-based scroll progress hook returning a MotionValue tied to element progress.
- `src/lib/useMouseSpotlight.ts` — extends `useMouseParallax` with a per-element proximity value (0-1).
- `src/components/effects/MagneticButton.tsx` — pull-toward-cursor wrapper for primary CTAs.

### 6.2 New section subcomponents

- `src/components/about/PhotoStack.tsx` — chromatic-aberration photo with scroll-driven cyan offset + corner marks.
- `src/components/about/StatusTyper.tsx` — rotating typed readout under the bio.
- `src/components/work/SpotlightCard.tsx` — wraps the existing project card with `useMouseSpotlight` for the radial cyan glow.
- `src/components/stack/KineticChipCloud.tsx` — 3-lane drifting chip layout.
- `src/components/now/TerminalFeed.tsx` — `tail -f` style live-scrolling feed.
- `src/components/now/StatusConsole.tsx` — top-row status grid.
- `src/components/contact/DotField.tsx` — 12×6 cursor-reactive dot grid.

### 6.3 Modified components

- `src/components/sections/About.tsx` — restructure photo column, swap headline to `RgbSplitText`, replace fact strip with HUD strip, add typer.
- `src/components/sections/SelectedWork.tsx` — wrap project cards in `SpotlightCard`, swap headline to `RgbSplitText`, update card visuals.
- `src/components/sections/ByTheNumbers.tsx` — add cyan beam, dual-color glitch, cursor-reactive cell split.
- `src/components/sections/Stack.tsx` — replace body with `KineticChipCloud`.
- `src/components/sections/Now.tsx` — replace body with `StatusConsole` + `TerminalFeed`.
- `src/components/sections/Contact.tsx` — add `DotField`, swap headline, change rim-trace to red→cyan gradient.
- `src/app/globals.css` — add cyan tokens, `.rgb-split` and `.hover-rgb` utilities, gradient rim-trace keyframes, reduced-motion guards.

### 6.4 File size discipline

`SelectedWork.tsx` is already at the upper edge of comfortable. The redesign extracts `SpotlightCard` and `ProjectVisual` into their own files while moving project-specific visuals (`AuraCubesVisual`, `GrokPixelVisual`, `DataArtVisual`) into `src/components/work/visuals/`.

## 7. Data Flow

No new server-side data. Everything is local content (`src/content/*.ts`):
- `now.ts` already exists. Extended with a `feedEntries: TerminalEntry[]` array (timestamp, level: "info" | "err", message) for the terminal feed.
- `stack.ts` already exists. Extended with a `category` field per entry to drive lane assignment in `KineticChipCloud`.
- `projects.ts` unchanged.

## 8. Accessibility

- All RGB-split text retains a centered white layer that is the only one read by screen readers (`aria-hidden` on red+cyan layers, real text on white layer).
- Cursor-reactive effects are pointer-only — keyboard focus produces the static settled state, never the dynamic split.
- `prefers-reduced-motion: reduce` collapses every offset to 0 and disables scroll-scrub / cursor-reactive / magnetic / lane drift.
- Color contrast: white text on `--bg` stays the same. Cyan on `--bg` (#00e5ff on #0a0a0a) hits WCAG AAA.

## 9. Testing

- Visual smoke: dev server walkthrough on each section, golden path + reduced-motion + keyboard-only.
- Performance: scroll-scrub and cursor-reactive must not drop below 55fps on a mid-tier laptop. If they do, throttle via `requestAnimationFrame` batching.
- Lighthouse: keep current scores within 5 points.
- No automated tests are introduced; this is a visual redesign.

## 10. Rollout

Single PR. Sections built in order: globals → shared effects → About → Selected Work → By the Numbers → Stack → Now → Contact. Each section commits independently so any single one can be reverted without unwinding the others.

## 11. Open Questions

None at spec time. All four foundation choices (full redesign except hero · dual-tone red+cyan · RGB-split as signature · scroll+cursor+hover motion) are locked. Per-section direction decisions in §5 are claimed by this spec; if any feel wrong they should be flagged at spec-review time before the implementation plan is written.
