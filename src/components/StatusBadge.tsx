import type { StatusTier } from "@/lib/types";
import { TIER_STYLE } from "@/lib/status";

interface Props {
  tier: StatusTier;
  children?: React.ReactNode;
  /** Subtle = just a dot + label. Default = small filled chip. */
  variant?: "default" | "subtle";
}

/** Refined status chip: dot + label, hairline border, mono label. */
export function StatusBadge({ tier, children, variant = "default" }: Props) {
  const s = TIER_STYLE[tier];
  if (variant === "subtle") {
    return (
      <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink)]/70">
        <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: s.fill }} />
        {children ?? s.label}
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[3px] font-mono text-[10px] uppercase tracking-[0.18em] whitespace-nowrap"
      style={{
        background: `${s.fill}14`,
        color: s.fill,
        border: `1px solid ${s.fill}33`,
      }}
    >
      <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: s.fill }} />
      {children ?? s.label}
    </span>
  );
}
