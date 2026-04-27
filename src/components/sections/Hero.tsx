"use client";

import { useRef } from "react";
import { PhotoLayer } from "@/components/hero/PhotoLayer";
import { HUDOverlay } from "@/components/hero/HUDOverlay";
import { HeroText } from "@/components/hero/HeroText";

/**
 * Section 01 — Hero.
 *
 * Three layers stacked back-to-front:
 *   z-0  PhotoLayer  — duotone photo, ken-burns, slowest mouse parallax
 *   z-10 HUDOverlay  — gridlines / corner marks / reticle / telemetry
 *   z-20 HeroText    — name (decoded), role, thesis
 *
 * Scrolls full viewport. Below the fold the next section starts; the photo
 * desaturates and the HUD/text fade as the user scrolls past.
 */
export function Hero() {
  const hostRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={hostRef}
      data-section="01-hero"
      className="relative h-[100svh] w-full overflow-hidden bg-bg"
    >
      <PhotoLayer scrollHostRef={hostRef} />
      <HUDOverlay scrollHostRef={hostRef} />
      <HeroText scrollHostRef={hostRef} />
    </section>
  );
}
