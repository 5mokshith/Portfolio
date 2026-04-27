import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { ByTheNumbers } from "@/components/sections/ByTheNumbers";
import { Stack } from "@/components/sections/Stack";

const PLACEHOLDERS = [
  ["06", "NOW"],
  ["07", "CONTACT"],
] as const;

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <SelectedWork />
      <ByTheNumbers />
      <Stack />

      {/* placeholder sections — replaced as each section ships */}
      {PLACEHOLDERS.map(([num, name]) => (
        <section
          key={num}
          data-section={num}
          className="min-h-[60vh] border-t border-hairline px-6 py-32 md:px-12"
        >
          <div className="mx-auto flex max-w-7xl items-baseline justify-between">
            <p className="mono-caps text-muted">SECTION {num}</p>
            <p
              className="font-astro text-fg/30"
              style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
            >
              {name}
            </p>
          </div>
        </section>
      ))}
    </main>
  );
}
