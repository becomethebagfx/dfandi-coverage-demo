import USMap from "@/components/Map/USMapDynamic";
import { summarize } from "@/lib/data";

export const metadata = { title: "Coverage Map  -  DF&I Subcontractor Coverage" };

export default async function MapPage({ searchParams }: { searchParams: Promise<{ state?: string }> }) {
  const sp = await searchParams;
  const state = (sp.state ?? "").toUpperCase() || null;
  const s = summarize();
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Coverage map</h1>
          <p className="text-sm text-slate-500">
            {s.total} subcontractors across {s.states_covered} states.
            {state ? <> &middot; Filtered to <span className="font-mono font-semibold">{state}</span></> : null}
          </p>
        </div>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-3">
        <USMap selectedState={state} tall />
      </div>
    </div>
  );
}
