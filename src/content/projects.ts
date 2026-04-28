/**
 * Single source of truth for the four Selected Work case-study cards.
 * Drawn from the user's resume + Work.docx project notes.
 */

export type ProjectLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type Project = {
  /** "01" .. "04" — small index in card corner. */
  index: string;
  /** display title in serif. */
  title: string;
  /** short italic tagline rendered next to / under the title. */
  tagline: string;
  /** 2–3 sentence plain-English description of what the project does. */
  description: string;
  /** up to 3 short bullets of what the user actually built. */
  highlights: string[];
  /** 4–6 most-relevant techs as chips. */
  stack: string[];
  /** action links — render in card footer. */
  links: ProjectLink[];
  /** visual treatment — screenshot path under /public, or "data-art". */
  visual:
    | { kind: "screenshot"; src: string; alt: string }
    | {
        kind: "data-art";
        /** big numerator pulled out as the cover number, e.g. "442K". */
        bigNumber: string;
        /** caption under the number — e.g. "images · 60 GB · 99.99% consistency". */
        caption: string;
      };
};

export const PROJECTS: Project[] = [
  {
    index: "01",
    title: "AURA",
    tagline: "Agentic Unified Reasoning Assistant.",
    description:
      "A multi-agent AI workflow platform. Type a natural-language instruction — \"draft an email to my team and add a calendar invite\" — and a Planner → 5 Workers → Evaluator pipeline executes it across Gmail, Drive, Docs, Sheets, and Calendar autonomously.",
    highlights: [
      "Hierarchical Planner → 5 Workers → Evaluator with resumable DAG execution",
      "AES-256-GCM encrypted OAuth tokens with 5-min pre-expiry auto-refresh",
      "Realtime progress streaming via Supabase Realtime — full execution observability",
    ],
    stack: ["Next.js 16", "Gemini 2.5", "Supabase", "Google APIs", "TypeScript"],
    links: [
      { label: "Repo", href: "https://github.com/5mokshith", external: true },
    ],
    visual: { kind: "data-art", bigNumber: "5", caption: "google APIs orchestrated · 7 tables · DAG · realtime" },
  },
  {
    index: "02",
    title: "Grok pipeline",
    tagline: "Distributed media ingestion at production scale.",
    description:
      "A three-stage distributed pipeline — TypeScript scraper → Go image processor → enricher — ingesting AI-generated media across 10 rotating accounts. Triple-tier deduplication, deterministic stealth fingerprinting, ML-based face detection inline.",
    highlights: [
      "442K deduplicated images (60 GB) at 99.99% S3 ↔ DynamoDB consistency in 13 days",
      "Triple dedup: URL → SHA-256 → perceptual hash (Hamming ≤ 10)",
      "SCRFD ONNX face detection in Go with goroutine pools across 27K+ hourly windows",
    ],
    stack: ["TypeScript", "Go", "AWS SQS / DynamoDB / S3", "Playwright", "ONNX Runtime"],
    links: [{ label: "Private repo", href: "#" }],
    visual: {
      kind: "data-art",
      bigNumber: "442K",
      caption: "images · 60 GB · 99.99% consistency · 13 days runtime",
    },
  },
  {
    index: "03",
    title: "ChefMate",
    tagline: "AI recipe and meal-planning, web + Android.",
    description:
      "AI-powered recipe generator and meal planner shipping as both a Vercel-hosted web app and a native Android app via Capacitor. On-device ingredient detection, calorie/macro tracking, 7-day auto-fill meal planning, subscription tiers.",
    highlights: [
      "On-device ingredient detection via TFLite (TensorFlow.js + custom Vite plugin)",
      "Mifflin-St Jeor BMR → TDEE nutritional model with macro-validation per slot",
      "PKCE OAuth2 with Android deep-link callbacks; subscription-tier quota enforcement",
    ],
    stack: ["React", "Capacitor", "Supabase", "Gemini", "TensorFlow.js", "Vite"],
    links: [
      { label: "Repo", href: "https://github.com/5mokshith", external: true },
    ],
    visual: { kind: "data-art", bigNumber: "2", caption: "platforms — web + native android · on-device ML · subscription tiers" },
  },
  {
    index: "04",
    title: "AutoDev",
    tagline: "Browser-native AI code editor.",
    description:
      "An in-browser AI code editor that converts natural language into multi-file projects, running Node.js dev servers in-page via WebContainers. Async agent pipeline with multi-LLM routing. Honorable Mention at hackathon.",
    highlights: [
      "Async agent pipeline (Inngest) with multi-LLM routing and structured tool-call error handling",
      "Live file-tree and editor sync via Convex; Node.js dev servers running in-page (WebContainers)",
      "GitHub OAuth + Octokit for repository import / export",
    ],
    stack: ["Next.js", "WebContainers", "Inngest", "Convex", "Multi-LLM", "Clerk"],
    links: [
      { label: "Repo", href: "https://github.com/5mokshith", external: true },
    ],
    visual: { kind: "data-art", bigNumber: "4", caption: "LLM providers · in-browser runtime · honorable mention" },
  },
];
