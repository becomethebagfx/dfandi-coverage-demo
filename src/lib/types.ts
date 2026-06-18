// Shared types for the DF&I subcontractor coverage demo.

export type DocumentType =
  | "General Liability"
  | "Workers Comp"
  | "Auto Liability"
  | "Umbrella"
  | "State Contractor License"
  | "OSHA 30"
  | "Drug Screening"
  | "W9";

export type Capability =
  | "Mechanical Install"
  | "Electrical Install"
  | "Controls / PLC"
  | "Conveyor Install"
  | "Rigging"
  | "Crane Operator"
  | "Welding"
  | "Sheet Metal"
  | "Site Survey";

/** Five risk tiers used everywhere status appears (badges, map colors, alerts). */
export type StatusTier = "expired" | "critical" | "warning" | "upcoming" | "ok";

export interface Address {
  street: string;
  city: string;
  /** USPS two-letter code (uppercase). */
  state: string;
  /** Full state name. */
  state_name: string;
  zip: string;
  lat: number;
  lng: number;
}

export interface ComplianceDoc {
  id: string;
  type: DocumentType;
  issued_date: string;   // ISO yyyy-mm-dd
  expires_date: string;  // ISO yyyy-mm-dd
  coverage_limit?: string | null;
  issuing_authority?: string | null;
  pdf_url?: string;
}

export interface Contractor {
  id: string;
  company: string;
  contact_name: string;
  email: string;
  phone: string;
  address: Address;
  capabilities: Capability[];
  documents: ComplianceDoc[];
  notes?: string;
}

/** Roll-up per state used by the map + dashboard. */
export interface StateRollup {
  code: string;
  name: string;
  contractor_count: number;
  expired_count: number;
  critical_count: number;
  warning_count: number;
  worst_status: StatusTier;
}
