"use client";

import { motion } from "motion/react";

type BeamsProps = {
  /** primary beam color in rgba/hex/named — default red */
  primaryColor?: string;
  /** optional secondary beam color, rendered at half opacity with screen blend */
  secondaryColor?: string;
};

const PRIMARY_DEFAULT = "rgba(255,45,45,";
const SECONDARY_DEFAULT = "rgba(0,255,157,";

/**
 * Drifting beam streaks for the hero stat cell. Three stacked diagonal
 * gradient slabs in the primary color, plus a phase-shifted trio in the
 * secondary color blended via `mix-blend-mode: screen`. The two channels
 * read as RGB chromatic aberration on the ambient field.
 *
 * Each slab translates through one full cycle when the cell scrolls into
 * view, then comes to rest at the starting offset — single signal, not a
 * constant hum.
 */
export function Beams({
  primaryColor = PRIMARY_DEFAULT,
  secondaryColor = SECONDARY_DEFAULT,
}: BeamsProps = {}) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* primary stack */}
      <motion.div
        className="absolute -inset-[20%]"
        style={{
          background: `linear-gradient(110deg, transparent 38%, ${primaryColor}0.22) 50%, transparent 62%)`,
        }}
        initial={{ x: "-12%", y: "-8%" }}
        whileInView={{ x: ["-12%", "14%", "-12%"], y: ["-8%", "8%", "-8%"] }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 14, ease: [0.42, 0, 0.58, 1], times: [0, 0.5, 1] }}
      />
      <motion.div
        className="absolute -inset-[20%]"
        style={{
          background: `linear-gradient(115deg, transparent 30%, ${primaryColor}0.13) 50%, transparent 70%)`,
        }}
        initial={{ x: "10%", y: "6%" }}
        whileInView={{ x: ["10%", "-12%", "10%"], y: ["6%", "-10%", "6%"] }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 18, ease: [0.42, 0, 0.58, 1], times: [0, 0.5, 1] }}
      />
      <motion.div
        className="absolute -inset-[20%]"
        style={{
          background: `linear-gradient(105deg, transparent 45%, ${primaryColor}0.09) 50%, transparent 55%)`,
        }}
        initial={{ x: "-6%", y: "12%" }}
        whileInView={{ x: ["-6%", "8%", "-6%"], y: ["12%", "-14%", "12%"] }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 22, ease: [0.42, 0, 0.58, 1], times: [0, 0.5, 1] }}
      />

      {/* secondary stack — phase-shifted, lower opacity, screen blend */}
      <motion.div
        className="absolute -inset-[20%]"
        style={{
          background: `linear-gradient(110deg, transparent 38%, ${secondaryColor}0.14) 50%, transparent 62%)`,
          mixBlendMode: "screen",
        }}
        initial={{ x: "12%", y: "8%" }}
        whileInView={{ x: ["12%", "-14%", "12%"], y: ["8%", "-8%", "8%"] }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 16, ease: [0.42, 0, 0.58, 1], times: [0, 0.5, 1] }}
      />
      <motion.div
        className="absolute -inset-[20%]"
        style={{
          background: `linear-gradient(115deg, transparent 30%, ${secondaryColor}0.09) 50%, transparent 70%)`,
          mixBlendMode: "screen",
        }}
        initial={{ x: "-10%", y: "-6%" }}
        whileInView={{ x: ["-10%", "12%", "-10%"], y: ["-6%", "10%", "-6%"] }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 20, ease: [0.42, 0, 0.58, 1], times: [0, 0.5, 1] }}
      />
    </div>
  );
}
