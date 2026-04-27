/**
 * Architecture diagram for the Grok pipeline.
 *
 *   [SQS QUEUE] → [TS SCRAPER] → [GO PROCESSOR]
 *                                      │
 *                            ┌─ URL ───┤
 *                            ├ SHA-256 ┤  triple dedup
 *                            └─ pHASH ─┤
 *                                      ↓
 *                                [ENRICHER] → [S3 / DDB]
 *
 * Hairline white strokes for nodes, accent red on data-flow arrows.
 * Mono labels via the design-system font variable.
 */
export function GrokDiagram() {
  return (
    <svg
      viewBox="0 0 800 480"
      className="w-full"
      style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace" }}
      aria-label="Grok pipeline architecture: SQS to TS Scraper to Go Processor through triple dedup to Enricher and S3/DDB"
    >
      <defs>
        <marker id="grok-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 Z" fill="var(--accent)" />
        </marker>
        <linearGradient id="grok-node" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgba(255,255,255,0.04)" />
          <stop offset="1" stopColor="rgba(255,255,255,0.01)" />
        </linearGradient>
      </defs>

      {/* row 1 — ingest */}
      <Node x={20} y={40} w={170} h={70} label="SQS QUEUE" sub="ingest · 10 acct rotation" />
      <Arrow x1={190} y1={75} x2={250} y2={75} />
      <Node x={250} y={40} w={170} h={70} label="TS SCRAPER" sub="playwright · stealth fp" />
      <Arrow x1={420} y1={75} x2={480} y2={75} />
      <Node x={480} y={40} w={170} h={70} label="GO PROCESSOR" sub="goroutine pool · onnx" highlight />

      {/* down to dedup */}
      <Arrow x1={565} y1={110} x2={565} y2={170} vertical />

      {/* dedup tier — three filters in series */}
      <DedupTier x={310} y={170} />

      {/* down to enricher */}
      <Arrow x1={565} y1={310} x2={565} y2={360} vertical />

      {/* row 3 — enrich + sink */}
      <Node x={480} y={360} w={170} h={70} label="ENRICHER" sub="scrfd faces · meta" />
      <Arrow x1={650} y1={395} x2={710} y2={395} />
      <Node x={710} y={360} w={70} h={70} label="S3" sub="DDB" small />

      {/* lateral cue: backpressure */}
      <text x={20} y={395} fill="var(--muted)" fontSize="13" letterSpacing="0.18em">
        BACKPRESSURE
      </text>
      <text x={20} y={410} fill="var(--muted)" fontSize="13" letterSpacing="0.18em">
        VISIBILITY 30s
      </text>
      <text x={20} y={425} fill="rgba(255,45,45,0.8)" fontSize="13" letterSpacing="0.18em">
        DLQ ON FAIL
      </text>
    </svg>
  );
}

/* ── primitives ─────────────────────────────────────────────────── */

function Node({
  x, y, w, h, label, sub, highlight, small,
}: {
  x: number; y: number; w: number; h: number;
  label: string; sub?: string;
  highlight?: boolean; small?: boolean;
}) {
  return (
    <g>
      <rect
        x={x} y={y} width={w} height={h} rx={2} ry={2}
        fill="url(#grok-node)"
        stroke={highlight ? "rgba(255,45,45,0.65)" : "rgba(255,255,255,0.18)"}
        strokeWidth="1"
      />
      {/* corner ticks for HUD vibe */}
      <Tick x={x} y={y} />
      <Tick x={x + w} y={y} flipX />
      <Tick x={x} y={y + h} flipY />
      <Tick x={x + w} y={y + h} flipX flipY />
      <text x={x + 10} y={y + 30} fill="var(--fg)" fontSize={small ? 14 : 16} letterSpacing="0.18em" fontWeight="600">
        {label}
      </text>
      {sub && (
        <text x={x + 10} y={y + 50} fill="var(--muted)" fontSize="13" letterSpacing="0.16em">
          {sub.toUpperCase()}
        </text>
      )}
    </g>
  );
}

function Tick({ x, y, flipX = false, flipY = false }: { x: number; y: number; flipX?: boolean; flipY?: boolean }) {
  const dx = flipX ? -1 : 1;
  const dy = flipY ? -1 : 1;
  return (
    <path
      d={`M ${x} ${y + 6 * dy} L ${x} ${y} L ${x + 6 * dx} ${y}`}
      fill="none"
      stroke="rgba(255,45,45,0.55)"
      strokeWidth="1"
    />
  );
}

function Arrow({ x1, y1, x2, y2, vertical }: { x1: number; y1: number; x2: number; y2: number; vertical?: boolean }) {
  return (
    <line
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke="var(--accent)"
      strokeWidth="1.25"
      strokeDasharray={vertical ? undefined : "0"}
      markerEnd="url(#grok-arrow)"
    />
  );
}

function DedupTier({ x, y }: { x: number; y: number }) {
  const filters = [
    { name: "URL", sub: "exact match" },
    { name: "SHA-256", sub: "byte hash" },
    { name: "pHASH", sub: "perceptual" },
  ];
  return (
    <g>
      {/* container */}
      <rect
        x={x} y={y} width={510} height={120} rx={2} ry={2}
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1"
        strokeDasharray="3 3"
      />
      <text x={x + 12} y={y + 18} fill="var(--accent)" fontSize="13" letterSpacing="0.22em">
        TRIPLE DEDUP
      </text>
      {filters.map((f, i) => {
        const fx = x + 30 + i * 165;
        return (
          <g key={f.name}>
            <rect
              x={fx} y={y + 32} width={140} height={70} rx={1.5} ry={1.5}
              fill="rgba(0,0,0,0.4)"
              stroke="rgba(255,45,45,0.4)"
              strokeWidth="1"
            />
            <text x={fx + 10} y={y + 56} fill="var(--fg)" fontSize="16" letterSpacing="0.18em" fontWeight="600">
              {f.name}
            </text>
            <text x={fx + 10} y={y + 76} fill="var(--muted)" fontSize="13" letterSpacing="0.16em">
              {f.sub.toUpperCase()}
            </text>
            {i < filters.length - 1 && (
              <line
                x1={fx + 140} y1={y + 67} x2={fx + 165} y2={y + 67}
                stroke="rgba(255,45,45,0.6)"
                strokeWidth="1"
              />
            )}
          </g>
        );
      })}
    </g>
  );
}
