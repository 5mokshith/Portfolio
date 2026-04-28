"use client";

import { motion } from "motion/react";
import { BlurText } from "@/components/effects/BlurText";
import { GlitchText } from "@/components/effects/GlitchText";
import { DecryptedText } from "@/components/effects/DecryptedText";
import { RgbSplitText } from "@/components/effects";
import { StatusConsole } from "@/components/now/StatusConsole";
import { NOW } from "@/content/now";

const REVEAL_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * Section 06 — NOW.
 *
 * Status console at the top (live time, focus, location + uptime / current-build
 * tiles), the original 2-up entries panel preserved underneath, and a tail -f
 * style activity feed at the bottom. Headline gets RgbSplitText scrub.
 */
export function Now() {
  return (
    <section
      id="now"
      data-section="06-now"
      className="relative w-full bg-bg px-5 py-28 md:px-10 md:py-40 lg:px-20 lg:py-48"
    >
      <div className="mx-auto max-w-7xl">
        {/* section header */}
        <div className="mb-14 flex flex-wrap items-baseline justify-between gap-4 border-b border-hairline pb-5 md:mb-16">
          <BlurText as="p" className="mono-caps text-muted">
            <span className="text-accent">06 ·</span> NOW · UPDATED {NOW.updated.toUpperCase()}
          </BlurText>
          <BlurText as="p" delay={120} className="mono-caps text-fg/55">
            <GlitchText idleInterval={9000}>SNAPSHOT</GlitchText>
          </BlurText>
        </div>

        {/* big standfirst */}
        <div className="mb-16 grid grid-cols-1 gap-8 lg:mb-20 lg:grid-cols-12 lg:gap-14">
          <BlurText as="div" className="lg:col-span-7">
            <h2
              className="font-astro text-fg leading-[0.92]"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
            >
              WHAT I&apos;M<br />
              <span className="text-fg/35">DOING</span><br />
              <RgbSplitText scrub peakPx={5} as="span" className="text-accent">
                <DecryptedText
                  text="RIGHT NOW."
                  triggerOnInView
                  duration={1100}
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
            Inspired by{" "}
            <a
              href="https://nownownow.com/about"
              target="_blank"
              rel="noopener noreferrer"
              className="text-fg underline decoration-accent/60 underline-offset-4 transition-colors hover:text-accent"
            >
              /now pages
            </a>
            . A snapshot, not a stream. I bump it on edit, not by clock.
          </BlurText>
        </div>

        <div className="space-y-12">
          {/* status console — live time, focus, uptime, current build */}
          <StatusConsole
            uptimeStartIso={NOW.uptimeStartIso}
            currentBuild={NOW.currentBuild}
          />

          {/* original 2-up entries panel — preserved */}
          <div
            className="grid grid-cols-1 gap-px md:grid-cols-2"
            style={{ background: "var(--hairline)" }}
          >
            {NOW.entries.map((entry, i) => (
              <motion.div
                key={entry.label}
                initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.85, ease: REVEAL_EASE, delay: i * 0.08 }}
                className="group relative bg-bg p-7 transition-colors duration-300 hover:bg-black/60 md:p-9"
              >
                <p
                  className="mono-caps text-accent"
                  style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace" }}
                >
                  <DecryptedText
                    text={entry.label.toUpperCase()}
                    triggerOnInView
                    duration={700}
                    delay={i * 80}
                  />
                </p>
                <p className="mt-4 font-chakra text-[1rem] leading-[1.65] text-fg/85 md:text-[1.05rem]">
                  {entry.value}
                </p>
                <span
                  aria-hidden
                  className="pointer-events-none absolute left-7 right-7 top-0 h-px bg-hairline-red opacity-50 transition-opacity duration-300 group-hover:opacity-100 md:left-9 md:right-9"
                />
              </motion.div>
            ))}
          </div>

        </div>

        {/* availability strip */}
        <BlurText
          as="div"
          delay={500}
          className="mt-12 flex flex-wrap items-baseline justify-between gap-3 border-t border-hairline pt-5"
        >
          <p
            className="mono-caps"
            style={{
              fontFamily: "var(--font-declandar), ui-monospace, monospace",
              color: "var(--muted)",
            }}
          >
            <span className="pulse-dot inline-block mr-2 h-1.5 w-1.5 rounded-full bg-accent align-baseline" />
            <span className="text-fg/85">{NOW.availability.toUpperCase()}</span>
          </p>
          <p
            className="mono-caps text-fg/55"
            style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace" }}
          >
            KARIMNAGAR · UTC <span className="text-accent">+5:30</span>
          </p>
        </BlurText>

        {/* closing rule */}
        <div className="mt-20 flex flex-wrap items-baseline justify-between gap-3 border-t border-hairline pt-5 md:mt-28">
          <p
            className="mono-caps text-muted"
            style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace" }}
          >
            NEXT — CONTACT
          </p>
          <p
            className="mono-caps text-fg/45"
            style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace" }}
          >
            <span className="text-accent">→</span> 07
          </p>
        </div>
      </div>
    </section>
  );
}
