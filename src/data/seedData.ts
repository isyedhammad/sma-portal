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

// No demo hearings. All hearings will be registered directly by the user.
export const INITIAL_HEARINGS: Hearing[] = [];
