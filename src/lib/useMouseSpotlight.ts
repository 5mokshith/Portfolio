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
 *
 * Rect caching: the element's bounding rect is cached and only recomputed
 * when (a) a ResizeObserver fires (size change) or (b) window scroll/resize
 * fires (position change). All recomputes are rAF-throttled so a fast
 * scroll triggers at most one rect read per frame. The first rect read
 * happens lazily on mount inside the initial scheduled rAF — this avoids
 * doing a layout read synchronously during effect setup.
 *
 * `pointermove` itself never calls getBoundingClientRect; it reads the
 * cached center coordinates.
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

    let cx = 0;
    let cy = 0;
    let hasRect = false;
    let rafId: number | null = null;

    const recomputeRect = () => {
      rafId = null;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      cx = rect.left + rect.width / 2;
      cy = rect.top + rect.height / 2;
      hasRect = true;
    };

    const scheduleRecompute = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(recomputeRect);
    };

    // Lazy first read — scheduled rather than synchronous.
    scheduleRecompute();

    const onMove = (e: PointerEvent) => {
      if (!hasRect) return;
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

    let ro: ResizeObserver | null = null;
    const el = ref.current;
    if (el && typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(scheduleRecompute);
      ro.observe(el);
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave, { passive: true });
    window.addEventListener("scroll", scheduleRecompute, { passive: true });
    window.addEventListener("resize", scheduleRecompute, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", scheduleRecompute);
      window.removeEventListener("resize", scheduleRecompute);
      if (ro) ro.disconnect();
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [ref, falloff, x, y, distance, rawProximity]);

  return { x, y, proximity, distance };
}
