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
  const background = useTransform([px, py], (v) => {
    const arr = v as number[];
    return `radial-gradient(circle 280px at ${arr[0]}% ${arr[1]}%, rgba(0,229,255,0.18), transparent 70%)`;
  });

  return (
    <motion.div ref={ref} className={`relative ${className ?? ""}`}>
      {children}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-30"
        style={{
          opacity,
          background,
          mixBlendMode: "screen",
        }}
      />
    </motion.div>
  );
}
