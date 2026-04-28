/**
 * Single source of truth for Section 06 — NOW.
 * Bump `updated` on edit. Honest snapshot, not auto-generated telemetry.
 */

export type NowEntry = {
  /** small mono label */
  label: string;
  /** plain prose value */
  value: string;
};

export type TerminalLevel = "info" | "err" | "ok";
export type TerminalEntry = {
  /** HH:MM 24-hour */
  time: string;
  level: TerminalLevel;
  message: string;
};

export type NowContent = {
  /** rendered as the as-of date — bump on edit */
  updated: string;
  /** open-to availability hint */
  availability: string;
  /** the four "now" lines */
  entries: NowEntry[];
  /** rolling tail-style activity feed for the status console */
  feed: TerminalEntry[];
  /** ISO start of the founding-engineer tenure — drives the UPTIME tile */
  uptimeStartIso: string;
  /** rotating cyan-tile messages */
  currentBuild: string[];
};

export const NOW: NowContent = {
  updated: "27 April 2026",
  availability: "Open to founding-engineer / infra / AI-infra roles",
  entries: [
    {
      label: "Currently building",
      value:
        "Phase-2 of the Grok pipeline — pushing toward a 1M-asset target with tighter face-detection latency on the processor pods.",
    },
    {
      label: "Currently learning",
      value:
        "Deeper Go concurrency patterns and ONNX model surgery; reading the Tigerbeetle internals.",
    },
    {
      label: "Last shipped",
      value:
        "ChefMate v1 — meal planner across web + native Android with on-device ingredient detection.",
    },
    {
      label: "Status",
      value:
        "Final-semester B.Tech CSE at Jyothishmathi Institute. Graduating April 2026.",
    },
  ],
  feed: [
    { time: "09:14", level: "ok",   message: "deploy/grok pipeline → vercel-edge · 442k assets indexed" },
    { time: "09:42", level: "info", message: "tail processor pod cold-start latency · p95 1.2s" },
    { time: "10:03", level: "err",  message: "scrfd onnx · cuda OOM on batch=64, fell back to batch=32" },
    { time: "10:21", level: "info", message: "wrote integration test for inngest fanout retries" },
    { time: "11:00", level: "ok",   message: "merged feat/dual-tone-redesign foundation" },
    { time: "12:14", level: "info", message: "reading: tigerbeetle 'double-entry accounting at storage layer'" },
    { time: "13:48", level: "ok",   message: "shipped chefmate v1.1 · android tflite ingredient detector" },
    { time: "14:30", level: "info", message: "rg 'eventual consistency' papers/ddia · 6 hits worth re-reading" },
    { time: "15:11", level: "err",  message: "lenis init race on hot-reload · added ready-state guard" },
    { time: "16:02", level: "ok",   message: "code review: aura multi-agent retry policy · LGTM" },
  ],
  uptimeStartIso: "2024-09-01T00:00:00Z",
  currentBuild: [
    "Phase-2 grok pipeline · 1M asset target",
    "ChefMate v1.2 · pantry sync",
    "Portfolio v3 · dual-tone RGB-split redesign",
  ],
};
