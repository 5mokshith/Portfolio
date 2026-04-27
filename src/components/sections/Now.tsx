"use client";

import { BlurText } from "@/components/effects/BlurText";
import { StatusPanel } from "@/components/now/StatusPanel";
import { NOW } from "@/content/now";

/**
 * Section 06 — NOW.
 *
 * Single HUD readout. Live dot, decoded status lines, ticking uptime
 * anchored to Aug 22 2025 (Flashback Labs day 0). Section frame matches
 * Stack/ByTheNumbers; the panel itself is the entire content — no
 * standfirst, no asymmetric sidebar. The asymmetry lives inside the panel.
 */
export function Now() {
  return (
    <section
      data-section="06-now"
      className="relative w-full bg-bg px-5 py-28 md:px-10 md:py-40 lg:px-20 lg:py-48"
    >
      <div className="mx-auto max-w-7xl">
        {/* section header */}
        <div className="mb-14 flex flex-wrap items-baseline justify-between gap-4 border-b border-hairline pb-5 md:mb-16">
          <BlurText as="p" className="mono-caps text-muted">
            <span className="text-accent">06 ·</span> NOW · LIVE
          </BlurText>
          <BlurText as="p" delay={120} className="mono-caps text-fg/55">
            FILE 06 / STATUS
          </BlurText>
        </div>

        <StatusPanel />

        {/* closing rule */}
        <div className="mt-20 flex flex-wrap items-baseline justify-between gap-3 border-t border-hairline pt-5 md:mt-28">
          <p
            className="mono-caps text-muted"
            style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace" }}
          >
            END FILE 06 / NEXT — CONTACT
          </p>
          <p
            className="mono-caps text-fg/45"
            style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace" }}
          >
            {NOW.lines.length} SIGNALS · LIVE
          </p>
        </div>
      </div>
    </section>
  );
}
