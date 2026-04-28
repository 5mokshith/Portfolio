"use client";

import { BlurText } from "@/components/effects/BlurText";
import { GlitchText } from "@/components/effects/GlitchText";
import { DecryptedText } from "@/components/effects/DecryptedText";
import { RgbSplitText } from "@/components/effects";
import { RequestTrace } from "@/components/stack/RequestTrace";
import { TIERS, TOTAL_ENTRIES } from "@/content/stack";

/**
 * Section 05 — STACK.
 *
 * Cyan-dominant in the dual-tone scheme: this section represents the
 * technical/system intent of the work, so the secondary cyan token leads
 * (red still appears, but in supporting roles).
 *
 * The previous tier-list block is replaced with a 3-lane KineticChipCloud
 * where chips drift continuously and click-to-expand to show each tool's
 * role. Hover pauses the lane under the pointer.
 */
export function Stack() {
  return (
    <section
      id="stack"
      data-section="05-stack"
      className="relative w-full bg-bg px-5 py-28 md:px-10 md:py-40 lg:px-20 lg:py-48"
    >
      <div className="mx-auto max-w-7xl">
        {/* section header */}
        <div
          className="mb-14 flex flex-wrap items-baseline justify-between gap-4 border-b pb-5 md:mb-16"
          style={{ borderColor: "var(--hairline-cyan)" }}
        >
          <BlurText as="p" className="mono-caps text-muted">
            <span style={{ color: "var(--cyan)" }}>05 ·</span> STACK · {TIERS.length} TIERS · {TOTAL_ENTRIES} TOOLS
          </BlurText>
          <BlurText as="p" delay={120} className="mono-caps text-fg/55">
            <GlitchText idleInterval={9000}>WORKBENCH</GlitchText>
          </BlurText>
        </div>

        {/* big standfirst */}
        <div className="mb-16 grid grid-cols-1 gap-8 lg:mb-20 lg:grid-cols-12 lg:gap-14">
          <BlurText as="div" className="lg:col-span-7">
            <h2
              className="font-astro text-fg leading-[0.92]"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
            >
              TOOLS I<br />
              <span className="text-fg/35">REACH</span><br />
              <RgbSplitText scrub peakPx={6} as="span" style={{ color: "var(--cyan)" }}>
                <DecryptedText
                  text="FOR."
                  triggerOnInView
                  duration={900}
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
            Not tutorials I&apos;ve finished. Things in active use across
            production projects. Click any chip to see what it actually does
            in the runtime.
          </BlurText>
        </div>

        {/* live request trace — packet flows top→bottom (request) then back */}
        <div
          className="border-t pt-10 md:pt-14"
          style={{ borderColor: "var(--hairline-cyan)" }}
        >
          <p
            className="mono-caps text-muted mb-6"
            style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace" }}
          >
            <span style={{ color: "var(--cyan)" }}>●</span> LIVE TRACE · A SAMPLE REQUEST · HOVER A LAYER TO PAUSE
          </p>
          <RequestTrace />
        </div>

        {/* closing rule */}
        <div
          className="mt-20 flex flex-wrap items-baseline justify-between gap-3 border-t pt-5 md:mt-28"
          style={{ borderColor: "var(--hairline-cyan)" }}
        >
          <p
            className="mono-caps text-muted"
            style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace" }}
          >
            NEXT — NOW
          </p>
          <p
            className="mono-caps text-fg/45"
            style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace" }}
          >
            <span style={{ color: "var(--cyan)" }}>→</span> 06
          </p>
        </div>
      </div>
    </section>
  );
}
