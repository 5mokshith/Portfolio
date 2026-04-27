"use client";

import { useEffect } from "react";
import { useMotionValue, useSpring } from "motion/react";

/**
 * Returns spring-smoothed (x, y) motion values that track the cursor.
 * Each call creates an independent pair so layers can have different intensities.
 *
 * Off-screen and on touch devices the values stay at 0.
 */
export function useMouseParallax(maxOffset = 10, stiffness = 80, damping = 18) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness, damping, mass: 0.6 });
  const sy = useSpring(y, { stiffness, damping, mass: 0.6 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      x.set(nx * maxOffset);
      y.set(ny * maxOffset);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [maxOffset, x, y]);

  return { x: sx, y: sy };
}
