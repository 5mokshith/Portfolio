"use client";

import { useRef, type ReactNode } from "react";
import { motion, useTransform } from "motion/react";
import { useMouseSpotlight } from "@/lib/useMouseSpotlight";

type SpotlightCardProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Cursor-tracking radial spotlight overlay. Position is expressed in px
 * offsets from the element center (`calc(50% + Xpx)`), so we never read
 * `getBoundingClientRect()` on the move path — the hook already caches the
 * rect for proximity, and we just reuse its center-relative x/y.
 */
export function SpotlightCard({ children, className }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { x, y, proximity } = useMouseSpotlight(ref, { falloff: 420 });
  const opacity = useTransform(proximity, [0, 1], [0, 0.55]);
  const background = useTransform([x, y], (v) => {
    const arr = v as number[];
    return `radial-gradient(circle 280px at calc(50% + ${arr[0]}px) calc(50% + ${arr[1]}px), rgba(0,229,255,0.18), transparent 70%)`;
  });

  return (
    <motion.div ref={ref} className={`relative ${className ?? ""}`}>
      {children}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-30"
        style={{ opacity, background, mixBlendMode: "screen" }}
      />
    </motion.div>
  );
}
