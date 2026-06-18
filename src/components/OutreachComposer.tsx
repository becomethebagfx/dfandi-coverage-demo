"use client";

import { useMemo, useState } from "react";
import { Sparkles, Send, MailCheck, Copy } from "lucide-react";
import type { ComplianceDoc, Contractor, StatusTier } from "@/lib/types";
import { tierForDoc, TIER_STYLE } from "@/lib/status";
import { fmtDate } from "@/lib/data";

interface FlatDoc extends ComplianceDoc { tier: StatusTier }

function pickFlagged(c: Contractor): FlatDoc[] {
  return c.documents
    .map((d) => ({ ...d, tier: tierForDoc(d) }))
    .filter((d) => d.tier === "expired" || d.tier === "critical" || d.tier === "warning")
    .sort((a, b) => a.expires_date.localeCompare(b.expires_date));
}

function compose(c: Contractor, flagged: FlatDoc[]): { subject: string; body: string } {
  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const friendly = c.contact_name.split(" ")[0];
  const labels = flagged.map((d) => `${d.type} (expires ${fmtDate(d.expires_date)})`);
  const subject = flagged.length
    ? `Your compliance docs with DF&I -- quick refresh request`
    : `Quick compliance check-in from DF&I`;
  const expiredCount = flagged.filter((d) => d.tier === "expired").length;
  const intro = expiredCount
    ? `Heads up: ${expiredCount} of your active documents on file with us has already expired, and we want to keep your crew working without interruption.`
    : `Heads up: a few of your active documents on file with us are coming up on renewal, and we want to keep your crew working without interruption.`;
  const body = [
    `Hi ${friendly},`,
    ``,
    `${intro} Here is what we are tracking:`,
    ``,
    ...labels.map((l) => `  - ${l}`),
    ``,
    `If you can send updated copies in the next 7 days, that keeps your team uninterrupted on the projects we have you committed to and avoids any awkward last-minute COI scrambles on site. PDF reply to this email is fine.`,
    ``,
    `Anything you need from our side -- a fresh contract reference, certificate holder language, additional insured wording -- just let me know.`,
    ``,
    `Thanks, ${friendly}.`,
    ``,
    `${today}`,
    `Design Fabricators & Integrators`,
    `Compliance team`,
  ].join("\n");
  return { subject, body };
}

interface Props { contractors: Contractor[]; initialId?: string }

export function OutreachComposer({ contractors, initialId }: Props) {
  const [id, setId] = useState(initialId ?? contractors[0]?.id ?? "");
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const c = useMemo(() => contractors.find((x) => x.id === id) ?? contractors[0], [contractors, id]);
  const flagged = useMemo(() => (c ? pickFlagged(c) : []), [c]);
  const { subject, body } = useMemo(() => (c ? compose(c, flagged) : { subject: "", body: "" }), [c, flagged]);

  if (!c) return <div>No contractors available.</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[18rem_1fr] gap-6">
      <aside className="rounded-2xl border border-slate-200 bg-white p-4 h-fit lg:sticky lg:top-24">
        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Pick a contractor</div>
        <input
          type="search"
          placeholder="Filter list..."
          className="mt-2 w-full px-3 py-2 rounded-md border border-slate-200 text-sm"
          onChange={(e) => {
            const q = e.target.value.toLowerCase();
            for (const opt of Array.from(document.querySelectorAll<HTMLButtonElement>("[data-contractor]"))) {
              const txt = opt.dataset.contractor?.toLowerCase() ?? "";
              opt.style.display = txt.includes(q) ? "" : "none";
            }
          }}
        />
        <ul className="mt-3 max-h-[28rem] overflow-y-auto pr-1 space-y-1">
          {contractors.map((x) => {
            const t = pickFlagged(x);
            const worst = t[0]?.tier;
            return (
              <li key={x.id}>
                <button
                  data-contractor={`${x.company} ${x.address.city} ${x.address.state}`}
                  onClick={() => { setId(x.id); setSent(false); setCopied(false); }}
                  className={`w-full text-left px-2 py-2 rounded-md text-sm ${
                    x.id === id ? "bg-[var(--color-brand-600)] text-white" : "hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  <div className="font-medium truncate">{x.company}</div>
                  <div className={`text-[11px] ${x.id === id ? "text-white/80" : "text-slate-500"}`}>
                    {x.address.city}, {x.address.state}
                    {worst ? <span className="ml-1">&middot; {TIER_STYLE[worst].label}</span> : null}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </aside>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-slate-500">
            <Sparkles className="h-3.5 w-3.5 text-[var(--color-brand-600)]" /> AI-drafted outreach
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { navigator.clipboard.writeText(`${subject}\n\n${body}`); setCopied(true); setTimeout(() => setCopied(false), 1800); }}
              className="text-xs font-semibold inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-slate-200 hover:bg-slate-50"
            >
              <Copy className="h-3.5 w-3.5" />
              {copied ? "Copied" : "Copy"}
            </button>
            <button
              onClick={() => setSent(true)}
              disabled={sent}
              className="text-xs font-semibold inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-[var(--color-brand-600)] text-white hover:bg-[var(--color-brand-700)] disabled:bg-emerald-600"
            >
              {sent ? <><MailCheck className="h-3.5 w-3.5" /> Queued (demo)</> : <><Send className="h-3.5 w-3.5" /> [Demo] Send</>}
            </button>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/40">
          <div className="px-4 py-3 border-b border-slate-200 text-xs space-y-1">
            <div><span className="text-slate-500">To</span>: <span className="font-medium">{c.contact_name} &lt;{c.email}&gt;</span></div>
            <div><span className="text-slate-500">From</span>: compliance@dfandi.com</div>
            <div><span className="text-slate-500">Subject</span>: <span className="font-medium">{subject}</span></div>
          </div>
          <pre className="px-4 py-4 text-sm whitespace-pre-wrap font-sans leading-6 text-slate-800">{body}</pre>
        </div>

        <details className="mt-4 text-xs text-slate-500">
          <summary className="cursor-pointer hover:text-slate-700">How would this run in production?</summary>
          <div className="mt-2 leading-5 max-w-3xl">
            In production this page wires up to an actual sender (Resend, Postmark, or whatever DF&amp;I prefers) and runs on a schedule: 180 days before a document expires we send a heads-up, 90 days a reminder, 30 days an urgent ping, and on the day of expiry an internal alert too. Replies that include attached PDFs are routed to a small ingest agent that reads the new expiration date, files the PDF against the contractor record, and updates this dashboard. No buttons to push for the every-day cases.
          </div>
        </details>
      </section>
    </div>
  );
}
