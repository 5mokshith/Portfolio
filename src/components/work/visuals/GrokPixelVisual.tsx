"use client";
import { PixelCanvas } from "@/components/numbers/PixelCanvas";

export function GrokPixelVisual({ active }: { active: boolean }) {
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-hairline bg-black/70">
      <PixelCanvas active={active} gap={5} speed={45} colors="#FFD700,#FFC72C,#A6790A,#ff2d2d" />
      {/* cyan grid mask */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,229,255,0.18) 1px, transparent 1px)," +
            "linear-gradient(to bottom, rgba(0,229,255,0.18) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          mixBlendMode: "screen",
        }}
      />
      <div className="pointer-events-none absolute inset-0 flex items-end p-6 md:p-8">
        <p
          className="font-astro leading-[0.85] text-fg"
          style={{ fontSize: "clamp(3.5rem, 8vw, 6.5rem)", textShadow: "0 0 32px rgba(0,0,0,0.7)" }}
        >
          442<span style={{ color: "var(--accent)" }}>K</span>
        </p>
      </div>
      <span aria-hidden className="pointer-events-none absolute right-4 top-4 h-3 w-3">
        <span className="absolute inset-0 border-r border-t" style={{ borderColor: "var(--cyan)" }} />
      </span>
    </div>
  );
}
