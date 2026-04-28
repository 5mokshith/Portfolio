/**
 * Single source of truth for Section 05 — STACK.
 *
 * Tiers are authored in DOM order (top-down read): L06 first, L01 last.
 * Visually L01 sits at the bottom of the diagram (foundation). The section
 * derives the bottom-up stagger by reversing the index — L01 animates first,
 * L06 last.
 *
 * Adding/removing a tool here updates everything downstream: the section's
 * tool count tag, the closing rule's "N ENTRIES" stamp, and the rendered
 * pill row.
 */

export type Tool = {
  /** rendered as the default pill label */
  name: string;
  /** swapped in on hover/focus — one or two words, mono-caps */
  role: string;
  /** drift lane assignment for the kinetic chip cloud (0..2) */
  lane: 0 | 1 | 2;
};

export type Tier = {
  /** "L01" .. "L06" */
  index: string;
  /** big Astro caps headline of the tier */
  name: string;
  /** terminal-comment role line, e.g. "// TYPED · COMPILED · GLUE" */
  roleLine: string;
  tools: Tool[];
};

export const TIERS: Tier[] = [
  {
    index: "L06",
    name: "AI / ML",
    roleLine: "// LLMS · INFERENCE · ON-DEVICE",
    tools: [
      { name: "OpenAI", role: "LLM", lane: 0 },
      { name: "Anthropic", role: "LLM", lane: 1 },
      { name: "Groq", role: "FAST LLM", lane: 2 },
      { name: "Gemini", role: "LLM", lane: 0 },
      { name: "ONNX / SCRFD", role: "DETECTION", lane: 1 },
      { name: "TFLite", role: "ON-DEVICE", lane: 2 },
    ],
  },
  {
    index: "L05",
    name: "APP / FRAMEWORK",
    roleLine: "// ROUTES · COMPONENTS · STYLE",
    tools: [
      { name: "Next.js", role: "ROUTING", lane: 0 },
      { name: "React", role: "UI", lane: 1 },
      { name: "Vite", role: "BUNDLER", lane: 2 },
      { name: "Express", role: "API", lane: 0 },
      { name: "Tailwind", role: "STYLING", lane: 1 },
    ],
  },
  {
    index: "L04",
    name: "DATA",
    roleLine: "// PERSIST · QUERY · STORE",
    tools: [
      { name: "Postgres / Supabase", role: "RELATIONAL", lane: 2 },
      { name: "DynamoDB", role: "KV STORE", lane: 0 },
      { name: "Convex", role: "REACTIVE DB", lane: 1 },
      { name: "S3", role: "OBJECT STORE", lane: 2 },
    ],
  },
  {
    index: "L03",
    name: "INFRA",
    roleLine: "// EDGE · QUEUES · ORCHESTRATE",
    tools: [
      { name: "AWS SQS", role: "QUEUE", lane: 0 },
      { name: "Inngest", role: "ORCHESTRATION", lane: 1 },
      { name: "Vercel", role: "EDGE / DEPLOY", lane: 2 },
    ],
  },
  {
    index: "L02",
    name: "RUNTIME",
    roleLine: "// WHERE THE CODE LIVES",
    tools: [
      { name: "Node.js", role: "SERVER", lane: 0 },
      { name: "Browser / WebContainers", role: "IN-PAGE", lane: 1 },
      { name: "Goroutines", role: "POOLED", lane: 2 },
      { name: "Android / Capacitor", role: "NATIVE BRIDGE", lane: 0 },
    ],
  },
  {
    index: "L01",
    name: "LANGUAGES",
    roleLine: "// TYPED · COMPILED · GLUE",
    tools: [
      { name: "TypeScript", role: "TYPED", lane: 1 },
      { name: "Go", role: "CONCURRENT", lane: 2 },
      { name: "SQL", role: "QUERIED", lane: 0 },
    ],
  },
];

export const TOTAL_ENTRIES = TIERS.reduce(
  (sum, t) => sum + t.tools.length,
  0,
);

/** Flat list of every tool, used by the kinetic chip cloud. */
export const ALL_TOOLS: Tool[] = TIERS.flatMap((t) => t.tools);
