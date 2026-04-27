"use client";

type Corner = "tl" | "tr" | "bl" | "br";

const positions: Record<Corner, string> = {
  tl: "circle at 0% 0%",
  tr: "circle at 100% 0%",
  bl: "circle at 0% 100%",
  br: "circle at 100% 100%",
};

/**
 * Soft red radial glow anchored to one corner of the cell. Used as the
 * background variant for stat cells that aren't carrying Beams or the grid.
 * The corner rotation across cells prevents the bento from feeling repetitive.
 */
export function CornerGlow({ corner }: { corner: Corner }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        background: `radial-gradient(${positions[corner]}, rgba(255,45,45,0.20), transparent 65%)`,
      }}
    />
  );
}
