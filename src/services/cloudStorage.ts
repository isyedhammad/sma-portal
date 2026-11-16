import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Lease, Hearing, CloudConfig } from '../types';

let supabaseClient: SupabaseClient | null = null;
let activeConfig: CloudConfig | null = null;

/**
 * Initialize or reconfigure Supabase client
 */
export const initSupabaseClient = (config: CloudConfig): SupabaseClient | null => {
  activeConfig = config;
  if (config.supabaseUrl && config.supabaseAnonKey && config.supabaseUrl.startsWith('http')) {
    try {
      supabaseClient = createClient(config.supabaseUrl, config.supabaseAnonKey, {
        auth: { persistSession: false }
      });
      return supabaseClient;
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      supabaseClient = null;
    }
  } else {
    supabaseClient = null;
  }
  return null;
};

/**
 * Test cloud connection
 */
export const testCloudConnection = async (config: CloudConfig): Promise<{ success: boolean; message: string }> => {
  if (config.provider === 'supabase') {
    if (!config.supabaseUrl || !config.supabaseAnonKey) {
      return { success: false, message: 'Supabase URL and Anon Key are required.' };
    }
    try {
      const client = createClient(config.supabaseUrl, config.supabaseAnonKey, {
        auth: { persistSession: false }
      });
      // Query 1 row from leases
      const { data, error } = await client.from('leases').select('lease_id').limit(1);
      if (error) {
        // Table might not exist yet
        if (error.code === '42P01' || error.message.includes('relation') || error.message.includes('does not exist')) {
          return {
            success: false,
            message: "Connected to Supabase, but the 'leases' table does not exist. Please run the provided SQL schema in your Supabase SQL editor."
          };
        }
        return { success: false, message: `Supabase Error: ${error.message}` };
      }
      return { success: true, message: 'Successfully connected to Supabase cloud database!' };
    } catch (err: any) {
      return { success: false, message: `Connection error: ${err?.message || err}` };
    }
  } else if (config.provider === 'firebase') {
    if (!config.firebaseProjectId) {
      return { success: false, message: 'Firebase Project ID is required.' };
    }
    try {
      // Test Firebase Firestore REST endpoint
      const res = await fetch(`https://firestore.googleapis.com/v1/projects/${config.firebaseProjectId}/databases/(default)/documents/leases?pageSize=1`);
      if (res.ok) {
        return { success: true, message: 'Successfully connected to Firebase Firestore database!' };
      }
      const data = await res.json();
      return { success: false, message: `Firebase error: ${data.error?.message || res.statusText}` };
    } catch (err: any) {
      return { success: false, message: `Firebase connection error: ${err?.message || err}` };
    }
  }

  return { success: true, message: 'Government Cloud Ledger active.' };
};

/**
 * Fetch leases from cloud database (falls back to null if unconfigured)
 */
export const fetchCloudLeases = async (): Promise<Lease[] | null> => {
  if (!supabaseClient) return null;
  try {
    const { data, error } = await supabaseClient
      .from('leases')
      .select('*')
      .order('lease_id', { ascending: true });
    
    if (error) throw error;
    if (data && data.length > 0) {
      return data.map(row => ({
        lease_id: row.lease_id,
        lease_no: row.lease_no || row.lease_id,
        lease_title: row.lease_title,
        lessee_name: row.lessee_name,
        district: row.district,
        mineral: row.mineral,
        status: row.status || 'Active',
        mining_type: row.mining_type || 'ML',
        area_acreage: row.area_acreage ? Number(row.area_acreage) : undefined,
        proprietor_representative: row.proprietor_representative,
        contact_number: row.contact_number,
        grant_date: row.grant_date,
        expiry_date: row.expiry_date,
        annual_rent_pkr: row.annual_rent_pkr ? Number(row.annual_rent_pkr) : undefined,
        created_at: row.created_at
      }));
    }
    return [];
  } catch (err) {
    console.warn('Could not fetch leases from cloud:', err);
    return null;
  }
};

/**
 * Fetch hearings from cloud database
 */
export const fetchCloudHearings = async (): Promise<Hearing[] | null> => {
  if (!supabaseClient) return null;
  try {
    const { data, error } = await supabaseClient
      .from('hearings')
      .select('*')
      .order('hearing_date', { ascending: false });

    if (error) throw error;
    if (data) {
      return data.map(row => ({
        hearing_id: row.hearing_id,
        lease_id: row.lease_id,
        lease_no: row.lease_no || row.lease_id,
        lease_title: row.lease_title,
        lessee_name: row.lessee_name,
        district: row.district,
        mineral: row.mineral,
        hearing_date: row.hearing_date,
        hearing_time: row.hearing_time || '10:30 AM',
        purpose: row.purpose,
        stage: row.stage,
        remarks_orders: row.remarks_orders,
        order_date: row.order_date,
        order_no: row.order_no,
        decision_category: row.decision_category,
        penalty_amount: row.penalty_amount ? Number(row.penalty_amount) : undefined,
        next_hearing_date: row.next_hearing_date,
        next_hearing_time: row.next_hearing_time,
        adjournment_reason: row.adjournment_reason,
        hearing_status: row.hearing_status || 'Scheduled',
        presiding_officer: row.presiding_officer || 'Licensing Authority',
        hearing_venue: row.hearing_venue,
        notice_reference_no: row.notice_reference_no,
        created_at: row.created_at,
        updated_at: row.updated_at
      }));
    }
    return [];
  } catch (err) {
    console.warn('Could not fetch hearings from cloud:', err);
    return null;
  }
};

/**
 * Upsert lease to cloud
 */
export const upsertCloudLease = async (lease: Lease): Promise<boolean> => {
  if (!supabaseClient) return false;
  try {
    const payload = {
      lease_id: lease.lease_id,
      lease_no: lease.lease_no || lease.lease_id,
      lease_title: lease.lease_title,
      lessee_name: lease.lessee_name,
      district: lease.district,
      mineral: lease.mineral,
      status: lease.status,
      mining_type: lease.mining_type || 'ML',
      area_acreage: lease.area_acreage,
      proprietor_representative: lease.proprietor_representative,
      contact_number: lease.contact_number,
      grant_date: lease.grant_date,
      expiry_date: lease.expiry_date,
      annual_rent_pkr: lease.annual_rent_pkr,
      created_at: lease.created_at || new Date().toISOString()
    };
    const { error } = await supabaseClient.from('leases').upsert(payload);
    if (error) throw error;
    return true;
  } catch (err) {
    console.warn('Failed to upsert lease to cloud:', err);
    return false;
  }
};

/**
 * Bulk upsert leases to cloud (for initial seeding or CSV upload)
 */
export const bulkUpsertCloudLeases = async (leases: Lease[]): Promise<boolean> => {
  if (!supabaseClient || leases.length === 0) return false;
  try {
    // Upsert in batches of 200
    const batchSize = 200;
    for (let i = 0; i < leases.length; i += batchSize) {
      const batch = leases.slice(i, i + batchSize).map(l => ({
        lease_id: l.lease_id,
        lease_no: l.lease_no || l.lease_id,
        lease_title: l.lease_title,
        lessee_name: l.lessee_name,
        district: l.district,
        mineral: l.mineral,
        status: l.status,
        mining_type: l.mining_type || 'ML',
        area_acreage: l.area_acreage,
        proprietor_representative: l.proprietor_representative,
        contact_number: l.contact_number,
        grant_date: l.grant_date,
        expiry_date: l.expiry_date,
        annual_rent_pkr: l.annual_rent_pkr
      }));
      const { error } = await supabaseClient.from('leases').upsert(batch);
      if (error) throw error;
    }
    return true;
  } catch (err) {
    console.warn('Failed bulk upsert to cloud:', err);
    return false;
  }
};

/**
 * Upsert hearing to cloud
 */
export const upsertCloudHearing = async (hearing: Hearing): Promise<boolean> => {
  if (!supabaseClient) return false;
  try {
    const payload = {
      hearing_id: hearing.hearing_id,
      lease_id: hearing.lease_id,
      lease_no: hearing.lease_no || hearing.lease_id,
      lease_title: hearing.lease_title,
      lessee_name: hearing.lessee_name,
      district: hearing.district,
      mineral: hearing.mineral,
      hearing_date: hearing.hearing_date,
      hearing_time: hearing.hearing_time,
      purpose: hearing.purpose,
      stage: hearing.stage,
      remarks_orders: hearing.remarks_orders,
      order_date: hearing.order_date,
      order_no: hearing.order_no,
      decision_category: hearing.decision_category,
      penalty_amount: hearing.penalty_amount,
      next_hearing_date: hearing.next_hearing_date,
      next_hearing_time: hearing.next_hearing_time,
      adjournment_reason: hearing.adjournment_reason,
      hearing_status: hearing.hearing_status,
      presiding_officer: hearing.presiding_officer,
      hearing_venue: hearing.hearing_venue,
      notice_reference_no: hearing.notice_reference_no,
      created_at: hearing.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    const { error } = await supabaseClient.from('hearings').upsert(payload);
    if (error) throw error;
    return true;
  } catch (err) {
    console.warn('Failed to upsert hearing to cloud:', err);
    return false;
  }
};

/**
 * Delete hearing from cloud
 */
export const deleteCloudHearing = async (hearing_id: string): Promise<boolean> => {
  if (!supabaseClient) return false;
  try {
    const { error } = await supabaseClient
      .from('hearings')
      .delete()
      .eq('hearing_id', hearing_id);
    if (error) throw error;
    return true;
  } catch (err) {
    console.warn('Failed to delete hearing from cloud:', err);
    return false;
  }
};
