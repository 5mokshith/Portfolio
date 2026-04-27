/**
 * Single source of truth for Section 04 — By the Numbers.
 * Order in this array IS the DOM order in the bento grid; the section
 * component derives the entry stagger from it.
 */

export type StatBg =
  | "beams"          // 442K — drifting red beam streaks
  | "squares"        // 99.99% — faint grid pattern, masked toward bottom-right
  | "glow-tl"        // radial red glow anchored top-left
  | "glow-tr"        // …top-right
  | "glow-bl"        // …bottom-left
  | "glow-br";       // …bottom-right

export type Stat = {
  /** numeric target for CountUp */
  value: number;
  /** decimals on display, default 0 */
  decimals?: number;
  /** unit/suffix rendered next to the digit, e.g. "K", "%", "GB", "DAYS" */
  unit: string;
  /** true → render a space between digit and unit (DAYS, HOURS); else attached (K, GB, %) */
  unitSpaced?: boolean;
  /** caption below the digit, e.g. "IMAGES PROCESSED" */
  label: string;
  /** column span on md+ (12-col grid). Mobile reflows separately in the cell wrapper. */
  span: number;
  /** background variant */
  bg: StatBg;
  /** hero cell — larger digit, lateral anomaly offset, lands LAST in the stagger */
  hero?: boolean;
};

export const STATS: Stat[] = [
  {
    value: 442,
    unit: "K",
    label: "IMAGES PROCESSED",
    span: 6,
    bg: "beams",
    hero: true,
  },
  {
    value: 590,
    unit: "K",
    label: "TWEETS INGESTED",
    span: 3,
    bg: "glow-tr",
  },
  {
    value: 60,
    unit: "GB",
    label: "S3 THROUGHPUT",
    span: 3,
    bg: "glow-br",
  },
  {
    value: 99.99,
    decimals: 2,
    unit: "%",
    label: "DEDUP CONSISTENCY",
    span: 3,
    bg: "squares",
  },
  {
    value: 13,
    unit: "DAYS",
    unitSpaced: true,
    label: "CONTINUOUS RUNTIME",
    span: 5,
    bg: "glow-bl",
  },
  {
    value: 48,
    unit: "HOURS",
    unitSpaced: true,
    label: "HIRING PLATFORM SHIPPED",
    span: 4,
    bg: "glow-tl",
  },
];
