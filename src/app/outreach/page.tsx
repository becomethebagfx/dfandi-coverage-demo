import { CONTRACTORS } from "@/lib/data";
import { OutreachComposer } from "@/components/OutreachComposer";
import { tierForContractor } from "@/lib/status";

export const metadata = { title: "Outreach  -  DF&I Subcontractor Coverage" };

export default async function OutreachPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const sp = await searchParams;
  // Prioritize contractors with at-risk docs in the picker so demo defaults are interesting.
  const ranked = [...CONTRACTORS].sort((a, b) => {
    const order = { expired: 0, critical: 1, warning: 2, upcoming: 3, ok: 4 } as const;
    return order[tierForContractor(a)] - order[tierForContractor(b)];
  });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Outreach</h1>
        <p className="text-sm text-slate-500 max-w-3xl">
          Pick any contractor and the assistant drafts a tailored compliance-renewal email referencing
          exactly which documents are coming due, when, and what to send back. In the live build this fires
          automatically on a schedule. Here it is one click for the demo.
        </p>
      </div>
      <OutreachComposer contractors={ranked} initialId={sp.id} />
    </div>
  );
}
