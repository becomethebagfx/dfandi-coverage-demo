import Link from "next/link";
import { CONTRACTORS, fmtDate } from "@/lib/data";
import { tierForDoc, daysUntil, TIER_STYLE } from "@/lib/status";
import type { StatusTier } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";
import { SectionLabel } from "@/components/SectionLabel";
import { PremiumBadge } from "@/components/PremiumBadge";
import { Send, AlertOctagon, AlertCircle, Clock, CheckCircle2 } from "lucide-react";

export const metadata = { title: "Alerts - DF&I Subcontractor Coverage" };

type Item = { contractor_id: string; company: string; city: string; state: string; doc_type: string; expires: string; days: number; tier: StatusTier };

function bucket(): Record<Exclude<StatusTier, "ok">, Item[]> {
  const out: Record<Exclude<StatusTier, "ok">, Item[]> = { expired: [], critical: [], warning: [], upcoming: [] };
  for (const c of CONTRACTORS) {
    for (const d of c.documents) {
      const t = tierForDoc(d);
      if (t === "ok") continue;
      out[t].push({
        contractor_id: c.id,
        company: c.company,
        city: c.address.city,
        state: c.address.state,
        doc_type: d.type,
        expires: d.expires_date,
        days: daysUntil(d.expires_date),
        tier: t,
      });
    }
  }
  for (const k of Object.keys(out) as Array<Exclude<StatusTier, "ok">>) out[k].sort((a, b) => a.days - b.days);
  return out;
}

const TIER_META: Record<Exclude<StatusTier, "ok">, { title: string; subtitle: string; Icon: typeof AlertOctagon }> = {
  expired:  { title: "Expired",                  subtitle: "Pull the sub off active jobs until refreshed.", Icon: AlertOctagon },
  critical: { title: "Expiring under 30 days",   subtitle: "Send outreach today.",                           Icon: AlertCircle },
  warning:  { title: "Expiring under 90 days",   subtitle: "Schedule outreach this month.",                  Icon: Clock },
  upcoming: { title: "Expiring under 180 days",  subtitle: "On the watchlist.",                              Icon: CheckCircle2 },
};

export default function AlertsPage() {
  const b = bucket();
  const tiers: Array<Exclude<StatusTier, "ok">> = ["expired", "critical", "warning", "upcoming"];
  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8 pt-10 pb-16">
      <header className="border-b border-[var(--color-ink)]/10 pb-6">
        <SectionLabel>Action queue</SectionLabel>
        <h1 className="font-display mt-2 text-[30px] sm:text-[40px] tracking-tight">Alerts</h1>
        <p className="mt-3 max-w-2xl text-[13px] text-[var(--color-ink)]/65 leading-relaxed">
          Every document that needs attention, grouped by urgency. The autonomous agent is already
          on this queue; you only see what it could not close on its own.
        </p>
        <div className="mt-3"><PremiumBadge label="Agent-managed queue" /></div>
      </header>

      <div className="mt-8 space-y-6">
        {tiers.map((t) => {
          const m = TIER_META[t];
          const items = b[t];
          const tone = TIER_STYLE[t].fill;
          return (
            <section key={t} className="rounded-[6px] border border-[var(--color-ink)]/10 bg-[var(--color-paper)] overflow-hidden">
              <header className="flex items-center justify-between gap-3 px-5 py-3 border-b border-[var(--color-ink)]/8 flex-wrap">
                <div className="flex items-center gap-3">
                  <m.Icon className="h-4 w-4" style={{ color: tone }} />
                  <div>
                    <div className="font-display text-[18px] tracking-tight">{m.title}</div>
                    <div className="text-[11px] text-[var(--color-ink)]/55 font-mono uppercase tracking-[0.18em]">{m.subtitle}</div>
                  </div>
                </div>
                <div className="text-[11px] font-mono tabular-nums text-[var(--color-ink)]/55">{items.length} item{items.length === 1 ? "" : "s"}</div>
              </header>
              {items.length === 0 ? (
                <div className="px-5 py-6 text-[13px] text-[var(--color-ink)]/55">Nothing in this tier. Nice.</div>
              ) : (
                <ul className="divide-y divide-[var(--color-ink)]/8">
                  {items.slice(0, 20).map((it) => (
                    <li key={`${it.contractor_id}-${it.doc_type}`} className="px-5 py-3 flex flex-wrap items-center gap-3">
                      <StatusBadge tier={it.tier}>
                        {it.days < 0 ? `${Math.abs(it.days)}d ago` : `${it.days}d`}
                      </StatusBadge>
                      <div className="flex-1 min-w-48">
                        <div className="text-[13px] font-medium">
                          <Link href={`/contractors/${it.contractor_id}`} className="hover:text-[var(--color-brass)]">{it.company}</Link>
                        </div>
                        <div className="text-[11px] text-[var(--color-ink)]/55 font-mono uppercase tracking-[0.06em]">
                          {it.doc_type} &middot; {fmtDate(it.expires)} &middot; {it.city}, {it.state}
                        </div>
                      </div>
                      <Link
                        href={`/outreach?id=${it.contractor_id}`}
                        className="text-[11px] font-mono uppercase tracking-[0.18em] px-3 py-2.5 min-h-[36px] rounded-[3px] bg-[var(--color-ink)] text-[var(--color-paper)] hover:bg-[var(--color-ink-soft)] inline-flex items-center gap-1.5"
                      >
                        <Send className="h-3 w-3" /> Outreach
                      </Link>
                    </li>
                  ))}
                  {items.length > 20 && (
                    <li className="px-5 py-3 text-[11px] font-mono uppercase tracking-[0.18em] text-[var(--color-ink)]/55">
                      + {items.length - 20} more in this tier...
                    </li>
                  )}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
