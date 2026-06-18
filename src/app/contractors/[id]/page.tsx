import Link from "next/link";
import { notFound } from "next/navigation";
import { CONTRACTORS, fmtDate, getContractor } from "@/lib/data";
import { tierForDoc, tierForContractor, daysUntil } from "@/lib/status";
import { StatusBadge } from "@/components/StatusBadge";
import { ArrowLeft, Mail, Phone, MapPin, Send, ShieldCheck, FileText } from "lucide-react";

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
    <div className="space-y-6">
      <Link href="/contractors" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700">
        <ArrowLeft className="h-4 w-4" /> Back to contractors
      </Link>

      <header className="rounded-2xl border border-slate-200 bg-white p-6 flex items-start gap-6 flex-wrap">
        <div className="flex-1 min-w-64">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <MapPin className="h-3.5 w-3.5" />
            {c.address.city}, {c.address.state_name}
          </div>
          <h1 className="mt-1 text-2xl font-semibold">{c.company}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <StatusBadge tier={tier} />
            {c.capabilities.map((k) => (
              <span key={k} className="text-[11px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">{k}</span>
            ))}
          </div>
          {c.notes ? <p className="mt-4 text-sm text-slate-600 max-w-3xl">{c.notes}</p> : null}
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 min-w-64 text-sm">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Primary contact</div>
          <div className="mt-1 font-medium">{c.contact_name}</div>
          <div className="mt-2 flex items-center gap-2 text-slate-600">
            <Mail className="h-3.5 w-3.5" />
            <a className="hover:underline" href={`mailto:${c.email}`}>{c.email}</a>
          </div>
          <div className="mt-1 flex items-center gap-2 text-slate-600">
            <Phone className="h-3.5 w-3.5" />
            {c.phone}
          </div>
          <div className="mt-1 flex items-start gap-2 text-slate-600">
            <MapPin className="h-3.5 w-3.5 mt-0.5" />
            <div>
              {c.address.street}<br />
              {c.address.city}, {c.address.state} {c.address.zip}
            </div>
          </div>
          <Link
            href={`/outreach?id=${c.id}`}
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-[var(--color-brand-600)] text-white text-xs font-semibold px-3 py-2 hover:bg-[var(--color-brand-700)]"
          >
            <Send className="h-3.5 w-3.5" /> Draft outreach email
          </Link>
        </div>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[var(--color-brand-700)]" />
            <h2 className="text-lg font-semibold">Compliance documents</h2>
          </div>
          <div className="text-xs text-slate-500">{docs.length} on file</div>
        </div>
        <ul className="divide-y divide-slate-100">
          {docs.map((d) => {
            const t = tierForDoc(d);
            const days = daysUntil(d.expires_date);
            const human = days < 0 ? `${Math.abs(days)} days ago` : days === 0 ? "today" : `in ${days} days`;
            return (
              <li key={d.id} className="py-3 flex flex-wrap items-center gap-3">
                <FileText className="h-4 w-4 text-slate-400" />
                <div className="flex-1 min-w-48">
                  <div className="font-medium text-sm">{d.type}</div>
                  <div className="text-xs text-slate-500">
                    Issued {fmtDate(d.issued_date)} &middot; Expires {fmtDate(d.expires_date)} ({human})
                    {d.coverage_limit ? <> &middot; <span className="font-mono">{d.coverage_limit}</span></> : null}
                    {d.issuing_authority ? <> &middot; {d.issuing_authority}</> : null}
                  </div>
                </div>
                <StatusBadge tier={t} />
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
