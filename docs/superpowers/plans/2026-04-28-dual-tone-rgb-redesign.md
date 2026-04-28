# Dual-Tone · RGB-Split Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild every section after Hero with a red+cyan dual-tone palette, an RGB-split chromatic-aberration signature, and three layered motion behaviors (scroll-scrub, cursor-reactive, 2-stage hover). Hero is preserved.

**Architecture:** Add cyan as a sibling token to the existing red accent. Introduce three new shared primitives (`RgbSplit`, `useScrollScrub`, `useMouseSpotlight`) and two CSS utilities (`.rgb-split`, `.hover-rgb`). Each section is rebuilt to compose these primitives — About / Selected Work / By the Numbers / Stack / Now / Contact. Build in phases so each phase commits independently and any single section can be reverted without unwinding the others.

**Tech Stack:** Next.js 16.2 (App Router), React 19.2, Motion 12.38 (`motion/react`), Tailwind v4, TypeScript. Custom Lenis smooth scroll, Astro / Declandar / Chakra Petch fonts.

**Reference spec:** `docs/superpowers/specs/2026-04-28-dual-tone-rgb-redesign.md`. Read it first.

---

## Pre-flight notes for the implementer

1. **This is NOT the Next.js you know** — APIs differ from training data (per `AGENTS.md`). Before importing from `next/*`, glance at `node_modules/next/dist/docs/` if anything looks off.
2. **No test runner is configured** in this project. Verification per task is: `npx tsc --noEmit` (must pass) + `npm run dev` (visual walkthrough at `http://localhost:3000`). When a task says "Verify," do both unless noted.
3. **Custom cursor** is rendered globally — when you walk through visually, your real cursor is hidden. The site uses `CustomCursor` from `src/components/system/`. Don't break it.
4. **Font tokens** (`--font-astro`, `--font-declandar`, `--font-chakra`) are wired via `src/app/layout.tsx`. Don't touch font setup.
5. **Reduced-motion** is non-negotiable. Every animation introduced here MUST respect `prefers-reduced-motion: reduce`. The CSS file already has a global guard at the bottom; new JS-driven animations must check `window.matchMedia("(prefers-reduced-motion: reduce)").matches` and short-circuit.
6. **Commit cadence:** end of each Phase. Use the exact commit messages shown — they form a coherent log.

---

## File Structure

### New files

```
src/
  lib/
    useScrollScrub.ts          # Phase 0 · scroll-progress hook
    useMouseSpotlight.ts       # Phase 0 · per-element cursor proximity hook
  components/
    effects/
      RgbSplit.tsx             # Phase 0 · 3-layer red/white/cyan wrapper
      RgbSplitText.tsx         # Phase 0 · scroll/cursor-driven RgbSplit for text
      MagneticButton.tsx       # Phase 0 · pull-toward-cursor wrapper
    about/
      PhotoStack.tsx           # Phase 1 · chromatic photo with cyan ghost
      StatusTyper.tsx          # Phase 1 · rotating typed readout
    work/
      SpotlightCard.tsx        # Phase 2 · cursor-spotlight project card wrapper
      visuals/
        AuraCubesVisual.tsx    # Phase 2 · extracted from SelectedWork.tsx
        GrokPixelVisual.tsx    # Phase 2 · extracted
        DataArtVisual.tsx      # Phase 2 · extracted
        ScreenshotVisual.tsx   # Phase 2 · extracted
        index.ts               # Phase 2 · barrel re-export
    stack/
      KineticChipCloud.tsx     # Phase 4 · 3-lane drifting chip layout
    now/
      StatusConsole.tsx        # Phase 5 · top status grid
      TerminalFeed.tsx         # Phase 5 · tail -f live feed
    contact/
      DotField.tsx             # Phase 6 · cursor-reactive 12×6 dot grid
```

### Modified files

```
src/app/globals.css                       # Phase 0 · tokens + utilities + keyframes
src/components/sections/About.tsx         # Phase 1
src/components/sections/SelectedWork.tsx  # Phase 2 · extract visuals + spotlight
src/components/sections/ByTheNumbers.tsx  # Phase 3 · cyan beam, dual glitch
src/components/numbers/Beams.tsx          # Phase 3 · accept color prop
src/components/numbers/StatCell.tsx       # Phase 3 · cursor-reactive split
src/components/sections/Stack.tsx         # Phase 4 · kinetic chip cloud
src/content/stack.ts                      # Phase 4 · add lane field
src/components/sections/Now.tsx           # Phase 5 · status console + feed
src/content/now.ts                        # Phase 5 · feedEntries
src/components/sections/Contact.tsx       # Phase 6 · DotField + gradient rim
```

---

## Phase 0 — Foundation

Adds tokens, hooks, primitives, utilities. Every later phase depends on this. Do not skip steps; do not advance to Phase 1 until Phase 0 verifies clean.

### Task 0.1 — Color tokens

**Files:**
- Modify: `src/app/globals.css` (add cyan tokens + extend `@theme` block)

- [ ] **Step 1:** Open `src/app/globals.css`. In the `@theme` block (lines 4-18), add cyan tokens after `--color-hairline-red`:

```css
  --color-cyan: #00e5ff;
  --color-cyan-glow: rgba(0, 229, 255, 0.45);
  --color-hairline-cyan: rgba(0, 229, 255, 0.22);
```

- [ ] **Step 2:** In the `:root` block (lines 21-32), add matching CSS-var aliases after `--hairline-red`:

```css
  --cyan: #00e5ff;
  --cyan-glow: rgba(0, 229, 255, 0.45);
  --hairline-cyan: rgba(0, 229, 255, 0.22);
```

- [ ] **Step 3:** Verify Tailwind sees the tokens. Run:

```bash
npx tsc --noEmit
```

Expected: PASS (no TS errors). Tailwind v4 picks up `@theme` tokens automatically — no config rebuild needed.

- [ ] **Step 4:** Sanity check in dev: `npm run dev`, open the site. Nothing visually changes yet — just confirm it still compiles and renders.

---

### Task 0.2 — `.rgb-split` and `.hover-rgb` CSS utilities

**Files:**
- Modify: `src/app/globals.css` (append to file)

- [ ] **Step 1:** Append the following block to the end of `src/app/globals.css` (above the existing `@media (prefers-reduced-motion)` guard at the bottom — keep that guard last):

```css
/* ─── RGB-split signature ──────────────────────────────────────────── */
/*
 * Static RGB-split. Three siblings positioned in the same place:
 * a red layer (offset left by --rgb-offset), a white layer (centered),
 * a cyan layer (offset right by --rgb-offset).
 * The white layer is the only one read by screen readers; the red/cyan
 * siblings must be marked aria-hidden in JSX.
 */
.rgb-split {
  position: relative;
  display: inline-block;
  --rgb-offset: 0px;
}
.rgb-split > .rgb-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  user-select: none;
}
.rgb-split > .rgb-layer-red {
  color: var(--accent);
  transform: translate3d(calc(var(--rgb-offset) * -1), 0, 0);
  mix-blend-mode: screen;
}
.rgb-split > .rgb-layer-cyan {
  color: var(--cyan);
  transform: translate3d(var(--rgb-offset), 0, 0);
  mix-blend-mode: screen;
}
.rgb-split > .rgb-layer-fg {
  position: relative;
  color: var(--fg);
}

/* 2-stage hover for links / chips / buttons. Set the settle target with
 * data-rgb-settle="red" or "cyan". Default is cyan. */
.hover-rgb {
  position: relative;
  transition: color 200ms ease;
  --rgb-offset: 0px;
}
.hover-rgb::before,
.hover-rgb::after {
  content: attr(data-rgb-text);
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity 120ms ease, transform 240ms cubic-bezier(0.16, 1, 0.3, 1);
}
.hover-rgb::before {
  color: var(--accent);
  transform: translate3d(0, 0, 0);
  mix-blend-mode: screen;
}
.hover-rgb::after {
  color: var(--cyan);
  transform: translate3d(0, 0, 0);
  mix-blend-mode: screen;
}
.hover-rgb:hover::before {
  opacity: 1;
  transform: translate3d(-4px, 0, 0);
  animation: hover-rgb-settle-red 240ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.hover-rgb:hover::after {
  opacity: 1;
  transform: translate3d(4px, 0, 0);
  animation: hover-rgb-settle-cyan 240ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.hover-rgb[data-rgb-settle="red"]:hover { color: var(--accent); }
.hover-rgb[data-rgb-settle="cyan"]:hover,
.hover-rgb:not([data-rgb-settle]):hover { color: var(--cyan); }

@keyframes hover-rgb-settle-red {
  0%   { transform: translate3d(0, 0, 0); opacity: 0; }
  40%  { transform: translate3d(-4px, 0, 0); opacity: 1; }
  100% { transform: translate3d(0, 0, 0); opacity: 0; }
}
@keyframes hover-rgb-settle-cyan {
  0%   { transform: translate3d(0, 0, 0); opacity: 0; }
  40%  { transform: translate3d(4px, 0, 0); opacity: 1; }
  100% { transform: translate3d(0, 0, 0); opacity: 0; }
}

/* Reduced-motion override — collapse all RGB-split offsets and disable hover animation */
@media (prefers-reduced-motion: reduce) {
  .rgb-split { --rgb-offset: 0px !important; }
  .hover-rgb::before,
  .hover-rgb::after { display: none !important; }
}
```

- [ ] **Step 2:** Verify `npx tsc --noEmit` and `npm run dev` still pass. (Utilities are unused yet.)

---

### Task 0.3 — `useScrollScrub` hook

**Files:**
- Create: `src/lib/useScrollScrub.ts`

- [ ] **Step 1:** Create `src/lib/useScrollScrub.ts`:

```ts
"use client";

import { useScroll, useTransform, type MotionValue } from "motion/react";
import { type RefObject } from "react";

type ScrubOptions = {
  /** Where in the viewport the start of the element produces 0. Default "start end". */
  offsetStart?: "start end" | "start center" | "center end";
  /** Where in the viewport the end of the element produces 1. Default "end start". */
  offsetEnd?: "end start" | "end center" | "center start";
};

/**
 * Returns a MotionValue 0..1 representing element progress through the viewport.
 * 0 = element top has just entered the bottom of the viewport.
 * 1 = element bottom has just left the top of the viewport.
 *
 * Use `useTransform` on the result to map to whatever value you need (offset px,
 * rotation deg, opacity etc.). Disabled (returns a constant 0.5) under reduced motion.
 */
export function useScrollScrub<T extends HTMLElement>(
  ref: RefObject<T | null>,
  options: ScrubOptions = {},
): MotionValue<number> {
  const { offsetStart = "start end", offsetEnd = "end start" } = options;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [offsetStart, offsetEnd],
  });
  return scrollYProgress;
}

/**
 * Convenience: maps progress 0..1 → -peak..peak..-peak so the value peaks at center.
 * Useful for RGB-split offsets that should be 0 at edges and max at center.
 */
export function useScrubPeak<T extends HTMLElement>(
  ref: RefObject<T | null>,
  peakPx: number,
): MotionValue<number> {
  const progress = useScrollScrub(ref);
  return useTransform(progress, [0, 0.5, 1], [0, peakPx, 0]);
}

/**
 * Convenience: maps progress 0..1 → start..end linearly.
 */
export function useScrubLinear<T extends HTMLElement>(
  ref: RefObject<T | null>,
  start: number,
  end: number,
): MotionValue<number> {
  const progress = useScrollScrub(ref);
  return useTransform(progress, [0, 1], [start, end]);
}
```

- [ ] **Step 2:** Verify: `npx tsc --noEmit`. Expected: PASS.

---

### Task 0.4 — `useMouseSpotlight` hook

**Files:**
- Create: `src/lib/useMouseSpotlight.ts`

- [ ] **Step 1:** Create `src/lib/useMouseSpotlight.ts`:

```ts
"use client";

import { useEffect, type RefObject } from "react";
import { useMotionValue, useSpring, type MotionValue } from "motion/react";

type SpotlightValues = {
  /** cursor x relative to element center, px */
  x: MotionValue<number>;
  /** cursor y relative to element center, px */
  y: MotionValue<number>;
  /** 0 (far) → 1 (cursor on element center). Smoothed with a spring. */
  proximity: MotionValue<number>;
  /** raw distance in px from cursor to element center (no spring) */
  distance: MotionValue<number>;
};

type SpotlightOptions = {
  /** distance at which proximity becomes 0. Default 320. */
  falloff?: number;
  /** spring stiffness for proximity. Default 80. */
  stiffness?: number;
  /** spring damping for proximity. Default 18. */
  damping?: number;
};

/**
 * Tracks per-element cursor position + proximity (0..1) for cursor-reactive
 * effects. Disabled on touch devices and under reduced motion — values stay
 * at the inert defaults.
 */
export function useMouseSpotlight<T extends HTMLElement>(
  ref: RefObject<T | null>,
  options: SpotlightOptions = {},
): SpotlightValues {
  const { falloff = 320, stiffness = 80, damping = 18 } = options;
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const distance = useMotionValue(falloff);
  const rawProximity = useMotionValue(0);
  const proximity = useSpring(rawProximity, { stiffness, damping, mass: 0.6 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onMove = (e: PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const d = Math.sqrt(dx * dx + dy * dy);
      x.set(dx);
      y.set(dy);
      distance.set(d);
      rawProximity.set(Math.max(0, 1 - d / falloff));
    };
    const onLeave = () => {
      rawProximity.set(0);
      distance.set(falloff);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [ref, falloff, x, y, distance, rawProximity]);

  return { x, y, proximity, distance };
}
```

- [ ] **Step 2:** Verify: `npx tsc --noEmit`. Expected: PASS.

---

### Task 0.5 — `RgbSplit` + `RgbSplitText` components

**Files:**
- Create: `src/components/effects/RgbSplit.tsx`
- Create: `src/components/effects/RgbSplitText.tsx`

- [ ] **Step 1:** Create `src/components/effects/RgbSplit.tsx`:

```tsx
"use client";

import { motion, type MotionValue } from "motion/react";
import { type ReactNode, type ElementType, type CSSProperties } from "react";

type RgbSplitProps = {
  children: ReactNode;
  /** static offset in px when no MotionValue is provided */
  offset?: number;
  /** if provided, overrides `offset` and drives the CSS var dynamically */
  motionOffset?: MotionValue<number>;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
};

/**
 * Renders three layered copies of children:
 *   - red layer (translateX(-offset))
 *   - white foreground layer (translateX(0)) — the only one screen readers see
 *   - cyan layer (translateX(+offset))
 *
 * Layers offsets are driven by the `--rgb-offset` CSS var so motion lives on
 * the GPU. Pass a MotionValue via `motionOffset` for scroll/cursor-driven splits.
 *
 * IMPORTANT: red and cyan layers are aria-hidden. Only the foreground white
 * layer carries the accessible text.
 */
export function RgbSplit({
  children,
  offset = 0,
  motionOffset,
  as: Tag = "span",
  className,
  style,
}: RgbSplitProps) {
  const Outer = motion.create(Tag) as React.ComponentType<
    React.HTMLAttributes<HTMLElement> & {
      style?: CSSProperties & { [key: `--${string}`]: string | number };
    }
  >;

  const baseStyle: CSSProperties & { ["--rgb-offset"]?: string | number } = {
    "--rgb-offset": motionOffset ? undefined : `${offset}px`,
    ...style,
  };

  return (
    <Outer
      className={`rgb-split ${className ?? ""}`}
      // motion-driven CSS var — Motion supports CSS custom properties via style
      style={
        motionOffset
          ? ({
              ...baseStyle,
              "--rgb-offset": motionOffset,
            } as unknown as CSSProperties)
          : baseStyle
      }
    >
      <span aria-hidden className="rgb-layer rgb-layer-red">
        {children}
      </span>
      <span className="rgb-layer-fg">{children}</span>
      <span aria-hidden className="rgb-layer rgb-layer-cyan">
        {children}
      </span>
    </Outer>
  );
}
```

- [ ] **Step 2:** Create `src/components/effects/RgbSplitText.tsx`:

```tsx
"use client";

import { useRef, type ReactNode, type ElementType, type CSSProperties } from "react";
import { useTransform } from "motion/react";
import { useScrollScrub } from "@/lib/useScrollScrub";
import { useMouseSpotlight } from "@/lib/useMouseSpotlight";
import { RgbSplit } from "./RgbSplit";

type RgbSplitTextProps = {
  children: ReactNode;
  /** static base offset px; ignored if scrub or cursor is true */
  offset?: number;
  /** drive offset by element scroll progress (peaks at center) */
  scrub?: boolean;
  /** peak px when scrub or cursor is enabled */
  peakPx?: number;
  /** drive offset by cursor proximity to this element */
  cursor?: boolean;
  /** cursor falloff distance px (only when cursor=true) */
  cursorFalloff?: number;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
};

/**
 * Composes RgbSplit with scroll-scrub and/or cursor-reactive offset.
 * Modes:
 *   - default: static `offset` (px)
 *   - scrub: offset = peakPx * sin(progress * π)  (0 at edges, peak at center)
 *   - cursor: offset = peakPx * proximity  (0 far, peak on hover)
 *   - scrub + cursor: max(scrubOffset, cursorOffset)
 */
export function RgbSplitText({
  children,
  offset = 0,
  scrub = false,
  peakPx = 6,
  cursor = false,
  cursorFalloff = 280,
  as,
  className,
  style,
}: RgbSplitTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const scrollProgress = useScrollScrub(ref);
  const scrubOffset = useTransform(scrollProgress, [0, 0.5, 1], [0, peakPx, 0]);
  const { proximity } = useMouseSpotlight(ref, { falloff: cursorFalloff });
  const cursorOffset = useTransform(proximity, (p) => p * peakPx);
  const combined = useTransform([scrubOffset, cursorOffset], (vals) => {
    const v = vals as number[];
    if (scrub && cursor) return Math.max(v[0]!, v[1]!);
    if (scrub) return v[0]!;
    if (cursor) return v[1]!;
    return offset;
  });

  return (
    <span ref={ref} style={{ display: "inline-block" }}>
      <RgbSplit
        as={as}
        className={className}
        style={style}
        motionOffset={scrub || cursor ? combined : undefined}
        offset={offset}
      >
        {children}
      </RgbSplit>
    </span>
  );
}
```

- [ ] **Step 3:** Verify: `npx tsc --noEmit`. Expected: PASS.

- [ ] **Step 4:** Smoke-test in isolation. Temporarily edit `src/components/sections/About.tsx` line ~26-31 to wrap the section number in `<RgbSplitText cursor scrub peakPx={4}>02 ·</RgbSplitText>` (just for verification). Run `npm run dev`, scroll past About, hover over the number — confirm a red/cyan ghost appears. Revert the temporary change. (Phase 1 will use `RgbSplitText` for real.)

---

### Task 0.6 — `MagneticButton` component

**Files:**
- Create: `src/components/effects/MagneticButton.tsx`

- [ ] **Step 1:** Create `src/components/effects/MagneticButton.tsx`:

```tsx
"use client";

import { useRef, type ReactNode, type CSSProperties } from "react";
import { motion, useTransform } from "motion/react";
import { useMouseSpotlight } from "@/lib/useMouseSpotlight";

type MagneticButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  /** max pull in px when cursor is on the element. Default 8. */
  pullPx?: number;
  /** distance at which the pull falls to zero. Default 120. */
  falloff?: number;
  className?: string;
  style?: CSSProperties;
  external?: boolean;
};

/**
 * Wraps an anchor or button in a magnetic-pull effect.
 * The element translates toward the cursor (capped at pullPx) when cursor
 * is within `falloff` px. Disabled under reduced motion / touch (the
 * underlying spotlight hook short-circuits there).
 */
export function MagneticButton({
  children,
  href,
  onClick,
  pullPx = 8,
  falloff = 120,
  className,
  style,
  external = false,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { x, y, proximity } = useMouseSpotlight(ref, { falloff });
  // pull direction = from element center toward cursor, scaled by proximity * pullPx
  const tx = useTransform([x, proximity], (v) => {
    const arr = v as number[];
    return Math.max(-pullPx, Math.min(pullPx, (arr[0]! / falloff) * pullPx * arr[1]!));
  });
  const ty = useTransform([y, proximity], (v) => {
    const arr = v as number[];
    return Math.max(-pullPx, Math.min(pullPx, (arr[0]! / falloff) * pullPx * arr[1]!));
  });

  const inner = (
    <motion.div
      ref={ref}
      style={{ x: tx, y: ty, ...style }}
      className={className}
    >
      {children}
    </motion.div>
  );

  if (href) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        style={{ display: "inline-block" }}
      >
        {inner}
      </a>
    );
  }
  return (
    <button onClick={onClick} style={{ display: "inline-block", background: "none", border: 0, padding: 0, cursor: "inherit" }}>
      {inner}
    </button>
  );
}
```

- [ ] **Step 2:** Verify: `npx tsc --noEmit`. Expected: PASS.

---

### Task 0.7 — Phase 0 commit

- [ ] **Step 1:** Confirm with the user before committing (memory rule: ask before state-changing shell commands).

- [ ] **Step 2:** On approval, stage and commit:

```bash
git add src/app/globals.css src/lib/useScrollScrub.ts src/lib/useMouseSpotlight.ts src/components/effects/RgbSplit.tsx src/components/effects/RgbSplitText.tsx src/components/effects/MagneticButton.tsx docs/superpowers/specs/2026-04-28-dual-tone-rgb-redesign.md docs/superpowers/plans/2026-04-28-dual-tone-rgb-redesign.md .gitignore
git commit -m "feat(redesign): foundation — cyan token, RGB-split primitives, scroll/cursor hooks"
```

---

## Phase 1 — About redesign

### Task 1.1 — `PhotoStack` component

**Files:**
- Create: `src/components/about/PhotoStack.tsx`

- [ ] **Step 1:** Create `src/components/about/PhotoStack.tsx`:

```tsx
"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useTransform } from "motion/react";
import { useScrollScrub } from "@/lib/useScrollScrub";

type PhotoStackProps = {
  src: string;
  alt: string;
  /** max cyan-ghost offset in px when scrolled past. Default 14. */
  maxOffset?: number;
};

/**
 * Chromatic-aberration photo: one bordered photo + a cyan-tinted ghost
 * sliding behind it as the section enters the viewport. Uses scroll-scrub
 * for the ghost offset. Hairline corner marks alternate red/cyan.
 */
export function PhotoStack({ src, alt, maxOffset = 14 }: PhotoStackProps) {
  const ref = useRef<HTMLDivElement>(null);
  const progress = useScrollScrub(ref);
  // 0 at top of viewport entry, peak at center, 0 at exit
  const ghostX = useTransform(progress, [0, 0.5, 1], [0, maxOffset, 0]);
  const ghostY = useTransform(progress, [0, 0.5, 1], [0, maxOffset * 0.4, 0]);
  const ghostOpacity = useTransform(progress, [0, 0.4, 0.6, 1], [0, 0.7, 0.7, 0]);

  return (
    <div ref={ref} className="relative aspect-[4/5] w-full">
      {/* cyan ghost — behind */}
      <motion.div
        aria-hidden
        className="absolute inset-0 overflow-hidden border bg-black/40"
        style={{
          x: ghostX,
          y: ghostY,
          opacity: ghostOpacity,
          borderColor: "var(--hairline-cyan)",
          mixBlendMode: "screen",
        }}
      >
        <Image
          src={src}
          alt=""
          fill
          sizes="(min-width: 768px) 40vw, 100vw"
          className="object-cover object-center"
          style={{ filter: "saturate(0) brightness(1.1) sepia(1) hue-rotate(150deg) saturate(6)" }}
        />
      </motion.div>

      {/* foreground photo */}
      <div className="relative h-full w-full overflow-hidden border border-hairline-red bg-black/40">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 768px) 40vw, 100vw"
          className="object-cover object-center"
          style={{ filter: "saturate(0.85) contrast(1.05)" }}
        />
        {/* corner marks — alternate red / cyan */}
        <span aria-hidden className="pointer-events-none absolute left-2 top-2 h-3 w-3 border-l border-t" style={{ borderColor: "var(--accent)" }} />
        <span aria-hidden className="pointer-events-none absolute right-2 top-2 h-3 w-3 border-r border-t" style={{ borderColor: "var(--cyan)" }} />
        <span aria-hidden className="pointer-events-none absolute left-2 bottom-2 h-3 w-3 border-l border-b" style={{ borderColor: "var(--cyan)" }} />
        <span aria-hidden className="pointer-events-none absolute right-2 bottom-2 h-3 w-3 border-r border-b" style={{ borderColor: "var(--accent)" }} />
      </div>
    </div>
  );
}
```

- [ ] **Step 2:** Verify: `npx tsc --noEmit`.

---

### Task 1.2 — `StatusTyper` component

**Files:**
- Create: `src/components/about/StatusTyper.tsx`

- [ ] **Step 1:** Create `src/components/about/StatusTyper.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";

type StatusTyperProps = {
  /** rotating list of {label, value} pairs */
  entries: { label: string; value: string }[];
  /** ms between rotation. Default 4000. */
  intervalMs?: number;
  /** ms per typed character. Default 28. */
  typeMs?: number;
};

/**
 * Terminal-style typed readout — rotates through entries, types each `value`
 * out character-by-character, then idles, then erases and types the next one.
 * Cyan caret. Respects reduced motion (renders the first entry statically).
 */
export function StatusTyper({ entries, intervalMs = 4000, typeMs = 28 }: StatusTyperProps) {
  const [idx, setIdx] = useState(0);
  const [shown, setShown] = useState("");
  const [phase, setPhase] = useState<"typing" | "hold" | "erasing">("typing");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(entries[0]?.value ?? "");
      return;
    }
    const target = entries[idx]?.value ?? "";
    if (phase === "typing") {
      if (shown.length < target.length) {
        const t = setTimeout(() => setShown(target.slice(0, shown.length + 1)), typeMs);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setPhase("hold"), intervalMs);
      return () => clearTimeout(t);
    }
    if (phase === "hold") {
      const t = setTimeout(() => setPhase("erasing"), 0);
      return () => clearTimeout(t);
    }
    if (phase === "erasing") {
      if (shown.length > 0) {
        const t = setTimeout(() => setShown(shown.slice(0, -1)), typeMs / 2);
        return () => clearTimeout(t);
      }
      setIdx((i) => (i + 1) % entries.length);
      setPhase("typing");
    }
  }, [shown, phase, idx, entries, intervalMs, typeMs]);

  const current = entries[idx];

  return (
    <div className="font-chakra text-[14px] leading-[1.6] text-fg/70">
      <span className="mono-caps mr-2 text-cyan" style={{ color: "var(--cyan)", fontFamily: "var(--font-declandar), ui-monospace, monospace" }}>
        {current?.label.toUpperCase()} ›
      </span>
      <span>{shown}</span>
      <span className="animate-blink" style={{ color: "var(--cyan)" }}>▌</span>
    </div>
  );
}
```

- [ ] **Step 2:** Verify: `npx tsc --noEmit`.

---

### Task 1.3 — Refactor `About.tsx`

**Files:**
- Modify: `src/components/sections/About.tsx`

- [ ] **Step 1:** Add imports at top of file:

```tsx
import { RgbSplitText } from "@/components/effects/RgbSplitText";
import { PhotoStack } from "@/components/about/PhotoStack";
import { StatusTyper } from "@/components/about/StatusTyper";
```

- [ ] **Step 2:** Remove the `Image` import (no longer used directly here — `PhotoStack` owns it).

- [ ] **Step 3:** Replace the photo block (currently lines 36-60, the entire `<div className="md:col-span-5 lg:col-span-5">…</div>`) with:

```tsx
<div className="md:col-span-5 lg:col-span-5">
  <BlurText as="div">
    <PhotoStack src="/about.jpg" alt="Mokshith Rao" />
    <p
      className="mt-3 mono-caps text-muted"
      style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace" }}
    >
      <span style={{ color: "var(--cyan)" }}>◆</span> KARIMNAGAR, IN · b. 2004
    </p>
  </BlurText>
</div>
```

- [ ] **Step 4:** Replace the headline `<h2>...</h2>` block (currently around lines 66-89) with the RGB-split version:

```tsx
<h2
  className="font-astro text-fg leading-[0.95]"
  style={{ fontSize: "clamp(2.25rem, 5vw, 4.25rem)" }}
>
  <RgbSplitText scrub peakPx={5} as="span" className="block">
    <DecryptedText text="HI," triggerOnInView duration={700} delay={120} />
  </RgbSplitText>
  <span className="block">
    I&apos;M{" "}
    <RgbSplitText scrub cursor peakPx={6} as="span" className="text-accent">
      <DecryptedText text="MOKSHITH." triggerOnInView duration={1100} delay={400} />
    </RgbSplitText>
  </span>
</h2>
```

- [ ] **Step 5:** Replace the fact strip (currently lines ~122-157) with an HUD strip — pulsing dots alternating red/cyan, hover reveals an extended caption. Insert immediately after the closing `</div>` of the bio paragraphs and BEFORE the closing rule:

```tsx
<BlurText as="div" delay={500} className="mt-12 grid grid-cols-3 gap-4 border-t border-hairline pt-5">
  {[
    { label: "ROLE", value: "Founding engineer · Flashback Labs", caption: "Sept 2024 — present", dot: "red" as const },
    { label: "STUDYING", value: "B.Tech CSE · grad APR 2026", caption: "Jyothishmathi Institute", dot: "cyan" as const },
    { label: "WRITING IN", value: "TypeScript · Go · SQL", caption: "+ a little Python when forced", dot: "red" as const },
  ].map((cell) => (
    <div key={cell.label} className="group relative">
      <p
        className="mono-caps text-muted flex items-center gap-2"
        style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace" }}
      >
        <span
          className="pulse-dot inline-block h-1.5 w-1.5 rounded-full"
          style={{ background: cell.dot === "red" ? "var(--accent)" : "var(--cyan)" }}
        />
        {cell.label}
      </p>
      <p className="mt-2 font-chakra text-[0.95rem] leading-snug text-fg/85">{cell.value}</p>
      <p
        className="mt-1 mono-caps text-fg/35 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace", fontSize: 9 }}
      >
        {cell.caption}
      </p>
    </div>
  ))}
</BlurText>
```

- [ ] **Step 6:** Add the `StatusTyper` immediately under the bio paragraph block (before the fact strip):

```tsx
<BlurText as="div" delay={400} className="mt-8 border-t border-hairline-cyan pt-4" style={{ borderColor: "var(--hairline-cyan)" }}>
  <StatusTyper
    entries={[
      { label: "currently building", value: "Phase-2 of the Grok pipeline — pushing toward 1M assets" },
      { label: "currently reading", value: "Tigerbeetle internals + DDIA chapters 7-9" },
      { label: "currently breaking", value: "my own Go code, on purpose, in tests" },
    ]}
  />
</BlurText>
```

- [ ] **Step 7:** Verify: `npx tsc --noEmit` then `npm run dev`. Walk through the About section. Confirm:
  - Photo has a cyan ghost that drifts as you scroll past
  - "HI, I'M MOKSHITH." has a red+cyan split that intensifies near scroll midpoint and on cursor proximity
  - Status typer rotates and types
  - Fact strip dots alternate red/cyan and pulse
  - Hover on each fact cell reveals the small caption

- [ ] **Step 8:** Toggle DevTools → Rendering → "Emulate CSS prefers-reduced-motion: reduce". Reload. Confirm: ghost stays at offset 0, no rotation in typer (just first entry static), pulse dots calm.

---

### Task 1.4 — Phase 1 commit

- [ ] **Step 1:** Confirm with user before committing.

- [ ] **Step 2:** On approval:

```bash
git add src/components/about/ src/components/sections/About.tsx
git commit -m "feat(redesign): About — RGB-split headline, photo stack, status typer, HUD facts"
```

---

## Phase 2 — Selected Work redesign

### Task 2.1 — Extract project visuals

**Files:**
- Create: `src/components/work/visuals/AuraCubesVisual.tsx`
- Create: `src/components/work/visuals/GrokPixelVisual.tsx`
- Create: `src/components/work/visuals/DataArtVisual.tsx`
- Create: `src/components/work/visuals/ScreenshotVisual.tsx`
- Create: `src/components/work/visuals/index.ts`
- Modify: `src/components/sections/SelectedWork.tsx` (delete `ProjectVisual` function, import from `visuals`)

- [ ] **Step 1:** Create `src/components/work/visuals/AuraCubesVisual.tsx`. Copy the body of the existing `if (project.title === "AURA")` branch from `SelectedWork.tsx` (lines 213-236) into the new file. Update the `Cubes` props to add a cyan secondary ripple — replace `rippleColor="#ff2d2d"` with two stacked Cubes layered at low opacity (one red, one cyan) OR set `rippleColor="#00e5ff"` if Cubes only supports one. Concretely:

```tsx
"use client";
import Cubes from "@/components/reactbits/Cubes";

export function AuraCubesVisual() {
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-hairline bg-black/60">
      <Cubes
        gridSize={10}
        maxAngle={45}
        radius={3}
        borderStyle="1px solid rgba(255,45,45,0.4)"
        faceColor="#0a0a0a"
        rippleColor="#ff2d2d"
        rippleSpeed={1.6}
        cellGap={4}
        autoAnimate
        rippleOnClick
      />
      {/* secondary cyan ripple overlay */}
      <div className="pointer-events-none absolute inset-0 mix-blend-screen opacity-50">
        <Cubes
          gridSize={10}
          maxAngle={45}
          radius={3}
          borderStyle="1px solid rgba(0,229,255,0.25)"
          faceColor="transparent"
          rippleColor="#00e5ff"
          rippleSpeed={2.0}
          cellGap={4}
          autoAnimate
        />
      </div>
      <p
        className="pointer-events-none absolute left-3 top-3 z-10 mono-caps text-fg/55"
        style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace", fontSize: 9 }}
      >
        <span style={{ color: "var(--accent)" }}>●</span>
        <span style={{ color: "var(--cyan)", marginLeft: 2 }}>●</span> CLICK · MULTI-AGENT
      </p>
    </div>
  );
}
```

(If layering two Cubes is too heavy, drop the second one and accept single-color ripple — note this in the commit.)

- [ ] **Step 2:** Create `src/components/work/visuals/GrokPixelVisual.tsx`. Copy the Grok branch (lines 240-256) into it; add a cyan grid mask overlay:

```tsx
"use client";
import { PixelCanvas } from "@/components/numbers/PixelCanvas";

export function GrokPixelVisual({ active }: { active: boolean }) {
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-hairline bg-black/70">
      <PixelCanvas active={active} gap={5} speed={45} colors="#FFD700,#FFC72C,#A6790A,#ff2d2d" />
      {/* cyan grid mask */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,229,255,0.18) 1px, transparent 1px)," +
            "linear-gradient(to bottom, rgba(0,229,255,0.18) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          mixBlendMode: "screen",
        }}
      />
      <div className="pointer-events-none absolute inset-0 flex items-end p-6 md:p-8">
        <p
          className="font-astro leading-[0.85] text-fg"
          style={{ fontSize: "clamp(3.5rem, 8vw, 6.5rem)", textShadow: "0 0 32px rgba(0,0,0,0.7)" }}
        >
          442<span style={{ color: "var(--accent)" }}>K</span>
        </p>
      </div>
      <span aria-hidden className="pointer-events-none absolute right-4 top-4 h-3 w-3">
        <span className="absolute inset-0 border-r border-t" style={{ borderColor: "var(--cyan)" }} />
      </span>
    </div>
  );
}
```

- [ ] **Step 3:** Create `src/components/work/visuals/DataArtVisual.tsx`. Copy the data-art branch (lines 260-306). Add a cyan ghost number behind the bigNumber:

```tsx
"use client";
import type { Project } from "@/content/projects";

export function DataArtVisual({ project }: { project: Project & { visual: { kind: "data-art"; bigNumber: string; caption: string } } }) {
  return (
    <div
      className="relative aspect-[16/10] w-full overflow-hidden border-b border-hairline"
      style={{
        background:
          "radial-gradient(120% 80% at 30% 25%, rgba(255,45,45,0.10) 0%, rgba(10,10,10,0) 60%)," +
          "radial-gradient(120% 80% at 70% 80%, rgba(0,229,255,0.08) 0%, rgba(10,10,10,0) 60%)," +
          "linear-gradient(180deg, #14110F 0%, #0a0a0a 100%)",
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,45,45,0.18) 1px, transparent 1px)," +
            "linear-gradient(to bottom, rgba(0,229,255,0.18) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage: "radial-gradient(ellipse 80% 70% at 50% 60%, black 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 60%, black 30%, transparent 100%)",
        }}
      />
      <div className="relative z-10 flex h-full flex-col items-start justify-center px-7 py-7 md:px-9">
        <div className="relative">
          {/* cyan ghost behind */}
          <p
            aria-hidden
            className="absolute font-astro leading-[0.85]"
            style={{
              fontSize: "clamp(4rem, 11vw, 8.5rem)",
              top: 0,
              left: 4,
              color: "var(--cyan)",
              opacity: 0.35,
              mixBlendMode: "screen",
              textShadow: "0 0 24px rgba(0,229,255,0.4)",
            }}
          >
            {project.visual.bigNumber}
          </p>
          <p
            className="relative font-astro leading-[0.85] text-fg"
            style={{ fontSize: "clamp(4rem, 11vw, 8.5rem)", textShadow: "0 0 24px rgba(0,0,0,0.6)" }}
          >
            <span style={{ color: "var(--accent)" }}>{project.visual.bigNumber.charAt(0)}</span>
            {project.visual.bigNumber.slice(1)}
          </p>
        </div>
        <p
          className="mt-3 max-w-[40ch] mono-caps text-fg/55"
          style={{
            fontFamily: "var(--font-declandar), ui-monospace, monospace",
            letterSpacing: "0.2em",
            fontSize: 9.5,
          }}
        >
          {project.visual.caption}
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 4:** Create `src/components/work/visuals/ScreenshotVisual.tsx`:

```tsx
"use client";
import Image from "next/image";
import type { Project } from "@/content/projects";

export function ScreenshotVisual({ project }: { project: Project & { visual: { kind: "screenshot"; src: string; alt: string } } }) {
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-hairline bg-black/60">
      <Image
        src={project.visual.src}
        alt={project.visual.alt}
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.02]"
      />
    </div>
  );
}
```

- [ ] **Step 5:** Create `src/components/work/visuals/index.ts`:

```ts
export { AuraCubesVisual } from "./AuraCubesVisual";
export { GrokPixelVisual } from "./GrokPixelVisual";
export { DataArtVisual } from "./DataArtVisual";
export { ScreenshotVisual } from "./ScreenshotVisual";
```

- [ ] **Step 6:** Verify: `npx tsc --noEmit`. (The old `ProjectVisual` is still present in `SelectedWork.tsx` — it'll be deleted in Task 2.3.)

---

### Task 2.2 — `SpotlightCard` wrapper

**Files:**
- Create: `src/components/work/SpotlightCard.tsx`

- [ ] **Step 1:** Create `src/components/work/SpotlightCard.tsx`:

```tsx
"use client";

import { useRef, type ReactNode } from "react";
import { motion, useTransform } from "motion/react";
import { useMouseSpotlight } from "@/lib/useMouseSpotlight";

type SpotlightCardProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Wraps a project card with a cursor-tracking radial cyan spotlight.
 * The spotlight is a CSS radial-gradient overlay positioned via CSS vars
 * driven by Motion. Idle (cursor far) opacity is 0; hover opacity peaks at 0.55.
 */
export function SpotlightCard({ children, className }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { x, y, proximity } = useMouseSpotlight(ref, { falloff: 420 });
  // Convert center-relative coords to element-relative percentage for the gradient center
  const px = useTransform([x, proximity], (vals) => {
    const v = vals as number[];
    const el = ref.current;
    if (!el) return 50;
    const w = el.getBoundingClientRect().width;
    return 50 + (v[0]! / w) * 100;
  });
  const py = useTransform([y, proximity], (vals) => {
    const v = vals as number[];
    const el = ref.current;
    if (!el) return 50;
    const h = el.getBoundingClientRect().height;
    return 50 + (v[0]! / h) * 100;
  });
  const opacity = useTransform(proximity, [0, 1], [0, 0.55]);

  return (
    <motion.div ref={ref} className={`relative ${className ?? ""}`}>
      {children}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-30"
        style={{
          opacity,
          background: useTransform(
            [px, py],
            (v) => {
              const arr = v as number[];
              return `radial-gradient(circle 280px at ${arr[0]}% ${arr[1]}%, rgba(0,229,255,0.18), transparent 70%)`;
            },
          ),
          mixBlendMode: "screen",
        }}
      />
    </motion.div>
  );
}
```

- [ ] **Step 2:** Verify: `npx tsc --noEmit`.

---

### Task 2.3 — Refactor `SelectedWork.tsx`

**Files:**
- Modify: `src/components/sections/SelectedWork.tsx`

- [ ] **Step 1:** At the top, replace these imports:
  ```tsx
  import Image from "next/image";
  import { PixelCanvas } from "@/components/numbers/PixelCanvas";
  import Cubes from "@/components/reactbits/Cubes";
  ```
  with:
  ```tsx
  import { RgbSplitText } from "@/components/effects/RgbSplitText";
  import { SpotlightCard } from "@/components/work/SpotlightCard";
  import { AuraCubesVisual, GrokPixelVisual, DataArtVisual, ScreenshotVisual } from "@/components/work/visuals";
  ```

- [ ] **Step 2:** Delete the entire `ProjectVisual` function (lines ~212-320 — it's the function definition + all four branches). It's been replaced by the per-visual files.

- [ ] **Step 3:** In the `ProjectCard` function, replace the `<ProjectVisual project={project} active={inView} />` line with:
  ```tsx
  <SpotlightCard>
    {project.title === "AURA" ? <AuraCubesVisual />
      : project.title === "Grok pipeline" ? <GrokPixelVisual active={inView} />
      : project.visual.kind === "data-art" ? <DataArtVisual project={project as never} />
      : <ScreenshotVisual project={project as never} />}
  </SpotlightCard>
  ```

- [ ] **Step 4:** Replace the headline (lines ~50-64) with the RGB-split version:
  ```tsx
  <BlurText as="div" className="lg:col-span-7">
    <h2
      className="font-astro text-fg leading-[0.92]"
      style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
    >
      THINGS I&apos;VE<br />
      <span className="text-fg/35">ACTUALLY</span><br />
      <RgbSplitText scrub peakPx={6} as="span" className="text-accent">
        <DecryptedText text="SHIPPED." triggerOnInView duration={1100} delay={300} />
      </RgbSplitText>
    </h2>
  </BlurText>
  ```

- [ ] **Step 5:** Update the corner marks inside `<motion.article>` — the four corners currently all use `border-accent`. Change two diagonals to cyan so each card has a red/cyan checker:
  - Top-left and bottom-right: keep `border-accent`
  - Top-right and bottom-left: replace `border-accent` class with inline `style={{ borderColor: "var(--cyan)" }}`

  Concretely, find these two spans:
  ```tsx
  <span aria-hidden className="pointer-events-none absolute right-0 top-0 z-20 h-3 w-3 border-r border-t border-accent transition-opacity duration-300 group-hover:opacity-100 opacity-60" />
  ...
  <span aria-hidden className="pointer-events-none absolute left-0 bottom-0 z-20 h-3 w-3 border-l border-b border-accent transition-opacity duration-300 group-hover:opacity-100 opacity-60" />
  ```
  Replace `border-accent` in both with inline style — keep all other classes:
  ```tsx
  <span aria-hidden className="pointer-events-none absolute right-0 top-0 z-20 h-3 w-3 border-r border-t transition-opacity duration-300 group-hover:opacity-100 opacity-60" style={{ borderColor: "var(--cyan)" }} />
  ...
  <span aria-hidden className="pointer-events-none absolute left-0 bottom-0 z-20 h-3 w-3 border-l border-b transition-opacity duration-300 group-hover:opacity-100 opacity-60" style={{ borderColor: "var(--cyan)" }} />
  ```

- [ ] **Step 6:** Update stack-chip class. Find the chip `<li>` (around line 175-185) and add `hover-rgb` class with cyan settle:
  ```tsx
  <li
    key={s}
    data-rgb-text={s}
    data-rgb-settle="cyan"
    className="hover-rgb mono-caps border border-hairline px-2 py-0.5 text-fg/55 transition-colors group-hover:border-hairline-cyan"
    style={{
      fontFamily: "var(--font-declandar), ui-monospace, monospace",
      fontSize: 9.5,
      letterSpacing: "0.18em",
      borderColor: undefined,
    }}
  >
    {s}
  </li>
  ```
  (Note: `group-hover:border-hairline-cyan` is a Tailwind v4 arbitrary that resolves to the cyan hairline token — verify it works; if not, replace with inline `style` driven off a hover state.)

- [ ] **Step 7:** Update project links (`→ LIVE / GITHUB`). Find the `<a>` mapping links (around line 188-200) and add `hover-rgb` settling red:
  ```tsx
  <a
    key={l.label}
    href={l.href}
    target={l.external ? "_blank" : undefined}
    rel={l.external ? "noopener noreferrer" : undefined}
    data-rgb-text={`→ ${l.label.toUpperCase()}`}
    data-rgb-settle="red"
    className="hover-rgb mono-caps text-fg/70"
  >
    → {l.label.toUpperCase()}
  </a>
  ```

- [ ] **Step 8:** Verify: `npx tsc --noEmit` then `npm run dev`. Walk through Selected Work:
  - Headline "SHIPPED." has scroll-driven RGB split
  - Hovering over a card produces a cyan radial glow that follows the cursor
  - Two corners on each card are cyan
  - Stack chips on hover show a brief red+cyan ghost then settle cyan
  - Project links on hover show ghost then settle red

- [ ] **Step 9:** Reduced-motion check (DevTools → Rendering toggle). Confirm RGB-split offsets stay 0, no spotlight glow.

---

### Task 2.4 — Phase 2 commit

- [ ] Confirm with user, then:

```bash
git add src/components/work/ src/components/sections/SelectedWork.tsx
git commit -m "feat(redesign): Selected Work — spotlight cards, RGB-split headline, dual-tone visuals"
```

---

## Phase 3 — By the Numbers (light touch)

Spec §5.2 says preserve current strength. Three small additions only.

### Task 3.1 — Cyan beam variant

**Files:**
- Modify: `src/components/numbers/Beams.tsx`

- [ ] **Step 1:** Open `src/components/numbers/Beams.tsx`. The component currently emits beams in a single color (red). Add a `secondaryColor?: string` prop. Where the beam color is applied, render two beam stacks: the primary (existing) at base opacity and the secondary at 0.45 opacity with a 50% horizontal phase offset. (The exact location depends on the file — modify minimally.) If the file uses `style={{ background: \`linear-gradient(...)\` }}`, add a sibling absolutely-positioned div with the secondary gradient at `mix-blend-mode: screen`.

- [ ] **Step 2:** In `ByTheNumbers.tsx`, pass the new prop. Locate where `Beams` is rendered (it's inside one of the StatCells — likely on the 442K hero). Pass `secondaryColor="#00e5ff"`.

- [ ] **Step 3:** Verify: `npx tsc --noEmit`, dev walkthrough — the 442K cell now has subtly drifting cyan beams alongside the red.

> If `Beams.tsx` is structurally hard to retrofit, accept a degraded outcome: skip the secondary color and document the deferral in the commit message ("beam dual-color deferred — Beams refactor needed").

---

### Task 3.2 — Dual-color glitch on 442K

**Files:**
- Modify: `src/app/globals.css` (extend existing glitch keyframes)
- Modify: `src/components/numbers/StatCell.tsx` (add cyan glitch layer)

- [ ] **Step 1:** In `src/app/globals.css`, the existing `.glitch-layer-red` and `.glitch-layer-white` keyframes already create the chromatic effect. Add a third keyframe `.glitch-layer-cyan` mirroring `glitch-layer-red` but offset:

```css
@keyframes glitch-cyan {
  0%   { transform: translate(0, 0);    clip-path: polygon(0 12%, 100% 12%, 100% 28%, 0 28%); }
  20%  { transform: translate(-2px, 1px); clip-path: polygon(0 60%, 100% 60%, 100% 76%, 0 76%); }
  40%  { transform: translate(2px, -1px); clip-path: polygon(0 35%, 100% 35%, 100% 50%, 0 50%); }
  60%  { transform: translate(-1px, 0);    clip-path: polygon(0 75%, 100% 75%, 100% 95%, 0 95%); }
  80%  { transform: translate(1px, 0);   clip-path: polygon(0 5%,   100% 5%,   100% 18%, 0 18%); }
  100% { transform: translate(0, 0);     clip-path: polygon(0 0,   100% 0,   100% 0,  0 0); }
}
.glitch-layer-cyan { animation: glitch-cyan 600ms steps(8, end); }
```

- [ ] **Step 2:** In `src/components/numbers/StatCell.tsx`, find where the glitch effect is rendered (look for `.glitch-layer-red` and `.glitch-layer-white` usages). Add a third sibling layer with `className="glitch-layer glitch-layer-cyan"` and `style={{ color: "var(--cyan)" }}` — same content as the existing glitch layers.

- [ ] **Step 3:** Verify: dev walkthrough. The 442K cell glitch now reads as red + white + cyan rather than red + white only.

---

### Task 3.3 — Cursor-reactive cell split

**Files:**
- Modify: `src/components/numbers/StatCell.tsx`

- [ ] **Step 1:** At the top, import:
  ```tsx
  import { useRef } from "react";
  import { useTransform } from "motion/react";
  import { useMouseSpotlight } from "@/lib/useMouseSpotlight";
  ```

- [ ] **Step 2:** Inside the `StatCell` component (function body), add:
  ```tsx
  const cellRef = useRef<HTMLDivElement>(null);
  const { proximity } = useMouseSpotlight(cellRef, { falloff: 220 });
  const splitOffset = useTransform(proximity, [0, 1], [0, 6]);
  ```

- [ ] **Step 3:** Attach `ref={cellRef}` and `style={{ "--rgb-offset": splitOffset } as never}` to the outer `motion.div` of the cell. The big-number text inside the cell needs the `.rgb-split` class with red+cyan layered siblings — wrap the digit JSX in `<RgbSplit>` from `@/components/effects/RgbSplit`. (Re-use the existing component; do not re-implement.)

- [ ] **Step 4:** Verify: hover over each cell — the digits get a brief red+cyan widening that scales with cursor proximity. Other cells stay clean.

---

### Task 3.4 — Phase 3 commit

- [ ] Confirm, then:

```bash
git add src/app/globals.css src/components/numbers/Beams.tsx src/components/numbers/StatCell.tsx src/components/sections/ByTheNumbers.tsx
git commit -m "feat(redesign): By the Numbers — cyan beam, dual-color glitch, cursor-reactive cells"
```

---

## Phase 4 — Stack redesign (kinetic chip cloud)

This phase **supersedes** the previous stack spec at `docs/superpowers/specs/2026-04-27-section-05-stack-design.md`.

### Task 4.1 — Extend `stack.ts` with lane field

**Files:**
- Modify: `src/content/stack.ts`

- [ ] **Step 1:** Add a `lane: 0 | 1 | 2` field to the `Tool` type. Each chip will be assigned to one of three drift lanes. Update every existing tool to include a lane (assign roughly evenly — group AI/ML and Languages on lane 0, App/Data on lane 1, Infra/Runtime on lane 2, but feel free to balance for visual rhythm).

```ts
export type Tool = {
  name: string;
  role: string;
  lane: 0 | 1 | 2;
};
```

For each existing tool entry, add `lane: <0|1|2>`. Keep the `TIERS` structure intact (still used to describe categories), but the chip cloud will flatten and re-group by lane.

- [ ] **Step 2:** Add a derived export at the bottom:
  ```ts
  export const ALL_TOOLS: Tool[] = TIERS.flatMap((t) => t.tools);
  ```

- [ ] **Step 3:** Verify: `npx tsc --noEmit`.

---

### Task 4.2 — `KineticChipCloud` component

**Files:**
- Create: `src/components/stack/KineticChipCloud.tsx`

- [ ] **Step 1:** Create the file:

```tsx
"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { ALL_TOOLS, type Tool } from "@/content/stack";

const LANE_DURATIONS = [18, 26, 32]; // seconds, lane 0..2
const LANE_DIRECTIONS = [-1, 1, -1] as const; // 1 = left→right, -1 = right→left

/**
 * Flattens tools into 3 horizontal lanes that drift continuously. Hovering
 * pauses the lane. Clicking a chip toggles its expanded state, revealing the
 * role caption inline. Each chip has hover-rgb micro-interaction.
 */
export function KineticChipCloud() {
  const lanes = useMemo<Tool[][]>(() => {
    const out: Tool[][] = [[], [], []];
    for (const t of ALL_TOOLS) out[t.lane]!.push(t);
    return out;
  }, []);

  return (
    <div className="space-y-4">
      {lanes.map((tools, i) => (
        <Lane key={i} tools={tools} duration={LANE_DURATIONS[i]!} direction={LANE_DIRECTIONS[i]!} />
      ))}
    </div>
  );
}

function Lane({ tools, duration, direction }: { tools: Tool[]; duration: number; direction: 1 | -1 }) {
  const [paused, setPaused] = useState(false);
  // Duplicate the chip list so the marquee loops seamlessly
  const doubled = [...tools, ...tools];
  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <motion.div
        className="flex gap-3"
        animate={{ x: direction === 1 ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ duration, ease: "linear", repeat: Infinity }}
        style={{ animationPlayState: paused ? "paused" : "running" }}
      >
        {doubled.map((t, idx) => (
          <Chip key={`${t.name}-${idx}`} tool={t} />
        ))}
      </motion.div>
    </div>
  );
}

function Chip({ tool }: { tool: Tool }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      onClick={() => setOpen((o) => !o)}
      data-rgb-text={tool.name}
      data-rgb-settle="cyan"
      className="hover-rgb mono-caps inline-flex shrink-0 items-baseline gap-2 border px-3 py-1.5 text-fg/85"
      style={{
        fontFamily: "var(--font-declandar), ui-monospace, monospace",
        fontSize: 11,
        borderColor: open ? "var(--cyan)" : "var(--hairline-cyan)",
        background: "var(--bg)",
      }}
    >
      <span>{tool.name}</span>
      <span style={{ color: open ? "var(--cyan)" : "var(--fg)", opacity: 0.5, fontSize: 9 }}>
        · {open ? tool.role : "▸"}
      </span>
    </button>
  );
}
```

- [ ] **Step 2:** Verify: `npx tsc --noEmit`.

> Note: `animationPlayState` does not control framer-motion `animate`. The pause behavior in the snippet above is decorative only — for a real pause you'll need to swap to a CSS keyframe + `animation-play-state`, or conditionally set `transition.duration` to a huge number when paused. Acceptable starting compromise: the marquee always runs; revisit if QA flags it.

---

### Task 4.3 — Refactor `Stack.tsx`

**Files:**
- Modify: `src/components/sections/Stack.tsx`

- [ ] **Step 1:** Add imports:
  ```tsx
  import { RgbSplitText } from "@/components/effects/RgbSplitText";
  import { KineticChipCloud } from "@/components/stack/KineticChipCloud";
  ```

- [ ] **Step 2:** Replace the entire tier-row block (lines ~67-125, the `<div className="border-t border-hairline">` containing the `TIERS.map`) with:
  ```tsx
  <div className="border-t pt-10 md:pt-14" style={{ borderColor: "var(--hairline-cyan)" }}>
    <KineticChipCloud />
  </div>
  ```

- [ ] **Step 3:** Replace the headline `FOR.` red span with an RGB-split version:
  ```tsx
  <RgbSplitText scrub peakPx={6} as="span" style={{ color: "var(--cyan)" }}>
    <DecryptedText text="FOR." triggerOnInView duration={900} delay={300} />
  </RgbSplitText>
  ```
  (Note: this is the section where cyan dominates. Headline accent shifts from red to cyan.)

- [ ] **Step 4:** Update section-header divider color to cyan: in line ~28 change `border-b border-hairline` to inline `style={{ borderColor: "var(--hairline-cyan)" }}` while keeping `border-b`. Same for the closing rule at the bottom.

- [ ] **Step 5:** Verify: dev walkthrough. Stack section now shows three drifting chip lanes, cyan-dominant. Click a chip — caption swaps in. Hover a chip — RGB ghost flashes then settles cyan.

---

### Task 4.4 — Phase 4 commit

```bash
git add src/content/stack.ts src/components/stack/ src/components/sections/Stack.tsx
git commit -m "feat(redesign): Stack — kinetic chip cloud, cyan-dominant, replaces tier rows"
```

---

## Phase 5 — Now redesign (status console + tail -f feed)

### Task 5.1 — Extend `now.ts` with feedEntries

**Files:**
- Modify: `src/content/now.ts`

- [ ] **Step 1:** Add types and content:

```ts
export type TerminalLevel = "info" | "err" | "ok";
export type TerminalEntry = {
  /** ISO time; rendered as HH:MM */
  time: string;
  level: TerminalLevel;
  message: string;
};

// extend NowContent
export type NowContent = {
  updated: string;
  availability: string;
  entries: NowEntry[];
  feed: TerminalEntry[];
  uptimeStartIso: string; // for uptime tile
  currentBuild: string[];  // rotating strings for the cyan tile
};
```

- [ ] **Step 2:** Add 8-12 realistic feed entries to `NOW`. Example seed:

```ts
feed: [
  { time: "09:14", level: "ok",   message: "deploy/grok pipeline → vercel-edge · 442k assets indexed" },
  { time: "09:42", level: "info", message: "tail processor pod cold-start latency · p95 1.2s" },
  { time: "10:03", level: "err",  message: "scrfd onnx · cuda OOM on batch=64, fell back to batch=32" },
  { time: "10:21", level: "info", message: "wrote integration test for inngest fanout retries" },
  { time: "11:00", level: "ok",   message: "merged feat/dual-tone-redesign foundation" },
  { time: "12:14", level: "info", message: "reading: tigerbeetle ‟double-entry accounting at the storage layer”" },
  { time: "13:48", level: "ok",   message: "shipped chefmate v1.1 · android tflite ingredient detector" },
  { time: "14:30", level: "info", message: "rg ‟eventual consistency” papers/ddia · 6 hits worth re-reading" },
  { time: "15:11", level: "err",  message: "lenis init race on hot-reload · added ready-state guard" },
  { time: "16:02", level: "ok",   message: "code review: aura multi-agent retry policy · LGTM" },
],
uptimeStartIso: "2024-09-01T00:00:00Z",
currentBuild: [
  "Phase-2 grok pipeline · 1M asset target",
  "ChefMate v1.2 · pantry sync",
  "Portfolio v3 · dual-tone RGB-split redesign",
],
```

- [ ] **Step 3:** Verify: `npx tsc --noEmit`.

---

### Task 5.2 — `StatusConsole` component

**Files:**
- Create: `src/components/now/StatusConsole.tsx`

- [ ] **Step 1:** Create the file:

```tsx
"use client";

import { useEffect, useState } from "react";

type StatusConsoleProps = {
  uptimeStartIso: string;
  currentBuild: string[];
};

/**
 * Three-cell top status grid:
 *   STATUS — pulsing red dot, live "online" + 24h timestamp
 *   FOCUS  — pulsing cyan dot, current focus area
 *   LOCATION — Karimnagar · UTC+5:30
 *
 * Plus two big tiles below: UPTIME (red, counts months/days since start)
 * and CURRENT BUILD (cyan, rotates every 4s).
 */
export function StatusConsole({ uptimeStartIso, currentBuild }: StatusConsoleProps) {
  const [now, setNow] = useState(() => new Date());
  const [buildIdx, setBuildIdx] = useState(0);

  useEffect(() => {
    const tick = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setBuildIdx((i) => (i + 1) % currentBuild.length), 4000);
    return () => clearInterval(t);
  }, [currentBuild.length]);

  const time = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false });
  const uptime = formatUptime(uptimeStartIso, now);

  return (
    <div className="space-y-6">
      {/* status row */}
      <div className="grid grid-cols-1 gap-px md:grid-cols-3" style={{ background: "var(--hairline)" }}>
        <ConsoleCell dot="red"  label="STATUS"   value={`ONLINE · ${time}`} />
        <ConsoleCell dot="cyan" label="FOCUS"    value="GROK PIPELINE PHASE-2" />
        <ConsoleCell dot="red"  label="LOCATION" value="KARIMNAGAR · UTC+5:30" />
      </div>

      {/* big tiles */}
      <div className="grid grid-cols-1 gap-px md:grid-cols-2" style={{ background: "var(--hairline)" }}>
        <div className="bg-bg p-7 md:p-9">
          <p className="mono-caps text-muted" style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace" }}>
            UPTIME
          </p>
          <p className="font-astro mt-3 leading-[0.9]" style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", color: "var(--accent)" }}>
            {uptime}
          </p>
          <p className="mt-2 mono-caps text-fg/55" style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace", fontSize: 10 }}>
            SINCE FOUNDING-ENGINEER START · FLASHBACK LABS
          </p>
        </div>
        <div className="bg-bg p-7 md:p-9">
          <p className="mono-caps text-muted" style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace" }}>
            CURRENT BUILD
          </p>
          <p className="font-astro mt-3 leading-[1.1]" style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", color: "var(--cyan)" }}>
            {currentBuild[buildIdx]}
          </p>
          <p className="mt-2 mono-caps text-fg/55" style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace", fontSize: 10 }}>
            ROTATES · {buildIdx + 1} / {currentBuild.length}
          </p>
        </div>
      </div>
    </div>
  );
}

function ConsoleCell({ dot, label, value }: { dot: "red" | "cyan"; label: string; value: string }) {
  return (
    <div className="bg-bg p-6">
      <p className="mono-caps text-muted flex items-center gap-2" style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace" }}>
        <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full" style={{ background: dot === "red" ? "var(--accent)" : "var(--cyan)" }} />
        {label}
      </p>
      <p className="mt-3 font-chakra text-[0.95rem] text-fg/85">{value}</p>
    </div>
  );
}

function formatUptime(startIso: string, now: Date): string {
  const start = new Date(startIso);
  const ms = now.getTime() - start.getTime();
  const days = Math.floor(ms / 86_400_000);
  const months = Math.floor(days / 30);
  const remDays = days - months * 30;
  return `${months}mo ${remDays}d`;
}
```

- [ ] **Step 2:** Verify: `npx tsc --noEmit`.

---

### Task 5.3 — `TerminalFeed` component

**Files:**
- Create: `src/components/now/TerminalFeed.tsx`

- [ ] **Step 1:** Create the file:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import type { TerminalEntry } from "@/content/now";

/**
 * Auto-scrolling tail -f feed. Renders the entries in a fixed-height
 * container; scrolls upward continuously. Pauses on hover.
 *
 * Reduced-motion: feed renders statically (no scroll), entries simply listed.
 */
export function TerminalFeed({ entries }: { entries: TerminalEntry[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reduced || paused) return;
    const el = containerRef.current;
    if (!el) return;
    let raf = 0;
    let last = performance.now();
    const speedPxPerMs = 0.025; // ~25px/sec

    const tick = (t: number) => {
      const dt = t - last;
      last = t;
      el.scrollTop += speedPxPerMs * dt;
      if (el.scrollTop >= el.scrollHeight / 2) {
        el.scrollTop = 0;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced, paused]);

  // Double the entries so the loop is seamless
  const doubled = [...entries, ...entries];

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative max-h-[280px] overflow-hidden border bg-black/60 p-5 font-mono text-[12.5px] leading-[1.7]"
      style={{ borderColor: "var(--hairline-cyan)", fontFamily: "var(--font-declandar), ui-monospace, monospace" }}
    >
      {/* gradient masks top/bottom for fade */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black to-transparent z-10" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black to-transparent z-10" />
      <div className="relative z-0 space-y-1.5">
        {doubled.map((e, i) => (
          <div key={i} className="flex gap-3">
            <span style={{ color: "var(--cyan)", opacity: 0.85, minWidth: 48 }}>{e.time}</span>
            <span style={{
              color: e.level === "err" ? "var(--accent)" : e.level === "ok" ? "#9aff7a" : "var(--fg)",
              opacity: 0.6,
              minWidth: 56,
            }}>
              [{e.level}]
            </span>
            <span style={{ color: "var(--fg)", opacity: 0.85 }}>{e.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2:** Verify: `npx tsc --noEmit`.

---

### Task 5.4 — Refactor `Now.tsx`

**Files:**
- Modify: `src/components/sections/Now.tsx`

- [ ] **Step 1:** Add imports:
  ```tsx
  import { RgbSplitText } from "@/components/effects/RgbSplitText";
  import { StatusConsole } from "@/components/now/StatusConsole";
  import { TerminalFeed } from "@/components/now/TerminalFeed";
  ```

- [ ] **Step 2:** Replace the entries panel (lines ~74-107) and the availability strip with:
  ```tsx
  <div className="space-y-10">
    <StatusConsole uptimeStartIso={NOW.uptimeStartIso} currentBuild={NOW.currentBuild} />

    {/* original "now" entries panel — kept */}
    <div className="grid grid-cols-1 gap-px md:grid-cols-2" style={{ background: "var(--hairline)" }}>
      {NOW.entries.map((entry, i) => (
        <motion.div
          key={entry.label}
          initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.85, ease: REVEAL_EASE, delay: i * 0.08 }}
          className="group relative bg-bg p-7 transition-colors duration-300 hover:bg-black/60 md:p-9"
        >
          <p className="mono-caps text-accent" style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace" }}>
            <DecryptedText text={entry.label.toUpperCase()} triggerOnInView duration={700} delay={i * 80} />
          </p>
          <p className="mt-4 font-chakra text-[1rem] leading-[1.65] text-fg/85 md:text-[1.05rem]">{entry.value}</p>
          <span aria-hidden className="pointer-events-none absolute left-7 right-7 top-0 h-px bg-hairline-red opacity-50 transition-opacity duration-300 group-hover:opacity-100 md:left-9 md:right-9" />
        </motion.div>
      ))}
    </div>

    {/* terminal feed */}
    <div>
      <p className="mono-caps text-muted mb-3" style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace" }}>
        <span style={{ color: "var(--cyan)" }}>●</span> LIVE FEED · WHAT I TOUCHED TODAY
      </p>
      <TerminalFeed entries={NOW.feed} />
    </div>
  </div>
  ```

- [ ] **Step 3:** Replace the headline `RIGHT NOW.` with RGB-split:
  ```tsx
  <RgbSplitText scrub peakPx={5} as="span" className="text-accent">
    <DecryptedText text="RIGHT NOW." triggerOnInView duration={1100} delay={300} />
  </RgbSplitText>
  ```

- [ ] **Step 4:** Verify: dev walkthrough — Now section shows:
  1. Three-cell status grid with alternating dots
  2. Uptime tile + Current Build tile (rotating every 4s)
  3. Original 2-up entries panel (preserved)
  4. Terminal feed scrolling slowly upward; pauses on hover

---

### Task 5.5 — Phase 5 commit

```bash
git add src/content/now.ts src/components/now/ src/components/sections/Now.tsx
git commit -m "feat(redesign): Now — status console, uptime/build tiles, tail -f feed"
```

---

## Phase 6 — Contact redesign

### Task 6.1 — `DotField` component

**Files:**
- Create: `src/components/contact/DotField.tsx`

- [ ] **Step 1:** Create the file:

```tsx
"use client";

import { useEffect, useRef } from "react";

const COLS = 12;
const ROWS = 6;
const RADIUS = 200;

/**
 * 12×6 grid of small dots. Cursor proximity within RADIUS px shifts each
 * dot's color (red ↔ cyan based on parity), scale (1.0 → 2.2), and opacity
 * (0.25 → 0.95). Pure DOM + rAF — no React state churn.
 */
export function DotField() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const root = ref.current;
    if (!root) return;
    const dots = Array.from(root.querySelectorAll<HTMLSpanElement>("[data-dot]"));

    let mx = -9999, my = -9999;
    const onMove = (e: PointerEvent) => { mx = e.clientX; my = e.clientY; };
    window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    const tick = () => {
      for (const d of dots) {
        const r = d.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = mx - cx;
        const dy = my - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const t = Math.max(0, 1 - dist / RADIUS);
        d.style.transform = `scale(${1 + t * 1.2})`;
        d.style.opacity = String(0.25 + t * 0.7);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const cells = Array.from({ length: COLS * ROWS }, (_, i) => i);
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 grid"
      style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, gridTemplateRows: `repeat(${ROWS}, 1fr)` }}
    >
      {cells.map((i) => {
        const isCyan = (Math.floor(i / COLS) + (i % COLS)) % 2 === 0;
        return (
          <div key={i} className="flex items-center justify-center">
            <span
              data-dot
              style={{
                display: "inline-block",
                width: 4,
                height: 4,
                borderRadius: 9999,
                background: isCyan ? "var(--cyan)" : "var(--accent)",
                opacity: 0.25,
                transition: "transform 200ms ease, opacity 200ms ease",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2:** Verify: `npx tsc --noEmit`.

---

### Task 6.2 — Update rim-trace to red→cyan gradient

**Files:**
- Modify: `src/app/globals.css` (extend `@property --star-angle` and add gradient rim keyframes)

- [ ] **Step 1:** The current globals.css has `@property --star-angle` and `@keyframes starBorderSpin` but no actual rim-trace style applied. Add:

```css
/* gradient rim trace for the contact CTA */
.rim-trace-gradient {
  position: relative;
  isolation: isolate;
}
.rim-trace-gradient::before {
  content: "";
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  padding: 1px;
  background: conic-gradient(from var(--star-angle), transparent 0deg, var(--accent) 90deg, var(--cyan) 180deg, transparent 270deg);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
          mask-composite: exclude;
  animation: starBorderSpin 4s linear infinite;
  pointer-events: none;
  z-index: -1;
}
@media (prefers-reduced-motion: reduce) {
  .rim-trace-gradient::before { animation: none; }
}
```

- [ ] **Step 2:** Verify: `npx tsc --noEmit`. (CSS only.)

---

### Task 6.3 — Refactor `Contact.tsx`

**Files:**
- Modify: `src/components/sections/Contact.tsx`

- [ ] **Step 1:** Add imports:
  ```tsx
  import { RgbSplitText } from "@/components/effects/RgbSplitText";
  import { DotField } from "@/components/contact/DotField";
  ```

- [ ] **Step 2:** Inside the `<section>` element, immediately AFTER the existing `<div aria-hidden …>` warm-wash gradient and BEFORE the noise overlay, insert:
  ```tsx
  <DotField />
  ```

- [ ] **Step 3:** Replace the headline `<h2>` block (lines ~79-100) with an RGB-split version. The cursor-reactive split is the most aggressive on the site (peakPx={12}):
  ```tsx
  <BlurText as="div">
    <h2
      className="font-astro leading-[0.92] text-fg"
      style={{ fontSize: "clamp(2.5rem, 8vw, 7rem)" }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <RgbSplitText scrub cursor peakPx={12} as="span" className="block">
        <DecryptedText text="LET'S BUILD" triggerOnInView duration={1100} delay={150} />
      </RgbSplitText>
      <motion.span className="block" animate={{ x: hover ? 6 : 0 }} transition={{ type: "spring", stiffness: 200, damping: 22 }}>
        <span className="text-fg/35">SOMETHING.</span>
      </motion.span>
    </h2>
  </BlurText>
  ```

- [ ] **Step 4:** Wrap the email CTA `<a>` (lines ~104-124) so it gets the gradient rim trace. The current implementation is a bottom-bordered link — promote it to a full bordered button with the rim-trace class:
  ```tsx
  <BlurText as="div" delay={500} className="mt-10">
    <a
      href={`mailto:${EMAIL}`}
      className="rim-trace-gradient group inline-flex items-baseline gap-3 border border-hairline-red px-6 py-4 transition-colors hover:border-accent"
      data-rgb-text={`→ ${EMAIL}`}
      data-rgb-settle="red"
    >
      <span className="font-astro text-accent" style={{ fontSize: "clamp(1.2rem, 2vw, 1.6rem)" }}>→</span>
      <span className="font-chakra text-fg group-hover:text-accent transition-colors" style={{ fontSize: "clamp(1.2rem, 2.4vw, 1.85rem)" }}>
        {EMAIL}
      </span>
    </a>
  </BlurText>
  ```

- [ ] **Step 5:** Update secondary buttons to use `hover-rgb` class with cyan settle and cyan hairline border:
  ```tsx
  <a
    key={l.label}
    href={l.href}
    target={l.external ? "_blank" : undefined}
    rel={l.external ? "noopener noreferrer" : undefined}
    {...(l.download ? { download: true } : {})}
    data-rgb-text={l.label}
    data-rgb-settle="cyan"
    className="hover-rgb mono-caps inline-flex items-center rounded-sm border px-5 py-3 text-fg/85"
    style={{
      fontFamily: "var(--font-declandar), ui-monospace, monospace",
      borderColor: "var(--hairline-cyan)",
    }}
  >
    {l.label}
  </a>
  ```

- [ ] **Step 6:** Verify: dev walkthrough. Confirm:
  - Subtle dot grid behind the headline; dots scale + brighten near cursor
  - Headline RGB-split is heavy near cursor and at scroll midpoint
  - Email CTA has a continuously rotating red→cyan gradient rim
  - Secondary buttons hover-RGB and settle cyan

---

### Task 6.4 — Phase 6 commit

```bash
git add src/components/contact/ src/app/globals.css src/components/sections/Contact.tsx
git commit -m "feat(redesign): Contact — RGB-split headline, dot field, gradient rim email CTA"
```

---

## Phase 7 — Final verification

### Task 7.1 — Type-check + lint clean pass

- [ ] **Step 1:** Run:
  ```bash
  npx tsc --noEmit
  ```
  Expected: PASS, zero errors.

- [ ] **Step 2:** If a lint/format script exists in `package.json`, run it. Otherwise skip.

---

### Task 7.2 — Reduced-motion smoke pass

- [ ] **Step 1:** `npm run dev`. In Chrome DevTools → Rendering → "Emulate CSS prefers-reduced-motion: reduce". Reload.

- [ ] **Step 2:** Walk through every section. Confirm:
  - Hero: untouched, animations still respect reduced-motion (was already correct)
  - About: photo ghost stays static, status typer renders first entry only, dots calm
  - Selected Work: no scroll-driven RGB split, no spotlight glow on hover, hover-RGB layers don't render
  - By the Numbers: glitch fires once or not at all (existing reduced-motion guard handles it), cell hover splits at 0
  - Stack: kinetic chip cloud — chip lanes don't drift; chips render statically. (If they still drift, fix in `KineticChipCloud.tsx` by gating the `motion.div animate` on `reduced` state.)
  - Now: terminal feed renders statically (no auto-scroll). Build tile doesn't rotate (gate the `setInterval` on reduced-motion).
  - Contact: dot field stays inert, headline split at 0, rim-trace gradient frozen.

- [ ] **Step 3:** Fix any reduced-motion violations found. Each fix is a small inline change — gate animated effects on a `reduced` state read once via `matchMedia` in a `useEffect`.

---

### Task 7.3 — Performance smoke pass

- [ ] **Step 1:** With reduced-motion off, scroll the page top to bottom slowly while DevTools Performance is recording.
- [ ] **Step 2:** Confirm sustained 55+ FPS. If a section drops below, profile it. Common culprits:
  - `DotField` recomputing all 72 rects per frame — already amortized via rAF, but reduce dot count to 8×4 if needed.
  - `KineticChipCloud` doubled list creating layout thrash — switch to CSS keyframe marquee instead of Motion `animate`.
  - `SpotlightCard` proximity calc — already gated by `useMouseSpotlight`, fine.

- [ ] **Step 3:** Lighthouse run (Chrome DevTools → Lighthouse, mobile + desktop, Performance only). Confirm scores stay within 5 points of pre-redesign baseline. (If you don't have the baseline, capture one from `git stash` of all redesign changes for comparison.)

---

### Task 7.4 — Cross-browser sanity

- [ ] **Step 1:** Open in Firefox + Safari (if available). The `@property --star-angle` spinning rim trace is a known browser-coverage hotspot — confirm the rim renders and rotates. If Safari doesn't support `@property` in this version, the trace will still render statically (acceptable degradation).
- [ ] **Step 2:** Mobile/touch: open at 375×812 (iPhone) DevTools emulation. Custom cursor should auto-disable, RGB-split offsets should respect static value, kinetic chip cloud should still drift (touch is fine for it). DotField hooks should bail out via the `(hover: hover)` guard.

---

### Task 7.5 — Final commit + summary

- [ ] **Step 1:** Confirm with the user before pushing.

- [ ] **Step 2:** If any small tweaks were made during verification, commit:
  ```bash
  git add -A
  git commit -m "chore(redesign): post-verification tweaks (reduced-motion, perf)"
  ```

- [ ] **Step 3:** Summarize the redesign in one comment to the user — what shipped, any deferred items (e.g. dual-color beam if Beams refactor was skipped), any items to revisit.

---

## Spec coverage check

Quick scan of spec → plan mapping:

- §3.1 cyan tokens → Task 0.1 ✓
- §3.2 RGB-split semantic rules → Task 0.2 (`.rgb-split`, `.hover-rgb`) ✓
- §3.3 reduced-motion fallback → built into Task 0.2 + Task 7.2 ✓
- §4.1 scroll-scrub hook → Task 0.3 ✓
- §4.2 cursor-reactive hook → Task 0.4 ✓
- §4.3 2-stage hover → Task 0.2 (`.hover-rgb`) ✓
- §5.1 About: photo stack, headline, HUD strip, typer → Tasks 1.1-1.3 ✓
- §5.2 By the Numbers: cyan beam, dual glitch, cursor split → Tasks 3.1-3.3 ✓
- §5.3 Selected Work: spotlight, RGB-split headline, dual visuals, hover settles → Tasks 2.1-2.3 ✓
- §5.4 Stack: kinetic chip cloud, cyan dominance → Tasks 4.1-4.3 ✓
- §5.5 Now: status console, terminal feed → Tasks 5.1-5.4 ✓
- §5.6 Contact: dot field, RGB headline, gradient rim → Tasks 6.1-6.3 ✓
- §6.1 new shared components (RgbSplit, RgbSplitText, hooks, MagneticButton) → Tasks 0.3-0.6 ✓
- §6.2 new section subcomponents → Tasks 1.1-1.2, 2.1-2.2, 4.2, 5.2-5.3, 6.1 ✓
- §6.3 modified components → Tasks 1.3, 2.3, 3.x, 4.3, 5.4, 6.3 ✓
- §6.4 file-size discipline (extract Selected Work visuals) → Task 2.1 ✓
- §7 data flow (now/stack content extension) → Tasks 4.1, 5.1 ✓
- §8 accessibility (aria-hidden ghost layers, reduced motion) → built into Task 0.5 + Task 7.2 ✓
- §9 testing (no automated tests; visual + reduced-motion smoke) → Phase 7 ✓
- §10 rollout (per-phase commits) → Phases 0-6 commits ✓
