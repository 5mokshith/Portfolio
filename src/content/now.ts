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

export type NowContent = {
  /** rendered as the as-of date — bump on edit */
  updated: string;
  /** open-to availability hint */
  availability: string;
  /** the four "now" lines */
  entries: NowEntry[];
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
  uptimeStartIso: "2024-09-01T00:00:00Z",
  currentBuild: [
    "Phase-2 grok pipeline · 1M asset target",
    "ChefMate v1.2 · pantry sync",
    "Portfolio v3 · dual-tone RGB-split redesign",
  ],
};
