"use client";

import { motion } from "motion/react";

/**
 * Drifting red beam streaks for the hero stat cell (442K). Three stacked
 * diagonal gradient slabs each translate through one full cycle when the
 * cell scrolls into view, then come to rest at the starting offset. No
 * infinite loop — the motion is a single signal, not a constant hum.
 */
export function Beams() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <motion.div
        className="absolute -inset-[20%]"
        style={{
          background:
            "linear-gradient(110deg, transparent 38%, rgba(255,45,45,0.22) 50%, transparent 62%)",
        }}
        initial={{ x: "-12%", y: "-8%" }}
        whileInView={{ x: ["-12%", "14%", "-12%"], y: ["-8%", "8%", "-8%"] }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 14, ease: [0.42, 0, 0.58, 1], times: [0, 0.5, 1] }}
      />
      <motion.div
        className="absolute -inset-[20%]"
        style={{
          background:
            "linear-gradient(115deg, transparent 30%, rgba(255,45,45,0.13) 50%, transparent 70%)",
        }}
        initial={{ x: "10%", y: "6%" }}
        whileInView={{ x: ["10%", "-12%", "10%"], y: ["6%", "-10%", "6%"] }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 18, ease: [0.42, 0, 0.58, 1], times: [0, 0.5, 1] }}
      />
      <motion.div
        className="absolute -inset-[20%]"
        style={{
          background:
            "linear-gradient(105deg, transparent 45%, rgba(255,45,45,0.09) 50%, transparent 55%)",
        }}
        initial={{ x: "-6%", y: "12%" }}
        whileInView={{ x: ["-6%", "8%", "-6%"], y: ["12%", "-14%", "12%"] }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 22, ease: [0.42, 0, 0.58, 1], times: [0, 0.5, 1] }}
      />
    </div>
  );
}
