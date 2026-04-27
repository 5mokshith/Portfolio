/**
 * Single source of truth for the four Selected-Work panels.
 * Edit here when a project status, link, or metric changes.
 */

export type Project = {
  index: string;          // "01" .. "04" — printed top-right
  codename: string;       // big Astro headline
  tagline: string;        // italic one-liner
  stack: string[];        // tags rendered between hairlines
  story: string;          // 2-3 sentence prose
  metric: string;         // mono caps badge (the punchy line)
  href?: string;          // GitHub / live demo
  hrefLabel?: string;     // override for the link label, defaults to "OPEN"
  visual: "grok" | "aura" | "autodev" | "chefmate"; // dispatch key
};

export const PROJECTS: Project[] = [
  {
    index: "01",
    codename: "GROK PIPELINE",
    tagline:
      "Production-scale media pipeline. Three stages, triple dedup, stealth-fingerprinted at the edge.",
    stack: [
      "TypeScript",
      "Go",
      "AWS SQS",
      "DynamoDB",
      "S3",
      "Playwright",
      "ONNX (SCRFD)",
    ],
    story:
      "Three-stage distributed pipeline ingesting tweets across 10 rotating accounts. Triple-tier dedup — URL → SHA-256 → perceptual hash. Deterministic stealth fingerprinting (HMAC-seeded PRNG, canvas-noise injection) to evade detection across 27K+ hourly windows. SCRFD face detection in Go via ONNX runtime with goroutine pools.",
    metric: "442K IMAGES · 590K TWEETS · 99.99% CONSISTENCY · 13 DAYS RUNTIME",
    href: "#",
    hrefLabel: "REPO · PRIVATE",
    visual: "grok",
  },
  {
    index: "02",
    codename: "AURA",
    tagline:
      "Hierarchical multi-agent system for natural-language workflow execution.",
    stack: ["Next.js", "TypeScript", "Supabase", "Gemini", "Google Workspace APIs"],
    story:
      "Planner → 5 Domain Workers → Evaluator architecture. Step-based DAG execution engine with mid-plan restart via resumeFromStepId. AES-256-GCM encrypted OAuth tokens, RLS across 7 PostgreSQL tables, token-bucket rate limiting per endpoint type.",
    metric: "5 GOOGLE APIs · 7 TABLES · DAG EXECUTION · LIVE STREAMING",
    href: "#",
    hrefLabel: "GITHUB",
    visual: "aura",
  },
  {
    index: "03",
    codename: "AUTODEV",
    tagline: "Browser-native AI code editor. Node servers running in-page.",
    stack: [
      "Next.js",
      "Inngest",
      "Convex",
      "WebContainers",
      "OpenAI / Anthropic / Groq / Gemini",
    ],
    story:
      "Natural-language → multi-file projects. Node.js dev servers running in-browser via WebContainers. Async agent pipeline on Inngest for non-blocking AI operations. GitHub OAuth + Octokit for repo import/export.",
    metric: "4 LLM PROVIDERS · IN-BROWSER RUNTIME · 🏆 HONORABLE MENTION",
    href: "#",
    hrefLabel: "GITHUB",
    visual: "autodev",
  },
  {
    index: "04",
    codename: "CHEFMATE",
    tagline: "AI meal planning. Web app + native Android. On-device inference.",
    stack: ["React", "Vite", "Express", "Supabase", "Capacitor", "TFLite", "Gemini"],
    story:
      "Full-stack AI meal app shipped to web and native Android via Capacitor. On-device ingredient detection via TFLite (WASM/WebGL backends). Mifflin-St Jeor BMR/TDEE calculations, structured-JSON Gemini recipe generation, PKCE OAuth with Android deep-link callbacks.",
    metric: "WEB + ANDROID · ON-DEVICE ML · SUBSCRIPTION TIERS",
    href: "#",
    hrefLabel: "GITHUB",
    visual: "chefmate",
  },
];
