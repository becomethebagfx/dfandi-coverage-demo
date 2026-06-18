import { TIER_STYLE } from "@/lib/status";
import type { StatusTier } from "@/lib/types";

export function StatusBadge({ tier, children }: { tier: StatusTier; children?: React.ReactNode }) {
  const s = TIER_STYLE[tier];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ring-1 ${s.bg} ${s.text} ${s.ring}`}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.fill }} />
      {children ?? s.label}
    </span>
  );
}
