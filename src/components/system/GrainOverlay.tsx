/**
 * Site-wide film-grain overlay.
 *
 * Uses an inline SVG <feTurbulence> noise pattern as a base64 data URI
 * background. Real grain PNGs look better — drop one at /public/grain.png
 * and switch the background-image to `url(/grain.png)` to upgrade.
 */
const NOISE = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch' seed='7'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>`;

export function GrainOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60]"
      style={{
        backgroundImage: `url("${NOISE}")`,
        backgroundSize: "200px 200px",
        opacity: 0.08,
        mixBlendMode: "overlay",
      }}
    />
  );
}
