"use client";

import { TerminalType } from "@/components/effects/TerminalType";

/**
 * Key/value readout printed terminal-style. Triggers on scroll-into-view.
 *
 * Source of truth lives in the brief — change here if anything moves
 * (role, station, education, grad date, etc.).
 */
const ROWS = [
  { label: "ROLE", value: "FOUNDING ENGINEER" },
  { label: "COMPANY", value: "FLASHBACK LABS", href: "https://flashbacklabs.com" },
  { label: "STATION", value: "KARIMNAGAR, TELANGANA" },
  { label: "SINCE", value: "SEP 2024" },
  { label: "EDUCATION", value: "B.TECH CSE · JIT KARIMNAGAR" },
  { label: "GRAD", value: "APR 2026" },
];

export function FactStrip() {
  return (
    <div className="border-t border-hairline pt-6">
      <p className="mono-caps text-accent mb-5">// MANIFEST</p>
      <TerminalType rows={ROWS} />
    </div>
  );
}
