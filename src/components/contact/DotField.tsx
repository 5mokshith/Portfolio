"use client";

import { useEffect, useRef } from "react";

const COLS = 12;
const ROWS = 6;
const RADIUS = 220;

/**
 * 12×6 grid of small alternating-color dots (red on one parity, cyan on the
 * other). Cursor proximity within RADIUS px scales each dot up to 2.2× and
 * brightens opacity from 0.25 to 0.95. Imperative DOM updates via rAF —
 * no React re-renders.
 *
 * Auto-disabled on touch devices and under reduced motion.
 */
export function DotField() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const root = ref.current;
    if (!root) return;
    const dots = Array.from(root.querySelectorAll<HTMLSpanElement>("[data-dot]"));

    let mx = -9999;
    let my = -9999;
    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    const tick = () => {
      for (const d of dots) {
        const r = d.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = mx - cx;
        const dy = my - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const t = Math.max(0, 1 - dist / RADIUS);
        d.style.transform = `scale(${1 + t * 1.2})`;
        d.style.opacity = String(0.25 + t * 0.7);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const cells = Array.from({ length: COLS * ROWS }, (_, i) => i);
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 grid"
      style={{
        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
        gridTemplateRows: `repeat(${ROWS}, 1fr)`,
      }}
    >
      {cells.map((i) => {
        const isCyan = (Math.floor(i / COLS) + (i % COLS)) % 2 === 0;
        return (
          <div key={i} className="flex items-center justify-center">
            <span
              data-dot
              style={{
                display: "inline-block",
                width: 4,
                height: 4,
                borderRadius: 9999,
                background: isCyan ? "var(--cyan)" : "var(--accent)",
                opacity: 0.25,
                transition: "transform 200ms ease, opacity 200ms ease",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
