"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { BlurText } from "@/components/effects/BlurText";
import { DecryptedText } from "@/components/effects/DecryptedText";
import { GlitchText } from "@/components/effects/GlitchText";
import { ContactPhotoLayer } from "@/components/contact/ContactPhotoLayer";
import { MagnetButton } from "@/components/contact/MagnetButton";
import { StarBorder } from "@/components/contact/StarBorder";

type Link = {
  label: string;
  href: string;
  external?: boolean;
  download?: boolean | string;
  primary?: boolean;
};

const LINKS: Link[] = [
  { label: "EMAIL", href: "mailto:mokshithrao1481@gmail.com", primary: true },
  { label: "GITHUB", href: "https://github.com/5mokshith", external: true },
  {
    label: "LINKEDIN",
    href: "https://www.linkedin.com/in/mokshith-rao-50a385290",
    external: true,
  },
  // TODO: X handle pending — wire when confirmed
  { label: "X", href: "#", external: true },
  { label: "RESUME", href: "/resume.pdf", download: true },
];

/**
 * Section 07 — CONTACT.
 *
 * Bookend to the Hero: same hero.jpg, darker crush, opposite Ken-Burns,
 * minimal HUD (4 corner viewfinders only). Centered content: glitched
 * "COMMS OPEN" label, Astro closing line ("founding engineer at 21."),
 * five Magnet buttons. Email CTA wears the StarBorder rim trace.
 *
 * Easter-egg: hovering the EMAIL button nudges the closing line 2px right.
 */
export function Contact() {
  const [emailHover, setEmailHover] = useState(false);

  return (
    <section
      data-section="07-contact"
      className="relative isolate flex min-h-screen w-full flex-col bg-bg"
    >
      <ContactPhotoLayer />

      {/* main centered content */}
      <div className="relative z-20 flex flex-1 flex-col items-center justify-center px-6 py-32 text-center md:py-40">
        <BlurText as="p" className="mono-caps text-fg/70 mb-6">
          <GlitchText idleInterval={7000}>COMMS OPEN</GlitchText>
        </BlurText>

        <motion.h2
          className="font-astro text-fg leading-[0.95] max-w-[16ch] mx-auto"
          style={{ fontSize: "clamp(2.25rem, 5.5vw, 4.75rem)" }}
          animate={{ x: emailHover ? 2 : 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 22 }}
        >
          <DecryptedText
            text="founding engineer at 21."
            triggerOnInView
            duration={1300}
            delay={400}
          />
        </motion.h2>

        <BlurText
          as="div"
          delay={1400}
          className="mt-12 flex flex-wrap items-center justify-center gap-3 md:mt-14 md:gap-4"
        >
          {LINKS.map((link) =>
            link.primary ? (
              <StarBorder key={link.label}>
                <MagnetButton
                  href={link.href}
                  external={link.external}
                  download={link.download}
                  ariaLabel={link.label}
                  onHoverChange={setEmailHover}
                  className="mono-caps inline-flex items-center px-5 py-3 text-fg transition-colors hover:text-accent"
                >
                  {link.label}
                </MagnetButton>
              </StarBorder>
            ) : (
              <MagnetButton
                key={link.label}
                href={link.href}
                external={link.external}
                download={link.download}
                ariaLabel={link.label}
                className="contact-hairline-btn mono-caps inline-flex items-center rounded-sm px-5 py-3 text-fg/85 transition-colors hover:text-accent"
              >
                {link.label}
              </MagnetButton>
            ),
          )}
        </BlurText>
      </div>

      {/* footer — hairline rule above, mono caps row */}
      <div className="relative z-20 px-6 pb-10 md:px-10">
        <div
          className="mx-auto flex max-w-7xl flex-wrap items-baseline justify-between gap-3 border-t pt-5"
          style={{ borderColor: "var(--hairline)" }}
        >
          <p className="mono-caps text-fg/55">
            MOKSHITH RAO · KARIMNAGAR, IN · 2026
          </p>
          <p className="mono-caps text-muted">
            BUILT WITH NEXT.JS · GSAP · REACTBITS · DEPLOYED ON VERCEL
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
