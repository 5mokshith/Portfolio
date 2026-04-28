"use client";

import { useEffect, useState } from "react";

type StatusTyperProps = {
  /** rotating list of {label, value} pairs */
  entries: { label: string; value: string }[];
  /** ms between rotation. Default 4000. */
  intervalMs?: number;
  /** ms per typed character. Default 28. */
  typeMs?: number;
};

/**
 * Terminal-style typed readout — rotates through entries, types each `value`
 * out character-by-character, then idles, then erases and types the next one.
 * Cyan caret. Respects reduced motion (renders the first entry statically).
 *
 * Each phase (type → hold → erase → next) is driven by its own timeout
 * callback. A single `cancelled` flag in the effect's cleanup prevents any
 * pending callback from firing after unmount or after `idx` advances.
 */
export function StatusTyper({ entries, intervalMs = 4000, typeMs = 28 }: StatusTyperProps) {
  const [idx, setIdx] = useState(0);
  const [shown, setShown] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(entries[0]?.value ?? "");
      return;
    }

    const target = entries[idx]?.value ?? "";
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const schedule = (fn: () => void, ms: number) => {
      timer = setTimeout(() => {
        if (cancelled) return;
        fn();
      }, ms);
    };

    const type = (i: number) => {
      if (cancelled) return;
      if (i <= target.length) {
        setShown(target.slice(0, i));
        if (i < target.length) {
          schedule(() => type(i + 1), typeMs);
        } else {
          // hold, then erase
          schedule(() => erase(target.length), intervalMs);
        }
      }
    };

    const erase = (i: number) => {
      if (cancelled) return;
      if (i > 0) {
        const next = i - 1;
        setShown(target.slice(0, next));
        schedule(() => erase(next), typeMs / 2);
      } else {
        setIdx((current) => (current + 1) % entries.length);
      }
    };

    // Reset shown so a new entry types from empty.
    setShown("");
    schedule(() => type(1), typeMs);

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [idx, entries, intervalMs, typeMs]);

  const current = entries[idx];

  return (
    <div className="font-chakra text-[14px] leading-[1.6] text-fg/70">
      <span className="mono-caps mr-2 text-cyan" style={{ color: "var(--cyan)", fontFamily: "var(--font-declandar), ui-monospace, monospace" }}>
        {current?.label.toUpperCase()} ›
      </span>
      <span>{shown}</span>
      <span className="animate-blink" style={{ color: "var(--cyan)" }}>▌</span>
    </div>
  );
}
