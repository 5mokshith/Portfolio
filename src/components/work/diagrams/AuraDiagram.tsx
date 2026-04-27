/**
 * AURA architecture diagram.
 *
 *               [PLANNER]
 *                   │
 *      ┌─────┬─────┼─────┬─────┐
 *    GMAIL DRIVE DOCS SHEETS CAL
 *      └─────┴─────┼─────┴─────┘
 *                   │
 *               [EVALUATOR]
 *
 * Same visual vocabulary as the Grok diagram (hairline white nodes,
 * red accent flow, mono labels) so the two panels read as a set.
 */
export function AuraDiagram() {
  const workers = [
    { name: "GMAIL", color: "#EA4335" },
    { name: "DRIVE", color: "#1FA463" },
    { name: "DOCS", color: "#4285F4" },
    { name: "SHEETS", color: "#0F9D58" },
    { name: "CALENDAR", color: "#4285F4" },
  ];
  const W = 800;
  const planner = { x: 320, y: 30, w: 160, h: 70 };
  const evaluator = { x: 320, y: 380, w: 160, h: 70 };

  return (
    <svg
      viewBox="0 0 800 480"
      className="w-full"
      style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace" }}
      aria-label="Aura architecture: Planner branches to five Google Workspace workers and converges into Evaluator"
    >
      <defs>
        <marker id="aura-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 Z" fill="var(--accent)" />
        </marker>
      </defs>

      {/* planner */}
      <Block {...planner} label="PLANNER" sub="gemini · plan dag" highlight />

      {/* fan-out */}
      <Line x1={400} y1={planner.y + planner.h} x2={400} y2={170} />
      <Line x1={70} y1={170} x2={730} y2={170} />

      {workers.map((w, i) => {
        const cx = 70 + (i * (660 / (workers.length - 1)));
        return (
          <g key={w.name}>
            <Line x1={cx} y1={170} x2={cx} y2={210} />
            <Block
              x={cx - 60}
              y={210}
              w={120}
              h={66}
              label={w.name}
              sub="oauth · rls"
              accentDot={w.color}
            />
            <Line x1={cx} y1={276} x2={cx} y2={320} />
          </g>
        );
      })}

      {/* fan-in */}
      <Line x1={70} y1={320} x2={730} y2={320} />
      <Line x1={400} y1={320} x2={400} y2={evaluator.y} arrow />

      {/* evaluator */}
      <Block {...evaluator} label="EVALUATOR" sub="result merge · resume" highlight />

      {/* side stamps */}
      <text x={20} y={planner.y + 28} fill="var(--muted)" fontSize="16" letterSpacing="0.2em">
        IN  ·  PROMPT
      </text>
      <text x={W - 90} y={planner.y + 28} fill="var(--muted)" fontSize="16" letterSpacing="0.2em">
        AES-256-GCM
      </text>
      <text x={20} y={evaluator.y + 28} fill="var(--accent)" fontSize="16" letterSpacing="0.2em">
        OUT  ·  ANSWER
      </text>
      <text x={W - 90} y={evaluator.y + 28} fill="var(--muted)" fontSize="16" letterSpacing="0.2em">
        7 PG TABLES
      </text>
    </svg>
  );
}

function Block({
  x, y, w, h, label, sub, highlight, accentDot,
}: {
  x: number; y: number; w: number; h: number;
  label: string; sub?: string;
  highlight?: boolean; accentDot?: string;
}) {
  return (
    <g>
      <rect
        x={x} y={y} width={w} height={h} rx={2} ry={2}
        fill="rgba(255,255,255,0.02)"
        stroke={highlight ? "rgba(255,45,45,0.6)" : "rgba(255,255,255,0.16)"}
        strokeWidth="1"
      />
      {accentDot && <circle cx={x + 10} cy={y + 16} r="3" fill={accentDot} />}
      <text x={x + (accentDot ? 22 : 10)} y={y + 22} fill="var(--fg)" fontSize="16" letterSpacing="0.18em" fontWeight="600">
        {label}
      </text>
      {sub && (
        <text x={x + 10} y={y + 44} fill="var(--muted)" fontSize="16" letterSpacing="0.16em">
          {sub.toUpperCase()}
        </text>
      )}
    </g>
  );
}

function Line({ x1, y1, x2, y2, arrow }: { x1: number; y1: number; x2: number; y2: number; arrow?: boolean }) {
  return (
    <line
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke="var(--accent)"
      strokeOpacity="0.65"
      strokeWidth="1.1"
      markerEnd={arrow ? "url(#aura-arrow)" : undefined}
    />
  );
}
