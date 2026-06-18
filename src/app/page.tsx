import { Users, MapPinned, AlertOctagon, AlertCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import USMap from "@/components/Map/USMapDynamic";
import { KpiCard } from "@/components/KpiCard";
import { StatusBadge } from "@/components/StatusBadge";
import { CONTRACTORS, rollupByState, summarize, fmtDate } from "@/lib/data";
import { tierForDoc } from "@/lib/status";

export default function HomePage() {
  const s = summarize();

  // Build the critical alert list: pull each expired or under-30d document
  // across all contractors, sorted by how long ago / soon the expiry is.
  const flagged = CONTRACTORS.flatMap((c) =>
    c.documents
      .map((d) => ({ c, d, tier: tierForDoc(d) }))
      .filter((x) => x.tier === "expired" || x.tier === "critical"),
  )
    .sort((a, b) => a.d.expires_date.localeCompare(b.d.expires_date))
    .slice(0, 6);

  const rollups = rollupByState();
  const topStatesAtRisk = Object.values(rollups)
    .filter((r) => r.expired_count + r.critical_count > 0)
    .sort(
      (a, b) =>
        b.expired_count * 2 + b.critical_count - (a.expired_count * 2 + a.critical_count),
    )
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="rounded-3xl bg-gradient-to-br from-[var(--color-brand-900)] via-[var(--color-brand-800)] to-[var(--color-brand-600)] text-white px-8 py-10 shadow-lg">
        <div className="flex items-start gap-6 flex-col lg:flex-row lg:items-center">
          <div className="flex-1">
            <div className="text-[11px] uppercase tracking-widest text-white/70 font-semibold">
              Coverage &amp; Compliance
            </div>
            <h1 className="mt-2 text-3xl md:text-4xl font-semibold leading-tight">
              Know every subcontractor, every cert, everywhere you work.
            </h1>
            <p className="mt-3 text-white/80 max-w-2xl text-sm md:text-base">
              An interactive coverage map for Design Fabricators &amp; Integrators. Hover any state to see
              who you have, what they can do, and what is about to expire. Drill in for documents,
              contact info, and one-click outreach.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
            <Link
              href="/map"
              className="inline-flex items-center gap-2 rounded-lg bg-white text-[var(--color-brand-800)] px-4 py-2 text-sm font-semibold hover:bg-white/90"
            >
              Open coverage map <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/alerts"
              className="inline-flex items-center gap-2 rounded-lg bg-white/10 ring-1 ring-white/30 text-white px-4 py-2 text-sm font-semibold hover:bg-white/20"
            >
              {s.expired_docs + s.critical_docs} urgent alerts <AlertOctagon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* KPIs */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="Subcontractors" value={s.total} sublabel="On file, US-wide" icon={Users} />
        <KpiCard label="States covered" value={s.states_covered} sublabel="Out of 50" icon={MapPinned} />
        <KpiCard
          label="Expired documents"
          value={s.expired_docs}
          sublabel={`${s.expired_contractors} contractors affected`}
          tone={s.expired_docs > 0 ? "danger" : "good"}
          icon={AlertOctagon}
        />
        <KpiCard
          label="Expiring under 90 days"
          value={s.critical_docs + s.warning_docs}
          sublabel={`${s.critical_docs} under 30 days`}
          tone="warn"
          icon={AlertCircle}
        />
      </section>

      {/* Map */}
      <section className="grid grid-cols-1 lg:grid-cols-[1.65fr_1fr] gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-3">
          <div className="flex items-center justify-between px-3 pb-2">
            <div>
              <h2 className="text-lg font-semibold">Coverage map</h2>
              <p className="text-xs text-slate-500">
                Hover a state for counts. Click to see its contractors. Click a pin for a profile.
              </p>
            </div>
            <Link
              href="/map"
              className="text-xs font-semibold text-[var(--color-brand-700)] hover:underline inline-flex items-center gap-1"
            >
              Open full screen <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <USMap />
        </div>
        <div className="space-y-4">
          {/* Critical ticker */}
          <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-800 font-semibold">
                <AlertOctagon className="h-4 w-4" />
                Action queue
              </div>
              <Link href="/alerts" className="text-xs text-rose-700 hover:underline">
                View all
              </Link>
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              {flagged.map(({ c, d, tier }) => (
                <li key={d.id} className="rounded-lg bg-white px-3 py-2 ring-1 ring-rose-100 flex items-start gap-2">
                  <StatusBadge tier={tier} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium leading-tight truncate">
                      <Link href={`/contractors/${c.id}`} className="hover:underline">{c.company}</Link>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {d.type} &middot; {fmtDate(d.expires_date)} &middot; {c.address.city}, {c.address.state}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {/* Top states at risk */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <h3 className="text-sm font-semibold text-slate-800">States with the most risk</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {topStatesAtRisk.map((r) => (
                <li key={r.code} className="flex items-center gap-2">
                  <span className="w-7 inline-block text-xs font-mono text-slate-500">{r.code}</span>
                  <Link href={`/contractors?state=${r.code}`} className="font-medium hover:underline flex-1">
                    {r.name}
                  </Link>
                  <span className="text-xs text-slate-500">
                    {r.contractor_count} subs
                  </span>
                  {r.expired_count > 0 && <StatusBadge tier="expired">{r.expired_count} expired</StatusBadge>}
                  {r.critical_count > 0 && <StatusBadge tier="critical">{r.critical_count} &lt; 30d</StatusBadge>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
