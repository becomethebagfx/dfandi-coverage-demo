import type { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: number | string;
  sublabel?: string;
  /** Optional accent shown as a tiny indicator strip in the corner. */
  tone?: "default" | "danger" | "warn" | "good";
  icon?: LucideIcon;
}

const ACCENT: Record<NonNullable<Props["tone"]>, string> = {
  default: "var(--color-steel)",
  danger:  "var(--color-status-expired)",
  warn:    "var(--color-status-warning)",
  good:    "var(--color-status-ok)",
};

/** Refined KPI tile: hairline border, mono numeric, brass accent on the side. */
export function KpiCard({ label, value, sublabel, tone = "default", icon: Icon }: Props) {
  return (
    <div
      className="relative bg-[var(--color-paper)] border border-[var(--color-ink)]/10 rounded-[5px] px-5 py-5 overflow-hidden"
    >
      {/* Side accent strip */}
      <span
        aria-hidden
        className="absolute left-0 top-0 h-full w-[3px]"
        style={{ background: ACCENT[tone] }}
      />
      <div className="flex items-start justify-between gap-2 ml-1">
        <div className="section-label">{label}</div>
        {Icon ? <Icon className="h-3.5 w-3.5 text-[var(--color-ink)]/40" /> : null}
      </div>
      <div className="mt-3 ml-1 font-mono text-[32px] leading-none tracking-tight tabular-nums text-[var(--color-ink)]">
        {value}
      </div>
      {sublabel ? (
        <div className="mt-2 ml-1 text-[12px] text-[var(--color-ink)]/60 leading-snug">{sublabel}</div>
      ) : null}
    </div>
  );
}
