"use client";

import Cubes from "@/components/reactbits/Cubes";

/**
 * Single-layer Cubes grid in the same 16:10 frame as VideoFrame, sharing
 * its overlay treatment (scanlines, grain, vignette, dual-tone tint, red/
 * cyan corner brackets, top-left REC label, bottom-right caption). Used
 * for the Grok pipeline card.
 */
type Props = {
  label: string;
  caption?: string;
};

export function CubesVisual({ label, caption }: Props) {
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-hairline bg-black/70">
      {/* cubes grid */}
      <Cubes
        gridSize={8}
        maxAngle={45}
        radius={3}
        borderStyle="1px solid rgba(255,45,45,0.35)"
        faceColor="#0a0a0a"
        rippleColor="#ff2d2d"
        rippleSpeed={1.6}
        cellGap={4}
        autoAnimate
        rippleOnClick
      />

      {/* scanlines */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.22) 0px, rgba(0,0,0,0.22) 1px, transparent 1px, transparent 3px)",
          opacity: 0.22,
          mixBlendMode: "multiply",
        }}
      />

      {/* film grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.7 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          opacity: 0.05,
          mixBlendMode: "overlay",
        }}
      />

      {/* dual-tone tint */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,45,45,0.06) 0%, transparent 40%, transparent 60%, rgba(0,229,255,0.06) 100%)",
          mixBlendMode: "screen",
        }}
      />

      {/* vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* corner brackets */}
      <span aria-hidden className="pointer-events-none absolute left-3 top-3 h-3.5 w-3.5 border-l border-t" style={{ borderColor: "var(--accent)" }} />
      <span aria-hidden className="pointer-events-none absolute right-3 top-3 h-3.5 w-3.5 border-r border-t" style={{ borderColor: "var(--cyan)" }} />
      <span aria-hidden className="pointer-events-none absolute left-3 bottom-3 h-3.5 w-3.5 border-l border-b" style={{ borderColor: "var(--cyan)" }} />
      <span aria-hidden className="pointer-events-none absolute right-3 bottom-3 h-3.5 w-3.5 border-r border-b" style={{ borderColor: "var(--accent)" }} />

      {/* top-left label */}
      <p
        className="pointer-events-none absolute left-5 top-4 z-10 mono-caps text-fg/70"
        style={{
          fontFamily: "var(--font-declandar), ui-monospace, monospace",
          fontSize: 9.5,
          letterSpacing: "0.2em",
        }}
      >
        <span
          className="cv-rec inline-block h-1.5 w-1.5 rounded-full align-middle"
          style={{ background: "var(--accent)", marginRight: 6 }}
        />
        {label}
      </p>

      {/* bottom-right caption */}
      {caption && (
        <p
          className="pointer-events-none absolute right-5 bottom-4 z-10 mono-caps text-fg/45"
          style={{
            fontFamily: "var(--font-declandar), ui-monospace, monospace",
            fontSize: 9,
            letterSpacing: "0.22em",
          }}
        >
          {caption}
        </p>
      )}

      <style jsx>{`
        :global(.cv-rec) { animation: cv-blink 1.4s steps(2, end) infinite; }
        @keyframes cv-blink { 50% { opacity: 0.25; } }
        @media (prefers-reduced-motion: reduce) {
          :global(.cv-rec) { animation: none; }
        }
      `}</style>
    </div>
  );
}
