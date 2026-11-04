import { Lease, PersonalHearing } from '../types';
import allLeasesData from './allLeases.json';

// All 1,836 Small Scale Mining concessions from the official Punjab Mines & Minerals dataset
export const INITIAL_LEASES: Lease[] = allLeasesData as Lease[];

// No assumed mock hearings or orders - start empty as user requested
export const INITIAL_HEARINGS: PersonalHearing[] = [];

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
