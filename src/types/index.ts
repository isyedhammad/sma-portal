export type LeaseStatus = 'Active' | 'Suspended' | 'Show-Cause Issued' | 'Expired';

export interface Lease {
  lease_id: string; // e.g. "SMA-LHR-2024-089", "SMA-ATK-2023-014"
  s_no?: number; // e.g. 1 to 1836 from official dataset
  site_code?: string; // original site name e.g. "ML-ATK-Latrite-Bolianwal Village"
  lease_title: string; // e.g. "Ordinary Sand Block No. 14, Ravi Bed"
  mineral_name: string; // e.g. "Ordinary Sand", "Limestone", "Gypsum", "Silica Sand", "Coal"
  lessee_name: string; // e.g. "M/s Indus Valley Mineral Developers"
  proprietor_representative: string; // Name of CEO / Representative
  contact_number: string;
  district: string;
  tehsil?: string;
  lease_status: LeaseStatus;
  area_acreage: number;
  area_ha?: number;
  mining_type?: string; // ML / PL
  mining_method?: string; // Surface Mining / Under Ground
  coordinates?: string;
  grant_date?: string;
  expiry_date?: string;
  annual_rent_pkr?: number;
}

export type HearingStatus = 'Upcoming' | 'Heard/Under Deliberation' | 'Adjourned' | 'Decided';

export type DecisionCategory = 
  | 'Penalty Imposed'
  | 'Direction Issued'
  | 'Lease Revoked/Cancelled'
  | 'Exonerated/Compliance Accepted'
  | 'Adjourned to New Date';

export interface OrderDetails {
  order_no: string; // e.g. "DGM&M/SMA/ORD-2026-0089"
  order_date: string; // ISO date string
  decision_category: DecisionCategory;
  decision_summary: string; // Operative ruling summary
  penalty_amount?: number; // In PKR
  compliance_deadline?: string; // e.g. "14 days from dispatch"
  order_attachment_name?: string;
  presiding_officer: string; // e.g. "Director SMA/T - Licensing Authority"
  attendees?: string;
  legal_provisions?: string; // Statutory rules applied
  dispatched: boolean;
}

export interface AdjournmentRecord {
  adjourned_from: string;
  adjourned_to: string;
  reason: string;
  recorded_at: string;
}

export interface PersonalHearing {
  hearing_id: string; // e.g. "PH-2026-0042"
  lease_id: string; // Reference to Lease.lease_id
  hearing_date: string; // ISO string e.g. "2026-11-08T10:30:00"
  notice_issue_date: string; // ISO date string
  notice_reference_no: string; // e.g. "DGM&M/SMA/H-104/2026"
  hearing_purpose: string; // Violation type / Statutory Grounds
  specific_allegations?: string; // Detailed statement of allegations
  presiding_officer: string; // Default: "Director SMA/T - Licensing Authority"
  hearing_venue?: string; // Default: "Committee Room / Judicial Chamber, DGM&M Punjab, Lahore"
  hearing_status: HearingStatus;
  order_issued: boolean;
  order_details?: OrderDetails;
  adjournment_history?: AdjournmentRecord[];
  created_at: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}
