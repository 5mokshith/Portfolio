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
 * Editorial photo block: a solid cyan offset rectangle drifts behind the
 * portrait as the section scrolls into view. An oversized faint "02"
 * sits behind everything as a decorative section mark, and a small
 * "MR · '25" maker's stamp sits in the bottom-right corner of the photo.
 *
 * No image filter chain — the previous chromatic-aberration approach
 * fought with the source image's high saturation. Using a flat colored
 * block produces a far cleaner result.
 */
export function PhotoStack({ src, alt }: PhotoStackProps) {
  const ref = useRef<HTMLDivElement>(null);
  const progress = useScrollScrub(ref);
  // Subtle scroll-driven drift: 6 → 14 → 6 px on both axes.
  const offsetX = useTransform(progress, [0, 0.5, 1], [6, 14, 6]);
  const offsetY = useTransform(progress, [0, 0.5, 1], [6, 14, 6]);
  const blockOpacity = useTransform(progress, [0, 0.4, 0.6, 1], [0.16, 0.26, 0.26, 0.16]);

  return (
    <div className="relative">
      {/* oversized decorative "02" — sits behind the photo block */}
      <p
        aria-hidden
        className="font-astro pointer-events-none absolute -left-3 -top-4 select-none leading-[0.75]"
        style={{
          fontSize: "clamp(6.5rem, 13vw, 11rem)",
          color: "var(--cyan)",
          opacity: 0.08,
        }}
      >
        02
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

          {/* corner brackets — pair colored */}
          <span
            aria-hidden
            className="pointer-events-none absolute left-2 top-2 h-3 w-3 border-l border-t"
            style={{ borderColor: "var(--accent)" }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute right-2 top-2 h-3 w-3 border-r border-t"
            style={{ borderColor: "var(--cyan)" }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute left-2 bottom-2 h-3 w-3 border-l border-b"
            style={{ borderColor: "var(--cyan)" }}
          />
          <span
            aria-hidden
            className="pointer-events-none absolute right-2 bottom-2 h-3 w-3 border-r border-b"
            style={{ borderColor: "var(--accent)" }}
          />

          {/* maker's stamp */}
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
            MR · &apos;26
          </span>
        </div>
      </div>
    </div>
  );
}
