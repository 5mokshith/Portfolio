"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

type Spark = { id: number; x: number; y: number };

/**
 * Site-wide click feedback. On every primary click anywhere in the document,
 * draws a fast-expanding red ring (the "splash") at the click point.
 * Disabled on touch + reduced-motion.
 */
export function ClickSpark() {
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    setEnabled(true);

    let counter = 0;
    const onClick = (e: PointerEvent) => {
      if (e.button !== 0) return;
      const id = ++counter;
      setSparks((s) => [...s, { id, x: e.clientX, y: e.clientY }]);
      window.setTimeout(() => {
        setSparks((s) => s.filter((sp) => sp.id !== id));
      }, 600);
    };
    window.addEventListener("pointerdown", onClick);
    return () => window.removeEventListener("pointerdown", onClick);
  }, []);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[75]">
      <AnimatePresence>
        {sparks.map((s) => (
          <motion.span
            key={s.id}
            initial={{ scale: 0, opacity: 0.85 }}
            animate={{ scale: 5, opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "absolute",
              left: s.x,
              top: s.y,
              width: 28,
              height: 28,
              marginLeft: -14,
              marginTop: -14,
              borderRadius: "9999px",
              border: "1.5px solid var(--accent)",
              boxShadow: "0 0 18px var(--accent-glow)",
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
