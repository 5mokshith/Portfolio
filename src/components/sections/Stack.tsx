"use client";

import { BlurText } from "@/components/effects/BlurText";
import { StackDiagram } from "@/components/stack/StackDiagram";
import { TIERS, TOTAL_ENTRIES } from "@/content/stack";

/**
 * Section 05 — STACK.
 *
 * Capability map of the tools in the workbench. Six tiers, bottom-up.
 * Header strip + standfirst + diagram + closing rule, matching the file/
 * dossier vocabulary set by sections 02–04. Diagram body is delegated to
 * StackDiagram; this component owns only the section frame.
 */
export function Stack() {
  return (
    <section
      data-section="05-stack"
      className="relative w-full bg-bg px-5 py-28 md:px-10 md:py-40 lg:px-20 lg:py-48"
    >
      <div className="mx-auto max-w-7xl">
        {/* section header */}
        <div className="mb-14 flex flex-wrap items-baseline justify-between gap-4 border-b border-hairline pb-5 md:mb-16">
          <BlurText as="p" className="mono-caps text-muted">
            <span className="text-accent">05 ·</span> STACK · {TIERS.length} LAYERS
          </BlurText>
          <BlurText as="p" delay={120} className="mono-caps text-fg/55">
            FILE 05 / WORKBENCH
          </BlurText>
        </div>

        {/* big standfirst */}
        <div className="mb-16 grid grid-cols-1 gap-8 lg:mb-20 lg:grid-cols-12 lg:gap-14">
          <BlurText as="div" className="lg:col-span-7">
            <h2
              className="font-astro text-fg leading-[0.92]"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
            >
              SIX LAYERS,<br />
              ONE<br />
              <span className="text-accent">WORKBENCH.</span>
            </h2>
          </BlurText>
          <BlurText
            as="p"
            delay={150}
            className="font-chakra max-w-[55ch] self-end text-fg/75 text-[15px] leading-[1.7] lg:col-span-5"
          >
            Tools I reach for, not tutorials I&apos;ve finished. Foundation up
            — languages, runtime, infra, data, app, AI.
          </BlurText>
        </div>

        {/* diagram */}
        <StackDiagram />

        {/* closing rule */}
        <div className="mt-20 flex flex-wrap items-baseline justify-between gap-3 border-t border-hairline pt-5 md:mt-28">
          <p
            className="mono-caps text-muted"
            style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace" }}
          >
            END FILE 05 / NEXT — NOW
          </p>
          <p
            className="mono-caps text-fg/45"
            style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace" }}
          >
            {TIERS.length} LAYERS · {TOTAL_ENTRIES} ENTRIES
          </p>
        </div>
      </div>
    </section>
  );
}
