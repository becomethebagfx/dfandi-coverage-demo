// Status / risk-tier helpers. Anchored on a fixed "today" for the demo so the
// risk spread in the sample data stays consistent regardless of when someone
// loads it. Swap to `new Date()` once we move to live data.
import type { ComplianceDoc, Contractor, StatusTier } from "./types";

export const TODAY = new Date("2026-06-18T12:00:00Z");

const DAY = 1000 * 60 * 60 * 24;

export function daysUntil(dateIso: string): number {
  const t = new Date(dateIso + "T12:00:00Z").getTime();
  return Math.round((t - TODAY.getTime()) / DAY);
}

export function tierForDoc(doc: ComplianceDoc): StatusTier {
  const d = daysUntil(doc.expires_date);
  if (d < 0) return "expired";
  if (d < 30) return "critical";
  if (d < 90) return "warning";
  if (d < 180) return "upcoming";
  return "ok";
}

const TIER_RANK: Record<StatusTier, number> = {
  expired: 4,
  critical: 3,
  warning: 2,
  upcoming: 1,
  ok: 0,
};

export function tierForContractor(c: Contractor): StatusTier {
  let worst: StatusTier = "ok";
  for (const d of c.documents) {
    const t = tierForDoc(d);
    if (TIER_RANK[t] > TIER_RANK[worst]) worst = t;
  }
  return worst;
}

export function worse(a: StatusTier, b: StatusTier): StatusTier {
  return TIER_RANK[a] >= TIER_RANK[b] ? a : b;
}

/** Tailwind class tuples for each tier, kept centralized so the map, badges,
 *  and tables all share one palette. */
export const TIER_STYLE: Record<
  StatusTier,
  { label: string; bg: string; text: string; ring: string; fill: string }
> = {
  expired:  { label: "Expired",       bg: "bg-rose-100",   text: "text-rose-800",   ring: "ring-rose-300",   fill: "#e11d48" },
  critical: { label: "Under 30 days", bg: "bg-red-100",    text: "text-red-800",    ring: "ring-red-300",    fill: "#dc2626" },
  warning:  { label: "Under 90 days", bg: "bg-amber-100",  text: "text-amber-800",  ring: "ring-amber-300",  fill: "#f59e0b" },
  upcoming: { label: "Under 180 days",bg: "bg-yellow-100", text: "text-yellow-900", ring: "ring-yellow-300", fill: "#facc15" },
  ok:       { label: "Current",       bg: "bg-emerald-100",text: "text-emerald-800",ring: "ring-emerald-300",fill: "#10b981" },
};
