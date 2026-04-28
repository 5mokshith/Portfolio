"use client";

import {
  useScroll,
  useTransform,
  useMotionValue,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
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
 * Under `prefers-reduced-motion: reduce`, returns a frozen MotionValue at 0 so
 * any consumer (`useTransform`, `useScrubLinear`, `useScrubPeak`, raw reads)
 * sees a static value and produces no animation. CSS-driven RGB-split offsets
 * are also collapsed by the global guard in `globals.css`.
 */
export function useScrollScrub<T extends HTMLElement>(
  ref: RefObject<T | null>,
  options: ScrubOptions = {},
): MotionValue<number> {
  const { offsetStart = "start end", offsetEnd = "end start" } = options;
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [offsetStart, offsetEnd],
  });
  const frozen = useMotionValue(0);
  return reduced === true ? frozen : scrollYProgress;
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
