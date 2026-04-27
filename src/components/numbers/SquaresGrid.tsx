"use client";

import { useId } from "react";

/**
 * Faint red grid pattern. Used behind 99.99% — masked toward the bottom-right
 * so the grid fades out as the eye moves into the digits. Static SVG; no JS.
 */
export function SquaresGrid() {
  const id = useId();
  const patternId = `squares-${id}`;
  const maskId = `squares-mask-${id}`;
  const gradId = `squares-grad-${id}`;
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      <defs>
        <pattern
          id={patternId}
          width={28}
          height={28}
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 28 0 L 0 0 0 28"
            fill="none"
            stroke="rgba(255,45,45,0.28)"
            strokeWidth="0.5"
          />
        </pattern>
        <radialGradient
          id={gradId}
          cx="100%"
          cy="100%"
          r="120%"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="white" stopOpacity="0.85" />
          <stop offset="60%" stopColor="white" stopOpacity="0.25" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id={maskId}>
          <rect width="100%" height="100%" fill={`url(#${gradId})`} />
        </mask>
      </defs>
      <rect
        width="100%"
        height="100%"
        fill={`url(#${patternId})`}
        mask={`url(#${maskId})`}
      />
    </svg>
  );
}
