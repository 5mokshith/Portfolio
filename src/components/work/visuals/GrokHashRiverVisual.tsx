"use client";

/**
 * Grok pipeline — vertical SHA-256 hex river running behind a big "442K"
 * count. Some hashes glitch-strike-through to read as "deduped". Pure CSS
 * animation, no canvas, no JS timers.
 */

const HASHES = [
  "9f3a7c2e b1d40f8a",
  "4a82d1ce 9b7c2f31",
  "7e0f9a3b c4d51e82",
  "1b6e0c7f a83d29b4",
  "d20a8e1c 4f6b7392",
  "5cf21e8b 09a7d34e",
  "8a4d3c01 e2b97f56",
  "0f7b9d23 a1c4e60d",
  "3e8a1b4f c70d295e",
  "6c1d2a7f 8b4e0359",
  "b9e07c2a 3f8d1064",
  "2d4f8b1e c605a973",
];

export function GrokHashRiverVisual() {
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-hairline bg-black/70">
      {/* hash river — two stacked tracks for seamless loop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex flex-col"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
        }}
      >
        <div className="grok-river flex flex-col">
          {[...HASHES, ...HASHES].map((h, i) => (
            <span
              key={i}
              className="grok-hash"
              style={{
                fontFamily: "var(--font-declandar), ui-monospace, monospace",
                fontSize: 11,
                letterSpacing: "0.18em",
                color: "rgba(0,229,255,0.45)",
                padding: "4px 14px",
                whiteSpace: "nowrap",
                // every 4th line gets a strike (deduped)
                textDecoration: i % 4 === 3 ? "line-through" : "none",
                textDecorationColor: "rgba(255,45,45,0.9)",
                opacity: i % 4 === 3 ? 0.55 : 1,
              }}
            >
              <span style={{ color: "rgba(255,45,45,0.7)", marginRight: 8 }}>›</span>
              {h}
            </span>
          ))}
        </div>
      </div>

      {/* cyan grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,229,255,0.18) 1px, transparent 1px)," +
            "linear-gradient(to bottom, rgba(0,229,255,0.18) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          mixBlendMode: "screen",
        }}
      />

      {/* big number */}
      <div className="pointer-events-none absolute inset-0 flex items-end p-6 md:p-8">
        <p
          className="font-astro leading-[0.85] text-fg"
          style={{
            fontSize: "clamp(3.5rem, 8vw, 6.5rem)",
            textShadow: "0 0 32px rgba(0,0,0,0.85)",
          }}
        >
          442<span style={{ color: "var(--accent)" }}>K</span>
        </p>
      </div>

      {/* corner caption */}
      <p
        className="pointer-events-none absolute right-3 top-3 z-10 mono-caps text-fg/55"
        style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace", fontSize: 9 }}
      >
        <span style={{ color: "var(--accent)" }}>●</span> SHA-256 · DEDUP STREAM
      </p>

      <style jsx>{`
        :global(.grok-river) {
          animation: grok-river-scroll 28s linear infinite;
        }
        @keyframes grok-river-scroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          :global(.grok-river) { animation: none; }
        }
      `}</style>
    </div>
  );
}
