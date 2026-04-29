"use client";

/**
 * 16:10 video frame with a layered "professional" overlay treatment that
 * looks deliberate even before the recording is dropped in. Once a real
 * `<video>` source exists the overlays sit on top of it.
 *
 * Drop-in convention: place screen recordings at `/public/work/<slug>.mp4`.
 * If the file isn't there yet, the placeholder still renders the full
 * overlay so you can preview the treatment.
 */

type Props = {
  /** path under /public, e.g. "/work/autodev.mp4". Leave undefined for a pure placeholder. */
  src?: string;
  /** poster image while video loads */
  poster?: string;
  /** top-left mono caps label, e.g. "AUTODEV · LIVE" */
  label: string;
  /** bottom-right small caption, e.g. "WEBCONTAINER · NL → MULTI-FILE" */
  caption?: string;
  /** "heavy" adds extra grain + tint — used for projects that need more visual weight. */
  intensity?: "default" | "heavy";
};

export function VideoFrame({ src, poster, label, caption, intensity = "default" }: Props) {
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-hairline bg-black">
      {/* video or placeholder backplate */}
      {src ? (
        <video
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
          style={{ filter: "contrast(1.06) saturate(1.05)" }}
        />
      ) : (
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 80% at 30% 25%, rgba(255,45,45,0.10) 0%, transparent 60%)," +
              "radial-gradient(120% 80% at 70% 80%, rgba(0,229,255,0.08) 0%, transparent 60%)," +
              "linear-gradient(180deg, #14110F 0%, #0a0a0a 100%)",
          }}
        />
      )}

      {/* faint pinstripe grid (only over placeholder, masks out under real video) */}
      {!src && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.10) 1px, transparent 1px)," +
              "linear-gradient(to bottom, rgba(255,255,255,0.10) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            maskImage: "radial-gradient(ellipse 80% 70% at 50% 60%, black 30%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 60%, black 30%, transparent 100%)",
          }}
        />
      )}

      {/* scanlines */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.22) 0px, rgba(0,0,0,0.22) 1px, transparent 1px, transparent 3px)",
          opacity: intensity === "heavy" ? 0.35 : 0.22,
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
          opacity: intensity === "heavy" ? 0.08 : 0.05,
          mixBlendMode: "overlay",
        }}
      />

      {/* dual-tone tint */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            intensity === "heavy"
              ? "linear-gradient(135deg, rgba(255,45,45,0.10) 0%, transparent 35%, transparent 65%, rgba(0,229,255,0.10) 100%)"
              : "linear-gradient(135deg, rgba(255,45,45,0.06) 0%, transparent 40%, transparent 60%, rgba(0,229,255,0.06) 100%)",
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

      {/* corner brackets — red top-left & bottom-right, cyan top-right & bottom-left */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-3 top-3 h-3.5 w-3.5 border-l border-t"
        style={{ borderColor: "var(--accent)" }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute right-3 top-3 h-3.5 w-3.5 border-r border-t"
        style={{ borderColor: "var(--cyan)" }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute left-3 bottom-3 h-3.5 w-3.5 border-l border-b"
        style={{ borderColor: "var(--cyan)" }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute right-3 bottom-3 h-3.5 w-3.5 border-r border-b"
        style={{ borderColor: "var(--accent)" }}
      />

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
          className="vf-rec inline-block h-1.5 w-1.5 rounded-full align-middle"
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

      {/* placeholder hint — only when no src */}
      {!src && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <p
            className="mono-caps text-fg/35"
            style={{
              fontFamily: "var(--font-declandar), ui-monospace, monospace",
              fontSize: 10,
              letterSpacing: "0.28em",
            }}
          >
            ▸ AWAITING SIGNAL
          </p>
        </div>
      )}

      <style jsx>{`
        :global(.vf-rec) {
          animation: vf-blink 1.4s steps(2, end) infinite;
        }
        @keyframes vf-blink {
          50% { opacity: 0.25; }
        }
        @media (prefers-reduced-motion: reduce) {
          :global(.vf-rec) { animation: none; }
        }
      `}</style>
    </div>
  );
}
