"use client";

/**
 * AutoDev — animated file-tree spawn. Lines type in one-by-one then loop.
 * Reads "natural language → multi-file project". Pure CSS reveal via
 * staggered keyframes; no JS timers, no layout thrash.
 */

const LINES = [
  { t: "$ create todo-app with auth + drag-and-drop", c: "prompt" },
  { t: "▸ planning…", c: "muted" },
  { t: "├─ src/", c: "tree" },
  { t: "│  ├─ app/", c: "tree" },
  { t: "│  │  ├─ page.tsx", c: "file" },
  { t: "│  │  └─ api/auth/route.ts", c: "file" },
  { t: "│  ├─ components/", c: "tree" },
  { t: "│  │  ├─ TodoList.tsx", c: "file" },
  { t: "│  │  └─ DragHandle.tsx", c: "file" },
  { t: "│  └─ lib/db.ts", c: "file" },
  { t: "└─ package.json", c: "tree" },
  { t: "▸ dev server: webcontainer://3000", c: "ok" },
];

const STEP = 0.35; // seconds per line
const TOTAL = LINES.length * STEP + 2.5;

export function AutoDevFileTreeVisual() {
  return (
    <div
      className="relative aspect-[16/10] w-full overflow-hidden border-b border-hairline"
      style={{
        background:
          "linear-gradient(180deg, #0e0d0c 0%, #0a0a0a 100%)," +
          "radial-gradient(120% 70% at 70% 30%, rgba(0,229,255,0.06) 0%, transparent 60%)",
      }}
    >
      {/* faint grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* terminal frame */}
      <div className="absolute left-5 right-5 top-5 bottom-5 flex flex-col">
        {/* title bar */}
        <div className="flex items-center gap-2 border-b border-hairline pb-1.5">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--accent)" }} />
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.25)" }} />
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--cyan)" }} />
          <span
            className="ml-2 mono-caps text-fg/45"
            style={{
              fontFamily: "var(--font-declandar), ui-monospace, monospace",
              fontSize: 9,
              letterSpacing: "0.18em",
            }}
          >
            AUTODEV · WEBCONTAINER
          </span>
        </div>

        {/* body */}
        <div className="relative mt-2 flex-1 overflow-hidden">
          <pre
            className="ad-stream"
            style={{
              fontFamily: "var(--font-declandar), ui-monospace, monospace",
              fontSize: 11,
              lineHeight: 1.65,
              margin: 0,
              animation: `ad-loop ${TOTAL}s steps(1, end) infinite`,
            }}
          >
            {LINES.map((l, i) => (
              <span
                key={i}
                className="ad-line block"
                style={{
                  color:
                    l.c === "prompt"
                      ? "var(--fg)"
                      : l.c === "muted"
                      ? "rgba(255,255,255,0.4)"
                      : l.c === "ok"
                      ? "var(--cyan)"
                      : l.c === "file"
                      ? "rgba(255,255,255,0.78)"
                      : "rgba(255,255,255,0.55)",
                  animation: `ad-in 0.35s ease-out ${i * STEP}s both`,
                }}
              >
                {l.c === "prompt" && <span style={{ color: "var(--accent)" }}>❯ </span>}
                {l.t}
              </span>
            ))}
          </pre>
        </div>
      </div>

      {/* corner caption */}
      <p
        className="pointer-events-none absolute right-3 top-3 z-10 mono-caps text-fg/55"
        style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace", fontSize: 9 }}
      >
        <span style={{ color: "var(--cyan)" }}>●</span> NL → MULTI-FILE
      </p>

      <style jsx>{`
        @keyframes ad-in {
          from { opacity: 0; transform: translateX(-4px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes ad-loop {
          0%, 92% { opacity: 1; }
          96% { opacity: 0; }
          100% { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          :global(.ad-stream), :global(.ad-line) { animation: none !important; opacity: 1 !important; }
        }
      `}</style>
    </div>
  );
}
