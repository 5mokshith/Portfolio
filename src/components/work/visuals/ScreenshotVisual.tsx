"use client";
import Image from "next/image";
import type { Project } from "@/content/projects";

export function ScreenshotVisual({
  project,
}: {
  project: Project & { visual: { kind: "screenshot"; src: string; alt: string } };
}) {
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-hairline bg-black/60">
      <Image
        src={project.visual.src}
        alt={project.visual.alt}
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.02]"
      />
    </div>
  );
}
