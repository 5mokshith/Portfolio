/**
 * Section-00 placeholder page.
 *
 * Renders a swatch strip + type ladder so we can eyeball the design tokens
 * (palette, fonts, hairlines) before any real section ships.
 * Each <section data-section="..."> is a stand-in for one of the eight
 * sections in the brief — they get replaced one at a time.
 */
const SECTIONS = [
  ["01", "HERO"],
  ["02", "ABOUT"],
  ["03", "SELECTED WORK"],
  ["04", "BY THE NUMBERS"],
  ["05", "STACK"],
  ["06", "NOW"],
  ["07", "CONTACT"],
] as const;

export default function Home() {
  return (
    <main>
      {/* ── shell test: tokens & type ─────────────────────────────────── */}
      <section
        data-section="00-shell-test"
        className="min-h-screen px-6 py-32 md:px-12 md:py-48"
      >
        <div className="mx-auto max-w-7xl">
          <p className="mono-caps text-muted">
            <span className="pulse-dot inline-block h-1.5 w-1.5 -translate-y-px rounded-full bg-accent align-middle" />
            <span className="ml-2">SECTION 00 · SHELL VERIFY · STATION ONLINE</span>
          </p>

          <h1 className="font-astro mt-8 leading-[0.85] tracking-tight text-fg" style={{ fontSize: "clamp(4rem, 12vw, 10rem)" }}>
            MOKSHITH<br />RAO
          </h1>

          <p className="font-chakra mt-10 max-w-[55ch] text-base leading-relaxed text-fg/85">
            Founding engineer at Flashback Labs. I ship the unglamorous half of AI
            — distributed pipelines, runtimes, on-device inference. This is the
            shell — sections come online one at a time.
          </p>

          {/* palette swatches */}
          <div className="mt-16 grid grid-cols-2 gap-px border border-hairline md:grid-cols-4">
            {[
              ["bg", "#0a0a0a", "BACKGROUND"],
              ["fg", "#fafafa", "FOREGROUND"],
              ["accent", "#ff2d2d", "ACCENT"],
              ["muted", "#6b6b6b", "MUTED"],
            ].map(([key, hex, label]) => (
              <div
                key={key}
                className="flex h-32 flex-col justify-between p-4"
                style={{ background: hex, color: key === "fg" ? "#0a0a0a" : "#fafafa" }}
              >
                <span className="mono-caps">{label}</span>
                <span className="mono-caps opacity-60">{hex}</span>
              </div>
            ))}
          </div>

          {/* type ladder */}
          <div className="mt-16 space-y-4 border-t border-hairline pt-10">
            <p className="mono-caps text-muted">TYPE LADDER</p>
            <p className="font-astro text-fg" style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}>442K</p>
            <p className="font-astro text-fg" style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}>SECTION HEADER</p>
            <p className="font-chakra text-base text-fg/85">
              Body text in Chakra Petch — distributed pipelines, runtimes, on-device
              inference. The plumbing that decides whether you actually own a system or rent it.
            </p>
            <p className="mono-caps text-fg/70">MONO CAPS · CAPTION · STATUS READOUT</p>
          </div>

          {/* hairline test */}
          <div className="mt-16 grid grid-cols-2 gap-8">
            <div className="border-t border-hairline pt-3 mono-caps text-muted">HAIRLINE WHITE</div>
            <div className="border-t pt-3 mono-caps text-accent" style={{ borderColor: "var(--hairline-red)" }}>
              HAIRLINE RED
            </div>
          </div>
        </div>
      </section>

      {/* ── empty-section placeholders ────────────────────────────────── */}
      {SECTIONS.map(([num, name]) => (
        <section
          key={num}
          data-section={num}
          className="min-h-[60vh] border-t border-hairline px-6 py-32 md:px-12"
        >
          <div className="mx-auto flex max-w-7xl items-baseline justify-between">
            <p className="mono-caps text-muted">SECTION {num}</p>
            <p className="font-astro text-fg/30" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>
              {name}
            </p>
          </div>
        </section>
      ))}
    </main>
  );
}
