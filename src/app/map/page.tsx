import USMap from "@/components/Map/USMapDynamic";
import { SectionLabel } from "@/components/SectionLabel";
import { summarize } from "@/lib/data";

export const metadata = { title: "Coverage Map - DF&I Subcontractor Coverage" };

export default async function MapPage({ searchParams }: { searchParams: Promise<{ state?: string }> }) {
  const sp = await searchParams;
  const state = (sp.state ?? "").toUpperCase() || null;
  const s = summarize();
  return (
    <div className="mx-auto max-w-7xl px-5 sm:px-8 pt-10 pb-16">
      <header className="border-b border-[var(--color-ink)]/10 pb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <SectionLabel>Coverage map</SectionLabel>
          <h1 className="font-display mt-2 text-[30px] sm:text-[40px] tracking-tight">
            {state ? `Filtered to ${state}` : "Every state, every sub, every status."}
          </h1>
          <p className="mt-3 max-w-xl text-[14px] text-[var(--color-ink)]/65 leading-relaxed">
            <span className="font-mono tabular-nums">{s.total}</span> subcontractors across
            <span className="font-mono tabular-nums"> {s.states_covered}</span> states.
            Hover any state for counts and the worst status on file. Click a pin for the profile.
          </p>
        </div>
      </header>
      <div className="mt-6 rounded-[6px] border border-[var(--color-ink)]/10 bg-[var(--color-paper)] p-3 sm:p-4">
        <USMap selectedState={state} tall />
      </div>
    </div>
  );
}
