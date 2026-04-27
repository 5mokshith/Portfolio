"use client";

import { motion } from "motion/react";

const REVEAL_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * The framing chrome on the photo column:
 *   - vertical bronze rule between type and photo (drawn top → bottom)
 *   - year stamp "2026" in big serif italic, lower-right of photo
 *   - tiny issue stamp, upper-right
 *
 * Visible only on lg+ — at smaller sizes the photo becomes a band above
 * the type and the chrome is dropped.
 */
export function CoverFrame() {
  return (
    <>
      {/* vertical bronze rule — draws downward */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1.1, ease: REVEAL_EASE, delay: 0.55 }}
        className="origin-top pointer-events-none absolute left-0 top-10 bottom-10 z-10 hidden w-px lg:block"
        style={{ background: "var(--color-hairline-bronze)" }}
      />

      {/* upper-right issue stamp */}
      <motion.div
        initial={{ opacity: 0, x: 8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: REVEAL_EASE, delay: 1.0 }}
        className="pointer-events-none absolute right-6 top-10 z-20 hidden text-right lg:block"
      >
        <p
          className="text-[10px] tracking-[0.32em] uppercase tabular-nums"
          style={{
            fontFamily: "var(--font-declandar), ui-monospace, monospace",
            color: "var(--color-fg-muted-warm)",
          }}
        >
          Issue
        </p>
        <p
          className="mt-1 text-[10px] tracking-[0.32em] uppercase tabular-nums"
          style={{
            fontFamily: "var(--font-declandar), ui-monospace, monospace",
            color: "var(--color-gold-antique)",
          }}
        >
          № 01 / IV
        </p>
      </motion.div>

      {/* lower-right giant year stamp */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, ease: REVEAL_EASE, delay: 1.4 }}
        className="pointer-events-none absolute right-6 bottom-10 z-20 hidden lg:block"
      >
        <p
          className="text-right text-[10px] tracking-[0.32em] uppercase"
          style={{
            fontFamily: "var(--font-declandar), ui-monospace, monospace",
            color: "var(--color-fg-muted-warm)",
            marginBottom: 4,
          }}
        >
          A.D.
        </p>
        <p
          className="leading-none"
          style={{
            fontFamily: "var(--font-fraunces), ui-serif, serif",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "clamp(3rem, 6vw, 5.5rem)",
            color: "var(--color-fg-warm)",
            fontVariationSettings: "'opsz' 144",
            letterSpacing: "-0.01em",
          }}
        >
          <span style={{ color: "var(--color-red-signal)" }}>2</span>0
          <span style={{ color: "var(--color-gold-antique)" }}>2</span>6
        </p>
      </motion.div>
    </>
  );
}
