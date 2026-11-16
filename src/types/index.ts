export type LeaseStatus = 'Active' | 'Suspended' | 'Show-Cause Issued' | 'Expired';
export type MiningType = 'ML' | 'PL'; // Mining Lease vs Prospecting License

export interface Lease {
  lease_id: string; // Primary key, e.g. "SMA-ATT-0001"
  lease_no: string; // e.g. "SMA-ATT-0001"
  lease_title: string; // e.g. "Latrite Concession (ML-ATK-Latrite-Bolianwal Village)"
  lessee_name: string; // e.g. "M/s Latrite-Bolianwal Village Quarry Developers Ltd."
  district: string; // e.g. "Attock"
  mineral: string; // e.g. "Latrite", "Limestone", "Pink Salt", "Coal"
  status: LeaseStatus;
  
  // Secondary metadata
  s_no?: number;
  site_code?: string;
  mining_type?: MiningType;
  area_acreage?: number;
  proprietor_representative?: string;
  contact_number?: string;
  grant_date?: string;
  expiry_date?: string;
  annual_rent_pkr?: number;
  created_at?: string;
}

export type HearingStatus = 'Scheduled' | 'Adjourned' | 'Order Reserved' | 'Disposed';

export interface Hearing {
  hearing_id: string; // Primary key, e.g. "PH-2026-001"
  lease_id: string; // Foreign key linking all hearings of the same lease
  lease_no: string; // Redundant reference e.g. "SMA-ATT-0001"
  lease_title: string;
  lessee_name: string;
  district: string;
  mineral: string;
  
  // Hearing schedule
  hearing_date: string; // YYYY-MM-DD
  hearing_time: string; // e.g. "10:30 AM" or "11:00"
  purpose: string; // Statutory ground / purpose, e.g. "Non-payment of royalty dues"
  stage?: string; // e.g. "Initial Notice", "Reply Submission", "Evidence", "Final Arguments", "Order Announcement"
  
  // Quasi-judicial proceedings & outcomes
  remarks_orders?: string; // Recorded proceedings / bench remarks / operative findings
  order_date?: string; // YYYY-MM-DD
  order_no?: string; // e.g. "DGM&M/SMA/ORD-2026-042"
  decision_category?: 'Penalty Imposed' | 'Direction Issued' | 'Lease Cancelled' | 'Exonerated/Notice Discharged' | 'Adjourned';
  penalty_amount?: number; // In PKR
  next_hearing_date?: string; // YYYY-MM-DD (if adjourned)
  next_hearing_time?: string; // (if adjourned)
  adjournment_reason?: string; // (if adjourned)
  
  hearing_status: HearingStatus;
  
  // Administrative
  presiding_officer?: string; // Default: "Licensing Authority"
  hearing_venue?: string; // Default: "Court Room of Licensing Authority, Poonch House, Multan Road, Lahore"
  notice_reference_no?: string; // e.g. "DGM&M/SMA/H-104/2026"
  created_at: string;
  updated_at?: string;
}

export type CloudSyncStatus = 'synced' | 'connecting' | 'cloud_ready' | 'offline' | 'error';

export interface CloudConfig {
  provider: 'supabase' | 'firebase';
  supabaseUrl: string;
  supabaseAnonKey: string;
  firebaseProjectId: string;
  firebaseApiKey: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}
