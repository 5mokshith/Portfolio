"use client";

import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** ms for one full lap of the rim trace */
  duration?: number;
  className?: string;
};

/**
 * Animated red rim trace. A bright accent dot orbits a 1px hairline-red
 * border via a conic-gradient masked rim. The inner element renders the
 * actual button content on a solid bg disc, so the trace appears to glow
 * along the edge only.
 *
 * Reduced-motion: rim is static red hairline (no orbiting trace).
 */
export function StarBorder({ children, duration = 3500, className }: Props) {
  return (
    <span
      className={`relative inline-block rounded-sm ${className ?? ""}`}
      style={
        {
          padding: "1px",
          background:
            "conic-gradient(from var(--star-angle, 0deg), rgba(255,45,45,0.05) 0deg, var(--accent) 60deg, rgba(255,45,45,0.05) 120deg, rgba(255,45,45,0.05) 360deg)",
          animation: "starBorderSpin 3.5s linear infinite",
          // override duration via CSS var without changing the animation name
          animationDuration: `${duration}ms`,
          boxShadow: "0 0 16px rgba(255, 45, 45, 0.25)",
        } as React.CSSProperties
      }
    >
      <span
        className="block rounded-sm"
        style={{ background: "var(--bg)" }}
      >
        {children}
      </span>
    </span>
  );
}
