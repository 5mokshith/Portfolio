"use client";

import { useEffect, useState } from "react";

type StatusConsoleProps = {
  uptimeStartIso: string;
  currentBuild: string[];
};

/**
 * Three-cell status grid (STATUS, FOCUS, LOCATION) plus two big tiles
 * (UPTIME in red, CURRENT BUILD in cyan rotating every 4s). Each status
 * cell has a pulsing dot — alternating red / cyan / red. Live time
 * updates every 60s.
 *
 * Reduced-motion: live timestamp still updates (it's information, not
 * decoration), but the build tile freezes on the first entry and the
 * pulse-dot animation is disabled by the global CSS guard.
 */
export function StatusConsole({ uptimeStartIso, currentBuild }: StatusConsoleProps) {
  const [now, setNow] = useState<Date | null>(null);
  const [buildIdx, setBuildIdx] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setNow(new Date());
  }, []);

  useEffect(() => {
    const tick = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => setBuildIdx((i) => (i + 1) % currentBuild.length), 4000);
    return () => clearInterval(t);
  }, [reduced, currentBuild.length]);

  const time = now
    ? now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false })
    : "—";
  const uptime = now ? formatUptime(uptimeStartIso, now) : "—";

  return (
    <div className="space-y-6">
      {/* status row */}
      <div
        className="grid grid-cols-1 gap-px md:grid-cols-3"
        style={{ background: "var(--hairline)" }}
      >
        <ConsoleCell dot="red" label="STATUS" value={`ONLINE · ${time}`} />
        <ConsoleCell dot="cyan" label="FOCUS" value="GROK PIPELINE PHASE-2" />
        <ConsoleCell dot="red" label="LOCATION" value="KARIMNAGAR · UTC+5:30" />
      </div>

      {/* big tiles */}
      <div
        className="grid grid-cols-1 gap-px md:grid-cols-2"
        style={{ background: "var(--hairline)" }}
      >
        <div className="bg-bg p-7 md:p-9">
          <p
            className="mono-caps text-muted"
            style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace" }}
          >
            UPTIME
          </p>
          <p
            className="font-astro mt-3 leading-[0.9]"
            style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", color: "var(--accent)" }}
          >
            {uptime}
          </p>
          <p
            className="mt-2 mono-caps text-fg/55"
            style={{
              fontFamily: "var(--font-declandar), ui-monospace, monospace",
              fontSize: 10,
            }}
          >
            SINCE FOUNDING-ENGINEER START · FLASHBACK LABS
          </p>
        </div>
        <div className="bg-bg p-7 md:p-9">
          <p
            className="mono-caps text-muted"
            style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace" }}
          >
            CURRENT BUILD
          </p>
          <p
            className="font-astro mt-3 leading-[1.1]"
            style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", color: "var(--cyan)" }}
          >
            {currentBuild[buildIdx]}
          </p>
          <p
            className="mt-2 mono-caps text-fg/55"
            style={{
              fontFamily: "var(--font-declandar), ui-monospace, monospace",
              fontSize: 10,
            }}
          >
            ROTATES · {buildIdx + 1} / {currentBuild.length}
          </p>
        </div>
      </div>
    </div>
  );
}

function ConsoleCell({
  dot,
  label,
  value,
}: {
  dot: "red" | "cyan";
  label: string;
  value: string;
}) {
  return (
    <div className="bg-bg p-6">
      <p
        className="mono-caps text-muted flex items-center gap-2"
        style={{ fontFamily: "var(--font-declandar), ui-monospace, monospace" }}
      >
        <span
          className="pulse-dot inline-block h-1.5 w-1.5 rounded-full"
          style={{ background: dot === "red" ? "var(--accent)" : "var(--cyan)" }}
        />
        {label}
      </p>
      <p className="mt-3 font-chakra text-[0.95rem] text-fg/85">{value}</p>
    </div>
  );
}

function formatUptime(startIso: string, now: Date): string {
  const start = new Date(startIso);
  const ms = now.getTime() - start.getTime();
  const days = Math.floor(ms / 86_400_000);
  const months = Math.floor(days / 30);
  const remDays = days - months * 30;
  return `${months}mo ${remDays}d`;
}
