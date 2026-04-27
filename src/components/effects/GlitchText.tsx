"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useInView } from "motion/react";

type Props = {
  children: ReactNode;
  /** className passed straight to the wrapping span */
  className?: string;
  /** ms the entry glitch pass lasts */
  entryDuration?: number;
  /** ms between idle micro-glitches; 0 disables idle */
  idleInterval?: number;
  /** ms each idle micro-glitch lasts */
  idleDuration?: number;
};

/**
 * Chromatic-aberration glitch on text. Two stacked offset copies (red + white)
 * appear and run a clip-path scan during a glitch burst. Entry pass triggers
 * once on viewport entry; small idle ticks repeat every `idleInterval` ms.
 *
 * Reduced-motion: renders flat text only, no entry / idle animation.
 */
export function GlitchText({
  children,
  className,
  entryDuration = 600,
  idleInterval = 8000,
  idleDuration = 200,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [glitching, setGlitching] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // entry pass
  useEffect(() => {
    if (!inView || reduced) return;
    setGlitching(true);
    const t = window.setTimeout(() => setGlitching(false), entryDuration);
    return () => window.clearTimeout(t);
  }, [inView, reduced, entryDuration]);

  // idle ticks
  useEffect(() => {
    if (!inView || reduced || idleInterval <= 0) return;
    const interval = window.setInterval(() => {
      setGlitching(true);
      window.setTimeout(() => setGlitching(false), idleDuration);
    }, idleInterval);
    return () => window.clearInterval(interval);
  }, [inView, reduced, idleInterval, idleDuration]);

  return (
    <span ref={ref} className={`relative inline-block ${className ?? ""}`}>
      <span className="relative z-10">{children}</span>
      {glitching && (
        <>
          <span
            aria-hidden
            className="glitch-layer glitch-layer-red"
            style={{ color: "var(--accent)" }}
          >
            {children}
          </span>
          <span
            aria-hidden
            className="glitch-layer glitch-layer-white"
            style={{ color: "var(--fg)" }}
          >
            {children}
          </span>
        </>
      )}
    </span>
  );
}
