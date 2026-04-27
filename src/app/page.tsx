import { Hero } from "@/components/sections/Hero";
import { HeroV2 } from "@/components/sections/HeroV2";
import { About } from "@/components/sections/About";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { ByTheNumbers } from "@/components/sections/ByTheNumbers";
import { Stack } from "@/components/sections/Stack";
import { Now } from "@/components/sections/Now";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <main id="top">
      <Hero />
      <HeroV2 />
      <About />
      <SelectedWork />
      <ByTheNumbers />
      <Stack />
      <Now />
      <Contact />
    </main>
  );
}
