"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

type Props = {
  className?: string;
};

/**
 * Red live dot with a pulsing ring scaling 1 → 2.2 / fading 0.55 → 0
 * over 1.5s, infinite. Reduced-motion: static dot, no ring.
 */
export function PulsingDot({ className }: Props) {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  return (
    <span
      className={`relative inline-flex h-2 w-2 ${className ?? ""}`}
      aria-hidden
    >
      <span
        className="relative inline-block h-2 w-2 rounded-full"
        style={{
          background: "var(--accent)",
          boxShadow: "0 0 8px var(--accent)",
        }}
      />
      {!reduced && (
        <motion.span
          className="absolute inset-0 rounded-full"
          style={{ background: "var(--accent)" }}
          initial={{ scale: 1, opacity: 0.55 }}
          animate={{ scale: 2.2, opacity: 0 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      )}
    </span>
  );
}
