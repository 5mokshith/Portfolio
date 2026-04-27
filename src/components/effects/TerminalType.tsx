"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "motion/react";

type Row = {
  /** label printed left, e.g. "ROLE" */
  label: string;
  /** value printed right, e.g. "FOUNDING ENGINEER" */
  value: string;
  /** optional href — the value renders as a link with a trailing ↗ */
  href?: string;
};

type Props = {
  rows: Row[];
  /** ms per character */
  charDelay?: number;
  /** ms between rows */
  rowDelay?: number;
  /** ms the trailing cursor stays before fading */
  cursorLinger?: number;
  className?: string;
  /** width (in chars) the labels are padded to — keeps the grid clean */
  labelWidth?: number;
};

/**
 * Terminal-style readout. Each row prints label then value char-by-char,
 * then a blinking cursor parks at the end of the last line for a beat
 * before fading out. Triggers when the strip enters the viewport.
 */
export function TerminalType({
  rows,
  charDelay = 14,
  rowDelay = 90,
  cursorLinger = 2000,
  className,
  labelWidth = 12,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [counts, setCounts] = useState<number[]>(() => rows.map(() => 0));
  const [cursorVisible, setCursorVisible] = useState(true);
  const [cursorOn, setCursorOn] = useState(false);

  // pre-compute the rendered text per row (label padded + value)
  const rendered = useMemo(
    () =>
      rows.map((r) => {
        const label = (r.label + " ".repeat(labelWidth)).slice(0, labelWidth);
        return label + r.value + (r.href ? "  ↗" : "");
      }),
    [rows, labelWidth],
  );

  // schedule the typewriter pass
  useEffect(() => {
    if (!inView) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCounts(rendered.map((s) => s.length));
      setCursorOn(false);
      return;
    }

    const timeouts: number[] = [];
    let cumulative = 0;
    rendered.forEach((str, rowIdx) => {
      for (let i = 1; i <= str.length; i++) {
        const t = window.setTimeout(() => {
          setCounts((c) => {
            const next = c.slice();
            next[rowIdx] = i;
            return next;
          });
        }, cumulative + i * charDelay);
        timeouts.push(t);
      }
      cumulative += str.length * charDelay + rowDelay;
    });

    // park cursor at end of last line, then fade
    const cursorOnAt = window.setTimeout(() => setCursorOn(true), cumulative);
    const cursorOffAt = window.setTimeout(
      () => setCursorVisible(false),
      cumulative + cursorLinger,
    );
    timeouts.push(cursorOnAt, cursorOffAt);

    return () => timeouts.forEach((t) => window.clearTimeout(t));
  }, [inView, rendered, charDelay, rowDelay, cursorLinger]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        fontFamily: "var(--font-declandar), ui-monospace, monospace",
      }}
    >
      <div className="space-y-2">
        {rows.map((r, i) => {
          const slice = rendered[i].slice(0, counts[i]);
          const labelPart = slice.slice(0, labelWidth).trimEnd();
          const valuePart = slice.slice(labelWidth);
          const isLast = i === rows.length - 1;
          return (
            <div
              key={i}
              className="mono-caps grid grid-cols-[7rem_1fr] items-baseline gap-3 text-fg/80"
              style={{ minHeight: "1.2em" }}
            >
              <span className="text-muted">{labelPart}</span>
              <span className="text-fg">
                {r.href ? (
                  <a
                    href={r.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline-offset-4 hover:underline hover:text-accent transition-colors"
                  >
                    {valuePart}
                  </a>
                ) : (
                  <span>{valuePart}</span>
                )}
                {isLast && cursorVisible && (
                  <span
                    aria-hidden
                    className={`ml-1 inline-block h-[0.85em] w-[0.4em] -translate-y-px align-middle ${cursorOn ? "animate-blink" : ""}`}
                    style={{
                      background: "var(--accent)",
                      boxShadow: "0 0 6px var(--accent-glow)",
                    }}
                  />
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
