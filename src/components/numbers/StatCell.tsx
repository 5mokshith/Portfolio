"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import { CountUp } from "@/components/effects/CountUp";
import { Beams } from "@/components/numbers/Beams";
import { SquaresGrid } from "@/components/numbers/SquaresGrid";
import { CornerGlow } from "@/components/numbers/CornerGlow";
import { BorderGlowCard } from "@/components/numbers/BorderGlowCard";
import { PixelCanvas } from "@/components/numbers/PixelCanvas";
import type { Stat, StatBg } from "@/content/stats";

function Background({ bg }: { bg: StatBg }) {
  switch (bg) {
    case "beams":
      return <Beams />;
    case "squares":
      return <SquaresGrid />;
    case "glow-tl":
      return <CornerGlow corner="tl" />;
    case "glow-tr":
      return <CornerGlow corner="tr" />;
    case "glow-bl":
      return <CornerGlow corner="bl" />;
    case "glow-br":
      return <CornerGlow corner="br" />;
  }
}

// Iron Man gold mesh-gradient palette for the BorderGlow rim.
const GOLD_BORDER_COLORS = ["#FFD700", "#FFC72C", "#B8860B"] as const;

/**
 * One bento cell. Renders a CountUp digit with its unit label, a caption
 * underneath, and a per-cell ambient background variant.
 *
 * Border treatment is delegated to BorderGlowCard (cursor-tracked gold edge
 * glow + mesh-gradient rim). On hover, PixelCanvas layers a gold pixel field
 * over the ambient background; on leave, it drains back out.
 *
 * The hero cell still gets a hand-set lateral offset (the "human placed it"
 * anomaly for this section, parallel to About's 6px baseline drift) and
 * lands LAST in the section's stagger.
 */
export function StatCell({
  stat,
  countDelay = 0,
  className,
}: {
  stat: Stat;
  /** ms after the cell appears before the count up begins */
  countDelay?: number;
  /** column-span / sizing utilities applied externally */
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);

  const digitClass = "font-astro leading-[0.92] tracking-tight text-fg";
  const digitSize = stat.hero
    ? "clamp(5rem, 13vw, 9.5rem)"
    : "clamp(2.75rem, 6vw, 5rem)";
  const unitSize = stat.hero
    ? "clamp(1.4rem, 2.6vw, 2.2rem)"
    : "clamp(0.85rem, 1.4vw, 1.25rem)";

  return (
    <motion.div
      ref={ref}
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => setHovering(false)}
      initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{
        duration: 0.85,
        delay: countDelay / 1000,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ scale: 1.02 }}
      style={{
        // hand-set anomaly: hero cell sits 8px to the left of the grid edge
        translateX: stat.hero ? -8 : 0,
      }}
      className={`relative h-full ${className ?? ""}`}
    >
      <BorderGlowCard
        glowColor="45 100 60"
        glowIntensity={0.95}
        glowRadius={36}
        edgeSensitivity={26}
        coneSpread={28}
        borderRadius={6}
        backgroundColor="#0a0a0a"
        colors={GOLD_BORDER_COLORS}
        className="h-full"
      >
        <div className="relative isolate flex h-full flex-col justify-between overflow-hidden rounded-md p-6 md:p-8 lg:p-10">
          <Background bg={stat.bg} />
          <PixelCanvas active={hovering} />

          {/* digits + unit */}
          <div className="relative z-10 flex items-baseline gap-1">
            <span className={digitClass} style={{ fontSize: digitSize }}>
              <CountUp
                value={stat.value}
                decimals={stat.decimals ?? 0}
                duration={stat.hero ? 1800 : 1500}
                delay={countDelay}
              />
            </span>
            <span
              className="mono-caps text-fg/65"
              style={{
                fontFamily: "var(--font-declandar), ui-monospace, monospace",
                fontSize: unitSize,
                letterSpacing: "0.08em",
                marginLeft: stat.unitSpaced ? "0.35em" : "0.04em",
              }}
            >
              {stat.unit}
            </span>
          </div>

          {/* caption */}
          <div className="relative z-10 mt-6">
            <div className="mb-2 h-px w-8 bg-hairline-red" />
            <p
              className="mono-caps text-fg/55"
              style={{
                fontFamily: "var(--font-declandar), ui-monospace, monospace",
              }}
            >
              {stat.label}
            </p>
          </div>
        </div>
      </BorderGlowCard>
    </motion.div>
  );
}
