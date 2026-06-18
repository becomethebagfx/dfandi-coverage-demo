import Link from "next/link";
import { CONTRACTORS, fmtDate } from "@/lib/data";
import { tierForDoc, daysUntil, TIER_STYLE } from "@/lib/status";
import type { StatusTier } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";
import { Send, AlertOctagon, AlertCircle, Clock, CheckCircle2 } from "lucide-react";

export const metadata = { title: "Alerts — DF&I Subcontractor Coverage" };

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
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Alerts</h1>
        <p className="text-sm text-slate-500">Every document that needs attention, grouped by how urgent it is.</p>
      </div>

      {tiers.map((t) => {
        const m = TIER_META[t];
        const items = b[t];
        return (
          <section key={t} className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
            <header className="flex items-center justify-between px-5 py-3 border-b border-slate-100" style={{ background: `${TIER_STYLE[t].fill}10` }}>
              <div className="flex items-center gap-2">
                <m.Icon className="h-4 w-4" style={{ color: TIER_STYLE[t].fill }} />
                <div>
                  <div className="font-semibold text-sm">{m.title}</div>
                  <div className="text-[11px] text-slate-500">{m.subtitle}</div>
                </div>
              </div>
              <div className="text-xs text-slate-500">{items.length} item{items.length === 1 ? "" : "s"}</div>
            </header>
            {items.length === 0 ? (
              <div className="px-5 py-6 text-sm text-slate-500">Nothing in this tier. Nice.</div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {items.slice(0, 20).map((it) => (
                  <li key={`${it.contractor_id}-${it.doc_type}`} className="px-5 py-3 flex flex-wrap items-center gap-3">
                    <StatusBadge tier={it.tier}>
                      {it.days < 0 ? `${Math.abs(it.days)}d ago` : `${it.days}d`}
                    </StatusBadge>
                    <div className="flex-1 min-w-64">
                      <div className="text-sm font-medium">
                        <Link href={`/contractors/${it.contractor_id}`} className="hover:underline">{it.company}</Link>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {it.doc_type} &middot; {fmtDate(it.expires)} &middot; {it.city}, {it.state}
                      </div>
                    </div>
                    <Link
                      href={`/outreach?id=${it.contractor_id}`}
                      className="text-[11px] font-semibold px-3 py-1.5 rounded-md bg-slate-900 text-white hover:bg-slate-800 inline-flex items-center gap-1"
                    >
                      <Send className="h-3 w-3" /> Outreach
                    </Link>
                  </li>
                ))}
                {items.length > 20 && (
                  <li className="px-5 py-3 text-[11px] text-slate-500">+ {items.length - 20} more in this tier...</li>
                )}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
