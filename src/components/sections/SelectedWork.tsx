"use client";

import { ProjectPanel } from "@/components/work/ProjectPanel";
import { GrokDiagram } from "@/components/work/diagrams/GrokDiagram";
import { AuraDiagram } from "@/components/work/diagrams/AuraDiagram";
import { AutoDevMockup } from "@/components/work/mockups/AutoDevMockup";
import { ChefMateMockup } from "@/components/work/mockups/ChefMateMockup";
import { BlurText } from "@/components/effects/BlurText";
import { PROJECTS } from "@/content/projects";
import type { Project } from "@/content/projects";

const VISUAL: Record<Project["visual"], React.ReactNode> = {
  grok: <GrokDiagram />,
  aura: <AuraDiagram />,
  autodev: <AutoDevMockup />,
  chefmate: <ChefMateMockup />,
};

/**
 * Section 03 — Selected Work.
 *
 * Four full-width project panels stacked vertically, NOT a 2x2 grid.
 * Visual column alternates left/right per panel for rhythm.
 */
export function SelectedWork() {
  return (
    <section
      data-section="03-selected-work"
      className="relative w-full bg-bg px-5 py-28 md:px-10 md:py-40 lg:px-20 lg:py-48"
    >
      <div className="mx-auto max-w-7xl">
        {/* section header */}
        <div className="mb-16 flex flex-wrap items-baseline justify-between gap-4 border-b border-hairline pb-5 md:mb-20">
          <BlurText as="p" className="mono-caps text-muted">
            <span className="text-accent">03 ·</span> SELECTED WORK · 4 FILES
          </BlurText>
          <BlurText as="p" delay={120} className="mono-caps text-fg/55">
            FILED · SEP 2024 — APR 2026
          </BlurText>
        </div>

        {/* big standfirst */}
        <div className="mb-20 grid grid-cols-1 gap-8 lg:mb-24 lg:grid-cols-12 lg:gap-14">
          <BlurText as="div" className="lg:col-span-7">
            <h2
              className="font-astro text-fg leading-[0.92]"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
            >
              FOUR THINGS<br />
              <span className="text-fg/35">ACTUALLY</span><br />
              <span className="text-accent">SHIPPED.</span>
            </h2>
          </BlurText>
          <BlurText
            as="p"
            delay={150}
            className="font-chakra max-w-[55ch] self-end text-fg/75 text-[15px] leading-[1.7] lg:col-span-5"
          >
            Production pipelines, hierarchical agent systems, browser-native
            runtimes, on-device ML. Built to ship, not to demo. Click any panel
            for the source.
          </BlurText>
        </div>

        {/* panels */}
        <div className="space-y-12 md:space-y-16">
          {PROJECTS.map((p, i) => (
            <ProjectPanel
              key={p.index}
              project={p}
              visual={VISUAL[p.visual]}
              reverse={i % 2 === 1}
            />
          ))}
        </div>

        {/* closing rule */}
        <div className="mt-20 flex flex-wrap items-baseline justify-between gap-3 border-t border-hairline pt-5 md:mt-28">
          <p
            className="mono-caps text-muted"
            style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace" }}
          >
            END FILE 03 / NEXT — PRODUCTION METRICS
          </p>
          <p
            className="mono-caps text-fg/45"
            style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace" }}
          >
            4 OF 4 PUBLIC
          </p>
        </div>
      </div>
    </section>
  );
}
