"use client";

import { motion } from "motion/react";
import type { Tier, Tool } from "@/content/stack";

/**
 * One tier in the stack diagram.
 *
 * Two-column layout (desktop): meta block on the left (~28%), pill row on
 * the right (~72%). On mobile the meta block stacks above the pill row.
 *
 * The tier reveals as a unit on scroll-into-view; pills inside do NOT
 * stagger individually — adding per-pill stagger on top of per-tier stagger
 * reads as fidgety.
 *
 * Pill internals are rendered inline here (no ToolPill file). The pill is
 * small enough that extracting it would make the component graph noisier
 * without buying anything.
 */
export function StackTier({
  tier,
  revealDelayMs,
}: {
  tier: Tier;
  /** ms to wait before this tier fades in. Set externally so the diagram
   *  can sequence the bottom-up stack-in. */
  revealDelayMs: number;
}) {
  return (
    <motion.section
      aria-labelledby={`tier-${tier.index}`}
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: 0.7,
        delay: revealDelayMs / 1000,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="grid grid-cols-1 gap-6 px-6 py-7 md:grid-cols-[28%_1fr] md:items-center md:gap-8 md:px-8 md:py-8 md:min-h-[140px] lg:px-10"
    >
      {/* left meta */}
      <div className="flex flex-col gap-2">
        <p
          className="mono-caps text-fg/40"
          style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace" }}
        >
          {tier.index}
        </p>
        <h3
          id={`tier-${tier.index}`}
          className="font-astro text-fg leading-[0.95]"
          style={{ fontSize: "clamp(1.25rem, 2.5vw, 2.25rem)" }}
        >
          {tier.name}
        </h3>
        <div className="mt-1 flex flex-wrap items-baseline gap-3">
          <span
            className="mono-caps text-fg/55"
            style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace" }}
          >
            {tier.tools.length} ENTR{tier.tools.length === 1 ? "Y" : "IES"}
          </span>
          <span
            className="mono-caps text-muted"
            style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace" }}
          >
            <span className="text-accent">{tier.roleLine.slice(0, 2)}</span>
            {tier.roleLine.slice(2)}
          </span>
        </div>
      </div>

      {/* right pill row */}
      <div className="flex flex-wrap gap-2.5 md:gap-3">
        {tier.tools.map((tool) => (
          <ToolPill key={tool.name} tool={tool} />
        ))}
      </div>
    </motion.section>
  );
}

/**
 * Hairline-bordered pill. Renders both the name and the role hint stacked
 * in a single CSS grid cell — they share `grid-area: 1 / 1` so the pill
 * auto-sizes to the wider of the two labels. Only one is visible at a time
 * via opacity, so hover/focus does not reflow the row.
 *
 * The pill is a real <button> so keyboard users get :focus-visible parity
 * with hover. aria-label always carries both name and role for AT users,
 * since hover is undefined on touch.
 */
function ToolPill({ tool }: { tool: Tool }) {
  return (
    <button
      type="button"
      aria-label={`${tool.name} — ${tool.role}`}
      className="group relative grid place-items-center rounded-[4px] border border-hairline bg-bg/40 px-3 py-1.5 text-fg/85 transition-colors duration-200 hover:border-accent/70 focus-visible:border-accent/70 focus-visible:outline-none"
    >
      <span
        aria-hidden
        style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace" }}
        className="col-start-1 row-start-1 mono-caps whitespace-nowrap opacity-100 transition-opacity duration-200 group-hover:opacity-0 group-focus-visible:opacity-0"
      >
        {tool.name}
      </span>
      <span
        aria-hidden
        style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace" }}
        className="col-start-1 row-start-1 mono-caps whitespace-nowrap text-accent opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        {tool.role}
      </span>
    </button>
  );
}
