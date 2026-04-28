"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import Image from "next/image";
import { BlurText } from "@/components/effects/BlurText";
import { GlitchText } from "@/components/effects/GlitchText";
import { DecryptedText } from "@/components/effects/DecryptedText";
import { PixelCanvas } from "@/components/numbers/PixelCanvas";
import Cubes from "@/components/reactbits/Cubes";
import { PROJECTS, type Project } from "@/content/projects";

/**
 * Section 03 — Selected Work.
 *
 * V1 vocabulary: dark bg, mono-caps frame, big Astro headline, hairline
 * borders, red accents. Replaces the prior flowchart panels with a
 * 2-up case-study card grid. Each card has a visual slot, plain-English
 * description, build highlights, stack chips, and links.
 *
 * Visual slot is per-project: AURA gets a Cubes interactive panel
 * (multi-agent → cubes), Grok gets the PixelCanvas data-art treatment
 * (pixels = 442K assets), the others get bordered-data-art panels with
 * their headline number.
 *
 * Card hover: subtle lift + corner accents brighten. Pixel/Cubes panels
 * also activate on hover (in addition to scroll-in).
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
              <span className="text-accent">
                <DecryptedText
                  text="SHIPPED."
                  triggerOnInView
                  duration={1100}
                  delay={300}
                />
              </span>
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
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.article
      ref={ref}
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
      {/* visual slot — per-project treatment */}
      <ProjectVisual project={project} active={inView} />

      {/* corner marks — V1 HUD vocabulary */}
      <span aria-hidden className="pointer-events-none absolute left-0 top-0 z-20 h-3 w-3 border-l border-t border-accent transition-opacity duration-300 group-hover:opacity-100 opacity-60" />
      <span aria-hidden className="pointer-events-none absolute right-0 top-0 z-20 h-3 w-3 border-r border-t border-accent transition-opacity duration-300 group-hover:opacity-100 opacity-60" />
      <span aria-hidden className="pointer-events-none absolute left-0 bottom-0 z-20 h-3 w-3 border-l border-b border-accent transition-opacity duration-300 group-hover:opacity-100 opacity-60" />
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
                className="mono-caps border border-hairline px-2 py-0.5 text-fg/55 transition-colors group-hover:border-hairline-red"
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
                className="mono-caps text-fg/70 transition-colors hover:text-accent"
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
 * Per-project visual treatment. AURA gets Cubes (multi-agent),
 * Grok gets the PixelCanvas hero treatment, others get a number-driven
 * data-art panel. Either way: no flowcharts, no architecture diagrams.
 */
function ProjectVisual({ project, active }: { project: Project; active: boolean }) {
  // AURA = multi-agent → Cubes interactive grid
  if (project.title === "AURA") {
    return (
      <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-hairline bg-black/60">
        <Cubes
          gridSize={10}
          maxAngle={45}
          radius={3}
          borderStyle="1px solid rgba(255,45,45,0.4)"
          faceColor="#0a0a0a"
          rippleColor="#ff2d2d"
          rippleSpeed={1.6}
          cellGap={4}
          autoAnimate
          rippleOnClick
        />
        <p
          className="pointer-events-none absolute left-3 top-3 z-10 mono-caps text-fg/55"
          style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace", fontSize: 9 }}
        >
          <span className="text-accent">●</span> CLICK · MULTI-AGENT
        </p>
      </div>
    );
  }

  // Grok = 442K images → PixelCanvas + headline number overlay
  if (project.title === "Grok pipeline") {
    return (
      <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-hairline bg-black/70">
        <PixelCanvas active={active} gap={5} speed={45} colors="#FFD700,#FFC72C,#A6790A,#ff2d2d" />
        <div className="pointer-events-none absolute inset-0 flex items-end p-6 md:p-8">
          <p
            className="font-astro leading-[0.85] text-fg"
            style={{ fontSize: "clamp(3.5rem, 8vw, 6.5rem)", textShadow: "0 0 32px rgba(0,0,0,0.7)" }}
          >
            442<span className="text-accent">K</span>
          </p>
        </div>
        <span aria-hidden className="pointer-events-none absolute right-4 top-4 h-3 w-3">
          <span className="absolute inset-0 border-r border-t border-accent" />
        </span>
      </div>
    );
  }

  // Others: data-art with bigNumber + caption (from projects.ts)
  if (project.visual.kind === "data-art") {
    return (
      <div
        className="relative aspect-[16/10] w-full overflow-hidden border-b border-hairline"
        style={{
          background:
            "radial-gradient(120% 80% at 30% 25%, rgba(255,45,45,0.10) 0%, rgba(10,10,10,0) 60%)," +
            "linear-gradient(180deg, #14110F 0%, #0a0a0a 100%)",
        }}
      >
        {/* faint grid */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,45,45,0.18) 1px, transparent 1px)," +
              "linear-gradient(to bottom, rgba(255,45,45,0.18) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            maskImage:
              "radial-gradient(ellipse 80% 70% at 50% 60%, black 30%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 70% at 50% 60%, black 30%, transparent 100%)",
          }}
        />
        <div className="relative z-10 flex h-full flex-col items-start justify-center px-7 py-7 md:px-9">
          <p
            className="font-astro leading-[0.85] text-fg"
            style={{ fontSize: "clamp(4rem, 11vw, 8.5rem)", textShadow: "0 0 24px rgba(0,0,0,0.6)" }}
          >
            <span className="text-accent">{project.visual.bigNumber.charAt(0)}</span>
            {project.visual.bigNumber.slice(1)}
          </p>
          <p
            className="mt-3 max-w-[40ch] mono-caps text-fg/55"
            style={{
              fontFamily: "var(--font-declandar), ui-monospace, monospace",
              letterSpacing: "0.2em",
              fontSize: 9.5,
            }}
          >
            {project.visual.caption}
          </p>
        </div>
      </div>
    );
  }

  // Screenshot fallback (kept for future projects with real images)
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-hairline bg-black/60">
      <Image
        src={project.visual.src}
        alt={project.visual.alt}
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.02]"
      />
    </div>
  );
}
