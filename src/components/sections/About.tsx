"use client";

import { BlurText } from "@/components/effects/BlurText";
import { DecryptedText } from "@/components/effects/DecryptedText";
import { GlitchText } from "@/components/effects/GlitchText";
import { RgbSplitText } from "@/components/effects/RgbSplitText";
import { PhotoStack } from "@/components/about/PhotoStack";
import { StatusTyper } from "@/components/about/StatusTyper";

/**
 * Section 02 — About.
 *
 * Editorial-poster layout. Photo column carries the visual weight: cyan
 * offset block + oversized "02" + maker's stamp + scroll-driven drift,
 * with the rotating "currently …" status typer underneath as the kinetic
 * footer. Bio column leads with a big greeting, drops a pull-quote on
 * the strongest line, and closes with a fact strip.
 */
export function About() {
  return (
    <section
      id="about"
      data-section="02-about"
      className="relative w-full bg-bg px-5 py-28 md:px-10 md:py-40 lg:px-20 lg:py-44"
    >
      <div className="mx-auto max-w-7xl">
        {/* section header */}
        <div className="mb-14 flex flex-wrap items-baseline justify-between gap-4 border-b border-hairline pb-5">
          <BlurText as="p" className="mono-caps text-muted">
            <span className="text-accent">02 ·</span> ABOUT
          </BlurText>
          <BlurText as="p" delay={120} className="mono-caps text-fg/55">
            <GlitchText idleInterval={9000}>HI, I&apos;M MOKSHITH</GlitchText>
          </BlurText>
        </div>

        <div className="grid grid-cols-1 gap-14 md:grid-cols-12 md:gap-12 lg:gap-20">
          {/* left — photo column carries kinetic weight */}
          <div className="md:col-span-5 lg:col-span-5">
            <BlurText as="div">
              <PhotoStack src="/about.jpg" alt="Mokshith Rao" />

              {/* location caption directly under photo */}
              <p
                className="mt-4 mono-caps text-muted"
                style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace" }}
              >
                <span style={{ color: "var(--cyan)" }}>◆</span> KARIMNAGAR, IN · b. 2004
              </p>
            </BlurText>

            {/* status typer — kinetic footer of the photo column */}
            <BlurText
              as="div"
              delay={400}
              className="mt-6 border-t pt-4"
              style={{ borderColor: "var(--hairline-cyan)" }}
            >
              <StatusTyper
                entries={[
                  { label: "currently building", value: "Phase-2 of the Grok pipeline — pushing toward 1M assets" },
                  { label: "currently reading", value: "Tigerbeetle internals + DDIA chapters 7-9" },
                  { label: "currently breaking", value: "my own Go code, on purpose, in tests" },
                ]}
              />
            </BlurText>
          </div>

          {/* right — bio column */}
          <div className="md:col-span-7 lg:col-span-7 md:pt-[6px]">
            {/* big Astro greeting */}
            <BlurText as="div" className="mb-10">
              <h2
                className="font-astro text-fg leading-[0.95]"
                style={{ fontSize: "clamp(2.25rem, 5vw, 4.25rem)" }}
              >
                <RgbSplitText scrub peakPx={5} as="span" className="block">
                  <DecryptedText text="HI," triggerOnInView duration={700} delay={120} />
                </RgbSplitText>
                <span className="block">
                  I&apos;M{" "}
                  <RgbSplitText scrub cursor peakPx={6} as="span" className="text-accent">
                    <DecryptedText text="MOKSHITH." triggerOnInView duration={1100} delay={400} />
                  </RgbSplitText>
                </span>
              </h2>
            </BlurText>

            {/* lead paragraph */}
            <BlurText
              as="p"
              delay={0}
              className="font-chakra max-w-[58ch] text-fg/85 leading-[1.65]"
            >
              <span style={{ fontSize: "1.15rem" }}>
                I&apos;m 21, finishing my B.Tech in CS at Jyothishmathi Institute this April. I&apos;ve been the founding engineer at{" "}
                <span className="text-fg">Flashback Labs</span> since September 2024 — TypeScript, Go, and most of the AWS bill.
              </span>
            </BlurText>

            {/* pull quote — the strongest line, large + cyan rule */}
            <BlurText as="div" delay={150} className="my-9">
              <blockquote
                className="relative max-w-[42ch] border-l-2 pl-6"
                style={{ borderColor: "var(--cyan)" }}
              >
                <p
                  className="font-astro text-fg leading-[1.2]"
                  style={{ fontSize: "clamp(1.35rem, 2.3vw, 1.95rem)" }}
                >
                  The plumbing that decides whether a system actually{" "}
                  <span className="text-accent">holds</span> under load &mdash; or just demos well.
                </p>
                <p
                  className="mt-3 mono-caps text-muted"
                  style={{
                    fontFamily: "var(--font-declandar), ui-monospace, monospace",
                    fontSize: 10,
                    letterSpacing: "0.22em",
                  }}
                >
                  <span style={{ color: "var(--cyan)" }}>—</span> WHAT I CARE ABOUT
                </p>
              </blockquote>
            </BlurText>

            {/* supporting body */}
            <BlurText
              as="p"
              delay={300}
              className="font-chakra max-w-[58ch] text-fg/75 text-[1rem] leading-[1.7]"
            >
              I like the unglamorous half of AI: pipelines, runtimes, on-device inference. Outside work I&apos;m usually reading distributed-systems papers, breaking my own code on purpose, or shipping a weekend project nobody asked for. If you&apos;re building something hard,{" "}
              <a
                href="#contact"
                className="text-fg underline decoration-accent/60 underline-offset-4 transition-colors hover:text-accent"
              >
                let&apos;s talk
              </a>
              .
            </BlurText>

            {/* fact strip — HUD: pulsing dots alternating red/cyan, hover reveals caption */}
            <BlurText
              as="div"
              delay={500}
              className="mt-12 grid grid-cols-3 gap-4 border-t border-hairline pt-5"
            >
              {[
                { label: "ROLE", value: "Founding engineer · Flashback Labs", caption: "Sept 2024 — present", dot: "red" as const },
                { label: "STUDYING", value: "B.Tech CSE · grad APR 2026", caption: "Jyothishmathi Institute", dot: "cyan" as const },
                { label: "WRITING IN", value: "TypeScript · Go · SQL", caption: "+ a little Python when forced", dot: "red" as const },
              ].map((cell) => (
                <div key={cell.label} className="group relative">
                  <p
                    className="mono-caps text-muted flex items-center gap-2"
                    style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace" }}
                  >
                    <span
                      className="pulse-dot inline-block h-1.5 w-1.5 rounded-full"
                      style={{ background: cell.dot === "red" ? "var(--accent)" : "var(--cyan)" }}
                    />
                    {cell.label}
                  </p>
                  <p className="mt-2 font-chakra text-[0.95rem] leading-snug text-fg/85">{cell.value}</p>
                  <p
                    className="mt-1 mono-caps text-fg/35 opacity-60 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace", fontSize: 9 }}
                  >
                    {cell.caption}
                  </p>
                </div>
              ))}
            </BlurText>
          </div>
        </div>

        {/* closing rule */}
        <div className="mt-20 flex flex-wrap items-baseline justify-between gap-3 border-t border-hairline pt-5">
          <p
            className="mono-caps text-muted"
            style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace" }}
          >
            NEXT — SELECTED WORK
          </p>
          <p
            className="mono-caps text-fg/45"
            style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace" }}
          >
            <span className="text-accent">→</span> 03
          </p>
        </div>
      </div>
    </section>
  );
}
