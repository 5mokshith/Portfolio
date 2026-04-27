"use client";

import { useEffect, useState } from "react";

type Props = {
  /** ISO instant to count from */
  anchorIso: string;
  className?: string;
};

function format(elapsedMs: number): string {
  const total = Math.max(0, Math.floor(elapsedMs / 1000));
  const days = Math.floor(total / 86_400);
  const hours = Math.floor((total % 86_400) / 3600);
  const mins = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${days}d ${pad(hours)}h ${pad(mins)}m ${pad(secs)}s`;
}

/**
 * Live elapsed-time readout. Server render emits a non-ticking placeholder
 * to avoid hydration mismatch (server time ≠ client time on hydrate). On
 * mount the client computes the real elapsed value and starts ticking once
 * per second. Brief flash on first paint is the standard tradeoff for
 * client-only live values.
 */
export function UptimeCounter({ anchorIso, className }: Props) {
  const anchorMs = new Date(anchorIso).getTime();
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className={className} suppressHydrationWarning>
      {now === null ? "—" : format(now - anchorMs)}
    </span>
  );
}
