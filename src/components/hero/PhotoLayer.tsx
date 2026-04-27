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
 * Background photo layer for the Hero.
 *
 *  - Real <Image> rendered full-bleed.
 *  - SVG feColorMatrix duotone (black → bg, white → accent).
 *  - GSAP ken-burns: scale 1.00 → 1.03 over 20s, infinite yoyo.
 *  - Slowest mouse parallax (~5px max).
 *  - Scroll-out: desaturates further + fades as the user leaves the hero.
 */
export function PhotoLayer({ scrollHostRef }: { scrollHostRef: React.RefObject<HTMLElement | null> }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);

  // mouse parallax — slowest layer
  const { x, y } = useMouseParallax(5);

  // scroll progress (0 at hero top, 1 at hero bottom-leaves-viewport)
  const progress = useMotionValue(0);
  const desat = useTransform(progress, [0, 1], [0, 1]);
  const opacity = useTransform(progress, [0, 1], [1, 0.35]);
  const filter = useTransform(
    [desat, opacity],
    ([d, o]: number[]) =>
      `url(#hero-duotone-red) saturate(${1 - 0.7 * d}) brightness(${1 - 0.25 * d})`.concat(
        ` opacity(${o})`,
      ),
  );

  // ken-burns + scroll-trigger setup
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (!reduce && imgWrapRef.current) {
        gsap.to(imgWrapRef.current, {
          scale: 1.03,
          duration: 20,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
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
      {/* shared SVG filter — drawn once, off-screen */}
      <svg
        aria-hidden
        width="0"
        height="0"
        style={{ position: "absolute", width: 0, height: 0 }}
      >
        <defs>
          <filter id="hero-duotone-red" colorInterpolationFilters="sRGB">
            {/* desaturate */}
            <feColorMatrix
              type="matrix"
              values="0.299 0.587 0.114 0 0  0.299 0.587 0.114 0 0  0.299 0.587 0.114 0 0  0 0 0 1 0"
            />
            {/* map black → bg (#0a0a0a) and white → accent (#ff2d2d) */}
            <feComponentTransfer>
              <feFuncR type="table" tableValues="0.039 1" />
              <feFuncG type="table" tableValues="0.039 0.176" />
              <feFuncB type="table" tableValues="0.039 0.176" />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>

      <motion.div
        ref={wrapRef}
        style={{ x, y }}
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        <motion.div
          ref={imgWrapRef}
          style={{ filter, transformOrigin: "center 35%" }}
          className="absolute inset-0 h-full w-full"
        >
          <Image
            src="/hero.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>

        {/* extra grain on this layer specifically */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.1' numOctaves='2' stitchTiles='stitch' seed='3'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.7 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
            backgroundSize: "240px 240px",
            opacity: 0.18,
            mixBlendMode: "overlay",
          }}
        />

        {/* bottom darken vignette so text reads */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 30% 40%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 75%, rgba(0,0,0,0.85) 100%)",
          }}
        />
      </motion.div>
    </>
  );
}
