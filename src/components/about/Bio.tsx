"use client";

import { BlurText } from "@/components/effects/BlurText";

/**
 * Three bio paragraphs revealed line-by-line on scroll. 200ms stagger
 * between paragraphs. Set in Chakra Petch — the body font with lowercase.
 *
 * The intentional mis-alignment (~6px) versus the photo top edge is applied
 * one level up in the parent layout, not here.
 */
export function Bio() {
  return (
    <div className="font-chakra text-fg/85 max-w-[55ch] space-y-7 text-[1.05rem] leading-[1.65]">
      <BlurText as="p" delay={0}>
        Founding engineer at <span className="text-fg">Flashback Labs</span> since
        September 2024. Concurrently CS engineering at Jyothishmathi Institute,
        graduating April 2026.
      </BlurText>
      <BlurText as="p" delay={200}>
        I work on the unglamorous half of AI: distributed pipelines, runtimes,
        on-device inference, decentralized storage. The plumbing that decides
        whether you actually <span className="text-accent">own</span> a system
        or rent it.
      </BlurText>
      <BlurText as="p" delay={400}>
        Three production projects shipped this year. One company website
        redesign, one pipeline at scale, one hackathon honorable mention.
        Building hard things, fast.
      </BlurText>
    </div>
  );
}
