"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

/**
 * Photo block for the About section.
 *
 *  - Renders /about.jpg through a Tilted Card: 3D rotation tracks cursor
 *    position over the card. Spring-smoothed so it feels weighted, not jittery.
 *  - No duotone (different mood from the Hero — this one stays close to true color).
 *    Slight desaturation + grain only.
 *  - Red rim glow intensifies on hover.
 *  - Mono "museum plaque" caption sits beneath.
 */
export function AboutPhoto() {
  const ref = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 180, damping: 22, mass: 0.5 });
  const sy = useSpring(my, { stiffness: 180, damping: 22, mass: 0.5 });

  const rotateX = useTransform(sy, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-8, 8]);
  // tiny inner shift on the image so the parallax feels in-card, not flat
  const innerX = useTransform(sx, [-0.5, 0.5], [-12, 12]);
  const innerY = useTransform(sy, [-0.5, 0.5], [-12, 12]);

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const handleLeave = () => {
    mx.set(0);
    my.set(0);
    setHovering(false);
  };

  return (
    <div className="relative">
      <motion.div
        ref={ref}
        onPointerMove={handleMove}
        onPointerEnter={() => setHovering(true)}
        onPointerLeave={handleLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1200 }}
        className="relative aspect-[3/4] w-full overflow-hidden rounded-[2px] will-change-transform"
      >
        {/* the image — slightly oversized so inner parallax doesn't reveal edges */}
        <motion.div
          style={{ x: innerX, y: innerY }}
          className="absolute -inset-[6%] h-[112%] w-[112%]"
        >
          <Image
            src="/about.jpg"
            alt="Mokshith Rao"
            fill
            sizes="(max-width: 768px) 100vw, 40vw"
            className="object-cover"
            style={{
              filter: "saturate(0.85) contrast(1.05) brightness(0.95)",
            }}
          />
        </motion.div>

        {/* layer-grain on top of the photo */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='2' stitchTiles='stitch' seed='5'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
            backgroundSize: "240px 240px",
            opacity: 0.14,
            mixBlendMode: "overlay",
          }}
        />

        {/* hairline border — sits inside the rounded box */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            boxShadow: hovering
              ? "inset 0 0 0 1px rgba(255,45,45,0.55), 0 0 60px rgba(255,45,45,0.3), 0 30px 80px -40px rgba(0,0,0,0.8)"
              : "inset 0 0 0 1px rgba(255,255,255,0.08), 0 30px 80px -40px rgba(0,0,0,0.8)",
            transition: "box-shadow 350ms ease",
          }}
        />

        {/* corner index — ties back to the hero HUD vocabulary */}
        <p
          className="mono-caps absolute right-3 top-3 text-fg/80"
          style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace" }}
        >
          02 / FILE
        </p>
      </motion.div>

      {/* museum plaque caption */}
      <p
        className="mono-caps mt-5 text-muted"
        style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace" }}
      >
        MOKSHITH RAO · KARIMNAGAR, IN · 2026
      </p>
    </div>
  );
}
