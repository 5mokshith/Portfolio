"use client";

import { StackTier } from "@/components/stack/StackTier";
import { TIERS } from "@/content/stack";

/**
 * Outer frame for the six-tier stack. Hairline border on all sides, shared
 * dividers between tiers (no gap), CAD-style L-tick marks at the four outer
 * corners.
 *
 * Stagger sequencing: TIERS is authored top-down (L06 → L01), but the
 * reveal goes bottom-up — the foundation tier appears first, then each
 * higher tier stacks on top of it. We invert the per-tier delay accordingly.
 */

const STAGGER_STEP_MS = 130;

export function StackDiagram() {
  return (
    <div className="relative">
      {/* CAD corner ticks — purely decorative */}
      <CornerTick className="-left-1 -top-1" rotate={0} />
      <CornerTick className="-right-1 -top-1" rotate={90} />
      <CornerTick className="-right-1 -bottom-1" rotate={180} />
      <CornerTick className="-left-1 -bottom-1" rotate={270} />

      <div className="divide-y divide-hairline border border-hairline">
        {TIERS.map((tier, i) => {
          // L01 (last in array, bottom of visual) animates first.
          const reveal = (TIERS.length - 1 - i) * STAGGER_STEP_MS;
          return (
            <StackTier
              key={tier.index}
              tier={tier}
              revealDelayMs={reveal}
            />
          );
        })}
      </div>
    </div>
  );
}

function CornerTick({
  className = "",
  rotate = 0,
}: {
  className?: string;
  rotate?: number;
}) {
  return (
    <svg
      aria-hidden
      width="18"
      height="18"
      viewBox="0 0 18 18"
      style={{ transform: `rotate(${rotate}deg)` }}
      className={`pointer-events-none absolute ${className}`}
    >
      <path
        d="M1 8 L1 1 L8 1"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.25"
        strokeLinecap="square"
        opacity="0.85"
      />
    </svg>
  );
}
