/**
 * Phone mockup for ChefMate. Slight tilt, TFLite badge floating in the corner.
 * The phone outline is an SVG so it stays sharp; the screen contents are HTML
 * for crisp typography.
 */
export function ChefMateMockup() {
  return (
    <div className="relative mx-auto flex w-full items-center justify-center py-4">
      <div
        className="relative"
        style={{
          width: "min(320px, 100%)",
          transform: "rotate(-4deg)",
          filter: "drop-shadow(0 30px 50px rgba(0,0,0,0.7))",
        }}
      >
        {/* phone body */}
        <div
          className="relative overflow-hidden rounded-[44px] border"
          style={{
            aspectRatio: "9/19",
            borderColor: "rgba(255,255,255,0.18)",
            background: "linear-gradient(180deg, #0d0d0d 0%, #050505 100%)",
            boxShadow: "inset 0 0 0 2px rgba(0,0,0,0.6)",
          }}
        >
          {/* notch */}
          <div
            className="absolute left-1/2 top-2 z-10 h-5 w-24 -translate-x-1/2 rounded-full"
            style={{ background: "#000" }}
          />

          {/* screen */}
          <div className="absolute inset-[8px] overflow-hidden rounded-[36px]" style={{ background: "#0a0a0a" }}>
            {/* status bar */}
            <div
              className="mono-caps flex items-center justify-between px-5 pt-3 text-[9px] text-fg/70"
              style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace" }}
            >
              <span>9:41</span>
              <span>● ● ●</span>
            </div>

            {/* app heading */}
            <div className="px-5 pt-6">
              <p
                className="mono-caps text-accent text-[9px]"
                style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace" }}
              >
                CHEFMATE · TODAY
              </p>
              <p className="font-astro mt-1 text-2xl leading-tight text-fg">
                what's<br />in the<br />fridge?
              </p>
            </div>

            {/* detected ingredients chips */}
            <div className="px-5 pt-5">
              <p
                className="mono-caps text-muted text-[9px]"
                style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace" }}
              >
                DETECTED · ON-DEVICE
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {["Spinach", "Tofu", "Garlic", "Chili", "Lemon"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border px-2 py-0.5 text-[10px] text-fg/85"
                    style={{
                      borderColor: "rgba(255,45,45,0.4)",
                      background: "rgba(255,45,45,0.06)",
                      fontFamily: "var(--font-chakra)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* recipe card */}
            <div
              className="mx-5 mt-5 rounded-md border p-3"
              style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.025)" }}
            >
              <p
                className="mono-caps text-muted text-[9px]"
                style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace" }}
              >
                RECIPE · 1 / 3
              </p>
              <p className="font-chakra mt-0.5 text-[13px] font-medium text-fg">
                Garlic Chili Tofu over Spinach
              </p>
              <div
                className="mono-caps mt-3 grid grid-cols-3 gap-1 text-[9px] text-fg/70"
                style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace" }}
              >
                <span>520 KCAL</span>
                <span>32G PROTEIN</span>
                <span>14 MIN</span>
              </div>
            </div>

            {/* CTA */}
            <div className="absolute bottom-6 left-5 right-5">
              <div
                className="flex items-center justify-center rounded-md py-3"
                style={{
                  background: "var(--accent)",
                  boxShadow: "0 0 24px rgba(255,45,45,0.45)",
                  fontFamily: "var(--font-declandar), ui-monospace, monospace",
                }}
              >
                <span className="mono-caps text-bg">PLAN MY DAY ↗</span>
              </div>
            </div>
          </div>
        </div>

        {/* TFLite floating badge */}
        <div
          className="absolute -right-6 top-12 rotate-[8deg]"
          style={{ filter: "drop-shadow(0 0 8px rgba(255,45,45,0.4))" }}
        >
          <div
            className="rounded-sm border bg-bg px-2 py-1"
            style={{
              borderColor: "rgba(255,45,45,0.55)",
              fontFamily: "var(--font-declandar), ui-monospace, monospace",
            }}
          >
            <p className="mono-caps text-accent text-[9px]">TFLITE · WASM</p>
            <p className="mono-caps text-fg/70 text-[9px]">~38ms · 95% acc</p>
          </div>
        </div>
      </div>
    </div>
  );
}
