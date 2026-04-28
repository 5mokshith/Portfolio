"use client";
import Cubes from "@/components/reactbits/Cubes";

export function AuraCubesVisual() {
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-hairline bg-black/60">
      <Cubes
        gridSize={10}
        maxAngle={45}
        radius={3}
        borderStyle="1px solid rgba(255,45,45,0.4)"
        faceColor="#0a0a0a"
        rippleColor="#ff2d2d"
        rippleSpeed={1.6}
        cellGap={4}
        autoAnimate
        rippleOnClick
      />
      {/* secondary cyan ripple overlay */}
      <div className="pointer-events-none absolute inset-0 mix-blend-screen opacity-50">
        <Cubes
          gridSize={10}
          maxAngle={45}
          radius={3}
          borderStyle="1px solid rgba(0,229,255,0.25)"
          faceColor="transparent"
          rippleColor="#00e5ff"
          rippleSpeed={2.0}
          cellGap={4}
          autoAnimate
        />
      </div>
      <p
        className="pointer-events-none absolute left-3 top-3 z-10 mono-caps text-fg/55"
        style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace", fontSize: 9 }}
      >
        <span style={{ color: "var(--accent)" }}>●</span>
        <span style={{ color: "var(--cyan)", marginLeft: 2 }}>●</span> CLICK · MULTI-AGENT
      </p>
    </div>
  );
}
