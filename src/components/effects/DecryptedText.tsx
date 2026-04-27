"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "motion/react";

type Props = {
  text: string;
  /** total animation duration in ms */
  duration?: number;
  /** delay before the animation begins in ms */
  delay?: number;
  /** characters used during the cipher reveal */
  charset?: string;
  /** retrigger when the element enters the viewport */
  triggerOnInView?: boolean;
  /** className passed straight to the rendered span */
  className?: string;
  /** ARIA label override; defaults to the final text */
  ariaLabel?: string;
};

const DEFAULT_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*<>{}/\\";

/**
 * Per-character cipher reveal. Letters cycle through random glyphs from
 * left-to-right and lock into the target string. Whitespace and punctuation
 * pass through untouched. Honors prefers-reduced-motion.
 *
 * Implementation note: the rAF loop intentionally does NOT cancel on effect
 * cleanup (it only checks `cancelledRef` set on unmount). React would
 * otherwise cancel the loop when `useInView` flips from false → true mid-run.
 */
export function DecryptedText({
  text,
  duration = 1100,
  delay = 0,
  charset = DEFAULT_CHARSET,
  triggerOnInView = false,
  className,
  ariaLabel,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [output, setOutput] = useState(text);
  const startedRef = useRef(false);
  const cancelledRef = useRef(false);

  // unmount guard: stop the loop when the component leaves
  useEffect(() => () => {
    cancelledRef.current = true;
  }, []);

  const indices = useMemo(() => {
    const out: number[] = [];
    for (let i = 0; i < text.length; i++) {
      if (/\S/.test(text[i])) out.push(i);
    }
    return out;
  }, [text]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOutput(text);
      return;
    }
    if (triggerOnInView && !inView) return;
    if (startedRef.current) return;
    startedRef.current = true;

    const lockTimes = indices.map(
      (_, k) => delay + (k / Math.max(indices.length - 1, 1)) * duration * 0.7,
    );
    const finishAt = delay + duration;
    const start = performance.now();

    const tick = (now: number) => {
      if (cancelledRef.current) return;
      const t = now - start;
      const next = text.split("");
      for (let k = 0; k < indices.length; k++) {
        const idx = indices[k];
        if (t >= lockTimes[k]) {
          next[idx] = text[idx];
        } else if (t >= delay) {
          next[idx] = charset[(Math.random() * charset.length) | 0];
        }
        // before delay: leave the literal char in place — keeps layout stable
      }
      setOutput(next.join(""));
      if (t < finishAt) {
        requestAnimationFrame(tick);
      } else {
        setOutput(text);
      }
    };
    requestAnimationFrame(tick);
  }, [text, charset, duration, delay, indices, triggerOnInView, inView]);

  return (
    <span ref={ref} className={className} aria-label={ariaLabel ?? text}>
      <span aria-hidden>{output}</span>
    </span>
  );
}
