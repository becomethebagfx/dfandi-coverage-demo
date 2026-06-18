import { SectionLabel } from "@/components/SectionLabel";
import { PremiumBadge } from "@/components/PremiumBadge";
import {
  ShieldCheck, Mail, BellRing, Tag, FileSignature, Users, History,
} from "lucide-react";

export const metadata = { title: "Settings - DF&I Subcontractor Coverage" };

const TEAM = [
  { name: "Clark Brown",    email: "clark@dfandi.com",      role: "Owner",    last_active: "2 min ago" },
  { name: "Travis Stillwell", email: "travis@dfandi.com",   role: "Admin",    last_active: "12 min ago" },
  { name: "Olivia Henning", email: "olivia@dfandi.com",     role: "Admin",    last_active: "1 hour ago" },
  { name: "Jenifer Wright", email: "jen@dfandi.com",        role: "Editor",   last_active: "yesterday" },
];

const AUDIT = [
  { who: "olivia@dfandi.com", what: "Uploaded GL for Bluegrass KY Conveyor Services LLC", when: "Today, 10:42 am" },
  { who: "Auto-agent",         what: "Sent 90-day renewal reminder to Gulf Coast ME Electrical Solutions", when: "Today, 09:15 am" },
  { who: "clark@dfandi.com",   what: "Approved new contractor: Crescent TN Mechanical Group",  when: "Yesterday, 4:08 pm" },
  { who: "jen@dfandi.com",     what: "Edited contact for Allegheny ND Rigging Group",          when: "Yesterday, 2:14 pm" },
  { who: "Auto-agent",         what: "Ingested updated COI from Sun Belt TX Material Systems", when: "Mon, 8:50 am" },
];

const DOC_TYPES = [
  "General Liability",
  "Workers Comp",
  "Auto Liability",
  "Umbrella",
  "State Contractor License",
  "OSHA 30",
  "Drug Screening",
  "W9",
];

const CADENCE = [
  { tier: "Heads up",      days: 180, on: true,  agentic: false },
  { tier: "Renewal",       days: 90,  on: true,  agentic: true  },
  { tier: "Urgent",        days: 30,  on: true,  agentic: true  },
  { tier: "Final notice",  days: 7,   on: true,  agentic: true  },
  { tier: "Internal alert",days: 0,   on: true,  agentic: false },
];

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-[6px] border border-[var(--color-ink)]/10 bg-[var(--color-paper)] overflow-hidden ${className}`}>
      {children}
    </section>
  );
}

function CardHeader({ icon: Icon, title, label, premium }: { icon: React.ElementType; title: string; label: string; premium?: boolean }) {
  return (
    <div className="px-5 py-4 border-b border-[var(--color-ink)]/8 flex items-start justify-between gap-2">
      <div>
        <SectionLabel>{label}</SectionLabel>
        <h2 className="font-display mt-1 text-[20px] tracking-tight flex items-center gap-2">
          <Icon className="h-4 w-4 text-[var(--color-steel)]" />
          {title}
        </h2>
      </div>
      {premium ? <PremiumBadge label="Premium" /> : null}
    </div>
  );
}

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-8 pt-10 pb-16">
      <header className="border-b border-[var(--color-ink)]/10 pb-6">
        <SectionLabel>Workspace</SectionLabel>
        <h1 className="font-display mt-2 text-[30px] sm:text-[40px] leading-tight tracking-tight">
          Settings
        </h1>
        <p className="mt-3 max-w-2xl text-[14px] text-[var(--color-ink)]/65 leading-relaxed">
          Connect the systems you already use, decide what the agent does automatically, and shape the
          documents and roles to match how DF&amp;I actually runs.
        </p>
      </header>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
        {/* Microsoft 365 integration */}
        <Card>
          <CardHeader icon={ShieldCheck} label="Identity & SSO" title="Microsoft 365" />
          <div className="px-5 py-4 text-[13px] text-[var(--color-ink)]/70 leading-relaxed">
            Single sign-on with the same Outlook account everyone already uses. Permissions
            follow Microsoft 365 groups, so HR adds someone there and it shows up here.
          </div>
          <div className="px-5 pb-5 flex flex-wrap items-center gap-3">
            <button className="inline-flex items-center gap-2 rounded-[4px] bg-[var(--color-ink)] text-[var(--color-paper)] px-4 py-2 text-[12px] hover:bg-[var(--color-ink-soft)]">
              <ShieldCheck className="h-3.5 w-3.5" /> Connect Microsoft 365
            </button>
            <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-[var(--color-ink)]/45">
              Tenant: dfandi.com
            </span>
          </div>
        </Card>

        {/* Email sending */}
        <Card>
          <CardHeader icon={Mail} label="Outbound mail" title="Renewal emails" premium />
          <div className="px-5 py-4 text-[13px] text-[var(--color-ink)]/70 leading-relaxed">
            Send renewal asks from compliance@dfandi.com through Microsoft Exchange.
            Replies with attached COIs route into the ingestion queue automatically.
          </div>
          <ul className="px-5 pb-5 text-[12px] space-y-2 text-[var(--color-ink)]/75">
            <li className="flex justify-between border-b border-[var(--color-ink)]/8 pb-1.5">
              <span className="font-mono uppercase tracking-[0.06em]">From</span>
              <span>compliance@dfandi.com</span>
            </li>
            <li className="flex justify-between border-b border-[var(--color-ink)]/8 pb-1.5">
              <span className="font-mono uppercase tracking-[0.06em]">Reply-to</span>
              <span>compliance@dfandi.com</span>
            </li>
            <li className="flex justify-between border-b border-[var(--color-ink)]/8 pb-1.5">
              <span className="font-mono uppercase tracking-[0.06em]">Signature</span>
              <span>DF&amp;I Compliance team</span>
            </li>
            <li className="flex justify-between">
              <span className="font-mono uppercase tracking-[0.06em]">Throttle</span>
              <span>40 / hour</span>
            </li>
          </ul>
        </Card>

        {/* Notification cadence */}
        <Card className="lg:col-span-2">
          <CardHeader icon={BellRing} label="Cadence" title="When the agent acts" premium />
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead className="bg-[var(--color-paper-soft)]/40">
                <tr className="text-left">
                  <th className="px-5 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink)]/55">Stage</th>
                  <th className="px-5 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink)]/55">Trigger</th>
                  <th className="px-5 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink)]/55">Action</th>
                  <th className="px-5 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink)]/55 text-right">Enabled</th>
                </tr>
              </thead>
              <tbody>
                {CADENCE.map((c) => (
                  <tr key={c.tier} className="border-t border-[var(--color-ink)]/8">
                    <td className="px-5 py-3 font-medium">{c.tier}</td>
                    <td className="px-5 py-3 font-mono tabular-nums">
                      {c.days === 0 ? "Day of expiry" : `${c.days} days out`}
                    </td>
                    <td className="px-5 py-3">
                      {c.agentic ? (
                        <span className="inline-flex items-center gap-2">
                          Agent sends + reads reply
                          <PremiumBadge label="Agentic" icon={false} />
                        </span>
                      ) : (
                        <span>Internal email + dashboard ping</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span
                        className={`inline-flex h-5 w-9 rounded-full p-0.5 ${c.on ? "bg-[var(--color-brass)]" : "bg-[var(--color-ink)]/15"}`}
                      >
                        <span className={`h-4 w-4 rounded-full bg-white transition-transform ${c.on ? "translate-x-4" : ""}`} />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Document catalog */}
        <Card>
          <CardHeader icon={Tag} label="Catalog" title="Document types tracked" />
          <div className="px-5 py-4 flex flex-wrap gap-2">
            {DOC_TYPES.map((d) => (
              <span key={d} className="inline-flex items-center px-2.5 py-1 rounded-[3px] border border-[var(--color-ink)]/15 text-[12px]">
                {d}
              </span>
            ))}
            <button className="inline-flex items-center px-2.5 py-1 rounded-[3px] border border-dashed border-[var(--color-brass)] text-[12px] text-[var(--color-brass)] hover:bg-[var(--color-brass-tint)]">
              + Add type
            </button>
          </div>
        </Card>

        {/* Outreach template */}
        <Card>
          <CardHeader icon={FileSignature} label="Voice" title="Outreach email template" premium />
          <div className="px-5 py-4 text-[12px] text-[var(--color-ink)]/60 leading-relaxed">
            Variables: <span className="font-mono">{"{contact_first}"}</span>, <span className="font-mono">{"{company}"}</span>,
            <span className="font-mono"> {"{doc_list}"}</span>, <span className="font-mono">{"{deadline}"}</span>
          </div>
          <textarea
            defaultValue={[
              "Hi {contact_first},",
              "",
              "Heads up: a few of your active documents on file with DF&I are coming up on renewal:",
              "",
              "{doc_list}",
              "",
              "If you can send updated copies by {deadline}, we will keep your crew uninterrupted on the projects we have you committed to.",
              "",
              "Thanks,",
              "DF&I Compliance team",
            ].join("\n")}
            rows={9}
            className="block w-full font-mono text-[12px] leading-6 border-t border-[var(--color-ink)]/8 px-5 py-4 bg-transparent outline-none resize-y"
          />
        </Card>

        {/* Team */}
        <Card>
          <CardHeader icon={Users} label="People" title="Team & roles" />
          <ul className="divide-y divide-[var(--color-ink)]/8">
            {TEAM.map((t) => (
              <li key={t.email} className="px-5 py-3 flex items-center gap-3">
                <div className="h-7 w-7 rounded-full bg-[var(--color-paper-soft)] border border-[var(--color-ink)]/10 grid place-items-center font-display text-[12px] text-[var(--color-ink)]/70">
                  {t.name.split(" ").map((p) => p[0]).join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[13px] font-medium">{t.name}</div>
                  <div className="text-[11px] text-[var(--color-ink)]/55 font-mono">{t.email}</div>
                </div>
                <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-[var(--color-steel)]">{t.role}</span>
                <span className="hidden sm:inline text-[11px] text-[var(--color-ink)]/45">{t.last_active}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Audit log */}
        <Card>
          <CardHeader icon={History} label="Activity" title="Recent audit log" />
          <ul className="divide-y divide-[var(--color-ink)]/8 text-[13px]">
            {AUDIT.map((a, i) => (
              <li key={i} className="px-5 py-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink)]/55">{a.when}</span>
                  <span className="font-medium text-[12px]">{a.who}</span>
                </div>
                <div className="mt-1 text-[13px] text-[var(--color-ink)]/75">{a.what}</div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
