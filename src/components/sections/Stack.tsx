"use client";

import { motion } from "motion/react";
import { BlurText } from "@/components/effects/BlurText";
import { GlitchText } from "@/components/effects/GlitchText";
import { DecryptedText } from "@/components/effects/DecryptedText";
import { TIERS, TOTAL_ENTRIES } from "@/content/stack";

const REVEAL_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * Section 05 — STACK.
 *
 * V1 vocabulary: dark bg, mono-caps frame, big Astro headline.
 * Tier list replaces the prior diagram. Each tier is a horizontal row:
 * index + name on the left, role line, then a flow of pill chips.
 * Hairline-red borders on hover, like the project cards.
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
        <div className="mb-14 flex flex-wrap items-baseline justify-between gap-4 border-b border-hairline pb-5 md:mb-16">
          <BlurText as="p" className="mono-caps text-muted">
            <span className="text-accent">05 ·</span> STACK · {TIERS.length} TIERS · {TOTAL_ENTRIES} TOOLS
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
              <span className="text-accent">
                <DecryptedText
                  text="FOR."
                  triggerOnInView
                  duration={900}
                  delay={300}
                />
              </span>
            </h2>
          </BlurText>
          <BlurText
            as="p"
            delay={150}
            className="font-chakra max-w-[55ch] self-end text-fg/75 text-[15px] leading-[1.7] lg:col-span-5"
          >
            Not tutorials I&apos;ve finished. Things in active use across
            production projects, grouped by what they actually do.
          </BlurText>
        </div>

        {/* tier rows */}
        <div className="border-t border-hairline">
          {TIERS.map((tier, i) => (
            <motion.div
              key={tier.index}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.7, ease: REVEAL_EASE, delay: i * 0.06 }}
              className="group grid grid-cols-1 gap-x-8 gap-y-4 border-b border-hairline py-7 transition-colors duration-300 hover:border-hairline-red md:grid-cols-12 md:gap-y-3 md:py-9"
            >
              {/* left — index + name */}
              <div className="md:col-span-4 lg:col-span-3">
                <p
                  className="mono-caps text-accent/85"
                  style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace" }}
                >
                  {tier.index}
                </p>
                <h3
                  className="mt-1 font-astro leading-tight text-fg"
                  style={{ fontSize: "clamp(1.6rem, 2.6vw, 2.4rem)" }}
                >
                  {tier.name}
                </h3>
                <p
                  className="mt-2 mono-caps text-muted"
                  style={{
                    fontFamily: "var(--font-declandar), ui-monospace, monospace",
                    fontSize: 10,
                  }}
                >
                  {tier.roleLine}
                </p>
              </div>

              {/* right — tool pills */}
              <ul className="flex flex-wrap items-baseline gap-x-2 gap-y-2 md:col-span-8 md:self-center lg:col-span-9">
                {tier.tools.map((t) => (
                  <li
                    key={t.name}
                    className="group/pill mono-caps relative inline-flex items-baseline gap-2 border border-hairline px-3 py-1.5 text-fg/85 transition-colors duration-300 hover:border-accent hover:text-accent"
                    style={{
                      fontFamily: "var(--font-declandar), ui-monospace, monospace",
                      fontSize: 11,
                    }}
                  >
                    <span>{t.name}</span>
                    <span
                      className="text-fg/40 transition-colors group-hover/pill:text-accent/70"
                      style={{ fontSize: 9 }}
                    >
                      · {t.role}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* closing rule */}
        <div className="mt-20 flex flex-wrap items-baseline justify-between gap-3 border-t border-hairline pt-5 md:mt-28">
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
            <span className="text-accent">→</span> 06
          </p>
        </div>
      </div>
    </section>
  );
}
