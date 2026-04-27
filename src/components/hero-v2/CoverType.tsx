"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform } from "motion/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const REVEAL_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * Cover type — the editorial-magazine headline column.
 *
 * Stacked reveal:
 *   1. eyebrow ("MOKSHITH RAO · 01")
 *   2. four-line serif headline, line by line, mask-clip from below
 *   3. gold rule, drawn left → right
 *   4. italic serif pull-quote
 *   5. footer micro-meta (location · scroll cue)
 */
export function CoverType({
  scrollHostRef,
}: {
  scrollHostRef: React.RefObject<HTMLElement | null>;
}) {
  // scroll-out fade (no lift — editorial restraint)
  const progress = useMotionValue(0);
  const opacity = useTransform(progress, [0, 0.7, 1], [1, 0.55, 0]);
  const colRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = scrollHostRef.current;
    if (!host) return;
    const st = ScrollTrigger.create({
      trigger: host,
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => progress.set(self.progress),
    });
    return () => st.kill();
  }, [scrollHostRef, progress]);

  return (
    <motion.div
      ref={colRef}
      style={{ opacity }}
      className="relative z-20 flex h-full w-full flex-col justify-between px-6 py-10 md:px-12 md:py-14 lg:px-16 lg:py-16"
    >
      {/* ── eyebrow ────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: REVEAL_EASE, delay: 0.15 }}
        className="flex items-baseline justify-between"
      >
        <p
          className="text-[11px] tracking-[0.32em] uppercase"
          style={{
            fontFamily: "var(--font-declandar), ui-monospace, monospace",
            color: "var(--color-fg-muted-warm)",
          }}
        >
          Mokshith Rao
        </p>
        <p
          className="text-[11px] tracking-[0.32em] uppercase tabular-nums"
          style={{
            fontFamily: "var(--font-declandar), ui-monospace, monospace",
            color: "var(--color-fg-muted-warm)",
          }}
        >
          <span style={{ color: "var(--color-gold-antique)" }}>vol.</span>{" "}
          mmxxvi
        </p>
      </motion.div>

      {/* ── headline + standfirst ───────────────────────── */}
      <div className="flex-1 flex flex-col justify-center pt-12 md:pt-0">
        {/* serif display — 4 lines, each masked-reveal */}
        <h1
          className="leading-[0.92] tracking-tight"
          style={{
            fontFamily: "var(--font-fraunces), ui-serif, serif",
            fontWeight: 400,
            fontSize: "clamp(2.5rem, 7.6vw, 7rem)",
            color: "var(--color-fg-warm)",
            fontVariationSettings: "'opsz' 144, 'SOFT' 50, 'WONK' 0",
          }}
        >
          {[
            { text: "Engineer", italic: false, indent: 0 },
            { text: "who ships", italic: true, indent: 1.6 },
            { text: "distributed", italic: false, indent: 0 },
            { text: "systems", italic: false, indent: 3.2 },
          ].map((line, i) => (
            <span key={i} className="block overflow-hidden">
              <motion.span
                initial={{ y: "105%" }}
                animate={{ y: "0%" }}
                transition={{
                  duration: 0.85,
                  ease: REVEAL_EASE,
                  delay: 0.45 + i * 0.12,
                }}
                className="inline-block will-change-transform"
                style={{
                  marginLeft: `${line.indent}ch`,
                  fontStyle: line.italic ? "italic" : "normal",
                  fontWeight: line.italic ? 300 : 400,
                }}
              >
                {line.text}
              </motion.span>
            </span>
          ))}
          {/* fourth display line — & ai tooling. — last, with gold ampersand */}
          <span className="block overflow-hidden">
            <motion.span
              initial={{ y: "105%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.85, ease: REVEAL_EASE, delay: 0.93 }}
              className="inline-block will-change-transform"
              style={{ marginLeft: "0.4ch" }}
            >
              <span
                style={{
                  color: "var(--color-gold-antique)",
                  fontStyle: "italic",
                  fontWeight: 300,
                }}
              >
                &amp;
              </span>{" "}
              <span style={{ fontWeight: 400 }}>ai tooling.</span>
            </motion.span>
          </span>
        </h1>

        {/* gold rule — draws left to right */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.0, ease: REVEAL_EASE, delay: 1.25 }}
          className="origin-left mt-10 md:mt-12 h-px w-24 md:w-40"
          style={{ background: "var(--color-gold-antique)" }}
        />

        {/* italic pull-quote — fades after the rule lands */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: REVEAL_EASE, delay: 1.5 }}
          className="mt-6 max-w-[42ch] text-base md:text-lg lg:text-xl"
          style={{
            fontFamily: "var(--font-fraunces), ui-serif, serif",
            fontStyle: "italic",
            fontWeight: 300,
            fontVariationSettings: "'opsz' 14",
            color: "var(--color-fg-warm)",
            opacity: 0.86,
            lineHeight: 1.55,
          }}
        >
          I build the unglamorous half — multi-agent orchestration,
          distributed pipelines, on-device inference. Production,
          not demos.
        </motion.p>
      </div>

      {/* ── footer micro-meta ───────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 1.85 }}
        className="flex items-baseline justify-between pt-4"
        style={{
          borderTop: "1px solid var(--color-hairline-bronze)",
        }}
      >
        <p
          className="pt-3 text-[11px] tracking-[0.32em] uppercase"
          style={{
            fontFamily: "var(--font-declandar), ui-monospace, monospace",
            color: "var(--color-fg-muted-warm)",
          }}
        >
          <span style={{ color: "var(--color-gold-antique)" }}>◆</span>{" "}
          Karimnagar, IN
        </p>
        <p
          className="pt-3 text-[11px] tracking-[0.32em] uppercase tabular-nums"
          style={{
            fontFamily: "var(--font-declandar), ui-monospace, monospace",
            color: "var(--color-fg-muted-warm)",
          }}
        >
          scroll{" "}
          <span style={{ color: "var(--color-red-signal)" }}>↓</span>
        </p>
      </motion.div>
    </motion.div>
  );
}
