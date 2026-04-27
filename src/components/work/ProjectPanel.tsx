"use client";

import { useRef, useState, type ReactNode } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "motion/react";
import { DecryptedText } from "@/components/effects/DecryptedText";
import { BlurText } from "@/components/effects/BlurText";
import type { Project } from "@/content/projects";

/**
 * One Selected-Work panel. Spotlight follows the cursor across the surface,
 * the surface itself tilts ~1° for in-card weight, and the codename decodes in
 * when it scrolls into view. Visual block is rendered as a child slot so each
 * project can drop in its own diagram or mockup without reaching back here.
 */
export function ProjectPanel({
  project,
  visual,
  reverse = false,
}: {
  project: Project;
  visual: ReactNode;
  /** flip the desktop column order — odd panels left, even panels right */
  reverse?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);

  // spotlight position
  const px = useMotionValue(50);
  const py = useMotionValue(50);
  const sx = useSpring(px, { stiffness: 240, damping: 28, mass: 0.4 });
  const sy = useSpring(py, { stiffness: 240, damping: 28, mass: 0.4 });
  const spotlight = useMotionTemplate`radial-gradient(620px circle at ${sx}% ${sy}%, rgba(255,45,45,0.10), transparent 55%)`;

  // subtle tilt — kept tiny for a large surface
  const tiltX = useTransform(sy, [0, 100], [1.2, -1.2]);
  const tiltY = useTransform(sx, [0, 100], [-1.2, 1.2]);

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    px.set(((e.clientX - r.left) / r.width) * 100);
    py.set(((e.clientY - r.top) / r.height) * 100);
  };

  const interactive = project.href && project.href !== "#";

  const inner = (
    <motion.div
      ref={ref}
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => {
        setHovering(false);
        px.set(50);
        py.set(50);
      }}
      onPointerMove={handleMove}
      style={{ rotateX: tiltX, rotateY: tiltY, transformStyle: "preserve-3d" }}
      className="group relative isolate overflow-hidden rounded-md border bg-bg/40 px-6 py-10 md:px-10 md:py-14 lg:px-14 lg:py-16"
    >
      {/* spotlight wash */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 transition-opacity duration-500"
        style={{ background: spotlight, opacity: hovering ? 1 : 0.4 }}
      />

      {/* hairline border swap — accent on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 rounded-md"
        style={{
          boxShadow: hovering
            ? "inset 0 0 0 1px rgba(255,45,45,0.45), 0 60px 120px -60px rgba(255,45,45,0.18)"
            : "inset 0 0 0 1px rgba(255,255,255,0.06)",
          transition: "box-shadow 400ms ease",
        }}
      />

      {/* index top-right */}
      <p
        className="mono-caps absolute right-6 top-6 text-fg/55 md:right-10 md:top-10"
        style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace" }}
      >
        {project.index} / 04
      </p>

      <div className={`grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14 ${reverse ? "lg:[&>*:first-child]:order-2" : ""}`}>
        {/* text column */}
        <div className="lg:col-span-6">
          <h3
            className="font-astro text-fg leading-[0.92] tracking-tight"
            style={{ fontSize: "clamp(2.25rem, 5vw, 4.5rem)" }}
          >
            <DecryptedText
              text={project.codename}
              triggerOnInView
              duration={1100}
              delay={80}
            />
          </h3>

          <BlurText
            as="p"
            delay={120}
            className="font-chakra italic text-fg/85 mt-4 max-w-[42ch] text-base md:text-lg"
          >
            {project.tagline}
          </BlurText>

          {/* stack strip with hairlines */}
          <BlurText delay={240} className="my-7 border-y border-hairline py-3">
            <div
              className="mono-caps flex flex-wrap items-center gap-x-3 gap-y-1 text-fg/75"
              style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace" }}
            >
              {project.stack.map((s, i) => (
                <span key={s} className="inline-flex items-center">
                  {s.toUpperCase()}
                  {i < project.stack.length - 1 && (
                    <span className="ml-3 text-accent/60">·</span>
                  )}
                </span>
              ))}
            </div>
          </BlurText>

          <BlurText
            as="p"
            delay={360}
            className="font-chakra max-w-[60ch] text-fg/80 text-[15px] leading-[1.7]"
          >
            {project.story}
          </BlurText>

          {/* metric badge */}
          <BlurText delay={480} className="mt-6 inline-block max-w-full">
            <span
              className="mono-caps inline-block max-w-full rounded-sm border px-3 py-2 text-fg wrap-break-word text-[11px] md:text-[12px]"
              style={{
                fontFamily: "var(--font-declandar), ui-monospace, monospace",
                borderColor: "rgba(255,45,45,0.45)",
                background: "rgba(255,45,45,0.06)",
              }}
            >
              {project.metric}
            </span>
          </BlurText>

          {/* CTA + status label */}
          <BlurText delay={600} className="mt-8">
            <div
              className="flex flex-wrap items-baseline gap-4"
              style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace" }}
            >
              {interactive ? (
                <>
                  <span className="mono-caps inline-flex items-center gap-2 text-accent">
                    OPEN <span aria-hidden>↗</span>
                  </span>
                  <span className="mono-caps text-fg/45">
                    {project.hrefLabel ?? "GITHUB"}
                  </span>
                </>
              ) : (
                <span className="mono-caps inline-flex items-center gap-2 text-fg/55">
                  <span aria-hidden>◆</span>
                  {project.hrefLabel ?? "PRIVATE"}
                </span>
              )}
            </div>
          </BlurText>
        </div>

        {/* visual column */}
        <BlurText
          as="div"
          delay={300}
          className="lg:col-span-6 flex items-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            {visual}
          </motion.div>
        </BlurText>
      </div>

    </motion.div>
  );

  if (interactive) {
    return (
      <a
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md"
      >
        {inner}
      </a>
    );
  }
  return inner;
}
