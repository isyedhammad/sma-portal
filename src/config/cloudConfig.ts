import { CloudConfig } from '../types';

const CLOUD_CONFIG_STORAGE_KEY = 'dgmm_sma_cloud_config_v1';

export const DEFAULT_CLOUD_CONFIG: CloudConfig = {
  provider: 'supabase',
  supabaseUrl: (import.meta as any).env?.VITE_SUPABASE_URL || '',
  supabaseAnonKey: (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '',
  firebaseProjectId: (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID || '',
  firebaseApiKey: (import.meta as any).env?.VITE_FIREBASE_API_KEY || ''
};

export const getStoredCloudConfig = (): CloudConfig => {
  try {
    const raw = localStorage.getItem(CLOUD_CONFIG_STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_CLOUD_CONFIG, ...JSON.parse(raw) };
    }
  } catch (err) {
    console.error('Failed to parse stored cloud config', err);
  }
  return DEFAULT_CLOUD_CONFIG;
};

export const saveStoredCloudConfig = (config: CloudConfig): void => {
  try {
    localStorage.setItem(CLOUD_CONFIG_STORAGE_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Failed to save cloud config', err);
  }
};

/**
 * SQL Schema for Supabase Cloud Database setup
 */
export const SUPABASE_SQL_SCHEMA = `-- ==============================================================
-- Directorate General of Mines & Minerals, Government of the Punjab
-- SMA Hearing Management System Schema
-- ==============================================================

-- 1. Leases Table
CREATE TABLE IF NOT EXISTS leases (
  lease_id TEXT PRIMARY KEY,
  lease_no TEXT NOT NULL,
  lease_title TEXT NOT NULL,
  lessee_name TEXT NOT NULL,
  district TEXT NOT NULL,
  mineral TEXT NOT NULL,
  status TEXT DEFAULT 'Active',
  mining_type TEXT DEFAULT 'ML',
  area_acreage NUMERIC,
  proprietor_representative TEXT,
  contact_number TEXT,
  grant_date DATE,
  expiry_date DATE,
  annual_rent_pkr NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Hearings Table (with lease_id foreign key)
CREATE TABLE IF NOT EXISTS hearings (
  hearing_id TEXT PRIMARY KEY,
  lease_id TEXT NOT NULL REFERENCES leases(lease_id) ON DELETE CASCADE,
  lease_no TEXT NOT NULL,
  lease_title TEXT,
  lessee_name TEXT,
  district TEXT,
  mineral TEXT,
  hearing_date DATE NOT NULL,
  hearing_time TEXT,
  purpose TEXT NOT NULL,
  stage TEXT,
  remarks_orders TEXT,
  order_date DATE,
  order_no TEXT,
  decision_category TEXT,
  penalty_amount NUMERIC,
  next_hearing_date DATE,
  next_hearing_time TEXT,
  adjournment_reason TEXT,
  hearing_status TEXT DEFAULT 'Scheduled',
  presiding_officer TEXT DEFAULT 'Licensing Authority',
  hearing_venue TEXT,
  notice_reference_no TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Row Level Security Policies (Permit authenticated or anon web portal access)
ALTER TABLE leases ENABLE ROW LEVEL SECURITY;
ALTER TABLE hearings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read/write on leases" ON leases FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write on hearings" ON hearings FOR ALL TO anon USING (true) WITH CHECK (true);
`;
