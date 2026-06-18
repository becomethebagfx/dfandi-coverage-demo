import Link from "next/link";
import { StatusBadge } from "@/components/StatusBadge";
import { SectionLabel } from "@/components/SectionLabel";
import { CONTRACTORS } from "@/lib/data";
import { tierForContractor, TIER_STYLE } from "@/lib/status";
import type { StatusTier } from "@/lib/types";
import { Filter, Search, MapPin, ChevronRight } from "lucide-react";

const CAPS = [
  "Mechanical Install", "Electrical Install", "Controls / PLC", "Conveyor Install",
  "Rigging", "Crane Operator", "Welding", "Sheet Metal", "Site Survey",
];
const TIERS: StatusTier[] = ["expired", "critical", "warning", "upcoming", "ok"];

interface SP { state?: string; capability?: string; status?: string; q?: string }

export const metadata = { title: "Contractors - DF&I Subcontractor Coverage" };

export default async function ContractorsPage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const stateF = (sp.state ?? "").toUpperCase();
  const capF = sp.capability ?? "";
  const statusF = sp.status ?? "";
  const q = (sp.q ?? "").toLowerCase();

  const filtered = CONTRACTORS
    .map((c) => ({ c, tier: tierForContractor(c) }))
    .filter(({ c, tier }) => {
      if (stateF && c.address.state !== stateF) return false;
      if (capF && !c.capabilities.includes(capF as never)) return false;
      if (statusF && tier !== statusF) return false;
      if (q && !`${c.company} ${c.contact_name} ${c.address.city} ${c.address.state}`.toLowerCase().includes(q)) return false;
      return true;
    })
    .sort((a, b) => a.c.company.localeCompare(b.c.company));

  return (
    <div className="mx-auto max-w-7xl px-5 sm:px-8 pt-10 pb-16">
      <header className="border-b border-[var(--color-ink)]/10 pb-6 flex items-end justify-between gap-3 flex-wrap">
        <div>
          <SectionLabel>Directory</SectionLabel>
          <h1 className="font-display mt-2 text-[30px] sm:text-[40px] tracking-tight">Contractors</h1>
          <p className="mt-2 text-[13px] text-[var(--color-ink)]/60">
            <span className="font-mono tabular-nums">{filtered.length}</span> of {CONTRACTORS.length} match the current filters.
          </p>
        </div>
      </header>

      {/* Filters */}
      <form className="mt-6 rounded-[6px] border border-[var(--color-ink)]/10 bg-[var(--color-paper)] p-4 grid grid-cols-2 md:grid-cols-5 gap-3 items-end text-[13px]">
        <label className="col-span-2">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink)]/55">Search</div>
          <div className="relative mt-1">
            <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-[var(--color-ink)]/40" />
            <input
              name="q"
              defaultValue={q}
              placeholder="Company, contact, city..."
              className="w-full pl-8 pr-3 py-2 rounded-[3px] border border-[var(--color-ink)]/15 bg-[var(--color-paper)] outline-none focus:border-[var(--color-brass)]"
            />
          </div>
        </label>
        <label>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink)]/55">State</div>
          <input
            name="state"
            defaultValue={stateF}
            maxLength={2}
            placeholder="TX"
            className="mt-1 w-full px-3 py-2 rounded-[3px] border border-[var(--color-ink)]/15 uppercase font-mono bg-[var(--color-paper)]"
          />
        </label>
        <label>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink)]/55">Capability</div>
          <select name="capability" defaultValue={capF} className="mt-1 w-full px-2.5 py-2 rounded-[3px] border border-[var(--color-ink)]/15 bg-[var(--color-paper)]">
            <option value="">Any</option>
            {CAPS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <label>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink)]/55">Status</div>
          <select name="status" defaultValue={statusF} className="mt-1 w-full px-2.5 py-2 rounded-[3px] border border-[var(--color-ink)]/15 bg-[var(--color-paper)]">
            <option value="">Any</option>
            {TIERS.map((t) => <option key={t} value={t}>{TIER_STYLE[t].label}</option>)}
          </select>
        </label>
        <div className="col-span-2 md:col-span-5 flex gap-2 justify-end">
          <Link href="/contractors" className="text-[12px] px-3 py-2 rounded-[3px] text-[var(--color-ink)]/60 hover:bg-[var(--color-ink)]/5">
            Reset
          </Link>
          <button type="submit" className="text-[12px] inline-flex items-center gap-1.5 px-3 py-2 rounded-[3px] bg-[var(--color-ink)] text-[var(--color-paper)] hover:bg-[var(--color-ink-soft)]">
            <Filter className="h-3.5 w-3.5" /> Apply
          </button>
        </div>
      </form>

      {/* Desktop table */}
      <div className="mt-6 rounded-[6px] border border-[var(--color-ink)]/10 bg-[var(--color-paper)] overflow-hidden hidden md:block">
        <table className="w-full text-[13px]">
          <thead className="bg-[var(--color-paper-soft)]/40">
            <tr className="text-left">
              <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink)]/55">Company</th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink)]/55">Contact</th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink)]/55">Location</th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink)]/55">Capabilities</th>
              <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink)]/55">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(({ c, tier }) => (
              <tr key={c.id} className="border-t border-[var(--color-ink)]/8 hover:bg-[var(--color-brass-tint)]/40">
                <td className="px-4 py-3 align-top">
                  <Link href={`/contractors/${c.id}`} className="font-medium hover:text-[var(--color-brass)]">
                    {c.company}
                  </Link>
                </td>
                <td className="px-4 py-3 align-top">
                  <div>{c.contact_name}</div>
                  <div className="text-[11px] text-[var(--color-ink)]/55 font-mono">{c.email}</div>
                </td>
                <td className="px-4 py-3 align-top">
                  <div className="inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-[var(--color-ink)]/40" />
                    {c.address.city}, {c.address.state}
                  </div>
                </td>
                <td className="px-4 py-3 align-top">
                  <div className="flex flex-wrap gap-1">
                    {c.capabilities.slice(0, 3).map((k) => (
                      <span key={k} className="text-[11px] px-1.5 py-0.5 rounded-[3px] border border-[var(--color-ink)]/12 text-[var(--color-ink)]/75">{k}</span>
                    ))}
                    {c.capabilities.length > 3 && (
                      <span className="text-[11px] px-1.5 py-0.5 rounded-[3px] text-[var(--color-ink)]/50">
                        +{c.capabilities.length - 3}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 align-top">
                  <StatusBadge tier={tier} />
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-[13px] text-[var(--color-ink)]/55">
                  No contractors match these filters. <Link href="/contractors" className="text-[var(--color-brass)] hover:underline">Reset</Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="mt-6 md:hidden space-y-3">
        {filtered.map(({ c, tier }) => (
          <Link
            key={c.id}
            href={`/contractors/${c.id}`}
            className="block rounded-[6px] border border-[var(--color-ink)]/10 bg-[var(--color-paper)] px-4 py-3 active:bg-[var(--color-brass-tint)]/60"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="font-medium text-[14px] truncate">{c.company}</div>
                <div className="mt-1 inline-flex items-center gap-1 text-[12px] text-[var(--color-ink)]/55">
                  <MapPin className="h-3 w-3" />
                  {c.address.city}, {c.address.state}
                </div>
              </div>
              <StatusBadge tier={tier} />
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {c.capabilities.slice(0, 4).map((k) => (
                <span key={k} className="text-[11px] px-1.5 py-0.5 rounded-[3px] border border-[var(--color-ink)]/12 text-[var(--color-ink)]/75">{k}</span>
              ))}
              {c.capabilities.length > 4 && (
                <span className="text-[11px] px-1.5 py-0.5 rounded-[3px] text-[var(--color-ink)]/50">
                  +{c.capabilities.length - 4}
                </span>
              )}
            </div>
            <div className="mt-2 flex items-center justify-between text-[12px] text-[var(--color-ink)]/55">
              <span>{c.contact_name}</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <div className="rounded-[6px] border border-[var(--color-ink)]/10 bg-[var(--color-paper)] p-6 text-center text-[13px] text-[var(--color-ink)]/55">
            No contractors match. <Link href="/contractors" className="text-[var(--color-brass)]">Reset filters</Link>
          </div>
        )}
      </div>
    </div>
  );
}
