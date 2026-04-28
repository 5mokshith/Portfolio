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
