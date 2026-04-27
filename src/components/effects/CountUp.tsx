"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "motion/react";

type Props = {
  /** target number to count up to */
  value: number;
  /** decimals on display (e.g. 2 for 99.99) */
  decimals?: number;
  /** count duration in ms */
  duration?: number;
  /** ms to wait after viewport entry before starting */
  delay?: number;
  /** className on the wrapping span */
  className?: string;
  /** ratio of element visible before triggering */
  amount?: number;
};

const formatter = (decimals: number) =>
  new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

/**
 * Count up from 0 → `value` once the element scrolls into view.
 * Uses an exponential ease-out so the number lands cleanly without overshoot.
 * Honors prefers-reduced-motion (snaps straight to the final value).
 */
export function CountUp({
  value,
  decimals = 0,
  duration = 1500,
  delay = 0,
  className,
  amount = 0.4,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount });
  const [display, setDisplay] = useState(() => formatter(decimals).format(0));
  const startedRef = useRef(false);

  useEffect(() => {
    if (!inView) return;
    if (startedRef.current) return;
    startedRef.current = true;

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setDisplay(formatter(decimals).format(value));
      return;
    }

    const fmt = formatter(decimals);
    const controls = animate(0, value, {
      duration: duration / 1000,
      delay: delay / 1000,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(fmt.format(v)),
    });
    return () => controls.stop();
  }, [inView, value, decimals, duration, delay]);

  return (
    <span ref={ref} className={className} aria-label={String(value)}>
      <span aria-hidden>{display}</span>
    </span>
  );
}
