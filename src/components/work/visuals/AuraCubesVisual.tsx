"use client";
import Cubes from "@/components/reactbits/Cubes";

/**
 * AURA — single Cubes layer (red ripple) with an SVG agent-DAG overlay
 * showing Planner → 5 Workers → Evaluator. The DAG pulses red→cyan in
 * sequence, reading as an active execution. Replaces the previous
 * double-Cubes setup which was costing ~400 animated divs and 2 GSAP loops.
 */
export function AuraCubesVisual() {
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-hairline bg-black/60">
      <Cubes
        gridSize={8}
        maxAngle={45}
        radius={3}
        borderStyle="1px solid rgba(255,45,45,0.35)"
        faceColor="#0a0a0a"
        rippleColor="#ff2d2d"
        rippleSpeed={1.6}
        cellGap={4}
        autoAnimate
        rippleOnClick
      />

      {/* cyan vignette sweep in place of the second cubes layer */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-screen"
        style={{
          background:
            "radial-gradient(120% 80% at 70% 60%, rgba(0,229,255,0.18) 0%, transparent 60%)",
        }}
      />

      {/* agent DAG overlay */}
      <svg
        aria-hidden
        viewBox="0 0 320 200"
        preserveAspectRatio="xMidYMid meet"
        className="pointer-events-none absolute inset-0 h-full w-full"
        style={{ mixBlendMode: "screen" }}
      >
        <defs>
          <filter id="aura-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* edges: planner → workers */}
        {[40, 80, 100, 120, 160].map((cy, i) => (
          <line
            key={`e1-${i}`}
            x1={60}
            y1={100}
            x2={160}
            y2={cy}
            stroke="rgba(255,255,255,0.18)"
            strokeWidth={0.6}
            className="aura-edge"
            style={{ animationDelay: `${0.2 + i * 0.08}s` }}
          />
        ))}
        {/* edges: workers → evaluator */}
        {[40, 80, 100, 120, 160].map((cy, i) => (
          <line
            key={`e2-${i}`}
            x1={160}
            y1={cy}
            x2={260}
            y2={100}
            stroke="rgba(255,255,255,0.18)"
            strokeWidth={0.6}
            className="aura-edge"
            style={{ animationDelay: `${0.6 + i * 0.08}s` }}
          />
        ))}

        {/* planner */}
        <g className="aura-node" style={{ animationDelay: "0s" }}>
          <circle cx={60} cy={100} r={8} fill="#ff2d2d" filter="url(#aura-glow)" />
          <circle cx={60} cy={100} r={3} fill="#fff" />
        </g>
        {/* workers */}
        {[40, 80, 100, 120, 160].map((cy, i) => (
          <g key={`w-${i}`} className="aura-node" style={{ animationDelay: `${0.4 + i * 0.1}s` }}>
            <circle cx={160} cy={cy} r={5} fill="#00e5ff" filter="url(#aura-glow)" />
          </g>
        ))}
        {/* evaluator */}
        <g className="aura-node" style={{ animationDelay: "1.1s" }}>
          <circle cx={260} cy={100} r={8} fill="#ff2d2d" filter="url(#aura-glow)" />
          <circle cx={260} cy={100} r={3} fill="#fff" />
        </g>

        {/* labels */}
        <g
          fontFamily="var(--font-declandar), ui-monospace, monospace"
          fontSize={6}
          letterSpacing={1.2}
          fill="rgba(250,250,250,0.55)"
        >
          <text x={60} y={124} textAnchor="middle">PLANNER</text>
          <text x={160} y={184} textAnchor="middle">5 WORKERS</text>
          <text x={260} y={124} textAnchor="middle">EVALUATOR</text>
        </g>
      </svg>

      <p
        className="pointer-events-none absolute left-3 top-3 z-10 mono-caps text-fg/55"
        style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace", fontSize: 9 }}
      >
        <span style={{ color: "var(--accent)" }}>●</span>
        <span style={{ color: "var(--cyan)", marginLeft: 2 }}>●</span> CLICK · MULTI-AGENT
      </p>

      <style jsx>{`
        :global(.aura-node) {
          transform-origin: center;
          animation: aura-pulse 2.6s ease-in-out infinite;
        }
        :global(.aura-edge) {
          stroke-dasharray: 4 6;
          animation: aura-dash 4s linear infinite;
        }
        @keyframes aura-pulse {
          0%, 100% { opacity: 0.55; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.18); }
        }
        @keyframes aura-dash {
          to { stroke-dashoffset: -40; }
        }
        @media (prefers-reduced-motion: reduce) {
          :global(.aura-node), :global(.aura-edge) { animation: none; }
        }
      `}</style>
    </div>
  );
}
