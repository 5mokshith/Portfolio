"use client";

import { useRef } from "react";
import { CoverPhoto } from "@/components/hero-v2/CoverPhoto";
import { CoverType } from "@/components/hero-v2/CoverType";
import { CoverFrame } from "@/components/hero-v2/CoverFrame";

/**
 * Section 01 (V2) — Editorial Cover.
 *
 * Stark Industries annual-report cover as the deliberate contrast to v1's
 * tactical HUD. Two-column on lg+: 7-col type / 5-col photo. Single column
 * on small screens with the photo as a band above the type.
 *
 *  • bg: warm charcoal (#14100E), not pure black
 *  • photo: gold/charcoal duotone, slow drift, mask-reveal on mount
 *  • type: serif display (Fraunces) with line-by-line mask reveal
 *  • accents: antique gold rule, single signal-red year digit
 *  • motion vocabulary: editorial restraint — staggered mount reveal,
 *    no decoded text, no glitch, scroll-out is opacity-only
 */
export function HeroV2() {
  const hostRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={hostRef}
      data-section="01-hero-v2"
      className="relative h-[100svh] w-full overflow-hidden"
      style={{
        background: "var(--color-bg-deep)",
        color: "var(--color-fg-warm)",
      }}
    >
      {/* desktop: 7/5 grid · mobile: photo band above type */}
      <div className="grid h-full w-full grid-rows-[40svh_1fr] lg:grid-cols-12 lg:grid-rows-1">
        {/* TYPE COLUMN — left on lg+, below on mobile */}
        <div className="relative order-2 lg:order-1 lg:col-span-7">
          <CoverType scrollHostRef={hostRef} />
        </div>

        {/* PHOTO COLUMN — right on lg+, top band on mobile */}
        <div className="relative order-1 lg:order-2 lg:col-span-5 overflow-hidden">
          <CoverPhoto scrollHostRef={hostRef} />
          <CoverFrame />
        </div>
      </div>

      {/* full-bleed bottom hairline — bronze, edge-to-edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-px"
        style={{ background: "var(--color-hairline-bronze)" }}
      />
    </section>
  );
}
