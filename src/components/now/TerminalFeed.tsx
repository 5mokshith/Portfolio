"use client";

import { useEffect, useRef, useState } from "react";
import type { TerminalEntry } from "@/content/now";

/**
 * Auto-scrolling tail -f style feed. Renders the entries inside a
 * fixed-height container and crawls upward continuously via rAF, looping
 * seamlessly by halving the doubled-list when it reaches the bottom.
 *
 * Pauses on hover. Reduced-motion: feed renders statically, no scroll.
 */
export function TerminalFeed({ entries }: { entries: TerminalEntry[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reduced || paused) return;
    const el = containerRef.current;
    if (!el) return;
    let raf = 0;
    let last = performance.now();
    const speedPxPerMs = 0.025;

    const tick = (t: number) => {
      const dt = t - last;
      last = t;
      el.scrollTop += speedPxPerMs * dt;
      if (el.scrollTop >= el.scrollHeight / 2) {
        el.scrollTop = 0;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced, paused]);

  const doubled = [...entries, ...entries];

  return (
    <div
      ref={containerRef}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      className="relative max-h-[280px] overflow-hidden border bg-black/60 p-5 text-[12.5px] leading-[1.7]"
      style={{
        borderColor: "var(--hairline-cyan)",
        fontFamily: "var(--font-declandar), ui-monospace, monospace",
      }}
    >
      {/* gradient masks for fade in/out */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-10 bg-gradient-to-b from-black to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-10 bg-gradient-to-t from-black to-transparent"
      />
      <div className="relative z-0 space-y-1.5">
        {doubled.map((e, i) => (
          <div key={i} className="flex gap-3">
            <span style={{ color: "var(--cyan)", opacity: 0.85, minWidth: 48 }}>
              {e.time}
            </span>
            <span
              style={{
                color:
                  e.level === "err"
                    ? "var(--accent)"
                    : e.level === "ok"
                    ? "#9aff7a"
                    : "var(--fg)",
                opacity: 0.6,
                minWidth: 56,
              }}
            >
              [{e.level}]
            </span>
            <span style={{ color: "var(--fg)", opacity: 0.85 }}>{e.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
