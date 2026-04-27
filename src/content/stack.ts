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
      { name: "OpenAI", role: "LLM" },
      { name: "Anthropic", role: "LLM" },
      { name: "Groq", role: "FAST LLM" },
      { name: "Gemini", role: "LLM" },
      { name: "ONNX / SCRFD", role: "DETECTION" },
      { name: "TFLite", role: "ON-DEVICE" },
    ],
  },
  {
    index: "L05",
    name: "APP / FRAMEWORK",
    roleLine: "// ROUTES · COMPONENTS · STYLE",
    tools: [
      { name: "Next.js", role: "ROUTING" },
      { name: "React", role: "UI" },
      { name: "Vite", role: "BUNDLER" },
      { name: "Express", role: "API" },
      { name: "Tailwind", role: "STYLING" },
    ],
  },
  {
    index: "L04",
    name: "DATA",
    roleLine: "// PERSIST · QUERY · STORE",
    tools: [
      { name: "Postgres / Supabase", role: "RELATIONAL" },
      { name: "DynamoDB", role: "KV STORE" },
      { name: "Convex", role: "REACTIVE DB" },
      { name: "S3", role: "OBJECT STORE" },
    ],
  },
  {
    index: "L03",
    name: "INFRA",
    roleLine: "// EDGE · QUEUES · ORCHESTRATE",
    tools: [
      { name: "AWS SQS", role: "QUEUE" },
      { name: "Inngest", role: "ORCHESTRATION" },
      { name: "Vercel", role: "EDGE / DEPLOY" },
    ],
  },
  {
    index: "L02",
    name: "RUNTIME",
    roleLine: "// WHERE THE CODE LIVES",
    tools: [
      { name: "Node.js", role: "SERVER" },
      { name: "Browser / WebContainers", role: "IN-PAGE" },
      { name: "Goroutines", role: "POOLED" },
      { name: "Android / Capacitor", role: "NATIVE BRIDGE" },
    ],
  },
  {
    index: "L01",
    name: "LANGUAGES",
    roleLine: "// TYPED · COMPILED · GLUE",
    tools: [
      { name: "TypeScript", role: "TYPED" },
      { name: "Go", role: "CONCURRENT" },
      { name: "SQL", role: "QUERIED" },
    ],
  },
];

export const TOTAL_ENTRIES = TIERS.reduce(
  (sum, t) => sum + t.tools.length,
  0,
);
