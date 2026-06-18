import Link from "next/link";
import { notFound } from "next/navigation";
import { CONTRACTORS, fmtDate, getContractor } from "@/lib/data";
import { tierForDoc, tierForContractor, daysUntil } from "@/lib/status";
import { StatusBadge } from "@/components/StatusBadge";
import { SectionLabel } from "@/components/SectionLabel";
import { PremiumBadge } from "@/components/PremiumBadge";
import { ArrowLeft, Mail, Phone, MapPin, Send, FileText } from "lucide-react";

export async function generateStaticParams() {
  return CONTRACTORS.map((c) => ({ id: c.id }));
}

export default async function ContractorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = getContractor(id);
  if (!c) notFound();

  const tier = tierForContractor(c);
  const docs = [...c.documents].sort((a, b) => a.expires_date.localeCompare(b.expires_date));

  return (
    <div className="mx-auto max-w-5xl px-5 sm:px-8 pt-8 pb-16">
      <Link href="/contractors" className="inline-flex items-center gap-1 text-[12px] text-[var(--color-ink)]/55 hover:text-[var(--color-ink)]">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to contractors
      </Link>

      <header className="mt-4 border-b border-[var(--color-ink)]/10 pb-6">
        <SectionLabel>
          {c.address.city}, {c.address.state_name}
        </SectionLabel>
        <h1 className="font-display mt-2 text-[28px] sm:text-[36px] lg:text-[44px] leading-tight tracking-tight">
          {c.company}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <StatusBadge tier={tier} />
          {c.capabilities.map((k) => (
            <span key={k} className="text-[11px] px-1.5 py-0.5 rounded-[3px] border border-[var(--color-ink)]/12 text-[var(--color-ink)]/75">{k}</span>
          ))}
        </div>
        {c.notes ? <p className="mt-4 max-w-2xl text-[14px] text-[var(--color-ink)]/70 leading-relaxed">{c.notes}</p> : null}
      </header>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 lg:gap-8 items-start">
        {/* Documents */}
        <section className="rounded-[6px] border border-[var(--color-ink)]/10 bg-[var(--color-paper)] overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--color-ink)]/8 flex items-end justify-between gap-2">
            <div>
              <SectionLabel>Compliance documents</SectionLabel>
              <h2 className="font-display mt-1 text-[20px] tracking-tight">
                <span className="font-mono text-[15px] tabular-nums mr-2 text-[var(--color-ink)]/55">{docs.length}</span>
                on file
              </h2>
            </div>
          </div>
          <ul className="divide-y divide-[var(--color-ink)]/8">
            {docs.map((d) => {
              const t = tierForDoc(d);
              const days = daysUntil(d.expires_date);
              const human = days < 0 ? `${Math.abs(days)} days ago` : days === 0 ? "today" : `in ${days} days`;
              return (
                <li key={d.id} className="px-5 py-3 flex flex-wrap items-center gap-3">
                  <FileText className="h-3.5 w-3.5 text-[var(--color-ink)]/40 shrink-0" />
                  <div className="flex-1 min-w-48">
                    <div className="text-[13px] font-medium">{d.type}</div>
                    <div className="text-[11px] text-[var(--color-ink)]/55 font-mono uppercase tracking-[0.06em]">
                      Issued {fmtDate(d.issued_date)} &middot; Expires {fmtDate(d.expires_date)} ({human})
                      {d.coverage_limit ? <> &middot; {d.coverage_limit}</> : null}
                    </div>
                    {d.issuing_authority ? (
                      <div className="text-[11px] text-[var(--color-ink)]/50 mt-0.5">{d.issuing_authority}</div>
                    ) : null}
                  </div>
                  <StatusBadge tier={t} />
                </li>
              );
            })}
          </ul>
        </section>

        {/* Side rail: contact */}
        <aside className="rounded-[6px] border border-[var(--color-ink)]/10 bg-[var(--color-paper)] p-5 text-[13px] lg:sticky lg:top-24">
          <SectionLabel>Primary contact</SectionLabel>
          <div className="mt-2 font-medium">{c.contact_name}</div>
          <div className="mt-3 space-y-2 text-[var(--color-ink)]/75">
            <div className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5 text-[var(--color-ink)]/45" />
              <a className="hover:text-[var(--color-brass)] font-mono text-[12px]" href={`mailto:${c.email}`}>{c.email}</a>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 text-[var(--color-ink)]/45" />
              <span className="font-mono text-[12px]">{c.phone}</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="h-3.5 w-3.5 mt-0.5 text-[var(--color-ink)]/45" />
              <div className="text-[12px] leading-snug">
                {c.address.street}<br />
                {c.address.city}, {c.address.state} {c.address.zip}
              </div>
            </div>
          </div>
          <Link
            href={`/outreach?id=${c.id}`}
            className="mt-5 inline-flex items-center gap-2 rounded-[4px] bg-[var(--color-ink)] text-[var(--color-paper)] px-3.5 py-2 text-[12px] hover:bg-[var(--color-ink-soft)] w-full justify-center"
          >
            <Send className="h-3.5 w-3.5" /> Draft outreach email
          </Link>
          <div className="mt-2 flex items-center justify-center">
            <PremiumBadge label="Agentic outreach" />
          </div>
        </aside>
      </div>
    </div>
  );
}
