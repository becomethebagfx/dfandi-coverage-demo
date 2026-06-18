import { Users, MapPinned, AlertOctagon, AlertCircle, ArrowUpRight, Sparkles } from "lucide-react";
import Link from "next/link";
import USMap from "@/components/Map/USMapDynamic";
import { KpiCard } from "@/components/KpiCard";
import { StatusBadge } from "@/components/StatusBadge";
import { SectionLabel } from "@/components/SectionLabel";
import { PremiumBadge } from "@/components/PremiumBadge";
import { CONTRACTORS, rollupByState, summarize, fmtDate } from "@/lib/data";
import { tierForDoc } from "@/lib/status";

export default function HomePage() {
  const s = summarize();

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
    .slice(0, 6);

  return (
    <div className="mx-auto max-w-7xl px-5 sm:px-8 pt-10 pb-16 reveal">
      {/* Editorial header (typography-led, no gradient) */}
      <header className="border-b border-[var(--color-ink)]/10 pb-8 sm:pb-10">
        <div className="flex items-center justify-between gap-3">
          <SectionLabel>Operations &middot; coverage</SectionLabel>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-ink)]/55">
            Updated today
          </span>
        </div>
        <h1 className="font-display mt-3 text-[34px] sm:text-[44px] lg:text-[56px] leading-[1.04] tracking-tight text-[var(--color-ink)] max-w-4xl">
          Every subcontractor, every certificate, every state where you build.
        </h1>
        <p className="mt-4 max-w-2xl text-[14px] sm:text-[15px] text-[var(--color-ink)]/70 leading-relaxed">
          A single operational view for DF&amp;I&apos;s installer network. Hover any state to see who you have
          and what is about to lapse. Drill in for documents and contact, or let the agent take it from there.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href="/map"
            className="inline-flex items-center gap-2 rounded-[4px] bg-[var(--color-ink)] text-[var(--color-paper)] px-4 py-2.5 text-[13px] hover:bg-[var(--color-ink-soft)]"
          >
            Open coverage map <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/alerts"
            className="inline-flex items-center gap-2 rounded-[4px] border border-[var(--color-ink)]/15 px-4 py-2.5 text-[13px] hover:border-[var(--color-ink)]/40"
          >
            <AlertOctagon className="h-4 w-4 text-[var(--color-status-expired)]" />
            <span className="font-mono tabular-nums">{s.expired_docs + s.critical_docs}</span> urgent items
          </Link>
          <Link
            href="/upload"
            className="inline-flex items-center gap-2 rounded-[4px] border border-[var(--color-brass)]/40 bg-[var(--color-brass-tint)] text-[var(--color-brass)] px-4 py-2.5 text-[13px] hover:bg-[var(--color-brass)]/15"
          >
            <Sparkles className="h-4 w-4" />
            Drop a new COI
          </Link>
        </div>
      </header>

      {/* KPIs */}
      <section className="mt-8 sm:mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KpiCard label="Subcontractors" value={s.total} sublabel="On file" icon={Users} />
        <KpiCard label="States covered" value={s.states_covered} sublabel={`of 50`} icon={MapPinned} />
        <KpiCard
          label="Expired docs"
          value={s.expired_docs}
          sublabel={`${s.expired_contractors} subs affected`}
          tone="danger"
          icon={AlertOctagon}
        />
        <KpiCard
          label="Expiring < 90 days"
          value={s.critical_docs + s.warning_docs}
          sublabel={`${s.critical_docs} under 30 days`}
          tone="warn"
          icon={AlertCircle}
        />
      </section>

      {/* Map + side rails */}
      <section className="mt-8 sm:mt-10 grid grid-cols-1 lg:grid-cols-[minmax(0,1.65fr)_minmax(280px,1fr)] gap-5 lg:gap-6 items-start">
        <div className="rounded-[6px] border border-[var(--color-ink)]/10 bg-[var(--color-paper)] overflow-hidden">
          <div className="flex flex-wrap items-end justify-between gap-3 px-4 sm:px-5 pt-4 pb-3 border-b border-[var(--color-ink)]/8">
            <div>
              <SectionLabel>Coverage map</SectionLabel>
              <h2 className="font-display mt-1 text-[20px] sm:text-[22px] tracking-tight">
                Hover, click, drill in.
              </h2>
            </div>
            <Link href="/map" className="text-[12px] inline-flex items-center gap-1 text-[var(--color-steel)] hover:text-[var(--color-brass)]">
              Full screen <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="p-3">
            <USMap />
          </div>
        </div>

        <div className="space-y-5">
          {/* Action queue */}
          <div className="rounded-[6px] border border-[var(--color-ink)]/10 bg-[var(--color-paper)] overflow-hidden">
            <div className="px-4 sm:px-5 pt-4 pb-3 border-b border-[var(--color-ink)]/8 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <SectionLabel>Action queue</SectionLabel>
                <PremiumBadge label="Agentic" title="The autonomous agent monitors expirations and surfaces these for you." />
              </div>
              <Link href="/alerts" className="text-[11px] text-[var(--color-steel)] hover:text-[var(--color-brass)]">
                View all
              </Link>
            </div>
            <ul className="divide-y divide-[var(--color-ink)]/8">
              {flagged.map(({ c, d, tier }) => (
                <li key={d.id} className="px-4 sm:px-5 py-3 flex items-start gap-3">
                  <StatusBadge tier={tier} />
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-medium leading-tight truncate">
                      <Link href={`/contractors/${c.id}`} className="hover:text-[var(--color-brass)]">
                        {c.company}
                      </Link>
                    </div>
                    <div className="mt-0.5 text-[11px] text-[var(--color-ink)]/55 truncate font-mono uppercase tracking-[0.06em]">
                      {d.type} &middot; {fmtDate(d.expires_date)} &middot; {c.address.city}, {c.address.state}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Top states at risk */}
          <div className="rounded-[6px] border border-[var(--color-ink)]/10 bg-[var(--color-paper)] overflow-hidden">
            <div className="px-4 sm:px-5 pt-4 pb-3 border-b border-[var(--color-ink)]/8">
              <SectionLabel>States with the most risk</SectionLabel>
            </div>
            <ul className="divide-y divide-[var(--color-ink)]/8">
              {topStatesAtRisk.map((r) => (
                <li key={r.code} className="px-4 sm:px-5 py-3 flex items-center gap-3">
                  <span className="font-mono text-[12px] uppercase tracking-[0.18em] text-[var(--color-steel)] w-6">{r.code}</span>
                  <Link href={`/contractors?state=${r.code}`} className="flex-1 text-[13px] font-medium hover:text-[var(--color-brass)] truncate">
                    {r.name}
                  </Link>
                  <span className="font-mono text-[11px] tabular-nums text-[var(--color-ink)]/55">
                    {r.contractor_count} subs
                  </span>
                  <div className="flex items-center gap-1">
                    {r.expired_count > 0 && <StatusBadge tier="expired">{r.expired_count}</StatusBadge>}
                    {r.critical_count > 0 && <StatusBadge tier="critical">{r.critical_count}</StatusBadge>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
