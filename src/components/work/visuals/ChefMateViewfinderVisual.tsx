"use client";

/**
 * ChefMate — faux camera viewfinder with cycling bounding boxes labeling
 * detected ingredients. Reads "on-device detection" instantly. Pure CSS,
 * three boxes alternate via staggered keyframes.
 */
export function ChefMateViewfinderVisual() {
  return (
    <div
      className="relative aspect-[16/10] w-full overflow-hidden border-b border-hairline"
      style={{
        background:
          "radial-gradient(120% 80% at 30% 30%, rgba(255,45,45,0.10) 0%, transparent 60%)," +
          "radial-gradient(100% 70% at 75% 75%, rgba(0,229,255,0.08) 0%, transparent 60%)," +
          "linear-gradient(180deg, #14110F 0%, #0a0a0a 100%)",
      }}
    >
      {/* scanline sweep */}
      <div aria-hidden className="cm-scan pointer-events-none absolute inset-x-0 h-px bg-accent/60" />

      {/* corner brackets */}
      {[
        { top: 12, left: 12, b: "border-l border-t" },
        { top: 12, right: 12, b: "border-r border-t" },
        { bottom: 12, left: 12, b: "border-l border-b" },
        { bottom: 12, right: 12, b: "border-r border-b" },
      ].map((c, i) => (
        <span
          key={i}
          aria-hidden
          className={`pointer-events-none absolute h-4 w-4 ${c.b}`}
          style={{
            ...c,
            borderColor: "var(--cyan)",
            opacity: 0.6,
          }}
        />
      ))}

      {/* center crosshair */}
      <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="relative h-3 w-3">
          <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-accent/60" />
          <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-accent/60" />
        </div>
      </div>

      {/* detection boxes — three cycling */}
      <Bbox top="22%" left="14%" w="28%" h="34%" label="TOMATO" conf="0.94" delay="0s" />
      <Bbox top="48%" left="56%" w="32%" h="38%" label="ONION" conf="0.91" delay="2.4s" />
      <Bbox top="14%" left="58%" w="24%" h="26%" label="GARLIC" conf="0.87" delay="4.8s" />

      {/* corner caption */}
      <p
        className="pointer-events-none absolute left-3 top-3 z-10 mono-caps text-fg/55"
        style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace", fontSize: 9 }}
      >
        <span style={{ color: "var(--accent)" }}>●</span> TFLITE · ON-DEVICE
      </p>

      <p
        className="pointer-events-none absolute right-3 bottom-3 z-10 mono-caps text-fg/40"
        style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace", fontSize: 9 }}
      >
        REC <span className="cm-rec-dot inline-block h-1.5 w-1.5 rounded-full" style={{ background: "var(--accent)" }} />
      </p>

      <style jsx>{`
        :global(.cm-scan) {
          animation: cm-scan 3.6s linear infinite;
        }
        :global(.cm-rec-dot) {
          margin-left: 4px;
          animation: cm-blink 1.2s steps(2, end) infinite;
        }
        @keyframes cm-scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes cm-blink {
          50% { opacity: 0.2; }
        }
        @media (prefers-reduced-motion: reduce) {
          :global(.cm-scan), :global(.cm-rec-dot) { animation: none; }
        }
      `}</style>
    </div>
  );
}

function Bbox({
  top, left, w, h, label, conf, delay,
}: {
  top: string; left: string; w: string; h: string;
  label: string; conf: string; delay: string;
}) {
  return (
    <div
      aria-hidden
      className="cm-box pointer-events-none absolute"
      style={{ top, left, width: w, height: h, animationDelay: delay }}
    >
      <div
        className="absolute inset-0 border"
        style={{ borderColor: "var(--accent)", boxShadow: "0 0 12px rgba(255,45,45,0.35)" }}
      />
      <div
        className="absolute -top-[18px] left-0 px-1.5 py-0.5 mono-caps"
        style={{
          background: "var(--accent)",
          color: "#0a0a0a",
          fontFamily: "var(--font-declandar), ui-monospace, monospace",
          fontSize: 8,
          letterSpacing: "0.18em",
        }}
      >
        {label} · {conf}
      </div>
      <style jsx>{`
        :global(.cm-box) {
          opacity: 0;
          animation: cm-box-in 7.2s ease-in-out infinite;
        }
        @keyframes cm-box-in {
          0%, 100% { opacity: 0; transform: scale(0.96); }
          5% { opacity: 1; transform: scale(1); }
          30% { opacity: 1; transform: scale(1); }
          40% { opacity: 0; transform: scale(0.96); }
        }
        @media (prefers-reduced-motion: reduce) {
          :global(.cm-box) { opacity: 1; animation: none; }
        }
      `}</style>
    </div>
  );
}
