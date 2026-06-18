import type { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: number | string;
  sublabel?: string;
  tone?: "default" | "danger" | "warn" | "good";
  icon?: LucideIcon;
}

const TONE: Record<NonNullable<Props["tone"]>, string> = {
  default: "border-slate-200 bg-white",
  danger:  "border-rose-200 bg-rose-50",
  warn:    "border-amber-200 bg-amber-50",
  good:    "border-emerald-200 bg-emerald-50",
};

export function KpiCard({ label, value, sublabel, tone = "default", icon: Icon }: Props) {
  return (
    <div className={`relative rounded-2xl border ${TONE[tone]} p-5 shadow-sm`}>
      <div className="flex items-start justify-between">
        <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">{label}</div>
        {Icon ? <Icon className="h-4 w-4 text-slate-400" /> : null}
      </div>
      <div className="mt-2 text-3xl font-semibold tabular-nums text-[var(--color-ink)]">{value}</div>
      {sublabel ? <div className="mt-1 text-xs text-slate-500">{sublabel}</div> : null}
    </div>
  );
}
