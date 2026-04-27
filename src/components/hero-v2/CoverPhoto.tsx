"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useMouseParallax } from "@/lib/useMouseParallax";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Editorial cover photo — gold/charcoal duotone.
 *
 * Same SVG feColorMatrix technique as v1 but mapped to warm charcoal
 * (#14100E) and antique gold (#D4A24C). Slow vertical drift instead of
 * ken-burns; barely-there mouse parallax (3px). On scroll-out the photo
 * desaturates further and fades.
 */
export function CoverPhoto({
  scrollHostRef,
}: {
  scrollHostRef: React.RefObject<HTMLElement | null>;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);

  const { x, y } = useMouseParallax(3);

  const progress = useMotionValue(0);
  const desat = useTransform(progress, [0, 1], [0, 1]);
  const opacity = useTransform(progress, [0, 1], [1, 0.4]);
  const filter = useTransform(
    [desat, opacity],
    ([d, o]: number[]) =>
      `url(#hero-v2-duotone-gold) saturate(${1 - 0.6 * d}) brightness(${1 - 0.2 * d}) opacity(${o})`,
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (!reduce && imgWrapRef.current) {
        // gentle vertical drift — 24px over 18s, like a printed page lifting
        gsap.fromTo(
          imgWrapRef.current,
          { yPercent: -1.5 },
          {
            yPercent: 1.5,
            duration: 18,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          },
        );
      }
      const host = scrollHostRef.current;
      if (host) {
        ScrollTrigger.create({
          trigger: host,
          start: "top top",
          end: "bottom top",
          scrub: true,
          onUpdate: (self) => progress.set(self.progress),
        });
      }
    }, wrapRef);
    return () => ctx.revert();
  }, [progress, scrollHostRef]);

  return (
    <>
      {/* SVG duotone filter — black→bg-deep, white→gold-antique */}
      <svg
        aria-hidden
        width="0"
        height="0"
        style={{ position: "absolute", width: 0, height: 0 }}
      >
        <defs>
          <filter id="hero-v2-duotone-gold" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="0.299 0.587 0.114 0 0  0.299 0.587 0.114 0 0  0.299 0.587 0.114 0 0  0 0 0 1 0"
            />
            {/* black (0) → #14100E ; white (1) → #D4A24C */}
            <feComponentTransfer>
              <feFuncR type="table" tableValues="0.078 0.831" />
              <feFuncG type="table" tableValues="0.063 0.635" />
              <feFuncB type="table" tableValues="0.055 0.298" />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>

      <motion.div
        ref={wrapRef}
        style={{ x, y }}
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* mount-in mask reveal — wipes from top */}
        <motion.div
          ref={imgWrapRef}
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
          style={{ filter, transformOrigin: "center 40%" }}
          className="absolute inset-0 h-full w-full"
        >
          <Image
            src="/hero.jpg"
            alt=""
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover object-center"
          />
        </motion.div>

        {/* film grain — heavier than v1's because editorial paper feel */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='2' stitchTiles='stitch' seed='7'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
            backgroundSize: "240px 240px",
            opacity: 0.22,
            mixBlendMode: "overlay",
          }}
        />

        {/* warm vignette — pulls eye to upper-center where face sits */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 75% 60% at 50% 40%, rgba(20,16,14,0) 0%, rgba(20,16,14,0.4) 70%, rgba(20,16,14,0.85) 100%)",
          }}
        />
      </motion.div>
    </>
  );
}
