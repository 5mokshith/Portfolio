"use client";

import { useEffect, useRef, useState } from "react";
import { TIERS, type Tier } from "@/content/stack";

/**
 * Live request trace visualization. Six stack layers laid out vertically;
 * a "packet" travels down the trace (request), then back up (response),
 * looping every 8s. Each row pulses cyan when the request is passing
 * through, red on the return.
 *
 * Layers are pulled from `TIERS` and re-ordered into a request-flow that
 * actually makes sense (RUNTIME at the top, LANGUAGES as the substrate).
 *
 * Hover a row to pause the packet at that row and see the row's tools as
 * full chips. Reduced-motion: rows render statically with all tools shown.
 */
export function RequestTrace() {
  const layers = orderForTrace(TIERS);
  const [reduced, setReduced] = useState(false);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative grid grid-cols-[auto_1fr] gap-x-6"
      style={{ "--paused": hoverIdx !== null ? "paused" : "running" } as React.CSSProperties}
    >
      {/* trace rail (right side) — vertical hairline + traveling packet */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 z-10 h-full w-[2px]"
        style={{ background: "var(--hairline-cyan)" }}
      >
        {!reduced && (
          <div
            className="absolute left-1/2 -translate-x-1/2 will-change-transform"
            style={{
              width: 10,
              height: 24,
              borderRadius: 12,
              background:
                "linear-gradient(180deg, var(--cyan), rgba(0,255,157,0.2))",
              boxShadow: "0 0 18px var(--cyan-glow)",
              animation: "trace-packet 8s ease-in-out infinite",
              animationPlayState: hoverIdx !== null ? "paused" : "running",
            }}
          />
        )}
      </div>

      {layers.map((row, i) => (
        <Row
          key={row.tier.index}
          row={row}
          idx={i}
          total={layers.length}
          reduced={reduced}
          isHovered={hoverIdx === i}
          isAnyHovered={hoverIdx !== null}
          onEnter={() => setHoverIdx(i)}
          onLeave={() => setHoverIdx(null)}
        />
      ))}
    </div>
  );
}

type TraceRow = {
  tier: Tier;
  /** stage label override — tier.name is the column heading */
  stage: string;
};

/**
 * Re-order TIERS into a logical request flow:
 * RUNTIME → APP → INFRA → DATA → AI/ML → LANGUAGES (substrate at bottom).
 */
function orderForTrace(tiers: Tier[]): TraceRow[] {
  const byIndex = (idx: string) => tiers.find((t) => t.index === idx)!;
  return [
    { tier: byIndex("L02"), stage: "CLIENT / RUNTIME" },
    { tier: byIndex("L05"), stage: "APP / FRAMEWORK" },
    { tier: byIndex("L03"), stage: "INFRA" },
    { tier: byIndex("L04"), stage: "DATA" },
    { tier: byIndex("L06"), stage: "AI / ML" },
    { tier: byIndex("L01"), stage: "LANGUAGES — SUBSTRATE" },
  ];
}

function Row({
  row,
  idx,
  total,
  reduced,
  isHovered,
  isAnyHovered,
  onEnter,
  onLeave,
}: {
  row: TraceRow;
  idx: number;
  total: number;
  reduced: boolean;
  isHovered: boolean;
  isAnyHovered: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  // Each row's pulse animation starts at a stagger keyed to its position.
  const stage = `${(idx / total) * 50}%`;
  const reverseStage = `${100 - (idx / total) * 50}%`;
  return (
    <>
      {/* index column */}
      <div
        className="mono-caps text-fg/40 pt-5"
        style={{
          fontFamily: "var(--font-declandar), ui-monospace, monospace",
          fontSize: 10,
        }}
      >
        {String(idx + 1).padStart(2, "0")}
      </div>

      {/* row content */}
      <div
        onPointerEnter={onEnter}
        onPointerLeave={onLeave}
        className="relative cursor-default border-b py-5"
        style={{
          borderColor: "var(--hairline-cyan)",
          ["--stage" as string]: stage,
          ["--reverse-stage" as string]: reverseStage,
        }}
      >
        {/* row pulse overlay — cyan on request pass, red on response */}
        {!reduced && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              animation: `trace-row-pulse 8s ease-in-out infinite`,
              animationDelay: `calc(${stage} * -0.08)`,
              animationPlayState: isAnyHovered && !isHovered ? "paused" : "running",
              opacity: isHovered ? 1 : 0.6,
              background: isHovered
                ? "linear-gradient(90deg, transparent 0%, rgba(0,255,157,0.08) 50%, transparent 100%)"
                : undefined,
            }}
          />
        )}

        <div className="relative flex flex-wrap items-baseline gap-x-5 gap-y-2">
          <div className="min-w-[180px]">
            <p
              className="mono-caps"
              style={{
                fontFamily: "var(--font-declandar), ui-monospace, monospace",
                color: "var(--cyan)",
                fontSize: 11,
              }}
            >
              {row.stage}
            </p>
            <h3
              className="font-astro mt-0.5 text-fg leading-tight"
              style={{ fontSize: "clamp(1.1rem, 1.6vw, 1.4rem)" }}
            >
              {row.tier.name}
            </h3>
          </div>

          <ul className="flex flex-wrap items-baseline gap-x-2 gap-y-1.5">
            {row.tier.tools.map((t) => (
              <li
                key={t.name}
                className="mono-caps inline-flex items-baseline gap-1.5 border px-2 py-0.5 text-fg/80"
                style={{
                  fontFamily: "var(--font-declandar), ui-monospace, monospace",
                  fontSize: 10,
                  borderColor: "var(--hairline-cyan)",
                  background: "var(--bg)",
                }}
              >
                <span>{t.name}</span>
                {isHovered && (
                  <span style={{ color: "var(--cyan)", opacity: 0.7, fontSize: 9 }}>
                    · {t.role}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
