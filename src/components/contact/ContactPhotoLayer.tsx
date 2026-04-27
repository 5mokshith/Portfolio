"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { gsap } from "gsap";
import Image from "next/image";

/**
 * Bookend treatment of the hero photo. Same image (`/hero.jpg`),
 * different cinematography:
 *
 *  - Deeper duotone (red mapped slightly darker than Hero)
 *  - Heavier crush — saturate(0.85), brightness(0.55)
 *  - Slow Ken-Burns drifting DOWN-RIGHT (Hero drifted up; this is the
 *    return arc)
 *  - 4 corner viewfinder marks. No gridlines, no telemetry.
 */
export function ContactPhotoLayer() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !imgRef.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const ctx = gsap.context(() => {
      // start zoomed in slightly, drift to a different framing.
      gsap.fromTo(
        imgRef.current,
        { scale: 1.06, x: "-1.2%", y: "-0.8%" },
        {
          scale: 1.0,
          x: "1.2%",
          y: "1.5%",
          duration: 22,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        },
      );
    }, wrapRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* deeper duotone filter — keeps name distinct from Hero's */}
      <svg
        aria-hidden
        width="0"
        height="0"
        style={{ position: "absolute", width: 0, height: 0 }}
      >
        <defs>
          <filter id="contact-duotone-red" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="0.299 0.587 0.114 0 0  0.299 0.587 0.114 0 0  0.299 0.587 0.114 0 0  0 0 0 1 0"
            />
            <feComponentTransfer>
              {/* black → near-bg, white → deeper red than Hero (0.85 vs 1.0) */}
              <feFuncR type="table" tableValues="0.020 0.85" />
              <feFuncG type="table" tableValues="0.020 0.110" />
              <feFuncB type="table" tableValues="0.020 0.110" />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>

      <motion.div
        ref={wrapRef}
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        <div
          ref={imgRef}
          className="absolute inset-0 h-full w-full"
          style={{
            filter:
              "url(#contact-duotone-red) saturate(0.85) brightness(0.55)",
            transformOrigin: "center 60%",
          }}
        >
          <Image
            src="/hero.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>

        {/* heavier grain than Hero */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.4' numOctaves='2' stitchTiles='stitch' seed='9'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.85 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
            backgroundSize: "240px 240px",
            opacity: 0.26,
            mixBlendMode: "overlay",
          }}
        />

        {/* heavy vignette — crushes edges */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 50% 45%, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.65) 70%, rgba(0,0,0,0.92) 100%)",
          }}
        />
      </motion.div>

      {/* 4 corner viewfinder marks — only HUD element this section has */}
      {[
        "left-6 top-6 border-l-2 border-t-2",
        "right-6 top-6 border-r-2 border-t-2",
        "left-6 bottom-6 border-l-2 border-b-2",
        "right-6 bottom-6 border-r-2 border-b-2",
      ].map((cls, i) => (
        <span
          key={i}
          aria-hidden
          className={`pointer-events-none absolute z-10 h-5 w-5 md:h-7 md:w-7 ${cls}`}
          style={{ borderColor: "var(--accent)", filter: "drop-shadow(0 0 8px var(--accent-glow))" }}
        />
      ))}
    </>
  );
}
