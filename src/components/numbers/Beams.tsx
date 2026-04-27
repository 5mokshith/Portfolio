"use client";

/**
 * Drifting red beam streaks for the hero stat cell (442K). Three stacked
 * diagonal gradient slabs translate slowly on offset cycles. Sits behind the
 * digits at low opacity — never busy, only motion in the periphery.
 */
export function Beams() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div
        className="absolute -inset-[20%] beams-drift-a"
        style={{
          background:
            "linear-gradient(110deg, transparent 38%, rgba(255,45,45,0.22) 50%, transparent 62%)",
        }}
      />
      <div
        className="absolute -inset-[20%] beams-drift-b"
        style={{
          background:
            "linear-gradient(115deg, transparent 30%, rgba(255,45,45,0.13) 50%, transparent 70%)",
        }}
      />
      <div
        className="absolute -inset-[20%] beams-drift-c"
        style={{
          background:
            "linear-gradient(105deg, transparent 45%, rgba(255,45,45,0.09) 50%, transparent 55%)",
        }}
      />
    </div>
  );
}
