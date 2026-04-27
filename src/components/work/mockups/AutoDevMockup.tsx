/**
 * Mock browser-window IDE for AutoDev. File tree | code | terminal.
 * Built in HTML+CSS so type renders crisply (no SVG raster scaling).
 * Replace with a real screenshot later by swapping the inner panes.
 */
export function AutoDevMockup() {
  return (
    <div
      className="relative w-full overflow-hidden rounded-md border"
      style={{ borderColor: "rgba(255,255,255,0.1)", boxShadow: "0 30px 80px -40px rgba(0,0,0,0.7)" }}
    >
      {/* browser chrome */}
      <div
        className="flex items-center gap-3 border-b px-4 py-3"
        style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}
      >
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: "rgba(255,45,45,0.7)" }} />
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.2)" }} />
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.2)" }} />
        </div>
        <div
          className="mono-caps flex-1 truncate rounded-sm border px-3 py-1 text-fg/60"
          style={{
            borderColor: "rgba(255,255,255,0.08)",
            background: "rgba(0,0,0,0.4)",
            fontFamily: "var(--font-declandar), ui-monospace, monospace",
          }}
        >
          autodev.local · workspaces / arena / src / app / page.tsx
        </div>
        <span
          className="mono-caps text-accent"
          style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace" }}
        >
          ● LIVE
        </span>
      </div>

      {/* IDE body */}
      <div className="grid grid-cols-12 text-[11px] leading-relaxed" style={{ minHeight: 280 }}>
        {/* file tree */}
        <aside
          className="col-span-3 border-r px-3 py-3"
          style={{
            borderColor: "rgba(255,255,255,0.06)",
            fontFamily: "var(--font-declandar), ui-monospace, monospace",
            color: "rgba(250,250,250,0.7)",
          }}
        >
          <p className="mono-caps text-muted mb-2">EXPLORER</p>
          {[
            "▸ .next",
            "▾ src",
            "  ▾ app",
            "    page.tsx",
            "    layout.tsx",
            "    globals.css",
            "  ▾ components",
            "    Editor.tsx",
            "    Terminal.tsx",
            "  ▾ agents",
            "    planner.ts",
            "    builder.ts",
            "▸ public",
            "package.json",
            "next.config.ts",
          ].map((line, i) => (
            <p key={i} className={line.includes("page.tsx") ? "text-accent" : ""}>
              {line}
            </p>
          ))}
        </aside>

        {/* code */}
        <main
          className="col-span-6 border-r px-4 py-3"
          style={{
            borderColor: "rgba(255,255,255,0.06)",
            fontFamily: "var(--font-declandar), ui-monospace, monospace",
            background: "rgba(0,0,0,0.25)",
          }}
        >
          <pre className="text-[11px] text-fg/85">
{`export default function Page() {
  const { stream } = useAgent({
    model: "claude-opus-4-7",
    tools: [fs, exec, browser],
  });

  return (
    <main>
      <Editor onPrompt={stream} />
      <Terminal source={stream.shell} />
    </main>
  );
}`}
          </pre>
        </main>

        {/* terminal */}
        <aside
          className="col-span-3 px-3 py-3"
          style={{
            fontFamily: "var(--font-declandar), ui-monospace, monospace",
            color: "rgba(250,250,250,0.78)",
            background: "rgba(0,0,0,0.4)",
          }}
        >
          <p className="mono-caps text-muted mb-2">TERMINAL</p>
          <p className="text-fg/60">$ pnpm dev</p>
          <p className="text-fg/60">▲ next dev (turbopack)</p>
          <p className="text-fg/85">  ✓ ready in 412ms</p>
          <p className="text-fg/60">  ✓ compiled / in 38ms</p>
          <p className="mt-3 text-accent">▸ inngest worker online</p>
          <p className="text-fg/60">  agent: scaffold ok</p>
          <p className="text-fg/60">  agent: route added</p>
          <p className="text-fg/60">  agent: tests passed</p>
          <p className="mt-3 text-fg/40">_</p>
        </aside>
      </div>

      {/* status bar */}
      <div
        className="mono-caps flex items-center justify-between border-t px-4 py-2 text-[10px]"
        style={{
          borderColor: "rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.02)",
          color: "rgba(250,250,250,0.55)",
          fontFamily: "var(--font-declandar), ui-monospace, monospace",
        }}
      >
        <span>BRANCH · main</span>
        <span>4 LLM PROVIDERS · GROQ ACTIVE</span>
        <span>WEBCONTAINER · ALIVE</span>
      </div>
    </div>
  );
}
