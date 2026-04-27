import type { Metadata } from "next";
import localFont from "next/font/local";
import { Chakra_Petch, Fraunces } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/system/SmoothScroll";
import { GrainOverlay } from "@/components/system/GrainOverlay";
import { CustomCursor } from "@/components/system/CustomCursor";
import { ClickSpark } from "@/components/effects/ClickSpark";

// Astro — display: hero name, codenames, section heads, big stats
const astro = localFont({
  src: "../fonts/Astro.ttf",
  variable: "--font-astro",
  display: "swap",
});

// Declandar — HUD chrome / mono caps (demo cut is uppercase-only, by design)
const declandar = localFont({
  src: "../fonts/Declandar.otf",
  variable: "--font-declandar",
  display: "swap",
});

// Chakra Petch — body text. Geometric/futuristic sans, has lowercase, pairs with Astro.
const chakra = Chakra_Petch({
  variable: "--font-chakra",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

// Fraunces — editorial serif (redesign hero). Variable, optical-sized, strong italic.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  weight: ["300", "400", "500", "600", "700", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mokshith Rao — Founding Engineer",
  description:
    "Founding engineer at Flashback Labs. I ship the unglamorous half of AI — distributed pipelines, runtimes, on-device inference.",
  metadataBase: new URL("https://mokshith.vercel.app"),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${astro.variable} ${declandar.variable} ${chakra.variable} ${fraunces.variable} antialiased`}
    >
      <body className="bg-bg text-fg overflow-x-hidden">
        <SmoothScroll>{children}</SmoothScroll>
        <GrainOverlay />
        <ClickSpark />
        <CustomCursor />
      </body>
    </html>
  );
}
