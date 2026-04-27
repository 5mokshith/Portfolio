"use client";

import { BlurText } from "@/components/effects/BlurText";
import { DecryptedText } from "@/components/effects/DecryptedText";
import { GlitchText } from "@/components/effects/GlitchText";
import { PulsingDot } from "@/components/effects/PulsingDot";
import { UptimeCounter } from "@/components/now/UptimeCounter";
import { NOW } from "@/content/now";

const HEADER_DELAY = 0;
const NOW_DELAY = 200;
const FIRST_LINE_DELAY = 400;
const LINE_STEP = 150;

export function StatusPanel() {
  const linesEnd = FIRST_LINE_DELAY + NOW.lines.length * LINE_STEP;

  return (
    <div
      className="relative mx-auto w-full max-w-3xl rounded-sm p-7 md:p-10"
      style={{
        border: "1px solid var(--hairline-red)",
        background: "rgba(10, 10, 10, 0.55)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        boxShadow:
          "0 0 60px rgba(255, 45, 45, 0.18), inset 0 0 0 1px rgba(255, 255, 255, 0.03)",
      }}
    >
      {/* corner viewfinder marks */}
      <span aria-hidden className="pointer-events-none absolute left-0 top-0 h-3 w-3 border-l border-t" style={{ borderColor: "var(--accent)" }} />
      <span aria-hidden className="pointer-events-none absolute right-0 top-0 h-3 w-3 border-r border-t" style={{ borderColor: "var(--accent)" }} />
      <span aria-hidden className="pointer-events-none absolute bottom-0 left-0 h-3 w-3 border-b border-l" style={{ borderColor: "var(--accent)" }} />
      <span aria-hidden className="pointer-events-none absolute bottom-0 right-0 h-3 w-3 border-b border-r" style={{ borderColor: "var(--accent)" }} />

      {/* meta row */}
      <BlurText
        as="div"
        delay={HEADER_DELAY}
        className="flex flex-wrap items-center justify-between gap-3 mono-caps"
      >
        <span className="inline-flex items-center gap-2 text-fg/85">
          <PulsingDot />
          <span>LIVE</span>
        </span>
        <span className="text-muted">LAST SYNC: {NOW.lastSync}</span>
      </BlurText>

      {/* heading — nudged 6px up off the meta-row baseline (intentional anomaly) */}
      <h2
        className="font-astro text-fg leading-[0.92] mt-3 mb-10"
        style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", marginTop: "calc(0.75rem - 6px)" }}
      >
        <GlitchText>NOW</GlitchText>
      </h2>

      {/* status lines */}
      <ul className="space-y-3 md:space-y-4">
        {NOW.lines.map((line, i) => (
          <li
            key={line.label}
            className="grid grid-cols-[auto_1fr] items-baseline gap-x-3 gap-y-1 md:grid-cols-[auto_10rem_1fr] md:gap-x-5"
          >
            <span className="text-accent font-declandar text-sm leading-none">→</span>
            <span
              className="mono-caps text-accent col-start-2 md:col-start-2"
              style={{ fontSize: "0.7rem" }}
            >
              <DecryptedText
                text={line.label}
                triggerOnInView
                delay={FIRST_LINE_DELAY + i * LINE_STEP}
                duration={650}
              />
            </span>
            <span className="font-chakra text-fg/85 text-[14px] md:text-[15px] leading-[1.55] col-span-2 md:col-span-1 md:col-start-3">
              <DecryptedText
                text={line.value}
                triggerOnInView
                delay={FIRST_LINE_DELAY + i * LINE_STEP + 60}
                duration={900}
              />
            </span>
          </li>
        ))}
      </ul>

      {/* uptime row */}
      <BlurText
        as="div"
        delay={linesEnd + 100}
        className="mt-10 flex flex-wrap items-baseline gap-x-3 border-t border-hairline-red pt-5"
      >
        <span className="mono-caps text-muted">{NOW.uptimeLabel}</span>
        <span className="font-astro text-accent" style={{ fontSize: "clamp(1rem, 2vw, 1.4rem)" }}>
          <UptimeCounter anchorIso={NOW.uptimeAnchor} />
        </span>
        <span
          className="font-astro text-accent animate-blink"
          style={{ fontSize: "clamp(1rem, 2vw, 1.4rem)" }}
          aria-hidden
        >
          ▮
        </span>
      </BlurText>
    </div>
  );
}
