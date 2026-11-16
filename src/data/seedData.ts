import { Lease, Hearing } from '../types';
import allLeasesRaw from './allLeases.json';

// Normalize all 1,836 authentic Punjab Small Scale Mining concessions
export const INITIAL_LEASES: Lease[] = (allLeasesRaw as any[]).map(raw => ({
  lease_id: raw.lease_id,
  lease_no: raw.lease_id,
  lease_title: raw.lease_title || raw.site_code || `Mining Concession ${raw.lease_id}`,
  lessee_name: raw.lessee_name || 'Authorized Lessee',
  district: raw.district || 'Punjab',
  mineral: raw.mineral_name || raw.mineral || 'Ordinary Mineral',
  status: (raw.lease_status || raw.status || 'Active') as any,
  s_no: raw.s_no,
  site_code: raw.site_code,
  mining_type: (raw.mining_type || 'ML') as any,
  area_acreage: raw.area_acreage ? Number(raw.area_acreage) : undefined,
  proprietor_representative: raw.proprietor_representative || 'Authorized Representative',
  contact_number: raw.contact_number || '+92 300 0000000',
  grant_date: raw.grant_date || '2023-01-01',
  expiry_date: raw.expiry_date || '2028-01-01',
  annual_rent_pkr: raw.annual_rent_pkr ? Number(raw.annual_rent_pkr) : 2500000
}));

// Representative Hearings Demonstrating the Multi-Hearing Chronological Record Workflow
export const INITIAL_HEARINGS: Hearing[] = [
  // --- LEASE 1: SMA-ATT-0001 (Latrite - Attock) - 3 Hearings Chronological Timeline ---
  {
    hearing_id: "PH-2026-0101",
    lease_id: "SMA-ATT-0001",
    lease_no: "SMA-ATT-0001",
    lease_title: "Latrite Concession (ML-ATK-Latrite-Bolianwal Village)",
    lessee_name: "M/s Latrite-Bolianwal Village Quarry Developers Ltd.",
    district: "Attock",
    mineral: "Latrite",
    hearing_date: "2026-11-16", // TODAY!
    hearing_time: "10:30 AM",
    purpose: "Non-payment of royalty dues & outstanding surface rent",
    stage: "Final Arguments / Compliance Verification",
    remarks_orders: "Case taken up for final compliance. Lessee representative present. Verified challans of PKR 1,200,000 produced before the Bench. DMO Attock verification awaited.",
    hearing_status: "Scheduled",
    presiding_officer: "Licensing Authority",
    hearing_venue: "Court Room of Licensing Authority, Poonch House, Multan Road, Lahore",
    notice_reference_no: "DGM&M/SMA/H-104/2026",
    created_at: "2026-11-05T09:00:00Z"
  },
  {
    hearing_id: "PH-2026-0089",
    lease_id: "SMA-ATT-0001",
    lease_no: "SMA-ATT-0001",
    lease_title: "Latrite Concession (ML-ATK-Latrite-Bolianwal Village)",
    lessee_name: "M/s Latrite-Bolianwal Village Quarry Developers Ltd.",
    district: "Attock",
    mineral: "Latrite",
    hearing_date: "2026-11-02",
    hearing_time: "11:00 AM",
    purpose: "Non-payment of royalty dues",
    stage: "Reply & Challan Verification",
    remarks_orders: "Lessee appeared with counsel. Produced partial payment challan of PKR 850,000 via NBP Attock branch. Balance of PKR 1,200,000 remains outstanding. Direction issued to clear remaining liability before final hearing.",
    order_date: "2026-11-02",
    order_no: "DGM&M/SMA/ORD-2026-089",
    decision_category: "Direction Issued",
    next_hearing_date: "2026-11-16",
    next_hearing_time: "10:30 AM",
    adjournment_reason: "Granted 14 days to deposit remaining treasury dues and submit DMO verification report.",
    hearing_status: "Adjourned",
    presiding_officer: "Licensing Authority",
    hearing_venue: "Court Room of Licensing Authority, Poonch House, Multan Road, Lahore",
    notice_reference_no: "DGM&M/SMA/H-089/2026",
    created_at: "2026-10-20T10:00:00Z"
  },
  {
    hearing_id: "PH-2026-0072",
    lease_id: "SMA-ATT-0001",
    lease_no: "SMA-ATT-0001",
    lease_title: "Latrite Concession (ML-ATK-Latrite-Bolianwal Village)",
    lessee_name: "M/s Latrite-Bolianwal Village Quarry Developers Ltd.",
    district: "Attock",
    mineral: "Latrite",
    hearing_date: "2026-10-15",
    hearing_time: "10:30 AM",
    purpose: "Non-payment of royalty dues for Q1 & Q2 2026",
    stage: "Initial Appearance / Show-Cause Reply",
    remarks_orders: "Show-cause notice served under Rule 48 PMR 2002 for total royalty default of PKR 2,050,000. Lessee requested adjournment to reconcile accounts with District Mining Officer Attock.",
    order_date: "2026-10-15",
    order_no: "DGM&M/SMA/ORD-2026-072",
    decision_category: "Adjourned",
    next_hearing_date: "2026-11-02",
    next_hearing_time: "11:00 AM",
    adjournment_reason: "Adjourned on request of lessee to reconcile treasury challans with DMO Attock.",
    hearing_status: "Adjourned",
    presiding_officer: "Licensing Authority",
    hearing_venue: "Court Room of Licensing Authority, Poonch House, Multan Road, Lahore",
    notice_reference_no: "DGM&M/SMA/H-072/2026",
    created_at: "2026-10-01T08:30:00Z"
  },

  // --- LEASE 2: SMA-ATT-0002 (Latrite - Attock) - Hearing Today ---
  {
    hearing_id: "PH-2026-0102",
    lease_id: "SMA-ATT-0002",
    lease_no: "SMA-ATT-0002",
    lease_title: "Latrite Concession (M/s Indus Corporation)",
    lessee_name: "M/s Indus Corporation",
    district: "Attock",
    mineral: "Latrite",
    hearing_date: "2026-11-16", // TODAY!
    hearing_time: "11:30 AM",
    purpose: "Unauthorized boundary encroachment outside sanctioned grid",
    stage: "Evidence & Survey Overlay Verification",
    remarks_orders: "GIS satellite drone survey overlay submitted by GIS Cell indicating 35-meter open excavation beyond pillar C-4. Lessee representative summoned to explain encroachment.",
    hearing_status: "Scheduled",
    presiding_officer: "Licensing Authority",
    hearing_venue: "Court Room of Licensing Authority, Poonch House, Multan Road, Lahore",
    notice_reference_no: "DGM&M/SMA/H-105/2026",
    created_at: "2026-11-06T10:00:00Z"
  },
  {
    hearing_id: "PH-2026-0081",
    lease_id: "SMA-ATT-0002",
    lease_no: "SMA-ATT-0002",
    lease_title: "Latrite Concession (M/s Indus Corporation)",
    lessee_name: "M/s Indus Corporation",
    district: "Attock",
    mineral: "Latrite",
    hearing_date: "2026-10-24",
    hearing_time: "11:30 AM",
    purpose: "Boundary encroachment",
    stage: "Initial Notice",
    remarks_orders: "Lessee denied encroachment and claimed boundary stones had been displaced by adjacent village road construction. Directed Assistant Director (Survey) to conduct joint boundary demarcation.",
    next_hearing_date: "2026-11-16",
    next_hearing_time: "11:30 AM",
    adjournment_reason: "Joint boundary demarcation ordered with survey team.",
    hearing_status: "Adjourned",
    presiding_officer: "Licensing Authority",
    hearing_venue: "Court Room of Licensing Authority, Poonch House, Multan Road, Lahore",
    notice_reference_no: "DGM&M/SMA/H-081/2026",
    created_at: "2026-10-10T09:00:00Z"
  },

  // --- LEASE 3: SMA-ATT-0004 (Limestone - Attock) - Tomorrow ---
  {
    hearing_id: "PH-2026-0103",
    lease_id: "SMA-ATT-0004",
    lease_no: "SMA-ATT-0004",
    lease_title: "Limestone Concession (M/s Limestone-Jhang Mineral Developers)",
    lessee_name: "M/s Limestone-Jhang Mineral Developers",
    district: "Attock",
    mineral: "Limestone",
    hearing_date: "2026-11-17", // TOMORROW
    hearing_time: "10:00 AM",
    purpose: "Failure to submit monthly mineral extraction returns (Form-C)",
    stage: "Reply Submission",
    remarks_orders: "Notice issued for consecutive non-submission of monthly production logs for July, August, and September 2026 under Rule 39 PMR 2002.",
    hearing_status: "Scheduled",
    presiding_officer: "Licensing Authority",
    hearing_venue: "Court Room of Licensing Authority, Poonch House, Multan Road, Lahore",
    notice_reference_no: "DGM&M/SMA/H-106/2026",
    created_at: "2026-11-07T11:00:00Z"
  },

  // --- LEASE 4: SMA-ATT-0005 (Silica-Sand - Attock) - Upcoming in 3 days ---
  {
    hearing_id: "PH-2026-0104",
    lease_id: "SMA-ATT-0005",
    lease_no: "SMA-ATT-0005",
    lease_title: "Silica Sand Concession (M/s Slica Sand-Pind Trer)",
    lessee_name: "M/s Slica Sand-Pind Trer Minerals & Mining Co.",
    district: "Attock",
    mineral: "Silica-Sand",
    hearing_date: "2026-11-19",
    hearing_time: "11:00 AM",
    purpose: "Illegal subletting to unauthorized third-party contractor",
    stage: "Evidence Examination",
    remarks_orders: "Inspection report of field squad indicates unauthorized extraction by sub-lessee without sanction of Competent Authority.",
    hearing_status: "Scheduled",
    presiding_officer: "Licensing Authority",
    hearing_venue: "Court Room of Licensing Authority, Poonch House, Multan Road, Lahore",
    notice_reference_no: "DGM&M/SMA/H-107/2026",
    created_at: "2026-11-08T09:30:00Z"
  },

  // --- LEASE 5: Order Reserved ---
  {
    hearing_id: "PH-2026-0095",
    lease_id: "SMA-ATT-0003",
    lease_no: "SMA-ATT-0003",
    lease_title: "Latrite Concession (M/s New Attock Corportion)",
    lessee_name: "M/s New Attock Corportion",
    district: "Attock",
    mineral: "Latrite",
    hearing_date: "2026-11-12",
    hearing_time: "12:00 PM",
    purpose: "Non-compliance with Mine Safety & Environmental Regulations",
    stage: "Final Hearing Concluded",
    remarks_orders: "Bench heard both sides at length. Inspector of Mines submitted photographic proof of steep quarry face exceeding permissible angles. Counsel for lessee completed arguments. Order reserved for written determination.",
    hearing_status: "Order Reserved",
    presiding_officer: "Licensing Authority",
    hearing_venue: "Court Room of Licensing Authority, Poonch House, Multan Road, Lahore",
    notice_reference_no: "DGM&M/SMA/H-095/2026",
    created_at: "2026-10-25T14:00:00Z"
  },

  // --- LEASE 6: Disposed Case with Final Order ---
  {
    hearing_id: "PH-2026-0085",
    lease_id: "SMA-ATT-0008",
    lease_no: "SMA-ATT-0008",
    lease_title: "Limestone Concession (M/s Limestone-Jhang)",
    lessee_name: "M/s Limestone-Jhang Quarry Ltd.",
    district: "Attock",
    mineral: "Limestone",
    hearing_date: "2026-11-04",
    hearing_time: "11:30 AM",
    purpose: "Non-payment of royalty dues",
    stage: "Final Order Pronounced",
    remarks_orders: "Having examined the record and verified NBP treasury challans, full amount of PKR 1,750,000 deposited. Summons discharged and show-cause notice withdrawn. Lease restored to normal active standing.",
    order_date: "2026-11-04",
    order_no: "DGM&M/SMA/ORD-2026-085",
    decision_category: "Exonerated/Notice Discharged",
    hearing_status: "Disposed",
    presiding_officer: "Licensing Authority",
    hearing_venue: "Court Room of Licensing Authority, Poonch House, Multan Road, Lahore",
    notice_reference_no: "DGM&M/SMA/H-085/2026",
    created_at: "2026-10-18T12:00:00Z"
  }
];

export const STATUTORY_VIOLATION_GROUNDS = [
  "Non-payment of royalty dues & outstanding surface rent",
  "Unauthorized boundary encroachment outside sanctioned grid",
  "Failure to submit monthly mineral extraction returns (Form-C)",
  "Illegal subletting to unauthorized third-party contractor",
  "Violation of Mine Safety & Environmental Regulations",
  "Non-installation of computerized digital weighbridge at mine exit",
  "Blasting operations within public safety buffer zone",
  "Failure to submit 5-year progressive mine development scheme",
  "Other statutory violation under Punjab Mining Concession Rules 2002"
];

export const HEARING_STAGES = [
  "Initial Appearance / Notice",
  "Reply & Challan Verification",
  "Evidence & Survey Overlay Verification",
  "Final Arguments",
  "Order Announcement / Compliance Verification"
];

export const PUNJAB_MINING_DISTRICTS = [
  "Attock",
  "Chakwal",
  "Dera Ghazi Khan",
  "Jhelum",
  "Khushab",
  "Mianwali",
  "Rahim Yar Khan",
  "Rajanpur",
  "Rawalpindi",
  "Sargodha"
];
