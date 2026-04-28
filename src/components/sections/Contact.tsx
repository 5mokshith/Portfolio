"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { BlurText } from "@/components/effects/BlurText";
import { DecryptedText } from "@/components/effects/DecryptedText";
import { GlitchText } from "@/components/effects/GlitchText";

type Link = {
  label: string;
  href: string;
  external?: boolean;
  download?: boolean | string;
};

const SECONDARY: Link[] = [
  { label: "GITHUB", href: "https://github.com/5mokshith", external: true },
  { label: "LINKEDIN", href: "https://www.linkedin.com/in/mokshith-rao-50a385290", external: true },
  { label: "RESUME", href: "/resume.pdf", download: true },
];

const EMAIL = "mokshithrao1481@gmail.com";

/**
 * Section 07 — CONTACT.
 *
 * V1 vocabulary: dark bg, mono-caps frame, big Astro headline.
 * Drops the prior "COMMS OPEN / TRANSMISSION" cosplay. Replaced with a
 * personal, plain CTA — "let's build something" — and the email shown
 * in full as the primary action. Email button keeps the rim-trace from
 * the V1 StarBorder vocabulary; secondary links are hairline-outlined.
 */
export function Contact() {
  const [hover, setHover] = useState(false);

  return (
    <section
      id="contact"
      data-section="07-contact"
      className="relative isolate flex min-h-screen w-full flex-col bg-bg"
    >
      {/* warm wash + grain so it doesn't read as a flat slab */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(80% 60% at 50% 35%, rgba(255,45,45,0.08) 0%, rgba(10,10,10,0) 60%)," +
            "radial-gradient(50% 40% at 80% 80%, rgba(255,45,45,0.06) 0%, rgba(10,10,10,0) 60%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='2' stitchTiles='stitch' seed='9'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.45 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          backgroundSize: "240px 240px",
          opacity: 0.1,
          mixBlendMode: "overlay",
        }}
      />

      {/* top section header */}
      <div className="relative z-10 mx-auto mt-16 w-full max-w-7xl px-5 md:px-10">
        <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-hairline pb-5">
          <BlurText as="p" className="mono-caps text-muted">
            <span className="text-accent">07 ·</span> CONTACT
          </BlurText>
          <BlurText as="p" delay={120} className="mono-caps text-fg/55">
            <GlitchText idleInterval={9000}>LET&apos;S TALK</GlitchText>
          </BlurText>
        </div>
      </div>

      {/* main centered content */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col items-start justify-center px-5 py-24 md:px-10 md:py-32">
        {/* big headline */}
        <BlurText as="div">
          <h2
            className="font-astro leading-[0.92] text-fg"
            style={{ fontSize: "clamp(2.5rem, 8vw, 7rem)" }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <DecryptedText
              text="LET'S BUILD"
              triggerOnInView
              duration={1100}
              delay={150}
              className="block"
            />
            <motion.span
              className="block"
              animate={{ x: hover ? 6 : 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 22 }}
            >
              <span className="text-fg/35">SOMETHING.</span>
            </motion.span>
          </h2>
        </BlurText>

        {/* email row — primary CTA */}
        <BlurText as="div" delay={500} className="mt-10">
          <a
            href={`mailto:${EMAIL}`}
            className="group inline-flex items-baseline gap-3 border-b border-hairline-red pb-2 transition-colors"
            onMouseEnter={(e) => {
              e.currentTarget.style.borderBottomColor = "var(--accent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderBottomColor = "var(--hairline-red)";
            }}
          >
            <span className="font-astro text-accent" style={{ fontSize: "clamp(1.2rem, 2vw, 1.6rem)" }}>
              →
            </span>
            <span
              className="font-chakra text-fg group-hover:text-accent transition-colors"
              style={{ fontSize: "clamp(1.2rem, 2.4vw, 1.85rem)" }}
            >
              {EMAIL}
            </span>
          </a>
        </BlurText>

        {/* secondary links */}
        <BlurText
          as="div"
          delay={750}
          className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3"
        >
          {SECONDARY.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target={l.external ? "_blank" : undefined}
              rel={l.external ? "noopener noreferrer" : undefined}
              {...(l.download ? { download: true } : {})}
              className="contact-hairline-btn mono-caps inline-flex items-center rounded-sm px-5 py-3 text-fg/85 transition-colors hover:text-accent"
              style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace" }}
            >
              {l.label}
            </a>
          ))}
        </BlurText>
      </div>

      {/* footer signature row */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-10 md:px-10">
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-t border-hairline pt-5">
          <p
            className="mono-caps text-fg/55"
            style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace" }}
          >
            MOKSHITH RAO · KARIMNAGAR, IN · <span className="text-accent">2026</span>
          </p>
          <p
            className="mono-caps text-muted"
            style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace" }}
          >
            BUILT WITH NEXT.JS · GSAP · MOTION · DEPLOYED ON VERCEL
          </p>
          <a
            href="#top"
            className="mono-caps text-fg/70 transition-colors hover:text-accent"
          >
            ↑ BACK TO TOP
          </a>
        </div>
      </div>
    </section>
  );
}
