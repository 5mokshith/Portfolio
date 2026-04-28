"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useTransform } from "motion/react";
import { useScrollScrub } from "@/lib/useScrollScrub";

type PhotoStackProps = {
  src: string;
  alt: string;
  /** max cyan-ghost offset in px when scrolled past. Default 14. */
  maxOffset?: number;
};

/**
 * Chromatic-aberration photo: one bordered photo + a cyan-tinted ghost
 * sliding behind it as the section enters the viewport. Uses scroll-scrub
 * for the ghost offset. Hairline corner marks alternate red/cyan.
 */
export function PhotoStack({ src, alt, maxOffset = 14 }: PhotoStackProps) {
  const ref = useRef<HTMLDivElement>(null);
  const progress = useScrollScrub(ref);
  // 0 at top of viewport entry, peak at center, 0 at exit
  const ghostX = useTransform(progress, [0, 0.5, 1], [0, maxOffset, 0]);
  const ghostY = useTransform(progress, [0, 0.5, 1], [0, maxOffset * 0.4, 0]);
  const ghostOpacity = useTransform(progress, [0, 0.4, 0.6, 1], [0, 0.7, 0.7, 0]);

  return (
    <div ref={ref} className="relative aspect-[4/5] w-full">
      {/* cyan ghost — behind */}
      <motion.div
        aria-hidden
        className="absolute inset-0 overflow-hidden border bg-black/40"
        style={{
          x: ghostX,
          y: ghostY,
          opacity: ghostOpacity,
          borderColor: "var(--hairline-cyan)",
          mixBlendMode: "screen",
        }}
      >
        <Image
          src={src}
          alt=""
          fill
          sizes="(min-width: 768px) 40vw, 100vw"
          className="object-cover object-center"
          style={{ filter: "saturate(0) brightness(1.1) sepia(1) hue-rotate(150deg) saturate(6)" }}
        />
      </motion.div>

      {/* foreground photo */}
      <div className="relative h-full w-full overflow-hidden border border-hairline-red bg-black/40">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 768px) 40vw, 100vw"
          className="object-cover object-center"
          style={{ filter: "saturate(0.85) contrast(1.05)" }}
        />
        {/* corner marks — alternate red / cyan */}
        <span aria-hidden className="pointer-events-none absolute left-2 top-2 h-3 w-3 border-l border-t" style={{ borderColor: "var(--accent)" }} />
        <span aria-hidden className="pointer-events-none absolute right-2 top-2 h-3 w-3 border-r border-t" style={{ borderColor: "var(--cyan)" }} />
        <span aria-hidden className="pointer-events-none absolute left-2 bottom-2 h-3 w-3 border-l border-b" style={{ borderColor: "var(--cyan)" }} />
        <span aria-hidden className="pointer-events-none absolute right-2 bottom-2 h-3 w-3 border-r border-b" style={{ borderColor: "var(--accent)" }} />
      </div>
    </div>
  );
}
