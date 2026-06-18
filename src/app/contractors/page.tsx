import Link from "next/link";
import { StatusBadge } from "@/components/StatusBadge";
import { CONTRACTORS } from "@/lib/data";
import { tierForContractor, TIER_STYLE } from "@/lib/status";
import type { StatusTier } from "@/lib/types";
import { Filter, Search, MapPin } from "lucide-react";

const CAPS = [
  "Mechanical Install", "Electrical Install", "Controls / PLC", "Conveyor Install",
  "Rigging", "Crane Operator", "Welding", "Sheet Metal", "Site Survey",
];
const TIERS: StatusTier[] = ["expired", "critical", "warning", "upcoming", "ok"];

interface SP { state?: string; capability?: string; status?: string; q?: string }

export const metadata = { title: "Contractors — DF&I Subcontractor Coverage" };

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
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Contractors</h1>
          <p className="text-sm text-slate-500">
            {filtered.length} of {CONTRACTORS.length} subs match the current filters.
          </p>
        </div>
      </div>

      {/* Filters */}
      <form className="rounded-2xl border border-slate-200 bg-white p-4 grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
        <label className="md:col-span-2">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Search</div>
          <div className="relative mt-1">
            <Search className="h-4 w-4 absolute left-2 top-2.5 text-slate-400" />
            <input
              name="q"
              defaultValue={q}
              placeholder="Company, contact, city..."
              className="w-full pl-8 pr-3 py-2 rounded-md border border-slate-200 text-sm focus:border-[var(--color-brand-500)] focus:outline-none"
            />
          </div>
        </label>
        <label>
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">State</div>
          <input
            name="state"
            defaultValue={stateF}
            maxLength={2}
            placeholder="TX"
            className="mt-1 w-full px-3 py-2 rounded-md border border-slate-200 text-sm uppercase font-mono"
          />
        </label>
        <label>
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Capability</div>
          <select name="capability" defaultValue={capF} className="mt-1 w-full px-3 py-2 rounded-md border border-slate-200 text-sm bg-white">
            <option value="">Any</option>
            {CAPS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <label>
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Status</div>
          <select name="status" defaultValue={statusF} className="mt-1 w-full px-3 py-2 rounded-md border border-slate-200 text-sm bg-white">
            <option value="">Any</option>
            {TIERS.map((t) => <option key={t} value={t}>{TIER_STYLE[t].label}</option>)}
          </select>
        </label>
        <div className="md:col-span-5 flex gap-2 justify-end">
          <Link href="/contractors" className="text-xs px-3 py-2 rounded-md text-slate-600 hover:bg-slate-100">Reset</Link>
          <button type="submit" className="text-xs font-semibold px-3 py-2 rounded-md bg-[var(--color-brand-600)] text-white hover:bg-[var(--color-brand-700)] inline-flex items-center gap-1">
            <Filter className="h-3.5 w-3.5" /> Apply
          </button>
        </div>
      </form>

      {/* List */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
            <tr>
              <th className="text-left px-4 py-3">Company</th>
              <th className="text-left px-4 py-3">Contact</th>
              <th className="text-left px-4 py-3">Location</th>
              <th className="text-left px-4 py-3">Capabilities</th>
              <th className="text-left px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(({ c, tier }) => (
              <tr key={c.id} className="border-t border-slate-100 hover:bg-slate-50/60">
                <td className="px-4 py-3 align-top">
                  <Link href={`/contractors/${c.id}`} className="font-medium text-[var(--color-brand-700)] hover:underline">
                    {c.company}
                  </Link>
                </td>
                <td className="px-4 py-3 align-top">
                  <div>{c.contact_name}</div>
                  <div className="text-xs text-slate-500">{c.email}</div>
                </td>
                <td className="px-4 py-3 align-top">
                  <div className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    {c.address.city}, {c.address.state}
                  </div>
                </td>
                <td className="px-4 py-3 align-top">
                  <div className="flex flex-wrap gap-1">
                    {c.capabilities.slice(0, 3).map((k) => (
                      <span key={k} className="text-[11px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">{k}</span>
                    ))}
                    {c.capabilities.length > 3 && (
                      <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
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
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-500">
                  No contractors match these filters.{" "}
                  <Link href="/contractors" className="underline">Reset</Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
