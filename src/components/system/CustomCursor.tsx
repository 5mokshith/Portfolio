"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

/**
 * Iron-Man arc-reactor crosshair cursor.
 *  - Red `+` glyph rendered via two thin lines + a center dot.
 *  - Spring-lagged for slight weight.
 *  - Hidden on touch devices (no pointer:fine).
 *  - Scales up + glows over interactive elements.
 */
export function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 600, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 600, damping: 40, mass: 0.4 });

  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [down, setDown] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as HTMLElement | null;
      const interactive = !!t?.closest('a, button, [role="button"], [data-cursor="hover"]');
      setHovering(interactive);
    };
    const downHandler = () => setDown(true);
    const upHandler = () => setDown(false);

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", downHandler);
    window.addEventListener("pointerup", upHandler);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", downHandler);
      window.removeEventListener("pointerup", upHandler);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed left-0 top-0 z-[80] -translate-x-1/2 -translate-y-1/2"
    >
      <motion.div
        animate={{
          scale: down ? 0.8 : hovering ? 1.6 : 1,
          opacity: down ? 1 : hovering ? 1 : 0.85,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="relative h-6 w-6"
      >
        {/* outer ring on hover */}
        <span
          className="absolute inset-0 rounded-full"
          style={{
            boxShadow: hovering
              ? "0 0 14px 1px rgba(255,45,45,0.55), inset 0 0 0 1px rgba(255,45,45,0.6)"
              : "0 0 0 0 rgba(255,45,45,0)",
            transition: "box-shadow 200ms ease",
          }}
        />
        {/* horizontal arm */}
        <span
          className="absolute left-1/2 top-1/2 h-px w-full -translate-x-1/2 -translate-y-1/2"
          style={{ background: "var(--accent)" }}
        />
        {/* vertical arm */}
        <span
          className="absolute left-1/2 top-1/2 h-full w-px -translate-x-1/2 -translate-y-1/2"
          style={{ background: "var(--accent)" }}
        />
        {/* center dot */}
        <span
          className="absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background: "var(--accent)",
            boxShadow: "0 0 8px rgba(255,45,45,0.85)",
          }}
        />
      </motion.div>
    </motion.div>
  );
}
