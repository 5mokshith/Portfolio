/**
 * Single source of truth for Section 06 — NOW.
 *
 * Edit this file when status changes. `lastSync` is hand-bumped on edit
 * (the explicit "I updated this" gesture — not Date.now()).
 *
 * `uptimeAnchor` is locked: Flashback Labs founding-engineer start.
 * Don't drift it.
 */

export type StatusLine = {
  /** mono-caps label, fixed-width column on md+ */
  label: string;
  /** ragged-right value, may include · separators */
  value: string;
};

export type NowContent = {
  /** rendered after "LAST SYNC:" — bump on edit */
  lastSync: string;
  /** ISO instant the uptime counter counts FROM */
  uptimeAnchor: string;
  /** prefix line for the live counter */
  uptimeLabel: string;
  /** rendered + decoded in array order */
  lines: StatusLine[];
};

export const NOW: NowContent = {
  lastSync: "27 APR 2026",
  uptimeAnchor: "2025-08-22T00:00:00Z",
  uptimeLabel: "FLASHBACK LABS · UPTIME:",
  lines: [
    {
      label: "CURRENT OP",
      value: "GROK PIPELINE / PHASE 2 / 1M asset target",
    },
    {
      label: "BOTTLENECK",
      value: "SCRFD face-detection latency on processor pods",
    },
    {
      label: "JUST SHIPPED",
      value: "flashbacklabs.com redesign · red/brass/gunmetal",
    },
    {
      label: "STATUS",
      value: "B.TECH CSE · final semester · grad APR 2026",
    },
    {
      label: "OPEN TO",
      value: "conversations · founding eng · infra · AI infra",
    },
  ],
};
