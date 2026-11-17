import type { ReactNode } from "react";

const TONES = {
  ok: "bg-success/15 text-success",
  warn: "bg-danger/15 text-danger",
  neutral: "bg-line/60 text-muted",
} as const;

export function StatusBadge({ tone, children }: { tone: keyof typeof TONES; children: ReactNode }) {
  return (
    <span className={`inline-block whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ${TONES[tone]}`}>
      {children}
    </span>
  );
}
