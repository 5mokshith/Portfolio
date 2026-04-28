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
