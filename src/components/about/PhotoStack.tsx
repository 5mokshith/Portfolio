"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useTransform } from "motion/react";
import { useScrollScrub } from "@/lib/useScrollScrub";

type PhotoStackProps = {
  src: string;
  alt: string;
};

/**
 * Editorial photo block. Decorations:
 *   - Solid cyan offset rectangle behind the portrait, scroll-driven drift.
 *   - Oversized faded "02" sitting behind everything as a section mark.
 *   - Four corner brackets in alternating red / cyan.
 *   - Outside registration crosses at top-left (cyan) and bottom-right (red).
 *   - Tick marks down the left edge.
 *   - Vertical "ARCHIVE · MR · 2026" mono-caps stamp running up the right.
 *   - Small "MR · '26 · 02 / 02" file stamp inside the bottom-right corner.
 */
export function PhotoStack({ src, alt }: PhotoStackProps) {
  const ref = useRef<HTMLDivElement>(null);
  const progress = useScrollScrub(ref);
  const offsetX = useTransform(progress, [0, 0.5, 1], [6, 14, 6]);
  const offsetY = useTransform(progress, [0, 0.5, 1], [6, 14, 6]);
  const blockOpacity = useTransform(progress, [0, 0.4, 0.6, 1], [0.16, 0.26, 0.26, 0.16]);

  return (
    <div className="relative pl-6 pr-8 pt-6 pb-4">
      {/* oversized decorative "02" — sits behind everything */}
      <p
        aria-hidden
        className="font-astro pointer-events-none absolute -left-2 top-0 select-none leading-[0.75]"
        style={{
          fontSize: "clamp(6.5rem, 13vw, 11rem)",
          color: "var(--cyan)",
          opacity: 0.07,
        }}
      >
        02
      </p>

      {/* registration cross — top-left, outside the photo */}
      <RegMark className="absolute left-0 top-0" color="var(--cyan)" />
      {/* registration cross — bottom-right, outside the photo */}
      <RegMark className="absolute right-1 bottom-0" color="var(--accent)" />

      {/* tick marks down the left edge */}
      <div className="pointer-events-none absolute left-2 top-12 bottom-12 flex flex-col justify-between">
        {Array.from({ length: 6 }).map((_, i) => (
          <span
            key={i}
            aria-hidden
            className="block h-px"
            style={{
              width: i % 2 === 0 ? 8 : 4,
              background: i % 2 === 0 ? "var(--cyan)" : "var(--hairline-cyan)",
              opacity: i % 2 === 0 ? 0.7 : 0.5,
            }}
          />
        ))}
      </div>

      {/* vertical mono-caps stamp up the right edge */}
      <p
        aria-hidden
        className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 mono-caps"
        style={{
          fontFamily: "var(--font-declandar), ui-monospace, monospace",
          color: "var(--muted)",
          fontSize: 9,
          letterSpacing: "0.32em",
          writingMode: "vertical-rl",
          opacity: 0.6,
        }}
      >
        ARCHIVE · MR · 2026
      </p>

      <div ref={ref} className="relative aspect-[4/5] w-full">
        {/* cyan offset block — solid color, scroll-driven drift */}
        <motion.div
          aria-hidden
          className="absolute inset-0"
          style={{
            x: offsetX,
            y: offsetY,
            background: "var(--cyan)",
            opacity: blockOpacity,
          }}
        />

        {/* foreground photo */}
        <div className="relative h-full w-full overflow-hidden bg-black/40">
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(min-width: 768px) 40vw, 100vw"
            className="object-cover object-center"
            style={{ filter: "saturate(0.9) contrast(1.05)" }}
            priority
          />

          {/* hairline frame */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 border"
            style={{ borderColor: "var(--hairline-red)" }}
          />

          {/* corner brackets */}
          <span aria-hidden className="pointer-events-none absolute left-2 top-2 h-3 w-3 border-l border-t" style={{ borderColor: "var(--accent)" }} />
          <span aria-hidden className="pointer-events-none absolute right-2 top-2 h-3 w-3 border-r border-t" style={{ borderColor: "var(--cyan)" }} />
          <span aria-hidden className="pointer-events-none absolute left-2 bottom-2 h-3 w-3 border-l border-b" style={{ borderColor: "var(--cyan)" }} />
          <span aria-hidden className="pointer-events-none absolute right-2 bottom-2 h-3 w-3 border-r border-b" style={{ borderColor: "var(--accent)" }} />

          {/* file stamp — bottom-right corner, inside the photo */}
          <span
            aria-hidden
            className="pointer-events-none absolute right-3 bottom-3 mono-caps"
            style={{
              fontFamily: "var(--font-declandar), ui-monospace, monospace",
              color: "rgba(255,255,255,0.5)",
              fontSize: 9,
              letterSpacing: "0.22em",
            }}
          >
            MR · &apos;26 · FRAME 02 / 02
          </span>
        </div>
      </div>
    </div>
  );
}

/** Registration cross — small + mark used by editorial layouts. */
function RegMark({ className, color }: { className?: string; color: string }) {
  return (
    <span aria-hidden className={`pointer-events-none ${className ?? ""}`} style={{ width: 14, height: 14 }}>
      <span
        className="absolute"
        style={{ top: 6, left: 0, width: 14, height: 1, background: color, opacity: 0.7 }}
      />
      <span
        className="absolute"
        style={{ left: 6, top: 0, height: 14, width: 1, background: color, opacity: 0.7 }}
      />
    </span>
  );
}
