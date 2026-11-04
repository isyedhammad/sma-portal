import { Lease, PersonalHearing } from '../types';
import allLeasesData from './allLeases.json';

// All 1,836 Small Scale Mining concessions from the official Punjab Mines & Minerals dataset
export const INITIAL_LEASES: Lease[] = allLeasesData as Lease[];

export const INITIAL_HEARINGS: PersonalHearing[] = [
  // 1. Upcoming Hearings (this week / next week)
  {
    hearing_id: "PH-2026-0042",
    lease_id: "SMA-ATK-0001",
    hearing_date: "2026-11-06T10:30:00",
    notice_issue_date: "2026-10-22",
    notice_reference_no: "DGM&M/SMA/H-104/2026",
    hearing_purpose: "Non-payment of royalty dues",
    specific_allegations: "Default in payment of 3rd quarter royalty dues amounting to PKR 2,450,000 despite statutory demand notice issued by District Mining Officer Attock.",
    presiding_officer: "Director SMA/T - Licensing Authority",
    hearing_venue: "Judicial Bench Chamber, Poonch House, Multan Road, Lahore",
    hearing_status: "Upcoming",
    order_issued: false,
    created_at: "2026-10-22T09:00:00"
  },
  {
    hearing_id: "PH-2026-0043",
    lease_id: "SMA-CKL-0130",
    hearing_date: "2026-11-08T11:30:00",
    notice_issue_date: "2026-10-24",
    notice_reference_no: "DGM&M/SMA/H-105/2026",
    hearing_purpose: "Unauthorized boundary encroachment",
    specific_allegations: "GPS drone verification survey conducted by GIS Cell confirmed open excavation 45 meters beyond approved boundary pillar C-14, encroaching into adjacent reserve forest.",
    presiding_officer: "Director SMA/T - Licensing Authority",
    hearing_venue: "Committee Room No. 2, DGM&M Punjab, Lahore",
    hearing_status: "Upcoming",
    order_issued: false,
    created_at: "2026-10-24T11:00:00"
  },
  {
    hearing_id: "PH-2026-0044",
    lease_id: "SMA-MLI-1311",
    hearing_date: "2026-11-10T14:00:00",
    notice_issue_date: "2026-10-27",
    notice_reference_no: "DGM&M/SMA/H-106/2026",
    hearing_purpose: "Failure to submit monthly production returns",
    specific_allegations: "Non-submission of statutory Form-C monthly mineral extraction returns for June, July, and August 2026, impeding government dispatch verification.",
    presiding_officer: "Director SMA/T - Licensing Authority",
    hearing_venue: "Judicial Bench Chamber, Poonch House, Multan Road, Lahore",
    hearing_status: "Upcoming",
    order_issued: false,
    created_at: "2026-10-27T14:30:00"
  },
  {
    hearing_id: "PH-2026-0045",
    lease_id: "SMA-KHB-0841",
    hearing_date: "2026-11-12T10:00:00",
    notice_issue_date: "2026-10-28",
    notice_reference_no: "DGM&M/SMA/H-107/2026",
    hearing_purpose: "Illegal subletting / unauthorized excavation outside sanctioned grid",
    specific_allegations: "Inspection report by Assistant Director (Technical) reveals lease area sublet to unauthorized third-party contractor without prior sanction of the Competent Authority.",
    presiding_officer: "Director SMA/T - Licensing Authority",
    hearing_venue: "Judicial Bench Chamber, Poonch House, Multan Road, Lahore",
    hearing_status: "Upcoming",
    order_issued: false,
    created_at: "2026-10-28T10:15:00"
  },
  {
    hearing_id: "PH-2026-0046",
    lease_id: "SMA-JLM-0750",
    hearing_date: "2026-11-14T11:00:00",
    notice_issue_date: "2026-10-29",
    notice_reference_no: "DGM&M/SMA/H-108/2026",
    hearing_purpose: "Un-metered extraction & non-installation of weighbridge",
    specific_allegations: "Failure to install calibrated computerized weighbridge integrated with central monitoring portal at salt mine exit.",
    presiding_officer: "Director SMA/T - Licensing Authority",
    hearing_venue: "Judicial Bench Chamber, Poonch House, Multan Road, Lahore",
    hearing_status: "Upcoming",
    order_issued: false,
    created_at: "2026-10-29T11:00:00"
  },

  // 2. Overdue Hearings (Conducted > 7 days ago where order_issued === false) -> TRIGGERS ACTION-REQUIRED BANNER!
  {
    hearing_id: "PH-2026-0038",
    lease_id: "SMA-JLM-0752",
    hearing_date: "2026-10-20T11:00:00", // Conducted 15 days ago! Overdue!
    notice_issue_date: "2026-10-05",
    notice_reference_no: "DGM&M/SMA/H-098/2026",
    hearing_purpose: "Non-compliance with Mine Safety & Environmental Regulations",
    specific_allegations: "Severe slope instability observed at quarry face exceeding permissible 45-degree angle. Failure to provide safety gear and absence of registered mine manager on site.",
    presiding_officer: "Director SMA/T - Licensing Authority",
    hearing_venue: "Judicial Bench Chamber, Poonch House, Multan Road, Lahore",
    hearing_status: "Heard/Under Deliberation",
    order_issued: false,
    created_at: "2026-10-05T09:30:00"
  },
  {
    hearing_id: "PH-2026-0039",
    lease_id: "SMA-RAW-1816",
    hearing_date: "2026-10-23T14:30:00", // Conducted 12 days ago! Overdue!
    notice_issue_date: "2026-10-08",
    notice_reference_no: "DGM&M/SMA/H-099/2026",
    hearing_purpose: "Unauthorized boundary encroachment",
    specific_allegations: "Heavy rock-blasting carried out within 80 meters of public road and power transmission tower, causing serious structural hazard.",
    presiding_officer: "Director SMA/T - Licensing Authority",
    hearing_venue: "Judicial Bench Chamber, Poonch House, Multan Road, Lahore",
    hearing_status: "Heard/Under Deliberation",
    order_issued: false,
    created_at: "2026-10-08T10:00:00"
  },

  // 3. Recently Heard (Conducted 2-3 days ago, order under deliberation)
  {
    hearing_id: "PH-2026-0040",
    lease_id: "SMA-DER-0610",
    hearing_date: "2026-11-02T11:00:00", // Conducted 2 days ago
    notice_issue_date: "2026-10-18",
    notice_reference_no: "DGM&M/SMA/H-102/2026",
    hearing_purpose: "Un-metered extraction & non-installation of weighbridge",
    specific_allegations: "Non-compliance with statutory requirement of digital weighbridge integration with DGM&M central royalty portal.",
    presiding_officer: "Director SMA/T - Licensing Authority",
    hearing_venue: "Committee Room No. 1, DGM&M Punjab, Lahore",
    hearing_status: "Heard/Under Deliberation",
    order_issued: false,
    created_at: "2026-10-18T11:45:00"
  },

  // 4. Concluded & Decided Hearings (With full Orders issued)
  {
    hearing_id: "PH-2026-0035",
    lease_id: "SMA-ATK-0046",
    hearing_date: "2026-10-15T10:00:00",
    notice_issue_date: "2026-09-28",
    notice_reference_no: "DGM&M/SMA/H-092/2026",
    hearing_purpose: "Non-payment of royalty dues",
    specific_allegations: "Accumulated surcharge of PKR 480,000 against late deposition of mineral cess.",
    presiding_officer: "Director SMA/T - Licensing Authority",
    hearing_venue: "Judicial Bench Chamber, Poonch House, Multan Road, Lahore",
    hearing_status: "Decided",
    order_issued: true,
    order_details: {
      order_no: "DGM&M/SMA/ORD-2026-0078",
      order_date: "2026-10-19",
      decision_category: "Penalty Imposed",
      decision_summary: "Penalty of PKR 500,000 imposed under Rule 48 of Punjab Mining Concession Rules 2002. Lessee directed to deposit sum in Government Treasury within 15 days.",
      penalty_amount: 500000,
      compliance_deadline: "2026-11-03",
      order_attachment_name: "Order_Penalty_SMA_ATK_0046.pdf",
      presiding_officer: "Director SMA/T - Licensing Authority",
      attendees: "Mr. Irfan Zafar (Lessee), Mr. Tariq Bashir (Assistant Director Legal)",
      legal_provisions: "Rule 48 read with Section 12 of Punjab Minerals Act",
      dispatched: true
    },
    created_at: "2026-09-28T09:00:00"
  },
  {
    hearing_id: "PH-2026-0036",
    lease_id: "SMA-CKL-0182",
    hearing_date: "2026-10-16T11:30:00",
    notice_issue_date: "2026-10-01",
    notice_reference_no: "DGM&M/SMA/H-094/2026",
    hearing_purpose: "Unauthorized boundary encroachment",
    specific_allegations: "Alleged extraction beyond Western boundary pillar WP-04.",
    presiding_officer: "Director SMA/T - Licensing Authority",
    hearing_venue: "Judicial Bench Chamber, Poonch House, Multan Road, Lahore",
    hearing_status: "Decided",
    order_issued: true,
    order_details: {
      order_no: "DGM&M/SMA/ORD-2026-0080",
      order_date: "2026-10-21",
      decision_category: "Exonerated/Compliance Accepted",
      decision_summary: "Joint demarcation survey by Survey of Pakistan revealed excavation was strictly within permissible 5-meter safety margin. Show-cause notice discharged; lease restored unconditionally.",
      order_attachment_name: "Order_Exoneration_SMA_CKL_0182.pdf",
      presiding_officer: "Director SMA/T - Licensing Authority",
      attendees: "Ch. Nisar Ahmed (Lessee), Survey of Pakistan Official",
      legal_provisions: "Rule 52 of Punjab Mining Concession Rules",
      dispatched: true
    },
    created_at: "2026-10-01T10:30:00"
  },
  {
    hearing_id: "PH-2026-0037",
    lease_id: "SMA-RAJ-1798",
    hearing_date: "2026-10-18T14:00:00",
    notice_issue_date: "2026-10-02",
    notice_reference_no: "DGM&M/SMA/H-096/2026",
    hearing_purpose: "Failure to submit monthly production returns",
    specific_allegations: "Deliberate suppression of gypsum extraction logs.",
    presiding_officer: "Director SMA/T - Licensing Authority",
    hearing_venue: "Committee Room No. 2, DGM&M Punjab, Lahore",
    hearing_status: "Decided",
    order_issued: true,
    order_details: {
      order_no: "DGM&M/SMA/ORD-2026-0082",
      order_date: "2026-10-25",
      decision_category: "Direction Issued",
      decision_summary: "Lessee issued stern warning and directed to submit verified dispatch register attested by Excise & Taxation Department within 10 days, failing which quarry operations will be sealed.",
      compliance_deadline: "2026-11-04",
      order_attachment_name: "Order_Direction_SMA_RAJ_1798.pdf",
      presiding_officer: "Director SMA/T - Licensing Authority",
      attendees: "Mian Khurram Shahzad (Lessee), Inspector of Mines Rajanpur",
      legal_provisions: "Rule 39 read with Section 9",
      dispatched: true
    },
    created_at: "2026-10-02T12:00:00"
  },

  // 5. Adjourned Hearing
  {
    hearing_id: "PH-2026-0041",
    lease_id: "SMA-SAR-1835",
    hearing_date: "2026-11-16T11:00:00",
    notice_issue_date: "2026-10-10",
    notice_reference_no: "DGM&M/SMA/H-100/2026",
    hearing_purpose: "Failure to submit annual mine development scheme",
    specific_allegations: "Failure to submit mandatory 5-year progressive quarry rehabilitation and reclamation plan.",
    presiding_officer: "Director SMA/T - Licensing Authority",
    hearing_venue: "Judicial Bench Chamber, Poonch House, Multan Road, Lahore",
    hearing_status: "Adjourned",
    order_issued: false,
    adjournment_history: [
      {
        adjourned_from: "2026-10-25T11:00:00",
        adjourned_to: "2026-11-16T11:00:00",
        reason: "Counsel for Lessee submitted medical certificate and requested 3-week adjournment to prepare technical drawings.",
        recorded_at: "2026-10-25T11:30:00"
      }
    ],
    created_at: "2026-10-10T10:00:00"
  }
];

export const STATUTORY_VIOLATION_GROUNDS = [
  "Non-payment of royalty dues",
  "Unauthorized boundary encroachment",
  "Failure to submit monthly production returns",
  "Illegal subletting / unauthorized excavation outside sanctioned grid",
  "Non-compliance with Mine Safety & Environmental Regulations",
  "Un-metered extraction & non-installation of weighbridge",
  "Excavation within 100 meters of public infrastructure / canal bund",
  "Failure to submit annual mine development scheme",
  "Other statutory violation under Punjab Mining Concession Rules"
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
