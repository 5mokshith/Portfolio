"use client";

import { motion } from "motion/react";
import { BlurText } from "@/components/effects/BlurText";
import { GlitchText } from "@/components/effects/GlitchText";
import { DecryptedText } from "@/components/effects/DecryptedText";
import { RgbSplitText } from "@/components/effects";
import { SpotlightCard } from "@/components/work/SpotlightCard";
import { VideoFrame, CubesVisual, DataArtVisual, ScreenshotVisual } from "@/components/work/visuals";
import { PROJECTS, type Project } from "@/content/projects";

/**
 * Per-project video sources. Drop screen recordings at these public paths
 * — the VideoFrame handles overlay treatment and renders a placeholder
 * with the same overlays when the file is missing.
 */
const PROJECT_VIDEO: Record<string, { src?: string; label: string; caption?: string; intensity?: "default" | "heavy" }> = {
  AURA: {
    src: "/work/aura.mp4",
    label: "AURA · MULTI-AGENT",
    caption: "PLANNER → 5 WORKERS → EVALUATOR",
    intensity: "heavy",
  },
  ChefMate: {
    src: "/work/chefmate.mp4",
    label: "CHEFMATE · ON-DEVICE ML",
    caption: "TFLITE · WEB + ANDROID",
  },
  AutoDev: {
    src: "/work/autodev.mp4",
    label: "AUTODEV · WEBCONTAINER",
    caption: "NL → MULTI-FILE PROJECT",
  },
};

/**
 * Section 03 — Selected Work.
 *
 * Dual-tone redesign: scroll-driven RGB-split headline, cursor-tracking
 * spotlight on each card, alternating red/cyan corner marks, hover-RGB
 * settle on chips (cyan, secondary) and links (red, primary).
 *
 * AURA / ChefMate / AutoDev render a `VideoFrame` (drop screen recordings
 * into `/public/work/<slug>.mp4` — placeholder still shows the overlay
 * treatment if the file is missing). Grok pipeline has no visual block by
 * design: text-only card for visual rhythm.
 */
export function SelectedWork() {
  return (
    <section
      id="work"
      data-section="03-selected-work"
      className="relative w-full bg-bg px-5 py-28 md:px-10 md:py-40 lg:px-20 lg:py-48"
    >
      <div className="mx-auto max-w-7xl">
        {/* section header */}
        <div className="mb-16 flex flex-wrap items-baseline justify-between gap-4 border-b border-hairline pb-5 md:mb-20">
          <BlurText as="p" className="mono-caps text-muted">
            <span className="text-accent">03 ·</span> SELECTED WORK · {PROJECTS.length} PROJECTS
          </BlurText>
          <BlurText as="p" delay={120} className="mono-caps text-fg/55">
            <GlitchText idleInterval={9000}>2024 — 2026</GlitchText>
          </BlurText>
        </div>

        {/* big standfirst */}
        <div className="mb-20 grid grid-cols-1 gap-8 lg:mb-24 lg:grid-cols-12 lg:gap-14">
          <BlurText as="div" className="lg:col-span-7">
            <h2
              className="font-astro text-fg leading-[0.92]"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
            >
              THINGS I&apos;VE<br />
              <span className="text-fg/35">ACTUALLY</span><br />
              <RgbSplitText scrub peakPx={6} as="span" className="text-accent">
                <DecryptedText
                  text="SHIPPED."
                  triggerOnInView
                  duration={1100}
                  delay={300}
                />
              </RgbSplitText>
            </h2>
          </BlurText>
          <BlurText
            as="p"
            delay={150}
            className="font-chakra max-w-[55ch] self-end text-fg/75 text-[15px] leading-[1.7] lg:col-span-5"
          >
            Production pipelines, multi-agent platforms, browser-native
            runtimes, on-device ML. Each card has the source — click through
            for the details.
          </BlurText>
        </div>

        {/* card grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.index} project={p} order={i} />
          ))}
        </div>

        {/* closing rule */}
        <div className="mt-20 flex flex-wrap items-baseline justify-between gap-3 border-t border-hairline pt-5 md:mt-28">
          <p
            className="mono-caps text-muted"
            style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace" }}
          >
            NEXT — PRODUCTION METRICS
          </p>
          <p
            className="mono-caps text-fg/45"
            style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace" }}
          >
            <span className="text-accent">→</span> 04
          </p>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, order }: { project: Project; order: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: 0.95,
        ease: [0.16, 1, 0.3, 1],
        delay: 0.05 * order,
      }}
      whileHover={{ y: -4 }}
      className="group relative isolate flex flex-col overflow-hidden border border-hairline bg-black/40 transition-colors duration-300 hover:border-accent/40"
    >
      <SpotlightCard>
        <ProjectVisual project={project} />
      </SpotlightCard>

      {/* corner marks — alternating red / cyan pair */}
      <span aria-hidden className="pointer-events-none absolute left-0 top-0 z-20 h-3 w-3 border-l border-t border-accent transition-opacity duration-300 group-hover:opacity-100 opacity-60" />
      <span
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 z-20 h-3 w-3 border-r border-t transition-opacity duration-300 group-hover:opacity-100 opacity-60"
        style={{ borderColor: "var(--cyan)" }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute left-0 bottom-0 z-20 h-3 w-3 border-l border-b transition-opacity duration-300 group-hover:opacity-100 opacity-60"
        style={{ borderColor: "var(--cyan)" }}
      />
      <span aria-hidden className="pointer-events-none absolute right-0 bottom-0 z-20 h-3 w-3 border-r border-b border-accent transition-opacity duration-300 group-hover:opacity-100 opacity-60" />

      {/* body */}
      <div className="relative z-10 flex flex-1 flex-col gap-5 p-6 md:p-8">
        <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <p
            className="mono-caps text-fg/55"
            style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace" }}
          >
            <span className="text-accent">№ {project.index}</span>
          </p>
          <h3
            className="font-astro leading-tight text-fg"
            style={{ fontSize: "clamp(1.6rem, 2.6vw, 2.4rem)" }}
          >
            {project.title.toUpperCase()}
          </h3>
        </header>

        <p
          className="mono-caps text-accent/85"
          style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace" }}
        >
          {project.tagline}
        </p>

        <p className="font-chakra text-[15px] leading-[1.7] text-fg/80">
          {project.description}
        </p>

        <ul className="space-y-2 font-chakra text-[14px] leading-[1.55] text-fg/70">
          {project.highlights.map((h, i) => (
            <li key={i} className="relative pl-5">
              <span
                aria-hidden
                className="absolute left-0 top-[0.6em] inline-block h-px w-3 bg-accent"
              />
              {h}
            </li>
          ))}
        </ul>

        {/* stack chips + links */}
        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-hairline pt-4">
          <ul className="flex flex-wrap gap-x-1.5 gap-y-1.5">
            {project.stack.map((s) => (
              <li
                key={s}
                data-rgb-text={s}
                data-rgb-settle="cyan"
                className="hover-rgb mono-caps border border-hairline px-2 py-0.5 text-fg/55 transition-colors group-hover:border-hairline-cyan"
                style={{
                  fontFamily: "var(--font-declandar), ui-monospace, monospace",
                  fontSize: 9.5,
                  letterSpacing: "0.18em",
                }}
              >
                {s}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center gap-4">
            {project.links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target={l.external ? "_blank" : undefined}
                rel={l.external ? "noopener noreferrer" : undefined}
                data-rgb-text={`→ ${l.label.toUpperCase()}`}
                data-rgb-settle="red"
                className="hover-rgb mono-caps text-fg/70"
              >
                → {l.label.toUpperCase()}
              </a>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/**
 * Pick the right per-project visual. The visuals themselves live under
 * `src/components/work/visuals/` — this is just the dispatch.
 */
function ProjectVisual({ project }: { project: Project }) {
  if (project.title === "Grok pipeline") {
    return <CubesVisual label="GROK PIPELINE · DEDUP" caption="442K · 60 GB · 99.99%" />;
  }
  const v = PROJECT_VIDEO[project.title];
  if (v) {
    return <VideoFrame src={v.src} label={v.label} caption={v.caption} intensity={v.intensity} />;
  }
  if (project.visual.kind === "data-art") {
    return <DataArtVisual project={project as Project & { visual: { kind: "data-art"; bigNumber: string; caption: string } }} />;
  }
  return <ScreenshotVisual project={project as Project & { visual: { kind: "screenshot"; src: string; alt: string } }} />;
}
