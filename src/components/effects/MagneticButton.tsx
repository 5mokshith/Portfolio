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
