"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { ALL_TOOLS, type Tool } from "@/content/stack";

const LANE_DURATIONS = [22, 30, 38] as const; // seconds, lane 0..2 (slower → calmer)
const LANE_DIRECTIONS = [-1, 1, -1] as const; // 1 = left→right, -1 = right→left

/**
 * Three horizontal lanes of tool chips drifting at different speeds and
 * directions. Hover anywhere over a lane pauses just that lane. Click a
 * chip to expand its role caption. Each chip composes the .hover-rgb
 * micro-interaction settling cyan (secondary).
 *
 * Reduced-motion: lanes render statically (no drift), all chips visible.
 */
export function KineticChipCloud() {
  const lanes = useMemo<Tool[][]>(() => {
    const out: Tool[][] = [[], [], []];
    for (const t of ALL_TOOLS) out[t.lane]!.push(t);
    return out;
  }, []);

  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  return (
    <div className="space-y-4">
      {lanes.map((tools, i) => (
        <Lane
          key={i}
          tools={tools}
          duration={LANE_DURATIONS[i]!}
          direction={LANE_DIRECTIONS[i]!}
          reduced={reduced}
        />
      ))}
    </div>
  );
}

function Lane({
  tools,
  duration,
  direction,
  reduced,
}: {
  tools: Tool[];
  duration: number;
  direction: 1 | -1;
  reduced: boolean;
}) {
  const [paused, setPaused] = useState(false);
  // Doubled list so the marquee loops seamlessly via -50% translate.
  const doubled = [...tools, ...tools];

  if (reduced) {
    return (
      <div className="flex flex-wrap gap-3">
        {tools.map((t) => (
          <Chip key={t.name} tool={t} />
        ))}
      </div>
    );
  }

  return (
    <div
      className="relative overflow-hidden"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      <motion.div
        className="flex gap-3"
        animate={
          paused
            ? { x: undefined }
            : { x: direction === 1 ? ["0%", "-50%"] : ["-50%", "0%"] }
        }
        transition={{ duration, ease: "linear", repeat: Infinity }}
      >
        {doubled.map((t, idx) => (
          <Chip key={`${t.name}-${idx}`} tool={t} />
        ))}
      </motion.div>
    </div>
  );
}

function Chip({ tool }: { tool: Tool }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      onClick={() => setOpen((o) => !o)}
      data-rgb-text={tool.name}
      data-rgb-settle="cyan"
      className="hover-rgb mono-caps inline-flex shrink-0 items-baseline gap-2 border px-3 py-1.5 text-fg/85"
      style={{
        fontFamily: "var(--font-declandar), ui-monospace, monospace",
        fontSize: 11,
        borderColor: open ? "var(--cyan)" : "var(--hairline-cyan)",
        background: "var(--bg)",
      }}
    >
      <span>{tool.name}</span>
      <span
        style={{
          color: open ? "var(--cyan)" : "var(--fg)",
          opacity: open ? 0.85 : 0.5,
          fontSize: 9,
        }}
      >
        · {open ? tool.role : "▸"}
      </span>
    </button>
  );
}
