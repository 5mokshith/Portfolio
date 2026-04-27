"use client";

import { AboutPhoto } from "@/components/about/AboutPhoto";
import { Bio } from "@/components/about/Bio";
import { FactStrip } from "@/components/about/FactStrip";
import { BlurText } from "@/components/effects/BlurText";

/**
 * Section 02 — About.
 *
 * Asymmetric two-column split: photo on the left (~40%), bio + fact strip
 * on the right (~60%). The right column's first baseline is intentionally
 * NOT aligned to the photo top edge — pt-[6px] on the column header
 * provides the hand-set drift the brief calls out.
 */
export function About() {
  return (
    <section
      data-section="02-about"
      className="relative w-full bg-bg px-5 py-28 md:px-10 md:py-40 lg:px-20 lg:py-44"
    >
      <div className="mx-auto max-w-7xl">
        {/* tiny section header above the split */}
        <div className="mb-14 flex flex-wrap items-baseline justify-between gap-4 border-b border-hairline pb-5">
          <BlurText as="p" className="mono-caps text-muted">
            <span className="text-accent">02 ·</span> ABOUT · CHANNEL OPEN
          </BlurText>
          <BlurText as="p" delay={120} className="mono-caps text-fg/55">
            FILE 02 / DOSSIER
          </BlurText>
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-12 lg:gap-16">
          {/* left column — photo */}
          <div className="md:col-span-5 lg:col-span-5">
            <AboutPhoto />
          </div>

          {/* right column — bio + fact strip
             pt-[6px] is the intentional baseline mis-alignment the brief calls
             out — the bio first line sits ~6px below where it would if it
             aligned perfectly to the photo top edge. */}
          <div className="md:col-span-7 lg:col-span-7 md:pt-[6px]">
            <BlurText as="div" className="mb-8">
              <h2
                className="font-astro text-fg"
                style={{
                  fontSize: "clamp(2.25rem, 5vw, 4rem)",
                  lineHeight: 0.95,
                }}
              >
                ENGINEER<br />
                <span className="text-fg/35">BEHIND THE</span><br />
                <span className="text-accent">COMPANY.</span>
              </h2>
            </BlurText>

            <Bio />

            <div className="mt-12">
              <FactStrip />
            </div>
          </div>
        </div>

        {/* a quiet system stamp at the bottom edge of the section */}
        <div className="mt-20 flex flex-wrap items-baseline justify-between gap-3 border-t border-hairline pt-5">
          <p
            className="mono-caps text-muted"
            style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace" }}
          >
            END FILE 02 / NEXT — SELECTED WORK
          </p>
          <p
            className="mono-caps text-fg/45"
            style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace" }}
          >
            CLEARANCE · PUBLIC
          </p>
        </div>
      </div>
    </section>
  );
}
