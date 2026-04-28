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
 */
export function StatusTyper({ entries, intervalMs = 4000, typeMs = 28 }: StatusTyperProps) {
  const [idx, setIdx] = useState(0);
  const [shown, setShown] = useState("");
  const [phase, setPhase] = useState<"typing" | "hold" | "erasing">("typing");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(entries[0]?.value ?? "");
      return;
    }
    const target = entries[idx]?.value ?? "";
    if (phase === "typing") {
      if (shown.length < target.length) {
        const t = setTimeout(() => setShown(target.slice(0, shown.length + 1)), typeMs);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setPhase("hold"), intervalMs);
      return () => clearTimeout(t);
    }
    if (phase === "hold") {
      const t = setTimeout(() => setPhase("erasing"), 0);
      return () => clearTimeout(t);
    }
    if (phase === "erasing") {
      if (shown.length > 0) {
        const t = setTimeout(() => setShown(shown.slice(0, -1)), typeMs / 2);
        return () => clearTimeout(t);
      }
      setIdx((i) => (i + 1) % entries.length);
      setPhase("typing");
    }
  }, [shown, phase, idx, entries, intervalMs, typeMs]);

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
