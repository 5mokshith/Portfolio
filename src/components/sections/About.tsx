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
 * Editorial-poster layout. Text column on the left carries the voice;
 * photo column on the right carries the design weight (cyan offset block,
 * registration crosses, tick marks, vertical archive stamp, file stamp).
 *
 * Tightened to two beats of copy: a one-paragraph intro and a pull-quote
 * on the line that matters. No fact strip — the bio already says it.
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

        <div className="grid grid-cols-1 items-start gap-14 md:grid-cols-12 md:gap-12 lg:gap-20">
          {/* left — text */}
          <div className="md:col-span-7 lg:col-span-7 order-2 md:order-1 md:pt-[6px]">
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

            {/* one-paragraph intro */}
            <BlurText
              as="p"
              delay={0}
              className="font-chakra max-w-[52ch] text-fg/85 leading-[1.65]"
            >
              <span style={{ fontSize: "1.1rem" }}>
                Founding engineer at{" "}
                <span className="text-fg">Flashback Labs</span>. TypeScript, Go, and most of the AWS bill. If you&apos;re building something hard,{" "}
                <a
                  href="#contact"
                  className="text-fg underline decoration-accent/60 underline-offset-4 transition-colors hover:text-accent"
                >
                  let&apos;s talk
                </a>
                .
              </span>
            </BlurText>

            {/* pull quote */}
            <BlurText as="div" delay={150} className="mt-9 mb-2">
              <blockquote
                className="relative max-w-[40ch] border-l-2 pl-6"
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

            {/* status typer — kinetic close on the text column */}
            <BlurText
              as="div"
              delay={400}
              className="mt-10 border-t pt-4 max-w-[52ch]"
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

          {/* right — photo */}
          <div className="md:col-span-5 lg:col-span-5 order-1 md:order-2">
            <BlurText as="div">
              <PhotoStack src="/about.jpg" alt="Mokshith Rao" />
              <p
                className="mt-4 mono-caps text-muted"
                style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace" }}
              >
                <span style={{ color: "var(--cyan)" }}>◆</span> KARIMNAGAR, IN · b. 2004
              </p>
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
