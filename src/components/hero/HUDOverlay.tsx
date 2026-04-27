"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMouseParallax } from "@/lib/useMouseParallax";

/**
 * HUD chrome layer: gridlines, corner viewfinders, off-center reticle,
 * top-right telemetry readout. Medium mouse parallax (~10px). Fades on scroll-out.
 */
export function HUDOverlay({ scrollHostRef }: { scrollHostRef: React.RefObject<HTMLElement | null> }) {
  const { x, y } = useMouseParallax(10, 90, 18);
  const scrollProgress = useMotionValue(0);
  const opacity = useTransform(scrollProgress, [0, 0.55, 1], [1, 0.35, 0]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = scrollHostRef.current;
    if (!host) return;
    const st = ScrollTrigger.create({
      trigger: host,
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => scrollProgress.set(self.progress),
    });
    return () => st.kill();
  }, [scrollHostRef, scrollProgress]);

  return (
    <motion.div
      ref={ref}
      aria-hidden
      style={{ x, y, opacity }}
      className="pointer-events-none absolute inset-0 z-10"
    >
      {/* ── grid lines (very faint red), masked to fade off the edges ── */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,45,45,0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,45,45,0.06) 1px, transparent 1px)
          `,
          backgroundSize: "120px 120px, 120px 120px",
          maskImage:
            "radial-gradient(ellipse 90% 80% at 50% 50%, #000 30%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 90% 80% at 50% 50%, #000 30%, transparent 100%)",
        }}
      />

      {/* ── corner viewfinder marks ── */}
      <CornerMark className="left-6 top-6" />
      <CornerMark className="right-6 top-6" rotate={90} />
      <CornerMark className="right-6 bottom-6" rotate={180} />
      <CornerMark className="left-6 bottom-6" rotate={270} />

      {/* ── off-center reticle (single, upper-right quadrant) ── */}
      <Reticle className="absolute left-[68%] top-[28%]" />

      {/* ── top-right telemetry readout ── */}
      <div className="absolute right-8 top-8 text-right">
        <p className="mono-caps text-fg/70" style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace" }}>
          LAT 18.4386° N · LONG 79.1288° E · KARIMNAGAR
        </p>
        <p className="mono-caps mt-2 inline-flex items-center gap-2 text-fg" style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace" }}>
          <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-accent" style={{ boxShadow: "0 0 8px var(--accent-glow)" }} />
          STATION ACTIVE
        </p>
      </div>

      {/* ── bottom-left build stamp ── */}
      <div className="absolute bottom-8 left-8">
        <p className="mono-caps text-fg/45" style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace" }}>
          BUILD 0.01 · CHANNEL [01/HERO] · TS {new Date().getUTCFullYear()}
        </p>
      </div>

      {/* ── scroll cue, bottom-center ── */}
      <ScrollCue />
    </motion.div>
  );
}

/** L-shaped glowing corner mark, rotated to taste. */
function CornerMark({ className = "", rotate = 0 }: { className?: string; rotate?: number }) {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      style={{ transform: `rotate(${rotate}deg)`, filter: "drop-shadow(0 0 6px rgba(255,45,45,0.55))" }}
      className={`absolute ${className}`}
    >
      <path d="M2 14 L2 2 L14 2" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  );
}

/** Targeting reticle bracket — squared brackets around a center dot. */
function Reticle({ className = "" }: { className?: string }) {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 80 80"
      className={className}
      style={{ filter: "drop-shadow(0 0 6px rgba(255,45,45,0.45))" }}
    >
      {/* corner brackets */}
      {[
        "M2 14 L2 2 L14 2",
        "M66 2 L78 2 L78 14",
        "M78 66 L78 78 L66 78",
        "M14 78 L2 78 L2 66",
      ].map((d, i) => (
        <path key={i} d={d} fill="none" stroke="var(--accent)" strokeWidth="1.25" strokeLinecap="square" />
      ))}
      {/* crosshair */}
      <line x1="40" y1="28" x2="40" y2="36" stroke="var(--accent)" strokeWidth="1" />
      <line x1="40" y1="44" x2="40" y2="52" stroke="var(--accent)" strokeWidth="1" />
      <line x1="28" y1="40" x2="36" y2="40" stroke="var(--accent)" strokeWidth="1" />
      <line x1="44" y1="40" x2="52" y2="40" stroke="var(--accent)" strokeWidth="1" />
      <circle cx="40" cy="40" r="1.5" fill="var(--accent)" />
    </svg>
  );
}

/** Subtle scroll cue at the bottom — caret + label, gentle bob. */
function ScrollCue() {
  useEffect(() => {
    const el = document.querySelector<HTMLElement>('[data-cue="scroll"]');
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const tween = gsap.to(el, {
      y: 6,
      duration: 1.4,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });
    return () => {
      tween.kill();
    };
  }, []);

  return (
    <div
      data-cue="scroll"
      className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center"
    >
      <p className="mono-caps text-fg/55" style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace" }}>
        SCROLL · ENTRY 02 / ABOUT
      </p>
      <svg width="14" height="22" viewBox="0 0 14 22" className="mx-auto mt-2">
        <path d="M7 1 V18 M2 13 L7 18 L12 13" stroke="var(--accent)" strokeWidth="1.25" fill="none" strokeLinecap="square" />
      </svg>
    </div>
  );
}
