import { CONTRACTORS } from "@/lib/data";
import { OutreachComposer } from "@/components/OutreachComposer";
import { SectionLabel } from "@/components/SectionLabel";
import { PremiumBadge } from "@/components/PremiumBadge";
import { tierForContractor } from "@/lib/status";

export const metadata = { title: "Outreach - DF&I Subcontractor Coverage" };

export default async function OutreachPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const sp = await searchParams;
  const ranked = [...CONTRACTORS].sort((a, b) => {
    const order = { expired: 0, critical: 1, warning: 2, upcoming: 3, ok: 4 } as const;
    return order[tierForContractor(a)] - order[tierForContractor(b)];
  });
  return (
    <div className="mx-auto max-w-7xl px-5 sm:px-8 pt-10 pb-16">
      <header className="border-b border-[var(--color-ink)]/10 pb-6">
        <SectionLabel>Renewals</SectionLabel>
        <h1 className="font-display mt-2 text-[30px] sm:text-[40px] tracking-tight flex items-center flex-wrap gap-3">
          Outreach <PremiumBadge label="Agentic" />
        </h1>
        <p className="mt-3 max-w-2xl text-[13px] text-[var(--color-ink)]/65 leading-relaxed">
          The autonomous compliance agent in action. Pick any contractor and the assistant drafts a tailored
          renewal email referencing exactly which documents are coming due, when, and what to send back.
          In production this runs on a schedule; here it is one click.
        </p>
      </header>
      <div className="mt-8">
        <OutreachComposer contractors={ranked} initialId={sp.id} />
      </div>
    </div>
  );
}
