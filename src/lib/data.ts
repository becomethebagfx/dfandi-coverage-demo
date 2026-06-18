// Data access for the demo. Reads the bundled JSON sample file at import
// time (Server Component friendly) and exposes typed accessors + rollups.
import raw from "@/data/contractors.json";
import type { Contractor, StateRollup, StatusTier } from "./types";
import { TIER_STYLE, tierForContractor, tierForDoc, worse } from "./status";

export const CONTRACTORS = raw as Contractor[];

export function getContractor(id: string): Contractor | undefined {
  return CONTRACTORS.find((c) => c.id === id);
}

export interface CritSummary {
  total: number;
  states_covered: number;
  expired_docs: number;
  critical_docs: number;
  warning_docs: number;
  expired_contractors: number;
  critical_contractors: number;
}

export function summarize(list: Contractor[] = CONTRACTORS): CritSummary {
  let expired_docs = 0;
  let critical_docs = 0;
  let warning_docs = 0;
  let expired_contractors = 0;
  let critical_contractors = 0;
  const states = new Set<string>();
  for (const c of list) {
    states.add(c.address.state);
    const ct = tierForContractor(c);
    if (ct === "expired") expired_contractors += 1;
    if (ct === "critical") critical_contractors += 1;
    for (const d of c.documents) {
      const t = tierForDoc(d);
      if (t === "expired") expired_docs += 1;
      else if (t === "critical") critical_docs += 1;
      else if (t === "warning") warning_docs += 1;
    }
  }
  return {
    total: list.length,
    states_covered: states.size,
    expired_docs,
    critical_docs,
    warning_docs,
    expired_contractors,
    critical_contractors,
  };
}

export function rollupByState(list: Contractor[] = CONTRACTORS): Record<string, StateRollup> {
  const out: Record<string, StateRollup> = {};
  for (const c of list) {
    const code = c.address.state;
    if (!out[code]) {
      out[code] = {
        code,
        name: c.address.state_name,
        contractor_count: 0,
        expired_count: 0,
        critical_count: 0,
        warning_count: 0,
        worst_status: "ok",
      };
    }
    const r = out[code];
    r.contractor_count += 1;
    const t = tierForContractor(c);
    if (t === "expired") r.expired_count += 1;
    if (t === "critical") r.critical_count += 1;
    if (t === "warning") r.warning_count += 1;
    r.worst_status = worse(r.worst_status, t);
  }
  return out;
}

export function tierColor(t: StatusTier): string {
  return TIER_STYLE[t].fill;
}

export function fmtDate(iso: string): string {
  // YYYY-MM-DD => Jun 18, 2026
  const d = new Date(iso + "T12:00:00Z");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}

export const STATE_NAME_TO_CODE: Record<string, string> = (() => {
  const m: Record<string, string> = {};
  for (const c of CONTRACTORS) m[c.address.state_name] = c.address.state;
  // Make sure even states with zero contractors still resolve.
  const fallback: Array<[string, string]> = [
    ["Alabama","AL"],["Alaska","AK"],["Arizona","AZ"],["Arkansas","AR"],["California","CA"],
    ["Colorado","CO"],["Connecticut","CT"],["Delaware","DE"],["District of Columbia","DC"],
    ["Florida","FL"],["Georgia","GA"],["Hawaii","HI"],["Idaho","ID"],["Illinois","IL"],
    ["Indiana","IN"],["Iowa","IA"],["Kansas","KS"],["Kentucky","KY"],["Louisiana","LA"],
    ["Maine","ME"],["Maryland","MD"],["Massachusetts","MA"],["Michigan","MI"],["Minnesota","MN"],
    ["Mississippi","MS"],["Missouri","MO"],["Montana","MT"],["Nebraska","NE"],["Nevada","NV"],
    ["New Hampshire","NH"],["New Jersey","NJ"],["New Mexico","NM"],["New York","NY"],
    ["North Carolina","NC"],["North Dakota","ND"],["Ohio","OH"],["Oklahoma","OK"],
    ["Oregon","OR"],["Pennsylvania","PA"],["Rhode Island","RI"],["South Carolina","SC"],
    ["South Dakota","SD"],["Tennessee","TN"],["Texas","TX"],["Utah","UT"],["Vermont","VT"],
    ["Virginia","VA"],["Washington","WA"],["West Virginia","WV"],["Wisconsin","WI"],["Wyoming","WY"],
  ];
  for (const [n, c] of fallback) if (!m[n]) m[n] = c;
  return m;
})();
