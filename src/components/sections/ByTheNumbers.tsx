"use client";

import { BlurText } from "@/components/effects/BlurText";
import { GlitchText } from "@/components/effects/GlitchText";
import { StatCell } from "@/components/numbers/StatCell";
import { STATS } from "@/content/stats";

/**
 * Section 04 — By the Numbers.
 *
 * Asymmetric 12-col bento. Six cells, the 442K hero takes col-span-6 and
 * twice the digit size. Other five cells fade-row-by-row first; the hero
 * cell lands LAST in the stagger so its giant digits read as the punch.
 *
 * Mobile reflow (≤md): hero gets full width; the four mid stats pair up at
 * half width; the long captions (13 DAYS, 48 HOURS) stack at full width.
 */

const STAGGER_STEP_MS = 130; // gap between non-hero cells appearing
const HERO_HOLD_MS = 240;    // extra delay tacked onto the hero so it lands LAST

// non-hero index → stagger delay
function nonHeroDelays() {
  let i = 0;
  return STATS.map((s) => {
    if (s.hero) return 0;
    const delay = i * STAGGER_STEP_MS;
    i += 1;
    return delay;
  });
}

// mobile column-span varies per cell so the layout reflows naturally.
// Tailwind's JIT only sees literal class strings, so we map by index here
// rather than constructing class names with template literals.
const MOBILE_SPAN_CLASS = [
  "col-span-12", // 442K hero — full width on mobile
  "col-span-6",  // 590K
  "col-span-6",  // 60GB
  "col-span-6",  // 99.99%
  "col-span-12", // 13 DAYS
  "col-span-6",  // 48 HOURS
];

// md+ spans, lookup keyed off Stat.span values (3, 4, 5, 6)
const MD_SPAN_CLASS: Record<number, string> = {
  3: "md:col-span-3",
  4: "md:col-span-4",
  5: "md:col-span-5",
  6: "md:col-span-6",
};

export function ByTheNumbers() {
  const delays = nonHeroDelays();
  const nonHeroCount = STATS.filter((s) => !s.hero).length;
  const heroDelay = nonHeroCount * STAGGER_STEP_MS + HERO_HOLD_MS;

  return (
    <section
      data-section="04-by-the-numbers"
      className="relative w-full bg-bg px-5 py-28 md:px-10 md:py-40 lg:px-20 lg:py-48"
    >
      <div className="mx-auto max-w-7xl">
        {/* section header */}
        <div className="mb-14 flex flex-wrap items-baseline justify-between gap-4 border-b border-hairline pb-5 md:mb-16">
          <BlurText as="p" className="mono-caps text-muted">
            <span className="text-accent">04 ·</span> TELEMETRY · IN PRODUCTION
          </BlurText>
          <BlurText as="p" delay={120} className="mono-caps text-fg/55">
            FILE 04 / METRICS
          </BlurText>
        </div>

        {/* big standfirst */}
        <div className="mb-16 grid grid-cols-1 gap-8 lg:mb-20 lg:grid-cols-12 lg:gap-14">
          <BlurText as="div" className="lg:col-span-7">
            <p
              className="mono-caps text-fg/65 mb-4"
              style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace" }}
            >
              [{" "}
              <GlitchText idleInterval={9000}>
                TELEMETRY · SEP 2024 — APR 2026
              </GlitchText>{" "}
              ]
            </p>
            <h2
              className="font-astro text-fg leading-[0.92]"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
            >
              PRODUCTION<br />
              <span className="text-accent">METRICS.</span>
            </h2>
          </BlurText>
          <BlurText
            as="p"
            delay={150}
            className="font-chakra max-w-[55ch] self-end text-fg/75 text-[15px] leading-[1.7] lg:col-span-5"
          >
            What the work actually moved. Pulled from the Grok pipeline run
            log and the 48-hour hiring platform sprint — real counters, not
            vanity rounding.
          </BlurText>
        </div>

        {/* bento grid */}
        <div className="grid auto-rows-[minmax(180px,auto)] grid-cols-12 gap-4 md:auto-rows-[minmax(220px,auto)] md:gap-5">
          {STATS.map((stat, i) => {
            const delay = stat.hero ? heroDelay : delays[i];
            const mobileClass = MOBILE_SPAN_CLASS[i] ?? "col-span-12";
            const mdClass = MD_SPAN_CLASS[stat.span] ?? "md:col-span-6";
            return (
              <StatCell
                key={stat.label}
                stat={stat}
                countDelay={delay}
                className={`${mobileClass} ${mdClass}`}
              />
            );
          })}
        </div>

        {/* closing rule */}
        <div className="mt-20 flex flex-wrap items-baseline justify-between gap-3 border-t border-hairline pt-5 md:mt-28">
          <p
            className="mono-caps text-muted"
            style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace" }}
          >
            END FILE 04 / NEXT — STACK
          </p>
          <p
            className="mono-caps text-fg/45"
            style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace" }}
          >
            6 SIGNALS · LIVE
          </p>
        </div>
      </div>
    </section>
  );
}
