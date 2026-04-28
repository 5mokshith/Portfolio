"use client";
import type { Project } from "@/content/projects";

export function DataArtVisual({
  project,
}: {
  project: Project & { visual: { kind: "data-art"; bigNumber: string; caption: string } };
}) {
  return (
    <div
      className="relative aspect-[16/10] w-full overflow-hidden border-b border-hairline"
      style={{
        background:
          "radial-gradient(120% 80% at 30% 25%, rgba(255,45,45,0.10) 0%, rgba(10,10,10,0) 60%)," +
          "radial-gradient(120% 80% at 70% 80%, rgba(0,229,255,0.08) 0%, rgba(10,10,10,0) 60%)," +
          "linear-gradient(180deg, #14110F 0%, #0a0a0a 100%)",
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,45,45,0.18) 1px, transparent 1px)," +
            "linear-gradient(to bottom, rgba(0,229,255,0.18) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage: "radial-gradient(ellipse 80% 70% at 50% 60%, black 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 60%, black 30%, transparent 100%)",
        }}
      />
      <div className="relative z-10 flex h-full flex-col items-start justify-center px-7 py-7 md:px-9">
        <div className="relative">
          {/* cyan ghost behind */}
          <p
            aria-hidden
            className="absolute font-astro leading-[0.85]"
            style={{
              fontSize: "clamp(4rem, 11vw, 8.5rem)",
              top: 0,
              left: 4,
              color: "var(--cyan)",
              opacity: 0.35,
              mixBlendMode: "screen",
              textShadow: "0 0 24px rgba(0,229,255,0.4)",
            }}
          >
            {project.visual.bigNumber}
          </p>
          <p
            className="relative font-astro leading-[0.85] text-fg"
            style={{ fontSize: "clamp(4rem, 11vw, 8.5rem)", textShadow: "0 0 24px rgba(0,0,0,0.6)" }}
          >
            <span style={{ color: "var(--accent)" }}>{project.visual.bigNumber.charAt(0)}</span>
            {project.visual.bigNumber.slice(1)}
          </p>
        </div>
        <p
          className="mt-3 max-w-[40ch] mono-caps text-fg/55"
          style={{
            fontFamily: "var(--font-declandar), ui-monospace, monospace",
            letterSpacing: "0.2em",
            fontSize: 9.5,
          }}
        >
          {project.visual.caption}
        </p>
      </div>
    </div>
  );
}
