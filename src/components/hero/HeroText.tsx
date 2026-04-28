"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "motion/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMouseParallax } from "@/lib/useMouseParallax";
import { DecryptedText } from "@/components/effects/DecryptedText";

/**
 * Hero text layer. Pushed off-axis to the lower-left of the viewport so the
 * composition reads asymmetric, not centered. Name decodes in on mount; the
 * thesis line fades in only after the decoder finishes.
 *
 * Fastest mouse parallax (~20px). Lifts and fades on scroll-out.
 */
export function HeroText({ scrollHostRef }: { scrollHostRef: React.RefObject<HTMLElement | null> }) {
  const { x, y } = useMouseParallax(20, 70, 18);
  const [thesisVisible, setThesisVisible] = useState(false);

  // surface the thesis only after the name decoder finishes (~1.4s incl. delay)
  useEffect(() => {
    const t = setTimeout(() => setThesisVisible(true), 1500);
    return () => clearTimeout(t);
  }, []);

  // scroll-out lift + fade
  const progress = useMotionValue(0);
  const lift = useTransform(progress, [0, 1], [0, -120]);
  const opacity = useTransform(progress, [0, 0.7, 1], [1, 0.6, 0]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = scrollHostRef.current;
    if (!host) return;
    const st = ScrollTrigger.create({
      trigger: host,
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => progress.set(self.progress),
    });
    return () => st.kill();
  }, [scrollHostRef, progress]);

  return (
    <motion.div
      ref={ref}
      style={{ x, y, opacity }}
      className="pointer-events-none absolute inset-0 z-20 flex items-end"
    >
      <motion.div
        style={{ y: lift }}
        className="w-full px-5 pb-20 md:px-12 md:pb-28 lg:px-20 lg:pb-32"
      >
        {/* role line — small mono caps, factual */}
        <p
          className="mono-caps text-fg/80"
          style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace" }}
        >
          <span className="text-accent">HI</span>
          <span className="mx-3 text-fg/40">·</span>
          <span>I&apos;M MOKSHITH</span>
          <span className="mx-3 text-fg/40">·</span>
          <span className="text-fg/70">KARIMNAGAR, IN</span>
        </p>

        {/* name — decoded in.
           mt is generous because line-height: 0.84 lets glyph tops poke
           above the line box; without it the role line gets clipped. */}
        <h1
          className="font-astro leading-[0.84] tracking-tight text-fg mt-10 md:mt-16"
          style={{
            fontSize: "clamp(2.6rem, 11vw, 10rem)",
            textShadow: "0 0 32px rgba(0,0,0,0.55)",
          }}
        >
          <DecryptedText text="MOKSHITH" duration={900} delay={120} className="block" />
          <DecryptedText
            text="RAO"
            duration={700}
            delay={650}
            className="block translate-x-[6%] mt-2"
          />
        </h1>

        {/* thesis — fades in after the decoder lands */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={thesisVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="font-chakra italic text-fg/85 mt-6 md:mt-8 max-w-[28ch] md:max-w-[48ch] text-base md:text-xl"
        >
          21, founding engineer at flashback labs. typescript, go, and most of the AWS bill.
        </motion.p>

        {/* small separator + sub-stat */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={thesisVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex items-center gap-4"
        >
          <span className="block h-px w-10" style={{ background: "var(--accent)" }} />
          <p className="mono-caps text-fg/55" style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace" }}>
            442K assets · 590K tweets · 13d runtime
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
