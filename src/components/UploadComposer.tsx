"use client";

import { useMemo, useRef, useState } from "react";
import { UploadCloud, Sparkles, FileText, X, Check, Search, PlusCircle, Edit3 } from "lucide-react";
import type { Contractor, DocumentType, StatusTier } from "@/lib/types";
import { PremiumBadge } from "./PremiumBadge";
import { SectionLabel } from "./SectionLabel";

interface Props {
  contractors: Contractor[];
}

type Mode = "manual" | "smart";

const DOC_TYPES: DocumentType[] = [
  "General Liability",
  "Workers Comp",
  "Auto Liability",
  "Umbrella",
  "State Contractor License",
  "OSHA 30",
  "Drug Screening",
  "W9",
];

// Stub AI extractor: parses the filename for state codes and doc-type hints, then
// best-matches an existing contractor. Real version would call a vision model.
function aiExtract(filename: string, contractors: Contractor[]) {
  const fn = filename.toLowerCase();
  const states = Array.from(new Set(contractors.map((c) => c.address.state.toLowerCase())));
  const hitState = states.find((s) => fn.includes(`-${s}-`) || fn.includes(`_${s}_`) || fn.endsWith(`-${s}.pdf`) || fn.includes(` ${s} `));
  let docType: DocumentType = "General Liability";
  if (/(workers|wc|workmen)/.test(fn)) docType = "Workers Comp";
  else if (/(auto|cmv|fleet)/.test(fn)) docType = "Auto Liability";
  else if (/(umbrella|excess)/.test(fn)) docType = "Umbrella";
  else if (/(license|lic-|lic_)/.test(fn)) docType = "State Contractor License";
  else if (/(osha)/.test(fn)) docType = "OSHA 30";
  else if (/(drug|substance)/.test(fn)) docType = "Drug Screening";
  else if (/(w9|w-9)/.test(fn)) docType = "W9";

  const pool = hitState
    ? contractors.filter((c) => c.address.state.toLowerCase() === hitState)
    : contractors;
  // pick a sensible candidate. Prefer same state, name token match in filename, else random.
  const tokenMatched = pool.find((c) => {
    const head = c.company.split(/\s+/).slice(0, 2).join(" ").toLowerCase();
    return fn.includes(head.split(" ")[0]);
  });
  const candidate = tokenMatched ?? pool[Math.floor(Math.random() * pool.length)];

  const today = new Date();
  const issued = new Date(today.getTime() - 7 * 24 * 3600 * 1000);
  const expires = new Date(today.getTime() + 360 * 24 * 3600 * 1000);
  const confidence = hitState ? 94 : tokenMatched ? 88 : 71;
  const coverage =
    docType === "General Liability" ? "$2,000,000 / $4,000,000"
    : docType === "Workers Comp" ? "Statutory"
    : docType === "Auto Liability" ? "$1,000,000 CSL"
    : docType === "Umbrella" ? "$5,000,000"
    : "";

  return {
    candidate,
    docType,
    issued: issued.toISOString().slice(0, 10),
    expires: expires.toISOString().slice(0, 10),
    coverage,
    confidence,
    note: hitState
      ? `Filename suggests ${hitState.toUpperCase()}; matched to ${candidate?.company}.`
      : tokenMatched
      ? `Name token in filename matched ${candidate?.company}.`
      : `No strong signal in filename. Best guess: ${candidate?.company}. Confirm before saving.`,
  };
}

function tierForDays(days: number): StatusTier {
  if (days < 0) return "expired";
  if (days < 30) return "critical";
  if (days < 90) return "warning";
  if (days < 180) return "upcoming";
  return "ok";
}

export function UploadComposer({ contractors }: Props) {
  const [mode, setMode] = useState<Mode>("smart");
  const [file, setFile] = useState<File | null>(null);
  const [stage, setStage] = useState<"idle" | "reading" | "ready">("idle");
  const [extract, setExtract] = useState<ReturnType<typeof aiExtract> | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [q, setQ] = useState("");
  const [selectedId, setSelectedId] = useState<string>("");
  const [creating, setCreating] = useState(false);
  const [newC, setNewC] = useState({ company: "", contact_name: "", state: "", email: "", phone: "" });

  const [docType, setDocType] = useState<DocumentType>("General Liability");
  const [issued, setIssued] = useState<string>("");
  const [expires, setExpires] = useState<string>("");
  const [coverage, setCoverage] = useState<string>("");
  const [savedTo, setSavedTo] = useState<string | null>(null);

  const dropRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const filteredContractors = useMemo(() => {
    const ql = q.toLowerCase().trim();
    if (!ql) return contractors.slice(0, 50);
    return contractors
      .filter((c) =>
        `${c.company} ${c.contact_name} ${c.address.city} ${c.address.state}`
          .toLowerCase()
          .includes(ql),
      )
      .slice(0, 50);
  }, [q, contractors]);

  function handleFile(f: File) {
    setFile(f);
    setSavedTo(null);
    if (mode === "smart") {
      setStage("reading");
      window.setTimeout(() => {
        const e = aiExtract(f.name, contractors);
        setExtract(e);
        setSelectedId(e.candidate?.id ?? "");
        setDocType(e.docType);
        setIssued(e.issued);
        setExpires(e.expires);
        setCoverage(e.coverage);
        setStage("ready");
      }, 1100);
    } else {
      setStage("ready");
      setExtract(null);
      setSelectedId("");
      setDocType("General Liability");
      setIssued("");
      setExpires("");
      setCoverage("");
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  }

  function reset() {
    setFile(null); setStage("idle"); setExtract(null);
    setSelectedId(""); setDocType("General Liability");
    setIssued(""); setExpires(""); setCoverage(""); setSavedTo(null);
    setCreating(false); setNewC({ company: "", contact_name: "", state: "", email: "", phone: "" });
  }

  const target = selectedId
    ? contractors.find((c) => c.id === selectedId)?.company
    : creating
      ? newC.company || "(new contractor)"
      : null;

  const expiresDays = expires ? Math.round((new Date(expires + "T12:00:00Z").getTime() - Date.now()) / (24 * 3600 * 1000)) : null;
  const previewTier = expiresDays !== null ? tierForDays(expiresDays) : null;

  return (
    <div className="space-y-8">
      {/* Mode toggle */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        <SectionLabel>Upload mode</SectionLabel>
        <div className="inline-flex rounded-[4px] border border-[var(--color-ink)]/15 overflow-hidden text-[12px]">
          <button
            type="button"
            onClick={() => { setMode("manual"); reset(); }}
            className={`px-3 py-1.5 transition-colors ${mode === "manual" ? "bg-[var(--color-ink)] text-[var(--color-paper)]" : "text-[var(--color-ink)]/70 hover:text-[var(--color-ink)]"}`}
          >
            <Edit3 className="inline h-3.5 w-3.5 mr-1.5" /> Manual
          </button>
          <button
            type="button"
            onClick={() => { setMode("smart"); reset(); }}
            className={`px-3 py-1.5 inline-flex items-center gap-2 transition-colors ${mode === "smart" ? "bg-[var(--color-ink)] text-[var(--color-paper)]" : "text-[var(--color-ink)]/70 hover:text-[var(--color-ink)]"}`}
          >
            <Sparkles className="h-3.5 w-3.5" /> Smart Intake
          </button>
        </div>
        {mode === "smart" && <PremiumBadge label="Premium" title="Smart Intake uses AI to read the document, classify it, and find the right contractor." />}
        <p className="basis-full sm:basis-auto text-[12px] text-[var(--color-ink)]/55 leading-relaxed">
          {mode === "smart"
            ? "Drop any COI, license or W9. The model reads it, sets the dates, and finds the contractor."
            : "Drop the file, then pick the contractor and fill the details yourself."}
        </p>
      </div>

      {/* Dropzone */}
      <div
        ref={dropRef}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        onClick={() => fileRef.current?.click()}
        className="cursor-pointer rounded-[6px] border border-dashed border-[var(--color-ink)]/25 bg-[var(--color-paper)] hover:border-[var(--color-brass)] hover:bg-[var(--color-brass-tint)]/40 transition-colors p-8 sm:p-12 text-center"
      >
        <input
          ref={fileRef}
          type="file"
          className="sr-only"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />
        <div className="mx-auto h-12 w-12 grid place-items-center rounded-full border border-[var(--color-ink)]/15 bg-[var(--color-paper)]">
          <UploadCloud className="h-5 w-5 text-[var(--color-steel)]" />
        </div>
        <div className="mt-4 font-display text-[20px] tracking-tight">Drop a document, any document</div>
        <div className="mt-1.5 text-[12px] text-[var(--color-ink)]/60">
          PDF, JPG, PNG. {mode === "smart" ? "AI reads it" : "Manual entry"}. No file is uploaded in this demo.
        </div>
      </div>

      {/* Reading state */}
      {stage === "reading" && (
        <div className="rounded-[6px] border border-[var(--color-brass)]/40 bg-[var(--color-brass-tint)] px-5 py-4 flex items-center gap-3">
          <Sparkles className="h-4 w-4 text-[var(--color-brass)] animate-pulse" />
          <div className="text-[13px] text-[var(--color-brass)]">
            Reading {file?.name}...
          </div>
        </div>
      )}

      {/* Ready: form */}
      {stage === "ready" && (
        <div className="rounded-[6px] border border-[var(--color-ink)]/10 bg-[var(--color-paper)] overflow-hidden">
          <div className="px-5 py-4 border-b border-[var(--color-ink)]/8 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <FileText className="h-4 w-4 text-[var(--color-steel)] shrink-0" />
              <div className="min-w-0">
                <div className="text-[13px] font-medium truncate">{file?.name}</div>
                <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-[var(--color-ink)]/55">
                  {file ? `${Math.round((file.size || 0) / 1024)} kb` : ""}
                </div>
              </div>
            </div>
            <button onClick={reset} className="text-[12px] text-[var(--color-ink)]/60 hover:text-[var(--color-ink)] inline-flex items-center gap-1">
              <X className="h-3.5 w-3.5" /> Discard
            </button>
          </div>

          {extract && mode === "smart" && (
            <div className="px-5 py-3 border-b border-[var(--color-ink)]/8 bg-[var(--color-brass-tint)]/60 text-[12px] text-[var(--color-ink)]/75 flex items-start gap-2">
              <Sparkles className="h-3.5 w-3.5 mt-0.5 text-[var(--color-brass)] shrink-0" />
              <div className="flex-1">{extract.note}</div>
              <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--color-brass)] shrink-0">
                {extract.confidence}% confident
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Contractor picker */}
            <div className="p-5 border-b md:border-b-0 md:border-r border-[var(--color-ink)]/8">
              <SectionLabel>Map to contractor</SectionLabel>
              <div className="mt-3 rounded-[4px] border border-[var(--color-ink)]/10 px-3 py-2 text-[13px] flex items-center justify-between">
                <span className="truncate">{target ?? "Pick a contractor"}</span>
                <button onClick={() => setPickerOpen((o) => !o)} className="text-[12px] text-[var(--color-brass)] hover:underline shrink-0 ml-2">
                  {pickerOpen ? "Done" : target ? "Change" : "Pick"}
                </button>
              </div>

              {pickerOpen && (
                <div className="mt-3 rounded-[4px] border border-[var(--color-ink)]/10 overflow-hidden">
                  <div className="flex items-center gap-2 px-3 py-2 border-b border-[var(--color-ink)]/8">
                    <Search className="h-3.5 w-3.5 text-[var(--color-ink)]/45" />
                    <input
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      placeholder="Search by company, contact, city..."
                      className="w-full text-[13px] outline-none bg-transparent"
                    />
                  </div>
                  <ul className="max-h-56 overflow-y-auto divide-y divide-[var(--color-ink)]/6 text-[13px]">
                    {filteredContractors.map((c) => (
                      <li key={c.id}>
                        <button
                          onClick={() => { setSelectedId(c.id); setCreating(false); setPickerOpen(false); }}
                          className="w-full text-left px-3 py-2 hover:bg-[var(--color-brass-tint)]/50 flex items-center justify-between gap-2"
                        >
                          <div className="min-w-0">
                            <div className="truncate font-medium">{c.company}</div>
                            <div className="text-[11px] text-[var(--color-ink)]/55 truncate font-mono uppercase tracking-[0.06em]">
                              {c.address.city}, {c.address.state}
                            </div>
                          </div>
                          {c.id === selectedId && <Check className="h-3.5 w-3.5 text-[var(--color-brass)] shrink-0" />}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={() => { setCreating(true); setSelectedId(""); setPickerOpen(false); }}
                className="mt-3 inline-flex items-center gap-1.5 text-[12px] text-[var(--color-brass)] hover:underline"
              >
                <PlusCircle className="h-3.5 w-3.5" /> Create a new contractor
              </button>

              {creating && (
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(["company", "contact_name", "state", "email", "phone"] as const).map((k) => (
                    <label key={k} className="block">
                      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink)]/55">{k.replace("_", " ")}</div>
                      <input
                        value={newC[k]}
                        onChange={(e) => setNewC((s) => ({ ...s, [k]: e.target.value }))}
                        className="mt-1 w-full rounded-[3px] border border-[var(--color-ink)]/15 px-2 py-1.5 text-[13px] bg-[var(--color-paper)]"
                      />
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Document fields */}
            <div className="p-5">
              <SectionLabel>Document details</SectionLabel>
              <label className="block mt-3">
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink)]/55">Type</div>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as DocumentType)}
                  className="mt-1 w-full rounded-[3px] border border-[var(--color-ink)]/15 px-2 py-1.5 text-[13px] bg-[var(--color-paper)]"
                >
                  {DOC_TYPES.map((d) => <option key={d}>{d}</option>)}
                </select>
              </label>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <label className="block">
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink)]/55">Issued</div>
                  <input
                    type="date"
                    value={issued}
                    onChange={(e) => setIssued(e.target.value)}
                    className="mt-1 w-full rounded-[3px] border border-[var(--color-ink)]/15 px-2 py-1.5 text-[13px] bg-[var(--color-paper)]"
                  />
                </label>
                <label className="block">
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink)]/55">Expires</div>
                  <input
                    type="date"
                    value={expires}
                    onChange={(e) => setExpires(e.target.value)}
                    className="mt-1 w-full rounded-[3px] border border-[var(--color-ink)]/15 px-2 py-1.5 text-[13px] bg-[var(--color-paper)]"
                  />
                </label>
              </div>
              <label className="block mt-3">
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink)]/55">Coverage</div>
                <input
                  value={coverage}
                  onChange={(e) => setCoverage(e.target.value)}
                  placeholder="e.g. $1M / $2M"
                  className="mt-1 w-full rounded-[3px] border border-[var(--color-ink)]/15 px-2 py-1.5 text-[13px] bg-[var(--color-paper)]"
                />
              </label>

              {previewTier && (
                <div className="mt-3 text-[12px] inline-flex items-center gap-2 text-[var(--color-ink)]/65">
                  Will be filed as
                  <span
                    className="px-1.5 py-0.5 rounded-[3px] font-mono text-[10px] uppercase tracking-[0.18em]"
                    style={{
                      background: "rgba(13,18,32,0.05)",
                      color: previewTier === "expired" || previewTier === "critical" ? "var(--color-status-expired)" : previewTier === "warning" ? "var(--color-status-warning)" : "var(--color-status-ok)",
                    }}
                  >
                    {previewTier}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="px-5 py-4 border-t border-[var(--color-ink)]/8 flex items-center justify-between flex-wrap gap-2">
            <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-[var(--color-ink)]/55">
              {target ? `Filing under ${target}` : "Pick a contractor to enable save"}
            </div>
            <button
              disabled={!target || !expires || !docType}
              onClick={() => setSavedTo(target ?? null)}
              className="inline-flex items-center gap-2 rounded-[4px] bg-[var(--color-ink)] text-[var(--color-paper)] px-4 py-2 text-[12px] disabled:opacity-40 hover:bg-[var(--color-ink-soft)]"
            >
              <Check className="h-3.5 w-3.5" /> Save document
            </button>
          </div>
          {savedTo && (
            <div className="px-5 py-3 border-t border-[var(--color-ink)]/8 bg-[var(--color-status-ok)]/8 text-[12px] text-[var(--color-status-ok)] flex items-center gap-2">
              <Check className="h-3.5 w-3.5" />
              Saved to {savedTo} (demo, nothing was actually uploaded).
            </div>
          )}
        </div>
      )}
    </div>
  );
}
